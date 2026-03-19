import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';

const mocks = vi.hoisted(() => {
  return {
    mockLenisDestroy: vi.fn(),
    mockLenisOn: vi.fn(),
    mockLenisRaf: vi.fn(),
    mockLenisConstructor: vi.fn(),
    mockRegisterPlugin: vi.fn(),
    mockTickerAdd: vi.fn(),
    mockTickerRemove: vi.fn(),
    mockTickerLagSmoothing: vi.fn(),
    mockScrollTriggerKillAll: vi.fn(),
  };
});

vi.mock('@studio-freight/lenis', () => {
  function MockLenis(this: any) {
    mocks.mockLenisConstructor();
    this.destroy = mocks.mockLenisDestroy;
    this.on = mocks.mockLenisOn;
    this.raf = mocks.mockLenisRaf;
  }
  return { default: MockLenis };
});

vi.mock('gsap', () => ({
  default: {
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
    update: vi.fn(),
    killAll: mocks.mockScrollTriggerKillAll,
  },
}));

import LenisProvider, { useLenis } from '../LenisProvider';

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false, media: query, onchange: null,
      addListener: vi.fn(), removeListener: vi.fn(),
      addEventListener: vi.fn(), removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe('LenisProvider', () => {
  it('renders children', () => {
    render(<LenisProvider><div data-testid="child">Hello</div></LenisProvider>);
    expect(screen.getByTestId('child')).toBeDefined();
    expect(screen.getByText('Hello')).toBeDefined();
  });

  it('creates a Lenis instance on mount', () => {
    render(<LenisProvider><div>Content</div></LenisProvider>);
    expect(mocks.mockLenisConstructor).toHaveBeenCalled();
  });

  it('provides lenis instance via useLenis hook', () => {
    function TestConsumer() {
      const { lenis } = useLenis();
      return <div data-testid="lenis-value">{lenis ? 'has-lenis' : 'no-lenis'}</div>;
    }
    render(<LenisProvider><TestConsumer /></LenisProvider>);
    expect(screen.getByTestId('lenis-value').textContent).toBe('has-lenis');
  });

  it('calls lenis.destroy() and ScrollTrigger.killAll() on unmount', () => {
    const { unmount } = render(<LenisProvider><div>Content</div></LenisProvider>);
    unmount();
    expect(mocks.mockLenisDestroy).toHaveBeenCalled();
    expect(mocks.mockScrollTriggerKillAll).toHaveBeenCalled();
  });
});
