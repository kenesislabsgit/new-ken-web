"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
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
  { label: "Home", href: "/" },
  { label: "Platform", href: "/platform" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Entrance animation
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

  // Scroll progress bar
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

  // Scroll detection for navbar style change
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mobile menu animation
  useEffect(() => {
    if (!mobileMenuRef.current) return;
    
    if (open) {
      // Animate menu in
      gsap.fromTo(
        mobileMenuRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      // Stagger animate links
      gsap.fromTo(
        mobileMenuRef.current.querySelectorAll(".mobile-link"),
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: "power2.out", delay: 0.1 }
      );
      // Animate CTA
      gsap.fromTo(
        mobileMenuRef.current.querySelector(".mobile-cta"),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", delay: 0.35 }
      );
    }
  }, [open]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <div
        ref={headerRef}
        className="fixed top-[12px] left-0 right-0 z-[500] mx-auto w-[calc(100vw-24px)] max-w-[1152px] sm:top-[20px] sm:w-[calc(100vw-48px)]"
        style={{ opacity: 0, transform: "translateY(-80px)" }}
      >
        <div
          className={`relative flex items-center justify-between rounded-[14px] sm:rounded-[20px] px-[16px] py-[12px] sm:px-[24px] sm:py-[14px] transition-all duration-500 ${
            scrolled ? "shadow-2xl" : ""
          }`}
          style={{
            background: scrolled 
              ? "rgba(10, 10, 11, 0.85)" 
              : "rgba(10, 10, 11, 0.65)",
            backdropFilter: "blur(32px) saturate(1.4)",
            WebkitBackdropFilter: "blur(32px) saturate(1.4)",
            border: scrolled 
              ? "1px solid rgba(255,255,255,0.12)" 
              : "1px solid rgba(255,255,255,0.08)",
            boxShadow: scrolled
              ? "0 8px 32px rgba(0,0,0,0.5), 0 1px 0 0 rgba(255,255,255,0.05) inset, 0 0 0 1px rgba(245,158,11,0.05)"
              : "0 8px 32px rgba(0,0,0,0.4), 0 1px 0 0 rgba(255,255,255,0.03) inset",
          }}
        >
          {/* Logo */}
          <Link 
            href="/" 
            className="group flex items-center gap-2.5 cursor-pointer" 
            aria-label="Kenesis Labs home"
          >
            {/* Optional: Add small logo icon here */}
            <span className="font-logo text-[18px] tracking-[0.12em] uppercase text-white/90 leading-none sm:text-[22px] transition-all duration-300 group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]">
              Kenesis
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Tooltip key={link.label}>
                <Tooltip.Trigger>
                  <Link
                    href={link.href}
                    className={`group relative rounded-xl px-4 py-2.5 font-mono-accent text-[13px] font-medium uppercase tracking-[0.1em] transition-all duration-300 cursor-pointer ${
                      isActive(link.href)
                        ? "text-amber-400"
                        : "text-white/60 hover:text-white/90"
                    }`}
                  >
                    {link.label}
                    {/* Hover underline */}
                    <span 
                      className={`absolute bottom-1.5 left-4 right-4 h-[2px] rounded-full transition-all duration-300 ${
                        isActive(link.href)
                          ? "bg-amber-400/60 scale-x-100"
                          : "bg-amber-400/50 scale-x-0 group-hover:scale-x-100"
                      }`}
                      style={{ transformOrigin: "left" }}
                    />
                  </Link>
                </Tooltip.Trigger>
                <Tooltip.Content placement="bottom" offset={8}>
                  <Tooltip.Arrow />
                  Explore {link.label}
                </Tooltip.Content>
              </Tooltip>
            ))}
          </nav>

          {/* Right side: CTA + Hamburger */}
          <div className="flex items-center gap-3">
            {/* Desktop CTA */}
            <Link href="/contact" className="hidden md:block">
              <Button
                variant="primary"
                size="md"
                className="font-mono-accent text-[12px] font-bold uppercase tracking-[0.08em] rounded-xl cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-shadow duration-300"
              >
                Book a walkthrough
              </Button>
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setOpen(!open)}
              className={`flex h-10 w-10 flex-col items-center justify-center gap-[6px] rounded-xl transition-all duration-300 md:hidden cursor-pointer ${
                open 
                  ? "bg-white/[0.1] border border-amber-400/30" 
                  : "bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.12]"
              }`}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <span 
                className={`block h-[2px] w-[18px] rounded-full transition-all duration-300 ${
                  open ? "translate-y-[4px] rotate-45 bg-amber-400" : "bg-white/80"
                }`} 
              />
              <span 
                className={`block h-[2px] w-[18px] rounded-full transition-all duration-300 ${
                  open ? "-translate-y-[4px] -rotate-45 bg-amber-400" : "bg-white/80"
                }`} 
              />
            </button>
          </div>

          {/* Scroll Progress Bar */}
          <div className="absolute bottom-0 left-4 right-4 h-[2px] overflow-hidden rounded-full bg-white/[0.06]">
            <div
              ref={progressRef}
              className="h-full rounded-full transition-[width] duration-100"
              style={{ 
                width: "0%", 
                background: "linear-gradient(90deg, #fbbf24, #f59e0b, #d97706)",
                boxShadow: "0 0 8px rgba(245,158,11,0.5)"
              }}
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {open && (
        <div 
          ref={mobileMenuRef}
          className="fixed inset-0 z-[499] flex flex-col md:hidden"
          style={{
            background: "rgba(10,10,11,0.95)",
            backdropFilter: "blur(40px) saturate(1.6)",
            WebkitBackdropFilter: "blur(40px) saturate(1.6)",
          }}
        >
          {/* Decorative gradient orb */}
          <div 
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full opacity-20 pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(245,158,11,0.4) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />

          {/* Menu Content */}
          <div className="relative flex flex-col h-full pt-[100px] px-6 pb-8">
            {/* Navigation Links */}
            <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
              {mobileLinks.map((link, index) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`mobile-link group flex items-center justify-between rounded-2xl px-6 py-5 font-mono-accent text-[18px] font-medium uppercase tracking-[0.12em] transition-all duration-300 cursor-pointer ${
                    isActive(link.href)
                      ? "bg-amber-400/10 text-amber-400 border border-amber-400/20"
                      : "text-white/70 hover:bg-white/[0.06] hover:text-white/90 border border-transparent"
                  }`}
                  style={{ opacity: 0 }}
                >
                  <span>{link.label}</span>
                  {/* Arrow indicator */}
                  <svg 
                    className={`w-5 h-5 transition-all duration-300 ${
                      isActive(link.href) 
                        ? "text-amber-400 translate-x-0 opacity-100" 
                        : "text-white/30 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                    }`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </nav>

            {/* Divider */}
            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Contact Info */}
            <div className="mobile-link flex flex-col gap-3 px-2" style={{ opacity: 0 }}>
              <p className="font-mono-accent text-[11px] font-bold uppercase tracking-[0.14em] text-white/30">
                Get in touch
              </p>
              <a 
                href="mailto:hello@kenesis.ai" 
                className="font-mono-accent text-[14px] text-white/50 hover:text-amber-400 transition-colors"
              >
                hello@kenesis.ai
              </a>
            </div>

            {/* CTA Button */}
            <div className="mobile-cta mt-auto" style={{ opacity: 0 }}>
              <Link href="/contact" onClick={() => setOpen(false)} className="block w-full">
                <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                  className="font-mono-accent text-[14px] font-bold uppercase tracking-[0.08em] rounded-2xl cursor-pointer h-[56px] shadow-[0_0_30px_rgba(245,158,11,0.3)]"
                >
                  Book a walkthrough
                </Button>
              </Link>
              
              {/* Secondary link */}
              <p className="mt-4 text-center font-mono-accent text-[12px] text-white/30">
                Or call us at{" "}
                <a href="tel:+1234567890" className="text-white/50 hover:text-amber-400 transition-colors">
                  +1 (234) 567-890
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
