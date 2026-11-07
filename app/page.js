"use client";
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import Projects from "../components/Projects";
import About from "../components/About";
import Contributions from "../components/Contributions";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import Swarm from "../components/Swarm";

const root = () => document.documentElement;

export default function Home() {
  const [phase, setPhase] = useState("building"); // building -> done -> live
  const [run, setRun] = useState(0);
  const [prog, setProg] = useState({ built: 0, total: 0 });
  const [toast, setToast] = useState(false);
  const [ping, setPing] = useState(0);
  const [hint, setHint] = useState(false);

  const markAll = () => document.querySelectorAll("[data-build]").forEach((el) => { el.classList.add("built"); el.style.opacity = ""; el.style.clipPath = ""; });

  const goLive = useCallback((silent) => {
    markAll(); root().classList.remove("build");
    setPhase("live"); setToast(false);
    if (silent !== true) setPing((p) => p + 1);
  }, []);

  const onDone = useCallback(() => {
    root().classList.remove("build"); // everything is built; anything mounted later (e.g. a filter change) just shows
    setPhase("done"); setToast(true);
    setTimeout(() => setToast(false), 5000);
  }, []);

  const replay = useCallback(() => {
    document.querySelectorAll("[data-build]").forEach((el) => el.classList.remove("built"));
    root().classList.add("build");
    window.scrollTo({ top: 0, behavior: "instant" });
    setProg({ built: 0, total: 0 }); setPhase("building"); setRun((r) => r + 1);
  }, []);

  // gentle nudge: the agents only build what is on screen, so ask the visitor to scroll
  useEffect(() => {
    setHint(false);
    if (phase !== "building") return;
    const t = setTimeout(() => { if (window.scrollY < 40) setHint(true); }, 3500);
    const off = () => setHint(false);
    window.addEventListener("scroll", off, { passive: true, once: true });
    return () => { clearTimeout(t); window.removeEventListener("scroll", off); };
  }, [phase, run]);

  return (
    <>
      <Header phase={phase} prog={prog} onGoLive={goLive} onReplay={replay} onSkip={goLive} />
      <Swarm phase={phase} run={run} onDone={onDone} onCount={(built, total) => setProg({ built, total })} />
      <AnimatePresence>
        {toast && (
          <motion.div key="toast" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
            className="fixed bottom-6 left-1/2 z-[56] -translate-x-1/2 rounded-full border border-line bg-ink px-5 py-3 text-xs font-bold uppercase tracking-[.16em]" role="status">
            <span className="mr-2 text-red">✓</span>Build complete · hit <span className="text-red">Go live</span> up top
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {hint && (
          <motion.div key="hint" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
            className="fixed bottom-6 left-1/2 z-[56] -translate-x-1/2 whitespace-nowrap rounded-full border border-line bg-ink px-5 py-3 text-xs font-bold uppercase tracking-[.16em]" role="status">
            Scroll <span className="text-red">↓</span> the agents build as you go
          </motion.div>
        )}
      </AnimatePresence>
      {ping > 0 && <span key={ping} aria-hidden="true" className="pointer-events-none fixed left-1/2 top-1/2 z-[54] -ml-[40vmax] -mt-[40vmax] h-[80vmax] w-[80vmax] rounded-full border-2 border-red" style={{ animation: "ping-ring .9s ease-out forwards" }} />}
      <main>
        <Hero />
        <Marquee />
        <Projects />
        <About />
        <section id="contributions" className="sec rule">
          <div className="wrap">
            <Reveal className="mb-12">
              <p className="kicker mb-3">04 — Activity</p>
              <h2 className="display text-[clamp(3rem,8vw,7rem)]">Contribution <span className="outline-text">graph</span></h2>
            </Reveal>
            <Reveal><Contributions /></Reveal>
          </div>
        </section>
        <section id="contact" className="sec rule">
          <div className="wrap">
            <Reveal className="mb-14">
              <p className="kicker mb-3">05 — Contact</p>
              <h2 className="display text-[clamp(3.2rem,11vw,10rem)]">Let’s build<br /><span className="text-red">something.</span></h2>
            </Reveal>
            <Reveal><Contact /></Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
