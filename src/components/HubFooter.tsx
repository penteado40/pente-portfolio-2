import { Envelope, GithubLogo, LinkedinLogo } from '@phosphor-icons/react/dist/ssr';
import { links } from '@/content/links';
import type { HubDictionary } from '@/i18n/types';

const pill =
  'inline-flex flex-1 md:flex-none items-center justify-center gap-2 h-11 md:h-9 px-3.5 rounded-full border border-white/14 bg-white/3 text-sm text-white/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight press';

export function HubFooter({ dict }: { dict: HubDictionary }) {
  return (
    <footer className="mt-auto border-t border-white/8">
      <div className="max-w-[1120px] mx-auto px-4 md:px-8 pt-6 pb-8 md:py-8 flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4">
        <p className="text-[13px] md:text-sm text-white/60">
          Felipe Penteado · {dict.footer.rights}
        </p>
        <div className="flex gap-2 md:gap-2.5">
          <a href={links.email} className={pill}>
            <Envelope size={16} aria-hidden />
            {dict.links.contact}
          </a>
          <a
            href={links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={pill}
          >
            <LinkedinLogo size={16} aria-hidden />
            LinkedIn
          </a>
          <a
            href={links.github}
            target="_blank"
            rel="noopener noreferrer"
            className={pill}
          >
            <GithubLogo size={16} aria-hidden />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
