"use client";
import { useRef, useState } from "react";
import s from "./EnvelopeIntro.module.css";
import WaxSeal from "./WaxSeal";
import { useT } from "./i18n";

// timing follows the reference film: the seal warms up, light leaks along the seams, then the top flap lifts
const GLOW_MS = 1300;
const LEAK_MS = 900;
const OPEN_MS = 1800;

/**
 * Full-screen embossed envelope sealed with wax, the flaps meeting at the centre.
 * Tap the seal (or anywhere): the seal glows, golden light leaks along the top seams,
 * then the top flap lifts with the seal and the invitation fades in.
 * onOpen runs on the tap (so music can start); onDone runs once it has opened.
 * videoSrc: optional envelope-opening film (one you have the rights to). It sits paused on its
 * first frame, plays on tap, and the invitation fades in when it ends — instead of the drawn envelope.
 */
export default function EnvelopeIntro({ monogram = "A & M", videoSrc, onOpen, onDone }) {
  const t = useT();
  const [phase, setPhase] = useState("closed"); // closed → glow → leak → open → done
  const started = useRef(false);
  const video = useRef(null);

  const finish = () => { setPhase("done"); onDone?.(); };

  const open = () => {
    if (started.current) return;
    started.current = true;
    onOpen?.();
    if (videoSrc && video.current) {
      setPhase("playing");
      video.current.play().catch(finish); // if it cannot play, just reveal the invitation
      return;
    }
    setPhase("glow");
    window.setTimeout(() => setPhase("leak"), GLOW_MS);
    window.setTimeout(() => setPhase("open"), GLOW_MS + LEAK_MS);
    window.setTimeout(finish, GLOW_MS + LEAK_MS + OPEN_MS);
  };

  if (videoSrc) {
    return <div className={s.stage} data-phase={phase} onClick={open} aria-hidden={phase === "done"}>
      <video ref={video} className={s.video} src={videoSrc} muted playsInline preload="auto" onEnded={finish} aria-label={t("tapSeal")} />
      <p className={s.hint}>{t("tapSeal")}</p>
    </div>;
  }

  return <div className={s.stage} data-phase={phase} onClick={open} aria-hidden={phase === "done"}>
    <div className={s.light} />
    <div className={`${s.fw} ${s.bottom}`}><div className={s.flap} /></div>
    <div className={`${s.fw} ${s.left}`}><div className={s.flap} /></div>
    <div className={`${s.fw} ${s.right}`}><div className={s.flap} /></div>
    <div className={`${s.fw} ${s.top}`}><div className={s.flap} /></div>
    <svg className={s.seams} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path className={s.seamTop} d="M0 0 L50 50 L100 0" />
      <path className={s.seamBottom} d="M0 100 L50 50 L100 100" />
    </svg>
    <div className={s.sealWrap}>
      <WaxSeal label={monogram} size={104} glow={phase !== "closed"} ariaLabel={t("tapSeal")} onClick={(e) => { e.stopPropagation(); open(); }} />
    </div>
    <p className={s.hint}>{t("tapSeal")}</p>
  </div>;
}
