import s from "./DemoBar.module.css";

/** Small floating brand pill shown on demo pages. Leave it out on a real couple's site. */
export default function DemoBar({ brandName = "EveryMoment", logo = "/everymoment-icon.svg", homeHref = "/", label = "Sample wedding website", ctaLabel = "Get yours", ctaHref = "/wedding-websites" }) {
  return <div className={s.bar}>
    <a className={s.brand} href={homeHref}>{logo && <img src={logo} alt="" />}<b>{brandName}</b></a>
    <span className={s.label}>{label}</span>
    <a className={s.cta} href={ctaHref}>{ctaLabel}</a>
  </div>;
}
