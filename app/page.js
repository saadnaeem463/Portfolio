"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Navbar";
import Splash from "../components/Splash";
import Cursor from "../components/Cursor";
import Contributions from "../components/Contributions";
import Contact from "../components/Contact";
import { site, flagship, more, stack, education } from "../data/site";
import { icons } from "../data/icons";

const Title = ({ children }) => <h2 data-r className="h2 mb-12 flex items-center gap-3 font-semibold"><i className="h-7 w-1 rounded bg-teal-light" />{children}</h2>;
const Links = ({ p }) => (
  <div className="mt-5 flex flex-wrap gap-3">
    {p.live && <a href={p.live} target="_blank" rel="noreferrer" className="btn btn-p">Live demo ↗</a>}
    {p.code && <a href={p.code} target="_blank" rel="noreferrer" className="btn">GitHub ↗</a>}
  </div>
);
const Tags = ({ t }) => <div className="mt-4 flex flex-wrap gap-2">{t.map((x) => <span key={x} className="tag">{x}</span>)}</div>;
const dock = [["LinkedIn", site.linkedin, icons.LinkedIn], ["Gmail", `https://mail.google.com/mail/?view=cm&to=${site.email}`, icons.Gmail], ["GitHub", site.github, icons.GitHub]];

export default function Home() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray("[data-r]").forEach((el) =>
        gsap.from(el, { y: 36, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 92%" } }));
    });
    return () => ctx.revert();
  }, []);

  return (
    <main id="top">
      <Splash /><Cursor /><Navbar />

      <section id="about" className="flex min-h-dvh items-center pb-10 pt-[100px]">
        <div className="wrap flex items-center gap-16 max-md:flex-col max-md:gap-12 max-md:text-center">
          <div className="group relative shrink-0">
            <div className="glass overflow-hidden rounded-2xl p-3 transition duration-300 group-hover:scale-[1.02]">
              <img src="/assets/images/profile.webp" alt="Saad Naeem" width="800" height="800" className="block rounded-xl object-cover" style={{ width: "clamp(256px, 28vw, 384px)", height: "clamp(256px, 28vw, 384px)" }} />
            </div>
            <span className="absolute -right-5 -top-3 translate-y-2 rounded-[10px] border border-white/10 bg-[#1a1a1a]/90 px-3.5 py-1.5 font-mono text-xs text-teal-light opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">&gt; npm run dev</span>
            <span className="absolute -bottom-3 -left-5 -translate-y-2 rounded-[10px] border border-white/10 bg-[#1a1a1a]/90 px-3.5 py-1.5 font-mono text-xs text-teal-light opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">&gt; const dev = true</span>
          </div>
          <div className="min-w-0">
            <p className="mb-4 font-label text-sm font-medium tracking-wider text-teal-light">Welcome —</p>
            <h1 className="name-reveal mb-3 text-[clamp(3rem,5vw,5rem)] font-bold leading-[1.1] tracking-[-0.03em]">{site.name}</h1>
            <h2 className="mb-8 text-[clamp(1.25rem,2vw,1.75rem)] font-medium text-silver">{site.role}</h2>
            <p className="max-w-[520px] leading-loose max-md:max-w-full">{site.bio}</p>
            <p className="mt-6 max-w-[520px] text-sm italic text-txt-muted max-md:max-w-full">{site.tagline}</p>
            <div className="mt-10 flex items-center gap-6 max-md:justify-center">
              <a href="#projects" className="btn btn-p">See my work</a>
              <div className="flex gap-3">
                {dock.map(([t, h, d]) => (
                  <a key={t} href={h} target="_blank" rel="noreferrer" title={t} aria-label={t} className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-bg-2 text-silver transition hover:-translate-y-1 hover:border-teal-light hover:text-white">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d={d} /></svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="sec">
        <div className="wrap">
          <Title>Flagship Projects</Title>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {flagship.map((p) => (
              <article key={p.title} data-r className="card flex flex-col overflow-hidden">
                <div className="overflow-hidden border-b border-white/10"><img src={`/assets/images/${p.img}.webp`} alt={p.alt} className="aspect-[3/2] w-full object-cover object-top transition duration-500 hover:scale-105" /></div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="font-label text-xs uppercase tracking-widest text-ruby-light">{p.group}</p>
                  <h3 className="mt-2 text-xl">{p.title}</h3>
                  <p className="mt-3 flex-1 text-sm">{p.desc}</p>
                  <Tags t={p.tech} /><Links p={p} />
                </div>
              </article>
            ))}
          </div>

          <h3 data-r className="mb-8 mt-20 text-xl font-semibold text-silver">More projects</h3>
          <div className="grid gap-8 md:grid-cols-2">
            {more.map((p) => (
              <article key={p.title} data-r className="card overflow-hidden">
                <img src={`/assets/images/${p.img}.webp`} alt={p.alt} className="aspect-[3/1.4] w-full border-b border-white/10 object-cover object-top" />
                <div className="p-6">
                  <h3 className="text-xl">{p.title}</h3>
                  <p className="mt-2 text-sm">{p.desc}</p>
                  <ul className="mt-4 space-y-2 text-sm">{p.features.map((f) => <li key={f} className="flex gap-2"><span className="text-teal-light">▸</span><span className="text-txt-2">{f}</span></li>)}</ul>
                  <Tags t={p.tech} /><Links p={p} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="tech" className="sec">
        <div className="wrap">
          <Title>Tech Stack</Title>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
            {stack.map(([n, i]) => (
              <div key={n} data-r className="card flex flex-col items-center gap-3 p-5">
                <img src={i} alt={n} width="48" height="48" className="h-12 w-12" loading="lazy" />
                <span className="text-center font-label text-xs text-txt-2">{n}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contributions" className="sec"><div className="wrap"><Title>Contribution Graph</Title><div data-r><Contributions /></div></div></section>

      <section id="education" className="sec">
        <div className="wrap">
          <Title>Education</Title>
          {education.map((e) => (
            <div key={e.title} data-r className="card max-w-xl p-6">
              <p className="font-label text-xs uppercase tracking-widest text-ruby-light">{e.period}</p>
              <h3 className="mt-2 text-2xl">{e.title}</h3>
              <p className="mt-1 text-silver">{e.sub}</p>
              <p className="mt-2 text-sm text-txt-muted">{e.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="sec"><div className="wrap"><Title>Get in Touch</Title><div data-r><Contact /></div></div></section>

      <footer className="border-t border-white/10 py-8 text-center font-label text-xs text-txt-muted">© 2026 {site.name} · Built with Next.js, Tailwind CSS & GSAP</footer>
    </main>
  );
}
