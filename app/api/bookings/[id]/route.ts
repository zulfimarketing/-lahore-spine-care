import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { updateBookingStatus, rescheduleBooking, getBookings } from "@/lib/storage";

function requireAuth() {
  const session = cookies().get("lsc_admin_session");
  return !!session;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  if (body.action === "reschedule") {
    if (!body.date || !body.time) {
      return NextResponse.json({ error: "date and time required" }, { status: 400 });
    }
    const existing = await getBookings();
    const clash = existing.find(
      (b) => b.id !== params.id && b.date === body.date && b.time === body.time && b.status !== "cancelled"
    );
    if (clash) {
      return NextResponse.json({ error: "That slot is already taken" }, { status: 409 });
    }
    const updated = await rescheduleBooking(params.id, body.date, body.time);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ booking: updated });
  }

  if (body.status) {
    const updated = await updateBookingStatus(params.id, body.status);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ booking: updated });
  }

  return NextResponse.json({ error: "No action provided" }, { status: 400 });
}
