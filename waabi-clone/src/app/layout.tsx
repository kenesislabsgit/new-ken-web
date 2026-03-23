import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Display + headings: Geist — sharp geometric sans, ultra-modern
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

// UI / labels / code: Geist Mono — the perfect mono sibling
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const neoWave = localFont({
  src: "../../public/fonts/MBFNeoWave-Regular.otf",
  variable: "--font-neowave",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Kenesis Labs – Edge AI Video Analytics for Industrial Safety",
  description:
    "Kenesis Labs deploys on-premise AI video analytics for Indian factories. PPE compliance, zone detection, real-time safety alerts — no cloud, no data leaving your network.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${neoWave.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
