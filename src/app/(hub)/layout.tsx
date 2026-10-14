import type { Metadata } from "next";
import { routeMetadata } from "@/content/seo";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { getDictionary, getLocale } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { meta } = await getDictionary(locale, "hub");
  return routeMetadata("/", meta, locale);
}

export default async function HubLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, "hub");

  return (
    <div data-persona="hub">
      <LocaleProvider locale={locale} dict={dict}>
        {children}
      </LocaleProvider>
    </div>
  );
}
