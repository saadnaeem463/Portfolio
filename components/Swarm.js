"use client";
import { useEffect, useRef } from "react";

/*
  Swarm build engine
  - The page loads with every [data-build] block hidden (html.build). Buttons, icons, tags, tiles and form
    fields are all separate blocks, so a swarm of agents can work on many small pieces at once.
  - Agents (labelled cursors) fly to an unbuilt block near the viewport, drag a selection box over it and
    reveal it as the box grows. One shared scan (every ~90 ms) hands out work, so 16 agents stay cheap.
  - Auto-tour: the page scrolls itself down while the agents build (it waits while anything on screen is
    unbuilt), then glides back to the top. Touch / wheel / click / navigation keys give control back.
  - When everything is built the agents circle in the bottom-left corner and the page reports "done"
    (Go live button). Nothing is rebuilt unless Replay is pressed.
*/
const AGENTS = [
  ["Saad", "#e32b3c"], ["React", "#61dafb"], ["Next.js", "#f2efeb"], ["Node", "#7cc576"], ["Mongo", "#4fb55b"], ["Python", "#ffd43b"], ["PyTorch", "#ee4c2c"], ["Express", "#b6b6b6"],
  ["TypeScript", "#3b82f6"], ["Tailwind", "#38bdf8"], ["Git", "#f97316"], ["MySQL", "#00a3d9"], ["Pandas", "#c084fc"], ["NumPy", "#6ea8ff"], ["TensorFlow", "#ff9f1c"], ["Postgres", "#7aa7d9"],
];
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const rrect = (ctx, x, y, w, h, r) => { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); };

export default function Swarm({ phase, run, onDone, onCount, onAuto }) {
  const ref = useRef(null);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const cb = useRef({ onDone, onCount, onAuto });
  cb.current = { onDone, onCount, onAuto };

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

    // --- auto-tour: the page scrolls itself down while the agents build, then glides back to the top ---
    const root = document.documentElement;
    let auto = true, autoY = window.scrollY, speed = 0, ret = null, holdSince = 0, lastSweep = 0;
    root.style.scrollBehavior = "auto"; // CSS smooth-scroll would fight the per-frame scrolling
    cb.current.onAuto && cb.current.onAuto(true);
    const stopAuto = () => { if (!auto && !ret) return; auto = false; ret = null; root.style.scrollBehavior = ""; cb.current.onAuto && cb.current.onAuto(false); };
    const onKey = (e) => { if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(e.key)) stopAuto(); };
    addEventListener("wheel", stopAuto, { passive: true });
    addEventListener("touchstart", stopAuto, { passive: true });
    addEventListener("pointerdown", stopAuto, { passive: true });
    addEventListener("keydown", onKey);

    const claimed = new Set();
    const pulses = [];
    const fades = [];
    const N = w < 600 ? 12 : AGENTS.length; // slightly smaller swarm on phones
    const agents = AGENTS.slice(0, N).map(([name, color], i) => ({
      idx: i, name, color, x: w / 2, y: h / 2, vx: 0, vy: 0, state: "idle", el: null, t: 0, dur: 1, wait: 1.0 + i * 0.04,
      ang: (i / N) * Math.PI * 2, px: 0, py: 0, bw: 0, bh: 0, p: 0, alpha: 1, trail: [],
    }));

    // --- one shared scan hands out work (instead of every agent measuring the page) ---
    let scanT = -1e9, queue = [], holdNow = false, pending = 0;
    const scan = (now) => {
      if (now - scanT < 90) return;
      scanT = now;
      const look = auto ? Math.min(360, h * 0.4) : Math.min(220, h * 0.25); // start a little ahead of the viewport so fast scrolling rarely shows blanks
      const q = []; let hold = false;
      document.querySelectorAll("[data-build]:not(.built)").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width < 4 || r.height < 4) { el.classList.add("built"); return; } // nothing to see -> never blocks completion
        if (r.bottom > 70 && r.top < h * 0.78) hold = true;
        if (claimed.has(el) || r.bottom < 64 || r.top > h + look) return;
        q.push([Math.round(r.top / 10) * 100000 + r.left, el]);
      });
      q.sort((a, b) => a[0] - b[0]);
      queue = q.map((x) => x[1]); pending = queue.length; holdNow = hold;
    };
    const pick = () => { while (queue.length) { const el = queue.shift(); if (!claimed.has(el) && !el.classList.contains("built")) return el; } return null; };

    const finishEl = (a) => {
      const el = a.el; if (!el) return;
      el.classList.add("built"); el.style.opacity = ""; el.style.clipPath = "";
      claimed.delete(el);
      fades.push({ px: a.px, py: a.py, bw: a.bw, bh: a.bh, color: a.color, t: 0 });
      pulses.push({ x: clamp(a.px + a.bw, 0, w), y: clamp(a.py - window.scrollY + a.bh, 0, h), t: 0, color: a.color });
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
      let sy = window.scrollY;
      const ph = phaseRef.current, exiting = ph === "live";
      ctx.clearRect(0, 0, w, h);
      if (exiting) { exitT += dt; if (exitT > 0.9) { c.style.display = "none"; return; } }
      if (exiting && (auto || ret)) stopAuto();
      if (ph === "building" && !exiting) scan(now);

      if (ret) {
        ret.t += dt; const p = ease(Math.min(ret.t / ret.dur, 1));
        window.scrollTo(0, ret.from + (ret.to - ret.from) * p); sy = window.scrollY;
        if (ret.t >= ret.dur) {
          if (ret.end) { ret = null; auto = false; root.style.scrollBehavior = ""; cb.current.onAuto && cb.current.onAuto(false); }
          else { ret = null; autoY = sy; speed = 0; }
        }
      } else if (auto && ph === "building" && now - t0 > 1500) {
        // hold while anything unbuilt is still on screen, otherwise glide on to the next block
        if (holdNow) { if (!holdSince) holdSince = now; } else holdSince = 0;
        const hold = holdNow && !(holdSince && now - holdSince > 6000); // never stall forever
        const target = hold ? 0 : clamp(h * 0.85, 400, 780);
        // safety net: at the very bottom with blocks still unbuilt above? go back up to the first one, then continue
        if (!hold && autoY >= root.scrollHeight - h - 2 && now - lastSweep > 1500) {
          let first = null, ft = 1e9;
          document.querySelectorAll("[data-build]:not(.built)").forEach((el) => { const r = el.getBoundingClientRect(); if (r.height >= 4 && r.top + sy < ft) { ft = r.top + sy; first = el; } });
          if (first) { lastSweep = now; ret = { from: sy, to: Math.max(0, ft - 140), end: false, t: 0, dur: clamp(0.7 + Math.abs(sy - ft) / 3000, 0.8, 1.8) }; }
        }
        speed += (target - speed) * Math.min(1, dt * 5);
        if (speed > 2) { autoY += speed * dt; window.scrollTo(0, autoY); sy = window.scrollY; if (Math.abs(sy - autoY) > 2) autoY = sy; }
        else autoY = sy;
      }

      // progress + completion (throttled, cheap class-based check)
      if (ph === "building" && now - lastCheck > 250) {
        lastCheck = now;
        const total = document.querySelectorAll("[data-build]").length;
        const left = document.querySelectorAll("[data-build]:not(.built)").length;
        cb.current.onCount && cb.current.onCount(total - left, total);
        if (total > 0 && left === 0 && !doneFired && now - t0 > 1500) {
          doneFired = true;
          if (auto && window.scrollY > 40) ret = { from: window.scrollY, to: 0, end: true, t: 0, dur: clamp(0.9 + window.scrollY / 3500, 1, 2.2) };
          cb.current.onDone && cb.current.onDone();
        }
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
              else a.wait = 0.1;
            }
          }
          // two counter-rotating rings: centre of the screen while assembling, the corner once idle
          const ring = a.idx % 2, waiting = ph === "building"; // while building, idle agents wait low-centre, close to where the next blocks appear
          const cx = intro || waiting ? w / 2 : cornerX, cy = intro ? h / 2 : waiting ? h - 96 : cornerY;
          const rad = intro ? (ring ? 120 : 70) : waiting ? (ring ? 120 : 64) : (ring ? 54 : 32);
          const ang = (ring ? -1 : 1) * now / (intro ? 520 : 800) + a.ang;
          tx = cx + Math.cos(ang) * rad; ty = cy + Math.sin(ang) * rad * 0.8;
        }
        if (a.state === "seek") {
          a.t += dt;
          tx = clamp(a.px, 8, w - 8); ty = clamp(a.py - sy, 70, h - 30);
          if (Math.hypot(a.x - tx, a.y - ty) < 14 || a.t > 1.4) {
            const r = a.el.getBoundingClientRect();
            a.px = r.left; a.py = r.top + sy; a.bw = r.width; a.bh = r.height; a.t = 0;
            a.dur = clamp(0.24 + (a.bw + a.bh) / 2800, 0.24, 1.0) / (1 + Math.min(pending, 8) * 0.15); a.state = "drag";
          }
        }
        if (a.state === "drag") {
          a.t += dt; const p = ease(Math.min(a.t / a.dur, 1)); a.p = p; spring = false;
          a.el.style.opacity = "1"; a.el.style.clipPath = `inset(0 ${(1 - p) * 100}% ${(1 - p) * 100}% 0)`;
          a.x = clamp(a.px + a.bw * p, 8, w - 8); a.y = clamp(a.py - sy + a.bh * p, 70, h - 24); a.vx = a.vy = 0;
          boxes.push(a);
          if (a.t >= a.dur) { finishEl(a); a.el = null; a.state = "idle"; a.wait = 0; }
        }
        if (spring) {
          a.vx += (95 * (tx - a.x) - 17 * a.vx) * dt; a.vy += (95 * (ty - a.y) - 17 * a.vy) * dt;
          if (a.state === "seek") for (const o of agents) { if (o === a) continue; const dx = a.x - o.x, dy = a.y - o.y, d = Math.hypot(dx, dy) || 1; if (d < 26) { a.vx += (dx / d) * 240 * dt; a.vy += (dy / d) * 240 * dt; } }
          a.x += a.vx * dt; a.y += a.vy * dt;
        } else if (exiting) { a.x += a.vx * dt; a.y += a.vy * dt; }
        a.trail.push(a.x, a.y); if (a.trail.length > 10) a.trail.splice(0, 2);
      }

      // selection boxes being dragged (under cursors)
      for (const a of boxes) {
        const x = a.px, y = a.py - sy, bw = a.bw * a.p, bh = a.bh * a.p;
        if (y + a.bh < 0 || y > h) continue;
        ctx.save();
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
      // finished boxes fade out on their own (the agent has already moved on)
      for (let i = fades.length - 1; i >= 0; i--) {
        const f = fades[i]; f.t += dt; if (f.t > 0.3) { fades.splice(i, 1); continue; }
        ctx.save(); ctx.globalAlpha = 1 - f.t / 0.3; ctx.strokeStyle = f.color; ctx.lineWidth = 1.5; ctx.strokeRect(f.px, f.py - sy, f.bw, f.bh); ctx.restore();
      }
      // completion pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i]; p.t += dt; if (p.t > 0.45) { pulses.splice(i, 1); continue; }
        ctx.save(); ctx.globalAlpha = 1 - p.t / 0.45; ctx.strokeStyle = p.color; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(p.x, p.y, 5 + p.t * 60, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
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
      removeEventListener("wheel", stopAuto); removeEventListener("touchstart", stopAuto); removeEventListener("pointerdown", stopAuto); removeEventListener("keydown", onKey);
      root.style.scrollBehavior = ""; cb.current.onAuto && cb.current.onAuto(false);
      claimed.forEach((el) => { el.style.opacity = ""; el.style.clipPath = ""; });
    };
  }, [run]);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[55] h-full w-full" />;
}
