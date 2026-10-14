'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useReducedMotion,
  AnimatePresence,
} from 'motion/react';
import Link from 'next/link';
import { useLocale } from '@/i18n/LocaleProvider';
import { List, X, type Icon } from '@phosphor-icons/react';
import { useMagnetic } from './useMagnetic';
import { useActiveSection } from './useActiveSection';
import { useLocaleSwitch } from './useLocaleSwitch';
import type { PersonaSwitch } from './usePersonaSwitch';

const HOVER_LEAVE_DELAY_MS = 400;
const EXPANDED_MAX_WIDTH = 1120;
// Until the compact pill is measured on the client.
const COMPACT_FALLBACK_WIDTH = 520;

// Every control is a 44px target; most draw a smaller shape inside it, and
// those whose ring belongs on that shape (NavActionButton) draw their own.
const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight';

export type NavItem = { label: string; href: string; Icon: Icon };
export type NavAction = { label: string; Icon: Icon; onClick: () => void };

type NavbarProps = {
  /** Section anchors of the current page, shown as links (or icons when compact). */
  items: NavItem[];
  /** Persona-specific buttons, rendered after the links in every navbar state. */
  actions?: NavAction[];
  /** The personas to switch between: a "go to" chip when compact, a segmented selector when expanded. */
  personas: PersonaSwitch;
};

export function Navbar({ items, actions = [], personas }: NavbarProps) {
  const { dict } = useLocale();
  const { scrollY } = useScroll();
  const [inHero, setInHero] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [compactWidth, setCompactWidth] = useState(COMPACT_FALLBACK_WIDTH);
  const [compactEl, setCompactEl] = useState<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const navRef = useRef<HTMLElement>(null);
  const hoverLeaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const active = useActiveSection(items.map((item) => item.href));
  const sections = items.map((item) => ({ ...item, active: item.href === active }));

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const hero = latest < window.innerHeight * 0.85;
    setInHero(hero);
    if (hero) setMobileOpen(false);
  });

  useEffect(() => {
    return () => {
      if (hoverLeaveTimeoutRef.current) clearTimeout(hoverLeaveTimeoutRef.current);
    };
  }, []);

  function handleMouseEnter() {
    if (hoverLeaveTimeoutRef.current) clearTimeout(hoverLeaveTimeoutRef.current);
    setHovered(true);
  }

  function handleMouseLeave() {
    hoverLeaveTimeoutRef.current = setTimeout(() => setHovered(false), HOVER_LEAVE_DELAY_MS);
  }

  const showExpanded = !inHero || hovered;

  // The compact pill hugs its content, which changes with the persona, the
  // locale (chip label) and the breakpoint (section icons hide on mobile).
  // Measured while it is mounted; the last width is kept while expanded.
  useEffect(() => {
    if (!compactEl) return;
    // + the nav's own border, read off the nav rather than assumed. A
    // ResizeObserver also reports once on observe.
    const observer = new ResizeObserver(() => {
      const nav = navRef.current;
      const border = nav ? nav.offsetWidth - nav.clientWidth : 0;
      setCompactWidth(compactEl.offsetWidth + border);
    });
    observer.observe(compactEl);
    return () => observer.disconnect();
  }, [compactEl]);

  const { destination } = personas;

  return (
    <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <motion.nav
        ref={navRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        initial={reduce ? false : { y: -20, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          maxWidth: showExpanded ? EXPANDED_MAX_WIDTH : compactWidth,
          borderRadius: showExpanded ? 16 : 999,
        }}
        transition={{
          y: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
          opacity: { duration: 0.6 },
          maxWidth: { type: 'spring', duration: 0.5, bounce: 0.15 },
          borderRadius: { type: 'spring', duration: 0.4, bounce: 0.1 },
        }}
        className="w-full glass-dark shadow-lg shadow-black/25 pointer-events-auto overflow-hidden"
      >
        <AnimatePresence mode="wait" initial={false}>
          {showExpanded ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="flex items-center justify-between gap-4 px-2.5 h-14"
            >
              <Link
                href="/"
                aria-label={dict.navbar.home}
                className={`flex items-center gap-2.5 h-11 min-w-11 pr-1.5 rounded-full shrink-0 text-sm font-medium tracking-tight text-white ${focusRing}`}
              >
                <Logo />
                <span className="hidden xl:inline">Felipe Penteado</span>
              </Link>

              <div className="hidden lg:flex items-center gap-5">
                {sections.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    aria-current={item.active ? 'true' : undefined}
                    className={`flex items-center justify-center h-11 min-w-11 text-sm whitespace-nowrap transition-colors ${focusRing} ${
                      item.active ? 'text-white' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <span
                      className={`py-1.5 ${
                        item.active ? 'shadow-[inset_0_-2px_0_var(--color-highlight)]' : ''
                      }`}
                    >
                      {item.label}
                    </span>
                  </a>
                ))}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {actions.map((action) => (
                  <NavActionButton key={action.label} action={action} />
                ))}
                <div
                  role="group"
                  aria-label={dict.navbar.personaSwitch}
                  className="flex items-center h-9 px-[3px] rounded-full bg-white/6 border border-white/10"
                >
                  {personas.options.map((option) => (
                    <Link
                      key={option.href}
                      href={option.href}
                      aria-current={option.current ? 'page' : undefined}
                      className={`group flex items-center justify-center h-11 min-w-11 rounded-full ${focusRing}`}
                    >
                      <span
                        className={`flex items-center h-7 px-3 rounded-full text-xs font-medium transition-colors ${
                          option.current
                            ? 'bg-accent text-white ring-1 ring-highlight'
                            : 'text-white/70 group-hover:text-white'
                        }`}
                      >
                        {option.label}
                      </span>
                    </Link>
                  ))}
                </div>
                <LocaleButton />
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className={`lg:hidden grid place-items-center size-11 rounded-full text-white/80 press ${focusRing}`}
                  aria-label={dict.navbar.toggleMenu}
                  aria-expanded={mobileOpen}
                >
                  {mobileOpen ? <X size={20} /> : <List size={20} />}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="compact"
              ref={setCompactEl}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="flex items-center w-max mx-auto px-px h-11"
            >
              <Link
                href="/"
                aria-label={dict.navbar.home}
                className={`grid place-items-center size-11 rounded-full ${focusRing}`}
              >
                <Logo />
              </Link>
              <Separator />
              {/* Section icons don't fit a phone's width; the expanded menu has them. */}
              <div className="hidden sm:flex items-center">
                {sections.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    aria-label={item.label}
                    aria-current={item.active ? 'true' : undefined}
                    className={`group grid place-items-center size-11 rounded-full ${focusRing}`}
                  >
                    <span
                      className={`grid place-items-center size-8 rounded-full transition-colors ${
                        item.active
                          ? 'text-highlight bg-highlight/14'
                          : 'text-white/70 group-hover:text-white'
                      }`}
                    >
                      <item.Icon size={16} aria-hidden />
                    </span>
                  </a>
                ))}
                <Separator />
              </div>
              {actions.map((action) => (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className={`grid place-items-center size-11 rounded-full text-white/70 hover:text-white press ${focusRing}`}
                  aria-label={action.label}
                >
                  <action.Icon size={16} aria-hidden />
                </button>
              ))}
              <Link
                href={destination.href}
                aria-label={destination.switchLabel}
                className={`group flex items-center h-11 px-1 rounded-full ${focusRing}`}
              >
                <span className="flex items-center gap-1.5 h-8 pl-2.5 pr-3 rounded-full text-xs font-medium text-white bg-white/8 border border-white/14 group-hover:bg-white/12 transition-colors">
                  {/* The destination's own highlight, through its persona tokens. */}
                  <span data-persona-card={destination.id} className="text-highlight">
                    <destination.Icon size={16} weight="bold" aria-hidden />
                  </span>
                  {destination.label}
                </span>
              </Link>
              <LocaleButton />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {mobileOpen && showExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden px-6 pb-2 flex flex-col border-t border-white/10 overflow-hidden"
            >
              {sections.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={item.active ? 'true' : undefined}
                  className={`text-sm py-3 transition-colors ${
                    item.active ? 'text-highlight' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {item.label}
                </a>
              ))}
              {actions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => {
                    setMobileOpen(false);
                    action.onClick();
                  }}
                  className="text-sm text-white/70 hover:text-white press py-3 text-left"
                >
                  {action.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}

function Logo() {
  return (
    <span
      aria-hidden
      className="grid place-items-center size-8 shrink-0 rounded-full bg-ink text-background text-xs font-semibold"
    >
      FP
    </span>
  );
}

function Separator() {
  return <span aria-hidden className="w-px h-4 mx-1 bg-white/20 shrink-0" />;
}

function LocaleButton() {
  const { label, ariaLabel, switchLocale } = useLocaleSwitch();

  return (
    <button
      onClick={switchLocale}
      aria-label={ariaLabel}
      className={`grid place-items-center h-11 min-w-11 px-2 rounded-full font-mono text-xs uppercase tracking-wider text-white/70 hover:text-white press ${focusRing}`}
    >
      {label}
    </button>
  );
}

function NavActionButton({ action }: { action: NavAction }) {
  const magnet = useMagnetic<HTMLButtonElement>();

  return (
    <motion.button
      {...magnet}
      onClick={action.onClick}
      className="group hidden lg:flex items-center h-11 rounded-full focus-visible:outline-none press shrink-0"
    >
      <span className="flex items-center h-8 px-3.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-medium whitespace-nowrap group-hover:ring-2 group-hover:ring-highlight group-focus-visible:ring-2 group-focus-visible:ring-highlight">
        {action.label}
      </span>
    </motion.button>
  );
}
