"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

type TextRevealVariant =
  | "word-fade"      // Words fade in one by one on scroll
  | "word-slide"     // Words slide up from below
  | "word-blur"      // Words go from blurred to sharp
  | "char-cascade"   // Characters cascade in with stagger
  | "line-mask"      // Lines reveal with clip-path mask
  | "highlight";     // Words appear then get highlighted

interface TextRevealProps {
  children: string;
  className?: string;
  variant?: TextRevealVariant;
  /** Tag to render — defaults to "p" */
  as?: "p" | "h1" | "h2" | "h3" | "h4" | "span";
  /** If true, animation is scrubbed to scroll position */
  scrub?: boolean | number;
  /** ScrollTrigger start */
  start?: string;
  /** ScrollTrigger end (for scrub mode) */
  end?: string;
  /** Stagger between words/chars in seconds */
  stagger?: number;
  duration?: number;
  delay?: number;
  once?: boolean;
}

export function TextReveal({
  children,
  className,
  variant = "word-fade",
  as: Tag = "p",
  scrub = false,
  start = "top 85%",
  end = "bottom 30%",
  stagger,
  duration = 0.6,
  delay = 0,
  once = true,
}: TextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (prefersReducedMotion()) {
      const spans = container.querySelectorAll(".tr-unit");
      gsap.set(spans, { opacity: 1, y: 0, filter: "blur(0px)", clipPath: "none" });
      return;
    }

    const units = container.querySelectorAll(".tr-unit");
    if (!units.length) return;

    const defaultStagger = variant.startsWith("char") ? 0.02 : 0.05;
    const s = stagger ?? defaultStagger;
    const toggleActions = once ? "play none none none" : "play reverse play reverse";

    let from: gsap.TweenVars = {};
    let to: gsap.TweenVars = {};

    switch (variant) {
      case "word-fade":
        from = { opacity: 0.15 };
        to = { opacity: 1 };
        break;
      case "word-slide":
        from = { opacity: 0, y: "100%", rotateX: 45 };
        to = { opacity: 1, y: "0%", rotateX: 0 };
        break;
      case "word-blur":
        from = { opacity: 0, filter: "blur(10px)" };
        to = { opacity: 1, filter: "blur(0px)" };
        break;
      case "char-cascade":
        from = { opacity: 0, y: 20, scale: 0.8 };
        to = { opacity: 1, y: 0, scale: 1 };
        break;
      case "line-mask":
        from = { clipPath: "inset(0 0 100% 0)" };
        to = { clipPath: "inset(0 0 0% 0)" };
        break;
      case "highlight":
        from = { opacity: 0.2, color: "rgba(255,255,255,0.2)" };
        to = { opacity: 1, color: "rgba(255,255,255,0.9)" };
        break;
    }

    const ctx = gsap.context(() => {
      if (scrub) {
        gsap.fromTo(units, from, {
          ...to,
          stagger: s,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start,
            end,
            scrub: typeof scrub === "number" ? scrub : 0.5,
          },
        });
      } else {
        gsap.fromTo(units, from, {
          ...to,
          duration,
          delay,
          stagger: s,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container,
            start,
            toggleActions,
          },
        });
      }
    });

    return () => ctx.revert();
  }, [variant, scrub, start, end, stagger, duration, delay, once]);

  // Split text into units
  const isCharVariant = variant === "char-cascade";
  const words = children.split(" ");

  const renderUnits = () => {
    if (isCharVariant) {
      return children.split("").map((char, i) => (
        <span
          key={i}
          className="tr-unit inline-block"
          style={variant === "char-cascade" ? { opacity: 0 } : undefined}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ));
    }

    return words.map((word, i) => (
      <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
        <span
          className="tr-unit inline-block"
          style={
            variant === "word-slide"
              ? { opacity: 0, transform: "translateY(100%)" }
              : variant === "word-fade" || variant === "highlight"
              ? { opacity: 0.15 }
              : variant === "word-blur"
              ? { opacity: 0, filter: "blur(10px)" }
              : variant === "line-mask"
              ? { clipPath: "inset(0 0 100% 0)" }
              : { opacity: 0 }
          }
        >
          {word}
        </span>
      </span>
    ));
  };

  return (
    <Tag
      ref={containerRef as unknown as React.Ref<HTMLParagraphElement>}
      className={cn("leading-[1.3]", className)}
      aria-label={children}
    >
      {renderUnits()}
    </Tag>
  );
}
