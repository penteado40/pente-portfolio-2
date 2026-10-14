# LinkedIn — raw content

Source: https://www.linkedin.com/in/penteado-felipe/ (read 2026-10-13). Experiences are written in EN on
LinkedIn; the "Sobre" is in PT. The PT version of the experiences is in `resume.md`.

## Headline

Full Stack Engineer (Back-End focus) | Node.js · TypeScript · React · PHP/Laravel · AWS | Fintech & Payments | Remote

## Sobre (PT)

Construo o back-end por onde o dinheiro passa — e o front-end que as pessoas usam para acompanhá-lo.

Desenvolvedor Full Stack com mais de 4 anos construindo APIs e sistemas financeiros em produção: faturamento, rateio de custos e pagamentos (cartão, boleto e Pix). Meu ponto forte é o back-end — Node.js, TypeScript, PHP/Laravel, PostgreSQL, SQL Server — com React e Next.js no front-end.

Na prática:
→ Reduzi em 67% (90s → 30s) as consultas críticas de faturamento reescrevendo SQL e criando índices
→ Reestruturei a geração de faturamento e PDFs de mais de 5 min para cerca de 2 min
→ Integrei 3 gateways de pagamento (ASAAS, Getnet, Stone) em uma plataforma de microsserviços usada por cerca de 15 escolas
→ Co-desenvolvi desde a concepção dois sistemas corporativos (gestão de contratos e distribuição de licenças)

Hoje desenvolvo e mantenho, como freelancer, uma plataforma multi-cliente de sites de eventos (fawedding.com.br): convites em React, API em Hono + Prisma + PostgreSQL com JWT e painel para os clientes gerenciarem convidados — 3 clientes em produção e cerca de 200 RSVPs processados. O envio de e-mails nasceu numa arquitetura orientada a eventos na AWS (SQS → Lambda → SES com CDK) e migrei para Resend para reduzir custo e infraestrutura. Ferramenta certa para a escala.

Times contam comigo para code review, pair programming e decisões de arquitetura do dia a dia. Me importo com código que o próximo desenvolvedor consiga manter.

Aberto a vagas remotas CLT/PJ (Brasil ou exterior) e projetos freelance: APIs, integrações, aplicações web.

Stack: Node.js · TypeScript · Hono · Prisma · Zod · PHP 8/Laravel · React · Next.js · PostgreSQL · SQL Server · MySQL · AWS (S3, SQS, Lambda, SES, CDK) · Terraform · Docker · CI/CD · Datadog

## Experience (EN)

### Freelance Full Stack Developer — Self-employed · Dec 2025 – present

Building and running a multi-client event website platform (fawedding.com.br) for weddings and birthdays.

- Built and maintain the platform end to end: 3 clients in production and ~200 RSVPs processed
- Each event gets a digital invitation (React landing page with RSVP) backed by a Node.js + TypeScript + Hono API with Prisma, PostgreSQL (Neon) and JWT, plus a client dashboard to manage guests
- Cut email cost and infrastructure by migrating from an event-driven AWS flow (SQS → Lambda → SES, provisioned with AWS CDK) to Resend

Skills: Node.js · TypeScript · Hono · Prisma · PostgreSQL · React

### Software Engineer (Mid-level) — Billing & Financial Systems — IATec · May 2023 – Oct 2025 · Remote

Rehired to work on the organization's billing and cost allocation systems.

- Cut the main billing queries by 67% (90s → 30s) by rewriting SQL and creating indexes
- Restructured billing and PDF generation, reducing total time from 5+ min to ~2 min (-60%)
- Evolved the cost allocation system across projects, products and entities, consolidating data from Azure DevOps, infrastructure and internal systems
- Automated billing with export to the accounting system and document storage on AWS S3, eliminating manual file-by-file uploads
- Co-built two corporate systems from conception (contract management and license distribution)
- Technical reference for code reviews and pair programming, working in Scrum/Kanban with the PO

Skills: PHP 8 · Laravel · SQL · AWS S3 · Query Optimization

### Software Engineer (Mid-level) — Payments — YouPay · Sep 2022 – Apr 2023

Payments startup for education.

- Built critical APIs for the billing core of a payments platform used by ~15 schools (credit card, boleto and Pix), consumed by web and mobile apps
- Integrated 3 payment gateways (ASAAS, Getnet and Stone) in a microservices architecture and built the schools' delinquency control

Skills: PHP · REST APIs · Microservices · Payment Gateway Integration

### Software Development Intern → Trainee — IATec · Feb 2021 – Aug 2022 · São Paulo

Started maintaining legacy PHP systems and was promoted to trainee within 8 months, moving on to build new features in financial systems.

Skills: PHP · Laravel

### IT Support Intern — UNASP-HT · Feb 2019 – Nov 2019 · Hortolândia, SP

IT support for 6 labs / 300 workstations (~200 students and faculty per semester) on a three-person intern team: user support, Active Directory, LanSchool, software installs, OS reinstalls, basic Windows Server. Led lab preparation for exam periods with zero downtime. (Not in the resume.)

## Mismatches between LinkedIn and the resume

| Item | LinkedIn | Resume |
| --- | --- | --- |
| IATec (mid-level) dates | May 2023 – Oct 2025 | 04/2023 – 11/2025 |
| YouPay dates | Sep 2022 – Apr 2023 | 09/2022 – 03/2023 |
| UNASP-HT internship | listed | missing |
| Education | Cruzeiro do Sul (UNICSUL) | Cruzeiro do Sul EAD, expected MM/AAAA (placeholder) + Técnico UNASP-HT 2019 |
