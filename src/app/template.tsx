"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * App Router template — re-mounts on navigation so each route animates in.
 * Uses opacity + a small lift; reduced-motion gets a plain fade.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion() ?? false;
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.01 : 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
