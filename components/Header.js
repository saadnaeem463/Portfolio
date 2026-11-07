"use client";
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { site } from "../data/site";

const links = [["Work", "projects"], ["About", "about"], ["Stack", "tech"], ["Activity", "contributions"], ["Contact", "contact"]];

export default function Header({ phase, prog, onGoLive, onReplay, onSkip }) {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
    const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  useEffect(() => {
    const onScroll = () => { setSolid(window.scrollY > 24); if (window.scrollY < 200) setActive(""); };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    links.forEach(([, id]) => { const el = document.getElementById(id); if (el) io.observe(el); });
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("keydown", onKey); io.disconnect(); };
  }, []);

  const pct = prog.total ? Math.round((prog.built / prog.total) * 100) : 0;
  const motionBtn = phase === "building" ? (
    <div className="flex items-center gap-2" role="status" aria-live="polite">
      <span className="flex min-h-[40px] items-center gap-2 rounded-full border border-line px-4 text-[11px] font-bold uppercase tracking-[.14em]">
        <span className="h-2 w-2 animate-pulse rounded-full bg-red" />
        <span className="max-sm:hidden">Building</span> {pct}%
      </span>
      <button onClick={onSkip} className="min-h-[40px] px-2 text-[11px] font-bold uppercase tracking-[.14em] text-mute hover:text-paper">Skip</button>
    </div>
  ) : phase === "done" ? (
    <motion.button key="golive" onClick={onGoLive} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 16 }} className="btn btn-red golive !min-h-[40px] !px-5 !text-[11px]">
      <span className="h-2 w-2 rounded-full bg-white" /> Go live
    </motion.button>
  ) : (
    <button onClick={onReplay} className="btn !min-h-[40px] !px-4 !text-[11px]" title="Watch the agents build this site again">↻ Replay build</button>
  );

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${solid || open ? "bg-ink border-b border-line" : ""}`}>
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <a href="#top" aria-label={`${site.name} – back to top`} className="display text-2xl tracking-wide">SAAD<span className="text-red">.</span></a>
        <nav aria-label="Primary" className="hidden items-center gap-5 md:flex lg:gap-8">
          {links.map(([l, id]) => (
            <a key={id} href={`#${id}`} aria-current={active === id ? "true" : undefined}
              className={`relative py-1 text-xs font-bold uppercase tracking-[.18em] transition-colors hover:text-paper ${active === id ? "text-paper" : "text-mute"}`}>
              {l}
              {active === id && <motion.i layoutId="nav-underline" className="absolute inset-x-0 -bottom-0.5 h-px bg-red" />}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {motionBtn}
          <a href="#contact" className="btn btn-red !min-h-[40px] !px-4 !text-[11px] max-lg:hidden">Let’s talk</a>
          <button className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 md:hidden" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
            <span className={`block h-0.5 w-6 bg-paper transition ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-6 bg-paper transition ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-paper transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>
      {open && (
        <nav aria-label="Mobile" className="wrap border-t border-line pb-6 pt-2 md:hidden">
          {links.map(([l, id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="display block py-3 text-4xl">{l}</a>)}
        </nav>
      )}
      <motion.div style={{ scaleX: progress }} className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-red" aria-hidden="true" />
    </header>
  );
}
