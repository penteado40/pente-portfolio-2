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

export default async function AudioPage() {
  const testimonials = await getTestimonials();

  return (
    <main>
      <Hero />
      <About />
      <Stats />
      <Timeline />
      <Certifications />
      <Productions />
      <Skills />
      <Testimonials items={testimonials} />
      <Photos />
      <Contact />
    </main>
  );
}
