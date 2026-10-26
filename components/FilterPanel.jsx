"use client";
import { useEffect, useState } from "react";

/**
 * Shop-style filters: a panel on the left on desktop, a "Filters" button with a
 * bottom sheet on phones. groups = [{ id, title, value, onChange, options: [{ id, label, count? }] }]
 */
export default function FilterPanel({ groups, resultLabel }) {
    const [open, setOpen] = useState(false);
    const [openGroup, setOpenGroup] = useState(null);
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        if (!open)
            return;
        const close = (e) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", close);
        return () => { window.removeEventListener("keydown", close); document.body.style.overflow = ""; };
    }, [open]);
    const active = groups.filter((g) => g.value !== "all");
    const reset = () => groups.forEach((g) => g.onChange("all"));
    const renderGroups = (variant) => groups.map((g) => {
        const expanded = openGroup === g.id;
        const panelId = `fp-${variant}-${g.id}`;
        return (<section key={g.id} className={`fp-group${expanded ? " expanded" : ""}`}>
          <button type="button" className="fp-group-toggle" aria-expanded={expanded} aria-controls={panelId} onClick={() => setOpenGroup(expanded ? null : g.id)}>
            <span>{g.title}</span><span className="fp-chevron" aria-hidden="true">⌄</span>
          </button>
          {expanded && <div id={panelId} className="fp-options">
            {g.options.map((o) => (<label key={o.id} className={`fp-opt${g.value === o.id ? " on" : ""}`}>
                <input type="radio" name={`fp-${variant}-${g.id}`} checked={g.value === o.id} onChange={() => g.onChange(o.id)}/>
                <span>{o.label}</span>
                {o.count !== undefined && <small>{o.count}</small>}
              </label>))}
          </div>}
        </section>);
    });
    return (<>
      <aside className="fp-panel" aria-label="Filters">
        <div className="fp-head"><b>Filters</b>{active.length > 0 && <button type="button" onClick={reset}>Clear all</button>}</div>
        {renderGroups("desktop")}
      </aside>
      <div className="fp-mobilebar">
        <button type="button" className="fp-open" onClick={() => setOpen(true)} aria-expanded={open}>
          <span aria-hidden="true">☰</span> Filters{active.length ? ` (${active.length})` : ""}
        </button>
        <span className="fp-count">{resultLabel}</span>
      </div>
      {open && (<div className="fp-sheet-wrap" role="dialog" aria-modal="true" aria-label="Filters" onClick={() => setOpen(false)}>
          <div className="fp-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="fp-head"><b>Filters</b><button type="button" onClick={reset}>Clear all</button></div>
            <div className="fp-sheet-body">{renderGroups("mobile")}</div>
            <button type="button" className="fp-done" onClick={() => setOpen(false)}>Show {resultLabel}</button>
          </div>
        </div>)}
    </>);
}
