// Frame-accurate video export: every frame is drawn by the same renderer and
// encoded with WebCodecs (via Mediabunny) into an MP4 that plays on WhatsApp/Instagram.
import { InviteRenderer, type RenderInput, ensureFonts } from "./renderer";
import { VIDEO_SECONDS } from "./invite-design";
import { ReelRenderer, type ReelInput } from "./reels";

export type ExportResult = { blob: Blob; ext: "mp4" | "webm" };
type Drawable = { canvas: HTMLCanvasElement; draw: (t: number) => void };
type Opts = { fps?: number; signal?: AbortSignal };

export async function exportInviteVideo(input: RenderInput, audio: AudioBuffer | null, onProgress: (p: number) => void, opts: Opts = {}) {
  await ensureFonts(input.design);
  const renderer = new InviteRenderer(document.createElement("canvas"));
  renderer.setInput(input);
  return exportFrames({ canvas: renderer.canvas, draw: (t) => renderer.draw(t) }, VIDEO_SECONDS, audio, onProgress, opts);
}

export async function exportReelVideo(input: ReelInput, audio: AudioBuffer | null, onProgress: (p: number) => void, opts: Opts = {}) {
  await ensureFonts(input.design);
  const renderer = new ReelRenderer(document.createElement("canvas"));
  renderer.setInput(input);
  return exportFrames({ canvas: renderer.canvas, draw: (t) => renderer.draw(t) }, renderer.duration, audio, onProgress, opts);
}

export async function exportFrames(target: Drawable, seconds: number, audio: AudioBuffer | null, onProgress: (p: number) => void, opts: Opts = {}): Promise<ExportResult> {
  const fps = opts.fps ?? 30;
  const { canvas } = target;
  const mb = await import("mediabunny");
  const width = canvas.width, height = canvas.height;
  const videoCodec = await mb.getFirstEncodableVideoCodec(["avc", "vp9", "av1"], { width, height, frameRate: fps });
  if (!videoCodec) return recordRealtime(target, seconds, audio, onProgress, fps);

  const output = new mb.Output({ format: new mb.Mp4OutputFormat({ fastStart: "in-memory" }), target: new mb.BufferTarget() });
  const video = new mb.CanvasSource(canvas, { codec: videoCodec, bitrate: 9_000_000, keyFrameInterval: 2 });
  output.addVideoTrack(video, { frameRate: fps });

  let audioSource: InstanceType<typeof mb.AudioBufferSource> | null = null;
  if (audio) {
    const audioCodec = await mb.getFirstEncodableAudioCodec(["aac", "opus"], { numberOfChannels: audio.numberOfChannels, sampleRate: audio.sampleRate });
    if (audioCodec) {
      audioSource = new mb.AudioBufferSource({ codec: audioCodec, quality: mb.QUALITY_HIGH });
      output.addAudioTrack(audioSource);
    }
  }
  await output.start();
  if (audioSource && audio) await audioSource.add(audio);

  const frames = Math.round(seconds * fps);
  for (let f = 0; f < frames; f++) {
    if (opts.signal?.aborted) { await output.cancel(); throw new DOMException("Export cancelled", "AbortError"); }
    const t = f / fps;
    target.draw(t);
    await video.add(t, 1 / fps);
    if (f % 5 === 0) {
      onProgress(f / frames);
      await new Promise((r) => setTimeout(r, 0));
    }
  }
  video.close();
  audioSource?.close();
  await output.finalize();
  onProgress(1);
  const buffer = (output.target as InstanceType<typeof mb.BufferTarget>).buffer!;
  return { blob: new Blob([buffer], { type: "video/mp4" }), ext: "mp4" };
}

/** Fallback for browsers without WebCodecs: record the canvas in real time. */
async function recordRealtime(target: Drawable, seconds: number, audio: AudioBuffer | null, onProgress: (p: number) => void, fps: number): Promise<ExportResult> {
  const stream = target.canvas.captureStream(fps);
  let actx: AudioContext | null = null;
  if (audio) {
    actx = new AudioContext();
    const dest = actx.createMediaStreamDestination();
    const src = actx.createBufferSource();
    src.buffer = audio;
    src.connect(dest);
    src.start();
    dest.stream.getAudioTracks().forEach((track) => stream.addTrack(track));
  }
  const types = ["video/mp4;codecs=avc1", "video/mp4", "video/webm;codecs=vp9,opus", "video/webm"];
  const mimeType = types.find((m) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(m));
  if (!mimeType) throw new Error("Video export is not supported in this browser. Please try Chrome or Edge.");
  const rec = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8_000_000 });
  const chunks: Blob[] = [];
  rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
  const done = new Promise<void>((resolve) => (rec.onstop = () => resolve()));
  rec.start(250);
  const t0 = performance.now();
  await new Promise<void>((resolve) => {
    const tick = () => {
      const t = (performance.now() - t0) / 1000;
      target.draw(Math.min(t, seconds));
      onProgress(t / seconds);
      if (t < seconds) requestAnimationFrame(tick);
      else resolve();
    };
    tick();
  });
  rec.stop();
  await done;
  await actx?.close();
  const ext = mimeType.startsWith("video/mp4") ? "mp4" : "webm";
  return { blob: new Blob(chunks, { type: mimeType.split(";")[0] }), ext };
}
