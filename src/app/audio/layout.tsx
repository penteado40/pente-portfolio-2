import type { Metadata } from "next";
import { TestimonialModalProvider } from "@/components/TestimonialModalProvider";
import { AudioNavbar } from "@/components/AudioNavbar";
import { Footer } from "@/components/Footer";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { getDictionary, getLocale } from "@/i18n/dictionaries";

export const metadata: Metadata = {
  title: "Audio Engineer",
  description:
    "Audio engineer portfolio. Mixing, mastering, and sound design.",
};

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
          <Footer />
        </TestimonialModalProvider>
      </LocaleProvider>
    </div>
  );
}
