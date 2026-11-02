"use client";
import s from "./ClosingSection.module.css";
import { Ornament, Reveal, Section } from "./shared";

/**
 * Thank-you ending with family contacts and an optional "made with" footer.
 * contacts: [{ label, name, phone }]
 * brand: { name, logo, href, ctaLabel, ctaHref } — pass null to hide the footer.
 */
export default function ClosingSection({ id = "thank-you", message, thanks = "Thank you", names, hashtag, image, contacts = [], brand }) {
  return <>
    <Section id={id} tone="dark" className={s.section} label="Thank you" background={image && <img className={s.bg} src={image} alt="" aria-hidden="true" loading="lazy" />}>
      <div className={s.content}>
        {message && <Reveal as="p" className={s.message}>{message}</Reveal>}
        <Reveal as="p" className={s.thanks} delay={120}>{thanks}</Reveal>
        <Ornament />
        {names && <Reveal as="p" className={s.names} delay={200}>{names}</Reveal>}
        {hashtag && <Reveal as="p" className={s.tag} delay={260}>{hashtag}</Reveal>}
        {contacts.length > 0 && <Reveal as="ul" className={s.contacts} delay={320}>
          {contacts.map((c) => <li key={c.phone}>{c.label}<a href={`tel:${c.phone.replace(/\s/g, "")}`}>{c.name} · {c.phone}</a></li>)}
        </Reveal>}
      </div>
    </Section>
    {brand && <footer className={s.footer}>
      <a className={s.brand} href={brand.href ?? "/"}>{brand.logo && <img src={brand.logo} alt="" />}<span>Made with ♥ by <b>{brand.name}</b></span></a>
      {brand.ctaHref && <a className={s.cta} href={brand.ctaHref}>{brand.ctaLabel ?? "Create yours"}</a>}
    </footer>}
  </>;
}
