"use client";
import { useMemo, useState } from "react";
import { InviteShell, CardInvitation } from "@/components/invite-sections";
import { FORM_GROUPS, formDefaults, buildInvitation } from "@/lib/invitation-form";
import { readImage } from "@/lib/image-upload";
import s from "./create.module.css";

/** One picture: upload from the device, or paste a URL. Empty = sample photo. */
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
    {value ? <img className={s.thumb} src={value} alt="" /> : <p className={s.hint}>Showing the sample photo.</p>}
    <div className={s.row}>
      <label className={s.fileBtn}>{value ? "Change photo" : "Upload photo"}<input type="file" accept="image/*" hidden onChange={pick} /></label>
      {value && <button type="button" className={s.linkBtn} onClick={() => onChange("")}>Remove</button>}
    </div>
    {!uploaded && <input className={s.input} placeholder="…or paste an image link" value={value} onChange={(e) => onChange(e.target.value)} />}
    {error && <p className={s.error}>{error}</p>}
  </div>;
}

/** Gallery: upload many photos, add by link, caption and remove each one. */
function PhotoList({ photos, onChange }) {
  const [url, setUrl] = useState("");
  const addFiles = async (e) => {
    const files = [...(e.target.files || [])];
    e.target.value = "";
    const added = [];
    for (const file of files) { try { added.push({ src: await readImage(file), caption: "" }); } catch { /* skip unreadable file */ } }
    if (added.length) onChange((list) => [...list, ...added]);
  };
  const addUrl = () => {
    if (!url.trim()) return;
    onChange((list) => [...list, { src: url.trim(), caption: "" }]);
    setUrl("");
  };
  const patch = (i, change) => onChange((list) => list.map((p, j) => (j === i ? { ...p, ...change } : p)));
  const remove = (i) => onChange((list) => list.filter((_, j) => j !== i));

  return <div className={s.photos}>
    {photos.map((p, i) => <div key={i} className={s.photoRow}>
      <img className={s.thumbSm} src={p.src} alt="" />
      <div className={s.photoMeta}>
        <input className={s.input} placeholder="Caption (optional)" value={p.caption} onChange={(e) => patch(i, { caption: e.target.value })} />
        <button type="button" className={s.linkBtn} onClick={() => remove(i)}>Remove</button>
      </div>
    </div>)}
    <div className={s.row}>
      <label className={s.fileBtn}>Upload photos<input type="file" accept="image/*" multiple hidden onChange={addFiles} /></label>
    </div>
    <div className={s.row}>
      <input className={s.input} placeholder="…or paste an image link" value={url} onChange={(e) => setUrl(e.target.value)} />
      <button type="button" className={s.fileBtn} onClick={addUrl}>Add</button>
    </div>
  </div>;
}

/** Left: the form. Right: the invitation, updated as you type or upload. */
export default function CreateInvitation() {
  const [form, setForm] = useState(formDefaults);
  const d = useMemo(() => buildInvitation(form), [form]);
  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));
  const setPhotos = (updater) => setForm((f) => ({ ...f, gallery: updater(f.gallery) }));

  return <InviteShell className={s.page}>
    <aside className={s.formPane}>
      <header className={s.head}>
        <h1>Create your invitation</h1>
        <p>Type or upload on the left, and your invitation updates on the right.</p>
        <button type="button" className={s.reset} onClick={() => setForm(formDefaults)}>Reset to sample</button>
      </header>
      <form onSubmit={(e) => e.preventDefault()}>
        {FORM_GROUPS.map((group) => <fieldset key={group.title} className={s.group}>
          <legend>{group.title}</legend>
          {group.hint && <p className={s.hint}>{group.hint}</p>}
          {group.photos && <PhotoList photos={form.gallery} onChange={setPhotos} />}
          {group.fields?.map(([key, label, type = "text"]) => type === "image"
            ? <div key={key} className={s.label}><span>{label}</span><ImageField value={form[key]} onChange={set(key)} /></div>
            : <label key={key} className={s.label}>
              <span>{label}</span>
              {type === "textarea"
                ? <textarea className={s.input} rows={4} value={form[key]} onChange={(e) => set(key)(e.target.value)} />
                : <input className={s.input} type={type} value={form[key]} onChange={(e) => set(key)(e.target.value)} />}
            </label>)}
        </fieldset>)}
      </form>
    </aside>
    <main className={s.previewPane}>
      <div className={s.previewInner}>
        <CardInvitation d={d} active />
      </div>
    </main>
  </InviteShell>;
}
