import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { JsonLd } from "@/components/JsonLd";
import "./globals.css";

// Body: Geist - clean, modern sans-serif
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  preload: true,
});

// Headers: Instrument Serif - editorial serif for display use
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
  preload: true,
});

const neoWave = localFont({
  src: "../../public/fonts/MBFNeoWave-Regular.otf",
  variable: "--font-neowave",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "Kenesis | On-Premise AI Video Analytics",
    template: "%s | Kenesis",
  },
  description:
    "Kenesis deploys on-premise AI video analytics for industrial facilities. Real-time PPE compliance, zone detection, and safety alerts. No cloud. No data leaving your network.",
  metadataBase: new URL("https://kenesis.ai"),
  alternates: {
    canonical: "https://kenesis.ai",
  },
  openGraph: {
    type: "website",
    url: "https://kenesis.ai",
    siteName: "Kenesis",
    title: "Kenesis | On-Premise AI Video Analytics",
    description:
      "Real-time AI safety monitoring for industrial facilities. PPE compliance, zone detection, hazard alerts. Fully on-premise, no cloud dependency.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kenesis | On-Premise AI Video Analytics",
    description:
      "Real-time AI safety monitoring for industrial facilities. PPE compliance, zone detection, hazard alerts. Fully on-premise, no cloud dependency.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: "/kenesis-icon.png",
    shortcut: "/kenesis-icon.png",
    apple: "/kenesis-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} ${instrumentSerif.variable} ${neoWave.variable}`} suppressHydrationWarning>
      <head>
        {/* DNS prefetch and preconnect for Google Fonts CDN */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Preload the local display font used in the footer */}
        <link rel="preload" href="/fonts/MBFNeoWave-Regular.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        {/* Tell the browser not to render-block on this CSS */}
        <meta name="color-scheme" content="dark" />
        <JsonLd data={[
          {
            '@type': 'Organization',
            name: 'Kenesis',
            url: 'https://kenesis.ai',
            logo: 'https://kenesis.ai/kenesis-icon.png',
            foundingDate: '2024',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Chennai',
              addressRegion: 'Tamil Nadu',
              addressCountry: 'IN',
            },
            contactPoint: {
              '@type': 'ContactPoint',
              email: 'admin@kenesis.ai',
              contactType: 'sales',
              areaServed: 'IN',
              availableLanguage: 'English',
            },
            sameAs: ['https://kenesis.ai'],
          },
          {
            '@type': 'WebSite',
            name: 'Kenesis',
            url: 'https://kenesis.ai',
          },
          {
            '@type': 'SoftwareApplication',
            name: 'Kenesis AI Video Analytics',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'On-Premise Linux, Windows Server',
            description: 'Real-time on-premise AI video analytics for industrial safety. Detects PPE violations, zone breaches and hazards across existing CCTV cameras in under one second.',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
              description: 'Contact for pricing',
            },
            provider: {
              '@type': 'Organization',
              name: 'Kenesis',
              url: 'https://kenesis.ai',
            },
          },
        ]} />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
