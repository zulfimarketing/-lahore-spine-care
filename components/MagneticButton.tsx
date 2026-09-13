"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";

export default function MagneticButton({
  href,
  children,
  variant = "primary",
  className,
  type,
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent) {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPos({ x: x * 0.25, y: y * 0.25 });
  }
  function handleMouseLeave() {
    setPos({ x: 0, y: 0 });
  }

  const classes = clsx(
    "inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium transition-colors duration-300",
    variant === "primary" &&
      "bg-gold text-bg-primary hover:bg-gold-bright",
    variant === "ghost" &&
      "border border-gold-line text-ink-primary hover:border-gold hover:bg-white/[0.03]",
    className
  );

  const content = (
    <div
      ref={ref}
      data-cursor="hover"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      <span
        className={classes}
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px)`,
          transition: "transform 0.2s ease-out",
          pointerEvents: "none",
        }}
      >
        {children}
      </span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {content}
      </Link>
    );
  }
  return (
    <button type={type ?? "button"} onClick={onClick} className="inline-block">
      {content}
    </button>
  );
}
