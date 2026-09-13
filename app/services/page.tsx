"use client";

import { useState } from "react";
import clsx from "clsx";
import Reveal from "@/components/Reveal";
import { CONDITIONS, CONDITION_TAGS, METHODS } from "@/lib/content";

export default function ServicesPage() {
  const [tag, setTag] = useState("All");
  const filtered =
    tag === "All" ? CONDITIONS : CONDITIONS.filter((c) => c.tag === tag);

  return (
    <>
      <section className="pt-40 pb-16">
        <div className="container-narrow">
          <Reveal>
            <p className="eyebrow-line mb-5">Services</p>
            <h1 className="font-serif text-4xl md:text-5xl max-w-2xl text-ink-primary leading-tight">
              Conditions we treat
            </h1>
          </Reveal>

          <div className="flex flex-wrap gap-3 mt-10">
            {CONDITION_TAGS.map((t) => (
              <button
                key={t}
                data-cursor="hover"
                onClick={() => setTag(t)}
                className={clsx(
                  "rounded-full px-5 py-2 text-sm border transition-colors",
                  tag === t
                    ? "bg-gold text-bg-primary border-gold"
                    : "border-gold-line text-ink-secondary hover:text-ink-primary"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-5 mt-12">
            {filtered.map((c) => (
              <Reveal key={c.name}>
                <div className="rounded-card border border-gold-line p-7 h-full">
                  <p className="text-xs text-gold-bright mb-2">{c.tag}</p>
                  <h3 className="font-serif text-lg text-ink-primary mb-2">{c.name}</h3>
                  <p className="text-sm text-ink-secondary leading-relaxed">{c.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-bg-secondary/40">
        <div className="container-narrow">
          <Reveal>
            <p className="eyebrow-line mb-6">Treatment methods</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {METHODS.map((m, i) => (
              <Reveal key={m} delay={i * 0.04}>
                <div className="border border-gold-line rounded-card px-6 py-5 text-ink-secondary text-sm">
                  {m}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
