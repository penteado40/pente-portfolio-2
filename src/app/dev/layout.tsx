import type { Metadata } from "next";
import { DevNavbar } from "@/components/DevNavbar";
import { Footer } from "@/components/Footer";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { getDictionary, getLocale } from "@/i18n/dictionaries";

export const metadata: Metadata = {
  title: "Full Stack Developer",
  description:
    "Full stack developer focused on back-end: APIs and financial systems with Node.js, TypeScript, and PHP/Laravel.",
};

export default async function DevLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, "dev");

  return (
    <div data-persona="dev">
      <LocaleProvider locale={locale} dict={dict}>
        <DevNavbar />
        {children}
        <Footer />
      </LocaleProvider>
    </div>
  );
}
