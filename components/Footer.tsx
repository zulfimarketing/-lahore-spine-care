import Link from "next/link";
import type { ComponentType } from "react";
import { Facebook, Instagram, Linkedin, Youtube, Twitter, Music2 } from "lucide-react";
import { SOCIALS, CLINIC } from "@/lib/content";

const SOCIAL_ICONS: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  Facebook: Facebook,
  Instagram: Instagram,
  LinkedIn: Linkedin,
  YouTube: Youtube,
  X: Twitter,
  TikTok: Music2,
};

export default function Footer() {
  return (
    <footer className="border-t border-gold-line">
      <div className="container-narrow py-16 grid gap-10 md:grid-cols-3">
        <div>
          <div className="font-serif text-lg text-ink-primary mb-3">Lahore Spine Care</div>
          <p className="text-sm text-ink-secondary max-w-xs">
            Dr. Shiza Khan — Consultant Physiotherapist, Chiropractor & Acupuncturist.
          </p>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wide text-ink-muted mb-3">Clinic</div>
          <p className="text-sm text-ink-secondary leading-relaxed max-w-xs">{CLINIC.address}</p>
          <p className="text-sm text-ink-secondary mt-2">{CLINIC.phone}</p>
          <p className="text-sm text-ink-secondary">{CLINIC.hours}</p>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wide text-ink-muted mb-3">Follow</div>
          <div className="flex flex-wrap gap-3">
            {SOCIALS.map((s) => {
              const Icon = SOCIAL_ICONS[s.name];
              return (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  data-cursor="hover"
                  className="flex items-center justify-center w-9 h-9 rounded-full border border-gold-line text-ink-secondary hover:text-gold-bright hover:border-gold transition-colors"
                >
                  {Icon && <Icon size={16} />}
                </a>
              );
            })}
          </div>
        </div>
      </div>
      <div className="container-narrow pb-8 text-xs text-ink-muted">
        © {new Date().getFullYear()} Lahore Spine Care. All rights reserved.
      </div>
    </footer>
  );
}
