"use client";
import { useState } from "react";
import { site } from "../data/site";

const F = ({ label, name, type = "text", area }) => (
  <label data-build className="block text-xs font-bold uppercase tracking-[.16em] text-mute">{label}
    {area ? <textarea name={name} required rows={4} className="input mt-1 text-base normal-case tracking-normal" /> : <input name={name} type={type} required className="input mt-1 text-base normal-case tracking-normal" />}
  </label>
);

export default function Contact() {
  const [status, setStatus] = useState("idle");
  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    const f = new FormData(form);
    const body = new FormData();
    body.append("name", `${f.get("first")} ${f.get("last")}`);
    body.append("email", f.get("email"));
    body.append("subject", `Portfolio Contact: ${f.get("subject")}`);
    body.append("message", f.get("message"));
    body.append("_subject", "New message from Saad Naeem Portfolio!");
    try {
      const r = await fetch(`https://formsubmit.co/ajax/${site.email}`, { method: "POST", body });
      if (!r.ok) throw new Error();
      setStatus("ok"); form.reset();
    } catch { setStatus("error"); }
  }
  return (
    <div className="grid gap-14 md:grid-cols-[1fr_1.2fr]">
      <div>
        <a href={`mailto:${site.email}`} data-build className="display block w-fit max-w-full break-all text-[clamp(1.6rem,3.2vw,2.6rem)] transition-colors hover:text-red">{site.email}</a>
        <ul className="mt-8 space-y-4 text-sm">
          {[["Location", site.location], ["LinkedIn", "Saad Naeem", site.linkedin], ["GitHub", `@${site.githubUser}`, site.github]].map(([l, v, h]) => (
            <li data-build key={l} className="rule flex items-baseline justify-between gap-4 pt-4">
              <span className="text-xs font-bold uppercase tracking-[.18em] text-mute">{l}</span>
              {h ? <a href={h} target="_blank" rel="noopener noreferrer" className="text-paper hover:text-red">{v} ↗</a> : <span className="text-paper">{v}</span>}
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={submit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2"><F label="First name" name="first" /><F label="Last name" name="last" /></div>
        <F label="Email" name="email" type="email" />
        <F label="Subject" name="subject" />
        <F label="Message" name="message" area />
        <button data-build disabled={status === "sending"} className="btn btn-red w-full disabled:opacity-60">{status === "sending" ? "Sending…" : "Send message →"}</button>
        <p role="status" aria-live="polite" className="text-sm">
          {status === "ok" && <span className="text-emerald-400">Thanks for your message! I’ll get back to you soon.</span>}
          {status === "error" && <span className="text-red">Something went wrong. Please email me directly at {site.email}.</span>}
        </p>
      </form>
    </div>
  );
}
