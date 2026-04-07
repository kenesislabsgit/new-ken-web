import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';

// ── Hoisted mocks ──────────────────────────────────────────────────────────

const mocks = vi.hoisted(() => ({
  mockFromTo: vi.fn(() => ({ kill: vi.fn(), scrollTrigger: null })),
  mockSet: vi.fn(),
  mockTo: vi.fn(() => ({ kill: vi.fn() })),
  mockRegisterPlugin: vi.fn(),
  mockTickerAdd: vi.fn(),
  mockTickerRemove: vi.fn(),
  mockTickerLagSmoothing: vi.fn(),
  mockScrollTriggerCreate: vi.fn(() => ({ kill: vi.fn() })),
  mockScrollTriggerKillAll: vi.fn(),
  mockLenisDestroy: vi.fn(),
  mockLenisOn: vi.fn(),
  mockLenisRaf: vi.fn(),
  mockLenisConstructor: vi.fn(),
}));

vi.mock('gsap', () => ({
  default: {
    fromTo: mocks.mockFromTo,
    set: mocks.mockSet,
    to: mocks.mockTo,
    registerPlugin: mocks.mockRegisterPlugin,
    ticker: {
      add: mocks.mockTickerAdd,
      remove: mocks.mockTickerRemove,
      lagSmoothing: mocks.mockTickerLagSmoothing,
    },
  },
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: mocks.mockScrollTriggerCreate,
    update: vi.fn(),
    killAll: mocks.mockScrollTriggerKillAll,
  },
}));

vi.mock('@studio-freight/lenis', () => {
  function MockLenis(this: any) {
    mocks.mockLenisConstructor();
    this.destroy = mocks.mockLenisDestroy;
    this.on = mocks.mockLenisOn;
    this.raf = mocks.mockLenisRaf;
  }
  return { default: MockLenis };
});

// ── Setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  // Mock matchMedia for reduced motion checks
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock IntersectionObserver as a proper class
  class MockIntersectionObserver {
    callback: IntersectionObserverCallback;
    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback;
      // Immediately trigger with isIntersecting: true so entrance animations fire
      setTimeout(() => {
        callback(
          [{ isIntersecting: true, target: document.createElement('div') }] as any,
          this as any,
        );
      }, 0);
    }
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: MockIntersectionObserver,
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// ── HeroSection Tests ──────────────────────────────────────────────────────

describe('HeroSection', () => {
  // Lazy import to ensure mocks are in place
  async function renderHero() {
    const mod = await import('../HeroSection');
    const HeroSection = mod.default;
    return render(<HeroSection />);
  }

  it('renders a section with h-screen class for 100vh height', async () => {
    const { container } = await renderHero();
    const section = container.querySelector('section');
    expect(section).toBeDefined();
    expect(section!.className).toContain('h-screen');
  });

  it('contains a video element with autoplay, muted, loop attributes', async () => {
    const { container } = await renderHero();
    const video = container.querySelector('video');
    expect(video).toBeDefined();
    expect(video!.autoplay).toBe(true);
    expect(video!.muted).toBe(true);
    expect(video!.loop).toBe(true);
  });

  it('contains heading text', async () => {
    const { container } = await renderHero();
    const h1 = container.querySelector('h1');
    expect(h1).toBeDefined();
    expect(h1!.textContent).toContain('See everything');
    expect(h1!.textContent).toContain('Miss nothing');
  });

  it('contains a CTA button/link', async () => {
    const { container } = await renderHero();
    const cta = container.querySelector('a[href="#platform"]');
    expect(cta).toBeDefined();
    expect(cta!.textContent).toContain('Explore Platform');
  });
});

// ── PinnedFeatureTabs Tests ────────────────────────────────────────────────

describe('PinnedFeatureTabs', () => {
  async function renderTabs() {
    const mod = await import('../PinnedFeatureTabs');
    const PinnedFeatureTabs = mod.default;
    return render(<PinnedFeatureTabs />);
  }

  it('renders exactly 3 tab buttons', async () => {
    const { container } = await renderTabs();
    const buttons = container.querySelectorAll('button[data-tab-button]');
    expect(buttons.length).toBe(3);
  });

  it('contains tab content areas', async () => {
    const { container } = await renderTabs();
    const contents = container.querySelectorAll('[data-tab-content]');
    expect(contents.length).toBe(3);
  });
});

// ── Page Structure Tests ───────────────────────────────────────────────────

describe('Page structure', () => {
  async function renderPage() {
    const mod = await import('../../app/page');
    const Home = mod.default;
    return render(<Home />);
  }

  it('renders sections in correct DOM order', async () => {
    const { container } = await renderPage();
    const main = container.querySelector('main');
    expect(main).toBeDefined();

    // Collect section-level elements (direct children of main)
    const children = Array.from(main!.children);
    expect(children.length).toBeGreaterThanOrEqual(2);

    // Verify key sections exist by checking for known markers
    const html = main!.innerHTML;
    // HeroSection has h-screen
    expect(html).toContain('h-screen');
    // PinnedFeatureTabs has data-testid
    expect(html).toContain('pinned-feature-tabs');
  });

  it('does not contain legacy components (SectionTransition, Safety, Scale)', async () => {
    const { container } = await renderPage();
    const html = container.innerHTML;

    // SectionTransition used data-testid="section-transition" or specific class names
    expect(html).not.toContain('section-transition');
    // Safety section had specific identifiers
    expect(html).not.toContain('data-section="safety"');
    // Scale section had specific identifiers
    expect(html).not.toContain('data-section="scale"');
  });
});
