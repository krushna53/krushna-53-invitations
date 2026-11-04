"use client";
import { useEffect, useRef, useState } from "react";
import s from "./ProgramTimelineSection.module.css";
import { Icon, Reveal, Section, SectionHeading, cx } from "./shared";

/**
 * Order of the day. items: [{ time, title, detail, icon }]
 * traveler: a rose that slides down the line as the guest scrolls, filling the line behind it.
 */
export default function ProgramTimelineSection({ id = "program", eyebrow = "The wedding day", title = "Program Timeline", subtitle, items = [], tone = "cream", traveler = false }) {
  const list = useRef(null);
  const [reached, setReached] = useState(-1);

  useEffect(() => {
    if (!traveler || !list.current) return;
    const el = list.current;
    let frame = 0;
    const update = () => {
      frame = 0;
      const box = el.getBoundingClientRect();
      // the rose sits where the middle of the screen crosses the list
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.55 - box.top) / box.height));
      el.style.setProperty("--p", p.toFixed(4));
      const rows = [...el.children].filter((c) => c.tagName === "LI");
      const y = box.top + p * box.height;
      setReached(rows.reduce((n, row, i) => (row.getBoundingClientRect().top + row.offsetHeight / 2 <= y + 1 ? i : n), -1));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [traveler, items.length]);

  return <Section id={id} tone={tone} label="Program timeline">
    <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
    <ol ref={list} className={cx(s.list, traveler && s.travel)}>
      {traveler && <span className={s.traveler} aria-hidden="true" />}
      {items.map((item, i) => <Reveal as="li" key={`${item.time}-${item.title}`} className={cx(s.item, i <= reached && s.reached)} delay={i * 70}>
        <span className={s.dot}><Icon name={item.icon ?? "heart"} size={16} /></span>
        <span className={s.time}>{item.time}</span>
        <div className={s.body}><h3>{item.title}</h3>{item.detail && <p>{item.detail}</p>}</div>
      </Reveal>)}
    </ol>
  </Section>;
}
