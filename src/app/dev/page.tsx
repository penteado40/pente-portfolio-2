import { DevHero } from "@/components/DevHero";
import { DevAbout } from "@/components/DevAbout";
import { DevExperience } from "@/components/DevExperience";
import { Certifications } from "@/components/Certifications";
import { DevProjects } from "@/components/DevProjects";
import { DevSkills } from "@/components/DevSkills";
import { Contact } from "@/components/Contact";
import { certifications, sectionIndex } from "@/content/dev";
import { getDictionary, getLocale } from "@/i18n/dictionaries";

export default async function DevPage() {
  const dict = await getDictionary(await getLocale(), "dev");

  return (
    <main>
      <DevHero />
      <DevAbout />
      <DevExperience />
      <Certifications
        items={certifications}
        index={sectionIndex("certifications")}
        label={dict.nav.certifications}
        title={dict.nav.certifications}
      />
      <DevProjects />
      <DevSkills />
      <Contact />
    </main>
  );
}
