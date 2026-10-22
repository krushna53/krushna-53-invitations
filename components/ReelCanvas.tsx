"use client";

import { useEffect, useRef, useState } from "react";
import { cachedImage, useInviteImages } from "@/components/InviteCanvas";
import type { InviteDesign, InviteDetails } from "@/lib/invite-design";
import { ReelRenderer, type ReelEvent, type ReelInput, type ReelKind } from "@/lib/reels";
import { ensureFonts } from "@/lib/renderer";

type Props = {
  kind: ReelKind;
  design: InviteDesign;
  details: InviteDetails;
  events: ReelEvent[];
  photoSrcs: string[];
  playing: boolean;
  restartKey?: number;
  music?: AudioBuffer | null;
  muted?: boolean;
  loop?: boolean;
  onEnded?: () => void;
  className?: string;
};

export function usePhotoImages(srcs: string[]) {
  const [imgs, setImgs] = useState<HTMLImageElement[]>([]);
  const key = srcs.join("|");
  useEffect(() => {
    let alive = true;
    Promise.all(srcs.map((s) => cachedImage(s).catch(() => null))).then((list) => alive && setImgs(list.filter(Boolean) as HTMLImageElement[]));
    return () => { alive = false; };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return imgs;
}

export function useReelInput(p: Pick<Props, "kind" | "design" | "details" | "events" | "photoSrcs">): ReelInput {
  const images = useInviteImages(p.design, p.details);
  const photos = usePhotoImages(p.photoSrcs);
  return { kind: p.kind, design: p.design, details: p.details, events: p.events, photos, art: images.art, photo: images.photo };
}

export default function ReelCanvas(props: Props) {
  const { playing, restartKey = 0, music, muted, loop = true, onEnded, className } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<ReelRenderer | null>(null);
  const input = useReelInput(props);
  const [fontsReady, setFontsReady] = useState(false);
  const audioRef = useRef<{ ctx: AudioContext; src: AudioBufferSourceNode | null } | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    rendererRef.current = new ReelRenderer(canvasRef.current);
    (window as unknown as { __reelRenderer?: ReelRenderer }).__reelRenderer = rendererRef.current;
  }, []);

  useEffect(() => {
    let alive = true;
    setFontsReady(false);
    ensureFonts(props.design).then(() => alive && setFontsReady(true));
    return () => { alive = false; };
  }, [props.design.fonts]); // eslint-disable-line react-hooks/exhaustive-deps

  rendererRef.current?.setInput(input);

  // paused: show a poster frame
  useEffect(() => {
    const r = rendererRef.current;
    if (!r || playing) return;
    r.setInput(input);
    r.draw(r.posterTime);
  }, [input, playing, fontsReady]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const r = rendererRef.current;
    if (!playing || !r) return;
    let raf = 0;
    let start = performance.now();
    const stopAudio = () => {
      try { audioRef.current?.src?.stop(); } catch { /* already stopped */ }
      if (audioRef.current) audioRef.current.src = null;
    };
    const startAudio = () => {
      stopAudio();
      if (!music || muted) return;
      if (!audioRef.current) audioRef.current = { ctx: new AudioContext(), src: null };
      const a = audioRef.current;
      void a.ctx.resume();
      const src = a.ctx.createBufferSource();
      src.buffer = music;
      src.connect(a.ctx.destination);
      src.start();
      a.src = src;
    };
    startAudio();
    const tick = () => {
      const d = r.duration;
      let t = (performance.now() - start) / 1000;
      if (t > d + 0.6) {
        if (!loop) { r.draw(d - 0.01); onEnded?.(); return; }
        start = performance.now();
        t = 0;
        startAudio();
      }
      r.draw(Math.min(t, d - 0.01));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); stopAudio(); };
  }, [playing, restartKey, music, muted, loop]); // eslint-disable-line react-hooks/exhaustive-deps

  return <canvas ref={canvasRef} className={className} aria-label={`${props.details.title} reel for ${props.details.brideName} and ${props.details.groomName}`} />;
}
