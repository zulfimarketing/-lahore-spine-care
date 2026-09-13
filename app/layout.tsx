import type { Metadata } from "next";
import { Fraunces, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import ParticleBackground from "@/components/ParticleBackground";

import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "Lahore Spine Care — Dr. Shiza Khan | Physiotherapist, Chiropractor & Acupuncturist",
  description:
    "Book physiotherapy, chiropractic, or acupuncture treatment with Dr. Shiza Khan in Lahore. In-clinic & online consultations available.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased">
        <ParticleBackground />
        <SmoothScroll>
          <Nav />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
