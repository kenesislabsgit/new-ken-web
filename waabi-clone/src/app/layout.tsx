import type { Metadata } from "next";
import { Outfit, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-plex",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
  weight: ["400", "500", "700"],
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
    <html lang="en" className={`${outfit.variable} ${plexSans.variable} ${plexMono.variable} ${neoWave.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
