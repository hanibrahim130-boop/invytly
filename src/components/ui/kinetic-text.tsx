"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface KineticTextProps {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
}

export function KineticText({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.08,
}: KineticTextProps) {
  const reduce = useReducedMotion() ?? false;
  const words = text.split(" ");

  return (
    <span className={cn("inline-block", className)}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className={cn("inline-block", wordClassName)}
            initial={reduce ? { opacity: 0 } : { y: "110%", opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { y: 0, opacity: 1 }}
            transition={{
              duration: reduce ? 0.01 : 0.8,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
