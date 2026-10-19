"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Splash() {
  const ref = useRef(null);
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tl = gsap.timeline({ onComplete: () => setGone(true) });
    if (!still) tl.from(".sp-in", { y: 24, opacity: 0, duration: 0.7, stagger: 0.12, ease: "power3.out" });
    tl.to(ref.current, { opacity: 0, duration: 0.6, delay: still ? 0 : 0.5 });
    return () => tl.kill();
  }, []);
  if (gone) return null;
  return (
    <div ref={ref} className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a]">
      <img src="/assets/images/logo.png" alt="" className="sp-in h-20 w-auto" />
      <p className="sp-in mt-6 font-heading text-2xl tracking-wide text-silver">Saad Naeem</p>
    </div>
  );
}
