'use client';

import { useEffect, useId, useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useReducedMotion,
  AnimatePresence,
} from 'motion/react';
import Link from 'next/link';
import { useLocale } from '@/i18n/LocaleProvider';
import { X, type Icon } from '@phosphor-icons/react';
import { useActiveSection } from './useActiveSection';
import { useLocaleSwitch } from './useLocaleSwitch';
import { wrapFocus } from './focusTrap';
import type { PersonaSwitch } from './usePersonaSwitch';

const HOVER_LEAVE_DELAY_MS = 400;
const EXPANDED_MAX_WIDTH = 1024;
// Until the compact pill is measured on the client.
const COMPACT_FALLBACK_WIDTH = 520;
// Tailwind's `lg`: the desktop island from here up, the mobile pill below.
const DESKTOP_QUERY = '(min-width: 64rem)';

// Every control is a 44px target; most draw a smaller shape inside it.
const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight';

export type NavItem = { label: string; href: string; Icon: Icon };
export type NavAction = { label: string; Icon: Icon; onClick: () => void };

type NavSection = NavItem & { active: boolean };

type NavbarProps = {
  /** Section anchors of the current page: links when expanded or in the mobile menu, icons when compact. */
  items: NavItem[];
  /** Persona-specific buttons: icons in the compact island, entries in the mobile menu. */
  actions?: NavAction[];
  /** The personas to switch between: a "go to" chip when compact, a segmented selector otherwise. */
  personas: PersonaSwitch;
};

export function Navbar({ items, actions = [], personas }: NavbarProps) {
  const active = useActiveSection(items.map((item) => item.href));
  const sections = items.map((item) => ({ ...item, active: item.href === active }));

  return (
    <div className="fixed top-3 lg:top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <MobileNavbar sections={sections} actions={actions} personas={personas} />
      <DesktopNavbar sections={sections} actions={actions} personas={personas} />
    </div>
  );
}

type NavbarViewProps = { sections: NavSection[]; actions: NavAction[]; personas: PersonaSwitch };

// Below `lg`: a pill that always stays compact, with the sections in a menu.
function MobileNavbar({ sections, actions, personas }: NavbarViewProps) {
  const { dict } = useLocale();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const focusables = () =>
      Array.from(panelRef.current?.querySelectorAll<HTMLElement>('a, button') ?? []);
    focusables()[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      } else if (event.key === 'Tab') {
        const target = wrapFocus(
          focusables(),
          document.activeElement as HTMLElement | null,
          event.shiftKey,
        );
        if (target) {
          event.preventDefault();
          target.focus();
        }
      }
    }
    // The toggle button is inside the nav, so its own click closes the menu.
    function onPointerDown(event: PointerEvent) {
      if (!navRef.current?.contains(event.target as Node)) setOpen(false);
    }
    // The panel is hidden from `lg` up; a trap on hidden links would strand focus.
    const desktop = window.matchMedia(DESKTOP_QUERY);
    function onDesktop() {
      if (desktop.matches) setOpen(false);
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    desktop.addEventListener('change', onDesktop);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
      desktop.removeEventListener('change', onDesktop);
    };
  }, [open]);

  return (
    <motion.nav
      ref={navRef}
      initial={reduce ? false : { y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className="lg:hidden flex flex-col items-center gap-2 w-full pointer-events-auto"
    >
      <div className="flex items-center gap-1 h-12 px-0.5 rounded-full glass-dark shadow-lg shadow-black/25">
        <Link
          href="/"
          aria-label={dict.navbar.home}
          className={`grid place-items-center size-11 rounded-full ${focusRing}`}
        >
          <Logo />
        </Link>
        <PersonaSelector personas={personas} />
        <LocaleButton />
        <button
          ref={buttonRef}
          onClick={() => setOpen(!open)}
          aria-label={dict.navbar.sectionMenu}
          aria-expanded={open}
          aria-controls={panelId}
          className={`group grid place-items-center size-11 rounded-full press ${focusRing}`}
        >
          <span className="grid place-items-center size-9 rounded-full bg-white/8 text-white group-hover:bg-white/12 transition-colors">
            {open ? <X size={18} aria-hidden /> : <TwoLinesIcon />}
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            id={panelId}
            initial={reduce ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="flex flex-col w-full max-w-xs p-2 rounded-2xl glass-dark shadow-lg shadow-black/25"
          >
            {sections.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={item.active ? 'true' : undefined}
                className={`flex items-center h-11 px-3 rounded-xl text-sm transition-colors ${focusRing} ${
                  item.active ? 'text-highlight' : 'text-white/70 hover:text-white'
                }`}
              >
                {item.label}
              </a>
            ))}
            {actions.length > 0 && <span aria-hidden className="h-px mx-3 my-1 bg-white/10" />}
            {actions.map((action) => (
              <button
                key={action.label}
                onClick={() => {
                  setOpen(false);
                  action.onClick();
                }}
                className={`flex items-center gap-2.5 h-11 px-3 rounded-xl text-sm text-left text-white hover:bg-white/8 press ${focusRing}`}
              >
                <action.Icon size={16} aria-hidden className="text-highlight" />
                {action.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// From `lg` up: compact over the Hero, expanded once scrolled past it or on hover.
function DesktopNavbar({ sections, actions, personas }: NavbarViewProps) {
  const { dict } = useLocale();
  const { scrollY } = useScroll();
  const [inHero, setInHero] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [compactWidth, setCompactWidth] = useState(COMPACT_FALLBACK_WIDTH);
  const [compactEl, setCompactEl] = useState<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const navRef = useRef<HTMLElement>(null);
  const hoverLeaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setInHero(latest < window.innerHeight * 0.85);
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

  // The compact pill hugs its content, which changes with the persona and the
  // locale (chip label). Measured while it is mounted; the last width is kept
  // while expanded.
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
      className="hidden lg:block w-full glass-dark shadow-lg shadow-black/25 pointer-events-auto overflow-hidden"
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
              <span>Felipe Penteado</span>
            </Link>

            <div className="flex items-center gap-5">
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
              <PersonaSelector personas={personas} />
              <LocaleButton />
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
    </motion.nav>
  );
}

function PersonaSelector({ personas }: { personas: PersonaSwitch }) {
  const { dict } = useLocale();

  return (
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

function TwoLinesIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M4 8h16M4 16h16" />
    </svg>
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
