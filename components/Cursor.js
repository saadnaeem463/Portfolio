"use client";
import { useEffect, useRef } from "react";

// Soft ring that trails the mouse (desktop only).
export default function Cursor() {
  const ref = useRef(null);
  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    const el = ref.current; let x = 0, y = 0, tx = 0, ty = 0, raf;
    const move = (e) => { tx = e.clientX; ty = e.clientY; el.style.opacity = 1; };
    const loop = () => { x += (tx - x) * 0.18; y += (ty - y) * 0.18; el.style.transform = `translate(${x - 14}px, ${y - 14}px)`; raf = requestAnimationFrame(loop); };
    window.addEventListener("mousemove", move); loop();
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);
  return <div ref={ref} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[90] h-7 w-7 rounded-full border border-silver/60 opacity-0 max-md:hidden" />;
}
