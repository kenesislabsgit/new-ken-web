"use client";

import { cn } from "@/lib/utils";

interface ImageMaskedTextProps {
  text: string;
  imageSrc: string;
  className?: string;
  fontSize?: string;
  fontWeight?: number;
  fontFamily?: string;
  /** Background position for the image */
  bgPosition?: string;
  /** Animate the background on hover */
  animateOnHover?: boolean;
}

/**
 * Text filled with an image texture — the image shows through the text shape.
 * Uses CSS background-clip: text for a lightweight, performant effect.
 */
export function ImageMaskedText({
  text,
  imageSrc,
  className,
  fontSize = "clamp(4rem, 10vw, 10rem)",
  fontWeight = 800,
  fontFamily,
  bgPosition = "center",
  animateOnHover = true,
}: ImageMaskedTextProps) {
  return (
    <span
      className={cn(
        "inline-block leading-[0.95] tracking-[-0.03em] select-none",
        animateOnHover && "transition-[background-size] duration-700 ease-out bg-[length:110%] hover:bg-[length:130%]",
        className
      )}
      style={{
        fontSize,
        fontWeight,
        fontFamily,
        backgroundImage: `url(${imageSrc})`,
        backgroundPosition: bgPosition,
        backgroundSize: animateOnHover ? undefined : "cover",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
        WebkitTextFillColor: "transparent",
      }}
      aria-label={text}
    >
      {text}
    </span>
  );
}
