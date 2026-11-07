"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { projects, categories } from "../data/site";
import ProjectDialog from "./ProjectDialog";
import Reveal from "./Reveal";

export default function Projects() {
  const [cat, setCat] = useState("All");
  const [sel, setSel] = useState(null);
  const close = useCallback(() => setSel(null), []);
  const list = projects.filter((p) => cat === "All" || p.group === cat);

  return (
    <section id="projects" className="sec">
      <div className="wrap">
        <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="kicker mb-3">01 — Selected work</p>
            <h2 className="display text-[clamp(3rem,9vw,8rem)]">Things I’ve<br /><span className="outline-text">built</span></h2>
          </div>
          <LayoutGroup>
            <div role="tablist" aria-label="Filter projects" className="flex flex-wrap gap-1">
              {categories.map((c) => (
                <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)}
                  className={`relative min-h-[44px] px-4 text-xs font-bold uppercase tracking-[.16em] transition-colors ${cat === c ? "text-paper" : "text-mute hover:text-paper"}`}>
                  {c}
                  {cat === c && <motion.i layoutId="filter-underline" className="absolute inset-x-3 bottom-1.5 h-0.5 bg-red" />}
                </button>
              ))}
            </div>
          </LayoutGroup>
        </Reveal>

        <motion.div layout className="grid gap-x-8 gap-y-14 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.article layout key={p.title} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className={i % 2 ? "md:mt-20" : ""}>
                <button onClick={() => setSel(p)} aria-haspopup="dialog" aria-label={`Open details for ${p.title}`} className="group block w-full text-left" data-build>
                  <div className="relative overflow-hidden rounded-[4px] border border-line">
                    <img src={`/assets/images/${p.img}.webp`} alt={p.alt} loading={i > 1 ? "lazy" : "eager"}
                      className="img-duo aspect-[3/2] w-full object-cover object-top transition duration-700 ease-out group-hover:scale-105 group-hover:[filter:none]" />
                    <span className="absolute left-0 top-0 display bg-ink px-4 py-2 text-3xl text-paper">{String(projects.indexOf(p) + 1).padStart(2, "0")}</span>
                    <span className="absolute bottom-4 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-red text-xl opacity-0 transition duration-300 group-hover:opacity-100 max-md:opacity-100">↗</span>
                  </div>
                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="display text-4xl sm:text-5xl">{p.title}</h3>
                      <p className="kicker mt-2">{p.group}</p>
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-2 max-w-md text-sm">{p.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-2">{p.tech.slice(0, 4).map((t) => <span key={t} className="tag">{t}</span>)}</div>
                </button>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
      <ProjectDialog project={sel} onClose={close} />
    </section>
  );
}
