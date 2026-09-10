"use client";

import { useEffect, useRef } from "react";

type Seed = {
  x: number; y: number;
  vx: number; vy: number;
  len: number; wid: number;
  rot: number; spin: number;
  tone: number;
  drift: number;
};

const TONES = [
  "rgba(168, 201, 122, 0.55)", // pistachio deep
  "rgba(203, 227, 164, 0.60)", // pistachio
  "rgba(232, 220, 205, 0.65)", // clay
  "rgba(43, 58, 31, 0.16)",    // forest, barely there
];

/**
 * Drifting seed field.
 *
 * Seeds rise slowly and scatter away from wherever the pointer or finger is.
 * Tapping pushes a ripple outward. It's meant to reward idle fiddling on a
 * page whose only other job is to make people wait.
 *
 * Everything is one canvas and one rAF loop — no DOM per particle. Density
 * scales with viewport area and is capped hard on small screens, the loop
 * stops while the tab is hidden, and `prefers-reduced-motion` paints a single
 * still frame instead of animating.
 */
export function SeedField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let seeds: Seed[] = [];
    let raf = 0;
    let running = true;

    // Pointer lives in CSS pixels; -1 means "no pointer near the canvas".
    const pointer = { x: -1, y: -1, active: false };
    const ripples: { x: number; y: number; r: number; life: number }[] = [];

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const build = () => {
      const area = w * h;
      // ~1 seed per 9000 css px², clamped so phones stay cheap and huge
      // monitors don't turn into a snow globe.
      const count = Math.round(Math.min(110, Math.max(26, area / 9000)));
      seeds = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: rand(-0.09, 0.09),
        vy: rand(-0.22, -0.05),
        len: rand(7, 16),
        wid: rand(2.2, 4.4),
        rot: Math.random() * Math.PI,
        spin: rand(-0.004, 0.004),
        tone: Math.floor(Math.random() * TONES.length),
        drift: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (const r of ripples) {
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(168, 201, 122, ${0.28 * r.life})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      for (const s of seeds) {
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rot);
        ctx.beginPath();
        ctx.ellipse(0, 0, s.wid, s.len / 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = TONES[s.tone];
        ctx.fill();
        ctx.restore();
      }
    };

    const step = () => {
      for (const s of seeds) {
        s.drift += 0.006;
        s.x += s.vx + Math.sin(s.drift) * 0.16;
        s.y += s.vy;
        s.rot += s.spin;

        if (pointer.active) {
          const dx = s.x - pointer.x;
          const dy = s.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          const R = 130;
          if (d2 < R * R && d2 > 0.01) {
            const d = Math.sqrt(d2);
            // Falls off with distance so the edge of the field is soft.
            const push = (1 - d / R) * 0.9;
            s.vx += (dx / d) * push * 0.5;
            s.vy += (dy / d) * push * 0.5;
            s.spin += push * 0.001;
          }
        }

        for (const r of ripples) {
          const dx = s.x - r.x;
          const dy = s.y - r.y;
          const d = Math.hypot(dx, dy) || 0.01;
          const band = Math.abs(d - r.r);
          if (band < 34) {
            const push = (1 - band / 34) * r.life * 0.7;
            s.vx += (dx / d) * push;
            s.vy += (dy / d) * push;
          }
        }

        // Ease back toward the base drift so pushes decay instead of
        // accelerating forever.
        s.vx *= 0.97;
        s.vy = s.vy * 0.97 + -0.13 * 0.03;

        const m = 24;
        if (s.x < -m) s.x = w + m;
        if (s.x > w + m) s.x = -m;
        if (s.y < -m) { s.y = h + m; s.x = Math.random() * w; }
        if (s.y > h + m) s.y = -m;
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].r += 7;
        ripples[i].life -= 0.022;
        if (ripples[i].life <= 0) ripples.splice(i, 1);
      }
    };

    const loop = () => {
      if (!running) return;
      step();
      draw();
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onLeave = () => { pointer.active = false; };
    const onDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      ripples.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, r: 6, life: 1 });
      if (ripples.length > 5) ripples.shift();
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (running && !still) {
        raf = requestAnimationFrame(loop);
      } else {
        cancelAnimationFrame(raf);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    if (still) {
      draw();
    } else {
      // Listen on window so the field reacts even though the canvas sits
      // behind the content and never receives the events itself.
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      window.addEventListener("pointerleave", onLeave);
      raf = requestAnimationFrame(loop);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
