import Reveal from "@/components/Reveal";
import MagneticButton from "@/components/MagneticButton";
import { CLINIC, SOCIALS } from "@/lib/content";

export default function ContactPage() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(CLINIC.mapQuery)}&output=embed`;
  const waLink = `https://wa.me/${CLINIC.whatsapp}`;

  return (
    <section className="pt-40 pb-24">
      <div className="container-narrow grid md:grid-cols-2 gap-14">
        <div>
          <Reveal>
            <p className="eyebrow-line mb-5">Visit the clinic</p>
            <h1 className="font-serif text-3xl md:text-4xl text-ink-primary mb-8">
              {CLINIC.name}
            </h1>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="grid gap-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-muted mb-2">Address</p>
                <p className="text-ink-secondary leading-relaxed">{CLINIC.address}</p>
                <p className="text-ink-muted text-sm mt-1">Plus code: {CLINIC.plusCode}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-muted mb-2">Hours</p>
                <p className="text-ink-secondary">{CLINIC.hours}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-muted mb-2">Consultation fee</p>
                <p className="text-ink-secondary">{CLINIC.fee} — in-clinic and online</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-muted mb-2">Phone / WhatsApp</p>
                <p className="text-ink-secondary">{CLINIC.phone}</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-wrap gap-4 mt-10">
              <MagneticButton href={`tel:${CLINIC.phone.replace(/-/g, "")}`} variant="primary">
                Call the clinic
              </MagneticButton>
              <MagneticButton href={waLink} variant="ghost">
                Message on WhatsApp
              </MagneticButton>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-10 pt-8 border-t border-gold-line">
              {SOCIALS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  className="text-sm text-ink-secondary hover:text-gold-bright transition-colors"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="rounded-card overflow-hidden border border-gold-line h-[420px] md:h-full min-h-[420px]">
            <iframe
              title="Lahore Spine Care location"
              src={mapSrc}
              width="100%"
              height="100%"
              style={{ border: 0, filter: "invert(92%) hue-rotate(180deg) contrast(90%)" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
