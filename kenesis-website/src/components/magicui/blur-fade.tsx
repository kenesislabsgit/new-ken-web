"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { prefersReducedMotion } from "@/lib/animations"

interface BlurFadeProps {
  children: React.ReactNode
  className?: string
  duration?: number
  delay?: number
  offset?: number
  direction?: "up" | "down" | "left" | "right"
  blur?: string
  inView?: boolean
  inViewMargin?: string
}

export function BlurFade({
  children,
  className,
  duration = 0.5,
  delay = 0,
  offset = 8,
  direction = "up",
  blur = "8px",
  inView = false,
  inViewMargin = "-50px",
}: BlurFadeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(!inView)

  useEffect(() => {
    if (!inView || !ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect() } },
      { rootMargin: inViewMargin }
    )
    observer.observe(ref.current)
    return () => { observer.disconnect() }
  }, [inView, inViewMargin])

  useEffect(() => {
    const el = ref.current
    if (!el || !isVisible) return

    if (prefersReducedMotion()) {
      el.style.opacity = '1'
      el.style.filter = 'blur(0px)'
      el.style.transform = ''
      return
    }

    // Lazy-load GSAP — keeps it out of the critical JS bundle
    import('gsap').then(({ default: gsap }) => {
      if (!ref.current) return
      const axis = direction === "left" || direction === "right" ? "x" : "y"
      const sign = direction === "right" || direction === "down" ? -1 : 1
      const fromVars: Record<string, unknown> = { opacity: 0, filter: `blur(${blur})` }
      fromVars[axis] = sign * offset

      const toVars: Record<string, unknown> = {
        opacity: 1, filter: "blur(0px)", [axis]: 0,
        duration, delay, ease: "power3.out",
        onComplete: () => { if (el) el.style.willChange = 'auto'; },
      }

      const tween = gsap.fromTo(el, fromVars as gsap.TweenVars, toVars as gsap.TweenVars)
      return () => { tween.kill() }
    })
  }, [isVisible, duration, delay, offset, direction, blur])

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{ opacity: 0, filter: `blur(${blur})`, willChange: 'filter, opacity, transform', transform: 'translateZ(0)' }}
    >
      {children}
    </div>
  )
}
