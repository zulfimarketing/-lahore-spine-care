"use client";

import { useEffect, useRef } from "react";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
};

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const isMobile = width < 768;
    const NODE_COUNT = isMobile ? 16 : 55;
    const LINK_DIST = isMobile ? 110 : 150;
    const MOUSE_RADIUS = 160;

    let mouse = { x: -9999, y: -9999 };
    let nodes: Node[] = [];

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = width + "px";
      canvas!.style.height = height + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initNodes() {
      nodes = Array.from({ length: NODE_COUNT }).map(() => {
        // bias nodes toward top corners, like reference image
        const topBias = Math.random() < 0.65;
        const x = Math.random() * width;
        const y = topBias
          ? Math.random() * height * 0.45
          : Math.random() * height;
        return {
          x,
          y,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.6 + 0.8,
        };
      });
    }

    resize();
    initNodes();

    function onMouseMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    function onMouseLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }
    window.addEventListener("resize", resize);
    if (!reduceMotion) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseleave", onMouseLeave);
    }

    let raf = 0;
    let running = !document.hidden;

    function draw() {
      if (!running) return;
      ctx!.clearRect(0, 0, width, height);

      for (const n of nodes) {
        if (!reduceMotion) {
          n.x += n.vx;
          n.y += n.vy;

          // gentle parallax pull toward mouse proximity
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_RADIUS) {
            n.x -= dx * 0.01;
            n.y -= dy * 0.01;
          }

          if (n.x < -20) n.x = width + 20;
          if (n.x > width + 20) n.x = -20;
          if (n.y < -20) n.y = height + 20;
          if (n.y > height + 20) n.y = -20;
        }
      }

      // links
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            const opacity = (1 - dist / LINK_DIST) * 0.35;
            ctx!.strokeStyle = `rgba(201,154,74,${opacity})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }

      // nodes
      for (const n of nodes) {
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(212,165,72,0.9)";
        ctx!.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    function onVisibilityChange() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
        raf = 0;
      } else {
        running = true;
        raf = requestAnimationFrame(draw);
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    if (running) draw();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 bg-bg-primary"
      style={{
        background:
          "radial-gradient(60% 50% at 15% 10%, rgba(90,60,10,0.35), transparent 60%), radial-gradient(50% 45% at 85% 15%, rgba(90,60,10,0.28), transparent 60%), #0a0906",
      }}
    >
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}
