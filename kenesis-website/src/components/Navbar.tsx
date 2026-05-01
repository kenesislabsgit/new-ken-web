"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button, Tooltip } from "@heroui/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { label: "Platform", href: "/platform" },
  { label: "About", href: "/about" },
];

const mobileLinks = [
  { label: "Platform", href: "/platform" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const tween = gsap.fromTo(
      el,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 0.3 }
    );
    return () => { tween.kill(); };
  }, []);

  useEffect(() => {
    const bar = progressRef.current;
    if (!bar) return;
    const trigger = ScrollTrigger.create({
      start: "top top",
      end: "max",
      invalidateOnRefresh: true,
      onUpdate(self) {
        gsap.set(bar, { width: `${self.progress * 100}%` });
      },
    });
    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 3000);
    const refreshTimer2 = setTimeout(() => ScrollTrigger.refresh(), 8000);
    return () => { trigger.kill(); clearTimeout(refreshTimer); clearTimeout(refreshTimer2); };
  }, []);

  return (
    <>
      <div
        ref={headerRef}
        className="fixed top-[12px] left-0 right-0 z-[500] mx-auto w-[calc(100vw-24px)] max-w-[1152px] sm:top-[20px] sm:w-[calc(100vw-48px)]"
        style={{ opacity: 0, transform: "translateY(-80px)" }}
      >
        <div
          className="relative flex items-center justify-between rounded-[12px] sm:rounded-[16px] px-[14px] py-[10px] sm:px-[20px] sm:py-[12px]"
          style={{
            background: "rgba(10, 10, 11, 0.65)",
            backdropFilter: "blur(32px) saturate(1.4)",
            WebkitBackdropFilter: "blur(32px) saturate(1.4)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 1px 0 0 rgba(255,255,255,0.03) inset",
          }}
        >
          <Link href="/" className="flex items-center gap-2 cursor-pointer" aria-label="Kenesis Labs home">
            <span className="font-logo text-[18px] tracking-[0.12em] uppercase text-white/90 leading-none sm:text-[22px]">
              Kenesis
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Tooltip key={link.label}>
                <Tooltip.Trigger>
                  <Link
                    href={link.href}
                    className="rounded-lg px-3 py-2 font-mono-accent text-[13px] font-medium uppercase tracking-[0.1em] text-white/50 transition-colors duration-200 hover:text-white/90 cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </Tooltip.Trigger>
                <Tooltip.Content placement="bottom" offset={8}>
                  <Tooltip.Arrow />
                  Explore {link.label}
                </Tooltip.Content>
              </Tooltip>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/contact" className="hidden rounded-xl md:block">
              <Button
                variant="primary"
                size="md"
                className="font-mono-accent text-[12px] font-bold uppercase tracking-[0.08em] rounded-xl cursor-pointer"
              >
                Book a walkthrough
              </Button>
            </Link>

            <button
              onClick={() => setOpen(!open)}
              className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-lg transition-colors hover:bg-white/[0.06] md:hidden cursor-pointer"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <span className={`block h-[1.5px] w-[18px] bg-white/70 transition-all duration-300 ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
              <span className={`block h-[1.5px] w-[18px] bg-white/70 transition-all duration-300 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
            </button>
          </div>

          <div className="absolute bottom-0 left-3 right-3 h-[2px] overflow-hidden rounded-full bg-white/[0.04]">
            <div
              ref={progressRef}
              className="h-full rounded-full"
              style={{ width: "0%", background: "linear-gradient(90deg, #fbbf24, #f59e0b, #d97706)" }}
            />
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[499] flex flex-col pt-[80px] px-6 pb-6 md:hidden"
          style={{
            background: "rgba(10,10,11,0.6)",
            backdropFilter: "blur(40px) saturate(1.6)",
            WebkitBackdropFilter: "blur(40px) saturate(1.6)",
          }}
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {mobileLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-5 py-4 font-mono-accent text-[16px] font-medium uppercase tracking-[0.1em] text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white/90 cursor-pointer"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto">
            <Link href="/contact" onClick={() => setOpen(false)} className="block w-full">
              <Button
                variant="primary"
                fullWidth
                size="lg"
                className="font-mono-accent text-[14px] font-bold uppercase tracking-[0.08em] rounded-xl cursor-pointer"
              >
                Book a walkthrough
              </Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
