"use client";
import { useState, useCallback } from "react";
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
  const [auto, setAuto] = useState(false);

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

  return (
    <>
      <Header phase={phase} prog={prog} onGoLive={goLive} onReplay={replay} onSkip={() => { goLive(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
      <Swarm phase={phase} run={run} onDone={onDone} onCount={(built, total) => setProg({ built, total })} onAuto={setAuto} />
      <AnimatePresence>
        {toast && (
          <motion.div key="toast" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
            className="fixed bottom-6 left-1/2 z-[56] -translate-x-1/2 rounded-full border border-line bg-ink px-5 py-3 text-xs font-bold uppercase tracking-[.16em]" role="status">
            <span className="mr-2 text-red">✓</span>Build complete · hit <span className="text-red">Go live</span> up top
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {auto && phase === "building" && (
          <motion.div key="auto" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
            className="fixed bottom-6 left-1/2 z-[56] -translate-x-1/2 whitespace-nowrap rounded-full border border-line bg-ink px-5 py-3 text-xs font-bold uppercase tracking-[.16em] max-sm:px-4 max-sm:text-[10px]" role="status">
            <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-red" />Auto-tour · touch or scroll to take over
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
            <div className="mb-12">
              <p data-build className="kicker mb-3 w-fit">04 — Activity</p>
              <h2 data-build className="display w-fit text-[clamp(3rem,8vw,7rem)]">Contribution <span className="outline-text">graph</span></h2>
            </div>
            <Reveal><Contributions /></Reveal>
          </div>
        </section>
        <section id="contact" className="sec rule">
          <div className="wrap">
            <div className="mb-14">
              <p data-build className="kicker mb-3 w-fit">05 — Contact</p>
              <h2 data-build className="display w-fit text-[clamp(3.2rem,11vw,10rem)]">Let’s build<br /><span className="text-red">something.</span></h2>
            </div>
            <Contact />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
