"use client";

import * as React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type RevealVariant = "up" | "scale" | "clip" | "left" | "right";

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  once?: boolean;
  children: React.ReactNode;
}

const buildVariants = (variant: RevealVariant, reduce: boolean): Variants => {
  if (reduce) {
    return { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  }

  switch (variant) {
    case "scale":
      return {
        hidden: { opacity: 0, scale: 0.92 },
        visible: { opacity: 1, scale: 1 },
      };
    case "clip":
      return {
        hidden: { opacity: 0, clipPath: "inset(0 0 100% 0)" },
        visible: { opacity: 1, clipPath: "inset(0 0 0% 0)" },
      };
    case "left":
      return {
        hidden: { opacity: 0, x: -60 },
        visible: { opacity: 1, x: 0 },
      };
    case "right":
      return {
        hidden: { opacity: 0, x: 60 },
        visible: { opacity: 1, x: 0 },
      };
    default:
      return {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0 },
      };
  }
};

export function Reveal({
  variant = "up",
  delay = 0,
  duration = 0.7,
  once = true,
  className,
  children,
  ...props
}: RevealProps) {
  const reduce = useReducedMotion() ?? false;
  const variants = buildVariants(variant, reduce);

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-60px" }}
      transition={{
        duration: reduce ? 0.01 : duration,
        delay: reduce ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(className)}
      {...(props as React.ComponentProps<typeof motion.div>)}
    >
      {children}
    </motion.div>
  );
}
