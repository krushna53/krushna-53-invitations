"use client";
import { useEffect, useState } from "react";
import s from "./CountdownSection.module.css";
import { Reveal, Section, SectionHeading } from "./shared";

function remaining(target) {
  const ms = Math.max(0, new Date(target).getTime() - Date.now());
  return { ms, days: Math.floor(ms / 86400000), hours: Math.floor(ms / 3600000) % 24, minutes: Math.floor(ms / 60000) % 60, seconds: Math.floor(ms / 1000) % 60 };
}

/** Live countdown to `date` (ISO string). Renders placeholders until mounted to avoid hydration mismatch. */
export default function CountdownSection({ id = "countdown", eyebrow = "The big day", title = "Counting Down to Forever", date, image, doneText = "Today is the day!", labels = ["Days", "Hours", "Minutes", "Seconds"] }) {
  const [left, setLeft] = useState(null);
  useEffect(() => {
    const tick = () => setLeft(remaining(date));
    tick();
    const t = window.setInterval(tick, 1000);
    return () => window.clearInterval(t);
  }, [date]);
  const values = left ? [left.days, left.hours, left.minutes, left.seconds] : [null, null, null, null];

  return <Section id={id} tone="dark" className={s.section} label="Countdown" background={image && <img className={s.bg} src={image} alt="" aria-hidden="true" loading="lazy" />}>
    <SectionHeading eyebrow={eyebrow} title={title} />
    {left && left.ms === 0
      ? <p className={s.done}>{doneText}</p>
      : <div className={s.grid} role="timer" aria-live="off">
        {labels.map((label, i) => <Reveal key={label} className={s.unit} delay={i * 90}>
          <span className={s.value}>{values[i] === null ? "--" : String(values[i]).padStart(2, "0")}</span>
          <span className={s.label}>{label}</span>
        </Reveal>)}
      </div>}
  </Section>;
}
