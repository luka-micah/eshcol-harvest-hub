# Eshcol Harvest Hub

A farm website and farm-to-market e-commerce platform for **Eshcol Harvest Hub**, a bell-pepper farm in **Jos, Plateau State, Nigeria**.

Built with the stack recommended in the PRD: **Next.js (App Router) + TypeScript**, **Tailwind CSS**, **Prisma + PostgreSQL (Neon)**, **Paystack**, **Cloudinary**, **Resend**, and **WhatsApp**.

The codebase is split into two separately deployable units:

- **`apps/web`** — the Next.js frontend (storefront + admin UI). It talks to the backend only over HTTP.
- **`apps/api`** — a standalone **Express** backend service implementing the `/api/v1/*` JSON API, using the shared business logic in `src/services` and `src/lib`. Auth is JWT-based (`src/lib/auth-core.ts`).

Both apps share the same `src/` business logic, Prisma schema and Tailwind config, and run together with `npm run dev`.

## Features

- **Public marketing site** — Home, About, Produce, For Businesses, Farm Journal, Contact.
- **Shop** — product catalogue, product detail, cart, checkout, Paystack payments (server-verified), farm pickup & delivery.
- **Bulk enquiries** — dedicated retailer/offtaker flow with admin review.
- **Farm Journal (CMS)** — create/publish/unpublish/delete posts from the admin.
- **Admin dashboard** — products, inventory, orders, customers, bulk orders, content, delivery-zone pricing, settings.
- **Secure by design** — server-side validation, server-verified payments, webhook signature checks, secrets never exposed to the client, DB transactions for orders.

## Getting started

```bash
cp .env.example .env        # fill in real values (DATABASE_URL, keys, etc.)
npm install
npx prisma generate
npx prisma db push         # or `prisma migrate dev`
npm run db:seed            # optional: sample data + admin user
npm run dev
```

Create an admin account via the seed, or register a customer and update its role in the database.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start **both** the web (Next.js) and API (Express) in parallel |
| `npm run dev:web` | Start only the Next.js frontend |
| `npm run dev:api` | Start only the Express API (`tsx watch`) |
| `npm run build` | Production build of the frontend (runs `prisma generate`) |
| `npm run build:api` | Type-check the API |
| `npm run typecheck` | Type-check the frontend with `tsc --noEmit` |
| `npm run test` | Run unit tests (Vitest) |
| `npm run db:push` / `db:migrate` | Sync the database schema |
| `npm run db:seed` | Seed sample data |

## Environment

See `.env.example`. Never commit `.env`. Required variables: `DATABASE_URL`, `AUTH_SECRET`,
`PAYSTACK_SECRET_KEY`, `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`, `CLOUDINARY_*`, `RESEND_API_KEY`,
`EMAIL_FROM`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_APP_URL`, and the API config
`NEXT_PUBLIC_API_URL` (frontend → backend base URL), `WEB_ORIGIN` and `API_PORT` (backend CORS + port).

## Architecture

```
apps/
├── web/                    # Next.js frontend (src/ at repo root via @/* alias)
└── api/                    # standalone Express backend (apps/api/src)
src/
├── app/                    # pages, layouts, server components (frontend only)
├── components/             # ui, layout, marketing, shop, admin, account
├── lib/
│   ├── auth-core.ts        # framework-agnostic JWT + password helpers (shared)
│   ├── api-client.ts        # client-side fetch helper (browser)
│   ├── server-api.ts        # server-side fetch helper (uses the session cookie)
│   ├── payments/ email/ cloudinary/ validation/ constants/ utils/ seo/ db
├── services/               # business logic (products, orders, payments, ...)
└── prisma/                 # schema.prisma, seed.ts
```

The frontend never touches the database directly — every read/write goes through the backend API
(`NEXT_PUBLIC_API_URL`). Business logic lives in `services/`; Express route handlers in `apps/api/src/routes`
only orchestrate. Prices and inventory are always recomputed server-side; the client never dictates totals.

## Notes

- External integrations degrade gracefully when their API keys are absent (email logs to console, Cloudinary returns the original URL), so the app runs locally without all credentials.
- Paystack must verify transactions server-side via `/api/v1/payments/verify` and the `webhook` route before an order is marked paid.
