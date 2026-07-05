'use client';

import { useLocale } from '@/i18n/LocaleProvider';
import {
  InstagramLogo,
  LinkedinLogo,
  Envelope,
  GithubLogo,
} from '@phosphor-icons/react';

export function Footer() {
  const { dict } = useLocale();

  return (
    <footer className="py-12 bg-mist border-t border-white/10">
      <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-white/50">
          {new Date().getFullYear()} Felipe Penteado. {dict.footer.rights}
        </p>
        <div className="flex items-center gap-4">
          <a
            href="mailto:flpenteado@gmail.com"
            className="text-white/50 hover:text-accent transition-colors"
            aria-label="Email"
          >
            <Envelope size={20} />
          </a>
          <a
            href="https://instagram.com/penteado_fe"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-accent transition-colors"
            aria-label="Instagram"
          >
            <InstagramLogo size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/penteado-felipe"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-accent transition-colors"
            aria-label="LinkedIn"
          >
            <LinkedinLogo size={20} />
          </a>
          <a
            href="https://github.com/penteado40"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-accent transition-colors"
            aria-label="GitHub"
          >
            <GithubLogo size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
