"use client";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectDialog({ project, onClose }) {
  const ref = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!project) return;
    const opener = document.activeElement;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab" || !ref.current) return;
      const f = ref.current.querySelectorAll("a[href], button:not([disabled])");
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; opener?.focus?.(); };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-8"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div ref={ref} role="dialog" aria-modal="true" aria-label={project.title} onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 40, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-h-full w-full max-w-4xl overflow-y-auto rounded-md border border-line bg-ink">
            <button ref={closeRef} onClick={onClose} aria-label="Close project details"
              className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-ink/80 text-xl backdrop-blur hover:bg-red">✕</button>
            <img src={`/assets/images/${project.img}.webp`} alt={project.alt} className="aspect-[16/8] w-full border-b border-line object-cover object-top" />
            <div className="p-6 sm:p-10">
              <p className="kicker">{project.group}</p>
              <h3 className="display mt-2 text-5xl sm:text-6xl">{project.title}</h3>
              <p className="mt-5 max-w-2xl text-base">{project.desc}</p>
              {project.features && (
                <ul className="mt-6 space-y-2 text-sm">
                  {project.features.map((f) => <li key={f} className="flex gap-3"><span className="text-red">▸</span><span className="text-paper/80">{f}</span></li>)}
                </ul>
              )}
              <div className="mt-6 flex flex-wrap gap-2">{project.tech.map((t) => <span key={t} className="tag">{t}</span>)}</div>
              <div className="mt-8 flex flex-wrap gap-3">
                {project.live && <a href={project.live} target="_blank" rel="noopener noreferrer" className="btn btn-red">Live demo ↗</a>}
                {project.code && <a href={project.code} target="_blank" rel="noopener noreferrer" className="btn">GitHub ↗</a>}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
