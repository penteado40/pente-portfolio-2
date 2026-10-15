import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Stats } from "@/components/Stats";
import { Timeline } from "@/components/Timeline";
import { Certifications } from "@/components/Certifications";
import { Productions } from "@/components/Productions";
import { Skills } from "@/components/Skills";
import { Testimonials } from "@/components/Testimonials";
import { Photos } from "@/components/Photos";
import { Contact } from "@/components/Contact";
import { getTestimonials } from "@/lib/getTestimonials";
import { getDictionary, getLocale } from "@/i18n/dictionaries";

export default async function AudioPage() {
  const [testimonials, dict] = await Promise.all([
    getTestimonials(),
    getLocale().then((locale) => getDictionary(locale, "audio")),
  ]);

  return (
    <main>
      <Hero />
      <Stats />
      <About />
      <Timeline />
      <Certifications items={dict.certifications.items} title={dict.certifications.title} />
      <Productions />
      <Skills />
      <Testimonials items={testimonials} />
      <Photos />
      <Contact />
    </main>
  );
}
