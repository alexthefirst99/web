import type { Metadata, Viewport } from "next";
import { Outfit, Doto } from "next/font/google";
import "./globals.css";

// Same type pairing as the portfolio redesign: Outfit for text, Doto for numbers and display.
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const doto = Doto({
  variable: "--font-doto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meet AlexB | Tu N (Alex) Tran",
  description: "Ask AlexB, my AI, anything about my work.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b0608",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${doto.variable} h-full antialiased`}>
      <body className={`${outfit.className} h-full bg-[#0b0608] text-white`}>{children}</body>
    </html>
  );
}
