import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getLocale } from "@/i18n/dictionaries";
import { LiquidGlassFilter } from "@/components/LiquidGlassFilter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "Felipe Penteado - %s",
    default: "Felipe Penteado",
  },
  description: "Felipe Penteado: audio engineer and systems developer.",
};

export const viewport: Viewport = {
  themeColor: "#141414", // --brand-onyx in globals.css; keep in sync by hand
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={await getLocale()}
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>
        <LiquidGlassFilter />
        {children}
      </body>
    </html>
  );
}
