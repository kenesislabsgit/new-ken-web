import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Book a walkthrough of Kenesis. We connect to your cameras and show you real-time PPE compliance and safety monitoring on your own hardware. No commitment required.',
  alternates: { canonical: 'https://kenesis.ai/contact' },
  openGraph: {
    title: 'Contact Kenesis | Book a Walkthrough',
    description: 'Schedule a live demo. We connect to your existing cameras and show you what Kenesis sees — on-premise, in real time.',
    url: 'https://kenesis.ai/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
