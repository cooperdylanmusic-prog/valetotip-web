import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ValetoTip",
  description: "The quickest and easiest way to tip your favorite Valet — powered by Oceanside Hospitality.",
  openGraph: {
    title: "ValetoTip",
    description: "The quickest and easiest way to tip your favorite Valet — powered by Oceanside Hospitality.",
    url: "https://valetotip-web.vercel.app",
    siteName: "ValetoTip",
    images: [
      {
        url: "https://valetotip-web.vercel.app/valetotip-logo.jpg",
        width: 1200,
        height: 630,
        alt: "ValetoTip",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ValetoTip",
    description: "The quickest and easiest way to tip your favorite Valet — powered by Oceanside Hospitality.",
    images: ["https://valetotip-web.vercel.app/valetotip-logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
