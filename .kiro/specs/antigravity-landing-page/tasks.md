# Implementation Plan: Antigravity Landing Page

## Overview

Build the Kenesis landing page — a premium, dark-themed marketing site for AI-powered visual intelligence serving manufacturing and industrial sectors. Three-phase pipeline: (1) brand guidelines + design system in Pencil, (2) landing page visual design in Pencil, (3) code implementation using Next.js App Router with static export, Tailwind CSS v4, GSAP + ScrollTrigger, and Framer Motion. Testing uses Vitest + React Testing Library + fast-check for property-based tests.

## Tasks

- [ ] 1. Brand Guidelines and Design System in Pencil
  - [ ] 1.1 Create Brand Guidelines document in Pencil
    - Define Kenesis primary color palette: orange (#FF6B35) accent as sole light source, dark canvas (#070810), neutral grays, ISA-101 status colors (green/amber/red functional only)
    - Define typography scale: system sans-serif for headings/body (3+ weights: 400, 700, 800, 900), JetBrains Mono for monospace data
    - Include logo usage rules (minimum size, clear space, approved color variations)
    - Define imagery direction: AI visual intelligence, industrial CCTV, control room aesthetic, deep black base with orange glow accents
    - Specify tone-of-voice: "See Everything. Miss Nothing." headline style, technical-confident body copy, action-oriented CTA language
    - Export as developer-handoff format
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [ ] 1.2 Create Design System library in Pencil
    - Define color tokens mapped to semantic roles (bg-dark, surface-dark, text-primary, text-muted, brand, glow, shadow) per Kenesis spec
    - Define spacing scale on 8px grid (4px, 8px, 12px, 16px, 24px, 32px, 48px)
    - Define 10 reusable UI components: GlassCard, GlowButton, GhostButton, GlassPillButton, Badge, MetricCard, CameraFeedCard, CommandPanel, InputField, SectionContainer
    - Specify Kenesis glassmorphism recipe: backdrop-blur 12px, bg rgba(255,255,255,0.06), border rgba(255,255,255,0.12), top-edge highlight rgba(255,255,255,0.20), glass shadow
    - Specify skeuomorphism recipe: 3-stop gradient buttons (FF9A70→FF6B35→E55520), embossed metric cards with inset highlight + drop shadow, orange text-shadow glow
    - Define 3 shadow elevation levels (flat/sm/md/lg) plus glow shadows (brand, green, red)
    - Define glow tokens: brand glow (0 0 20px rgba(255,107,53,0.5)), hover glow (0 0 30px rgba(255,107,53,0.7))
    - Define responsive breakpoints: mobile ≤768px, tablet 769–1024px, desktop ≥1025px
    - Define animation timing tokens: fast 200ms, medium 300ms, slow 600ms, hero-text 1500ms, count-up 1200ms, scrollytelling 500ms, cta-text 800ms
    - Define easing curves: default cubic-bezier(0.4,0,0.2,1), bounce cubic-bezier(0.34,1.56,0.64,1), smooth cubic-bezier(0.25,0.1,0.25,1)
    - Link as Pencil library for Landing_Page design file
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10_

- [ ] 2. Landing Page Visual Design in Pencil
  - [ ] 2.1 Design all page sections in Pencil using the Design System
    - Layout sections in order: Hero, Product Features, Use Cases/Industries, Social Proof/Metrics, Closing CTA
    - Apply Kenesis glassmorphism to card components, nav bar, CTA overlay, GlassPillButton
    - Apply skeuomorphism to GlowButton (3-stop gradient), MetricCard (embossed), at least one prominent element per section
    - Annotate scrollytelling sequences: use-cases section with GSAP ScrollTrigger pin/snap, trigger positions, panel transitions
    - Annotate text animations: hero char-reveal (1500ms), section heading fade-up, CTA headline fade-up (800ms)
    - Annotate parallax layers: hero background at 0.3 speed, use-cases background at 0.4 speed
    - Include desktop and mobile layout variants
    - Use only Kenesis Design System components and tokens
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [ ] 3. Checkpoint — Pencil deliverables review
  - Ensure brand guidelines, design system, and visual design are complete and approved before proceeding to code implementation. Ask the user if questions arise.

- [ ] 4. Next.js project scaffolding and configuration
  - [ ] 4.1 Initialize Next.js project with all dependencies
    - Create Next.js App Router project with TypeScript
    - Install production deps: `next`, `react`, `react-dom`, `tailwindcss` (v4), `@tailwindcss/postcss`, `gsap`, `framer-motion`, `next-sitemap`
    - Install dev deps: `@next/bundle-analyzer`, `typescript`, `@types/react`, `@types/node`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `fast-check`, `jsdom`, `eslint`, `eslint-config-next`
    - Create project directory structure: `app/`, `components/ui/`, `hooks/`, `lib/`
    - _Requirements: 10.2_

  - [ ] 4.2 Configure next.config.js with static export and security headers
    - Set `output: 'export'` and `images: { unoptimized: true }`
    - Configure `@next/bundle-analyzer` with `ANALYZE` env toggle
    - Add all security headers: CSP (default-src 'self', script-src 'self', style-src 'self' 'unsafe-inline', img-src 'self' data: https:, font-src 'self' https://fonts.gstatic.com, connect-src 'self', frame-ancestors 'none'), X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, HSTS max-age=63072000
    - _Requirements: 10.2 (Security Hardening)_

  - [ ]* 4.3 Write property test for security headers (Property 18)
    - **Property 18: Security headers are present**
    - Verify next.config.js headers configuration includes all required security headers with non-empty values
    - **Validates: Requirements (Security Hardening)**

  - [ ] 4.4 Configure next-sitemap for sitemap and robots.txt generation
    - Create `next-sitemap.config.js` with siteUrl `https://kenesis.ai`, generateRobotsTxt true, outDir `./out`
    - _Requirements: (SEO — sitemap)_

- [ ] 5. Kenesis design tokens and global styles
  - [ ] 5.1 Create globals.css with Kenesis design tokens in @theme block
    - Define all color tokens: brand (#FF6B35, #E55520, #FF9A70, #FFF0E8), dark canvas (#070810, #0a0d1a), grays, text, glass rgba values, ISA-101 status colors
    - Define shadow & glow tokens: flat, sm, md, lg elevations; brand glow, hover glow, green glow, red glow; glass shadow; skeuomorphic emboss
    - Define spacing scale (8px grid): space-1 through space-12
    - Define radius tokens: sm 3px, md 6px, lg 10px, pill 9999px
    - Define typography tokens: font families (system sans-serif, JetBrains Mono), type scale (display 56px through mono 12px)
    - Define animation tokens: durations (fast 200ms through cta-text 800ms), easing curves (default, bounce, smooth)
    - Include Tailwind CSS v4 `@import "tailwindcss"` directive
    - _Requirements: 2.1, 2.2, 2.6, 2.7, 2.9_

  - [ ]* 5.2 Write property test for spacing tokens (Property 1)
    - **Property 1: Spacing tokens follow consistent base unit**
    - Verify all spacing token pixel values are divisible by 4
    - **Validates: Requirements 2.2**

  - [ ]* 5.3 Write property test for orange-only accent (Property 21)
    - **Property 21: Orange is the only accent color**
    - Verify no violet (#6C5CE7) or cyan (#00D2FF) colors appear; only orange brand palette and ISA-101 status colors
    - **Validates: Requirements 1.1, 2.1**

- [ ] 6. GSAP plugin registration and root layout
  - [ ] 6.1 Create lib/gsap.ts with GSAP + ScrollTrigger registration
    - Register ScrollTrigger plugin with gsap.registerPlugin()
    - Export gsap and ScrollTrigger for use in hooks
    - _Requirements: 9.1_

  - [ ] 6.2 Create app/layout.tsx with fonts, metadata, and JSON-LD
    - Load JetBrains Mono via next/font/google with display swap, preload, CSS variable --font-jetbrains
    - Configure Next.js Metadata API: title "Kenesis — See Everything. Miss Nothing.", description, Open Graph tags (kenesis.ai URL, og-image), Twitter Card tags, canonical URL, robots index/follow
    - Embed JSON-LD Organization schema for Kenesis Labs
    - Set html lang="en", apply font variable and bg-bg-dark text-text-primary classes
    - _Requirements: 10.2, 10.4 (SEO — Metadata, JSON-LD, semantic HTML)_

- [ ] 7. Checkpoint — Project foundation review
  - Ensure Next.js project builds, globals.css tokens render correctly, layout metadata is complete, and security headers are configured. Ask the user if questions arise.

- [ ] 8. Shared UI components
  - [ ] 8.1 Implement GlassCard component
    - Kenesis glassmorphism recipe: bg rgba(255,255,255,0.06), backdrop-blur 12px, border rgba(255,255,255,0.12), border-top rgba(255,255,255,0.20), glass shadow with inset highlight
    - Optional hover prop for shadow elevation transition (md → lg)
    - Accept className prop for composition
    - _Requirements: 2.4, 3.2, 5.3_

  - [ ]* 8.2 Write property test for glassmorphism components (Property 2)
    - **Property 2: Glassmorphism components include required visual properties**
    - Verify GlassCard, NavigationBar, CTA overlay, GlassPillButton all include backdrop-blur(12px), rgba(255,255,255,0.06) bg, rgba(255,255,255,0.12) border, rgba(255,255,255,0.20) top border
    - **Validates: Requirements 2.4, 3.2, 4.3, 5.3, 8.4, 11.2**

  - [ ]* 8.3 Write property test for GlassCard shadow elevation (Property 10)
    - **Property 10: GlassCard shadow elevation on hover**
    - Verify default shadow is shadow-md and hover shadow is shadow-lg
    - **Validates: Requirements 5.4**

  - [ ] 8.4 Implement GlowButton component (skeuomorphic primary)
    - 3-stop gradient: linear-gradient(180deg, #FF9A70 0%, #FF6B35 50%, #E55520 100%)
    - Orange glow shadow, inset highlight, text-shadow
    - Hover: intensified gradient + expanded glow (0 0 30px rgba(255,107,53,0.7))
    - Focus-visible outline with brand color
    - Support href (renders <a>) and onClick (renders <button>)
    - _Requirements: 2.5, 4.5, 8.2_

  - [ ] 8.5 Implement GhostButton component
    - Transparent bg, orange border and text
    - Hover: bg-brand/10 + brand glow shadow
    - Focus-visible outline
    - _Requirements: 2.3_

  - [ ] 8.6 Implement GlassPillButton component
    - Pill radius, glass background, backdrop-blur 12px
    - Hover: elevated glass shadow
    - _Requirements: 2.3, 11.2_

  - [ ]* 8.7 Write property test for skeuomorphic components (Property 3)
    - **Property 3: Skeuomorphic components include required visual properties**
    - Verify GlowButton and MetricCard include multi-layer shadow and gradient with ≥2 stops
    - **Validates: Requirements 2.5, 7.3**

  - [ ] 8.8 Implement Badge component with ISA-101 status variants
    - 6 variants: normal (green), warning (amber), critical (red), offline (gray), live (orange glow), default (orange)
    - Pill shape, uppercase label text, tracking-wider
    - Variant-specific background, text color, and optional glow shadow
    - _Requirements: 2.3_

  - [ ] 8.9 Implement MetricCard component (skeuomorphic)
    - Embossed shadow: inset highlight + multi-layer drop shadow
    - Orange text-shadow glow on metric value (0 0 20px rgba(255,107,53,0.4))
    - JetBrains Mono font for metric value (56px, font-black)
    - Muted label text below
    - _Requirements: 2.5, 7.3_

  - [ ] 8.10 Implement CameraFeedCard component
    - HUD corners: orange border-t/l, border-t/r, border-b/l, border-b/r corner brackets
    - Aspect-video feed area with dark background
    - Monospace detection count overlay
    - Info bar with title, monospace stream ID, and status Badge
    - _Requirements: 2.3_

  - [ ] 8.11 Implement CommandPanel component
    - Terminal-style title bar with traffic light dots (red, amber, green)
    - Uppercase label title, monospace content area
    - Dark background with border-dark borders
    - _Requirements: 2.3_

  - [ ] 8.12 Implement InputField component
    - Dark transparent background, border-dark border
    - Focus: brand border + orange ring shadow
    - Forward ref support
    - _Requirements: 2.3_

  - [ ] 8.13 Implement SectionContainer component
    - Max-width 1200px, centered, consistent vertical/horizontal padding
    - Semantic element support (section or div)
    - Accept id prop for navigation anchors
    - _Requirements: 2.3, 10.4_

  - [ ]* 8.14 Write property test for interactive transition durations (Property 9)
    - **Property 9: Interactive transition durations within range**
    - Verify all interactive elements have transition durations between 150ms and 400ms
    - **Validates: Requirements 4.5, 9.5**

  - [ ]* 8.15 Write property test for focus indicators (Property 15)
    - **Property 15: Interactive elements have visible focus indicators**
    - Verify all buttons, links, and inputs have focus-visible style rules
    - **Validates: Requirements 10.6**

- [ ] 9. Custom hooks (behavior layer)
  - [ ] 9.1 Implement useReducedMotion hook
    - Detect prefers-reduced-motion: reduce via window.matchMedia
    - Listen for changes and update state
    - Return boolean
    - _Requirements: 9.4_

  - [ ]* 9.2 Write property test for reduced motion (Property 11)
    - **Property 11: Reduced motion disables all animations**
    - Verify GSAP timelines/ScrollTriggers are not created and Framer Motion transitions are instant when reduced motion is active
    - **Validates: Requirements 9.4**

  - [ ] 9.3 Implement useIntersectionObserver hook
    - Wrapper around Framer Motion useInView
    - Accept rootMargin and once options
    - Return ref and isVisible
    - _Requirements: 9.1_

  - [ ] 9.4 Implement useParallax hook
    - GSAP ScrollTrigger scrub animation for differential scroll speed
    - Accept speed parameter (0 < speed < 1)
    - Respect useReducedMotion — skip GSAP when reduced motion active
    - Clean up ScrollTrigger instances on unmount
    - _Requirements: 4.6, 6.4, 9.3_

  - [ ]* 9.5 Write property test for parallax speed bounds (Property 4)
    - **Property 4: Parallax speed is sub-scroll**
    - Verify parallax speed values are strictly between 0 and 1
    - **Validates: Requirements 4.6, 6.4**

  - [ ] 9.6 Implement useScrollytelling hook
    - GSAP ScrollTrigger with pin and snap for panel transitions
    - Accept panelCount, return containerRef and activeIndex
    - Respect useReducedMotion
    - Clean up via gsap.context().revert()
    - _Requirements: 6.2_

  - [ ]* 9.7 Write property test for scrollytelling bounds (Property 5)
    - **Property 5: Scrollytelling activeIndex is bounded**
    - Verify activeIndex is always in [0, panelCount - 1] for any scroll progress
    - **Validates: Requirements 6.2**

  - [ ] 9.8 Implement useCountUp hook
    - GSAP tween from 0 to target over configurable duration (default 1.2s)
    - Trigger-based: starts when trigger boolean becomes true
    - Return current animated value
    - _Requirements: 7.2_

  - [ ]* 9.9 Write property test for count-up target (Property 7)
    - **Property 7: Count-up animation reaches target**
    - Verify returns 0 when trigger is false and target value when animation completes
    - **Validates: Requirements 7.2**

  - [ ] 9.10 Implement useTextAnimation hook
    - GSAP timeline for text animations: char-reveal, fade-up, fade-in, slide-up
    - Manual character splitting for char-reveal (no SplitText plugin)
    - ScrollTrigger-based triggering
    - Respect useReducedMotion
    - Clean up via gsap.context().revert()
    - _Requirements: 4.1, 5.5, 6.5, 8.3_

  - [ ]* 9.11 Write property test for animation duration tokens (Property 8)
    - **Property 8: Animation durations match design tokens**
    - Verify all animation durations reference defined Kenesis timing tokens
    - **Validates: Requirements 4.1, 5.2, 6.5, 8.3, 9.2, 11.5**

  - [ ]* 9.12 Write property test for GSAP cleanup (Property 20)
    - **Property 20: GSAP cleanup on unmount**
    - Verify all ScrollTrigger instances and timelines are killed when components unmount
    - **Validates: Requirements 9.1, 9.3**

- [ ] 10. Checkpoint — Components and hooks review
  - Ensure all UI components render correctly with Kenesis tokens, all hooks work with GSAP/Framer Motion, and reduced motion is respected. Ask the user if questions arise.

- [ ] 11. Page sections implementation
  - [ ] 11.1 Implement NavigationBar component
    - Fixed glassmorphism nav: glass bg, backdrop-blur 12px, glass border, top-edge highlight
    - Kenesis logo text, nav links (hidden on mobile), GlassPillButton CTA
    - Hamburger menu with Framer Motion AnimatePresence slide/fade (300ms)
    - Smooth-scroll via scrollIntoView({ behavior: 'smooth' })
    - Respect useReducedMotion for instant transitions
    - aria-label on hamburger, aria-expanded state
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [ ] 11.2 Implement HeroSection component
    - Background layer with parallax via useParallax(0.3): dark canvas with subtle grid pattern and orange glow accents
    - Headline "See Everything. Miss Nothing." with GSAP char-reveal animation (1500ms)
    - Sub-headline "Visual Intelligence for Industry" and body copy
    - Badge variant="live" for "AI-Powered CCTV"
    - GlowButton "Request a Demo" + GhostButton "Learn More"
    - 4 key stats row: MetricCard components (99.4%, <80ms, 500+, 24/7) with JetBrains Mono
    - Sub-headline and CTA staggered fade-in via Framer Motion within 2000ms
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [ ] 11.3 Implement FeaturesSection component
    - Section label "CAPABILITIES" with monospace treatment: JetBrains Mono (`font-mono`), `letter-spacing: 0.2em`, `border-left: 2px solid` brand orange accent
    - Heading "What Kenesis Does" with GSAP text animation
    - 4+ feature cards in responsive grid (2×2 desktop, 1-column mobile)
    - Each card: GlassCard with Framer Motion whileInView fade-and-slide-up (600ms, staggered)
    - Shadow elevation: md default → lg on hover (300ms transition)
    - CameraFeedCard demo: "Assembly Line A", status live, stream CAM-001-PROD, 12 detections
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ]* 11.3a Write property test for section label monospace treatment (Property 24)
    - **Property 24: Section labels use monospace font with decorative accent**
    - Verify section label elements (CAPABILITIES, BY THE NUMBERS, etc.) use JetBrains Mono (`font-mono`), `letter-spacing: 0.2em`, and `border-left` in brand orange
    - **Validates: Requirements 2.2, 2.9**

  - [ ] 11.4 Implement UseCasesSection component (scrollytelling)
    - GSAP ScrollTrigger pin/snap via useScrollytelling(3)
    - Background parallax at 0.4 speed via useParallax
    - 3 use-case panels: Manufacturing, Logistics/Warehousing, Energy/Utilities
    - Each panel: Badge (industry label), heading, description, CommandPanel (terminal-style data)
    - Active panel fades in with GSAP text animation (500ms)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]* 11.5 Write property test for use-case panel content (Property 6)
    - **Property 6: Use-case panels contain required content**
    - Verify each panel has Badge (industry label), heading, and description
    - **Validates: Requirements 6.3**

  - [ ] 11.6 Implement SocialProofSection component
    - Section label "BY THE NUMBERS" with monospace treatment: JetBrains Mono (`font-mono`), `letter-spacing: 0.2em`, `border-left: 2px solid` brand orange accent
    - Heading "Proven at Scale"
    - 4 MetricCard components with count-up animation via useCountUp (1.2s on viewport entry)
    - Stats: 99.4% Detection Accuracy, <80ms Real-Time Latency, 500+ Streams/Node, 24/7 Autonomous
    - Skeuomorphic styling: embossed borders, multi-layer shadows, orange text-shadow glow
    - JetBrains Mono for all metric values
    - Framer Motion whileInView for card entrance with staggered delays
    - Trust logos row below metric cards: "Trusted by leading manufacturers" label, 4-6 client logos in horizontal flex layout, grayscale filter + opacity 0.4 default, hover opacity 0.7 transition
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ]* 11.6a Write property test for trust logos row (Property 23)
    - **Property 23: Trust logos row renders when logo data is provided**
    - Verify that given a non-empty array of client logo data, the SocialProofSection renders a "Trusted by" row with all logos in horizontal layout, each with grayscale filter and reduced opacity
    - **Validates: Requirements 7.4**

  - [ ] 11.7 Implement CTASection component
    - Gradient background: dark to orange tint (from-bg-dark to-brand/10)
    - GlassCard overlay with glassmorphism
    - Headline "Ready to See Everything?" with GSAP fade-up text animation (800ms)
    - GlowButton "Book a Demo" + GhostButton "Contact Sales"
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [ ] 11.8 Implement Footer component (server component)
    - 4-column grid layout: brand column (logo + tagline), product links, company links, legal links (with social media icons)
    - Responsive: 4 columns desktop, 2 columns tablet, 1 column mobile
    - Bottom bar with copyright "Kenesis Labs Private Limited"
    - Uses Kenesis design tokens, semantic `<footer>` element
    - _Requirements: 3.1, 10.4_

  - [ ] 11.9 Compose app/page.tsx with all sections
    - Import and render: NavigationBar, HeroSection, FeaturesSection, UseCasesSection, SocialProofSection, CTASection, Footer
    - Wrap content sections in <main>
    - Sections in correct order per design
    - _Requirements: 3.1_

  - [ ]* 11.10 Write property test for semantic HTML (Property 13)
    - **Property 13: Content sections use semantic HTML**
    - Verify each section component renders a semantic root element (section, nav, main, header, footer)
    - **Validates: Requirements 10.4**

  - [ ]* 11.10a Write property test for footer grid structure (Property 22)
    - **Property 22: Footer contains multi-column grid structure**
    - Verify Footer renders a grid with 4 column groups (brand, product links, company links, legal links) and a bottom bar with copyright text including "Kenesis Labs Private Limited"
    - **Validates: Requirements 3.1**

  - [ ]* 11.11 Write property test for heading hierarchy (Property 16)
    - **Property 16: Heading hierarchy is valid**
    - Verify exactly one h1 element and no skipped heading levels
    - **Validates: Requirements 10.4**

  - [ ]* 11.12 Write property test for image alt text (Property 17)
    - **Property 17: All images have alt text**
    - Verify all img elements have non-empty alt (or alt="" with aria-hidden for decorative)
    - **Validates: Requirements 10.4**

- [ ] 12. Checkpoint — Full page sections review
  - Ensure all sections render correctly, animations fire on scroll, scrollytelling works, count-up animates, and parallax is smooth at 60fps. Ask the user if questions arise.

- [ ] 13. SEO, performance, and accessibility
  - [ ] 13.1 Verify SEO setup
    - Confirm Next.js Metadata API outputs correct title, description, OG tags, Twitter cards, canonical URL, robots
    - Confirm JSON-LD Organization schema is embedded in layout
    - Confirm next-sitemap generates sitemap.xml and robots.txt in /out
    - Confirm heading hierarchy: single h1, sequential h2/h3 with no skips
    - _Requirements: 10.4 (SEO)_

  - [ ] 13.2 Implement email input validation for CTA form
    - HTML5 type="email" + required attribute
    - Regex validation: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
    - Input sanitization: trim, lowercase
    - Validation message on invalid input without page reload
    - _Requirements: (Security — form validation)_

  - [ ]* 13.3 Write property test for email validation (Property 19)
    - **Property 19: Email input validation rejects invalid formats**
    - Generate random strings (valid and invalid emails), verify validation function correctly accepts/rejects
    - **Validates: Requirements (Security — form validation)**

  - [ ] 13.4 Implement responsive layout across all breakpoints
    - Mobile ≤768px: single-column layouts, hamburger nav, stacked metric cards
    - Tablet 769–1024px: 2-column grids where appropriate
    - Desktop ≥1025px: full multi-column layouts, expanded nav
    - Verify all sections render correctly at each breakpoint
    - _Requirements: 10.1_

  - [ ] 13.5 Optimize performance for Lighthouse ≥90 all categories
    - Hero image/font preloading for LCP ≤2.5s
    - Lazy-load below-fold images with loading="lazy"
    - JetBrains Mono via next/font with display swap and preload
    - Code splitting: each section as separate module, consider next/dynamic for heavy below-fold sections
    - Explicit image dimensions to prevent CLS ≤0.1
    - Defer non-critical scripts for FID/INP ≤100ms
    - _Requirements: 10.2, 10.3_

  - [ ]* 13.6 Write property test for lazy loading (Property 12)
    - **Property 12: Below-fold images are lazy-loaded**
    - Verify images not in Hero section have loading="lazy"
    - **Validates: Requirements 10.3**

  - [ ]* 13.7 Write property test for color contrast (Property 14)
    - **Property 14: Color contrast meets WCAG minimums**
    - Generate color pairs from Kenesis tokens, compute contrast ratios, verify ≥4.5:1 body text and ≥3:1 large text
    - **Validates: Requirements 10.5**

  - [ ] 13.8 Accessibility audit
    - Verify sufficient color contrast ratios (4.5:1 body, 3:1 large text) for all Kenesis token pairs
    - Verify visible focus indicators (focus-visible) on all interactive elements
    - Verify keyboard navigation works for all interactive elements
    - Verify ARIA attributes on hamburger menu (aria-label, aria-expanded)
    - Verify all images have alt text
    - _Requirements: 10.5, 10.6_

- [ ] 14. Final checkpoint — Full integration and quality review
  - Ensure all tests pass, Lighthouse scores ≥90 in all categories, security headers are configured, SEO metadata is complete, responsive layout works across breakpoints, and all 24 correctness properties are validated. Ask the user if questions arise.
## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation between phases
- Property tests validate the 24 correctness properties from the design document using fast-check
- Phase 1–2 (Pencil) must be completed before Phase 3 (code implementation)
- All code uses TypeScript with Next.js App Router, Tailwind CSS v4, GSAP + ScrollTrigger, and Framer Motion
- Orange (#FF6B35) is the ONLY accent color per Kenesis Design Principle 3
