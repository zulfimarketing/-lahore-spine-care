"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import MagneticButton from "./MagneticButton";
import { TREATMENTS, CLINIC } from "@/lib/content";

type ConsultationType = "in-clinic" | "online";

type SlotInfo = { time: string; available: boolean };

const STEPS = [
  "Treatment",
  "Consultation",
  "Date",
  "Time",
  "Details",
  "Confirm",
];

function nextNDays(n: number) {
  const days: { iso: string; label: string; weekday: string }[] = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("en-US", { day: "2-digit", month: "short" });
    const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
    days.push({ iso, label, weekday });
  }
  return days;
}

export default function BookingForm() {
  const [step, setStep] = useState(0);
  const [treatment, setTreatment] = useState<string | null>(null);
  const [consultationType, setConsultationType] = useState<ConsultationType | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [slots, setSlots] = useState<SlotInfo[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const days = useMemo(() => nextNDays(14), []);

  useEffect(() => {
    if (!date) return;
    setLoadingSlots(true);
    setTime(null);
    fetch(`/api/slots?date=${date}`)
      .then((r) => r.json())
      .then((data) => setSlots(data.slots ?? []))
      .finally(() => setLoadingSlots(false));
  }, [date]);

  function canProceed() {
    if (step === 0) return !!treatment;
    if (step === 1) return !!consultationType;
    if (step === 2) return !!date;
    if (step === 3) return !!time;
    if (step === 4) return name.trim().length > 1 && phone.trim().length >= 7;
    return true;
  }

  function goNext() {
    setError(null);
    if (step < STEPS.length - 1) setStep(step + 1);
  }
  function goBack() {
    setError(null);
    if (step > 0) setStep(step - 1);
  }

  async function submitBooking() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          treatment,
          consultationType,
          date,
          time,
          patientName: name,
          phone,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      setDone(true);
    } catch (e) {
      setError("Could not reach the server. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  }

  const treatmentLabel = TREATMENTS.find((t) => t.id === treatment)?.name;

  if (done) {
    return (
      <div className="max-w-lg mx-auto text-center py-10">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-16 h-16 rounded-full border border-gold flex items-center justify-center mx-auto mb-6"
        >
          <motion.svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.path
              d="M4 12.5L9.5 18L20 6"
              stroke="#f0c674"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </motion.div>
        <h2 className="font-serif text-2xl text-ink-primary mb-3">Your appointment is booked</h2>
        <p className="text-ink-secondary leading-relaxed">
          {treatmentLabel} · {consultationType === "in-clinic" ? "In-clinic" : "Online"} · {date} at {time}
        </p>
        <p className="text-ink-secondary mt-4 text-sm">
          We'll confirm shortly via a call or WhatsApp on {phone}. For anything
          urgent, reach the clinic directly at {CLINIC.phone}.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* progress */}
      <div className="flex items-center gap-2 mb-12">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1">
            <div className="h-1 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full bg-gold"
                initial={false}
                animate={{ width: i <= step ? "100%" : "0%" }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <p className={clsx("text-xs mt-2", i === step ? "text-gold-bright" : "text-ink-muted")}>{s}</p>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {step === 0 && (
            <div>
              <h2 className="font-serif text-2xl text-ink-primary mb-6">What would you like to book?</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {TREATMENTS.map((t) => (
                  <button
                    key={t.id}
                    data-cursor="hover"
                    onClick={() => setTreatment(t.id)}
                    className={clsx(
                      "rounded-card border p-5 text-left transition-colors",
                      treatment === t.id
                        ? "border-gold bg-white/[0.03]"
                        : "border-gold-line hover:border-gold/60"
                    )}
                  >
                    <p className="font-serif text-ink-primary">{t.name}</p>
                    <p className="text-xs text-ink-secondary mt-2">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="font-serif text-2xl text-ink-primary mb-6">How would you like to consult?</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {(["in-clinic", "online"] as ConsultationType[]).map((ct) => (
                  <button
                    key={ct}
                    data-cursor="hover"
                    onClick={() => setConsultationType(ct)}
                    className={clsx(
                      "rounded-card border p-6 text-left transition-colors",
                      consultationType === ct
                        ? "border-gold bg-white/[0.03]"
                        : "border-gold-line hover:border-gold/60"
                    )}
                  >
                    <p className="font-serif text-ink-primary capitalize">
                      {ct === "in-clinic" ? "In-clinic visit" : "Online consultation"}
                    </p>
                    <p className="text-xs text-ink-secondary mt-2">{CLINIC.fee} consultation fee</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-serif text-2xl text-ink-primary mb-6">Choose a date</h2>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
                {days.map((d) => (
                  <button
                    key={d.iso}
                    data-cursor="hover"
                    onClick={() => setDate(d.iso)}
                    className={clsx(
                      "rounded-card border py-3 text-center transition-colors",
                      date === d.iso
                        ? "border-gold bg-white/[0.03]"
                        : "border-gold-line hover:border-gold/60"
                    )}
                  >
                    <p className="text-[10px] text-ink-muted">{d.weekday}</p>
                    <p className="text-sm text-ink-primary mt-1">{d.label}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-serif text-2xl text-ink-primary mb-2">Choose a time</h2>
              <p className="text-sm text-ink-secondary mb-6">{CLINIC.hours} · 15-minute slots</p>
              {loadingSlots ? (
                <p className="text-ink-muted text-sm">Loading available times…</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-80 overflow-y-auto pr-1">
                  {slots.map((s) => (
                    <button
                      key={s.time}
                      disabled={!s.available}
                      data-cursor={s.available ? "hover" : undefined}
                      onClick={() => setTime(s.time)}
                      className={clsx(
                        "rounded-full border py-2.5 text-sm transition-colors",
                        !s.available && "opacity-30 cursor-not-allowed border-gold-line",
                        s.available && time === s.time && "border-gold bg-gold text-bg-primary",
                        s.available && time !== s.time && "border-gold-line text-ink-secondary hover:border-gold/60"
                      )}
                    >
                      {s.time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="font-serif text-2xl text-ink-primary mb-6">Your details</h2>
              <div className="grid gap-4">
                <div>
                  <label className="text-sm text-ink-secondary block mb-2">Full name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-card border border-gold-line bg-transparent px-4 py-3 text-ink-primary focus:border-gold outline-none"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="text-sm text-ink-secondary block mb-2">Phone / WhatsApp number</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-card border border-gold-line bg-transparent px-4 py-3 text-ink-primary focus:border-gold outline-none"
                    placeholder="03XX-XXXXXXX"
                  />
                </div>
                <div>
                  <label className="text-sm text-ink-secondary block mb-2">
                    Reason for visit <span className="text-ink-muted">(optional)</span>
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full rounded-card border border-gold-line bg-transparent px-4 py-3 text-ink-primary focus:border-gold outline-none resize-none"
                    placeholder="Briefly describe your symptoms"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="font-serif text-2xl text-ink-primary mb-6">Confirm your appointment</h2>
              <div className="rounded-card border border-gold-line divide-y divide-gold-line">
                {[
                  ["Treatment", treatmentLabel],
                  ["Consultation", consultationType === "in-clinic" ? "In-clinic" : "Online"],
                  ["Date", date],
                  ["Time", time],
                  ["Name", name],
                  ["Phone", phone],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between px-6 py-4">
                    <span className="text-sm text-ink-secondary">{label}</span>
                    <span className="text-sm text-ink-primary">{value}</span>
                  </div>
                ))}
              </div>
              {error && <p className="text-sm text-error mt-4">{error}</p>}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between items-center mt-10">
        <button
          onClick={goBack}
          disabled={step === 0}
          className={clsx("text-sm", step === 0 ? "opacity-0 pointer-events-none" : "text-ink-secondary hover:text-ink-primary")}
        >
          ← Back
        </button>

        {step < STEPS.length - 1 ? (
          <MagneticButton onClick={goNext} variant="primary" className={clsx(!canProceed() && "opacity-40 pointer-events-none")}>
            Continue
          </MagneticButton>
        ) : (
          <MagneticButton onClick={submitBooking} variant="primary" className={clsx(submitting && "opacity-60 pointer-events-none")}>
            {submitting ? "Booking…" : "Confirm booking"}
          </MagneticButton>
        )}
      </div>
    </div>
  );
}
