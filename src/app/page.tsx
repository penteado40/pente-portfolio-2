import { Navbar } from "@/components/Navbar";
import { CursorGlow } from "@/components/CursorGlow";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Stats } from "@/components/Stats";
import { Timeline } from "@/components/Timeline";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Testimonials } from "@/components/Testimonials";
import { Photos } from "@/components/Photos";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <CursorGlow />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Stats />
        <Timeline />
        <Projects />
        <Skills />
        <Testimonials />
        <Photos />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
