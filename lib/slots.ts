// Working hours: 2:00 PM - 8:00 PM, all days, 15-minute slots.
export const WORKING_HOURS = {
  startMinutes: 14 * 60, // 2:00 PM
  endMinutes: 20 * 60, // 8:00 PM
  slotLengthMinutes: 15,
};

export function generateDaySlots(): string[] {
  const slots: string[] = [];
  for (
    let m = WORKING_HOURS.startMinutes;
    m < WORKING_HOURS.endMinutes;
    m += WORKING_HOURS.slotLengthMinutes
  ) {
    const hours24 = Math.floor(m / 60);
    const minutes = m % 60;
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
    const ampm = hours24 < 12 ? "AM" : "PM";
    const label = `${hours12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
    slots.push(label);
  }
  return slots;
}
