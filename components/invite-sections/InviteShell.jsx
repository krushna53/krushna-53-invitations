import s from "./InviteShell.module.css";

/**
 * Wraps an invitation page and provides the brand tokens every section reads.
 * theme: optional CSS-variable overrides, e.g. { "--inv-accent": "#b8860b" }
 * locked: stops page scroll (used while the intro cover is showing).
 */
export default function InviteShell({ theme, locked = false, className, children }) {
  const cls = [s.shell, locked && s.locked, className].filter(Boolean).join(" ");
  return <div className={cls} style={theme}>{children}</div>;
}
