import type { Metadata } from "next";
import { DevNavbar } from "@/components/DevNavbar";
import { Footer } from "@/components/Footer";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { routeMetadata } from "@/content/seo";
import { getDictionary, getLocale } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { meta } = await getDictionary(locale, "dev");
  return routeMetadata("/dev", meta, locale);
}

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
