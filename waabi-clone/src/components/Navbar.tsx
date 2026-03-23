"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button, Tooltip } from "@heroui/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { label: "Platform", href: "/platform" },
  { label: "Solutions", href: "/solutions/ppe-compliance" },
  { label: "About", href: "/about" },
];

const mobileLinks = [
  { label: "Platform", href: "/platform" },
  { label: "PPE Compliance", href: "/solutions/ppe-compliance" },
  { label: "Zone Detection", href: "/solutions/zone-detection" },
  { label: "Analytics", href: "/solutions/analytics" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
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
      onUpdate(self) {
        gsap.set(bar, { width: `${self.progress * 100}%` });
      },
    });
    return () => { trigger.kill(); };
  }, []);



  return (
    <>
      <div
        ref={headerRef}
        className="fixed top-[2rem] left-0 right-0 z-[500] mx-auto w-[calc(100vw-4rem)] max-w-[72rem] sm:top-[2.8rem]"
        style={{ opacity: 0, transform: "translateY(-80px)" }}
      >
        {/* Glass panel */}
        <div
          className="relative flex items-center justify-between rounded-[1.6rem] px-[2rem] py-[1.2rem] sm:px-[2.4rem]"
          style={{
            background: "rgba(10, 10, 11, 0.65)",
            backdropFilter: "blur(32px) saturate(1.4)",
            WebkitBackdropFilter: "blur(32px) saturate(1.4)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 1px 0 0 rgba(255,255,255,0.03) inset",
          }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-[0.8rem] cursor-pointer" aria-label="Kenesis Labs home">
            <span className="font-logo text-[2.2rem] tracking-[0.12em] uppercase text-white/90 leading-none sm:text-[2.6rem]">
              Kenesis
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-[0.4rem] md:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Tooltip key={link.label}>
                <Tooltip.Trigger>
                  <Link
                    href={link.href}
                    className="rounded-[0.8rem] px-[1.4rem] py-[0.8rem] font-mono-accent text-[1.2rem] font-medium uppercase tracking-[0.1em] text-white/50 transition-colors duration-200 hover:text-white/90 cursor-pointer"
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

          {/* Right side — CTA + hamburger */}
          <div className="flex items-center gap-[1.2rem]">
            <Link
              href="/contact"
              className="hidden rounded-[0.8rem] px-[1.6rem] py-[0.7rem] font-mono-accent text-[1.1rem] font-bold uppercase tracking-[0.1em] text-white/50 transition-colors duration-200 hover:text-white/90 sm:block cursor-pointer"
            >
              Contact
            </Link>
            <Link
              href="/contact"
              className="hidden rounded-[1rem] md:block"
            >
              <Button
                variant="primary"
                size="md"
                className="font-mono-accent text-[1.1rem] font-bold uppercase tracking-[0.08em] rounded-[1rem] cursor-pointer"
              >
                Request Demo
              </Button>
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setOpen(!open)}
              className="flex h-[3.6rem] w-[3.6rem] flex-col items-center justify-center gap-[0.5rem] rounded-[0.8rem] transition-colors hover:bg-white/[0.06] md:hidden cursor-pointer"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <span className={`block h-[1.5px] w-[1.8rem] bg-white/70 transition-all duration-300 ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
              <span className={`block h-[1.5px] w-[1.8rem] bg-white/70 transition-all duration-300 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
            </button>
          </div>
        {/* Progress bar — inside glass panel at bottom */}
        <div className="absolute bottom-0 left-[1.2rem] right-[1.2rem] h-[2px] overflow-hidden rounded-full bg-white/[0.04]">
          <div
            ref={progressRef}
            className="h-full rounded-full"
            style={{
              width: "0%",
              background: "linear-gradient(90deg, #fbbf24, #f59e0b, #d97706)",
            }}
          />
        </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-[499] flex flex-col pt-[10rem] px-[2.4rem] pb-[3rem] md:hidden"
          style={{
            background: "rgba(10,10,11,0.97)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <nav className="flex flex-col gap-[0.4rem]" aria-label="Mobile navigation">
            {mobileLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-[1rem] px-[2rem] py-[1.4rem] font-mono-accent text-[1.4rem] font-medium uppercase tracking-[0.1em] text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white/90 cursor-pointer"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto">
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="block w-full"
            >
              <Button
                variant="primary"
                fullWidth
                size="lg"
                className="font-mono-accent text-[1.3rem] font-bold uppercase tracking-[0.08em] rounded-[1.2rem] cursor-pointer"
              >
                Request Demo
              </Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
