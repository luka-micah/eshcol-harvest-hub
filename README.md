# Eshcol Harvest Hub

A farm website and farm-to-market e-commerce storefront for **Eshcol Harvest Hub**, a bell-pepper farm in **Jos, Plateau State, Nigeria**.

Built with **Next.js (App Router) + TypeScript** and **Tailwind CSS**. The site is currently a
**fully client-rendered frontend** — all content (products, journal posts, delivery zones) lives in
a static data module (`src/data/catalog.ts`). There is no backend or database wired up yet, so forms
and checkout are demo-only (no real payment or persistence).

## Features

- **Public marketing site** — Home, About, Produce, For Businesses, Farm Journal, Contact.
- **Shop** — product catalogue, product detail, cart, checkout (demo order confirmation).
- **Farm Journal (CMS)** — static journal posts rendered from `src/data/catalog.ts`.
- **Responsive UI** — Tailwind, server/components split, accessible primitives.

## Getting started

```bash
cp .env.example .env        # only NEXT_PUBLIC_* vars are needed
npm install
npm run dev                 # http://localhost:3000
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | Type-check with `tsc --noEmit` |
| `npm run test` | Run unit tests (Vitest) |

## Environment

See `.env.example`. Only public variables are used: `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`,
and optionally `NEXT_PUBLIC_GA_ID`. No secrets or database connection are required.

## Architecture

```
src/
├── app/                    # pages, layouts, server components
│   ├── (marketing)/        # home, about, produce, contact, farm-journal, for-businesses
│   ├── shop/               # products, product detail, cart, checkout (client-side)
│   └── api/                # (none — no backend; sitemap/robots only)
├── components/             # ui, layout, marketing, shop
├── data/
│   └── catalog.ts          # static content (products, posts, categories, delivery zones)
├── lib/
│   ├── constants.ts        # SITE info, fulfilment labels, order-transition rules
│   ├── utils.ts            # formatNaira, slugify, cn
│   └── seo.ts              # metadata helpers
└── types/                  # type augmentations
```

All storefront content is read synchronously from `src/data/catalog.ts`, so pages are static and need
no server-side data fetching. The cart is client-side only (`CartProvider`, `localStorage`). Forms and
checkout simulate success locally. When a real API/database is added later, swap the `catalog` helpers
for fetches and wire the cart/checkout to it.

## Deploying to Vercel

Import the repo as a Vercel project (framework preset: Next.js). Set the Environment Variable
`NEXT_PUBLIC_APP_URL` to your production URL (e.g. `https://eshcol-harvest-hub.vercel.app`). No database
or serverless function is required for this static build.

## Notes

- The site is intentionally backend-free for now; payments, accounts and admin are not implemented.
- External integrations (Paystack, Cloudinary, Resend, WhatsApp) are referenced but not active.
