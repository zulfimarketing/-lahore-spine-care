"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import MagneticButton from "./MagneticButton";

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Clinic" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled ? "backdrop-blur-md bg-bg-primary/70 border-b border-gold-line" : "bg-transparent"
      )}
    >
      <div className="container-narrow flex items-center justify-between h-20">
        <Link href="/" data-cursor="hover" className="font-serif text-lg tracking-wide text-ink-primary">
          Lahore Spine Care
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              data-cursor="hover"
              className={clsx(
                "text-sm transition-colors",
                pathname === l.href ? "text-gold-bright" : "text-ink-secondary hover:text-ink-primary"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <MagneticButton href="/book" variant="primary" className="!px-5 !py-2.5 !text-xs">
            Book Appointment
          </MagneticButton>
        </div>

        <button
          className="md:hidden text-ink-primary"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className="block w-6 h-px bg-current mb-1.5" />
          <span className="block w-6 h-px bg-current mb-1.5" />
          <span className="block w-4 h-px bg-current" />
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-bg-secondary border-t border-gold-line"
        >
          <div className="container-narrow flex flex-col gap-4 py-6">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-ink-secondary" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <Link href="/book" className="text-gold-bright" onClick={() => setOpen(false)}>
              Book Appointment →
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}
