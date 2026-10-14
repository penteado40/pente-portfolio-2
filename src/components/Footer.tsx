'use client';

import { useLocale } from '@/i18n/LocaleProvider';
import {
  InstagramLogo,
  LinkedinLogo,
  Envelope,
  GithubLogo,
} from '@phosphor-icons/react';
import { links } from '@/content/links';

export function Footer() {
  const { dict } = useLocale();

  return (
    <footer className="py-12 border-t border-white/10">
      <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-white/50">
          {new Date().getFullYear()} Felipe Penteado. {dict.footer.rights}
        </p>
        <div className="flex items-center gap-4">
          <a
            href={links.email}
            className="text-white/50 hover:text-white transition-colors"
            aria-label="Email"
          >
            <Envelope size={20} />
          </a>
          <a
            href={links.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-white transition-colors"
            aria-label="Instagram"
          >
            <InstagramLogo size={20} />
          </a>
          <a
            href={links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-white transition-colors"
            aria-label="LinkedIn"
          >
            <LinkedinLogo size={20} />
          </a>
          <a
            href={links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-white transition-colors"
            aria-label="GitHub"
          >
            <GithubLogo size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
