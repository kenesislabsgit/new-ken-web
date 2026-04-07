"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

interface WaveTextProps {
  children: string;
  className?: string;
  as?: "p" | "h1" | "h2" | "h3" | "h4" | "span";
  /** Wave amplitude in px */
  amplitude?: number;
  /** Stagger between chars */
  stagger?: number;
  /** Animation duration per char */
  duration?: number;
  /** Trigger on scroll or on mount */
  trigger?: "scroll" | "mount";
  start?: string;
}

/**
 * Text where each character animates with a wave motion on scroll/mount.
 * Inspired by Framer "Wave Text" component.
 */
export function WaveText({
  children,
  className,
  as: Tag = "h2",
  amplitude = 20,
  stagger = 0.03,
  duration = 0.8,
  trigger = "scroll",
  start = "top 85%",
}: WaveTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) {
      if (el) {
        el.querySelectorAll(".wt-char").forEach((c) => {
          (c as HTMLElement).style.opacity = "1";
          (c as HTMLElement).style.transform = "none";
        });
      }
      return;
    }

    const chars = el.querySelectorAll(".wt-char");

    const ctx = gsap.context(() => {
      if (trigger === "scroll") {
        gsap.fromTo(chars,
          { y: amplitude, opacity: 0, rotateX: 40 },
          {
            y: 0, opacity: 1, rotateX: 0,
            stagger: { each: stagger, from: "start" },
            duration,
            ease: "elastic.out(1.2, 0.5)",
            scrollTrigger: { trigger: el, start, toggleActions: "play none none none" },
          }
        );
      } else {
        gsap.fromTo(chars,
          { y: amplitude, opacity: 0, rotateX: 40 },
          {
            y: 0, opacity: 1, rotateX: 0,
            stagger: { each: stagger, from: "start" },
            duration,
            ease: "elastic.out(1.2, 0.5)",
            delay: 0.3,
          }
        );
      }
    });

    return () => ctx.revert();
  }, [amplitude, stagger, duration, trigger, start]);

  return (
    <Tag
      ref={ref as React.Ref<HTMLHeadingElement>}
      className={cn("leading-[1.1]", className)}
      style={{ perspective: "600px" }}
      aria-label={children}
    >
      {children.split("").map((char, i) => (
        <span
          key={i}
          className="wt-char inline-block"
          style={{ opacity: 0, transformOrigin: "center bottom" }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </Tag>
  );
}
