import Image from "next/image";
import MagneticButton from "@/components/MagneticButton";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import HeroText from "@/components/HeroText";
import { STATS, TREATMENTS } from "@/lib/content";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="min-h-screen flex items-center pt-28 pb-16">
        <div className="container-narrow grid md:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
          <div>
            <p className="eyebrow-line mb-6">Lahore Spine Care</p>
            <HeroText />
            <p className="mt-7 text-ink-secondary max-w-md leading-relaxed">
              Restoring movement, relieving pain. Expert physiotherapy, chiropractic
              and acupuncture care in Lahore, shaped by years treating patients at
              Mayo Hospital and beyond.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <MagneticButton href="/book" variant="primary">
                Book an appointment
              </MagneticButton>
              <MagneticButton href="/services" variant="ghost">
                See how we treat
              </MagneticButton>
            </div>
          </div>

          <div className="relative mx-auto md:mx-0">
            <div
              className="absolute -inset-8 rounded-full blur-3xl opacity-40"
              style={{ background: "radial-gradient(circle, rgba(240,198,116,0.35), transparent 65%)" }}
            />
            <div className="relative w-[280px] h-[340px] md:w-[340px] md:h-[420px] rounded-card overflow-hidden border border-gold-line">
              <Image
                src="/images/dr-shiza.jpg"
                alt="Dr. Shiza Khan, Consultant Physiotherapist"
                fill
                sizes="340px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="border-y border-gold-line">
        <div className="container-narrow py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div>
                <Counter value={s.value} suffix={s.suffix} />
                <p className="text-sm text-ink-secondary mt-1">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="section">
        <div className="container-narrow">
          <Reveal>
            <p className="eyebrow-line mb-4">What we treat with</p>
            <h2 className="font-serif text-3xl md:text-4xl max-w-lg text-ink-primary">
              Three disciplines, one plan built around your recovery.
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6 mt-14">
            {TREATMENTS.map((t, i) => (
              <Reveal key={t.id} delay={i * 0.1}>
                <TiltCard title={t.name} desc={t.desc} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section bg-bg-secondary/40">
        <div className="container-narrow grid md:grid-cols-2 gap-14 items-start">
          <Reveal>
            <p className="eyebrow-line mb-4">Why patients choose this clinic</p>
            <h2 className="font-serif text-3xl md:text-4xl text-ink-primary max-w-md">
              Trained in the clinic, tested in practice.
            </h2>
          </Reveal>
          <div className="grid gap-6">
            {[
              "DPT, University of Lahore / UIPT, and MS in Women's Health from Riphah International University.",
              "Former physiotherapist at Mayo Hospital, Lahore.",
              "Certified in Cupping Therapy and Microneedling.",
              "In-clinic and online consultations, both at Rs. 1,000.",
              "Direct online booking — confirmed by the clinic, no third party involved.",
            ].map((item, i) => (
              <Reveal key={item} delay={i * 0.06}>
                <div className="flex gap-4 border-b border-gold-line pb-5">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                  <p className="text-ink-secondary leading-relaxed">{item}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function TiltCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div
      data-cursor="hover"
      className="group relative rounded-card border border-gold-line p-8 h-full transition-all duration-300 hover:border-gold hover:-translate-y-1"
      style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.02), transparent)" }}
    >
      <div
        className="absolute inset-0 rounded-card opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: "0 20px 60px -20px rgba(240,198,116,0.25)" }}
      />
      <h3 className="font-serif text-xl text-ink-primary mb-3">{title}</h3>
      <p className="text-sm text-ink-secondary leading-relaxed">{desc}</p>
    </div>
  );
}