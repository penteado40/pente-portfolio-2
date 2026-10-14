import Image from 'next/image';
import { Code, Waveform } from '@phosphor-icons/react/dist/ssr';
import { HubCard } from '@/components/HubCard';
import { HubFooter } from '@/components/HubFooter';
import { HubNavbar } from '@/components/HubNavbar';
import { LegacyHashRedirect } from '@/components/LegacyHashRedirect';
import { getDictionary, getLocale } from '@/i18n/dictionaries';

// Set in next.config.ts: empty until the Dev photo is added to public/.
const devPhoto = process.env.HUB_DEV_PHOTO;

export default async function Hub() {
  const dict = await getDictionary(await getLocale(), 'hub');

  return (
    <div className="min-h-dvh flex flex-col">
      <LegacyHashRedirect />
      <HubNavbar />
      <main className="w-full max-w-[1120px] mx-auto px-4 md:px-8">
        <section className="pt-7 pb-[22px] md:pt-[88px] md:pb-14 flex flex-col gap-3 md:gap-5">
          <div className="flex items-center gap-4 md:gap-6">
            <Image
              src="/photos/pente-portrait.jpg"
              alt={dict.intro.portraitAlt}
              width={88}
              height={88}
              preload
              className="shrink-0 size-[76px] md:size-[88px] rounded-full object-cover object-[50%_28%] border border-white/14"
            />
            <h1 className="text-[44px] md:text-7xl leading-[0.92] md:leading-none font-medium tracking-[-0.045em]">
              Felipe
              <br className="md:hidden" /> Penteado
            </h1>
          </div>
          <p className="max-w-[600px] text-[15px] md:text-lg leading-[1.55] md:leading-relaxed text-white/72">
            {dict.intro.tagline}
          </p>
        </section>

        <div className="flex flex-col md:flex-row gap-3 md:gap-6 pb-10 md:pb-[88px]">
          <HubCard
            persona="audio"
            index={1}
            Icon={Waveform}
            photo={{ src: '/photos/pente-hub-audio-bg.jpg', position: '62% 40%' }}
            copy={dict.cards.audio}
          />
          <HubCard
            persona="dev"
            index={2}
            Icon={Code}
            photo={devPhoto ? { src: devPhoto, position: '50% 50%' } : null}
            copy={dict.cards.dev}
          />
        </div>
      </main>
      <HubFooter dict={dict} />
    </div>
  );
}
