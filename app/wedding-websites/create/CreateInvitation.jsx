"use client";
import { useMemo, useState } from "react";
import { InviteShell } from "@/components/invite-sections";
import { SacredGardenInvitation, SgEnvelope } from "@/components/invite-sections/garden";
import { FORM_GROUPS, formDefaults, buildInvitation, DESIGN_MUSIC, colorFields } from "@/lib/invitation-form";
import { readImage } from "@/lib/image-upload";
import EnvelopeAiField from "./EnvelopeAiField";
import s from "./create.module.css";

const MAX_AUDIO_MB = 15;

/** One picture: upload from the device, or paste a URL. Empty = the design's own picture. */
function ImageField({ value, onChange }) {
  const [error, setError] = useState("");
  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try { onChange(await readImage(file)); setError(""); } catch (err) { setError(err.message); }
  };
  const uploaded = value.startsWith("data:");
  return <div className={s.imageField}>
    {value ? <img className={s.thumb} src={value} alt="" /> : <p className={s.hint}>Showing the design&apos;s picture.</p>}
    <div className={s.row}>
      <label className={s.fileBtn}>{value ? "Change photo" : "Upload photo"}<input type="file" accept="image/*" hidden onChange={pick} /></label>
      {value && <button type="button" className={s.linkBtn} onClick={() => onChange("")}>Remove</button>}
    </div>
    {!uploaded && <input className={s.input} placeholder="…or paste an image link" value={value} onChange={(e) => onChange(e.target.value)} />}
    {error && <p className={s.error}>{error}</p>}
  </div>;
}

/** Background music: the design's track, an uploaded file, a link, or none (empty). */
function AudioField({ value, onChange }) {
  const [error, setError] = useState("");
  const pick = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > MAX_AUDIO_MB * 1024 * 1024) { setError(`Please pick a file under ${MAX_AUDIO_MB} MB.`); return; }
    const reader = new FileReader();
    reader.onload = () => { onChange(reader.result); setError(""); };
    reader.onerror = () => setError("This file could not be read. Try an MP3.");
    reader.readAsDataURL(file);
  };
  const uploaded = value.startsWith("data:");
  const design = value === DESIGN_MUSIC;
  return <div className={s.imageField}>
    <p className={s.hint}>{design ? "Playing the design's music." : uploaded ? "Your uploaded music." : value ? "Music from your link." : "No music."}</p>
    {value && <audio className={s.audio} controls preload="none" src={value} />}
    <div className={s.row}>
      <label className={s.fileBtn}>{uploaded ? "Change music" : "Upload music"}<input type="file" accept="audio/*" hidden onChange={pick} /></label>
      {!design && <button type="button" className={s.linkBtn} onClick={() => { onChange(DESIGN_MUSIC); setError(""); }}>Use the design&apos;s music</button>}
      {value && <button type="button" className={s.linkBtn} onClick={() => onChange("")}>No music</button>}
    </div>
    {!uploaded && <input className={s.input} placeholder="…or paste a music link (MP3)" value={design ? "" : value} onChange={(e) => onChange(e.target.value)} />}
    {error && <p className={s.error}>{error}</p>}
  </div>;
}

/** A dropdown; for fonts each choice is also shown in its own lettering. */
function SelectField({ value, onChange, choices, sample }) {
  return <>
    <select className={s.input} value={value} onChange={(e) => onChange(e.target.value)}>
      {choices.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
    </select>
    {sample && <span className={s.fontSample} style={sample}>Aarav &amp; Meera — Wedding Day</span>}
  </>;
}

/** Left: the form. Right: the Sacred Garden invitation, updated as you type or upload. */
export default function CreateInvitation() {
  const [form, setForm] = useState(formDefaults);
  const [envelope, setEnvelope] = useState(false);
  const c = useMemo(() => buildInvitation(form), [form]);
  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));
  const fontSample = (key) => (key === "fontBodyStyle"
    ? { fontFamily: `"${form.fontBody}", serif`, fontStyle: form.fontBodyStyle }
    : key.startsWith("font") ? { fontFamily: `"${form[key]}", serif` } : null);

  const field = ([key, label, type = "text", choices]) => {
    if (type === "image") return <div key={key} className={s.label}><span>{label}</span><ImageField value={form[key]} onChange={set(key)} /></div>;
    if (type === "audio") return <div key={key} className={s.label}><span>{label}</span><AudioField value={form[key]} onChange={set(key)} /></div>;
    if (type === "envelope-ai") return <div key={key} className={s.label}>
      <EnvelopeAiField label={label} value={form[key]} onChange={set(key)} words={form.initials} onWords={set("initials")} monogram={c.monogram} /></div>;
    if (type === "color") return <label key={key} className={s.colorRow}>
      <input type="color" className={s.swatchInput} value={form[key]} onChange={(e) => set(key)(e.target.value)} />
      <span>{label}</span>
      <input className={`${s.input} ${s.hex}`} value={form[key]} maxLength={7} aria-label={`${label} (hex)`}
        onChange={(e) => { const v = e.target.value.trim(); if (/^#[0-9a-f]{0,6}$/i.test(v)) set(key)(v); }} />
    </label>;
    return <label key={key} className={s.label}>
      <span>{label}</span>
      {type === "select" ? <SelectField value={form[key]} onChange={set(key)} choices={choices} sample={fontSample(key)} />
        : type === "textarea" ? <textarea className={s.input} rows={4} value={form[key]} onChange={(e) => set(key)(e.target.value)} />
          : <input className={s.input} type={type} value={form[key]} onChange={(e) => set(key)(e.target.value)} />}
    </label>;
  };

  return <InviteShell className={s.page}>
    <aside className={s.formPane}>
      <header className={s.head}>
        <h1>Create your invitation</h1>
        <p>Type or upload on the left, and your invitation updates on the right.</p>
        <button type="button" className={s.reset} onClick={() => setForm(formDefaults)}>Reset to sample</button>
        <button type="button" className={s.envelopeBtn} onClick={() => setEnvelope(true)}>Preview the envelope</button>
      </header>
      <form onSubmit={(e) => e.preventDefault()}>
        {FORM_GROUPS.map((group) => <fieldset key={group.title} className={s.group}>
          <legend>{group.title}</legend>
          {group.hint && <p className={s.hint}>{group.hint}</p>}
          {group.presets && <div className={s.presets}>
            {group.presets.map(([name, k]) => {
              const on = form.colorAccent === k.accent && form.colorBackground === k.background && form.colorText === k.text;
              return <button key={name} type="button" className={`${s.preset} ${on ? s.presetOn : ""}`} aria-pressed={on}
                onClick={() => setForm((f) => ({ ...f, ...colorFields(k) }))}>
                <span className={s.dots} aria-hidden="true">{[k.background, k.accent, k.text, k.button].map((c) => <i key={c} style={{ background: c }} />)}</span>
                {name}
              </button>;
            })}
          </div>}
          {group.fields.map(field)}
        </fieldset>)}
      </form>
    </aside>
    <main className={s.previewPane}>
      <div className={s.previewGarden}><SacredGardenInvitation c={c} /></div>
    </main>
    {envelope && <SgEnvelope video={c.envelope.video} music={c.music || undefined} monogram={c.monogram} sealTrack={c.envelope.sealTrack} tapLabel={c.envelope.tapLabel} onDone={() => setEnvelope(false)} />}
  </InviteShell>;
}
