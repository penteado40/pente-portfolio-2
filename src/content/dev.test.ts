import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  devSections,
  education,
  experience,
  formatGraduation,
  formatMonth,
  formatPeriod,
  projects,
  skills,
} from './dev.ts';

function devDictionary(locale: 'en' | 'pt') {
  return JSON.parse(readFileSync(new URL(`../i18n/${locale}/dev.json`, import.meta.url), 'utf8'));
}

const pt = devDictionary('pt').experience;
const en = devDictionary('en').experience;

test('a period reads month/year to month/year, in the locale', () => {
  assert.equal(formatPeriod({ start: '2023-04', end: '2025-11' }, 'atual', pt), 'abr/2023 – nov/2025');
  assert.equal(formatPeriod({ start: '2023-04', end: '2025-11' }, 'present', en), 'Apr 2023 – Nov 2025');
});

test('an open period ends with the current label', () => {
  assert.equal(formatPeriod({ start: '2025-12', end: null }, 'atual', pt), 'dez/2025 – atual');
});

test('every month has its short name, from the dictionary', () => {
  const months = Array.from({ length: 12 }, (_, i) => formatMonth(`2020-${i + 1}` as const, pt));
  assert.deepEqual(months, ['jan/2020', 'fev/2020', 'mar/2020', 'abr/2020', 'mai/2020', 'jun/2020', 'jul/2020', 'ago/2020', 'set/2020', 'out/2020', 'nov/2020', 'dez/2020']);
  assert.equal(formatMonth('2020-05', en), 'May 2020');
});

test('a finished course shows its year', () => {
  assert.equal(formatGraduation({ end: '2019-12', inProgress: false }, 'expected', en), '2019');
});

test('a course in progress shows when it is expected', () => {
  assert.equal(formatGraduation({ end: '2026-12', inProgress: true }, 'previsão', pt), 'previsão dez/2026');
});

test('experience lists the CV entries newest first, with the CV dates', () => {
  assert.deepEqual(
    experience.map(({ id, start, end }) => [id, start, end]),
    [
      ['freelance', '2025-12', null],
      ['iatec-mid', '2023-04', '2025-11'],
      ['youpay', '2022-09', '2023-03'],
      ['iatec-trainee', '2021-02', '2022-08'],
      ['unasp', '2019-02', '2019-11'],
    ],
  );
});

test('every experience entry has stack tags', () => {
  for (const job of experience) assert.ok(job.stack.length > 0, job.id);
});

test('without certifications, the page has no Certifications section', () => {
  assert.deepEqual(devSections([]), ['about', 'experience', 'projects', 'skills', 'contact']);
});

test('one certification brings the section back, after Experience', () => {
  const sections = devSections([{ title: 'Test', issuer: 'Issuer', year: '2026' }]);
  assert.deepEqual(sections, ['about', 'experience', 'certifications', 'projects', 'skills', 'contact']);
});

test('skills lists the six categories in order, each with items', () => {
  assert.deepEqual(
    skills.map(({ id }) => id),
    ['back-end', 'front-end', 'databases', 'cloud', 'integrations', 'practices'],
  );
  for (const category of skills) assert.ok(category.items.length > 0, category.id);
});

test('projects lists the three Products, then the three Studies', () => {
  assert.deepEqual(
    projects.map(({ id, kind }) => [id, kind]),
    [
      ['fawedding', 'product'],
      ['events', 'product'],
      ['portfolio', 'product'],
      ['inventory-api', 'study'],
      ['task-manager', 'study'],
      ['pente-portfolio-api', 'study'],
    ],
  );
});

test('every project has stack tags and at least one repo', () => {
  for (const project of projects) {
    assert.ok(project.stack.length > 0, project.id);
    assert.ok(project.repos.length > 0, project.id);
  }
});

test('Events is the only Product being built', () => {
  const building = projects.filter((p) => p.kind === 'product' && p.status === 'building');
  assert.deepEqual(building.map(({ id }) => id), ['events']);
});

test('portfolio-api is private: listed without a link', () => {
  const portfolio = projects.find(({ id }) => id === 'portfolio');
  assert.deepEqual(portfolio?.repos.find(({ label }) => label === 'portfolio-api'), { label: 'portfolio-api' });
});

test('every public repo links to GitHub', () => {
  for (const { repos } of projects) {
    for (const { label, url } of repos) {
      if (label !== 'portfolio-api') assert.equal(url, `https://github.com/penteado40/${label}`);
    }
  }
});

// ADR 0004: the dictionary type comes from the EN file only, so nothing
// else catches an id in dev.ts without its text.
for (const locale of ['en', 'pt'] as const) {
  test(`${locale}: every experience, education, skills and project id has its text`, () => {
    const dict = devDictionary(locale);
    for (const { id } of experience) {
      const text = dict.experience.items[id];
      assert.ok(text?.role && text.context && text.bullets?.length, `experience.items.${id}`);
    }
    for (const { id } of education) {
      const text = dict.experience.education.items[id];
      assert.ok(text?.course, `experience.education.items.${id}`);
    }
    for (const { id } of skills) {
      assert.ok(dict.skills.categories[id]?.name, `skills.categories.${id}`);
    }
    for (const project of projects) {
      const text = dict.projects.items[project.id];
      assert.ok(text?.title && text.summary, `projects.items.${project.id}`);
      // Highlights are for Products only, two or three of them.
      const highlights = text.highlights?.length ?? 0;
      if (project.kind === 'product') assert.ok(highlights >= 2 && highlights <= 3, `projects.items.${project.id}.highlights`);
      else assert.equal(highlights, 0, `projects.items.${project.id}.highlights`);
    }
  });
}
