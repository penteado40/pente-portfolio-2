'use client';

import { ArrowLeft } from '@phosphor-icons/react';
import { useLocale } from '@/i18n/LocaleProvider';
import type { LinkId } from '@/content/links';
import { ChannelChip } from './ChannelChip';
import { Chip } from './Chip';
import { Container } from './Container';

// The persona pages' footer: Chips leading back to the Hub and out to the
// persona's profiles, filling a row on a phone above the text.
export function Footer({ links }: { links: readonly LinkId[] }) {
  const { dict } = useLocale();

  return (
    <footer>
      <Container className="pt-6 pb-8 md:py-8 flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4">
        <p className="text-[13px] md:text-sm text-ink/60">
          Felipe Penteado · {dict.footer.rights}
        </p>
        <div className="flex gap-2 md:gap-2.5">
          <Chip href="/" Icon={ArrowLeft} iconAt="start" tall stretch>
            <span className="md:hidden">{dict.footer.hub}</span>
            <span className="hidden md:inline">{dict.footer.backToHub}</span>
          </Chip>
          {links.map((id) => (
            <ChannelChip key={id} id={id} tall stretch />
          ))}
        </div>
      </Container>
    </footer>
  );
}
