import type { HubDictionary } from '@/i18n/types';
import { ChannelChip } from './ChannelChip';

// The Hub's footer: Chips out to the channels, filling a row on a phone
// above the text, like the persona pages' Footer.
export function HubFooter({ dict }: { dict: HubDictionary }) {
  return (
    <footer className="mt-auto border-t border-white/8">
      <div className="max-w-[1120px] mx-auto px-4 md:px-8 pt-6 pb-8 md:py-8 flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4">
        <p className="text-[13px] md:text-sm text-white/60">
          Felipe Penteado · {dict.footer.rights}
        </p>
        <div className="flex gap-2 md:gap-2.5">
          <ChannelChip id="email" label={dict.links.contact} tall stretch />
          <ChannelChip id="linkedin" tall stretch />
          <ChannelChip id="github" tall stretch />
        </div>
      </div>
    </footer>
  );
}
