"use client";

import { motion } from "framer-motion";

const line1 = "Dr. Shiza Khan";
const line2 = "physiotherapy, chiropractic";
const line3 = "and acupuncture care";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05 },
  },
};

const word = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

function Words({ text }: { text: string }) {
  return (
    <motion.span variants={container} initial="hidden" animate="show" className="inline">
      {text.split(" ").map((w, i) => (
        <motion.span key={i} variants={word} className="inline-block mr-[0.28em]">
          {w}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default function HeroText() {
  return (
    <h1 className="font-serif text-4xl md:text-6xl leading-[1.08] text-ink-primary">
      <Words text={line1} />
      <br />
      <span className="text-ink-secondary text-2xl md:text-4xl">
        <Words text={line2} />
        <br />
        <Words text={line3} />
      </span>
    </h1>
  );
}
