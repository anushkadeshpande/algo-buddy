"use client";

import { useRef, useCallback } from "react";

export function useConfetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const shoot = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    c.width = window.innerWidth;
    c.height = window.innerHeight;

    const cols = ["#38bdf8", "#4ade80", "#facc15", "#f472b6", "#818cf8", "#c084fc"];
    const particles = Array.from({ length: 150 }, () => ({
      x: Math.random() * c.width,
      y: -10 - Math.random() * 200,
      vx: (Math.random() - 0.5) * 6,
      vy: Math.random() * 4 + 2,
      sz: Math.random() * 6 + 3,
      co: cols[~~(Math.random() * cols.length)],
      r: Math.random() * 360,
      rs: (Math.random() - 0.5) * 10,
      l: 1,
    }));

    let frame = 0;
    function go() {
      if (!ctx || !c) return;
      ctx.clearRect(0, 0, c.width, c.height);
      let alive = false;
      particles.forEach((p) => {
        if (p.l <= 0) return;
        alive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.r += p.rs;
        p.l -= 0.008;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.r * Math.PI) / 180);
        ctx.fillStyle = p.co;
        ctx.globalAlpha = p.l;
        ctx.fillRect(-p.sz / 2, -p.sz / 2, p.sz, p.sz * 0.6);
        ctx.restore();
      });
      if (alive && frame++ < 300) requestAnimationFrame(go);
      else ctx.clearRect(0, 0, c.width, c.height);
    }
    go();
  }, []);

  const ConfettiCanvas = useCallback(
    () => <canvas ref={canvasRef} id="confetti-canvas" />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return { shoot, ConfettiCanvas };
}
