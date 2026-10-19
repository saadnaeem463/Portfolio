"use client";
import { useState } from "react";
import { site } from "../data/site";

const F = ({ label, name, type = "text", area }) => (
  <label className="block text-sm text-txt-2">{label}
    {area ? <textarea name={name} required rows={5} className="input mt-2" /> : <input name={name} type={type} required className="input mt-2" />}
  </label>
);

export default function Contact() {
  const [status, setStatus] = useState("idle");
  async function submit(e) {
    e.preventDefault();
    setStatus("sending");
    const f = new FormData(e.currentTarget);
    const body = new FormData();
    body.append("name", `${f.get("first")} ${f.get("last")}`);
    body.append("email", f.get("email"));
    body.append("subject", `Portfolio Contact: ${f.get("subject")}`);
    body.append("message", f.get("message"));
    body.append("_subject", "New message from Saad Naeem Portfolio!");
    try {
      const r = await fetch(`https://formsubmit.co/ajax/${site.email}`, { method: "POST", body });
      if (!r.ok) throw new Error();
      setStatus("ok"); e.currentTarget.reset();
    } catch { setStatus("error"); }
  }
  return (
    <div className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
      <div className="space-y-4">
        {[["Email", site.email, `mailto:${site.email}`], ["Location", site.location], ["LinkedIn", "Saad Naeem", site.linkedin], ["GitHub", `@${site.githubUser}`, site.github]].map(([l, v, h]) => (
          <div key={l} className="card p-5">
            <p className="font-label text-xs uppercase tracking-widest text-txt-muted">{l}</p>
            {h ? <a href={h} target="_blank" rel="noreferrer" className="mt-1 block break-all text-silver hover:text-white">{v}</a> : <p className="mt-1 text-silver">{v}</p>}
          </div>
        ))}
      </div>
      <form onSubmit={submit} className="card space-y-4 p-6">
        <div className="grid gap-4 sm:grid-cols-2"><F label="First name" name="first" /><F label="Last name" name="last" /></div>
        <F label="Email" name="email" type="email" />
        <F label="Subject" name="subject" />
        <F label="Message" name="message" area />
        <button disabled={status === "sending"} className="btn btn-p w-full justify-center">{status === "sending" ? "Sending…" : "Send message"}</button>
        {status === "ok" && <p className="text-sm text-emerald-400">Thanks for your message! I&apos;ll get back to you soon.</p>}
        {status === "error" && <p className="text-sm text-red-400">Something went wrong. Please email me directly at {site.email}.</p>}
      </form>
    </div>
  );
}
