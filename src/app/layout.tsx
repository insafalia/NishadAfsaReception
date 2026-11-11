import type { Metadata, Viewport } from "next";
import { Amiri, Cormorant_Garamond, Outfit, Pinyon_Script } from "next/font/google";
import { wedding } from "@/data/wedding";
import "./globals.css";

const script = Pinyon_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
});

const display = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const arabic = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic", "latin"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: wedding.seo.title,
  description: wedding.seo.description,
  openGraph: {
    title: wedding.seo.title,
    description: wedding.seo.description,
    images: [{ url: wedding.seo.image }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: wedding.seo.title,
    description: wedding.seo.description,
    images: [wedding.seo.image],
  },
};

export const viewport: Viewport = {
  themeColor: "#0F5C4C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${script.variable} ${display.variable} ${sans.variable} ${arabic.variable}`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
