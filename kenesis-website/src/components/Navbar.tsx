"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button, Tooltip } from "@heroui/react";

// No GSAP in the critical path — nav slide-in is pure CSS, scroll bar uses native scroll event

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Platform", href: "/platform" },
  { label: "About", href: "/about" },
];

const mobileLinks = [
  { label: "Home", href: "/" },
  { label: "Platform", href: "/platform" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);

  // Native scroll progress — no GSAP dependency
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      setProgress((scrollTop / docHeight) * 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        @keyframes navbar-slide-in {
          from { transform: translateY(-80px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        /* ── Navbar skeuomorphic shell ── */
        .navbar-shell {
          position: relative;
          background:
            linear-gradient(
              180deg,
              rgba(255,255,255,0.10) 0%,
              rgba(255,255,255,0.03) 50%,
              rgba(0,0,0,0.08) 100%
            ),
            rgba(14, 13, 12, 0.82);
          backdrop-filter: blur(32px) saturate(1.6);
          -webkit-backdrop-filter: blur(32px) saturate(1.6);
          border: none;
          box-shadow:
            /* outer drop shadow - lifts it off the page */
            0 8px 32px rgba(0,0,0,0.55),
            0 2px 8px rgba(0,0,0,0.4),
            /* top bright rim - catches the light */
            inset 0 1px 0 rgba(255,255,255,0.18),
            /* bottom dark rim - ground shadow */
            inset 0 -1px 0 rgba(0,0,0,0.5),
            /* left/right subtle rims */
            inset 1px 0 0 rgba(255,255,255,0.05),
            inset -1px 0 0 rgba(255,255,255,0.05),
            /* inner depth glow */
            inset 0 2px 16px rgba(0,0,0,0.3);
        }

        /* gradient border - bright top, dark bottom */
        .navbar-shell::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(
            175deg,
            rgba(255,255,255,0.22) 0%,
            rgba(255,255,255,0.06) 40%,
            rgba(0,0,0,0.15) 100%
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

        /* top gloss reflection */
        .navbar-shell::after {
          content: "";
          position: absolute;
          top: 1px;
          left: 8%;
          right: 8%;
          height: 40%;
          border-radius: 999px;
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.12) 0%,
            rgba(255,255,255,0.0) 100%
          );
          filter: blur(4px);
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
          border-radius: 6px;
          background: rgba(255,255,255,0.0);
          transition: background 0.2s ease, box-shadow 0.2s ease;
        }
        .nav-link-glass:hover::before {
          background: rgba(255,255,255,0.05);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.12),
            inset 0 -1px 0 rgba(0,0,0,0.25),
            0 1px 3px rgba(0,0,0,0.2);
        }

        /* ── Skeuomorphic CTA button ── */
        .btn-skeu {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 8px 18px;
          border-radius: 8px;
          font-family: var(--font-mono-accent);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          color: #1a1200;
          background: linear-gradient(
            180deg,
            #fcd34d 0%,
            #f59e0b 45%,
            #d97706 100%
          );
          border: none;
          box-shadow:
            /* outer lift */
            0 4px 12px rgba(217,119,6,0.45),
            0 1px 3px rgba(0,0,0,0.25),
            /* top bright specular */
            inset 0 1px 0 rgba(255,255,255,0.45),
            /* bottom dark edge */
            inset 0 -2px 0 rgba(0,0,0,0.18),
            /* inner side rims */
            inset 1px 0 0 rgba(255,255,255,0.15),
            inset -1px 0 0 rgba(255,255,255,0.15);
          text-shadow: 0 1px 0 rgba(255,255,255,0.25);
          transition: all 0.15s ease;
          white-space: nowrap;
        }
        .btn-skeu:hover {
          background: linear-gradient(
            180deg,
            #fde68a 0%,
            #fbbf24 45%,
            #f59e0b 100%
          );
          box-shadow:
            0 6px 18px rgba(217,119,6,0.55),
            0 2px 6px rgba(0,0,0,0.2),
            inset 0 1px 0 rgba(255,255,255,0.5),
            inset 0 -2px 0 rgba(0,0,0,0.15),
            inset 1px 0 0 rgba(255,255,255,0.2),
            inset -1px 0 0 rgba(255,255,255,0.2);
          transform: translateY(-1px);
        }
        .btn-skeu:active {
          transform: translateY(1px);
          box-shadow:
            0 2px 6px rgba(217,119,6,0.3),
            inset 0 1px 3px rgba(0,0,0,0.2),
            inset 0 1px 0 rgba(0,0,0,0.1);
        }

        /* ── Mobile menu glass panel ── */
        .mobile-glass-panel {
          background:
            linear-gradient(
              180deg,
              rgba(255,255,255,0.08) 0%,
              rgba(255,255,255,0.02) 40%,
              rgba(0,0,0,0.0) 100%
            ),
            rgba(14, 13, 12, 0.88);
          backdrop-filter: blur(40px) saturate(1.6);
          -webkit-backdrop-filter: blur(40px) saturate(1.6);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.15),
            inset 0 -1px 0 rgba(0,0,0,0.4),
            0 8px 32px rgba(0,0,0,0.5);
        }
      `}</style>

      <div
        className="fixed top-[12px] left-0 right-0 z-[500] mx-auto w-[calc(100vw-24px)] max-w-[1152px] sm:top-[20px] sm:w-[calc(100vw-48px)]"
        style={{ animation: "navbar-slide-in 0.9s cubic-bezier(0.22,1,0.36,1) 0.2s both" }}
      >
        <div className="navbar-shell relative flex items-center justify-between rounded-[10px] sm:rounded-[12px] px-[14px] py-[10px] sm:px-[20px] sm:py-[12px]">

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
            <Link href="/contact" className="hidden md:block">
              <button className="btn-skeu">
                Book a walkthrough
              </button>
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
                width: `${progress}%`,
                background: "linear-gradient(90deg, #fbbf24, #f59e0b, #d97706)",
                boxShadow: "0 0 6px rgba(245,158,11,0.5)",
                transition: "width 0.1s linear",
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
              <button className="btn-skeu w-full py-4 text-[14px]">
                Book a walkthrough
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
