import type { Locale } from '@/i18n/locale';

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

/** Empty until there is one to show; the section and its Navbar anchor stay hidden. */
export const certifications: readonly { id: string }[] = [];

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
