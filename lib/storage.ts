import { promises as fs } from "fs";
import path from "path";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "checked-in"
  | "completed"
  | "cancelled";

export type Booking = {
  id: string;
  treatment: string;
  consultationType: "in-clinic" | "online";
  date: string; // YYYY-MM-DD
  time: string; // e.g. "2:00 PM"
  patientName: string;
  phone: string;
  notes?: string;
  status: BookingStatus;
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");

async function ensureFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(BOOKINGS_FILE);
  } catch {
    await fs.writeFile(BOOKINGS_FILE, "[]", "utf-8");
  }
}

export async function getBookings(): Promise<Booking[]> {
  await ensureFile();
  const raw = await fs.readFile(BOOKINGS_FILE, "utf-8");
  try {
    return JSON.parse(raw) as Booking[];
  } catch {
    return [];
  }
}

export async function saveBookings(bookings: Booking[]) {
  await ensureFile();
  await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), "utf-8");
}

export async function addBooking(booking: Booking) {
  const bookings = await getBookings();
  bookings.push(booking);
  await saveBookings(bookings);
  return booking;
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  const bookings = await getBookings();
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  bookings[idx].status = status;
  await saveBookings(bookings);
  return bookings[idx];
}

export async function rescheduleBooking(id: string, date: string, time: string) {
  const bookings = await getBookings();
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  bookings[idx].date = date;
  bookings[idx].time = time;
  bookings[idx].status = "confirmed";
  await saveBookings(bookings);
  return bookings[idx];
}
