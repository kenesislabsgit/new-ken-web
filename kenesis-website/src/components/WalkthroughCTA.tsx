'use client';

import { Button } from '@heroui/react';
import Link from 'next/link';

export function WalkthroughCTA() {
  return (
    <a href="/contact">
      <Button variant="primary" size="lg" className="font-mono-accent uppercase text-[15px] rounded-[1.2rem] cursor-pointer">
        Book a walkthrough
      </Button>
    </a>
  );
}

export function WalkthroughCTABottom() {
  return (
    <a href="/contact">
      <Button variant="primary" size="lg" className="font-mono-accent uppercase text-[15px] rounded-[1.2rem] cursor-pointer">
        Book a walkthrough
      </Button>
    </a>
  );
}
