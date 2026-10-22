"use client";

import { useEffect, useRef, useState } from "react";
import { wordingFor } from "@/lib/designs";
import type { InviteDesign, InviteDetails } from "@/lib/invite-design";
import { ReelRenderer, defaultJourney, reelDesign, type ReelTemplate } from "@/lib/reels";
import { ensureFonts, loadImage, renderStill } from "@/lib/renderer";

const cache = new Map<string, string>();
let queue: Promise<unknown> = Promise.resolve();

export function photoFingerprint(src?: string) {
  if (!src) return "no-photo";
  let hash = 2166136261;
  for (let i = 0; i < src.length; i += 97) hash = Math.imul(hash ^ src.charCodeAt(i), 16777619);
  return `${src.length}-${(hash >>> 0).toString(36)}`;
}

function shrink(c: HTMLCanvasElement, width = 300) {
  const out = document.createElement("canvas");
  out.width = width;
  out.height = Math.round((width / c.width) * c.height);
  out.getContext("2d")!.drawImage(c, 0, 0, out.width, out.height);
  return out.toDataURL("image/jpeg", 0.82);
}

function enqueue(key: string, make: () => Promise<HTMLCanvasElement>) {
  const hit = cache.get(key);
  if (hit) return Promise.resolve(hit);
  const job = queue.then(async () => {
    if (cache.has(key)) return cache.get(key)!;
    const url = shrink(await make());
    cache.set(key, url);
    await new Promise((r) => setTimeout(r, 0));
    return url;
  });
  queue = job.catch(() => undefined);
  return job;
}

export function cardThumbJob(design: InviteDesign, details: InviteDetails) {
  const w = wordingFor(design);
  return async () => {
    const photo = details.couplePhoto ? await loadImage(details.couplePhoto).catch(() => null) : null;
    return renderStill({ design, details: { ...details, ...w }, photo });
  };
}

export function reelThumbJob(tpl: ReelTemplate, details: InviteDetails) {
  return async () => {
    const design = reelDesign(tpl);
    await ensureFonts(design);
    const c = document.createElement("canvas");
    const r = new ReelRenderer(c);
    r.setInput({
      kind: tpl.kind, design, details: { ...details, ...wordingFor(design), couplePhoto: undefined },
      events: defaultJourney(tpl.journey ?? [tpl.event], details.date, details.venue), photos: [],
    });
    r.draw(r.posterTime);
    return c;
  };
}

export default function Thumb({ cacheKey, make, alt, className }: { cacheKey: string; make: () => Promise<HTMLCanvasElement>; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [src, setSrc] = useState(() => cache.get(cacheKey) ?? "");
  useEffect(() => {
    setSrc(cache.get(cacheKey) ?? "");
    const el = ref.current;
    if (!el || cache.has(cacheKey)) return;
    let alive = true;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        enqueue(cacheKey, make).then((url) => alive && setSrc(url)).catch(() => undefined);
      }
    }, { rootMargin: "300px" });
    io.observe(el);
    return () => { alive = false; io.disconnect(); };
  }, [cacheKey]); // eslint-disable-line react-hooks/exhaustive-deps
  return <div ref={ref} className={`thumb ${className ?? ""}`}>{src ? <img src={src} alt={alt} /> : <span className="thumb-skeleton" />}</div>;
}
