"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TypewriterTextProps {
  texts: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  cursorChar?: string;
  cursorClassName?: string;
}

/**
 * Premium typewriter effect — types out text, pauses, deletes, cycles.
 * Inspired by Framer "Pro Text Type Effect".
 */
export function TypewriterText({
  texts,
  className,
  typingSpeed = 60,
  deletingSpeed = 35,
  pauseDuration = 2000,
  cursorChar = "▌",
  cursorClassName,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [textIdx, setTextIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const current = texts[textIdx];

    if (!isDeleting) {
      if (displayed.length < current.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayed(current.slice(0, displayed.length + 1));
        }, typingSpeed + Math.random() * 40);
      } else {
        timeoutRef.current = setTimeout(() => setIsDeleting(true), pauseDuration);
      }
    } else {
      if (displayed.length > 0) {
        timeoutRef.current = setTimeout(() => {
          setDisplayed(displayed.slice(0, -1));
        }, deletingSpeed);
      } else {
        setIsDeleting(false);
        setTextIdx((textIdx + 1) % texts.length);
      }
    }

    return () => clearTimeout(timeoutRef.current);
  }, [displayed, isDeleting, textIdx, texts, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className={cn("inline relative", className)}>
      {displayed}
      <span className={cn("animate-pulse absolute", cursorClassName)} aria-hidden="true">{cursorChar}</span>
    </span>
  );
}
