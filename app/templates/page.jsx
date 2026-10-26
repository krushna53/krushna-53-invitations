"use client";
import { useEffect, useMemo, useState } from "react";
import InviteCanvas from "@/components/InviteCanvas";
import Thumb, { cardThumbJob, photoFingerprint } from "@/components/Thumb";
import FilterPanel from "@/components/FilterPanel";
import { ColorwayDots, SiteFooter, SiteHeader, readSavedDetails } from "@/components/ui";
import { DEMO_DETAILS, EVENT_ORDER, EVENT_PRESETS } from "@/lib/invite-design";
import { wordingFor } from "@/lib/designs";
import { REGIONAL_CULTURES } from "@/lib/regional-templates";
import { CARD_TEMPLATES, readUserTemplateCards, templateDesign } from "@/lib/templates";
export default function TemplatesPage() {
    const [details, setDetails] = useState(DEMO_DETAILS);
    const [event, setEvent] = useState("all");
    const [culture, setCulture] = useState("all");
    const [style, setStyle] = useState("all");
    const [colorways, setColorways] = useState({});
    const [preview, setPreview] = useState(null);
    const [userTemplates, setUserTemplates] = useState([]);
    const [savedNotice, setSavedNotice] = useState("");
    useEffect(() => {
        setUserTemplates(readUserTemplateCards());
        try {
            const savedName = sessionStorage.getItem("krushna53-template-saved-notice");
            if (savedName) {
                setSavedNotice(`“${savedName}” was added to Templates.`);
                sessionStorage.removeItem("krushna53-template-saved-notice");
            }
        }
        catch { /* session storage may be unavailable */ }
        const d = readSavedDetails();
        if (d?.brideName)
            setDetails(d);
        const e = new URLSearchParams(window.location.search).get("event");
        if (e && EVENT_ORDER.includes(e))
            setEvent(e);
        const savedCulture = new URLSearchParams(window.location.search).get("culture");
        if (savedCulture && REGIONAL_CULTURES.some((item) => item.id === savedCulture))
            setCulture(savedCulture);
        const savedStyle = new URLSearchParams(window.location.search).get("style");
        if (savedStyle && ["Couple", "Royal", "Floral", "Festive", "Modern"].includes(savedStyle))
            setStyle(savedStyle);
    }, []);
    const list = useMemo(
        () => [...CARD_TEMPLATES, ...userTemplates].filter((t) =>
            (event === "all" || t.event === event) &&
            (style === "all" || t.style === style) &&
            (t.regional
                ? culture !== "all" && t.tradition === culture
                : culture === "all" || (t.coupleArt && t.tradition === culture))
        ),
        [event, style, culture, userTemplates]
    );
    const cwOf = (t) => colorways[t.id] ?? 0;
    const setCw = (t, i) => setColorways((c) => ({ ...c, [t.id]: i }));
    const detailsFor = (t) => {
        return { ...details, ...(t.savedWording ?? wordingFor(templateDesign(t))) };
    };
    const photoKey = photoFingerprint(details.couplePhoto);
    const useHref = (t) => `/create?template=${t.id}&cw=${cwOf(t)}`;
    return (<main className="studio">
      <SiteHeader active="/templates"/>
      <section className="hero compact">
        <p className="eyebrow">CARD TEMPLATES</p>
        <h1>Wedding cards with <em>a more considered finish.</em></h1>
        <p>Choose an illustrated design, then make it yours with your names, date, venue and colours. From soft botanical paper to bold evening tones, each card is ready to personalise and share.</p>
        <a className="primary" href="/create#save-template">Create and save your own template →</a>
      </section>

      <div className="gallery-wrap browse">
        <FilterPanel resultLabel={`${list.length} design${list.length === 1 ? "" : "s"}`} groups={[
            { id: "style", title: "Collection", value: style, onChange: setStyle, options: [{ id: "all", label: "All designs" }, ...(CARD_TEMPLATES.some((t) => t.style === "Couple") ? [{ id: "Couple", label: "Bride & groom ✦" }] : []), { id: "Royal", label: "Royal" }, { id: "Floral", label: "Floral" }, { id: "Festive", label: "Festive" }, { id: "Modern", label: "Modern" }] },
            { id: "event", title: "Ceremony", value: event, onChange: setEvent, options: [{ id: "all", label: "All ceremonies" }, ...EVENT_ORDER.map((k) => ({ id: k, label: EVENT_PRESETS[k].label }))] },
            { id: "culture", title: "Culture & regional style", value: culture, onChange: setCulture, options: [{ id: "all", label: "All designs" }, ...REGIONAL_CULTURES.map((item) => ({ id: item.id, label: item.label }))] },
        ]}/>
        <div className="browse-main">
        <div className="browse-top">
          <p className="count">{list.length} design{list.length === 1 ? "" : "s"} · {list.reduce((n, t) => n + t.def.colorways.length, 0)} colour options</p>
        </div>

        {savedNotice && <p className="hint small" role="status">{savedNotice}</p>}

        {list.length === 0 ? (<div className="tpl-empty">
          <p>No templates match these filters.</p>
          <a className="primary" href="/create#save-template">Create a template →</a>
        </div>) : (<div className="tpl-grid">
          {list.map((t) => (<article key={t.id} className="tpl-card">
              <button type="button" className="tpl-thumb" onClick={() => setPreview(t)} aria-label={`Preview ${t.name}`}>
                <Thumb cacheKey={`card:${t.id}:${cwOf(t)}:${photoKey}:${details.brideName}:${details.groomName}:${details.date}`} make={cardThumbJob(templateDesign(t, cwOf(t)), details)} alt={`${t.name}, ${t.def.colorways[cwOf(t)].name}`}/>
                <span className="badge">▶ Animated</span>
              </button>
              <div className="tpl-meta">
                <b>{t.name}</b>
                <small>{t.regional ? `${t.regionLabel} · ` : ""}{EVENT_PRESETS[t.event].label} · {t.def.colorways[cwOf(t)].name}</small>
                <p className="hint small">{t.blurb}</p>
              </div>
              <ColorwayDots colorways={t.def.colorways} value={cwOf(t)} onChange={(i) => setCw(t, i)}/>
              <div className="tpl-actions">
                <button type="button" onClick={() => setPreview(t)}>Preview</button>
                <a className="primary" href={useHref(t)}>Use design</a>
              </div>
            </article>))}
        </div>)}
        </div>
      </div>

      {preview && (<div className="modal" role="dialog" aria-modal="true" aria-label={`${preview.name} preview`} onClick={() => setPreview(null)}>
          <div className="modal-body" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setPreview(null)} aria-label="Close">×</button>
            <div className="modal-canvas"><InviteCanvas design={templateDesign(preview, cwOf(preview))} details={detailsFor(preview)} mode="video" playing restartKey={cwOf(preview)} muted className="invite-canvas"/></div>
            <div className="modal-side">
              <small>{preview.regional ? `${preview.regionLabel} · ` : ""}{EVENT_PRESETS[preview.event].label} · {preview.def.colorways[cwOf(preview)].name}</small>
              <h2>{preview.name}</h2>
              <p className="hint">{preview.blurb}</p>
              <div className="sub-label">COLOUR OPTIONS</div>
              <ColorwayDots size="lg" colorways={preview.def.colorways} value={cwOf(preview)} onChange={(i) => setCw(preview, i)}/>
              <p className="hint small">You can fine-tune every colour, the frame and the lettering on the next screen.</p>
              <a className="primary" href={useHref(preview)}>Use design</a>
            </div>
          </div>
        </div>)}
      <SiteFooter />
    </main>);
}
