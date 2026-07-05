import { Navbar } from "@/components/Navbar";
import { CursorGlow } from "@/components/CursorGlow";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Stats } from "@/components/Stats";
import { Projects } from "@/components/Projects";
import { Timeline } from "@/components/Timeline";
import { Skills } from "@/components/Skills";
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
        <Projects />
        <Timeline />
        <Skills />
        <Photos />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
