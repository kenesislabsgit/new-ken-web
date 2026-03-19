# Requirements Document

## Introduction

This document defines the requirements for migrating the Kenesis landing page animation system from its current Framer Motion v12 stack to a GSAP + ScrollTrigger + Lenis smooth scroll stack. The existing site (built with Next.js 15.3, Tailwind CSS v4.2, and Framer Motion) already has scroll-linked animations, entrance effects, and parallax behaviors across 14+ components. This migration replaces all Framer Motion usage with GSAP-powered equivalents, introduces Lenis for inertia-based smooth scrolling, adds `prefers-reduced-motion` accessibility support, and restructures the page into ten distinct cinematic sections. The page background is `var(--color-surface)` (#fafaf9) and all animations follow a unified easing token (`--ease-out-expo`: cubic-bezier(0.16, 1, 0.3, 1)) and stagger convention.

### Migration Context

The current codebase uses the following animation components that will be replaced:

| Current Component | Animation Library | Replacement |
|---|---|---|
| `SmoothScroll.tsx` | Framer Motion (fade-in wrapper + scroll reset) | Lenis_Scroller integration |
| `BlurFade.tsx` | Framer Motion (fade + blur + translateY) | GSAP `fadeUp` utility |
| `FadeIn.tsx` | Framer Motion (opacity + translateY, [0.22, 1, 0.36, 1]) | GSAP `fadeUp` utility |
| `WordReveal.tsx` | Framer Motion (word-by-word clip reveal, 0.7s, stagger 0.035s) | GSAP `clipReveal` utility |
| `SectionTransition.tsx` | Framer Motion useScroll + useTransform (5 variants) | Removed — sections transition directly |
| `ParallaxFloating.tsx` | Framer Motion (mouse-tracked floating items) | ParallaxGallery (scroll-based parallax) |
| `HeroTransition.tsx` | Framer Motion (200vh sticky, scroll-linked text reveals) | TextInterludeSection |
| `Hero.tsx` | Framer Motion (250vh sticky, WordReveal, scroll-linked opacity/scale) | HeroSection (100vh, GSAP clip-reveal, Ken Burns) |
| `Platform.tsx` | Framer Motion (two feature cards with useScroll parallax) | PinnedFeatureTabs (3-tab pinned section) |
| `Technology.tsx` | Framer Motion (3 alternating-layout tech cards with parallax images) | TechCardsSection (horizontal staggered cards) |
| `Partners.tsx` | Framer Motion + CSS Marquee (logo carousel + testimonial) | PartnerLogosSection (staggered fade-in row) |
| `Insights.tsx` | Framer Motion (draggable horizontal carousel) | InsightsGrid (3-column grid) |
| `CTA.tsx` | Framer Motion (scale-on-scroll dark card) | CareersCTASection (mosaic photo grid) |
| `Footer.tsx` | Three.js Hills background + Framer Motion | FooterCTASection (video background + opacity fade) |

## Glossary

- **Animation_System**: The client-side module that initializes GSAP, registers ScrollTrigger, and exposes shared animation utilities (fadeUp, clipReveal, bindParallax). Replaces the current per-component Framer Motion animations.
- **Scroll_Engine**: The combination of GSAP ScrollTrigger (for pinned/scrub-linked animations) and IntersectionObserver (for one-shot entrance animations). Replaces the current Framer Motion `useScroll` + `useTransform` + `useInView` hooks.
- **Lenis_Scroller**: The Lenis smooth scroll instance that provides inertia-based scrolling and is linked to GSAP ScrollTrigger's update cycle. Replaces the current `SmoothScroll.tsx` wrapper component.
- **HeroSection**: Section 1 — full-viewport hero with background video, eyebrow label, clip-reveal heading, and CTA button. Replaces the current `Hero.tsx` (250vh sticky section with WordReveal and scroll-linked opacity/scale).
- **ParallaxGallery**: Section 2 — tall vertical section with alternating fullscreen image/video panels using parallax and scroll-scrubbed scale. Replaces the current `ParallaxFloating.tsx` (mouse-interactive floating media items).
- **TextInterludeSection**: Section 3 — centered narrow text block with decorative line animation. Replaces the current `HeroTransition.tsx` (200vh sticky scroll-linked text reveals) and absorbs the decorative line from `Scale.tsx`.
- **PinnedFeatureTabs**: Section 4 — GSAP-pinned section with three scroll-driven tabs, animated underlines, and crossfading background videos. Replaces the current `Platform.tsx` (two-card layout with Framer Motion parallax).
- **TechCardsSection**: Section 5 — section heading over a parallax background image with three horizontally staggered cards. Replaces the current `Technology.tsx` (three alternating-layout tech cards with Framer Motion parallax images).
- **SplitContentSection**: Section 6 — two-column layout with opposing horizontal slide-in animations. New section — no existing equivalent in the current codebase.
- **PartnerLogosSection**: Section 7 — heading, horizontal logo row, and testimonial with staggered fade-ins. Replaces the current `Partners.tsx` (Marquee logo carousel + testimonial blockquote).
- **InsightsGrid**: Section 8 — three-column article card grid with row-staggered entrance and hover effects. Replaces the current `Insights.tsx` (draggable horizontal card carousel).
- **CareersCTASection**: Section 9 — mosaic photo grid with convergence effect and clip-reveal heading. Replaces the current `CTA.tsx` (scale-on-scroll dark card with heading + buttons).
- **FooterCTASection**: Section 10 — full-bleed background video with opacity-faded heading and staggered footer links. Replaces the current `Footer.tsx` (dark footer with Three.js Hills WebGL background).
- **Fade_Up**: Default entrance animation — opacity 0→1 + translateY(30px→0), duration 0.8s, easing cubic-bezier(0.16, 1, 0.3, 1). Replaces the current `FadeIn.tsx` (translateY 40px, [0.22, 1, 0.36, 1]) and `BlurFade.tsx` (translateY 6px + blur, easeOut).
- **Clip_Reveal**: Curtain/clip animation — text line revealed via overflow hidden + translateY(100%→0). Replaces the current `WordReveal.tsx` (word-by-word clip reveal with stagger).
- **Scrub**: GSAP ScrollTrigger mode where animation progress is directly linked to scroll position. Replaces the current Framer Motion `useScroll` + `useTransform` pattern used in Hero, Platform, and SectionTransition components.
- **Pin**: GSAP ScrollTrigger mode where an element remains fixed in the viewport while the user scrolls through a defined distance. Replaces the current CSS `sticky` positioning used in Hero.tsx and HeroTransition.tsx.


## Requirements

### Requirement 1: Framer Motion Removal and Dependency Migration

**User Story:** As a developer, I want to remove the `framer-motion` dependency and replace it with GSAP + Lenis, so that the project uses a single, consistent animation stack without redundant libraries.

#### Acceptance Criteria

1. THE Animation_System SHALL require `gsap` as a project dependency, replacing `framer-motion` v12.0.0.
2. THE Animation_System SHALL require `@studio-freight/lenis` as a project dependency.
3. THE Animation_System SHALL use the GSAP ScrollTrigger plugin bundled with the `gsap` package.
4. WHEN the migration is complete, THE Animation_System SHALL have zero imports from the `framer-motion` package across the entire codebase.
5. WHEN the migration is complete, THE Animation_System SHALL remove `framer-motion` from `package.json` dependencies.
6. THE Animation_System SHALL retain the existing `three` and `@types/three` dependencies only if the FooterCTASection continues to use the Hills WebGL background; otherwise THE Animation_System SHALL remove them.

### Requirement 2: Scroll Engine Initialization and Lenis Integration

**User Story:** As a developer, I want a unified scroll engine that combines Lenis smooth scrolling with GSAP ScrollTrigger, so that all scroll-driven animations share a single, synchronized scroll context — replacing the current `SmoothScroll.tsx` wrapper.

#### Acceptance Criteria

1. WHEN the page loads, THE Animation_System SHALL initialize a Lenis_Scroller instance with smooth scrolling enabled and link its scroll updates to GSAP ScrollTrigger via `ScrollTrigger.update()` on each Lenis `scroll` event.
2. WHEN the page loads, THE Animation_System SHALL register the GSAP ScrollTrigger plugin via `gsap.registerPlugin(ScrollTrigger)` before any scroll-driven animations are created.
3. THE Lenis_Scroller SHALL use `requestAnimationFrame` for its animation loop and call `lenis.raf(time)` on each frame.
4. WHEN the Next.js route unmounts, THE Animation_System SHALL destroy the Lenis_Scroller instance and kill all GSAP ScrollTrigger instances to prevent memory leaks.
5. THE Animation_System SHALL expose the Lenis_Scroller instance via a React context so that child components can access scroll position data.
6. THE Animation_System SHALL replace the current `SmoothScroll.tsx` component (which only resets scroll position and applies a Framer Motion fade-in wrapper) with the Lenis-based scroll provider.

### Requirement 3: Shared Animation Utilities

**User Story:** As a developer, I want reusable GSAP animation utility functions, so that I can apply consistent entrance and scroll-driven animations across all sections — replacing the current `BlurFade.tsx`, `FadeIn.tsx`, and `WordReveal.tsx` components.

#### Acceptance Criteria

1. THE Animation_System SHALL provide a `fadeUp` utility that animates an element from opacity 0, translateY(30px) to opacity 1, translateY(0) over 0.8s using cubic-bezier(0.16, 1, 0.3, 1) easing. This replaces the current `FadeIn.tsx` (translateY 40px, 0.8s, [0.22, 1, 0.36, 1]) and `BlurFade.tsx` (translateY 6px, 0.4s, blur 8px, easeOut).
2. THE Animation_System SHALL provide a `clipReveal` utility that animates a text line from translateY(100%) to translateY(0) within an overflow-hidden container over 1.1s using cubic-bezier(0.16, 1, 0.3, 1) easing. This replaces the current `WordReveal.tsx` (word-by-word clip reveal, 0.7s per word, 0.035s stagger).
3. THE Animation_System SHALL provide a `bindParallax` utility that applies a scroll-driven translateY offset to an element based on a configurable scroll delta factor using `requestAnimationFrame`.
4. WHEN a parent block contains multiple children (label, heading, paragraph, CTA), THE Animation_System SHALL stagger each child animation by 120ms.
5. THE Animation_System SHALL apply `will-change: transform` to every element that uses translateY or translateX animations for GPU acceleration.

### Requirement 4: Global Animation Defaults

**User Story:** As a designer, I want all text nodes to use a consistent fade-up entrance animation by default, so that the page has a cohesive cinematic feel.

#### Acceptance Criteria

1. THE Animation_System SHALL preserve the existing page background color of `var(--color-surface)` (#fafaf9) defined in `globals.css`.
2. THE Animation_System SHALL use the existing `--ease-out-expo` CSS custom property (cubic-bezier(0.16, 1, 0.3, 1)) as the base easing token for all animations unless a section specifies a different easing.
3. WHEN a text node enters the viewport, THE Animation_System SHALL apply the Fade_Up animation (opacity 0→1, translateY 30px→0, 0.8s duration) as the default entrance animation.
4. THE Scroll_Engine SHALL use GSAP ScrollTrigger for pinned sections and scrub-linked animations, and IntersectionObserver for simpler one-shot entrance animations.
5. THE Animation_System SHALL remove all `SectionTransition` components (line, gradient, dots, wipe, reveal variants) from the page layout — sections transition directly without decorative dividers.

### Requirement 5: Page Structure Migration

**User Story:** As a developer, I want the page layout restructured from the current 14+ component arrangement to a clean 10-section layout, so that the page flow matches the new animation design.

#### Acceptance Criteria

1. THE page SHALL render the following sections in order within the Lenis scroll provider: Navbar, HeroSection, ParallaxGallery, TextInterludeSection, PinnedFeatureTabs, TechCardsSection, SplitContentSection, PartnerLogosSection, InsightsGrid, CareersCTASection, FooterCTASection.
2. THE page SHALL remove the `SectionTransition` components that currently separate sections (wipe, reveal, gradient, dots variants).
3. THE page SHALL remove the `Safety.tsx` section from the layout (its content is not mapped to any new section).
4. THE page SHALL remove the `Scale.tsx` section as a standalone component (its decorative line concept is absorbed into TextInterludeSection).
5. WHEN the page loads, THE Navbar SHALL remain as a fixed header element, preserving its current scroll progress bar behavior but reimplemented with GSAP instead of Framer Motion.

### Requirement 6: HeroSection Animations

**User Story:** As a visitor, I want the hero section to feel immersive with a cinematic video background and staggered text reveals, so that I am immediately engaged with the page.

#### Acceptance Criteria

1. THE HeroSection SHALL occupy 100vh of the viewport with a dark background, replacing the current `Hero.tsx` which uses 250vh with CSS sticky positioning and scroll-linked opacity/scale.
2. WHEN the page loads, THE HeroSection SHALL autoplay a muted, looping background video with `object-fit: cover`.
3. WHEN the page loads, THE HeroSection background video SHALL apply a Ken Burns zoom-out effect, scaling from 1.05 to 1.0 over 8 seconds using a CSS transition.
4. WHEN the HeroSection enters the viewport, THE HeroSection eyebrow label SHALL animate from opacity 0 to 1 and letter-spacing from 0.3em to 0.06em over 0.9s.
5. WHEN the HeroSection enters the viewport, THE HeroSection heading line 1 SHALL perform a Clip_Reveal animation (translateY 100%→0 within overflow hidden) over 1.1s, replacing the current WordReveal word-by-word animation.
6. WHEN the HeroSection heading line 1 completes its reveal, THE HeroSection heading line 2 SHALL perform the same Clip_Reveal animation with a 200ms delay.
7. WHEN the HeroSection heading animation completes, THE HeroSection CTA button SHALL perform a Fade_Up animation with a 300ms delay.
8. WHEN a user hovers over the HeroSection CTA button, THE HeroSection CTA button SHALL scale to 1.03 over 0.25s with ease timing.

### Requirement 7: ParallaxGallery Animations

**User Story:** As a visitor, I want to scroll through a tall gallery of fullscreen images and videos with parallax depth, so that the page feels layered and cinematic.

#### Acceptance Criteria

1. THE ParallaxGallery SHALL be a tall vertical section with approximately 500vh of scroll height, containing alternating fullscreen image and video panels. This replaces the current `ParallaxFloating.tsx` which uses mouse-tracked floating media items with no scroll parallax.
2. THE ParallaxGallery SHALL render each panel container at 100vh height with the media element at 130vh height to enable parallax movement.
3. WHILE the user scrolls through a ParallaxGallery panel, THE ParallaxGallery media element SHALL translate vertically at 40% of the scroll delta using `requestAnimationFrame`.
4. WHEN a ParallaxGallery panel enters the viewport, THE ParallaxGallery media element SHALL scale from 1.0 to 1.04 using a GSAP ScrollTrigger scrub animation.
5. THE ParallaxGallery video panels SHALL autoplay muted and loop, applying the same parallax behavior as image panels.
6. THE ParallaxGallery panels SHALL display media only, with no text overlays.

### Requirement 8: TextInterludeSection Animations

**User Story:** As a visitor, I want a visual pause between gallery and feature sections with a clean text block and decorative line, so that the page has rhythm and breathing room.

#### Acceptance Criteria

1. THE TextInterludeSection SHALL render a narrower centered text block as a visual pause between sections. This replaces the current `HeroTransition.tsx` (200vh sticky section with scroll-linked text reveals) and absorbs the animated line concept from `Scale.tsx`.
2. WHEN the TextInterludeSection enters the viewport (detected by IntersectionObserver), THE TextInterludeSection decorative line SHALL animate its width from 0% to 100% over 0.6s with ease-out timing.
3. WHEN the TextInterludeSection enters the viewport, THE TextInterludeSection heading SHALL perform a standard Fade_Up animation.
4. WHEN the TextInterludeSection heading animation begins, THE TextInterludeSection paragraph SHALL perform a Fade_Up animation with a 150ms delay and 1.1s duration.

### Requirement 9: PinnedFeatureTabs Animations

**User Story:** As a visitor, I want to scroll through a pinned section where tabs switch automatically based on scroll position, so that I can explore features without clicking.

#### Acceptance Criteria

1. THE PinnedFeatureTabs SHALL be pinned in the viewport using GSAP ScrollTrigger with a 300vh scroll distance. This replaces the current `Platform.tsx` which uses a two-card layout with Framer Motion `useScroll` + `useTransform` parallax.
2. WHILE the user scrolls through the PinnedFeatureTabs pinned region, THE PinnedFeatureTabs SHALL divide the scroll distance into three equal thirds, each corresponding to one tab.
3. WHEN a tab becomes active via scroll position, THE PinnedFeatureTabs active tab label SHALL display black text and an animated underline that scales from scaleX(0) to scaleX(1).
4. WHEN a tab exits, THE PinnedFeatureTabs tab content SHALL animate out with translateY(0→-20px) and opacity 1→0.
5. WHEN a tab enters, THE PinnedFeatureTabs tab content SHALL animate in with translateY(20px→0) and opacity 0→1.
6. WHEN a tab becomes active, THE PinnedFeatureTabs background video SHALL crossfade to the corresponding video with a 0.5s opacity transition.
7. THE PinnedFeatureTabs SHALL support exactly 3 tabs, each with its own background video.

### Requirement 10: TechCardsSection Animations

**User Story:** As a visitor, I want to see technology cards appear with a staggered entrance over a parallax background, so that the section feels dynamic and layered.

#### Acceptance Criteria

1. THE TechCardsSection SHALL display a section heading over a large background image with a parallax factor of 0.25. This replaces the current `Technology.tsx` which uses three alternating-layout tech cards with Framer Motion parallax images.
2. WHEN the TechCardsSection enters the viewport, THE TechCardsSection heading SHALL perform a Fade_Up animation.
3. WHEN the TechCardsSection cards enter the viewport, THE TechCardsSection SHALL animate 3 horizontal cards with a staggered entrance: opacity 0→1, scale 0.97→1, translateY(40px→0), 150ms stagger, 0.8s duration per card.
4. WHEN a user hovers over a TechCardsSection card, THE TechCardsSection card SHALL translate by -6px on the Y axis and apply a deeper box-shadow.
5. WHEN a user hovers over a TechCardsSection card, THE TechCardsSection card video SHALL transition from opacity 0 to opacity 1.

### Requirement 11: SplitContentSection Animations

**User Story:** As a visitor, I want the two-column content section to slide in from opposite sides simultaneously, so that the layout feels balanced and intentional.

#### Acceptance Criteria

1. THE SplitContentSection SHALL render a two-column layout with text on the left and an image on the right. This is a new section with no existing equivalent in the current codebase.
2. WHEN the SplitContentSection enters the viewport, THE SplitContentSection image SHALL animate from translateX(60px), opacity 0 to translateX(0), opacity 1 over 0.9s.
3. WHEN the SplitContentSection enters the viewport, THE SplitContentSection text SHALL animate from translateX(-60px), opacity 0 to translateX(0), opacity 1 over 0.9s simultaneously with the image.

### Requirement 12: PartnerLogosSection Animations

**User Story:** As a visitor, I want partner logos to appear in a staggered sequence followed by a testimonial, so that the social proof section feels polished and trustworthy.

#### Acceptance Criteria

1. THE PartnerLogosSection SHALL display a heading, a horizontal row of partner logos, and a testimonial block. This replaces the current `Partners.tsx` which uses a CSS keyframe `Marquee` infinite-scroll carousel with pause-on-hover.
2. WHEN the PartnerLogosSection enters the viewport, THE PartnerLogosSection heading SHALL perform a Fade_Up animation.
3. WHEN the PartnerLogosSection logos enter the viewport, THE PartnerLogosSection SHALL animate each logo with a staggered fade-in at 100ms intervals over 0.6s per logo, replacing the current infinite marquee scroll.
4. WHEN the PartnerLogosSection logos complete their entrance, THE PartnerLogosSection testimonial SHALL perform a Fade_Up animation with a 200ms delay after the last logo.
5. WHEN a user hovers over a PartnerLogosSection logo, THE PartnerLogosSection logo SHALL scale from 1 to 1.05 over 0.2s.

### Requirement 13: InsightsGrid Animations

**User Story:** As a visitor, I want article cards to appear row by row with hover effects on thumbnails and headings, so that the content grid feels alive and interactive.

#### Acceptance Criteria

1. THE InsightsGrid SHALL display a 3-column article card grid. This replaces the current `Insights.tsx` which uses a Framer Motion draggable horizontal card carousel.
2. WHEN the InsightsGrid cards enter the viewport, THE InsightsGrid SHALL animate cards by row with staggered delays: first card at 0ms, second card at 150ms, third card at 300ms, each with a Fade_Up animation over 0.75s.
3. WHEN a user hovers over an InsightsGrid card, THE InsightsGrid card thumbnail SHALL scale from 1 to 1.07 with the card container applying overflow hidden to clip the scaled image.
4. WHEN a user hovers over an InsightsGrid card, THE InsightsGrid card heading underline SHALL animate from width 0% to 100%.

### Requirement 14: CareersCTASection Animations

**User Story:** As a visitor, I want the careers section to feel energetic with photos converging from different directions and a bold heading reveal, so that I am motivated to explore career opportunities.

#### Acceptance Criteria

1. THE CareersCTASection SHALL display a 2×2 mosaic photo grid with a convergence effect. This replaces the current `CTA.tsx` which uses a Framer Motion scale-on-scroll dark card with heading and buttons.
2. WHEN the CareersCTASection enters the viewport, THE CareersCTASection mosaic images SHALL each animate in from a different direction (top-left, top-right, bottom-left, bottom-right) converging to their final positions.
3. WHEN the CareersCTASection enters the viewport, THE CareersCTASection heading SHALL perform a Clip_Reveal animation.
4. WHEN the CareersCTASection heading animation completes, THE CareersCTASection CTA button SHALL perform a Fade_Up animation with a 200ms delay.
5. WHEN a user hovers over the CareersCTASection CTA button, THE CareersCTASection CTA button SHALL scale to 1.03 and apply a glow box-shadow effect.

### Requirement 15: FooterCTASection Animations

**User Story:** As a visitor, I want the footer to feel cinematic with a full-bleed video background and a slow-fading heading, so that the page ends with impact.

#### Acceptance Criteria

1. THE FooterCTASection SHALL display a full-bleed looping background video. This replaces the current `Footer.tsx` which uses a Three.js Hills WebGL background.
2. WHEN the FooterCTASection enters the viewport, THE FooterCTASection heading SHALL animate with a pure opacity fade from 0 to 1 over 1.4s.
3. WHEN the FooterCTASection heading animation begins, THE FooterCTASection footer links SHALL perform staggered Fade_Up animations starting 600ms after the heading, with 80ms stagger between each link.

### Requirement 16: GPU Acceleration and Performance

**User Story:** As a developer, I want all transform-based animations to use GPU acceleration, so that animations run at 60fps without jank.

#### Acceptance Criteria

1. THE Animation_System SHALL apply `will-change: transform` to every DOM element that uses translateY or translateX animations.
2. THE Animation_System SHALL use `requestAnimationFrame` for parallax scroll calculations in the ParallaxGallery to avoid layout thrashing.
3. WHEN the component unmounts, THE Animation_System SHALL remove `will-change` properties and kill associated GSAP tweens to free GPU memory.

### Requirement 17: Accessibility and Reduced Motion

**User Story:** As a visitor who prefers reduced motion, I want animations to be disabled or minimized, so that I can use the page comfortably. The current codebase has no `prefers-reduced-motion` support.

#### Acceptance Criteria

1. WHEN the user has `prefers-reduced-motion: reduce` enabled, THE Animation_System SHALL skip all entrance animations and display elements in their final state immediately.
2. WHEN the user has `prefers-reduced-motion: reduce` enabled, THE Animation_System SHALL disable parallax scroll effects and Ken Burns zoom effects.
3. WHEN the user has `prefers-reduced-motion: reduce` enabled, THE Animation_System SHALL still allow hover interactions (scale, shadow) but reduce their duration to 0s.
