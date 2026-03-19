# Implementation Plan: Scroll Animation System

## Overview

Migrate the Kenesis landing page from Framer Motion v12 to GSAP + ScrollTrigger + Lenis. This involves dependency swaps, creating centralized animation utilities, building 10 new section components, rewriting the page layout, removing 23 legacy files, and adding property-based + unit tests. All code is TypeScript with Next.js 15.3 and Tailwind CSS v4.2.

## Tasks

- [x] 1. Dependency migration and test infrastructure setup
  - [x] 1.1 Update package.json: add `gsap`, `@studio-freight/lenis`; remove `framer-motion`, `three`, `@types/three`
    - Add `gsap: ^3.12.0` and `@studio-freight/lenis: ^1.0.0` to dependencies
    - Remove `framer-motion`, `three`, and `@types/three` from dependencies
    - Run `npm install` to update lockfile
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 1.6_

  - [x] 1.2 Set up Vitest and fast-check for testing
    - Add `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, and `fast-check` as devDependencies
    - Create `vitest.config.ts` with jsdom environment
    - Add `"test": "vitest --run"` script to package.json
    - Create `src/lib/__tests__/` and `src/components/__tests__/` directories
    - _Requirements: Testing Strategy (Design)_

- [x] 2. Core animation infrastructure
  - [x] 2.1 Create `src/lib/animations.ts` with shared animation utilities
    - Implement `prefersReducedMotion()` — reads and caches `window.matchMedia('(prefers-reduced-motion: reduce)')`
    - Implement `fadeUp(el, options?)` — GSAP tween: opacity 0→1, y 30→0, 0.8s, ease `expo.out`, applies `will-change: transform`
    - Implement `clipReveal(el, options?)` — GSAP tween: yPercent 100→0, 1.1s, ease `expo.out`
    - Implement `bindParallax(mediaEl, factor?)` — ScrollTrigger-driven translateY based on scroll delta × factor
    - Implement `staggerChildren(container, staggerMs?)` — applies fadeUp to each child with configurable stagger (default 120ms)
    - All utilities check `prefersReducedMotion()` and set final state immediately if true
    - All utilities apply `will-change: transform` before animation and provide cleanup functions
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 16.1, 17.1, 17.2_

  - [x] 2.2 Write property test: fadeUp tween configuration (Property 1)
    - **Property 1: fadeUp tween configuration**
    - **Validates: Requirements 3.1**
    - File: `src/lib/__tests__/animations.property.test.ts`
    - Generator: `fc.record({ delay: fc.float({ min: 0, max: 2 }) })`
    - Verify tween animates from `{ opacity: 0, y: 30 }` to `{ opacity: 1, y: 0 }` with duration 0.8s, ease `expo.out`

  - [x] 2.3 Write property test: clipReveal tween configuration (Property 2)
    - **Property 2: clipReveal tween configuration**
    - **Validates: Requirements 3.2**
    - File: `src/lib/__tests__/animations.property.test.ts`
    - Generator: `fc.record({ delay: fc.float({ min: 0, max: 2 }) })`
    - Verify tween animates from `{ yPercent: 100 }` to `{ yPercent: 0 }` with duration 1.1s, ease `expo.out`

  - [x] 2.4 Write property test: bindParallax scroll-driven translateY (Property 3)
    - **Property 3: bindParallax scroll-driven translateY**
    - **Validates: Requirements 3.3, 7.3**
    - File: `src/lib/__tests__/animations.property.test.ts`
    - Generator: `fc.record({ factor: fc.float({ min: 0.1, max: 1 }), progress: fc.float({ min: 0, max: 1 }) })`
    - Verify translateY equals `progress × parentHeight × factor`

  - [x] 2.5 Write property test: staggerChildren delay sequence (Property 4)
    - **Property 4: staggerChildren delay sequence**
    - **Validates: Requirements 3.4**
    - File: `src/lib/__tests__/animations.property.test.ts`
    - Generator: `fc.record({ childCount: fc.integer({ min: 1, max: 20 }), staggerMs: fc.integer({ min: 50, max: 500 }) })`
    - Verify child `i` gets delay `i × staggerMs`

  - [x] 2.6 Write property test: will-change applied to all animated elements (Property 5)
    - **Property 5: will-change applied to all animated elements**
    - **Validates: Requirements 3.5, 16.1**
    - File: `src/lib/__tests__/animations.property.test.ts`
    - Generator: `fc.constantFrom('fadeUp', 'clipReveal', 'bindParallax')`
    - Verify `will-change: transform` is set before animation begins

  - [x] 2.7 Write property test: cleanup on unmount (Property 6)
    - **Property 6: Cleanup on unmount**
    - **Validates: Requirements 16.3**
    - File: `src/lib/__tests__/animations.property.test.ts`
    - Generator: `fc.constantFrom('fadeUp', 'clipReveal', 'bindParallax')`
    - Verify `will-change` reset to `auto` and GSAP tweens/ScrollTriggers killed after cleanup

  - [x] 2.8 Write property test: reduced motion disables all animations (Property 13)
    - **Property 13: Reduced motion disables all animations**
    - **Validates: Requirements 17.1, 17.2**
    - File: `src/lib/__tests__/animations.property.test.ts`
    - Generator: `fc.record({ type: fc.constantFrom('fadeUp', 'clipReveal', 'bindParallax'), reducedMotion: fc.constant(true) })`
    - Verify final state set immediately with no tween created, bindParallax is no-op

  - [x] 2.9 Create `src/lib/useAnimateOnView.ts` hook
    - Implement IntersectionObserver-based hook with configurable threshold (default 0.15), rootMargin, once (default true), and onEnter callback
    - Return `{ isInView: boolean }`
    - Fallback: if IntersectionObserver not supported, show elements in final state immediately
    - _Requirements: 4.4_

  - [x] 2.10 Create `src/components/LenisProvider.tsx`
    - Initialize Lenis instance on mount with smooth scrolling enabled
    - Register GSAP ScrollTrigger plugin via `gsap.registerPlugin(ScrollTrigger)`
    - Link Lenis scroll events to `ScrollTrigger.update()`
    - Link `gsap.ticker` to `lenis.raf(time * 1000)`, set `gsap.ticker.lagSmoothing(0)`
    - Expose Lenis instance via React context (`useLenis` hook)
    - Check `prefers-reduced-motion` and disable Lenis smooth if active
    - On unmount: `lenis.destroy()`, `ScrollTrigger.killAll()`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [x] 3. Checkpoint - Core infrastructure validation
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Section components — Hero and Gallery
  - [x] 4.1 Create `src/components/HeroSection.tsx`
    - 100vh section with dark background, autoplay muted looping background video with `object-fit: cover`
    - Ken Burns zoom-out effect: scale 1.05→1.0 over 8s CSS transition on mount
    - Eyebrow label: opacity 0→1, letter-spacing 0.3em→0.06em, 0.9s
    - Heading line 1: clipReveal 1.1s; line 2: clipReveal 1.1s with 200ms delay
    - CTA button: fadeUp with 300ms delay, hover scale 1.03 over 0.25s
    - Use `useAnimateOnView` for entrance trigger
    - Reduced motion: skip Ken Burns, show text immediately
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 17.1, 17.2_

  - [x] 4.2 Create `src/components/ParallaxGallery.tsx`
    - ~500vh tall section with alternating fullscreen image/video panels
    - Each panel: 100vh container with 130vh media element for parallax movement
    - `bindParallax(mediaEl, 0.4)` for vertical parallax per panel
    - ScrollTrigger scrub: scale 1.0→1.04 on enter
    - Videos: autoplay muted loop, same parallax as images
    - No text overlays — media only
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 16.2_

  - [x] 4.3 Write property test: ParallaxGallery equal treatment of media types (Property 7)
    - **Property 7: Equal media treatment**
    - **Validates: Requirements 7.5**
    - File: `src/components/__tests__/ParallaxGallery.property.test.tsx`
    - Generator: `fc.array(fc.constantFrom('image', 'video'), { minLength: 2, maxLength: 10 })`
    - Verify parallax factor and scale range are identical for image and video panels

- [x] 5. Section components — Text Interlude and Pinned Features
  - [x] 5.1 Create `src/components/TextInterludeSection.tsx`
    - Centered narrow text block as visual pause
    - Decorative line: width 0→100% over 0.6s with ease-out, triggered by IntersectionObserver
    - Heading: standard fadeUp animation
    - Paragraph: fadeUp with 150ms delay and 1.1s duration
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [x] 5.2 Create `src/components/PinnedFeatureTabs.tsx`
    - GSAP ScrollTrigger pinned section with 300vh scroll distance
    - 3 tabs: scroll progress divided into thirds (0-33%, 33-66%, 66-100%)
    - Active tab: black text + underline scaleX 0→1
    - Content exit: translateY 0→-20px, opacity 1→0, 0.3s
    - Content enter: translateY 20→0, opacity 0→1, 0.5s
    - Background video crossfade: opacity 0→1, 0.5s transition
    - 3 tabs each with own background video
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

  - [x] 5.3 Write property test: PinnedFeatureTabs scroll-to-tab mapping (Property 8)
    - **Property 8: Scroll-to-tab mapping**
    - **Validates: Requirements 9.2, 9.3, 9.6**
    - File: `src/components/__tests__/PinnedFeatureTabs.property.test.tsx`
    - Generator: `fc.float({ min: 0, max: 1 })`
    - Verify active tab index = `min(floor(p × 3), 2)`, only active tab underline has scaleX(1), only active video has opacity 1

- [x] 6. Section components — Tech Cards, Split Content, Partner Logos
  - [x] 6.1 Create `src/components/TechCardsSection.tsx`
    - Section heading over large background image with `bindParallax(el, 0.25)`
    - Heading: fadeUp animation
    - 3 horizontal cards: staggered entrance — opacity 0→1, scale 0.97→1, translateY 40→0, 150ms stagger, 0.8s per card
    - Card hover: translateY -6px, deeper box-shadow (CSS transition)
    - Card video overlay: opacity 0→1 on hover (CSS transition)
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [x] 6.2 Create `src/components/SplitContentSection.tsx`
    - Two-column grid: text left, image right
    - Image: translateX(60px→0), opacity 0→1, 0.9s
    - Text: translateX(-60px→0), opacity 0→1, 0.9s simultaneously
    - Trigger via `useAnimateOnView`
    - _Requirements: 11.1, 11.2, 11.3_

  - [x] 6.3 Create `src/components/PartnerLogosSection.tsx`
    - Heading: fadeUp animation
    - Logo row: staggered fade-in at 100ms intervals, 0.6s per logo
    - Logo hover: scale 1→1.05, 0.2s CSS transition
    - Testimonial: fadeUp with delay = `(logoCount - 1) × 100 + 200`ms after logos
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [x] 6.4 Write property test: PartnerLogos stagger timing (Property 9)
    - **Property 9: PartnerLogos stagger timing**
    - **Validates: Requirements 12.3, 12.4**
    - File: `src/components/__tests__/PartnerLogosSection.property.test.tsx`
    - Generator: `fc.integer({ min: 1, max: 20 })`
    - Verify logo `i` delay = `i × 100`ms, testimonial delay = `(N - 1) × 100 + 200`ms

- [x] 7. Checkpoint - Mid-implementation validation
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Section components — Insights, Careers CTA, Footer CTA
  - [x] 8.1 Create `src/components/InsightsGrid.tsx`
    - 3-column article card grid with header (title + "view all" link)
    - Row-staggered entrance: card delay = `(i % 3) × 150`ms, fadeUp 0.75s
    - Thumbnail hover: scale 1→1.07, container overflow hidden
    - Heading hover: underline width 0→100% (CSS transition)
    - _Requirements: 13.1, 13.2, 13.3, 13.4_

  - [x] 8.2 Write property test: InsightsGrid row-stagger delay (Property 10)
    - **Property 10: InsightsGrid row-stagger delay**
    - **Validates: Requirements 13.2**
    - File: `src/components/__tests__/InsightsGrid.property.test.tsx`
    - Generator: `fc.integer({ min: 0, max: 50 })`
    - Verify card at index `i` has delay `(i % 3) × 150`ms with fadeUp duration 0.75s

  - [x] 8.3 Create `src/components/CareersCTASection.tsx`
    - 2×2 mosaic photo grid with convergence effect
    - Top-left: translateX(-40px→0), top-right: translateX(40px→0), bottom-left: translateY(40px→0), bottom-right: translateY(40px→0) + 100ms delay; all 1.0s
    - Heading: clipReveal animation
    - CTA button: fadeUp with 200ms delay, hover scale 1.03 + glow box-shadow
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

  - [x] 8.4 Write property test: CareersCTA mosaic directional mapping (Property 11)
    - **Property 11: CareersCTA mosaic directional mapping**
    - **Validates: Requirements 14.2**
    - File: `src/components/__tests__/CareersCTASection.property.test.tsx`
    - Generator: `fc.constantFrom('top-left', 'top-right', 'bottom-left', 'bottom-right')`
    - Verify direction mapping: top-left→translateX(-40px), top-right→translateX(40px), bottom-left→translateY(40px), bottom-right→translateY(40px)+100ms delay

  - [x] 8.5 Create `src/components/FooterCTASection.tsx`
    - Full-bleed looping background video (autoplay muted loop, object-fit cover)
    - Heading: pure opacity fade 0→1 over 1.4s (no translateY)
    - Footer links: staggered fadeUp starting 600ms after heading, 80ms stagger between links
    - Copyright bar at bottom
    - _Requirements: 15.1, 15.2, 15.3_

  - [x] 8.6 Write property test: FooterCTA links stagger timing (Property 12)
    - **Property 12: FooterCTA links stagger timing**
    - **Validates: Requirements 15.3**
    - File: `src/components/__tests__/FooterCTASection.property.test.tsx`
    - Generator: `fc.integer({ min: 1, max: 30 })`
    - Verify link at index `i` has delay `600 + i × 80`ms using fadeUp

- [x] 9. Navbar rewrite and page structure migration
  - [x] 9.1 Rewrite `src/components/Navbar.tsx` to remove Framer Motion
    - Replace `motion.header` with plain div + useEffect GSAP tween for entrance (translateY -80→0, opacity 0→1)
    - Replace `useScroll`/`useTransform` progress bar with ScrollTrigger-based scroll progress
    - Replace AnimatePresence mobile menu with CSS transition + state toggle
    - Fixed header positioning preserved
    - _Requirements: 5.5_

  - [x] 9.2 Rewrite `src/app/page.tsx` with new section layout
    - Remove all old component imports (SmoothScroll, Hero, HeroTransition, ParallaxFloating, Platform, Scale, Technology, Safety, Partners, Insights, CTA, Footer, SectionTransition)
    - Import LenisProvider and all 10 new section components
    - Render sections in order: Navbar, HeroSection, ParallaxGallery, TextInterludeSection, PinnedFeatureTabs, TechCardsSection, SplitContentSection, PartnerLogosSection, InsightsGrid, CareersCTASection, FooterCTASection
    - Wrap all sections in LenisProvider
    - Remove all SectionTransition components
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 4.5_

  - [x] 9.3 Update `src/app/globals.css`
    - Preserve `var(--color-surface)` (#fafaf9) background color
    - Preserve `--ease-out-expo` CSS custom property
    - Remove marquee keyframe animation (used by old Marquee component)
    - Add `@media (prefers-reduced-motion: reduce)` rules: disable transitions, set `transition-duration: 0s` for hover interactions
    - _Requirements: 4.1, 4.2, 17.3_

- [x] 10. Legacy file cleanup
  - [x] 10.1 Remove legacy component files
    - Delete: `src/components/SmoothScroll.tsx`, `src/components/FadeIn.tsx`, `src/components/WordReveal.tsx`, `src/components/SectionTransition.tsx`, `src/components/Hills.tsx`, `src/components/HeroTransition.tsx`, `src/components/ParallaxFloating.tsx`, `src/components/Platform.tsx`, `src/components/Scale.tsx`, `src/components/Technology.tsx`, `src/components/Safety.tsx`, `src/components/Partners.tsx`, `src/components/Insights.tsx`, `src/components/CTA.tsx`, `src/components/Footer.tsx`, `src/components/ParallaxGrid.tsx`, `src/components/Hero.tsx`
    - _Requirements: 1.4, 4.5, 5.2, 5.3, 5.4_

  - [x] 10.2 Remove legacy magicui component files
    - Delete: `src/components/magicui/BlurFade.tsx`, `src/components/magicui/Marquee.tsx`, `src/components/magicui/NumberTicker.tsx`, `src/components/magicui/BorderBeam.tsx`, `src/components/magicui/ShimmerButton.tsx`
    - Check if `magicui/TextReveal.tsx` exists and delete if so
    - Keep `magicui/MagicCard.tsx` (no Framer Motion dependency)
    - Keep `magicui/AnimatedShinyText.tsx` if used, otherwise remove
    - _Requirements: 1.4_

  - [x] 10.3 Verify zero framer-motion imports across codebase
    - Search entire `src/` directory for any remaining `framer-motion` imports
    - Ensure no `three` imports remain (Hills.tsx removed)
    - _Requirements: 1.4, 1.6_

- [x] 11. Checkpoint - Full build validation
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Final integration and wiring
  - [x] 12.1 Verify page section order and component wiring
    - Confirm all 10 sections render in correct order in page.tsx
    - Confirm LenisProvider wraps the entire page content
    - Confirm Navbar scroll progress bar works with GSAP ScrollTrigger
    - Verify no orphaned imports or unused components
    - _Requirements: 5.1, 2.5_

  - [x] 12.2 Write unit tests for LenisProvider and animation utilities
    - Test LenisProvider: Lenis instance created, context provides it, cleanup destroys it
    - Test useAnimateOnView: IntersectionObserver created with correct options, callback fires, fallback behavior
    - Test animation utilities: null element handling, reduced motion behavior
    - File: `src/lib/__tests__/useAnimateOnView.test.ts`, `src/components/__tests__/LenisProvider.test.tsx`, `src/lib/__tests__/animations.test.ts`
    - _Requirements: 2.1, 2.4, 4.4, 17.1_

  - [x] 12.3 Write unit tests for section components
    - Test HeroSection: 100vh height, video attributes, Ken Burns class, CTA hover
    - Test ParallaxGallery: panel dimensions, no text overlays, video attributes
    - Test PinnedFeatureTabs: 3 tabs rendered, ScrollTrigger pin config
    - Test page structure: section order in DOM, absence of SectionTransition/Safety/Scale
    - File: `src/components/__tests__/sections.test.tsx`
    - _Requirements: 6.1, 6.2, 7.1, 7.6, 9.7, 5.1, 5.2, 5.3_

- [x] 13. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation after each major phase
- Property tests validate universal correctness properties from the design document (Properties 1-13)
- Unit tests validate specific examples, edge cases, and integration points
- All code is TypeScript targeting Next.js 15.3 with Tailwind CSS v4.2
- Testing uses Vitest + fast-check for property-based tests