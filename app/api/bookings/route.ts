import { NextRequest, NextResponse } from "next/server";
import { addBooking, getBookings, Booking } from "@/lib/storage";
import { cookies } from "next/headers";

export async function GET() {
  const session = cookies().get("lsc_admin_session");
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const bookings = await getBookings();
  bookings.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  return NextResponse.json({ bookings });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const required = ["treatment", "consultationType", "date", "time", "patientName", "phone"];
  for (const field of required) {
    if (!body[field]) {
      return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
    }
  }

  // prevent double-booking the same slot
  const existing = await getBookings();
  const clash = existing.find(
    (b) => b.date === body.date && b.time === body.time && b.status !== "cancelled"
  );
  if (clash) {
    return NextResponse.json(
      { error: "This slot was just booked. Please choose another." },
      { status: 409 }
    );
  }

  const booking: Booking = {
    id: crypto.randomUUID(),
    treatment: body.treatment,
    consultationType: body.consultationType,
    date: body.date,
    time: body.time,
    patientName: body.patientName,
    phone: body.phone,
    notes: body.notes ?? "",
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  await addBooking(booking);
  return NextResponse.json({ booking }, { status: 201 });
}
