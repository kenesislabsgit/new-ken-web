"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import gsap from "gsap";

interface NumberTickerProps {
  value: number;
  direction?: "up" | "down";
  delay?: number;
  decimalPlaces?: number;
  className?: string;
}

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  decimalPlaces = 0,
  className,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setInView(true);
          hasAnimated.current = true;
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current;
    const start = direction === "down" ? value : 0;
    const end = direction === "down" ? 0 : value;
    const obj = { val: start };

    gsap.to(obj, {
      val: end,
      duration: 1.8,
      delay,
      ease: "power2.out",
      onUpdate() {
        el.textContent = obj.val.toFixed(decimalPlaces);
      },
    });
  }, [inView, value, direction, delay, decimalPlaces]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {direction === "down" ? value.toFixed(decimalPlaces) : (0).toFixed(decimalPlaces)}
    </span>
  );
}
