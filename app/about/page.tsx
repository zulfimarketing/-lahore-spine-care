import Reveal from "@/components/Reveal";
import { TIMELINE, SPECIALIZATIONS } from "@/lib/content";

export default function AboutPage() {
  return (
    <>
      <section className="pt-40 pb-20">
        <div className="container-narrow">
          <Reveal>
            <p className="eyebrow-line mb-5">About the clinic</p>
            <h1 className="font-serif text-4xl md:text-5xl max-w-2xl text-ink-primary leading-tight">
              Meet Dr. Shiza Khan
            </h1>
            <p className="mt-6 max-w-xl text-ink-secondary leading-relaxed">
              A Consultant Physiotherapist, Chiropractor and Acupuncturist with
              over five years of clinical experience. Dr. Shiza Khan previously
              served at Mayo Hospital, Lahore, and now leads Lahore Spine Care,
              offering evidence-based treatment for spine, joint and
              musculoskeletal conditions.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-narrow">
          <Reveal>
            <p className="eyebrow-line mb-10">Training and background</p>
          </Reveal>
          <div className="relative pl-8 md:pl-10">
            <div className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-gold via-gold-line to-transparent" />
            <div className="grid gap-12">
              {TIMELINE.map((t, i) => (
                <Reveal key={t.title} delay={i * 0.07}>
                  <div className="relative">
                    <span className="absolute -left-[38px] md:-left-[46px] top-1.5 w-2.5 h-2.5 rounded-full bg-gold-bright" />
                    <p className="text-xs text-ink-muted mb-1">{t.year}</p>
                    <h3 className="font-serif text-xl text-ink-primary">{t.title}</h3>
                    <p className="text-sm text-ink-secondary mt-1 max-w-md">{t.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-bg-secondary/40">
        <div className="container-narrow">
          <Reveal>
            <p className="eyebrow-line mb-6">Areas of specialization</p>
          </Reveal>
          <div className="flex flex-wrap gap-3">
            {SPECIALIZATIONS.map((s, i) => (
              <Reveal key={s} delay={i * 0.04}>
                <span className="inline-block rounded-full border border-gold-line px-5 py-2.5 text-sm text-ink-secondary">
                  {s}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
