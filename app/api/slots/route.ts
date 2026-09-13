import { NextRequest, NextResponse } from "next/server";
import { generateDaySlots } from "@/lib/slots";
import { getBookings } from "@/lib/storage";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date) {
    return NextResponse.json({ error: "date query param required" }, { status: 400 });
  }

  const allSlots = generateDaySlots();
  const bookings = await getBookings();
  const bookedTimes = new Set(
    bookings
      .filter((b) => b.date === date && b.status !== "cancelled")
      .map((b) => b.time)
  );

  const slots = allSlots.map((time) => ({
    time,
    available: !bookedTimes.has(time),
  }));

  return NextResponse.json({ date, slots });
}
