"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { TREATMENTS } from "@/lib/content";

type Booking = {
  id: string;
  treatment: string;
  consultationType: "in-clinic" | "online";
  date: string;
  time: string;
  patientName: string;
  phone: string;
  notes?: string;
  status: "pending" | "confirmed" | "checked-in" | "completed" | "cancelled";
  createdAt: string;
};

const TABS = ["all", "pending", "confirmed", "checked-in", "completed", "cancelled"] as const;

const STATUS_COLORS: Record<Booking["status"], string> = {
  pending: "text-yellow-400 border-yellow-400/40",
  confirmed: "text-teal border-teal/40",
  "checked-in": "text-blue-300 border-blue-300/40",
  completed: "text-green-400 border-green-400/40",
  cancelled: "text-red-400 border-red-400/40",
};

export default function DashboardClient() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<(typeof TABS)[number]>("all");
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [slotOptions, setSlotOptions] = useState<{ time: string; available: boolean }[]>([]);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/bookings");
    if (res.status === 401) {
      router.push("/admin");
      return;
    }
    const data = await res.json();
    setBookings(data.bookings ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!rescheduleDate) return;
    fetch(`/api/slots?date=${rescheduleDate}`)
      .then((r) => r.json())
      .then((d) => setSlotOptions(d.slots ?? []));
  }, [rescheduleDate]);

  const filtered = useMemo(
    () => (tab === "all" ? bookings : bookings.filter((b) => b.status === tab)),
    [bookings, tab]
  );

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayCount = bookings.filter((b) => b.date === todayStr).length;
  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
  const completedCount = bookings.filter((b) => b.status === "completed").length;

  async function updateStatus(id: string, status: Booking["status"]) {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  async function confirmReschedule() {
    if (!reschedulingId || !rescheduleDate || !rescheduleTime) return;
    const res = await fetch(`/api/bookings/${reschedulingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reschedule", date: rescheduleDate, time: rescheduleTime }),
    });
    if (res.ok) {
      setReschedulingId(null);
      setRescheduleDate("");
      setRescheduleTime("");
      load();
    }
  }

  async function logout() {
    await fetch("/api/auth/login", { method: "DELETE" });
    router.push("/admin");
  }

  function treatmentName(id: string) {
    return TREATMENTS.find((t) => t.id === id)?.name ?? id;
  }

  return (
    <section className="pt-32 pb-24">
      <div className="container-narrow">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="eyebrow-line mb-3">Reception dashboard</p>
            <h1 className="font-serif text-3xl text-ink-primary">Today's bookings</h1>
          </div>
          <button onClick={logout} className="text-sm text-ink-secondary hover:text-ink-primary">
            Log out
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
          {[
            ["Today", todayCount],
            ["Pending", pendingCount],
            ["Confirmed", confirmedCount],
            ["Completed", completedCount],
          ].map(([label, value]) => (
            <div key={label as string} className="rounded-card border border-gold-line p-6">
              <p className="font-serif text-3xl text-ink-primary">{value}</p>
              <p className="text-sm text-ink-secondary mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={clsx(
                "rounded-full px-4 py-2 text-sm border capitalize transition-colors",
                tab === t ? "bg-gold text-bg-primary border-gold" : "border-gold-line text-ink-secondary"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-ink-muted">Loading bookings…</p>
        ) : filtered.length === 0 ? (
          <p className="text-ink-muted">No bookings in this view.</p>
        ) : (
          <div className="grid gap-4">
            {filtered.map((b) => (
              <div key={b.id} className="rounded-card border border-gold-line p-6 grid md:grid-cols-[1fr_auto] gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <p className="font-serif text-lg text-ink-primary">{b.patientName}</p>
                    <span className={clsx("text-xs border rounded-full px-3 py-1 capitalize", STATUS_COLORS[b.status])}>
                      {b.status}
                    </span>
                  </div>
                  <p className="text-sm text-ink-secondary">
                    {treatmentName(b.treatment)} · {b.consultationType === "in-clinic" ? "In-clinic" : "Online"} ·{" "}
                    {b.date} at {b.time}
                  </p>
                  <p className="text-sm text-ink-muted mt-1">{b.phone}</p>
                  {b.notes && <p className="text-sm text-ink-muted mt-1">Note: {b.notes}</p>}
                </div>

                <div className="flex flex-wrap items-start gap-2">
                  {b.status === "pending" && (
                    <button onClick={() => updateStatus(b.id, "confirmed")} className="text-xs rounded-full border border-gold-line px-4 py-2 text-ink-secondary hover:border-gold">
                      Confirm
                    </button>
                  )}
                  {(b.status === "pending" || b.status === "confirmed") && (
                    <button
                      onClick={() => {
                        setReschedulingId(b.id);
                        setRescheduleDate(b.date);
                        setRescheduleTime("");
                      }}
                      className="text-xs rounded-full border border-gold-line px-4 py-2 text-ink-secondary hover:border-gold"
                    >
                      Reschedule
                    </button>
                  )}
                  {b.status === "confirmed" && (
                    <button onClick={() => updateStatus(b.id, "checked-in")} className="text-xs rounded-full border border-gold-line px-4 py-2 text-ink-secondary hover:border-gold">
                      Check-in
                    </button>
                  )}
                  {b.status === "checked-in" && (
                    <button onClick={() => updateStatus(b.id, "completed")} className="text-xs rounded-full border border-gold-line px-4 py-2 text-ink-secondary hover:border-gold">
                      Mark completed
                    </button>
                  )}
                  {b.status !== "cancelled" && b.status !== "completed" && (
                    <button onClick={() => updateStatus(b.id, "cancelled")} className="text-xs rounded-full border border-red-400/40 px-4 py-2 text-red-400 hover:border-red-400">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {reschedulingId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-sm rounded-card border border-gold-line bg-bg-secondary p-7">
            <h3 className="font-serif text-xl text-ink-primary mb-5">Reschedule appointment</h3>
            <label className="text-sm text-ink-secondary block mb-2">New date</label>
            <input
              type="date"
              value={rescheduleDate}
              onChange={(e) => setRescheduleDate(e.target.value)}
              className="w-full rounded-card border border-gold-line bg-transparent px-4 py-3 text-ink-primary mb-5 outline-none focus:border-gold"
            />
            <label className="text-sm text-ink-secondary block mb-2">New time</label>
            <select
              value={rescheduleTime}
              onChange={(e) => setRescheduleTime(e.target.value)}
              className="w-full rounded-card border border-gold-line bg-bg-secondary px-4 py-3 text-ink-primary mb-6 outline-none focus:border-gold"
            >
              <option value="">Select a time</option>
              {slotOptions.map((s) => (
                <option key={s.time} value={s.time} disabled={!s.available}>
                  {s.time} {!s.available ? "(booked)" : ""}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-3">
              <button onClick={() => setReschedulingId(null)} className="text-sm text-ink-secondary">
                Cancel
              </button>
              <button
                onClick={confirmReschedule}
                disabled={!rescheduleDate || !rescheduleTime}
                className="text-sm rounded-full bg-gold text-bg-primary px-5 py-2.5 disabled:opacity-40"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
