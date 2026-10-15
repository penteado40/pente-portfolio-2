import { DevHero } from "@/components/DevHero";
import { DevAbout } from "@/components/DevAbout";
import { DevExperience } from "@/components/DevExperience";
import { Contact } from "@/components/Contact";

export default function DevPage() {
  return (
    <main>
      <DevHero />
      <DevAbout />
      <DevExperience />
      <Contact />
    </main>
  );
}
