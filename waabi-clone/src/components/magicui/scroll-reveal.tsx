"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

type RevealVariant =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "scale-up"
  | "clip-up"
  | "clip-left"
  | "blur-in"
  | "rotate-in";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  distance?: number;
  stagger?: number;
  /** If true, animates direct children with stagger instead of the wrapper */
  staggerChildren?: boolean;
  /** ScrollTrigger start position */
  start?: string;
  /** If true, replays when scrolling back */
  scrub?: boolean | number;
  once?: boolean;
}

const variantConfig: Record<RevealVariant, { from: gsap.TweenVars; to: gsap.TweenVars }> = {
  "fade-up": {
    from: { opacity: 0, y: 40, filter: "blur(4px)" },
    to: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  "fade-down": {
    from: { opacity: 0, y: -40, filter: "blur(4px)" },
    to: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  "fade-left": {
    from: { opacity: 0, x: -50, filter: "blur(4px)" },
    to: { opacity: 1, x: 0, filter: "blur(0px)" },
  },
  "fade-right": {
    from: { opacity: 0, x: 50, filter: "blur(4px)" },
    to: { opacity: 1, x: 0, filter: "blur(0px)" },
  },
  "scale-up": {
    from: { opacity: 0, scale: 0.85, filter: "blur(6px)" },
    to: { opacity: 1, scale: 1, filter: "blur(0px)" },
  },
  "clip-up": {
    from: { opacity: 0, clipPath: "inset(100% 0% 0% 0%)" },
    to: { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" },
  },
  "clip-left": {
    from: { opacity: 0, clipPath: "inset(0% 100% 0% 0%)" },
    to: { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" },
  },
  "blur-in": {
    from: { opacity: 0, filter: "blur(12px)" },
    to: { opacity: 1, filter: "blur(0px)" },
  },
  "rotate-in": {
    from: { opacity: 0, rotateX: 15, y: 30, transformOrigin: "bottom center" },
    to: { opacity: 1, rotateX: 0, y: 0 },
  },
};

export function ScrollReveal({
  children,
  className,
  variant = "fade-up",
  delay = 0,
  duration = 0.8,
  distance,
  stagger = 0.1,
  staggerChildren = false,
  start = "top 88%",
  scrub = false,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      gsap.set(staggerChildren ? el.children : el, { opacity: 1, y: 0, x: 0, scale: 1, filter: "blur(0px)", clipPath: "none", rotateX: 0 });
      return;
    }

    const config = variantConfig[variant];
    const from = { ...config.from };
    const to = { ...config.to };

    // Override distance if provided
    if (distance !== undefined) {
      if ("y" in from) from.y = variant.includes("down") ? -distance : distance;
      if ("x" in from) from.x = variant.includes("right") ? distance : -distance;
    }

    const targets = staggerChildren ? el.children : el;
    const toggleActions = once ? "play none none none" : "play reverse play reverse";

    const ctx = gsap.context(() => {
      if (scrub) {
        // Scrub mode: animation tied to scroll position
        gsap.fromTo(targets, from, {
          ...to,
          duration,
          stagger: staggerChildren ? stagger : 0,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start,
            end: "bottom 20%",
            scrub: typeof scrub === "number" ? scrub : 1,
          },
        });
      } else {
        gsap.fromTo(targets, from, {
          ...to,
          duration,
          delay,
          stagger: staggerChildren ? stagger : 0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions,
          },
        });
      }
    });

    return () => ctx.revert();
  }, [variant, delay, duration, distance, stagger, staggerChildren, start, scrub, once]);

  return (
    <div ref={ref} className={cn(className)} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
