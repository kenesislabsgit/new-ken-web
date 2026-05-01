"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Dynamically import LiquidGlass to avoid SSR issues
const LiquidGlass = dynamic(() => import("liquid-glass-react"), { 
  ssr: false,
  loading: () => (
    <div className="rounded-full px-[18px] py-[12px] sm:px-[28px] sm:py-[14px]" style={{
      background: "rgba(255,255,255,0.1)",
      backdropFilter: "blur(20px)",
    }} />
  )
});

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
  const [mounted, setMounted] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Lock body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div
        ref={headerRef}
        className="fixed top-[12px] left-0 right-0 z-[500] mx-auto w-[calc(100vw-24px)] max-w-[1152px] sm:top-[20px] sm:w-[calc(100vw-48px)]"
        style={{ opacity: 0, transform: "translateY(-80px)" }}
      >
        {mounted ? (
          <LiquidGlass
            displacementScale={50}
            blurAmount={0.08}
            saturation={120}
            aberrationIntensity={1.5}
            elasticity={0.2}
            cornerRadius={999}
            padding="12px 20px"
            className="w-full"
            style={{ 
              minHeight: "56px",
            }}
          >
            <div className="relative flex items-center justify-between w-full">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 cursor-pointer z-10" aria-label="Kenesis Labs home">
                <span className="font-logo text-[18px] tracking-[0.12em] uppercase text-white/90 leading-none sm:text-[22px]">
                  Kenesis
                </span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden items-center gap-2 md:flex z-10" aria-label="Main navigation">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="rounded-full px-4 py-2 font-mono-accent text-[12px] font-medium uppercase tracking-[0.1em] text-white/70 transition-all duration-300 hover:text-white hover:bg-white/10 cursor-pointer"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Right side */}
              <div className="flex items-center gap-3 z-10">
                {/* Desktop CTA */}
                <Link href="/contact" className="hidden md:block">
                  <LiquidGlass
                    displacementScale={40}
                    blurAmount={0.05}
                    saturation={150}
                    aberrationIntensity={2}
                    elasticity={0.3}
                    cornerRadius={999}
                    padding="10px 20px"
                    onClick={() => {}}
                    style={{
                      background: "linear-gradient(180deg, #fcd34d 0%, #f59e0b 50%, #d97706 100%)",
                    }}
                  >
                    <span className="font-mono-accent text-[11px] font-bold uppercase tracking-[0.08em] text-[#1a1a0e] whitespace-nowrap">
                      Book a walkthrough
                    </span>
                  </LiquidGlass>
                </Link>

                {/* Mobile Hamburger */}
                <button
                  onClick={() => setOpen(!open)}
                  className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full transition-all duration-300 md:hidden cursor-pointer bg-white/10 hover:bg-white/20"
                  aria-label={open ? "Close menu" : "Open menu"}
                  aria-expanded={open}
                >
                  <span className={`block h-[2px] w-[16px] rounded-full bg-white/80 transition-all duration-300 ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
                  <span className={`block h-[2px] w-[16px] rounded-full bg-white/80 transition-all duration-300 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
                </button>
              </div>

              {/* Progress bar */}
              <div className="absolute bottom-[-8px] left-0 right-0 h-[2px] overflow-hidden rounded-full bg-white/[0.08]">
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
          </LiquidGlass>
        ) : (
          /* Fallback while loading */
          <div 
            className="relative flex items-center justify-between rounded-full px-[20px] py-[12px]"
            style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <span className="font-logo text-[18px] tracking-[0.12em] uppercase text-white/90 leading-none sm:text-[22px]">
              Kenesis
            </span>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {open && (
        <div 
          className="fixed inset-0 z-[499] flex flex-col pt-[90px] px-5 pb-6 md:hidden"
          style={{
            background: "rgba(10,10,11,0.85)",
            backdropFilter: "blur(40px) saturate(1.6)",
            WebkitBackdropFilter: "blur(40px) saturate(1.6)",
          }}
        >
          {mounted && (
            <LiquidGlass
              displacementScale={40}
              blurAmount={0.06}
              saturation={120}
              aberrationIntensity={1}
              elasticity={0.15}
              cornerRadius={24}
              padding="16px"
              className="mb-4"
            >
              <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
                {mobileLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-full px-5 py-4 font-mono-accent text-[15px] font-medium uppercase tracking-[0.1em] text-white/70 transition-all duration-300 hover:bg-white/10 hover:text-white cursor-pointer"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </LiquidGlass>
          )}

          <div className="mt-auto">
            <Link href="/contact" onClick={() => setOpen(false)} className="block w-full">
              {mounted && (
                <LiquidGlass
                  displacementScale={50}
                  blurAmount={0.05}
                  saturation={150}
                  aberrationIntensity={2}
                  elasticity={0.25}
                  cornerRadius={999}
                  padding="16px 24px"
                  onClick={() => {}}
                  className="w-full flex justify-center"
                  style={{
                    background: "linear-gradient(180deg, #fcd34d 0%, #f59e0b 50%, #d97706 100%)",
                  }}
                >
                  <span className="font-mono-accent text-[14px] font-bold uppercase tracking-[0.08em] text-[#1a1a0e]">
                    Book a walkthrough
                  </span>
                </LiquidGlass>
              )}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}