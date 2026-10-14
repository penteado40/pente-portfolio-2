import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getLocale } from "@/i18n/dictionaries";
import { LiquidGlassFilter } from "@/components/LiquidGlassFilter";
import { SITE_NAME, SITE_URL, siteTitle } from "@/content/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Each route's layout adds its title, description, canonical and a complete
// openGraph (see routeMetadata); Twitter inherits those from openGraph.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: siteTitle("%s"),
    default: SITE_NAME,
  },
  twitter: { card: "summary_large_image" },
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
