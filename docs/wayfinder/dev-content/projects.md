# Projects

Public repos on github.com/penteado40 (as of 2026-10-13). All listed repos are selected for the Dev page
(Felipe, 2026-10-13). Notes come from the READMEs and Felipe's own LinkedIn posts.

| Repo | Stack | Demo | Description |
| --- | --- | --- | --- |
| [events-api](https://github.com/penteado40/events-api) | TypeScript, NestJS, Zod + OpenAPI/Scalar, Prisma + Postgres (Neon), Upstash Redis, Resend + React Email, Cloudinary, Vercel | https://events-api-lac.vercel.app | API multi-evento: RSVP, lista de presentes com Pix e emails para convidados |
| [events-expo](https://github.com/penteado40/events-expo) | TypeScript, Expo + expo-router | — | App mobile de membros da events-api (no README yet) |
| [inventory-api](https://github.com/penteado40/inventory-api) | TypeScript, Hono, Zod, Prisma, PostgreSQL | — | Multi-tenant inventory REST API (products, locations, movements) isolated per store |
| [fawedding](https://github.com/penteado40/fawedding) | React + Vite, Cloudflare | https://fawedding.com.br | Felipe & Amanda's wedding site, the platform's first tenant |
| [fawedding-api](https://github.com/penteado40/fawedding-api) | TypeScript, Hono, Prisma, PostgreSQL, Resend + React Email, Docker | — | Multi-tenant API for the FAWedding ecosystem: guests, RSVPs, gift list, confirmation email |
| [task_manager](https://github.com/penteado40/task_manager) | Java 21, Spring Boot 3.4, PostgreSQL | — | REST API for tasks and custom statuses |
| [pente-portfolio-api](https://github.com/penteado40/pente-portfolio-api) | Java 21, Spring Boot 3.4, PostgreSQL | — | Receives contact messages and testimonials from the Audio portfolio |

## Story material (from LinkedIn posts)

- **events-api**: replaces fawedding-api. Wedding was the root entity, so a birthday had to pretend to be a
  wedding; now Event is the tenant unit, event type sets default email copy, per-event roles
  (Owner/Manager/Viewer), Pix contributions with receipt upload. Started with PRD, glossary, ADRs and a Clean
  Architecture / DDD guide before code. Goal: V1 live by end of October 2026, migrating the old API's history
  with original IDs preserved.
- **fawedding / fawedding-api**: built as a gift for Amanda. Email first went through SQS → Lambda → SES with
  AWS CDK, then moved to Resend (fire-and-forget, tracked per RSVP, manual resend) because of the project's
  volume.
- **inventory-api**: middleware injects `storeId` into each request's context for tenant isolation; Prisma
  `Decimal` for every monetary field; migrated from Drizzle to Prisma; built with Claude Code + a custom MCP
  server.
- **Audio portfolio** (felipepenteado.com.br, this repo's current page): React + Vite, lazy-loaded media,
  Vercel + Cloudflare.

## Open points

- The resume describes the freelance platform as Hono; events-api (its successor) is NestJS.
- fawedding's GitHub homepage is fawedding.vercel.app; the live domain is fawedding.com.br.
