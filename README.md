# ⬡ Kenesis — See Everything. Miss Nothing.

**AI-Powered Visual Intelligence for Industry**

Kenesis transforms your existing CCTV infrastructure into an intelligent, real-time vision system that detects risks, tracks compliance, and secures operations at scale. Deploy in under 2 hours. No new hardware. No ML expertise.

---

## About This Repository

This repository contains the complete spec, design system reference, brand assets, and implementation plan for the **Kenesis landing page** — a premium, dark-themed marketing site for Kenesis Labs' AI visual intelligence platform.

### Key Stats

| Metric | Value |
|---|---|
| Detection Accuracy | 99.4% |
| Real-Time Latency | <80ms |
| Streams per Node | 500+ |
| Uptime | 24/7 Autonomous |

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 14** (App Router) | React framework with static export |
| **Tailwind CSS v4** | Utility-first styling with CSS custom properties |
| **GSAP + ScrollTrigger** | Scroll-driven animations, parallax, scrollytelling |
| **Framer Motion** | Component-level animations, enter/exit transitions |
| **TypeScript** | Type safety across the codebase |
| **Vitest + fast-check** | Unit tests and property-based testing |

---

## Design System

The visual identity follows the **Kenesis Art Direction & Design System** — a dark, industrial-precision aesthetic built on six core principles:

1. **Depth Before Decoration** — Atmospheric layering creates physical depth
2. **Glass Floats, Steel Grounds** — Glassmorphic elements float; skeuomorphic controls ground
3. **One Accent. One Glow.** — Orange (#FF6B35) is the only light source
4. **Type Does the Work** — Large, heavy headlines carry visual weight
5. **Shadows Are Purposeful** — Shadows encode hierarchy, not decoration
6. **Industrial Precision** — 8px grid, monospace data, control room aesthetic

### Color Palette

| Token | Hex | Role |
|---|---|---|
| `--color-brand` | `#FF6B35` | Primary accent, CTAs, glow source |
| `--color-brand-dark` | `#E55520` | Hover/pressed states |
| `--color-brand-light` | `#FF9A70` | Light accent variant |
| `--color-bg-dark` | `#070810` | Page background (near-black canvas) |
| `--color-surface-dark` | `#0a0d1a` | Card/panel surfaces |

### Typography

- **Headings/Body**: System sans-serif (system-ui)
- **Logo**: MBF Neowave
- **Monospace Data**: JetBrains Mono
- **Type Scale**: Display 56px → Label 10px (8 levels)

### Key Visual Treatments

- **Glassmorphism**: `backdrop-filter: blur(12px)`, rgba backgrounds, top-edge highlights
- **Skeuomorphism**: 3-stop gradient buttons, embossed metric cards, tactile controls
- **Glow Effects**: Orange glow shadows for active/interactive states
- **ISA-101 Status Colors**: Green (OK), Amber (Warning), Red (Critical) — functional only

---

## Project Structure

```
kenesis-website/
├── .kiro/
│   └── specs/
│       └── antigravity-landing-page/
│           ├── requirements.md      # 11 requirements with acceptance criteria
│           ├── design.md            # Full technical design document
│           ├── tasks.md             # 14 top-level tasks with sub-tasks
│           └── .config.kiro         # Spec configuration
├── assets/                          # Brand logos and visual assets
│   ├── KENESIS.png
│   ├── Kenesis Logo Landscape.png
│   ├── Kenesis Logo 16isto9.png
│   ├── Union.png                    # Logo symbol
│   └── ...
├── inspos/                          # Inspiration reference images
├── Kenesis_ArtDirection_DesignSystem.md   # Design system reference
├── Kenesis_ArtDirection_DesignSystem.pdf  # Design system PDF
└── README.md
```

### Planned Code Structure (Post-Implementation)

```
antigravity-landing/
├── app/
│   ├── layout.tsx              # Root layout (fonts, metadata, JSON-LD)
│   ├── page.tsx                # Landing page composition
│   └── globals.css             # Kenesis design tokens + Tailwind
├── components/
│   ├── ui/                     # 10 shared UI components
│   │   ├── GlassCard.tsx       # Glassmorphism panels
│   │   ├── GlowButton.tsx      # Skeuomorphic primary CTA
│   │   ├── GhostButton.tsx     # Ghost variant
│   │   ├── GlassPillButton.tsx # Hydraoo-style pill CTA
│   │   ├── Badge.tsx           # ISA-101 status badges
│   │   ├── MetricCard.tsx      # Embossed metric display
│   │   ├── CameraFeedCard.tsx  # HUD corners camera feed
│   │   ├── CommandPanel.tsx    # Terminal-style panel
│   │   ├── InputField.tsx      # Styled input
│   │   └── SectionContainer.tsx
│   ├── NavigationBar.tsx       # Fixed glassmorphism nav
│   ├── HeroSection.tsx         # GSAP parallax + char-reveal
│   ├── FeaturesSection.tsx     # Framer Motion card grid
│   ├── UseCasesSection.tsx     # GSAP scrollytelling
│   ├── SocialProofSection.tsx  # Count-up metrics + trust logos
│   ├── CTASection.tsx          # Closing CTA
│   └── Footer.tsx              # 4-column grid footer
├── hooks/                      # 6 custom animation hooks
│   ├── useParallax.ts          # GSAP ScrollTrigger parallax
│   ├── useScrollytelling.ts    # GSAP pin/snap panels
│   ├── useCountUp.ts           # GSAP tween counter
│   ├── useTextAnimation.ts     # GSAP text reveals
│   ├── useIntersectionObserver.ts
│   └── useReducedMotion.ts     # Accessibility
└── lib/
    └── gsap.ts                 # Plugin registration
```

---

## Landing Page Sections

| Section | Description | Animation |
|---|---|---|
| **Hero** | "See Everything. Miss Nothing." + 4 key stats | GSAP char-reveal, parallax background |
| **Features** | 4+ capability cards + CameraFeedCard demo | Framer Motion staggered fade-up |
| **Use Cases** | Manufacturing, Logistics, Energy panels | GSAP ScrollTrigger scrollytelling |
| **Social Proof** | Metric cards + trust logos row | GSAP count-up animation |
| **CTA** | "Ready to See Everything?" + demo form | GSAP fade-up headline |
| **Footer** | 4-column grid (brand, product, company, legal) | Static server component |

---

## Spec-Driven Development

This project uses **spec-driven development** with Kiro. The full specification lives in `.kiro/specs/antigravity-landing-page/`:

- **requirements.md** — 11 requirements covering brand guidelines, design system, visual design, all page sections, animations, responsive layout, and navigation
- **design.md** — Complete technical design with component code, hooks, architecture diagrams, design tokens, SEO/performance/security specs, and 24 correctness properties
- **tasks.md** — 14 top-level implementation tasks across 3 phases (Pencil design → project setup → code build)

### Correctness Properties

The design defines 24 formal correctness properties validated via property-based testing (fast-check):

- Spacing tokens divisible by 4
- Glassmorphism/skeuomorphism visual properties
- Parallax speed bounds (0 < speed < 1)
- Scrollytelling index bounds
- Animation duration token matching
- WCAG color contrast minimums
- Semantic HTML structure
- Security headers presence
- Orange-only accent enforcement
- And more...

---

## SEO & Performance

- **Metadata**: Next.js Metadata API with Open Graph, Twitter Cards, canonical URL
- **Structured Data**: JSON-LD Organization schema for Kenesis Labs
- **Sitemap**: Auto-generated via next-sitemap
- **Lighthouse Target**: ≥90 in all categories
- **Core Web Vitals**: LCP ≤2.5s, CLS ≤0.1, INP ≤100ms

## Security

- Content Security Policy (CSP)
- Strict-Transport-Security (HSTS)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Client-side email validation with sanitization

---

## Getting Started

```bash
# Install dependencies (after code implementation)
npm install

# Development
npm run dev

# Build (static export)
npm run build

# Analyze bundle
ANALYZE=true npm run build

# Run tests
npm test

# Generate sitemap
npx next-sitemap
```

---

## Brand Assets

Logo font: **MBF Neowave**
Primary logo files are in `/assets/`. SVG versions coming soon.

---

**Kenesis Labs Private Limited** · [kenesis.ai](https://kenesis.ai) · Confidential · March 2026
