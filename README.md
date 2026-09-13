# Lahore Spine Care — Dr. Shiza Khan

Website + online booking system + reception dashboard, built with Next.js 14, TypeScript, Tailwind CSS, Framer Motion, and a canvas-based particle background.

## Cursor mein kholne ke baad — pehle ye steps karein

1. **Terminal open karein** (Cursor ke andar hi: `Ctrl + ~` ya `View → Terminal`)

2. **Dependencies install karein:**
   ```
   npm install
   ```

3. **Environment file banayein:**
   ```
   cp .env.local.example .env.local
   ```
   Phir `.env.local` khol kar `ADMIN_USERNAME` aur `ADMIN_PASSWORD` apni marzi ka rakh dein (ye reception dashboard ka login hai).

4. **Doctor ki asal photo lagayein:**
   `public/images/dr-shiza.jpg` ko replace kar dein Dr. Shiza Khan ki real professional photo se (same filename rakhein, ya `app/page.tsx` mein path update kar dein).

5. **Dev server run karein:**
   ```
   npm run dev
   ```
   Phir browser mein `http://localhost:3000` kholein.

## Pages

| URL | Kya hai |
|---|---|
| `/` | Home page |
| `/about` | Dr. Shiza Khan ka profile + timeline |
| `/services` | Conditions & treatment methods |
| `/book` | Patient booking form (15-min slots, 2PM–8PM) |
| `/contact` | Clinic address, map, phone, social links |
| `/admin` | Reception/doctor login |
| `/admin/dashboard` | Bookings management |

## Booking system kaise kaam karta hai

- Patient `/book` par jaake treatment, consultation type, date, time slot (15-min intervals, 2:00 PM – 8:00 PM) select karta hai, apni details deta hai, aur confirm karta hai.
- Booking `data/bookings.json` file mein save hoti hai (simple file-based storage — local development ke liye best, production ke liye niche dekhein).
- Reception `/admin` se login karke `/admin/dashboard` par saari bookings dekh sakti hai: confirm, reschedule, cancel, check-in, complete kar sakti hai.
- Double-booking automatically block hoti hai — agar do log same date/time select karein to dusra request fail ho jayega.

## Working hours / slots change karne ke liye

`lib/slots.ts` file kholein:
```ts
export const WORKING_HOURS = {
  startMinutes: 14 * 60, // 2:00 PM
  endMinutes: 20 * 60,   // 8:00 PM
  slotLengthMinutes: 15,
};
```
Time yahan se change kar sakte hain (minutes format mein — 14*60 = 2:00 PM).

## Production mein le jaane se pehle (important)

- `data/bookings.json` file-based storage sirf development/testing ke liye theek hai. Production (Vercel jaisi serverless hosting) par real database use karein — Postgres + Prisma, Supabase, ya Firebase recommend hai. `lib/storage.ts` file replace karni hogi database calls se.
- Admin login abhi simple cookie-based hai. Production ke liye stronger auth (NextAuth.js, hashed passwords) use karein.
- Clinic ka logo abhi nahi hai — jab mil jaye to `Nav.tsx` mein text ki jagah `<Image>` laga dein.

## Tech Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Framer Motion (animations, page transitions)
- Lenis (smooth scroll)
- Canvas 2D particle background (constellation effect)
- File-based JSON storage (swap for real DB before production)

## Design tokens

Colors, fonts, aur spacing `tailwind.config.ts` aur `app/globals.css` mein defined hain. Golden/amber particle theme wahi background reference se liya gaya hai jo aapne bheja tha.
