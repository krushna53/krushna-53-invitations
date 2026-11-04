import s from "./InviteCard.module.css";

// "garden": cream watercolour paper, gold script, maroon accents (the wax-seal envelope look)
const GARDEN = {
  "--inv-ink": "#76604b",
  "--inv-accent": "#a8823e",
  "--inv-accent-bright": "#c9a45c",
  "--inv-accent-soft": "#f3e7cc",
  "--inv-muted": "#8f7c66",
  "--inv-line": "#e3d3b0",
  "--inv-surface": "#fffaf0",
  "--inv-deep": "#6b1d24",
  "--inv-deep-2": "#93323b",
  "--inv-bg": "#f7efe1",
  "--inv-script": '"Pinyon Script", "Great Vibes", "Tiro Devanagari Hindi", "Nirmala UI", "Noto Sans Gujarati", cursive',
  "--inv-caps": '"Cormorant Garamond", "Tiro Devanagari Hindi", "Nirmala UI", "Noto Sans Gujarati", Georgia, serif',
};

/**
 * Card look for a full-width page: `hero` on top, then every section on one continuous paper,
 * and the `footer` below. Sections pick up their paper styles from data-theme="linen".
 * variant: "linen" (floral vines, sage) or "garden" (watercolour cream, gold, torn-paper dividers).
 * caption: small note at the very end.
 */
export default function InviteCard({ hero, footer, caption, variant = "linen", children }) {
  return <div className={s.page} data-theme="linen" data-variant={variant} style={variant === "garden" ? GARDEN : undefined}>
    {hero}
    {variant === "garden" && <>
      {/* bouquets spilling over the bottom corners of the hero arch */}
      <span className={`${s.heroFlower} ${s.heroFlowerL}`} aria-hidden="true" />
      <span className={`${s.heroFlower} ${s.heroFlowerR}`} aria-hidden="true" />
    </>}
    <div className={s.paper}>
      <span className={`${s.corner} ${s.tl}`} aria-hidden="true" />
      <span className={`${s.corner} ${s.tr}`} aria-hidden="true" />
      <div className={s.content}>{children}</div>
      <span className={`${s.corner} ${s.bl}`} aria-hidden="true" />
      <span className={`${s.corner} ${s.br}`} aria-hidden="true" />
    </div>
    {footer}
    {caption && <p className={s.caption}>{caption}</p>}
  </div>;
}
