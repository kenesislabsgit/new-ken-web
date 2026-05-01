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
      <style>{`
        /* ── Navbar glass shell ── */
        .navbar-shell {
          position: relative;
          /* same dark glass base as original */
          background:
            /* top specular highlight — the key 3D trick */
            linear-gradient(
              180deg,
              rgba(255,255,255,0.13) 0%,
              rgba(255,255,255,0.04) 40%,
              rgba(0,0,0,0.0) 100%
            ),
            /* original dark base */
            rgba(10, 10, 11, 0.65);
          backdrop-filter: blur(32px) saturate(1.6);
          -webkit-backdrop-filter: blur(32px) saturate(1.6);
          /* outer border: bright top edge fading to dim bottom */
          border: 1px solid transparent;
          background-clip: padding-box;
          box-shadow:
            /* drop shadow for lift */
            0 12px 40px rgba(0,0,0,0.45),
            0 4px 12px rgba(0,0,0,0.3),
            /* inner top bright edge — creates the 3D chrome lip */
            inset 0 1px 0 rgba(255,255,255,0.22),
            /* inner bottom dark edge — depth */
            inset 0 -1px 0 rgba(0,0,0,0.35),
            /* inner left/right subtle rim */
            inset 1px 0 0 rgba(255,255,255,0.06),
            inset -1px 0 0 rgba(255,255,255,0.06),
            /* soft inner glow for glass depth */
            inset 0 2px 20px rgba(255,255,255,0.05);
        }

        /* gradient border via pseudo-element */
        .navbar-shell::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.25) 0%,
            rgba(255,255,255,0.06) 50%,
            rgba(255,255,255,0.02) 100%
          );
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        /* top gloss reflection strip */
        .navbar-shell::after {
          content: "";
          position: absolute;
          top: 2px;
          left: 12%;
          right: 12%;
          height: 35%;
          border-radius: 999px;
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.18) 0%,
            rgba(255,255,255,0.0) 100%
          );
          filter: blur(6px);
          pointer-events: none;
        }

        /* ── Nav link hover pill ── */
        .nav-link-glass {
          position: relative;
          transition: color 0.2s ease;
        }
        .nav-link-glass::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 8px;
          background: rgba(255,255,255,0.0);
          transition: background 0.2s ease, box-shadow 0.2s ease;
        }
        .nav-link-glass:hover::before {
          background: rgba(255,255,255,0.07);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.15),
            inset 0 -1px 0 rgba(0,0,0,0.2);
        }

        /* ── Mobile menu glass panel ── */
        .mobile-glass-panel {
          background:
            linear-gradient(
              180deg,
              rgba(255,255,255,0.10) 0%,
              rgba(255,255,255,0.03) 40%,
              rgba(0,0,0,0.0) 100%
            ),
            rgba(10, 10, 11, 0.75);
          backdrop-filter: blur(40px) saturate(1.6);
          -webkit-backdrop-filter: blur(40px) saturate(1.6);
          border: 1px solid transparent;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.18),
            inset 0 -1px 0 rgba(0,0,0,0.3),
            0 8px 32px rgba(0,0,0,0.4);
        }
        .mobile-glass-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.2) 0%,
            rgba(255,255,255,0.04) 100%
          );
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
      `}</style>

      <div
        ref={headerRef}
        className="fixed top-[12px] left-0 right-0 z-[500] mx-auto w-[calc(100vw-24px)] max-w-[1152px] sm:top-[20px] sm:w-[calc(100vw-48px)]"
        style={{ opacity: 0, transform: "translateY(-80px)" }}
      >
        <div className="navbar-shell relative flex items-center justify-between rounded-[12px] sm:rounded-[16px] px-[14px] py-[10px] sm:px-[20px] sm:py-[12px]">

          {/* Logo */}
          <Link href="/" className="relative z-10 flex items-center gap-2 cursor-pointer" aria-label="Kenesis Labs home">
            <span className="font-logo text-[18px] tracking-[0.12em] uppercase text-white/90 leading-none sm:text-[22px]"
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
              Kenesis
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="relative z-10 hidden items-center gap-2 md:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Tooltip key={link.label}>
                <Tooltip.Trigger>
                  <Link
                    href={link.href}
                    className="nav-link-glass relative z-10 rounded-lg px-3 py-2 font-mono-accent text-[13px] font-medium uppercase tracking-[0.1em] text-white/55 transition-colors duration-200 hover:text-white/90 cursor-pointer"
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

          {/* Right side */}
          <div className="relative z-10 flex items-center gap-3">
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

          {/* Scroll progress bar */}
          <div className="absolute bottom-0 left-3 right-3 h-[2px] overflow-hidden rounded-full bg-white/[0.04]">
            <div
              ref={progressRef}
              className="h-full rounded-full"
              style={{
                width: "0%",
                background: "linear-gradient(90deg, #fbbf24, #f59e0b, #d97706)",
                boxShadow: "0 0 6px rgba(245,158,11,0.5)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="mobile-glass-panel fixed inset-0 z-[499] flex flex-col pt-[80px] px-6 pb-6 md:hidden"
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
