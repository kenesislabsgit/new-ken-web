"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@heroui/react";
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
  const spotlightRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
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

  // Spotlight position for active nav item
  useEffect(() => {
    if (!navRef.current || !spotlightRef.current) return;
    
    const activeLink = navRef.current.querySelector('[data-active="true"]') as HTMLElement;
    if (activeLink) {
      const { offsetLeft, offsetWidth } = activeLink;
      spotlightRef.current.style.setProperty('--spotlight-left', `${offsetLeft}px`);
      spotlightRef.current.style.setProperty('--spotlight-width', `${offsetWidth}px`);
      spotlightRef.current.style.opacity = '1';
    } else {
      spotlightRef.current.style.opacity = '0';
    }
  }, [pathname]);

  // Mobile menu animation
  useEffect(() => {
    if (!mobileMenuRef.current) return;
    
    if (open) {
      gsap.fromTo(
        mobileMenuRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      gsap.fromTo(
        mobileMenuRef.current.querySelectorAll(".mobile-link"),
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: "power2.out", delay: 0.1 }
      );
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
      {/* CSS for animated border beam */}
      <style jsx global>{`
        @property --border-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
        
        @keyframes border-rotate {
          to {
            --border-angle: 360deg;
          }
        }
        
        .navbar-glass {
          --border-angle: 0deg;
          animation: border-rotate 8s linear infinite;
        }
        
        .navbar-glass::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--border-angle) at 50% 50%,
            transparent 0%,
            transparent 25%,
            rgba(251, 191, 36, 0.5) 30%,
            rgba(245, 158, 11, 0.8) 35%,
            rgba(217, 119, 6, 0.5) 40%,
            transparent 45%,
            transparent 100%
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
        
        .spotlight-pill {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: var(--spotlight-left, 0);
          width: var(--spotlight-width, 0);
          height: calc(100% - 12px);
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: 10px;
          transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
                      width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                      opacity 0.3s ease;
          pointer-events: none;
        }
        
        .ascii-bracket {
          font-family: var(--font-mono-accent);
          color: rgba(245, 158, 11, 0.4);
          font-weight: 300;
        }
        
        .scanline-overlay {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.03) 2px,
            rgba(0, 0, 0, 0.03) 4px
          );
          pointer-events: none;
          border-radius: inherit;
        }
      `}</style>

      <div
        ref={headerRef}
        className="fixed top-[12px] left-0 right-0 z-[500] mx-auto w-[calc(100vw-24px)] max-w-[1152px] sm:top-[20px] sm:w-[calc(100vw-48px)]"
        style={{ opacity: 0, transform: "translateY(-80px)" }}
      >
        <div
          className={`navbar-glass relative flex items-center justify-between rounded-[16px] sm:rounded-[20px] px-[16px] py-[12px] sm:px-[24px] sm:py-[14px] transition-all duration-500 overflow-hidden`}
          style={{
            background: scrolled 
              ? "rgba(10, 10, 11, 0.9)" 
              : "rgba(10, 10, 11, 0.7)",
            backdropFilter: "blur(40px) saturate(1.5)",
            WebkitBackdropFilter: "blur(40px) saturate(1.5)",
            boxShadow: scrolled
              ? "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05) inset, 0 1px 0 0 rgba(255,255,255,0.05) inset"
              : "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03) inset, 0 1px 0 0 rgba(255,255,255,0.03) inset",
          }}
        >
          {/* Subtle scanline overlay for terminal feel */}
          <div className="scanline-overlay opacity-50" />
          
          {/* Logo with ASCII brackets */}
          <Link 
            href="/" 
            className="group relative flex items-center gap-1 cursor-pointer z-10" 
            aria-label="Kenesis Labs home"
          >
            <span className="ascii-bracket text-[20px] sm:text-[24px] transition-all duration-300 group-hover:text-amber-400/60">[</span>
            <span className="font-logo text-[17px] tracking-[0.14em] uppercase text-white/90 leading-none sm:text-[21px] transition-all duration-300 group-hover:text-white group-hover:drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]">
              Kenesis
            </span>
            <span className="ascii-bracket text-[20px] sm:text-[24px] transition-all duration-300 group-hover:text-amber-400/60">]</span>
          </Link>

          {/* Desktop Navigation with spotlight */}
          <nav ref={navRef} className="hidden items-center gap-1 md:flex relative" aria-label="Main navigation">
            {/* Spotlight pill indicator */}
            <div ref={spotlightRef} className="spotlight-pill" style={{ opacity: 0 }} />
            
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                data-active={isActive(link.href)}
                className={`group relative z-10 flex items-center gap-2 rounded-xl px-4 py-2.5 font-mono-accent text-[12px] font-medium uppercase tracking-[0.12em] transition-all duration-300 cursor-pointer ${
                  isActive(link.href)
                    ? "text-amber-400"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                {/* Terminal-style prefix */}
                <span className={`text-[10px] transition-colors duration-300 ${
                  isActive(link.href) ? "text-amber-400/60" : "text-white/20 group-hover:text-amber-400/40"
                }`}>
                  {isActive(link.href) ? "▸" : "›"}
                </span>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side: CTA + Hamburger */}
          <div className="flex items-center gap-3 z-10">
            {/* Desktop CTA with glow */}
            <Link href="/contact" className="hidden md:block">
              <Button
                variant="primary"
                size="md"
                className="relative font-mono-accent text-[11px] font-bold uppercase tracking-[0.1em] rounded-xl cursor-pointer overflow-hidden"
                style={{
                  boxShadow: "0 0 20px rgba(245,158,11,0.25), 0 0 40px rgba(245,158,11,0.1)",
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span className="text-[10px] opacity-60">⟩</span>
                  Book a walkthrough
                </span>
              </Button>
            </Link>

            {/* Mobile Hamburger with ASCII style */}
            <button
              onClick={() => setOpen(!open)}
              className={`relative flex h-10 w-10 flex-col items-center justify-center rounded-xl transition-all duration-300 md:hidden cursor-pointer overflow-hidden ${
                open 
                  ? "bg-amber-400/10 border border-amber-400/30" 
                  : "bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.12]"
              }`}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {/* ASCII-style menu icon */}
              <span 
                className={`font-mono-accent text-[16px] font-light transition-all duration-300 ${
                  open ? "text-amber-400" : "text-white/70"
                }`}
              >
                {open ? "×" : "≡"}
              </span>
            </button>
          </div>

          {/* Scroll Progress Bar with glow */}
          <div className="absolute bottom-0 left-4 right-4 h-[2px] overflow-hidden rounded-full bg-white/[0.04]">
            <div
              ref={progressRef}
              className="h-full rounded-full"
              style={{ 
                width: "0%", 
                background: "linear-gradient(90deg, #fbbf24, #f59e0b, #d97706)",
                boxShadow: "0 0 10px rgba(245,158,11,0.6), 0 0 20px rgba(245,158,11,0.3)"
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
            background: "rgba(10,10,11,0.98)",
            backdropFilter: "blur(40px) saturate(1.6)",
            WebkitBackdropFilter: "blur(40px) saturate(1.6)",
          }}
        >
          {/* Scanline overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
            }}
          />
          
          {/* Decorative ASCII art background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
            <pre className="font-mono text-[10px] text-white whitespace-pre leading-tight p-8">
{`╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   ██╗  ██╗███████╗███╗   ██╗███████╗███████╗██╗███████╗     ║
║   ██║ ██╔╝██╔════╝████╗  ██║██╔════╝██╔════╝██║██╔════╝     ║
║   █████╔╝ █████╗  ██╔██╗ ██║█████╗  ███████╗██║███████╗     ║
║   ██╔═██╗ ██╔══╝  ██║╚██╗██║██╔══╝  ╚════██║██║╚════██║     ║
║   ██║  ██╗███████╗██║ ╚████║███████╗███████║██║███████║     ║
║   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝╚══════╝╚══════╝╚═╝╚══════╝     ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝`}
            </pre>
          </div>

          {/* Decorative gradient orb */}
          <div 
            className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full opacity-15 pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(245,158,11,0.4) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />

          {/* Menu Content */}
          <div className="relative flex flex-col h-full pt-[100px] px-6 pb-8">
            {/* Terminal-style header */}
            <div className="mobile-link mb-6 px-2" style={{ opacity: 0 }}>
              <p className="font-mono-accent text-[10px] uppercase tracking-[0.2em] text-amber-400/40">
                ┌─ Navigation ─────────────────────┐
              </p>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
              {mobileLinks.map((link, index) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`mobile-link group flex items-center gap-4 rounded-xl px-5 py-4 font-mono-accent text-[15px] font-medium uppercase tracking-[0.14em] transition-all duration-300 cursor-pointer border ${
                    isActive(link.href)
                      ? "bg-amber-400/10 text-amber-400 border-amber-400/20"
                      : "text-white/60 border-transparent hover:bg-white/[0.04] hover:text-white/80 hover:border-white/[0.06]"
                  }`}
                  style={{ opacity: 0 }}
                >
                  {/* Index number */}
                  <span className={`font-mono-accent text-[11px] w-6 ${
                    isActive(link.href) ? "text-amber-400/60" : "text-white/20"
                  }`}>
                    0{index + 1}
                  </span>
                  
                  {/* Terminal arrow */}
                  <span className={`text-[12px] transition-all duration-300 ${
                    isActive(link.href) 
                      ? "text-amber-400" 
                      : "text-white/30 group-hover:text-amber-400/60 group-hover:translate-x-1"
                  }`}>
                    {isActive(link.href) ? "▸" : "›"}
                  </span>
                  
                  <span>{link.label}</span>
                  
                  {/* Active indicator */}
                  {isActive(link.href) && (
                    <span className="ml-auto font-mono-accent text-[9px] text-amber-400/40 uppercase tracking-wider">
                      [active]
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Terminal-style footer */}
            <div className="mobile-link mt-6 px-2" style={{ opacity: 0 }}>
              <p className="font-mono-accent text-[10px] uppercase tracking-[0.2em] text-white/20">
                └──────────────────────────────────┘
              </p>
            </div>

            {/* Divider with ASCII */}
            <div className="my-8 flex items-center gap-4 px-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="font-mono-accent text-[10px] text-white/20">///</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {/* Contact Info */}
            <div className="mobile-link flex flex-col gap-3 px-2" style={{ opacity: 0 }}>
              <p className="font-mono-accent text-[10px] font-bold uppercase tracking-[0.16em] text-white/25">
                ⟩ Contact
              </p>
              <a 
                href="mailto:hello@kenesis.ai" 
                className="font-mono-accent text-[13px] text-white/40 hover:text-amber-400 transition-colors"
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
                  className="font-mono-accent text-[13px] font-bold uppercase tracking-[0.1em] rounded-xl cursor-pointer h-[56px]"
                  style={{
                    boxShadow: "0 0 30px rgba(245,158,11,0.3), 0 0 60px rgba(245,158,11,0.15)",
                  }}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[12px] opacity-60">⟩</span>
                    Book a walkthrough
                  </span>
                </Button>
              </Link>
              
              {/* System status style footer */}
              <p className="mt-6 text-center font-mono-accent text-[10px] text-white/20 uppercase tracking-[0.15em]">
                sys.status: <span className="text-green-400/60">online</span> • v2.0.1
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}