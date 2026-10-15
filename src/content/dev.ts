import type { Locale } from '@/i18n/locale';
import type { Certification } from './certification';

/*
 * Structured data of the Dev persona: ids, dates, links and lists that
 * aren't translated. Translatable text lives in `src/i18n/{en,pt}/dev.json`,
 * keyed by the same ids, and each component joins the two (see docs/adr/0004).
 */

/**
 * Locales whose CV PDF is in `public/cv/` (see `cvLink`). PT is the original
 * and always listed; add a locale here when its translated file lands.
 */
export const cvLocales: readonly Locale[] = ['pt'];

/**
 * Empty until there is one to show; the section and its Navbar anchor stay
 * hidden. Names, issuers and years read the same in both languages.
 */
export const certifications: readonly Certification[] = [];

/** Section ids (and anchors) of the page, in order; see `devSections`. */
export type DevSection = 'about' | 'experience' | 'certifications' | 'projects' | 'skills' | 'contact';

/**
 * The page's sections in order, for the Navbar anchors and the "NN /"
 * labels. Certifications is there only once it has an item.
 */
export function devSections(certs: readonly Certification[]): DevSection[] {
  return [
    'about',
    'experience',
    ...(certs.length > 0 ? (['certifications'] as const) : []),
    'projects',
    'skills',
    'contact',
  ];
}

/** "02 / Experience": a section's position on the page, from 1. */
export function sectionIndex(id: DevSection) {
  return devSections(certifications).indexOf(id) + 1;
}

export type SkillCategory = {
  /** Keys `skills.categories` in dev.json: the category's name and note. */
  id: string;
  /** Names, so the same in every language. */
  items: readonly string[];
};

export const skills: readonly SkillCategory[] = [
  {
    id: 'back-end',
    items: ['Node.js', 'TypeScript', 'NestJS', 'Hono', 'PHP 8/Laravel', 'Java/Spring Boot', 'Prisma', 'Zod', 'REST', 'JWT'],
  },
  { id: 'front-end', items: ['React', 'Next.js', 'Expo/React Native', 'TanStack Query'] },
  { id: 'databases', items: ['PostgreSQL', 'SQL Server', 'MySQL', 'Redis'] },
  {
    id: 'cloud',
    items: ['AWS (S3, SQS, Lambda, SES, CDK)', 'Vercel', 'Terraform', 'Docker', 'GitHub Actions', 'Datadog'],
  },
  { id: 'integrations', items: ['ASAAS', 'Getnet', 'Stone', 'Pix', 'Resend', 'Cloudinary'] },
  {
    id: 'practices',
    items: ['Clean Architecture/DDD', 'ADRs', 'Vitest', 'Claude Code', 'MCP', 'Scrum/Kanban'],
  },
];

/** A month as `YYYY-MM`. */
type YearMonth = `${number}-${number}`;

export type Period = { start: YearMonth; end: YearMonth | null };

export type ExperienceEntry = Period & {
  /** Keys `experience.items` in dev.json: role, context line and bullets. */
  id: string;
  /** A name, so the same in every language. */
  company: string;
  stack: readonly string[];
};

/** Newest first. The dates are the CV's, which win over LinkedIn's. */
export const experience: readonly ExperienceEntry[] = [
  {
    id: 'freelance',
    company: 'Freelancer',
    start: '2025-12',
    end: null,
    stack: ['Node.js', 'TypeScript', 'Hono', 'Prisma', 'PostgreSQL', 'React', 'Resend'],
  },
  {
    id: 'iatec-mid',
    company: 'IATec',
    start: '2023-04',
    end: '2025-11',
    stack: ['PHP 8', 'Laravel', 'SQL', 'AWS S3'],
  },
  {
    id: 'youpay',
    company: 'YouPay',
    start: '2022-09',
    end: '2023-03',
    stack: ['PHP', 'REST', 'Pix', 'ASAAS', 'Getnet', 'Stone'],
  },
  {
    id: 'iatec-trainee',
    company: 'IATec',
    start: '2021-02',
    end: '2022-08',
    stack: ['PHP', 'Laravel'],
  },
  {
    id: 'unasp',
    company: 'UNASP-HT',
    start: '2019-02',
    end: '2019-11',
    stack: ['Windows Server', 'Active Directory', 'LanSchool'],
  },
];

export type EducationEntry = {
  /** Keys `experience.education.items` in dev.json: the course and its detail. */
  id: string;
  institution: string;
  /** Graduation, or when it is expected while `inProgress`. */
  end: YearMonth;
  inProgress: boolean;
};

export const education: readonly EducationEntry[] = [
  { id: 'information-systems', institution: 'Cruzeiro do Sul', end: '2026-12', inProgress: true },
  { id: 'it-technician', institution: 'UNASP-HT', end: '2019-12', inProgress: false },
];

/** The dictionary's month names and the pattern that joins one to a year. */
export type MonthText = { months: readonly string[]; monthFormat: string };

/** `2025-12` as `dez/2025` (PT) or `Dec 2025` (EN), from the dictionary. */
export function formatMonth(month: YearMonth, text: MonthText) {
  const [year, mm] = month.split('-');
  return text.monthFormat.replace('{month}', text.months[Number(mm) - 1]).replace('{year}', year);
}

/** `dez/2025 – nov/2026`, or `dez/2025 – {current}` while still open. */
export function formatPeriod({ start, end }: Period, current: string, text: MonthText) {
  return `${formatMonth(start, text)} – ${end ? formatMonth(end, text) : current}`;
}

/** `2019` once finished; `{expected} dez/2026` while in progress. */
export function formatGraduation(
  { end, inProgress }: Pick<EducationEntry, 'end' | 'inProgress'>,
  expected: string,
  text: MonthText,
) {
  return inProgress ? `${expected} ${formatMonth(end, text)}` : end.slice(0, 4);
}
