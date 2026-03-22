"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

interface UnblurTextRevealProps {
  children: string;
  className?: string;
  as?: "p" | "h1" | "h2" | "h3" | "h4" | "span";
  /** Max blur amount in px */
  blurAmount?: number;
  /** Scale from this value to 1 */
  scaleFrom?: number;
  /** Scrub to scroll position */
  scrub?: boolean | number;
  start?: string;
  end?: string;
  /** Split by "word" or "char" */
  splitBy?: "word" | "char";
  /** Stagger between units */
  stagger?: number;
}

/**
 * Text that starts heavily blurred and scales up, then unblurs and settles
 * as the user scrolls. Each word/char reveals independently with stagger.
 * Inspired by Framer "Unblur Text Reveal" component.
 */
export function UnblurTextReveal({
  children,
  className,
  as: Tag = "h2",
  blurAmount = 20,
  scaleFrom = 0.85,
  scrub = 1,
  start = "top 90%",
  end = "top 30%",
  splitBy = "word",
  stagger = 0.08,
}: UnblurTextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const units = el.querySelectorAll(".ubr-unit");
    if (!units.length) return;

    if (prefersReducedMotion()) {
      gsap.set(units, { opacity: 1, filter: "blur(0px)", scale: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        units,
        {
          opacity: 0,
          filter: `blur(${blurAmount}px)`,
          scale: scaleFrom,
          y: 30,
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          y: 0,
          stagger,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start,
            end,
            scrub: typeof scrub === "number" ? scrub : scrub ? 0.5 : false,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [blurAmount, scaleFrom, scrub, start, end, stagger]);

  const units =
    splitBy === "char"
      ? children.split("").map((c, i) => (
          <span
            key={i}
            className="ubr-unit inline-block"
            style={{ opacity: 0, filter: `blur(${blurAmount}px)` }}
          >
            {c === " " ? "\u00A0" : c}
          </span>
        ))
      : children.split(" ").map((word, i) => (
          <span key={i} className="inline-block overflow-hidden mr-[0.3em]">
            <span
              className="ubr-unit inline-block"
              style={{ opacity: 0, filter: `blur(${blurAmount}px)`, transform: `scale(${scaleFrom})` }}
            >
              {word}
            </span>
          </span>
        ));

  return (
    <Tag
      ref={containerRef as React.Ref<HTMLHeadingElement>}
      className={cn("leading-[1.2]", className)}
      aria-label={children}
    >
      {units}
    </Tag>
  );
}
