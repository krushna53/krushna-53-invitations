"use client";
import s from "./TextSection.module.css";
import { Reveal, Section, SectionHeading } from "./shared";

/** A heading with one short paragraph, e.g. dress code or gift preference. */
export default function TextSection({ id, eyebrow, title, text, tone = "light" }) {
  if (!text) return null;
  return <Section id={id} tone={tone} narrow label={title}>
    <SectionHeading eyebrow={eyebrow} title={title} />
    <Reveal as="p" className={s.text}>{text}</Reveal>
  </Section>;
}
