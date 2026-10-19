"use client";
import { useEffect, useState } from "react";
import { site } from "../data/site";

const links = [["About", "about"], ["Projects", "projects"], ["Tech", "tech"], ["Contributions", "contributions"], ["Education", "education"], ["Contact", "contact"]];

export default function Navbar() {
  const [active, setActive] = useState("about");
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 20);
    onScroll(); window.addEventListener("scroll", onScroll);
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-40% 0px -55% 0px" });
    links.forEach(([, id]) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => { window.removeEventListener("scroll", onScroll); io.disconnect(); };
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition ${solid ? "border-b border-white/10 bg-bg/80 backdrop-blur-md" : ""}`}>
      <div className="wrap flex h-[70px] items-center justify-between">
        <a href="#top" aria-label="Go to top" className="flex items-center gap-3">
          <img src="/assets/images/logo.png" alt="Saad Naeem logo" className="h-9 w-auto" />
          <span className="font-heading text-lg font-semibold max-sm:hidden">{site.name}</span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map(([l, id]) => (
            <a key={id} href={`#${id}`} className={`font-label text-sm transition hover:text-white ${active === id ? "text-white" : "text-txt-muted"}`}>{l}</a>
          ))}
        </nav>
        <button className="md:hidden" aria-label="Toggle menu" onClick={() => setOpen(!open)}>
          <span className="block h-0.5 w-6 bg-white" /><span className="mt-1.5 block h-0.5 w-6 bg-white" /><span className="mt-1.5 block h-0.5 w-6 bg-white" />
        </button>
      </div>
      {open && (
        <div className="border-t border-white/10 bg-bg/95 px-6 py-4 backdrop-blur-md md:hidden">
          {links.map(([l, id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="block py-3 font-label text-txt-2">{l}</a>)}
        </div>
      )}
    </header>
  );
}
