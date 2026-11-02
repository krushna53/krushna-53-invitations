"use client";
import { useState } from "react";
import s from "./RsvpSection.module.css";
import { Button, Icon, Reveal, Section, SectionHeading, cx } from "./shared";

/**
 * RSVP form. Where the answer goes, in order of preference:
 *  - onSubmit(rsvp): your own handler (API, Google Sheet, …). Throw to show an error.
 *  - whatsappNumber: opens WhatsApp with the reply pre-written to the couple.
 *  - neither: only shows the thank-you screen (handy for demos).
 */
export default function RsvpSection({ id = "rsvp", eyebrow = "Kindly reply", title = "RSVP", subtitle, events = [], maxGuests = 10, deadline, coupleNames = "the couple", whatsappNumber, onSubmit, tone = "cream" }) {
  const [form, setForm] = useState({ name: "", attending: "", guests: 1, events: [], message: "" });
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const set = (patch) => { setForm((f) => ({ ...f, ...patch })); setError(""); };
  const toggleEvent = (name) => set({ events: form.events.includes(name) ? form.events.filter((e) => e !== name) : [...form.events, name] });
  const yes = form.attending === "yes";

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Please enter your name.");
    if (!form.attending) return setError("Please select whether you will be attending.");
    if (yes && events.length > 0 && form.events.length === 0) return setError("Please select the event(s) you will be attending.");
    const rsvp = { ...form, name: form.name.trim(), guests: yes ? form.guests : 0, events: yes ? form.events : [] };
    setStatus("sending");
    try {
      if (onSubmit) await onSubmit(rsvp);
      else if (whatsappNumber) {
        const lines = [`RSVP for ${coupleNames}`, `Name: ${rsvp.name}`, `Attending: ${yes ? "Yes" : "No"}`];
        if (yes) lines.push(`Guests: ${rsvp.guests}`, ...(rsvp.events.length ? [`Events: ${rsvp.events.join(", ")}`] : []));
        if (rsvp.message) lines.push(`Message: ${rsvp.message}`);
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
      }
      setStatus("sent");
    } catch {
      setStatus("idle");
      setError("Something went wrong. Please try again.");
    }
  };

  return <Section id={id} tone={tone} label="RSVP">
    <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
    <Reveal className={s.card}>
      {status === "sent"
        ? <div className={s.done} role="status">
          <span className={s.doneIcon}><Icon name="check" size={34} strokeWidth={2.4} /></span>
          <h3>Thank you!</h3>
          <p>{yes ? "We can't wait to celebrate with you." : "You'll be missed — thank you for letting us know."}</p>
          <p>{coupleNames} will receive your message.</p>
          <button type="button" className={s.again} onClick={() => setStatus("idle")}>Edit my reply</button>
        </div>
        : <form className={s.form} onSubmit={submit} noValidate>
          <label className={s.field}><span>Your Name</span>
            <input className={s.input} value={form.name} onChange={(e) => set({ name: e.target.value })} autoComplete="name" placeholder="Full name" required />
          </label>
          <fieldset className={s.field}><legend>Will you be attending?</legend>
            <div className={s.choices}>
              <label className={s.choice}><input type="radio" name="attending" value="yes" checked={yes} onChange={() => set({ attending: "yes" })} /><span>Yes, I'll be there!</span></label>
              <label className={s.choice}><input type="radio" name="attending" value="no" checked={form.attending === "no"} onChange={() => set({ attending: "no" })} /><span>Sorry, I can't make it</span></label>
            </div>
          </fieldset>
          {yes && <>
            <div className={s.field}><span id={`${id}-guests`}>How many guests?</span>
              <div className={s.stepper} role="group" aria-labelledby={`${id}-guests`}>
                <button type="button" aria-label="Fewer guests" onClick={() => set({ guests: Math.max(1, form.guests - 1) })}>−</button>
                <output aria-live="polite">{form.guests}</output>
                <button type="button" aria-label="More guests" onClick={() => set({ guests: Math.min(maxGuests, form.guests + 1) })}>+</button>
              </div>
            </div>
            {events.length > 0 && <fieldset className={s.field}><legend>Which event(s) will you attend?</legend>
              <div className={s.events}>{events.map((ev) => <label key={ev} className={s.choice}><input type="checkbox" checked={form.events.includes(ev)} onChange={() => toggleEvent(ev)} /><span>{ev}</span></label>)}</div>
            </fieldset>}
          </>}
          <label className={s.field}><span>Your Message</span>
            <textarea className={s.input} value={form.message} onChange={(e) => set({ message: e.target.value })} placeholder="Share your blessings for the couple" />
          </label>
          {error && <p className={s.error} role="alert">{error}</p>}
          <Button type="submit" className={cx(s.submit)} disabled={status === "sending"}><Icon name="send" size={18} />{status === "sending" ? "Sending..." : "Send Message"}</Button>
          {deadline && <p className={s.deadline}>{deadline}</p>}
        </form>}
    </Reveal>
  </Section>;
}
