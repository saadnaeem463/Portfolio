"use client";
import { useEffect, useRef } from "react";
import { site, projects } from "../data/site";
import { icons } from "../data/icons";

const dock = [["LinkedIn", site.linkedin, icons.LinkedIn], ["Gmail", `https://mail.google.com/mail/?view=cm&to=${site.email}`, icons.Gmail], ["GitHub", site.github, icons.GitHub]];

export default function Hero() {
  const ref = useRef(null);

  // soft red spotlight that follows the pointer (fine pointers only, rAF-throttled)
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0, x = 0, y = 0;
    const move = (e) => { const r = el.getBoundingClientRect(); x = e.clientX - r.left; y = e.clientY - r.top; if (!raf) raf = requestAnimationFrame(() => { raf = 0; el.style.setProperty("--mx", x + "px"); el.style.setProperty("--my", y + "px"); }); };
    el.addEventListener("pointermove", move);
    return () => { el.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section id="top" ref={ref} className="hero relative isolate flex min-h-dvh items-end overflow-hidden pb-6 pt-20">
      <div className="spot" aria-hidden="true" />
      <div className="wrap relative w-full">
        <div className="relative flex flex-col md:block md:min-h-[min(74vh,800px)]">
          {/* portrait cut-out with red disc behind it */}
          <div data-build className="relative z-10 mx-auto mt-2 w-fit md:absolute md:bottom-0 md:right-[2vw] md:mt-0">
            <div className="absolute left-1/2 top-[26%] aspect-square w-[92%] -translate-x-1/2 rounded-full bg-red" aria-hidden="true" />
            <div className="absolute left-1/2 top-[26%] aspect-square w-[92%] -translate-x-[44%] translate-y-3 rounded-full border border-paper/20" aria-hidden="true" />
            <img src="/assets/images/profile-cutout.webp" alt="Portrait of Saad Naeem" width="577" height="798" fetchPriority="high"
              className="portrait relative block h-[50vh] w-auto max-w-[88vw] md:h-[min(72vh,780px)]" />
            <svg viewBox="0 0 120 120" className="badge-spin absolute -left-4 top-[20%] hidden h-28 w-28 md:block" aria-hidden="true">
              <defs><path id="circ" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" /></defs>
              <text fill="#f2efeb" fontSize="11" fontWeight="800"><textPath href="#circ" textLength="284" lengthAdjust="spacing">FULL-STACK • ML • MERN • </textPath></text>
              <circle cx="60" cy="60" r="5" fill="#e32b3c" />
            </svg>
          </div>

          <div className="relative z-0 max-md:-order-1 md:pt-2">
            <p data-build className="hand mb-1 block w-fit text-3xl max-sm:text-2xl">Hey, I’m</p>
            <h1 data-build className="display block w-fit text-[clamp(4rem,min(22vw,20vh),14rem)] leading-[.86] md:text-[clamp(4rem,min(16vw,23vh),14rem)]">
              <span className="block">Saad</span>
              <span className="block">Naeem<span className="text-red">.</span></span>
            </h1>
            <div className="mt-6 max-w-[500px] md:mt-8">
              <div data-build>
                <p className="display mb-3 text-[clamp(1.3rem,2.4vw,2rem)] text-paper">{site.role}</p>
                <p className="text-[15px]">{site.bio}</p>
              </div>
              <div data-build className="mt-6 flex flex-wrap items-center gap-3">
                <a href="#projects" className="btn btn-red">View work ↓</a>
                <a href="#contact" className="btn">Contact</a>
                <div className="flex gap-2">
                  {dock.map(([t, h, d]) => (
                    <a key={t} href={h} target="_blank" rel="noopener noreferrer" aria-label={t} title={t}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-mute transition hover:-translate-y-1 hover:border-red hover:text-paper">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true"><path d={d} /></svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div data-build className="rule mt-10 flex flex-wrap items-center justify-between gap-4 pt-5 text-xs font-bold uppercase tracking-[.2em] text-mute">
          <span>{String(projects.length).padStart(2, "0")} projects</span>
          <span className="max-sm:hidden">MERN · Next.js · Python · ML</span>
          <span>{site.location}</span>
        </div>
      </div>
    </section>
  );
}
