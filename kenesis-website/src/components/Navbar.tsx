"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button, Tooltip } from "@heroui/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Platform", href: "/platform" },
  { label: "About", href: "/about" },
];

const mobileLinks = [
  { label: "Home", href: "/" },
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
        {/* 3D Glass Pill Navbar */}
        <div
          className="relative flex items-center justify-between rounded-full px-[18px] py-[10px] sm:px-[28px] sm:py-[14px]"
          style={{
            /* Base glass background */
            background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
            backdropFilter: "blur(24px) saturate(1.8)",
            WebkitBackdropFilter: "blur(24px) saturate(1.8)",
            /* Outer border - subtle light edge */
            border: "1px solid rgba(255,255,255,0.2)",
            /* 3D skeuomorphic shadows */
            boxShadow: `
              /* Outer shadow for depth */
              0 10px 40px rgba(0,0,0,0.3),
              0 4px 12px rgba(0,0,0,0.2),
              /* Inner top highlight - creates 3D bulge */
              inset 0 1px 1px rgba(255,255,255,0.4),
              inset 0 -1px 1px rgba(0,0,0,0.1),
              /* Inner glow for glass depth */
              inset 0 20px 30px rgba(255,255,255,0.08)
            `,
          }}
        >
          {/* Inner highlight overlay - top reflection */}
          <div 
            className="absolute inset-x-[10%] top-[3px] h-[40%] rounded-full pointer-events-none"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)",
              filter: "blur(1px)",
            }}
          />

          <Link href="/" className="relative z-10 flex items-center gap-2 cursor-pointer" aria-label="Kenesis Labs home">
            <span className="font-logo text-[18px] tracking-[0.12em] uppercase text-white/90 leading-none sm:text-[22px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
              Kenesis
            </span>
          </Link>

          <nav className="relative z-10 hidden items-center gap-2 md:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Tooltip key={link.label}>
                <Tooltip.Trigger>
                  <Link
                    href={link.href}
                    className="relative rounded-full px-4 py-2 font-mono-accent text-[12px] font-medium uppercase tracking-[0.1em] text-white/70 transition-all duration-300 hover:text-white hover:bg-white/10 cursor-pointer"
                    style={{
                      textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                    }}
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

          <div className="relative z-10 flex items-center gap-3">
            <Link href="/contact" className="hidden md:block">
              {/* 3D Glass CTA Button */}
              <button
                className="relative rounded-full px-5 py-2.5 font-mono-accent text-[11px] font-bold uppercase tracking-[0.08em] cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "linear-gradient(180deg, #fcd34d 0%, #f59e0b 50%, #d97706 100%)",
                  color: "#1a1a0e",
                  border: "1px solid rgba(255,255,255,0.3)",
                  boxShadow: `
                    0 4px 15px rgba(245,158,11,0.4),
                    0 2px 4px rgba(0,0,0,0.2),
                    inset 0 1px 1px rgba(255,255,255,0.5),
                    inset 0 -1px 1px rgba(0,0,0,0.15)
                  `,
                  textShadow: "0 1px 0 rgba(255,255,255,0.3)",
                }}
              >
                Book a walkthrough
              </button>
            </Link>

            {/* 3D Glass Hamburger Button */}
            <button
              onClick={() => setOpen(!open)}
              className="relative flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full transition-all duration-300 md:hidden cursor-pointer hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)",
                border: "1px solid rgba(255,255,255,0.25)",
                boxShadow: `
                  0 4px 12px rgba(0,0,0,0.2),
                  inset 0 1px 1px rgba(255,255,255,0.4),
                  inset 0 -1px 1px rgba(0,0,0,0.1)
                `,
              }}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <span className={`block h-[2px] w-[16px] rounded-full bg-white/80 transition-all duration-300 ${open ? "translate-y-[3.5px] rotate-45" : ""}`} style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.3)" }} />
              <span className={`block h-[2px] w-[16px] rounded-full bg-white/80 transition-all duration-300 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.3)" }} />
            </button>
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-[6px] left-[20px] right-[20px] h-[2px] overflow-hidden rounded-full bg-white/[0.08]">
            <div
              ref={progressRef}
              className="h-full rounded-full"
              style={{ 
                width: "0%", 
                background: "linear-gradient(90deg, #fbbf24, #f59e0b, #d97706)",
                boxShadow: "0 0 8px rgba(245,158,11,0.5)"
              }}
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu - 3D Glass Style */}
      {open && (
        <div 
          className="fixed inset-0 z-[499] flex flex-col pt-[90px] px-5 pb-6 md:hidden"
          style={{
            background: "rgba(10,10,11,0.7)",
            backdropFilter: "blur(40px) saturate(1.6)",
            WebkitBackdropFilter: "blur(40px) saturate(1.6)",
          }}
        >
          {/* Glass container for menu */}
          <div
            className="rounded-[24px] p-4 mb-4"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: `
                0 10px 40px rgba(0,0,0,0.3),
                inset 0 1px 1px rgba(255,255,255,0.3),
                inset 0 -1px 1px rgba(0,0,0,0.1)
              `,
            }}
          >
            {/* Inner highlight */}
            <div 
              className="absolute inset-x-[15%] top-[4px] h-[30%] rounded-full pointer-events-none"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)",
              }}
            />
            
            <nav className="relative z-10 flex flex-col gap-1" aria-label="Mobile navigation">
              {mobileLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-full px-5 py-4 font-mono-accent text-[15px] font-medium uppercase tracking-[0.1em] text-white/70 transition-all duration-300 hover:bg-white/10 hover:text-white cursor-pointer"
                  style={{
                    textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-auto">
            <Link href="/contact" onClick={() => setOpen(false)} className="block w-full">
              <button
                className="w-full rounded-full px-6 py-4 font-mono-accent text-[14px] font-bold uppercase tracking-[0.08em] cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "linear-gradient(180deg, #fcd34d 0%, #f59e0b 50%, #d97706 100%)",
                  color: "#1a1a0e",
                  border: "1px solid rgba(255,255,255,0.3)",
                  boxShadow: `
                    0 6px 20px rgba(245,158,11,0.4),
                    0 2px 4px rgba(0,0,0,0.2),
                    inset 0 1px 1px rgba(255,255,255,0.5),
                    inset 0 -1px 1px rgba(0,0,0,0.15)
                  `,
                  textShadow: "0 1px 0 rgba(255,255,255,0.3)",
                }}
              >
                Book a walkthrough
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
