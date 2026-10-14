'use client';

import Link from 'next/link';
import { Globe } from '@phosphor-icons/react';
import { useLocale } from '@/i18n/LocaleProvider';
import { PERSONAS, personaHref } from '@/content/personas';
import type { HubDictionary } from '@/i18n/types';
import { useLocaleSwitch } from './useLocaleSwitch';

// The Hub's plain top bar, not the personas' floating Navbar: the Hub has no
// sections to jump between, only the routes. "Home" is always the active
// item here, and it drops out on mobile, where the name already leads home.
export function HubNavbar() {
  const { dict } = useLocale<HubDictionary>();
  const { label, ariaLabel, switchLocale } = useLocaleSwitch();

  return (
    <header className="border-b border-white/8">
      <div className="max-w-[1120px] mx-auto px-4 md:px-8 h-14 md:h-16 flex items-center justify-between">
        <Link href="/" className="text-[15px] font-medium tracking-tight text-white">
          Felipe Penteado
        </Link>
        <nav aria-label={dict.nav.label} className="flex items-center gap-1 md:gap-6 text-sm">
          <Link
            href="/"
            aria-current="page"
            className="hidden md:inline py-2 text-white shadow-[inset_0_-2px_0_var(--color-ink)]"
          >
            {dict.nav.home}
          </Link>
          {PERSONAS.map((persona) => (
            <Link
              key={persona}
              href={personaHref(persona)}
              className="px-2 py-3 md:px-0 md:py-2 text-white/70 hover:text-white transition-colors"
            >
              {dict.navbar.personas[persona]}
            </Link>
          ))}
          <button
            onClick={switchLocale}
            aria-label={ariaLabel}
            className="ml-1 md:ml-0 inline-flex items-center gap-1.5 h-8 px-2.5 md:px-3 rounded-full border border-white/14 font-mono text-xs text-white/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight press"
          >
            <Globe size={14} aria-hidden />
            {label}
          </button>
        </nav>
      </div>
    </header>
  );
}
