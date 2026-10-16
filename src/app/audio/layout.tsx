import type { Metadata } from "next";
import { TestimonialModalProvider } from "@/components/TestimonialModalProvider";
import { AudioNavbar } from "@/components/AudioNavbar";
import { Footer } from "@/components/Footer";
import { footerLinks } from "@/content/audio";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { routeMetadata } from "@/content/seo";
import { getDictionary, getLocale } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { meta } = await getDictionary(locale, "audio");
  return routeMetadata("/audio", meta, locale);
}

export default async function AudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, "audio");

  return (
    <div data-persona="audio">
      <LocaleProvider locale={locale} dict={dict}>
        <TestimonialModalProvider>
          <AudioNavbar />
          {children}
          <Footer links={footerLinks} />
        </TestimonialModalProvider>
      </LocaleProvider>
    </div>
  );
}
