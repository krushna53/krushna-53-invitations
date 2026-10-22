"use client";

import { useEffect, useRef, useState } from "react";
import type { InviteDesign, InviteDetails } from "@/lib/invite-design";
import { VIDEO_SECONDS } from "@/lib/invite-design";
import { InviteRenderer, ensureFonts, loadImage } from "@/lib/renderer";

type Props = {
  design: InviteDesign;
  details: InviteDetails;
  mode: "card" | "video";
  playing: boolean;
  /** Increment to restart playback from the beginning. */
  restartKey?: number;
  music?: AudioBuffer | null;
  muted?: boolean;
  loop?: boolean;
  onEnded?: () => void;
  className?: string;
};

const imageCache = new Map<string, Promise<HTMLImageElement>>();
export function cachedImage(src: string) {
  if (!imageCache.has(src)) imageCache.set(src, loadImage(src));
  return imageCache.get(src)!;
}

export function useInviteImages(design: InviteDesign, details: InviteDetails) {
  const artSrc = design.background.kind === "image" ? design.background.src : "";
  const photoSrc = details.couplePhoto ?? "";
  const [images, setImages] = useState<{ art: HTMLImageElement | null; photo: HTMLImageElement | null; key: string }>({ art: null, photo: null, key: "" });
  useEffect(() => {
    let alive = true;
    const key = `${artSrc}|${photoSrc}`;
    Promise.all([artSrc ? cachedImage(artSrc).catch(() => null) : null, photoSrc ? cachedImage(photoSrc).catch(() => null) : null]).then(([art, photo]) => {
      if (alive) setImages({ art, photo, key });
    });
    return () => { alive = false; };
  }, [artSrc, photoSrc]);
  return images;
}

export default function InviteCanvas({ design, details, mode, playing, restartKey = 0, music, muted, loop = true, onEnded, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<InviteRenderer | null>(null);
  const images = useInviteImages(design, details);
  const [fontsReady, setFontsReady] = useState(false);
  const audioRef = useRef<{ ctx: AudioContext; src: AudioBufferSourceNode | null } | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    rendererRef.current = new InviteRenderer(canvasRef.current);
    // handy for debugging / automated previews: window.__inviteRenderer.draw(seconds)
    (window as unknown as { __inviteRenderer?: InviteRenderer }).__inviteRenderer = rendererRef.current;
  }, []);

  useEffect(() => {
    let alive = true;
    setFontsReady(false);
    ensureFonts(design).then(() => alive && setFontsReady(true));
    return () => { alive = false; };
  }, [design.fonts]); // eslint-disable-line react-hooks/exhaustive-deps

  // keep renderer input current
  const r = rendererRef.current;
  if (r) r.setInput({ design, details, art: images.art, photo: images.photo });

  // static card / paused video
  useEffect(() => {
    const rr = rendererRef.current;
    if (!rr || (mode === "video" && playing)) return;
    rr.setInput({ design, details, art: images.art, photo: images.photo });
    if (mode === "card") rr.draw(VIDEO_SECONDS, { still: true });
    else rr.draw(VIDEO_SECONDS - 1.2);
  }, [design, details, images, mode, playing, fontsReady]);

  // animation loop
  useEffect(() => {
    if (mode !== "video" || !playing) return;
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
      let t = (performance.now() - start) / 1000;
      if (t > VIDEO_SECONDS + 0.8) {
        if (!loop) { rendererRef.current?.draw(VIDEO_SECONDS - 0.01); onEnded?.(); return; }
        start = performance.now();
        t = 0;
        startAudio();
      }
      rendererRef.current?.draw(Math.min(t, VIDEO_SECONDS - 0.01));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); stopAudio(); };
  }, [mode, playing, restartKey, music, muted, loop]); // eslint-disable-line react-hooks/exhaustive-deps

  return <canvas ref={canvasRef} className={className} aria-label={`${details.title} invitation for ${details.brideName} and ${details.groomName}`} />;
}
