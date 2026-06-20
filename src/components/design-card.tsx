"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import type { Design } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { DesignPreview } from "@/components/design-preview";

const MotionLink = motion.create(Link);

const CHECKOUT_DELAY = 1800; // ms — total length of the open animation

interface OverlayGeom {
  w: number;
  h: number;
  scale: number;
  dx: number;
  dy: number;
}

export function DesignCard({ design, className }: { design: Design; className?: string }) {
  const router = useRouter();
  const reduce = useReducedMotion() ?? false;
  const [opening, setOpening] = React.useState(false);
  const [overlay, setOverlay] = React.useState<OverlayGeom | null>(null);
  const timeoutRef = React.useRef<number | undefined>(undefined);
  const href = `/designs/${design.id}`;
  const checkoutHref = `/order?design=${design.id}`;

  // Lock page scroll while the cinematic overlay plays.
  React.useEffect(() => {
    if (!opening) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [opening]);

  React.useEffect(
    () => () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    },
    []
  );

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Modified clicks (new tab, etc.) → go to the design detail page normally.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    if (opening) return;

    // Reduced motion → skip straight to checkout.
    if (reduce) {
      router.push(checkoutHref);
      return;
    }

    // Measure the card and the target full-screen "stage" so the overlay can
    // grow out of exactly where the card sits.
    const rect = e.currentTarget.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let h = vh * 0.82;
    let w = h * 0.8; // 4:5 ratio
    const maxW = vw * 0.92;
    if (w > maxW) {
      w = maxW;
      h = w * 1.25;
    }
    setOverlay({
      w,
      h,
      scale: rect.width / w,
      dx: rect.left + rect.width / 2 - vw / 2,
      dy: rect.top + rect.height / 2 - vh / 2,
    });
    setOpening(true);
    timeoutRef.current = window.setTimeout(() => router.push(checkoutHref), CHECKOUT_DELAY);
  };

  return (
    <>
      <MotionLink
        href={href}
        prefetch
        onClick={handleClick}
        className={cn(
          "group relative flex flex-col border border-[color:var(--border)] bg-[color:var(--card)] transition-colors duration-200 hover:border-[color:var(--foreground)]",
          className
        )}
        style={{ transformPerspective: 1200 }}
        initial={false}
        animate={
          opening
            ? { opacity: 0, transition: { duration: 0.15, ease: "easeIn" } }
            : { opacity: 1, y: 0, scale: 1, boxShadow: "0px 0px 0px rgba(26,23,20,0)" }
        }
        whileHover={
          opening
            ? undefined
            : { y: -8, scale: 1.035, boxShadow: "0px 22px 45px -18px rgba(26,23,20,0.35)" }
        }
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Preview */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--muted)]">
          <DesignPreview
            design={design}
            className="transition-transform duration-500 group-hover:scale-[1.04]"
          />

          {/* Badges */}
          <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
            {design.popular && <Badge variant="primary">Popular</Badge>}
            {design.new && <Badge variant="default">New</Badge>}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-semibold leading-snug transition-colors group-hover:text-[color:var(--primary)]">
                {design.name}
              </h3>
              <p className="label-mono mt-1 text-[color:var(--muted-foreground)]">
                {design.categoryLabel} · {design.style}
              </p>
            </div>
            <span className="label-mono shrink-0 text-[color:var(--foreground)]">
              {formatCurrency(design.price)}
            </span>
          </div>

          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[color:var(--muted-foreground)]">
            {design.description}
          </p>

          <div className="mt-4 flex items-center gap-2 label-mono text-[color:var(--foreground)] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            View details
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </MotionLink>

      {opening && overlay && typeof document !== "undefined"
        ? createPortal(
            <DesignOpenOverlay design={design} geom={overlay} />,
            document.body
          )
        : null}
    </>
  );
}

/**
 * Cinematic "open like a door" transition. The card lifts seamlessly off its
 * spot into a blurred scrim, scales up, then unfolds into two solid doors with
 * edge-shadow over a warm interior light, before the camera pushes through and
 * dissolves cleanly into the checkout page.
 */
function DesignOpenOverlay({ design, geom }: { design: Design; geom: OverlayGeom }) {
  const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const doorOpen = { delay: 0.62, duration: 0.85, ease: EASE };

  return (
    <div className="fixed inset-0 z-[100]" style={{ perspective: 2000 }}>
      {/* Blurred, darkened scrim — focuses attention and adds depth */}
      <motion.div
        className="absolute inset-0 backdrop-blur-xl"
        style={{ backgroundColor: "rgba(20,18,16,0.62)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      />

      {/* Centered stage */}
      <div className="absolute inset-0 grid place-items-center">
        <motion.div
          className="relative"
          style={{ width: geom.w, height: geom.h, transformStyle: "preserve-3d" }}
          initial={{ x: geom.dx, y: geom.dy, scale: geom.scale, opacity: 1 }}
          animate={{
            x: [geom.dx, 0, 0, 0],
            y: [geom.dy, 0, 0, 0],
            scale: [geom.scale, 1, 1, 1.32],
            opacity: [1, 1, 1, 0],
          }}
          transition={{ duration: 1.7, times: [0, 0.4, 0.74, 1], ease: EASE }}
        >
          {/* Soft drop shadow that grows as the card rises */}
          <motion.div
            className="absolute -inset-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ boxShadow: "0 60px 120px -30px rgba(0,0,0,0.6)" }}
          />

          {/* Warm interior revealed behind the doors */}
          <motion.div
            className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.62, duration: 0.5, ease: "easeOut" }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 90% at 50% 50%, #f7e9d9 0%, var(--terra-light) 26%, var(--terra-dark) 58%, #221a16 88%)",
              }}
            />
            {/* Central bloom — gentle, not a flash */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: [0, 0.9, 0.5], scale: 1.2 }}
              transition={{ delay: 0.7, duration: 1.0, ease: "easeOut" }}
              style={{
                background:
                  "radial-gradient(40% 30% at 50% 50%, rgba(255,250,243,0.95), transparent 70%)",
              }}
            />
          </motion.div>

          {/* Left door */}
          <motion.div
            className="absolute inset-0"
            style={{
              clipPath: "inset(0 50% 0 0)",
              transformOrigin: "left center",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
            initial={{ rotateY: 0 }}
            animate={{ rotateY: -98 }}
            transition={doorOpen}
          >
            <div className="absolute inset-0 overflow-hidden border border-[color:var(--foreground)] shadow-[0_30px_70px_-25px_rgba(0,0,0,0.7)]">
              <DesignPreview design={design} />
              {/* Inner-edge shadow toward the seam — implies a solid panel */}
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.85 }}
                transition={doorOpen}
                style={{
                  background:
                    "linear-gradient(to right, transparent 55%, rgba(20,18,16,0.45) 100%)",
                }}
              />
            </div>
          </motion.div>

          {/* Right door */}
          <motion.div
            className="absolute inset-0"
            style={{
              clipPath: "inset(0 0 0 50%)",
              transformOrigin: "right center",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
            initial={{ rotateY: 0 }}
            animate={{ rotateY: 98 }}
            transition={doorOpen}
          >
            <div className="absolute inset-0 overflow-hidden border border-[color:var(--foreground)] shadow-[0_30px_70px_-25px_rgba(0,0,0,0.7)]">
              <DesignPreview design={design} />
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.85 }}
                transition={doorOpen}
                style={{
                  background:
                    "linear-gradient(to left, transparent 55%, rgba(20,18,16,0.45) 100%)",
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Clean dissolve to the page background — no harsh white flash */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[color:var(--background)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.4, ease: "easeInOut" }}
      />
    </div>
  );
}
