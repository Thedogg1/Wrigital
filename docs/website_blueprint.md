# Wrigital Website — Blueprint & Technical Specification

> **Status:** Primary implementation specification for the Wrigital marketing site.
> **Audience:** A developer who has never seen this codebase should be able to build the entire site from this document alone.
> **Source material (only):** `wrigital/docs/Wrigital_FinPrint_Website_Copy.md` (copy, IA and Midjourney prompts) and the existing `velocityiq` codebase (branding reference, blog, and the two lead‑capture landing pages).
> **Spelling:** UK English throughout the product and copy.

---

## Table of contents

1. [Project overview](#1-project-overview)
2. [Technology stack](#2-technology-stack)
3. [Project setup](#3-project-setup)
4. [Folder structure](#4-folder-structure)
5. [Page specifications](#5-page-specifications)
6. [Component library](#6-component-library)
7. [Routing](#7-routing)
8. [Styling standards](#8-styling-standards)
9. [SEO strategy](#9-seo-strategy)
10. [Performance](#10-performance)
11. [Developer notes](#11-developer-notes)
12. [Image asset workflow](#12-image-asset-workflow)
13. [Migration notes](#13-migration-notes)

---

## 1. Project overview

### Purpose

Wrigital is a consultancy and product company that helps **regulated professional‑services firms adopt AI with confidence**. The website exists to:

- Establish Wrigital's positioning — *"Accountable AI for regulated firms"* — to a sceptical, compliance‑minded audience.
- Route qualified prospects to a single conversion action: **Book an assessment** (Calendly), or on the product page, **Request a sample report**.
- Prove capability, not just claim it, by presenting **FinPrint** (a working, FCA‑context client‑intelligence product) and the **Client Intelligence Engine** (the underlying glass‑box architecture) as evidence.
- Capture leads from two LinkedIn campaign landing pages (UK & US) that already exist in production form inside `velocityiq`.
- Publish a compliance/AI thought‑leadership **blog** to support SEO and trust.

### Goals

| Goal | Measure |
| --- | --- |
| Convert regulated‑firm decision‑makers | Assessment bookings via Calendly |
| Convert campaign traffic | UK/US lead‑capture form submissions + report email delivery |
| Communicate trust & governance | Clear "glass‑box" narrative on FinPrint + Engine pages |
| Rank for AI‑compliance topics | Indexed blog posts, structured data, clean Core Web Vitals |
| Support a niche‑by‑niche expansion | Content model & IA that generalise beyond financial advisers |

### Target users

1. **Owners / partners of regulated professional‑services firms** — financial advisers first, then accountants and solicitors. Have money, a real need, and genuine anxiety about adopting AI in a way that survives regulatory scrutiny.
2. **Compliance officers & boards** — need to see auditability, determinism, and adviser‑in‑the‑loop control before they will sign off.
3. **Financial advisers to HNW business owners** — the direct FinPrint buyer (the two‑report pack).
4. **Campaign traffic** — LinkedIn visitors landing on the UK/US lead‑capture pages.

### Design philosophy

Wrigital's brand voice and visual language are **calm, premium, understated and authoritative**. The design must feel like it belongs to a firm that *"built compliance systems inside a bank."*

- **Editorial, not "tech".** Deep ink navy, warm paper tones, a single restrained gold accent. No neon, no circuitry clichés, no glowing brains.
- **Evidence over hype.** Every strong claim is paired with a concrete mechanism (deterministic calculation, number audit, audit trail).
- **Generous whitespace.** Long‑form, confident copy with room to breathe.
- **One accountable action per page.** Each page funnels to a single primary CTA.
- **Accessible and fast** by default (WCAG 2.2 AA target, strong Core Web Vitals).

> ⚠️ **Brand divergence from VelocityIQ.** VelocityIQ's identity is navy + **cyan** (`#00b4d8`). Wrigital's identity is navy + **warm paper + gold**. When migrating VelocityIQ code, the *structure and logic* transfer directly, but the *cyan accent and all VelocityIQ naming/branding must be replaced* with the Wrigital palette and voice (see [§8](#8-styling-standards) and [§13](#13-migration-notes)).

---

## 2. Technology stack

The stack mirrors the proven `velocityiq` implementation (Next.js App Router + Tailwind v4 + Sanity + Resend) so the blog and landing pages migrate cleanly, with additions requested for this build (shadcn/ui, Framer Motion, Zod). VelocityIQ runs **Next 16 / React 19 / Tailwind v4**; we standardise on the same majors.

| Concern | Choice | Why it is required |
| --- | --- | --- |
| Framework | **Next.js (latest, App Router)** | Server Components, file‑based routing, first‑class metadata API, image optimisation, ISR for the blog. Matches VelocityIQ so migration is 1:1. |
| Language | **TypeScript (strict)** | Type safety across the data layer (Sanity types), forms and API routes. VelocityIQ is already fully typed. |
| Styling | **Tailwind CSS v4** | Utility‑first, tokens defined via CSS variables in `globals.css` (VelocityIQ pattern). No `tailwind.config.js` needed in v4 — theme is inline via `@theme`. |
| UI primitives | **shadcn/ui** (Radix under the hood) | Accessible, unstyled‑then‑themed components (Dialog, Accordion, Tabs, Form) we restyle with Wrigital tokens. Replaces hand‑rolled modals/tabs from VelocityIQ with accessible primitives. |
| Animation | **Framer Motion** | Subtle, brand‑appropriate entrance/scroll animations. Must respect `prefers-reduced-motion`. |
| Forms | **React Hook Form** | Performant, uncontrolled forms. Already a VelocityIQ dependency. |
| Validation | **Zod** | Single source of truth for form + API validation (shared schemas). Upgrades VelocityIQ's ad‑hoc regex checks. |
| Icons | **lucide-react** | Clean, consistent line icons. Already used in VelocityIQ. |
| CMS | **Sanity** (`next-sanity`, `@portabletext/react`, `@sanity/image-url`) | Powers the blog (posts, categories, comments, portable text, image CDN). Migrated wholesale from VelocityIQ. |
| Email | **Resend** | Sends the lead‑capture report emails with attachments (UK/US pages). Migrated from VelocityIQ. |
| Analytics | **Vercel Analytics + GA4** (or Plausible) | Traffic + conversion measurement; Plausible is a privacy‑friendly alternative appropriate for a compliance‑led brand. |
| SEO | **App Router Metadata API** (+ `next-sitemap` for sitemap/robots) | Native `metadata`/`generateMetadata`, `opengraph-image`, JSON‑LD. `next-seo` is **not** used with App Router — the native API supersedes it. |
| Image optimisation | **`next/image`** | Automatic responsive images, lazy loading, AVIF/WebP. Sanity CDN + local `public/` assets. |
| Testing | **Vitest** (+ optional Playwright) | Unit tests for calculators/validation (VelocityIQ uses Vitest); Playwright for critical‑path e2e (form submit). |
| Hosting | **Vercel** (recommended) | Native Next.js support, ISR, edge, preview deploys. (VelocityIQ ships behind IIS on Windows — see deployment note.) |

> **Note on `next-seo`:** The task lists `next-seo (or App Router metadata strategy)`. With the App Router we use the **native Metadata API** exclusively. `next-seo` targets the Pages Router and should not be installed.

---

## 3. Project setup

### 3.1 Create the project

```bash
# From c:\inetpub\wwwroot\Projects\BusinessAI.Frontend
npx create-next-app@latest wrigital
```

Answer the prompts:

```
✔ TypeScript?                        Yes
✔ ESLint?                            Yes
✔ Tailwind CSS?                      Yes
✔ src/ directory?                    No        (VelocityIQ keeps app/ at root)
✔ App Router?                        Yes
✔ Turbopack?                         Yes
✔ Import alias?                      Yes  ->  @/*
```

> If `wrigital/` already contains `docs/`, run `create-next-app` in a temp folder and copy the generated files in, or scaffold into the existing directory and keep `docs/` intact.

### 3.2 Install dependencies

```bash
cd wrigital

# CMS + content rendering
npm install next-sanity @sanity/vision sanity @portabletext/react @sanity/image-url @sanity/icons

# Email
npm install resend

# Forms + validation
npm install react-hook-form zod @hookform/resolvers

# UI, animation, icons, toasts
npm install framer-motion lucide-react react-hot-toast

# SEO helpers
npm install next-sitemap

# Analytics (choose one)
npm install @vercel/analytics
# or: privacy-first
# (Plausible is script-based; no package required)
```

Initialise **shadcn/ui** (App Router, Tailwind v4):

```bash
npx shadcn@latest init
# then add the primitives we use:
npx shadcn@latest add button card dialog accordion tabs form input label textarea sonner
```

Dev dependencies:

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
npm install -D prettier prettier-plugin-tailwindcss
# optional e2e
npm install -D @playwright/test
```

### 3.3 Environment variables

Create `.env.local` (never commit) and `env.example` (commit). Ported from VelocityIQ and trimmed to what Wrigital needs.

```bash
# .env.local

# --- Sanity CMS (blog) ---
NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxxx
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-07-27
# Optional: only needed for Studio / comment writes (server-side)
SANITY_API_READ_TOKEN=
# NEXT_PUBLIC_SANITY_TOKEN=            # only if Studio is embedded & route-secured

# --- Resend (lead-capture report emails) ---
RESEND_API_KEY=

# --- Lead capture storage (optional overrides; default to data/*.jsonl) ---
# UK_LEADS_FILE=
# US_LEADS_FILE=

# --- Email content overrides (optional) ---
# UK_LEAD_EMAIL_SUBJECT=
# UK_LEAD_EMAIL_HTML=
# US_LEAD_EMAIL_SUBJECT=
# US_LEAD_EMAIL_HTML=
# US_SAMPLE_REPORT_PATH=public/us-landing/US_Sample_Report.pdf

# --- Feature flags ---
NEXT_PUBLIC_ENABLE_COMMENTS=false

# --- Site ---
NEXT_PUBLIC_SITE_URL=https://wrigital.com
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/wrigital/assessment
```

> **Clerk is intentionally dropped.** VelocityIQ gated an "Exit Snapshot" download behind Clerk auth. Wrigital's spec has no authenticated area (Studio aside), so `@clerk/nextjs` and the `(authenticated)`/`sign-in` routes are **not** migrated. See [§13](#13-migration-notes).

### 3.4 Linting & formatting

Keep the generated `eslint.config.mjs` (flat config, `eslint-config-next`). Add Prettier with the Tailwind plugin:

```json
// .prettierrc
{
  "singleQuote": true,
  "semi": true,
  "trailingComma": "all",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

`package.json` scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "format": "prettier --write .",
    "test": "vitest run",
    "test:watch": "vitest",
    "postbuild": "next-sitemap"
  }
}
```

### 3.5 TypeScript configuration

Use the generated `tsconfig.json` with the `@/*` path alias. Ensure `"strict": true`. Mirror VelocityIQ's `typings.d.ts` for Sanity content types (see [§4](#4-folder-structure) / [§13](#13-migration-notes)).

### 3.6 Tailwind configuration

Tailwind v4 is configured **in CSS**, not a JS config file. All brand tokens live in `app/globals.css` under `:root` and are surfaced to Tailwind with `@theme inline`. Full token set in [§8](#8-styling-standards).

### 3.7 `next.config.ts`

```ts
import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: { root: path.resolve(__dirname) },
  serverExternalPackages: ['resend'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io', port: '', pathname: '/**' },
    ],
  },
};

export default nextConfig;
```

### 3.8 Deployment recommendations

- **Primary: Vercel.** Enables ISR for the blog (`revalidate`), preview deploys, edge caching, and zero‑config `next/image`. Add env vars in the Vercel dashboard.
- **Alternative: IIS on Windows** (the current VelocityIQ host). Run `next build && next start` behind IIS/ARR reverse proxy, or use a Node process manager. Ensure the `data/` directory (JSONL lead files) is writable and persisted, and that outbound HTTPS to Resend/Sanity is allowed.
- Set `NEXT_PUBLIC_SITE_URL` and `metadataBase` to the production domain before launch.
- Configure a custom domain, HTTPS, and a `robots.txt` + `sitemap.xml` (via `next-sitemap`).

---

## 4. Folder structure

```
wrigital/
├─ app/
│  ├─ layout.tsx                     # Root layout: <html>, fonts, Organization JSON-LD
│  ├─ page.tsx                       # Home (/)
│  ├─ globals.css                    # Tailwind import + brand tokens (@theme)
│  ├─ opengraph-image.tsx            # Default OG image (optional, generated)
│  ├─ sitemap.ts                     # Dynamic sitemap (or next-sitemap)
│  ├─ robots.ts                      # Robots policy
│  ├─ not-found.tsx                  # Global 404
│  │
│  ├─ consultancy/
│  │  └─ page.tsx                    # /consultancy
│  ├─ client-conversion-financial-advisers/
│  │  └─ page.tsx                    # /client-conversion-financial-advisers  (FinPrint)
│  ├─ client-intelligence-engine/
│  │  └─ page.tsx                    # /client-intelligence-engine  (The Engine)
│  │
│  ├─ blog/
│  │  ├─ page.tsx                    # Blog index (Sanity list)
│  │  └─ [slug]/
│  │     └─ page.tsx                 # Blog post (Portable Text)
│  │
│  ├─ uk/                            # LinkedIn landing page (UK) — migrated
│  │  ├─ layout.tsx                  # Page-level metadata
│  │  └─ page.tsx
│  ├─ us/                            # LinkedIn landing page (US) — migrated
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  │
│  ├─ (legal)/                       # Route group — shared legal layout, no URL segment
│  │  ├─ privacy/page.tsx
│  │  └─ terms/page.tsx
│  │
│  └─ api/
│     ├─ uk-lead-capture/route.ts    # POST — save lead + email report (migrated)
│     ├─ us-lead-capture/route.ts    # POST — save lead + email report (migrated)
│     └─ createComment/route.ts      # POST — blog comment (optional, flag-gated)
│
├─ components/
│  ├─ layout/
│  │  ├─ Header.tsx                  # Main-site header (variant-aware)
│  │  └─ Footer.tsx                  # "Accountable AI for regulated firms."
│  ├─ ui/                            # shadcn/ui generated primitives (button, card, dialog…)
│  ├─ marketing/                     # Section-level building blocks
│  │  ├─ Hero.tsx
│  │  ├─ SectionLabel.tsx
│  │  ├─ FeatureCard.tsx
│  │  ├─ StepList.tsx
│  │  ├─ FaqAccordion.tsx
│  │  ├─ CtaBand.tsx
│  │  └─ Prose.tsx
│  ├─ blog/
│  │  ├─ RichText.tsx                # Portable Text components (migrated + re-themed)
│  │  ├─ CalloutBox.tsx              # (migrated + re-themed)
│  │  └─ PostCard.tsx
│  └─ landing/
│     ├─ uk/                         # UK-specific landing components (migrated)
│     └─ us/                         # US-specific landing components (migrated)
│
├─ features/                         # Self-contained feature modules (logic + UI)
│  └─ lead-capture/
│     ├─ LeadCaptureModal.tsx        # Shared, brand-themed (from VelocityIQ)
│     └─ leadSchema.ts               # Zod schema shared by form + API
│
├─ lib/                              # Framework-agnostic helpers & integrations
│  ├─ uk-landing/                    # saveUkLead, sendUkLeadReportEmail, loadSlides… (migrated)
│  ├─ us-landing/                    # saveUsLead, sendUsLeadReportEmail… (migrated)
│  ├─ email/                         # Resend client + templates
│  └─ utils/
│     └─ readTime.ts                 # (migrated)
│
├─ hooks/                            # Reusable React hooks (e.g. useReducedMotion, useLockScroll)
│
├─ sanity/                           # Sanity client, schema, image builder (migrated)
│  ├─ env.ts
│  ├─ schema.ts
│  ├─ lib/{client.ts,image.ts}
│  └─ schemaTypes/{postType,categoryType,blockContentType,comment}.ts
│
├─ types/
│  └─ index.d.ts                     # Content types (Post, Category, Comment, Image…)  (= VelocityIQ typings.d.ts)
│
├─ content/                          # Static HTML slide decks for landing pages (migrated)
│  ├─ uk-landing/slides/*.html
│  └─ us-landing/slides/*.html
│
├─ data/                             # Lead JSONL storage (gitignored contents)
│  ├─ uk-leads.jsonl
│  └─ us-leads.jsonl
│
├─ public/
│  ├─ images/                        # Marketing images (generated per §12)
│  ├─ icons/                         # Favicons, touch icons, brand marks
│  ├─ brand/                         # Wrigital / FinPrint logos
│  ├─ uk-landing/                    # UK landing static assets (migrated)
│  └─ us-landing/                    # US landing static assets (migrated)
│
├─ styles/                           # (optional) additional CSS partials
├─ tests/                            # Vitest unit tests
├─ .env.local / env.example
├─ next.config.ts
├─ next-sitemap.config.js
├─ sanity.config.ts / sanity.cli.ts
├─ tsconfig.json
└─ package.json
```

### Directory purposes

| Directory | Purpose |
| --- | --- |
| `app/` | Routes, layouts, route handlers. App Router file conventions (`page`, `layout`, `loading`, `error`, `not-found`). |
| `app/(legal)/` | **Route group** — shares a layout without adding a URL segment. |
| `app/api/` | Server route handlers (lead capture, comments). Node runtime (file writes + Resend). |
| `components/layout/` | Global chrome: `Header`, `Footer`. |
| `components/ui/` | shadcn/ui primitives, themed with Wrigital tokens. |
| `components/marketing/` | Reusable marketing sections used across Home/Consultancy/FinPrint/Engine. |
| `components/blog/` | Blog rendering (Portable Text, callouts, post cards). |
| `components/landing/` | UK/US LinkedIn landing‑page components (migrated 1:1, re‑themed). |
| `features/` | Cohesive feature modules that own their logic + UI + schema (e.g. lead capture). |
| `lib/` | Integrations & pure helpers (Sanity queries live in pages; email/Resend, file storage, slide loaders, utils). |
| `hooks/` | Cross‑cutting React hooks. |
| `sanity/` | CMS config, schema types, client and image URL builder. |
| `types/` | Global TypeScript content types. |
| `content/` | Static HTML slide decks rendered inside the landing pages. |
| `data/` | Append‑only JSONL lead capture logs (server‑writable). |
| `public/` | Static assets served at root: images, icons, brand marks, landing assets. |
| `tests/` | Vitest specs (validation, utils, calculators if ported). |

---

## 5. Page specifications

The site has **four main‑site marketing pages**, a **blog** (index + post), **two campaign landing pages** (UK/US), and **legal** pages. Every booking CTA routes to `NEXT_PUBLIC_CALENDLY_URL`. Copy is authoritative in `Wrigital_FinPrint_Website_Copy.md`; this section maps that copy to structure, components and metadata.

### Global chrome (all main‑site pages)

**Header (main site)** — logo "Wrigital"; nav `Consultancy · FinPrint · Client Intelligence Engine`; primary button **Book an assessment**.
**Header (FinPrint page variant)** — logo "FinPrint, by Wrigital"; same nav; primary button **Request a sample report**.
**Footer** — tagline *"Accountable AI for regulated firms."*; links `Consultancy · FinPrint · Client Intelligence Engine · Book an assessment`; `© Wrigital Ltd`.
> Dev note: the "Client Intelligence Engine" nav item may shorten to **"The Engine"** where space is tight.

---

### 5.1 Home — `/`

| Field | Value |
| --- | --- |
| **Purpose** | Establish positioning, explain the two ways to work with Wrigital, prove capability, funnel to assessment. |
| **Route** | `/` → `app/page.tsx` (Server Component) |
| **Layout** | Root layout → `Header` (main variant) → `main` → `Footer` |
| **Primary CTA** | **Book an assessment** (Calendly) — in header, closing prompt |
| **Secondary CTAs** | *Explore the Consultancy* → `/consultancy`; *See FinPrint* → `/client-conversion-financial-advisers` |

**Content sections (in order):**
1. **Hero** — H1 *"Accountable AI for regulated firms."*; subhead; buttons `[Explore the Consultancy] [See FinPrint]`; full‑bleed hero background image (`home-hero`).
2. **What Wrigital is** (H2) — narrative block; "documented, auditable, survives compliance scrutiny."
3. **Two ways to work with us** (H2) — two cards ("Door 1: Consultancy", "Door 2: FinPrint") each linking out.
4. **One accountable owner** (H2) — reassurance block.
5. **Proof** (H2) — "Our proof is a system we built, not a slide."
6. **Closing prompt** (H2) — "Not sure which door is yours?" + **[Book an assessment]**.

**Internal links:** `/consultancy`, `/client-conversion-financial-advisers`; CTA → Calendly.
**SEO metadata:** title `Accountable AI for regulated firms | Wrigital`; description from hero subhead; canonical `/`; OG image = home hero. `Organization` JSON‑LD in root layout.
**Animations:** hero text fade/slide‑up on load; section reveal on scroll (Framer Motion, `whileInView`, respect reduced motion).
**Responsiveness:** hero stacks; two‑door cards go 2‑col → 1‑col at `md`.
**Accessibility:** single H1; buttons are real links; hero image `alt` empty (decorative background) with text in DOM.

**Skeleton:**
```tsx
// app/page.tsx
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/marketing/Hero';
import { CtaBand } from '@/components/marketing/CtaBand';

export default function HomePage() {
  return (
    <>
      <Header variant="main" />
      <main>
        <Hero
          eyebrow=""
          title="Accountable AI for regulated firms."
          subtitle="AI you can put in front of a regulator. We advise on it, we implement it, and we document every decision inside it."
          primary={{ label: 'Explore the Consultancy', href: '/consultancy' }}
          secondary={{ label: 'See FinPrint', href: '/client-conversion-financial-advisers' }}
          image="/images/home-hero.png"
        />
        {/* What Wrigital is / Two doors / One owner / Proof */}
        <CtaBand
          title="Not sure which door is yours?"
          body="Most firms start with the consultancy assessment, then decide."
          cta={{ label: 'Book an assessment', href: process.env.NEXT_PUBLIC_CALENDLY_URL! }}
        />
      </main>
      <Footer />
    </>
  );
}
```

---

### 5.2 Consultancy — `/consultancy`

| Field | Value |
| --- | --- |
| **Purpose** | Sell the advise‑and‑implement consultancy; overcome "stall" objections; drive assessment bookings. |
| **Route** | `/consultancy` → `app/consultancy/page.tsx` |
| **Primary CTA** | **Book an assessment** (hero + closing) |

**Content sections:** Hero (H1 *"AI strategy and delivery for regulated firms."*) → Who it's for → The problem this solves → Why now (with **FCA footnote/source link**) → Why us → How we work (**4 steps**) → Three things we won't do → Questions boards and regulators ask (**FAQ accordion**, links to the Engine) → Call to action.

**Internal links:** `/client-intelligence-engine` (in FAQ), `/client-conversion-financial-advisers` (FinPrint as proof); CTA → Calendly.
**Images:** hero (`consultancy-hero`), "How we work" 4‑marker progression graphic (`consultancy-how-we-work`).
**Special:** "Why now" section renders a small linked **footnote** citing the FCA press release (21 April 2026) — render as a `<cite>`/superscript with an external link.
**SEO:** title `AI strategy & delivery for regulated firms | Wrigital`; canonical `/consultancy`. Consider `FAQPage` JSON‑LD from the "Questions boards and regulators ask" block.
**Animations:** step list staggers in; FAQ accordion animates height.
**Accessibility:** FAQ uses shadcn `Accordion` (Radix — keyboard + ARIA handled); footnote link has descriptive text.

**Skeleton (FAQ + steps):**
```tsx
<StepList
  steps={[
    { title: 'You get one accountable owner', body: '…' },
    { title: 'We start with the assessment', body: '…' },
    { title: 'We implement to a defined standard', body: '…' },
    { title: 'Then we stay', body: '…' },
  ]}
/>
<FaqAccordion
  items={[
    { q: 'How do we evidence AI decisions?', a: '…' },
    { q: 'How do we avoid black-box risk?', a: '…' },
    { q: 'How do we ensure advisers stay in control?', a: '…' },
    { q: 'Where do we start without breaking things?', a: '…' },
  ]}
  footerLink={{ label: 'See the full mechanism on the Client Intelligence Engine page', href: '/client-intelligence-engine' }}
/>
```

---

### 5.3 FinPrint — `/client-conversion-financial-advisers`

| Field | Value |
| --- | --- |
| **Purpose** | Present FinPrint (the product) and drive **Request a sample report** / **Book a discovery call**. |
| **Route** | `/client-conversion-financial-advisers` → `app/client-conversion-financial-advisers/page.tsx` |
| **Header variant** | **FinPrint** (logo "FinPrint, by Wrigital"; button **Request a sample report**) |
| **Primary CTA** | **Request a sample report**; secondary **See how the engine works** → `/client-intelligence-engine`, **Book a discovery call** (Calendly) |

**Content sections:** Full‑width Hero (H1 *"Client intelligence you can prove."*) → Built for one client, in depth → The system proposes, the adviser disposes → Every figure verified, no silent failures (links to Engine) → What each engagement produces (**bulleted deliverables list**) → Most advisers use it to win clients (**Before/During/After**) → The offer (**two‑report pack, £12,000; additional reports £500**) → Work a different niche? → See what a prospect would receive.

**Images:** full‑width hero fingerprint (`finprint-hero`), "system proposes" document graphic (`finprint-system-proposes`), "every figure verified" tick/audit graphic (`finprint-figure-verified`).
**Dev note (from copy):** keep the **two‑hour turnaround** claim (in "Every figure verified" and "The offer") **out of the same eyeline** as "Work a different niche?", so the speed promise never reads as qualified. Bespoke carries **no price** — quote on request.
**Internal links:** `/client-intelligence-engine`; CTAs → sample‑report request + Calendly.
**SEO:** title `FinPrint — client intelligence you can prove | Wrigital`; canonical to this URL; `Product`/`Offer` JSON‑LD (price £12,000 GBP) is optional but recommended.
**Animations:** hero fingerprint subtle scale/opacity; deliverables list staggered reveal.
**Accessibility:** price and offer expressed in text (not image); deliverables as a real `<ul>`.

> **"Request a sample report" flow:** simplest is a Calendly/lead form; a lightweight option is to reuse the shared `LeadCaptureModal` (from VelocityIQ) posting to a `sample-report` variant. Decide during build — see [§11](#11-developer-notes).

---

### 5.4 Client Intelligence Engine — `/client-intelligence-engine`

| Field | Value |
| --- | --- |
| **Purpose** | Explain the glass‑box architecture that underpins both FinPrint and the consultancy; convert to FinPrint or an assessment. |
| **Route** | `/client-intelligence-engine` → `app/client-intelligence-engine/page.tsx` |
| **Primary CTA** | `[See FinPrint] [Book an assessment]` (hero + closing) |

**Content sections:** Hero (H1 *"The Client Intelligence Engine."*) → Most AI is a black box → **Glass‑box, by design** (four commitments: deterministic calculation, source attribution, the number audit, the audit trail) → The system proposes, the adviser disposes → Depth comes from focus → The engine supports, the adviser determines → Built to a banking standard → See it applied, or put it to work.

**Images:** hero glass cube (`engine-hero`), "glass‑box" four‑panel clarity graphic (`engine-glass-box`).
**Internal links:** `/client-conversion-financial-advisers`; CTA → Calendly.
**SEO:** title `The Client Intelligence Engine | Wrigital`; canonical to this URL.
**Animations:** four‑commitments cards reveal on scroll; glass‑box panels animate clarity left→right (respect reduced motion).
**Accessibility:** the four commitments are a semantic list with headings.

---

### 5.5 Blog index — `/blog`

| Field | Value |
| --- | --- |
| **Purpose** | List published posts; SEO & trust. |
| **Route** | `/blog` → `app/blog/page.tsx` (Server Component, Sanity fetch) |
| **Data** | `groq` query: all `post` docs, categories dereferenced, ordered by `publishedAt desc` |

**Layout / sections:** page heading + subhead; responsive **card grid** (1/2/3 cols). Each `PostCard`: main image (`next/image` from Sanity CDN), category chips, title (2‑line clamp), description (3‑line clamp), author, read time, formatted date.
**Empty state:** "No posts found."
**SEO:** title `Blog | Wrigital`; description = blog purpose; canonical `/blog`. `Blog`/`ItemList` JSON‑LD optional.
**Responsiveness:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`.
**Accessibility:** each card is a single `<Link>` wrapping an `<article>`; images have `alt` (post `mainImage.alt` fallback to title).
**Read time:** `calculateReadTime(post.body)` (migrated util).

> Migrated near‑verbatim from `velocityiq/app/blog/page.tsx`; change the heading copy ("VelocityIQ Blog" → "Wrigital Blog") and re‑theme accent tokens.

---

### 5.6 Blog post — `/blog/[slug]`

| Field | Value |
| --- | --- |
| **Purpose** | Render a single post from Sanity Portable Text. |
| **Route** | `/blog/[slug]` → `app/blog/[slug]/page.tsx` (**dynamic**) |
| **Data** | `groq` single‑post query by `slug`, categories + approved comments; `revalidate: 60` (ISR) |

**Layout / sections:** hero image (priority) → article header (category chips, H1, author · date · read time) → **Portable Text body** via `RichText` components → CTA band ("Ready to see FinPrint / book an assessment?"). Not‑found branch renders a friendly message (or use `notFound()` → `not-found.tsx`).
**Dynamic routing:** implement `generateStaticParams()` to pre‑render known slugs; ISR revalidates.
**SEO:** implement `generateMetadata({ params })` → title = post.title, description = post.description, OG image = post.mainImage, canonical `/blog/[slug]`. Add `Article`/`BlogPosting` JSON‑LD (headline, image, datePublished, author).
**Images:** hero + inline images via `RichText` `types.image`, all through `next/image` + Sanity URL builder.
**Animations:** minimal (content‑first); optional fade‑in on hero.
**Accessibility:** single H1 = post title; body headings start at H2; `<time dateTime>` for the date.

**Metadata skeleton:**
```tsx
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await client.fetch(postBySlugQuery, { slug });
  if (!post) return {};
  return {
    title: `${post.title} | Wrigital Blog`,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.mainImage ? [urlForImage(post.mainImage)] : [],
      type: 'article',
    },
  };
}
```

---

### 5.7 UK landing page — `/uk`

| Field | Value |
| --- | --- |
| **Purpose** | LinkedIn campaign conversion (UK). Long‑form sales page + interactive exit‑tax calculator + lead‑capture email delivery. |
| **Route** | `/uk` → `app/uk/page.tsx` + `app/uk/layout.tsx` (metadata) |
| **API** | `POST /api/uk-lead-capture` → saves lead (JSONL) + sends report email (Resend) |

**Status:** **Migrated from VelocityIQ**, then **re‑branded to Wrigital/FinPrint** (copy is finalised separately per the copy doc's note). Structure: Hero → Problem → Agitation → Solution → How it works (3 steps) → Presentation (HTML slide viewer) → **Calculator** (embedded) → Who it's for → Full product → Compliance → Final CTA → footer note.
**Components:** `landing/uk/*` (SlideViewer, EmbeddedExitCalculator, Preview), `features/lead-capture/LeadCaptureModal`.
**Assets:** `content/uk-landing/slides/*.html`, `public/uk-landing/*`, sample report attachment.
**Required modifications:** replace VelocityIQ branding/voice/cyan with Wrigital tokens; update email sender/domain, Calendly URL, footer legal entity, logos; swap sample report PDF; update metadata to Wrigital.
**SEO:** page‑level `metadata` in `app/uk/layout.tsx`; `locale: en_GB`; canonical `/uk`. Campaign pages may be set `noindex` if they should not appear in organic search — decide per campaign.
**Accessibility:** calculator inputs labelled; modal is focus‑trapped (upgrade to shadcn `Dialog`).

---

### 5.8 US landing page — `/us`

Identical structure to `/uk`, migrated from `velocityiq/app/usa` and `api/us-lead-capture`. Differences: US tax parameters/calculator (QSBS eligibility etc.), `locale: en_US`, US sample report, `/api/us-lead-capture`. Re‑brand to Wrigital as with UK.

> **Route naming:** VelocityIQ used `/usa`. This blueprint standardises on **`/us`** for symmetry with `/uk`. If existing campaign links point to `/usa`, add a redirect in `next.config.ts`.

---

### 5.9 Legal — `/privacy`, `/terms`

Simple long‑form content pages under the `(legal)` route group sharing a narrow, readable layout. Linked from the footer and landing‑page footers. `metadata` per page; `noindex` optional. Content to be supplied by Wrigital; port structure from VelocityIQ's `privacy`/`terms` if reusable (re‑brand entity name).

---

## 6. Component library

Conventions: components are typed with explicit `Props`, default to **Server Components**, and add `'use client'` only when they use state/effects/handlers. Tokens are referenced via CSS variables (`var(--color-…)`) or Tailwind theme utilities.

### 6.1 `Header` (`components/layout/Header.tsx`) — client

- **Purpose:** Global navigation + primary CTA; supports a main‑site variant and a FinPrint variant.
- **Props:** `{ variant?: 'main' | 'finprint' }`.
- **Behaviour:** sticky, mobile menu toggle (`useState`), closes on nav; renders logo text ("Wrigital" / "FinPrint, by Wrigital") and CTA ("Book an assessment" / "Request a sample report"); nav item "Client Intelligence Engine" shortens to "The Engine" below `xl`.
- **Accessibility:** `aria-expanded` on the menu button, `aria-label`, focusable links, `Esc`/outside‑click close.
- **Skeleton:**
```tsx
'use client';
type HeaderProps = { variant?: 'main' | 'finprint' };
export default function Header({ variant = 'main' }: HeaderProps) {
  const cta = variant === 'finprint'
    ? { label: 'Request a sample report', href: '#request-sample' }
    : { label: 'Book an assessment', href: process.env.NEXT_PUBLIC_CALENDLY_URL! };
  // logo, nav (Consultancy · FinPrint · The Engine), mobile toggle, cta button
}
```

### 6.2 `Footer` (`components/layout/Footer.tsx`) — server

- **Purpose:** Tagline, nav links, legal line.
- **Props:** none.
- **Content:** *"Accountable AI for regulated firms."*; links `Consultancy · FinPrint · Client Intelligence Engine · Book an assessment`; `© Wrigital Ltd`.
- **Accessibility:** `<footer>` landmark; link list is a real `<ul>`.

### 6.3 `Hero` (`components/marketing/Hero.tsx`) — server (animation wrapper client)

- **Purpose:** Page hero with title, subtitle, up to two CTAs, optional background image.
- **Props:** `{ eyebrow?: string; title: string; subtitle: string; primary?: CtaLink; secondary?: CtaLink; image?: string; fullWidthImage?: boolean }`.
- **Behaviour:** renders H1; CTAs as `Button`; background image via `next/image` with overlay for contrast.
- **Accessibility:** exactly one H1 per page; decorative bg image `alt=""`.

### 6.4 `SectionLabel` (`components/marketing/SectionLabel.tsx`) — server

- **Purpose:** Small uppercase eyebrow label above section headings.
- **Props:** `{ children: ReactNode }`.
- **Style:** `text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]`.
- (Ported from VelocityIQ's inline `SectionLabel`; recolour cyan → gold accent.)

### 6.5 `Button` (`components/ui/button.tsx`) — shadcn, client‑safe

- **Purpose:** Canonical button/link. shadcn `Button` themed with Wrigital variants.
- **Props (variants):** `variant: 'primary' | 'secondary' | 'ghost'`, `size`, plus `asChild` for link usage.
- **Behaviour:** when used as a link, wrap `next/link` (internal) or `<a target="_blank" rel="noopener noreferrer">` (external/Calendly). Preserve VelocityIQ's hash‑link smooth‑scroll behaviour if needed on landing pages.
- **Accessibility:** real `<button>`/`<a>`; visible focus ring (`--focus-ring-color`).

### 6.6 `Card` / `FeatureCard` (`components/marketing/FeatureCard.tsx`) — server

- **Purpose:** Bordered content card (used for "Two doors", four commitments, "How it works" steps).
- **Props:** `{ icon?: LucideIcon; title: string; children: ReactNode; href?: string; hover?: boolean }`.
- **Style:** `bg-[var(--color-surface)] rounded-xl border p-8`, optional hover elevation.

### 6.7 `StepList` (`components/marketing/StepList.tsx`) — server (reveal client)

- **Purpose:** Ordered numbered steps ("How we work", "How it works").
- **Props:** `{ steps: { title: string; body: string }[] }`.
- **Accessibility:** semantic ordered list; numbers decorative.

### 6.8 `FaqAccordion` (`components/marketing/FaqAccordion.tsx`) — client (shadcn Accordion)

- **Purpose:** "Questions boards and regulators ask".
- **Props:** `{ items: { q: string; a: ReactNode }[]; footerLink?: CtaLink }`.
- **Behaviour:** Radix accordion (single or multiple open).
- **Accessibility:** built‑in ARIA + keyboard.

### 6.9 `CtaBand` (`components/marketing/CtaBand.tsx`) — server

- **Purpose:** Full‑width closing CTA band.
- **Props:** `{ title: string; body?: string; cta: CtaLink; secondary?: CtaLink; tone?: 'navy' | 'paper' }`.

### 6.10 `Prose` (`components/marketing/Prose.tsx`) — server

- **Purpose:** Constrain long‑form copy to a readable measure (`max-w-prose`) with brand typography.
- **Props:** `{ children: ReactNode; className?: string }`.

### 6.11 `RichText` (`components/blog/RichText.tsx`) — server

- **Purpose:** `PortableTextComponents` map for Sanity body (blocks, lists, marks, images, links).
- **Behaviour:** headings, blockquote, bullet/number lists, `strong`/`em`, internal vs external links (`rel` logic), inline images via `next/image`.
- **Migration:** ported from VelocityIQ; recolour link/blockquote accents to Wrigital gold/navy.

### 6.12 `CalloutBox` (`components/blog/CalloutBox.tsx`) — server

- **Purpose:** Highlighted note inside posts.
- **Props:** `{ type?: 'regulatory' | 'risk' | 'tip' | 'info'; children: ReactNode }`.
- **Migration:** ported; re‑map colours to Wrigital semantic tokens.

### 6.13 `PostCard` (`components/blog/PostCard.tsx`) — server

- **Purpose:** Blog index card. **Props:** `{ post: Post }`. Extracted from VelocityIQ's inline index markup for reuse/testing.

### 6.14 `LeadCaptureModal` (`features/lead-capture/LeadCaptureModal.tsx`) — client

- **Purpose:** Collect name/email/firm, POST to lead‑capture API, show confirmation + Calendly.
- **Props:** `{ isOpen: boolean; onClose: () => void; reportHtml: string; endpoint: '/api/uk-lead-capture' | '/api/us-lead-capture' }`.
- **Behaviour:** two steps (form → confirmation); `Esc`/backdrop close; focus first field.
- **Improvement over VelocityIQ:** validate with **Zod** (`leadSchema`) shared with the API; rebuild on shadcn `Dialog` for focus‑trap + ARIA.
- **Accessibility:** `role="dialog"`, `aria-modal`, labelled inputs, error `role="alert"`.

### Landing feature components (migrated 1:1, re‑themed)

`landing/uk/*` and `landing/us/*`: `SlideViewer` (renders static HTML decks), `EmbeddedExitCalculator` / calculator core, `ExitPreview`. These carry the exit‑tax logic in `lib/{uk,us}-landing/*` (calculation, methodology, narrative rules, tax parameters, render, save/send). Port verbatim; only branding, email, and Calendly change.

---

## 7. Routing

### App Router structure

| Route | File | Rendering | Notes |
| --- | --- | --- | --- |
| `/` | `app/page.tsx` | Static | Home |
| `/consultancy` | `app/consultancy/page.tsx` | Static | |
| `/client-conversion-financial-advisers` | `.../page.tsx` | Static | FinPrint (header variant) |
| `/client-intelligence-engine` | `.../page.tsx` | Static | |
| `/blog` | `app/blog/page.tsx` | Dynamic/ISR | Sanity list |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | ISR + `generateStaticParams` | Post |
| `/uk` | `app/uk/page.tsx` (+ `layout.tsx`) | Static (client islands) | Campaign |
| `/us` | `app/us/page.tsx` (+ `layout.tsx`) | Static (client islands) | Campaign |
| `/privacy`, `/terms` | `app/(legal)/…/page.tsx` | Static | Route group |
| `POST /api/uk-lead-capture` | `app/api/uk-lead-capture/route.ts` | Node runtime | Lead + email |
| `POST /api/us-lead-capture` | `app/api/us-lead-capture/route.ts` | Node runtime | Lead + email |
| `POST /api/createComment` | `app/api/createComment/route.ts` | Node runtime | Optional, flag‑gated |

### Nested layouts

- **Root layout** (`app/layout.tsx`): `<html lang="en-GB">`, fonts, global CSS, `Organization` JSON‑LD. Wraps everything.
- **Landing layouts** (`app/uk/layout.tsx`, `app/us/layout.tsx`): page‑specific `metadata` (title/description/OG/canonical/locale). They render `children` unchanged (VelocityIQ pattern).
- **`(legal)` layout**: shared narrow reading container for privacy/terms.

### Dynamic routes

- `blog/[slug]` — `generateStaticParams()` returns known slugs; `generateMetadata()` per post; ISR via `revalidate`.

### Route groups

- `(legal)` groups legal pages under a shared layout **without** adding a URL segment.

### Loading, error, not‑found

- `app/blog/loading.tsx` — skeleton grid while posts fetch.
- `app/blog/[slug]/loading.tsx` — article skeleton.
- `app/error.tsx` (client) — global error boundary with retry.
- `app/blog/[slug]/not-found.tsx` — post‑specific 404 (call `notFound()` when a slug misses).
- `app/not-found.tsx` — global 404 with header/footer + link home.

**Skeletons:**
```tsx
// app/blog/loading.tsx
export default function Loading() {
  return <div className="mx-auto max-w-7xl px-6 py-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="h-80 animate-pulse rounded-lg bg-[var(--color-surface)]" />
    ))}
  </div>;
}
```
```tsx
// app/not-found.tsx
import Link from 'next/link';
export default function NotFound() {
  return <main className="mx-auto max-w-2xl px-6 py-24 text-center">
    <h1 className="text-4xl font-bold">Page not found</h1>
    <p className="mt-4 text-[var(--color-text-secondary)]">The page you’re looking for doesn’t exist.</p>
    <Link href="/" className="mt-8 inline-block underline">Return home</Link>
  </main>;
}
```

---

## 8. Styling standards

### 8.1 Approach

Tailwind CSS **v4**, configured in `app/globals.css`. Brand tokens are CSS custom properties on `:root`, exposed to Tailwind via `@theme inline`. This mirrors VelocityIQ exactly — the only change is the **token values** (Wrigital palette).

### 8.2 Brand tokens (`app/globals.css`)

> Wrigital palette derived from the copy's described language — *ink navy, warm paper / off‑white, one restrained gold/brass accent, slate* — using VelocityIQ's token architecture as the structural guide. If `wrigital_master_brand.docx` / `finprint_blueprint.docx` provide exact hex values, replace these and note the change here.

```css
@import 'tailwindcss';

:root {
  /* Brand & surfaces */
  --color-bg: #faf7f0;            /* warm paper / off-white */
  --color-surface: #f3ede1;       /* deeper warm paper for section banding */
  --color-primary: #0a2342;       /* ink navy */
  --color-primary-soft: #14315c;  /* navy tint for gradients */

  /* Accent (restrained gold / brass) */
  --color-accent: #b08d57;
  --color-accent-strong: #9a763f;

  /* Text */
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #475569; /* slate */
  --color-text-inverse: #faf7f0;

  /* CTAs */
  --color-cta-primary: #0a2342;    /* navy button */
  --color-on-cta: #faf7f0;
  --color-cta-hover: #14315c;      /* navy hover (NOT cyan) */

  /* Semantic (blog callouts / validation) */
  --color-critical: #b3261e;
  --color-warning: #b8860b;
  --color-success: #2e7d5b;
  --color-info: #3b6ea5;

  /* Borders */
  --color-border-subtle: #e4dcce;
  --color-border-strong: #475569;

  /* Typography */
  --font-serif: Georgia, 'Times New Roman', serif;          /* editorial headings (optional) */
  --font-sans: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, monospace;

  /* Spacing scale */
  --space-2: 0.5rem;  --space-4: 1rem;  --space-8: 2rem;
  --space-12: 3rem;   --space-16: 4rem; --space-24: 6rem;

  /* Radius */
  --radius-sm: 0.25rem; --radius-lg: 0.5rem; --radius-xl: 0.75rem;

  /* Elevation */
  --shadow-card: 0 1px 3px rgba(10,35,66,.08), 0 1px 2px rgba(10,35,66,.05);
  --shadow-overlay: 0 10px 15px -3px rgba(10,35,66,.10), 0 4px 6px -2px rgba(10,35,66,.05);

  /* Focus */
  --focus-ring-color: #b08d57;
  --hover-bg-subtle: #f3ede1;
}

@theme inline {
  --color-background: var(--color-bg);
  --color-foreground: var(--color-text-primary);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
}

body {
  background: var(--color-bg);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  line-height: 1.6;
}

/* Focus states */
*:focus-visible { outline: 2px solid var(--focus-ring-color); outline-offset: 2px; }

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
}
```

### 8.3 Typography scale

| Element | Size / weight | Line height |
| --- | --- | --- |
| H1 | `3rem` (48px) / 700 | 1.2 |
| H2 | `2.25rem` (36px) / 600 | 1.3 |
| H3 | `1.75rem` (28px) / 600 | 1.3 |
| H4 | `1.25rem` (20px) / 600 | 1.4 |
| Body | `1.125rem` (18px) / 400 | 1.6 |
| Small / eyebrow | `0.75rem` (12px) / 600, uppercase, tracked | 1.4 |

Headings may use a serif (`--font-serif`) for editorial feel; body stays sans. Prose measure capped at `65ch` / `max-w-prose`.

### 8.4 Colour usage rules

- **Navy** = primary structure, headings on paper, buttons, dark bands.
- **Paper/off‑white** = default page background; **surface** for alternating section bands.
- **Gold** = *restrained* accent only — eyebrow labels, small rules, single focal highlights, hover underlines. **Never** large fills. This replaces every VelocityIQ cyan usage.
- **Slate** = secondary text.
- Maintain WCAG AA contrast: navy text on paper and paper text on navy both pass.

### 8.5 Spacing & layout

- Section vertical rhythm: `py-20` (mobile‑adjust `py-16`).
- Content containers: `max-w-7xl` (grids), `max-w-4xl` (feature sections), `max-w-3xl`/`max-w-prose` (long copy), all `mx-auto px-6`.
- Use the spacing scale tokens for custom gaps.

### 8.6 Component variants

- **Button:** `primary` (navy fill), `secondary` (navy outline → fill on hover), `ghost` (text + gold underline on hover).
- **Card:** `default` (paper surface, subtle border), `hover` (elevate + gold border), `feature` (icon + heading + body).
- **CtaBand:** `navy` (inverse text) / `paper`.

### 8.7 Responsive breakpoints (Tailwind defaults)

| Token | Min width | Typical use |
| --- | --- | --- |
| `sm` | 640px | 1→2 col grids, show inline separators |
| `md` | 768px | two‑door cards 2‑col, nav breakpoints |
| `lg` | 1024px | full desktop nav, 3‑col grids |
| `xl` | 1280px | expanded nav labels ("Client Intelligence Engine") |
| `2xl` | 1536px | max container comfort |

---

## 9. SEO strategy

### 9.1 Metadata (App Router native)

- **Root** `metadata` in `app/layout.tsx`: `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL)`, default title template `%s | Wrigital`, description, `robots: { index: true, follow: true }`, icons, manifest.
- **Per page:** export `metadata` (static pages) or `generateMetadata` (blog posts). Each sets `title`, `description`, `alternates.canonical`, and `openGraph`.

```tsx
// app/layout.tsx (excerpt)
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wrigital.com'),
  title: { default: 'Accountable AI for regulated firms', template: '%s | Wrigital' },
  description: 'AI you can put in front of a regulator. We advise, implement, and document every decision.',
  robots: { index: true, follow: true },
};
```

### 9.2 Open Graph & social

- Provide `app/opengraph-image.tsx` (default) and per‑page OG images (blog posts use `mainImage`). Add `twitter` card metadata (summary_large_image).

### 9.3 Structured data (JSON‑LD)

| Page | Schema |
| --- | --- |
| Root layout | `Organization` (name "Wrigital Ltd", url, logo, contactPoint) |
| Home | `WebSite` (+ optional `SearchAction`) |
| Consultancy | `FAQPage` (from the boards/regulators Q&A) |
| FinPrint | `Product` + `Offer` (£12,000 GBP two‑report pack) — optional |
| Blog post | `BlogPosting`/`Article` (headline, image, datePublished, author) |

Inject via `<script type="application/ld+json">` with `JSON.stringify` (VelocityIQ pattern in root layout).

### 9.4 Sitemap, robots, canonical

- **Sitemap:** `app/sitemap.ts` (dynamic — include static routes + all blog slugs from Sanity) **or** `next-sitemap` postbuild. Prefer `app/sitemap.ts` for freshness.
- **Robots:** `app/robots.ts` allowing all, pointing to the sitemap; optionally `disallow` `/uk` `/us` if campaign pages should be excluded.
- **Canonical:** every page sets `alternates.canonical`.

```ts
// app/sitemap.ts
import type { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wrigital.com';
  const slugs: { slug: string }[] = await client.fetch(
    groq`*[_type=="post" && defined(slug.current)]{ "slug": slug.current }`
  );
  const staticRoutes = ['', '/consultancy', '/client-conversion-financial-advisers', '/client-intelligence-engine', '/blog'];
  return [
    ...staticRoutes.map((r) => ({ url: `${base}${r}`, changeFrequency: 'monthly' as const, priority: r === '' ? 1 : 0.8 })),
    ...slugs.map((s) => ({ url: `${base}/blog/${s.slug}`, changeFrequency: 'weekly' as const, priority: 0.6 })),
  ];
}
```

### 9.5 Schema recommendations summary

Prioritise `Organization` + `BlogPosting` (highest ROI). Add `FAQPage` on Consultancy for rich results. Keep JSON‑LD in sync with visible content (Google requirement).

---

## 10. Performance

Target: **green Core Web Vitals** (LCP < 2.5s, CLS < 0.1, INP < 200ms).

- **Images:** always `next/image`. Sanity images through `urlForImage(...).auto('format').fit('max')`; local marketing images pre‑sized to their layout. Set `priority` only on the LCP hero; everything else lazy‑loads by default. Provide `alt` text; use `sizes` for responsive art direction.
- **Lazy loading:** heavy client islands (calculators, slide viewer, lead modal) load only where used; consider `next/dynamic` with `ssr:false` for the calculator to keep server HTML lean.
- **Code splitting:** keep pages as Server Components; push interactivity into small `'use client'` leaves. Avoid importing `resend`/`fs` into client bundles (server‑only in `lib/` + `serverExternalPackages`).
- **Caching / ISR:** blog uses `revalidate` (e.g. 60s) + `generateStaticParams`. Static marketing pages are fully static. Sanity client uses `useCdn: true`.
- **Fonts:** prefer `next/font` (self‑hosted, `display: swap`) if a brand webfont is chosen; otherwise the system font stack (zero network cost) already in tokens.
- **Third‑party scripts:** load analytics with `next/script` `strategy="afterInteractive"` (or use `@vercel/analytics`), never render‑blocking.
- **Animations:** Framer Motion transforms/opacity only (GPU‑friendly); gate with `prefers-reduced-motion`; avoid layout‑shifting animations (protect CLS).
- **Bundle hygiene:** import icons individually from `lucide-react`; avoid large date libs (use `Intl.DateTimeFormat`).

---

## 11. Developer notes

### Common pitfalls
- **Do not leak server code to the client.** `fs`, `resend`, Sanity write tokens, and `lib/*-landing/save*`/`send*` are server‑only. Keep them out of `'use client'` files and route them through `app/api/*`.
- **UK spelling** in all copy and user‑facing strings ("optimise", "personalised").
- **Gold is an accent, not a theme.** A frequent mistake when migrating VelocityIQ is to swap cyan → gold 1:1 on large surfaces. Use navy/paper for mass, gold sparingly.
- **FinPrint copy adjacency rule:** keep the two‑hour turnaround claim away from "Work a different niche?" (see [§5.3](#53-finprint--client-conversion-financial-advisers)).
- **`await params`** in Next 15/16 — route `params` is a Promise; always `await` it (as VelocityIQ does).
- **Metadata base** must be set or OG/canonical URLs resolve relative and break.

### Reusable utilities
- `lib/utils/readTime.ts` — read‑time from Portable Text blocks (migrated).
- `lib/email/resendClient.ts` — single Resend instance + template interpolation helper (`{{firstName}}`) extracted from VelocityIQ's send helpers.
- `features/lead-capture/leadSchema.ts` — Zod schema `{ name, email, firmName }` reused by form + both API routes.
- `hooks/useReducedMotion.ts`, `hooks/useLockScroll.ts` — for modal/animation hygiene.

### Coding & naming conventions
- **Components:** `PascalCase` files and exports. **Hooks:** `useX`. **Utils/libs:** `camelCase`. **Routes/folders:** `kebab-case` (matches URL).
- Server Components by default; `'use client'` only when needed, at the smallest leaf.
- Co‑locate feature logic under `features/`; keep `lib/` pure/integration‑only.
- Reference colours via tokens (`var(--color-…)`), never hard‑coded hex in components (the landing pages are the migration exception — clean these during re‑brand).
- One default export per component file; named exports for helpers.

### Testing recommendations
- **Vitest** unit tests for: `readTime`, Zod `leadSchema`, and any ported calculator/validation logic (VelocityIQ ships `lib/validation` + calculator tests — port them).
- **Playwright** e2e for the critical path: open UK page → run calculator → submit lead modal → assert confirmation (mock Resend).
- Type‑check + lint in CI; block deploy on failures.

### Future expansion points
- **New niches:** the IA generalises — add niche‑specific FinPrint variants or landing pages without touching core components.
- **New main‑site pages:** drop a folder under `app/` + add to nav + sitemap.
- **CMS‑driven marketing:** the marketing pages could later be driven by Sanity (currently hard‑coded copy) — the `RichText`/Portable Text plumbing already exists.
- **"Request a sample report"** could evolve from a Calendly link into a full gated flow reusing `LeadCaptureModal`.

---

## 12. Image asset workflow

Every marketing page in [§5](#5-page-specifications) requires one or more images. The copy document supplies **Midjourney prompts** (no text/letters/logos/UI in any image; `--ar 16:9`; editorial, ink‑navy + warm‑paper + single gold accent).

**Process (must be followed in order, one image at a time):**
1. Present the image prompt to the user.
2. **Do not continue past an image until it has been generated.**
3. Save the generated asset into the correct project directory (`public/images/`).
4. Record the filename and path in the **asset register** below.
5. Continue to the next required image.

**Consistency rules applied to every prompt (house style):**
- **Save location:** all files render to `wrigital/public/images/` and are referenced in code as `/images/<filename>`.
- **Format / size:** PNG, **16:9** aspect ratio. Delivered at Midjourney's native 1456×816 export (any 16:9 size is fine — `next/image` scales responsively).
- **Palette (locked across all eight):** ink navy + warm paper / off‑white + **one** restrained gold/brass accent (+ slate for illustrations).
- **Technical flags:** `--ar 16:9`, `--v 7`; `--style raw` on the two photographic images (Home hero, Engine hero) and the Consultancy hero; `--stylize` tuned per image (lower for flat diagrams, higher for photography).
- **Exclusions (`--no`):** no text/letters/words/numbers/logos/watermark/signage/UI in any image; illustrations also exclude glow/gradients; the "verified" and Engine images additionally exclude circuitry/neural networks/robots/brains.

> **Workflow status:** ✅ **All 8 images generated and saved** to `wrigital/public/images/` at 1456×816 (16:9). Prompts below are the optimised versions used. Image #5 was originally saved as `system-proposes.png` and **renamed to `finprint-system-proposes.png`** to keep the `finprint-` prefix consistent with its siblings and match the code references (`/images/finprint-system-proposes.png`).

### Asset register

| # | Page | Section / purpose | Filename (save as) | Relative path | Dimensions | Status | Optimised prompt (Midjourney) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Home | Hero background — premium boutique advisory interior, golden hour, no people | `home-hero.png` | `public/images/home-hero.png` | 1456×816 (16:9) | ✅ done | *A quiet, premium boutique advisory interior at soft golden hour, deep navy walls and warm paper-toned furnishings, a single brass detail catching the light, clean architectural lines, no people, calm and authoritative mood, muted palette of ink navy and warm off-white with one restrained gold accent, generous negative space, editorial interior photography, natural directional light, medium-format look, shallow depth of field --ar 16:9 --style raw --stylize 150 --v 7 --no text, letters, words, logos, watermark, signage, UI, people* |
| 2 | Consultancy | Hero — single considered figure at a calm premium desk, soft profile | `consultancy-hero.png` | `public/images/consultancy-hero.png` | 1456×816 (16:9) | ✅ done | *A single considered figure at a calm premium desk seen in soft profile, deep navy and warm paper tones, one brass lamp accent, architectural and understated, quiet authoritative mood, no visible screens, generous negative space, editorial photography, natural directional light, medium-format look, shallow depth of field --ar 16:9 --style raw --stylize 150 --v 7 --no text, letters, words, logos, watermark, signage, UI* |
| 3 | Consultancy | "How we work" — four evenly spaced abstract markers rising in tone | `consultancy-how-we-work.png` | `public/images/consultancy-how-we-work.png` | 1456×816 (16:9) | ✅ done | *A calm horizontal sequence of four evenly spaced abstract markers rising in tone from left to right, clean minimal geometry in ink navy, a single fine gold line tracing the progression, warm paper background, flat and precise, architectural, generous negative space, editorial vector illustration --ar 16:9 --stylize 80 --v 7 --no text, letters, words, numbers, logos, watermark, UI, gradients, glow* |
| 4 | FinPrint | Hero (full width) — minimal abstracted fingerprint, gold focal core | `finprint-hero.png` | `public/images/finprint-hero.png` | 1456×816 (16:9) | ✅ done | *A minimal abstracted fingerprint formed from a few concentric ridge lines, its core resolving into a single warm focal point, deep ink navy ridges on warm paper, one refined gold accent at the centre, elegant and precise, quietly premium, generous negative space, flat editorial illustration --ar 16:9 --stylize 100 --v 7 --no text, letters, words, logos, watermark, UI, glow* |
| 5 | FinPrint | "The system proposes" — one document block lifted/chosen | `finprint-system-proposes.png` | `public/images/finprint-system-proposes.png` | 1456×816 (16:9) | ✅ done | *An abstract of a single clean document with generous margins and a few evenly spaced blocks, one block lifted and set apart as if selected, ink navy and slate on warm paper, one gold edge on the chosen block, calm and precise, flat editorial illustration, generous negative space --ar 16:9 --stylize 80 --v 7 --no text, letters, words, numbers, logos, watermark, UI, glow* |
| 6 | FinPrint | "Every figure verified" — single value confirmed by a precise tick, audit lines | `finprint-figure-verified.png` | `public/images/finprint-figure-verified.png` | 1456×816 (16:9) | ✅ done | *An abstract of a single value confirmed by a small precise tick sitting above evenly ruled horizontal lines suggesting an audit trail, ink navy with one gold accent on warm paper, minimal and exact, flat editorial illustration, generous negative space --ar 16:9 --stylize 80 --v 7 --no circuitry, neural networks, robots, glow, text, letters, words, numbers, logos, watermark, UI* |
| 7 | Client Intelligence Engine | Hero — transparent glass cube holding an ordered lattice, gold edge | `engine-hero.png` | `public/images/engine-hero.png` | 1456×816 (16:9) | ✅ done | *An abstract transparent glass cube holding a fine ordered lattice of thin lines and points, light passing through it and catching one gold edge, set on warm paper against ink navy, calm precise and premium, studio lighting, generous negative space, editorial product photography --ar 16:9 --style raw --stylize 120 --v 7 --no circuitry, neural networks, robots, brains, glow, text, letters, words, logos, watermark, UI* |
| 8 | Client Intelligence Engine | "Glass-box" — four vertical panels of increasing clarity | `engine-glass-box.png` | `public/images/engine-glass-box.png` | 1456×816 (16:9) | ✅ done | *Four clean vertical panels of increasing clarity from left to right, the leftmost opaque and the last fully transparent revealing ordered structure within, ink navy and slate on warm paper, a single gold accent, flat and architectural, generous negative space, editorial illustration --ar 16:9 --stylize 80 --v 7 --no text, letters, words, numbers, logos, watermark, UI, glow* |

> The two campaign landing pages (`/uk`, `/us`) reuse migrated static assets (slide decks, sample reports) rather than new hero art; add rows here if new Wrigital‑branded landing imagery is commissioned.

---

## 13. Migration notes

How existing VelocityIQ functionality maps into Wrigital.

### 13.1 Reused (copy near‑verbatim, re‑theme tokens only)

| VelocityIQ source | Wrigital target | Change required |
| --- | --- | --- |
| `app/blog/page.tsx` | `app/blog/page.tsx` | Heading copy "VelocityIQ Blog" → "Wrigital Blog"; accent tokens |
| `app/blog/[slug]/page.tsx` | same | CTA copy → Wrigital ("Book an assessment"/"See FinPrint"); add `generateMetadata` + JSON‑LD + `generateStaticParams` |
| `components/blog/RichText.tsx` | `components/blog/RichText.tsx` | Recolour link/blockquote accents (cyan → gold/navy) |
| `components/blog/CalloutBox.tsx` | `components/blog/CalloutBox.tsx` | Map colours to Wrigital semantic tokens |
| `sanity/**` (client, image, env, schema, schemaTypes) | `sanity/**` | New `projectId`/`dataset`; `authorName` initialValue → Wrigital |
| `typings.d.ts` | `types/index.d.ts` | None (content model identical) |
| `utils/readTime.ts` | `lib/utils/readTime.ts` | None |
| `lib/uk-landing/**`, `lib/usa-landing/**` | `lib/uk-landing/**`, `lib/us-landing/**` | Email sender/domain, Calendly URL, sample report path, brand strings |
| `app/api/uk-lead-capture`, `us-lead-capture` | `app/api/uk-lead-capture`, `us-lead-capture` | Validate with Zod; brand error strings/contact email |
| `components/uk-landing/**`, `usa-landing/**` | `components/landing/uk/**`, `us/**` | Re‑brand palette/voice; upgrade modal to shadcn `Dialog` |
| `content/uk-landing/**`, `usa-landing/**` slides | `content/uk-landing/**`, `us-landing/**` | Re‑brand slide HTML |
| `next.config.ts` (images/turbopack) | `next.config.ts` | Drop html2pdf externals unless PDF export ported |

### 13.2 Reused layouts / patterns

- **Root layout pattern** (fonts, global CSS, JSON‑LD) → adapt with Wrigital `Organization` data and `lang="en-GB"`.
- **Landing `layout.tsx` metadata pattern** → reused for `/uk` and `/us`.
- **CSS‑variable token architecture** (`:root` + `@theme inline`) → reused with Wrigital values.

### 13.3 Pages copied directly (then re‑branded)

- `/uk` (from `app/uk`) and `/us` (from `app/usa`) — full sales pages + calculators + lead capture. Logic copied 1:1; branding/email/Calendly/sample‑report swapped. **Note the `/usa` → `/us` route rename** (add redirect if needed).
- Blog index + post.

### 13.4 Pages requiring (re)design — new to Wrigital

These have **no VelocityIQ equivalent** and are built fresh from the copy doc:
- **Home** (`/`)
- **Consultancy** (`/consultancy`)
- **FinPrint** (`/client-conversion-financial-advisers`)
- **Client Intelligence Engine** (`/client-intelligence-engine`)

They reuse the new marketing component library ([§6](#6-component-library)) and the migrated `Header`/`Footer` (re‑built for Wrigital nav/variants).

### 13.5 Deprecated / not migrated

| VelocityIQ item | Reason |
| --- | --- |
| `@clerk/nextjs` + `app/(authenticated)`, `app/uk/sign-in`, `app/exit-snapshot/sign-in` | No authenticated area in Wrigital spec |
| `app/exit-snapshot`, `components/exit-snapshot/**`, `lib/exit-snapshot/**` | Standalone gated calculator not in Wrigital IA (calculator lives embedded in `/uk`, `/us` only) |
| VelocityIQ marketing pages (`/suitability`, `/risk-defense`, `/risk-assessment`, `/platform`, `/how-it-works`, `/personalized-reports`, `/demo`, `/system-demo`, `/book`, `/risk-defense`) | Superseded by Wrigital's four‑page IA |
| `html2pdf.js` / PDF export deps | Only needed if snapshot PDF export is ported; otherwise drop |
| `app/api/feedback`, `app/api/submit-application` | Not in Wrigital scope (add back only if required) |
| VelocityIQ cyan accent, logos, "VelocityIQ" naming, footer legal copy | Replaced by Wrigital brand + `© Wrigital Ltd` |

### 13.6 New functionality (not in VelocityIQ)

- **shadcn/ui** primitive layer + accessible `Dialog`/`Accordion`/`Tabs`.
- **Framer Motion** brand animations.
- **Zod** shared validation (form + API).
- **Header variants** (main vs FinPrint) + nav shortening ("The Engine").
- **App Router SEO**: `generateMetadata`, `sitemap.ts`, `robots.ts`, JSON‑LD per page, `FAQPage`/`BlogPosting`.
- **`(legal)` route group**, `loading`/`error`/`not-found` conventions.
- **Four new marketing pages** with the Wrigital "glass‑box / accountable AI" narrative.

---

## Appendix A — Sanity blog data model (migrated)

| Type | Fields |
| --- | --- |
| `post` | `title` (string, req), `slug` (slug from title, req), `description` (string, req), `authorName` (string, req; default → Wrigital author), `mainImage` (image + `alt`, hotspot), `categories` (array of ref → category), `publishedAt` (datetime, req), `body` (blockContent, req) |
| `category` | `title` (string, req), `description` (text) |
| `comment` | `name`, `email`, `comment`, `post` (ref), `approved` (bool) — flag‑gated via `NEXT_PUBLIC_ENABLE_COMMENTS` |
| `blockContent` | Portable Text: styles normal/h1–h4/blockquote; bullet+number lists; strong/em; link annotation; inline image + `alt` |

**Content type (`types/index.d.ts`):** `Base`, `Span`, `Block`, `Reference`, `Image`, `Slug`, `Category`, `Comment`, `Post` (identical to VelocityIQ `typings.d.ts`).

**GROQ queries:**
```ts
// blog index
const postsQuery = groq`*[_type == "post"]{ ..., categories[]-> } | order(publishedAt desc)`;
// single post
const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0]{
  ..., categories[]->,
  "comments": *[_type == "comment" && post._ref == ^._id && approved == true]
}`;
```

## Appendix B — Lead capture flow (migrated)

```
UK/US landing page
  └─ user runs embedded exit calculator  → produces reportHtml
       └─ LeadCaptureModal (name, email, firmName)  [Zod-validated]
            └─ POST /api/{uk|us}-lead-capture
                 ├─ validate (503 if no RESEND_API_KEY, 400 on bad input)
                 ├─ saveLead()      → append data/{uk|us}-leads.jsonl
                 └─ sendLeadReportEmail() (Resend)
                       ├─ attach exit-tax-calculation report (HTML)
                       └─ attach sample intelligence report (PDF)
            └─ confirmation step → Book a discovery call (Calendly)
```

Env required: `RESEND_API_KEY`; optional `*_LEADS_FILE`, `*_LEAD_EMAIL_SUBJECT/HTML`, `US_SAMPLE_REPORT_PATH`.

---

*End of blueprint. Update the asset register in [§12](#12-image-asset-workflow) as images are produced, and replace the [§8](#8-styling-standards) palette hex values if the brand documents specify exact colours.*
