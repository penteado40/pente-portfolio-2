'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, GithubLogo, Lock } from '@phosphor-icons/react';
import { useLocale } from '@/i18n/LocaleProvider';
import type { DevDictionary } from '@/i18n/types';
import { projects, sectionIndex, type Product, type Repo, type Study } from '@/content/dev';
import { Container } from './Container';
import { SectionHeader } from './SectionHeader';
import { TiltCard } from './TiltCard';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

type ProjectsText = DevDictionary['projects'];
type ProjectText = { title: string; summary: string; highlights?: string[] };

const products = projects.filter((p): p is Product => p.kind === 'product');
const studies = projects.filter((p): p is Study => p.kind === 'study');

const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '');

/** `https://fawedding.com.br/` as `fawedding.com.br`. */
const host = (url: string) => new URL(url).host;

// Items inside glass are plain pills, not Chips (see CONTEXT.md): a thin
// border over the card's own color.
const pill = 'inline-flex items-center gap-1.5 h-7 px-3 rounded-full border font-mono text-xs';

function StackPills({ stack }: { stack: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {stack.map((tag) => (
        <li key={tag}>
          <span className={`${pill} border-ink/14 text-ink/80`}>{tag}</span>
        </li>
      ))}
    </ul>
  );
}

// A public repo links to GitHub; a private one is a pill with a lock and
// no link.
function RepoPills({ repos, text }: { repos: readonly Repo[]; text: ProjectsText }) {
  return (
    <ul aria-label={text.repos} className="flex flex-wrap gap-1.5">
      {repos.map(({ label, url }) => (
        <li key={label}>
          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={fill(text.openRepo, { repo: label })}
              className={`${pill} border-highlight/30 text-highlight hover:border-highlight/60 hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight`}
            >
              <GithubLogo size={12} weight="bold" aria-hidden />
              {label}
            </a>
          ) : (
            <span className={`${pill} border-ink/14 text-ink/75`}>
              <Lock size={12} weight="bold" aria-hidden />
              {label}
              <span className="sr-only">({text.private})</span>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

function Highlights({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-col gap-1.5 md:gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="relative pl-[18px] md:pl-5 text-[13px] md:text-sm leading-[1.5] text-ink/80 before:absolute before:left-0 before:top-[9px] before:w-2 before:h-px before:bg-highlight"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

// The screenshot, or the persona gradient in its place until the file
// lands; `sizes` is the rendered width.
function Screenshot({ product, alt, sizes }: { product: Product; alt: string; sizes: string }) {
  return product.image ? (
    <Image src={product.image} alt={alt} fill sizes={sizes} className="object-cover" />
  ) : (
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(160deg,var(--color-accent),var(--color-block-deep)_55%,var(--brand-black))]"
    />
  );
}

function StatusLabel({ product, text }: { product: Product; text: ProjectsText }) {
  return (
    <span className="font-mono text-[11px] md:text-xs tracking-[0.14em] uppercase">
      {text.product} ·{' '}
      <span className={product.status === 'building' ? 'text-highlight' : ''}>{text.status[product.status]}</span>
    </span>
  );
}

// The lead Product: the screenshot (or the gradient) fills the card, the
// status and demo on top, a glass pane at the bottom with the text and the
// accent dot leading to the demo.
function LeadProduct({ product, text }: { product: Product; text: ProjectsText }) {
  const item: ProjectText = text.items[product.id];
  const cta = product.demo ?? product.repos.find((r) => r.url)?.url;

  return (
    <article className="relative isolate overflow-hidden flex flex-col justify-between gap-6 min-h-[440px] md:min-h-[560px] p-4 md:p-7 rounded-[28px] shadow-card lg:sticky lg:top-28 lg:self-start">
      <div className="absolute inset-0 -z-10">
        <Screenshot
          product={product}
          alt={fill(text.screenshot, { title: item.title })}
          sizes="(min-width: 1024px) 660px, 100vw"
        />
      </div>
      {product.image && <div aria-hidden className="absolute inset-0 -z-10 persona-card-tint" />}

      <div className="flex justify-between items-center gap-4 px-1 pt-1 md:p-0 text-ink">
        <StatusLabel product={product} text={text} />
        {product.demo && (
          <span className="font-mono text-[11px] md:text-xs tracking-[0.14em] uppercase text-highlight">
            {host(product.demo)}
          </span>
        )}
      </div>

      <div className="glass flex flex-col gap-3 md:gap-4 p-[18px] md:p-6 rounded-[16px] md:rounded-[20px]">
        <h3 className="text-2xl md:text-[34px] leading-[1.08] font-medium tracking-[-0.025em] text-white">
          {item.title}
        </h3>
        <p className="text-sm md:text-[15px] leading-[1.55] text-ink/80">{item.summary}</p>
        {item.highlights && <Highlights items={item.highlights} />}
        <div className="flex justify-between items-end gap-3 mt-1">
          <div className="flex flex-col gap-2">
            <StackPills stack={product.stack} />
            <RepoPills repos={product.repos} text={text} />
          </div>
          {cta && (
            <a
              href={cta}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={fill(text.openDemo, { demo: host(cta) })}
              className="grid place-items-center size-11 shrink-0 rounded-full bg-accent text-white ring-1 ring-highlight/40 hover:ring-2 hover:ring-highlight transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight"
            >
              <ArrowUpRight size={18} aria-hidden />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

// The other Products: glass tiles over the persona glow, the screenshot
// (or the gradient) in a 16:10 strip on top.
function ProductTile({ product, text }: { product: Product; text: ProjectsText }) {
  const item: ProjectText = text.items[product.id];

  return (
    <TiltCard as="article" className="glass h-full flex flex-col gap-4 p-5 md:p-7 rounded-[20px]">
      <div className="flex justify-between items-center gap-4 text-ink/75">
        <StatusLabel product={product} text={text} />
        {product.demo && (
          <span className="font-mono text-[11px] md:text-xs tracking-[0.14em] uppercase text-highlight">
            {host(product.demo)}
          </span>
        )}
      </div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-[12px]">
        <Screenshot
          product={product}
          alt={fill(text.screenshot, { title: item.title })}
          sizes="(min-width: 1024px) 420px, 100vw"
        />
      </div>
      <div className="flex flex-col gap-2 md:gap-2.5">
        <h3 className="text-[21px] md:text-[26px] font-medium tracking-[-0.025em] text-white">{item.title}</h3>
        <p className="text-sm md:text-[15px] leading-[1.55] text-ink/80">{item.summary}</p>
      </div>
      {item.highlights && <Highlights items={item.highlights} />}
      <div className="flex flex-col gap-2 mt-auto">
        <StackPills stack={product.stack} />
        <RepoPills repos={product.repos} text={text} />
      </div>
    </TiltCard>
  );
}

// A Study: a glass tile linking to its repo as a whole, through the name.
function StudyTile({ study, text }: { study: Study; text: ProjectsText }) {
  const item: ProjectText = text.items[study.id];
  const repo = study.repos[0];

  return (
    <TiltCard as="article" className="glass relative h-full flex flex-col gap-3.5 p-6 rounded-[20px]">
      <div className="flex justify-between items-center gap-3">
        <h4 className="font-mono text-[15px] text-highlight">
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="after:absolute after:inset-0 after:rounded-[20px] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-highlight"
          >
            {item.title}
          </a>
        </h4>
        <ArrowUpRight size={18} className="shrink-0 text-ink/75" aria-hidden />
      </div>
      <p className="text-[15px] leading-[1.55] text-ink/80">{item.summary}</p>
      <div className="mt-auto">
        <StackPills stack={study.stack} />
      </div>
    </TiltCard>
  );
}

// Projects: the Products (CONTEXT.md), the lead one as a large card beside
// the others' tiles (7fr / 5fr), stacked on mobile; then the Studies, three
// tiles on desktop and a list between thin rules on mobile.
export function DevProjects() {
  const { dict } = useLocale<DevDictionary>();
  const reduce = useReducedMotion();
  const text = dict.projects;
  const [lead, ...others] = products;

  const reveal = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.6, delay, ease: EASE_OUT },
  });

  return (
    <section id="projects" className="py-[72px] md:py-[120px]">
      <Container>
        <SectionHeader
          index={sectionIndex('projects')}
          label={dict.nav.projects}
          title={text.title}
          aside={<p className="text-[15px] md:text-[17px] leading-[1.6] text-ink/72">{text.lead}</p>}
        />

        <div className="relative isolate grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-3.5 md:gap-6">
          <div aria-hidden className="absolute -inset-y-5 md:-inset-y-8 inset-x-0 md:inset-x-[4%] -z-10 persona-ambient" />
          <motion.div {...reveal()}>
            <LeadProduct product={lead} text={text} />
          </motion.div>
          <ul className="flex flex-col gap-3.5 md:gap-6">
            {others.map((product, i) => (
              <motion.li key={product.id} {...reveal((i + 1) * 0.06)}>
                <ProductTile product={product} text={text} />
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="mt-14 md:mt-24 mb-4 md:mb-7 flex flex-col md:flex-row md:justify-between md:items-end gap-1.5 md:gap-8">
          <h3 className="text-2xl md:text-[32px] font-medium tracking-[-0.03em] text-white">{text.studies.title}</h3>
          <p className="text-sm md:text-[15px] text-ink/72">{text.studies.lead}</p>
        </div>

        <div className="relative isolate hidden md:block">
          <div aria-hidden className="absolute -inset-y-8 inset-x-[4%] -z-10 persona-ambient" />
          <ul className="grid grid-cols-3 gap-5">
            {studies.map((study, i) => (
              <motion.li key={study.id} {...reveal(i * 0.06)}>
                <StudyTile study={study} text={text} />
              </motion.li>
            ))}
          </ul>
        </div>

        <ul className="md:hidden border-b border-white/10">
          {studies.map((study) => (
            <li key={study.id} className="border-t border-white/10">
              <a
                href={study.repos[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-between items-center gap-3 min-h-11 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight"
              >
                <span className="flex flex-col gap-1">
                  <span className="font-mono text-[15px] text-highlight">{text.items[study.id].title}</span>
                  <span className="text-[13px] text-ink/72">{study.stack.join(' · ')}</span>
                </span>
                <ArrowUpRight size={18} className="shrink-0 text-ink/75" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
