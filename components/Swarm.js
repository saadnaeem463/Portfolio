"use client";
import { useEffect, useRef } from "react";

/*
  Swarm build engine
  - The page loads with every [data-build] block hidden (html.build).
  - Agents (labelled cursors) fly to each visible, unbuilt block, drag a selection box over it and
    reveal it as the box grows. They only ever work on blocks currently on screen, top-down.
  - When nothing is left to build they circle in the bottom-left corner. Once every block is built
    the page reports "done" (a Go live button appears) and nothing is ever rebuilt unless Replay is pressed.
  Performance: rects are measured once per claim (not per frame), one canvas, ~7 agents, no per-frame layout reads.
*/
const AGENTS = [["Saad", "#e32b3c"], ["React", "#61dafb"], ["Next.js", "#f2efeb"], ["Node", "#7cc576"], ["Mongo", "#4fb55b"], ["Python", "#ffd43b"], ["PyTorch", "#ee4c2c"]];
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const rrect = (ctx, x, y, w, h, r) => { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); };

export default function Swarm({ phase, run, onDone, onCount }) {
  const ref = useRef(null);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const cb = useRef({ onDone, onCount });
  cb.current = { onDone, onCount };

  useEffect(() => {
    if (phaseRef.current === "live") return;
    window.__swarmStarted = true;
    document.documentElement.classList.add("build");
    const c = ref.current, ctx = c.getContext("2d");
    c.style.display = "";
    let w, h, raf, last = performance.now(), lastCheck = 0, exitT = 0, doneFired = false;
    const t0 = last;
    const resize = () => { const d = Math.min(window.devicePixelRatio || 1, 1.5); w = innerWidth; h = innerHeight; c.width = Math.round(w * d); c.height = Math.round(h * d); ctx.setTransform(d, 0, 0, d, 0, 0); };
    resize();
    addEventListener("resize", resize);

    const claimed = new Set();
    const pulses = [];
    const agents = AGENTS.map(([name, color], i) => ({
      name, color, x: w / 2, y: h / 2, vx: 0, vy: 0, state: "idle", el: null, t: 0, dur: 1, wait: 1.0 + i * 0.07,
      ang: (i / AGENTS.length) * Math.PI * 2, px: 0, py: 0, bw: 0, bh: 0, alpha: 1, trail: [],
    }));

    let pending = 0;
    const pick = () => {
      let best = null, bt = 1e9, n = 0;
      const look = Math.min(220, h * 0.25); // start a little ahead of the viewport so fast scrolling rarely shows blanks
      document.querySelectorAll("[data-build]:not(.built)").forEach((el) => {
        if (claimed.has(el)) return;
        const r = el.getBoundingClientRect();
        if (r.width < 4 || r.height < 4 || r.bottom < 64 || r.top > h + look) return;
        n++;
        if (r.top < bt) { bt = r.top; best = el; }
      });
      pending = n;
      return best;
    };
    const finishEl = (a) => {
      const el = a.el; if (!el) return;
      el.classList.add("built"); el.style.opacity = ""; el.style.clipPath = "";
      claimed.delete(el);
      pulses.push({ x: clamp(a.px + a.bw, 0, w), y: clamp(a.py - scrollY + a.bh, 0, h), t: 0, color: a.color });
    };

    const cursor = (a, label) => {
      ctx.save(); ctx.globalAlpha = a.alpha; ctx.translate(a.x, a.y);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 17); ctx.lineTo(4.5, 13); ctx.lineTo(8, 20.5); ctx.lineTo(11, 19); ctx.lineTo(7.6, 12); ctx.lineTo(13, 12); ctx.closePath();
      ctx.fillStyle = a.color; ctx.strokeStyle = "#090909"; ctx.lineWidth = 1.2; ctx.fill(); ctx.stroke();
      if (label) {
        ctx.font = "700 11px Manrope, system-ui, sans-serif";
        const tw = ctx.measureText(a.name).width + 14;
        ctx.fillStyle = a.color; rrect(ctx, 12, 20, tw, 20, 10); ctx.fill();
        ctx.fillStyle = "#090909"; ctx.textBaseline = "middle"; ctx.fillText(a.name, 19, 30.5);
      }
      ctx.restore();
    };

    const frame = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05); last = now;
      const sy = window.scrollY, ph = phaseRef.current, exiting = ph === "live";
      ctx.clearRect(0, 0, w, h);
      if (exiting) { exitT += dt; if (exitT > 0.9) { c.style.display = "none"; return; } }

      // progress + completion (throttled, cheap class-based check)
      if (ph === "building" && now - lastCheck > 250) {
        lastCheck = now;
        const total = document.querySelectorAll("[data-build]").length;
        const left = document.querySelectorAll("[data-build]:not(.built)").length;
        cb.current.onCount && cb.current.onCount(total - left, total);
        if (total > 0 && left === 0 && !doneFired && now - t0 > 1500) { doneFired = true; cb.current.onDone && cb.current.onDone(); }
      }

      const intro = now - t0 < 1000;
      const cornerX = 74, cornerY = h - 84;
      const boxes = [];
      for (const a of agents) {
        let tx = a.x, ty = a.y, spring = true;
        if (exiting) {
          const dx = a.x - w / 2, dy = a.y - h / 2, d = Math.hypot(dx, dy) || 1;
          a.vx += (dx / d) * 1400 * dt; a.vy += (dy / d) * 1400 * dt; a.alpha = Math.max(0, 1 - exitT / 0.8); spring = false;
        } else if (a.state === "idle") {
          if (!intro && ph === "building") {
            a.wait -= dt;
            if (a.wait <= 0) {
              const el = pick();
              if (el) { const r = el.getBoundingClientRect(); a.el = el; claimed.add(el); a.px = r.left; a.py = r.top + sy; a.t = 0; a.state = "seek"; }
              else a.wait = 0.15;
            }
          }
          const cx = intro ? w / 2 : cornerX, cy = intro ? h / 2 : cornerY, rad = intro ? 80 : 34;
          const ang = now / (intro ? 500 : 800) + a.ang;
          tx = cx + Math.cos(ang) * rad; ty = cy + Math.sin(ang) * rad * 0.8;
        }
        if (a.state === "seek") {
          a.t += dt;
          tx = clamp(a.px, 8, w - 8); ty = clamp(a.py - sy, 70, h - 30);
          if (Math.hypot(a.x - tx, a.y - ty) < 14 || a.t > 1.4) {
            const r = a.el.getBoundingClientRect();
            a.px = r.left; a.py = r.top + sy; a.bw = r.width; a.bh = r.height; a.t = 0;
            a.dur = clamp(0.45 + (a.bw + a.bh) / 2600, 0.45, 1.1) / (1 + Math.min(pending, 5) * 0.3); a.state = "drag";
          }
        }
        if (a.state === "drag") {
          a.t += dt; const p = ease(Math.min(a.t / a.dur, 1)); a.p = p; spring = false;
          a.el.style.opacity = "1"; a.el.style.clipPath = `inset(0 ${(1 - p) * 100}% ${(1 - p) * 100}% 0)`;
          a.x = clamp(a.px + a.bw * p, 8, w - 8); a.y = clamp(a.py - sy + a.bh * p, 70, h - 24); a.vx = a.vy = 0;
          boxes.push([a, 1]);
          if (a.t >= a.dur) { finishEl(a); a.state = "fade"; a.t = 0; }
        } else if (a.state === "fade") {
          a.t += dt; a.p = 1; boxes.push([a, 1 - a.t / 0.35]);
          if (a.t >= 0.35) { a.el = null; a.state = "idle"; a.wait = 0.02; }
        }
        if (spring) {
          a.vx += (70 * (tx - a.x) - 14 * a.vx) * dt; a.vy += (70 * (ty - a.y) - 14 * a.vy) * dt;
          for (const o of agents) { if (o === a) continue; const dx = a.x - o.x, dy = a.y - o.y, d = Math.hypot(dx, dy) || 1; if (d < 30) { a.vx += (dx / d) * 260 * dt; a.vy += (dy / d) * 260 * dt; } }
          a.x += a.vx * dt; a.y += a.vy * dt;
        } else if (exiting) { a.x += a.vx * dt; a.y += a.vy * dt; }
        a.trail.push(a.x, a.y); if (a.trail.length > 12) a.trail.splice(0, 2);
      }

      // selection boxes (under cursors)
      for (const [a, fade] of boxes) {
        const x = a.px, y = a.py - sy, bw = a.bw * a.p, bh = a.bh * a.p;
        if (y + a.bh < 0 || y > h) continue;
        ctx.save(); ctx.globalAlpha = clamp(fade, 0, 1);
        ctx.strokeStyle = a.color; ctx.lineWidth = 1.5; ctx.strokeRect(x, y, bw, bh);
        ctx.fillStyle = "#fff"; ctx.lineWidth = 1;
        [[x, y], [x + bw, y], [x, y + bh], [x + bw, y + bh]].forEach(([hx, hy]) => { ctx.fillRect(hx - 3, hy - 3, 6, 6); ctx.strokeRect(hx - 3, hy - 3, 6, 6); });
        const label = `${Math.round(a.bw * a.p)} × ${Math.round(a.bh * a.p)}`;
        ctx.font = "700 10px Manrope, system-ui, sans-serif"; const tw = ctx.measureText(label).width + 12;
        const ly = clamp(y + bh + 8, 70, h - 26);
        ctx.fillStyle = a.color; rrect(ctx, x + bw / 2 - tw / 2, ly, tw, 18, 4); ctx.fill();
        ctx.fillStyle = "#090909"; ctx.textBaseline = "middle"; ctx.fillText(label, x + bw / 2 - tw / 2 + 6, ly + 9.5);
        ctx.restore();
      }
      // completion pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i]; p.t += dt; if (p.t > 0.5) { pulses.splice(i, 1); continue; }
        ctx.save(); ctx.globalAlpha = 1 - p.t / 0.5; ctx.strokeStyle = p.color; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(p.x, p.y, 6 + p.t * 70, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      }
      // cursors + short comet trails
      for (const a of agents) {
        const moving = a.state !== "idle" || intro || exiting;
        if (moving) { ctx.save(); for (let i = 0; i < a.trail.length; i += 2) { ctx.globalAlpha = (i / a.trail.length) * 0.35 * a.alpha; ctx.fillStyle = a.color; ctx.beginPath(); ctx.arc(a.trail[i], a.trail[i + 1], 2 + i / 6, 0, 6.3); ctx.fill(); } ctx.restore(); }
        cursor(a, moving);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf); removeEventListener("resize", resize);
      claimed.forEach((el) => { el.style.opacity = ""; el.style.clipPath = ""; });
    };
  }, [run]);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[55] h-full w-full" />;
}
