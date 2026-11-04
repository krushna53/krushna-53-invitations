import s from "./WaxSeal.module.css";

/**
 * Maroon wax seal with an embossed label (initials, or "RSVP" with `caps`).
 * With onClick it renders as a button. glow: pulsing golden glow (used while an envelope opens).
 */
export default function WaxSeal({ label, size = 96, caps = false, glow = false, onClick, ariaLabel, className }) {
  const cls = [s.seal, caps && s.caps, glow && s.glow, onClick && s.clickable, className].filter(Boolean).join(" ");
  const style = { "--size": `${size}px` };
  const inner = <>
    <span className={s.drip} aria-hidden="true" />
    <span className={s.wax} aria-hidden="true" />
    <span className={s.ring} aria-hidden="true" />
    <span className={s.label}>{label}</span>
  </>;
  return onClick
    ? <button type="button" className={cls} style={style} onClick={onClick} aria-label={ariaLabel ?? label}>{inner}</button>
    : <span className={cls} style={style}>{inner}</span>;
}
