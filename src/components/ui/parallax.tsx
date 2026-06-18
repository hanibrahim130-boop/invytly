"use client";

import * as React from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ParallaxProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
  children: React.ReactNode;
}

export function Parallax({ speed = 0.3, className, children, ...props }: ParallaxProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [`${speed * 100}%`, `${-speed * 100}%`]);

  return (
    <div ref={ref} className={cn("relative", className)} {...props}>
      <motion.div style={reduce ? undefined : { y }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}
