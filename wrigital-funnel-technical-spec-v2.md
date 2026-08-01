# Wrigital Funnel: Technical Specification v2.0

**Supersedes:** v1.0 (four page funnel). Discard v1.0.
**Copy source of truth:** `wrigital-funnel-copy-v4.md`
**Date:** 1 August 2026
**Status:** build ready

---

## 0. How to use this document

The copy document is authoritative for **words**. This document is authoritative for **everything else**: routing, stack, design tokens, components, state, API contracts, email, metadata, analytics and acceptance criteria.

Six rules that govern the whole build:

1. **Copy is verbatim.** Every heading, paragraph, button label and small line is transcribed exactly as written in `wrigital-funnel-copy-v4.md`. Do not rewrite, tighten, correct, re-order or paraphrase a single sentence. Where the copy document sets a word in bold, that bold is rendered.
2. **No em dashes** anywhere in rendered output.
3. **Seven pages, one forward CTA per page.** No page gains a second forward CTA. The tab bar and the footer are the only other exits.
4. **The funnel is a self-contained mini site under `/RAG_Offer`.** Route names from the copy document are preserved exactly and sit beneath that prefix, so `/website-figure-check` in the copy document is built at `/RAG_Offer/website-figure-check`. The funnel never renders the main website header or navigation, and the tab bar never links to a main website page.
5. **Two builds already exist and are integrated, never rebuilt:** the figure check at `app/website-figure-check`, and the unverified answers wizard at `/unverified-answers-count`. Section 9 defines the interface each must expose. If an existing API returns a different shape from the contracts here, write a thin adapter rather than editing working code.
6. **Where this document gives a value,** a hex code, a rate limit, a class list, use that value. Nothing here is a suggestion.

---

## 1. The chain

| # | Route | Job | Forward CTA label | Goes to |
|---|---|---|---|---|
| 1 | `/RAG_Offer/website-figure-check` | Lead magnet. Capture the email. | `How I stop hallucinations →` | 3 |
| 2 | `/RAG_Offer/thank-you` | Confirm, then hand off. | `How I stop hallucinations →` | 3 |
| 3 | `/RAG_Offer/how-i-stop-hallucinations` | Prove the method. | `Watch it working →` | 4 |
| 4 | `/RAG_Offer/see-it-working` | The four minute video. | `See what's included →` | 5 |
| 5 | `/RAG_Offer/features` | What you get. | `Check the verified answers →` | 6 |
| 6 | `/RAG_Offer/verified-answers` | Count their own unverified answers. | `Book a call →` | 7 |
| 7 | `/RAG_Offer/book-a-call` | The full stack, then the booking. | Calendly embed | out |

Page 1 reaches page 2 by redirect after a successful email send, not by a CTA. Page 1's own forward CTA goes to page 3, so a visitor who does not hand over an email still moves down the chain.

`/RAG_Offer/privacy` exists, is linked from the footer only, and is not part of the chain.

---

## 2. Stack

| Concern | Decision |
|---|---|
| Framework | Next.js 15, App Router, React 19, TypeScript strict |
| Styling | Tailwind CSS v4, CSS-first config via `@theme` |
| Fonts | `next/font/google`, self-hosted at build |
| Hosting | Vercel |
| Email | Resend + React Email |
| Store | Upstash Redis (REST), 24 hour TTL on check results and wizard results |
| Validation | Zod |
| Analytics | Vercel Analytics, custom events via `track()` |
| Video | `lite-youtube-embed` facade |
| Calendly | Inline embed on page 7 only, loaded on intersection |
| IDs | `nanoid` |

No CMS, no component library, no animation library. Motion is CSS only.

```bash
npm i zod nanoid resend @react-email/components @upstash/redis @upstash/ratelimit lite-youtube-embed @vercel/analytics
```

---

## 3. Project structure

```
src/
  app/
    RAG_Offer/
      layout.tsx                        funnel shell: TabBar + SiteFooter
      website-figure-check/page.tsx     1
      thank-you/page.tsx                2
      how-i-stop-hallucinations/page.tsx 3
      see-it-working/page.tsx           4
      features/page.tsx                 5
      verified-answers/page.tsx         6
      book-a-call/page.tsx              7
      privacy/page.tsx
      [route]/opengraph-image.tsx       one per page, section 13
    api/
      check/route.ts
      check/report/route.ts
      wizard/report/route.ts
  components/
    funnel/
      TabBar.tsx
      SiteFooter.tsx
      Section.tsx
      Prose.tsx
      ForwardCta.tsx
      SourceMark.tsx
      VideoEmbed.tsx
      CalendlyEmbed.tsx
      Photo.tsx
      FigureCheck/
        index.tsx
        FigureCheckProvider.tsx
        CheckForm.tsx
        CheckProgress.tsx
        CheckResult.tsx
        CountsPanel.tsx
        FindingRow.tsx
        ReportCapture.tsx
      wizard/
        WizardBlock.tsx                 intro, existing wizard, result, capture
  emails/
    FigureCheckRecord.tsx
    WizardReport.tsx
    InternalAlert.tsx
  lib/
    site.ts  kv.ts  ratelimit.ts  analytics.ts
    check-types.ts  check-adapter.ts
    wizard-types.ts
  content/
    copy.ts                             all long-form copy, section 4.3
```

---

## 4. Copy handling

### 4.1 The transcription rule

Every string rendered to a visitor comes from `wrigital-funnel-copy-v4.md`. The developer's job is transcription, not authoring. Where the copy document describes a mechanism in plain instruction rather than quoting copy, for example "Repeat the input field and button here", that instruction is implemented and nothing is written to accompany it.

### 4.2 Bracketed tokens

The copy document uses square brackets for runtime values. These are the only interpolations:

| Token | Source |
|---|---|
| `[email]` | `sessionStorage` key `wrigital:lastEmail`, fallback `your inbox` |
| `[domain]` | `searchParams.domain`, fallback `your site` |
| `[date]` | `finishedAt`, formatted `en-GB`, e.g. `1 August 2026` |
| `[pages]` `[figures]` `[confirmed]` `[stale]` | `CheckResult` counts |
| `[n]` | wizard result count |

Interpolation is positional. Nothing else about the surrounding sentence changes.

### 4.3 Where copy lives

Long-form copy is transcribed into `src/content/copy.ts` as typed, exported constants, one export per copy document section, and rendered through `<Prose>`. Pages import from that file rather than holding inline JSX prose. One file to proofread against the source, and a diff on that file is a copy change that needs review.

```ts
// src/content/copy.ts  (shape)
export const CHECK_HERO = {
  h1: "Generic AI asks your firm to accept its standards. I build to yours.",
  sub: "Verified AI systems for UK FCA-regulated advice firms. Every claim carries a citation, every citation is checked, and every source opens when you click it.",
} as const;

export const CHECK_FORM = {
  lead: "**Start with your own website.** Enter your firm's address. I read your public pages, find every allowance and threshold quoted in the copy, and compare each one against the current published value. Under a minute, nothing to install.",
  button: "Check my site",
  small: "Free. No account. The findings appear on screen.",
} as const;
```

Bold is carried as `**` and rendered by a minimal inline formatter in `<Prose>` that handles bold and italic only. No markdown library, no HTML in strings.

**Acceptance test.** A script `scripts/verify-copy.ts` extracts every blockquoted line from `wrigital-funnel-copy-v4.md`, strips markdown, and asserts each appears in `src/content/copy.ts`. CI fails on a miss. This is what stops copy drifting during the build.

---

## 5. Design system

Unchanged from v1.0. It is settled and no page in v4 needs anything it does not already provide.

### 5.1 Colour

| Token | Hex | Used for |
|---|---|---|
| `--color-ink` | `#0E1A26` | primary text, dark section backgrounds |
| `--color-ink-soft` | `#46586A` | secondary text, captions, mono labels |
| `--color-paper` | `#F6F7F8` | page background |
| `--color-card` | `#FFFFFF` | panels, finding rows, video frame |
| `--color-rule` | `#D9DEE3` | hairlines, borders, dividers |
| `--color-source` | `#1740A6` | links, source marks, primary buttons, active tab |
| `--color-verified` | `#146B52` | confirmed figures only |
| `--color-stale` | `#8A4B08` | figures behind the published value only |

`--color-verified` and `--color-stale` appear only inside check results and the emailed record. They never decorate marketing sections.

### 5.2 Typography

| Role | Face | Notes |
|---|---|---|
| Display | Newsreader variable serif | headings, weight 500, tight tracking |
| Body | IBM Plex Sans | 400 and 600, measure capped at 68ch |
| Data | IBM Plex Mono | figures, domains, dates, verdicts, tab labels, small lines |

Anything machine-checked is set in mono. Figures inside marketing prose stay in the body face; figures inside a check result are mono.

```
display-xl   clamp(2.25rem, 1.6rem + 2.6vw, 3.75rem)   line-height 1.05
display-lg   clamp(1.75rem, 1.4rem + 1.5vw, 2.5rem)    line-height 1.12
display-md   clamp(1.375rem, 1.2rem + 0.8vw, 1.75rem)  line-height 1.2
body-lg      1.125rem / 1.65
body         1rem / 1.7
mono-sm      0.8125rem / 1.5, tracking 0.02em
mono-label   0.6875rem / 1.4, uppercase, tracking 0.12em
```

### 5.3 Layout

- Content column `max-w-[68ch]` inside a `max-w-6xl` shell.
- Audit margin: at `lg` and above a 140px left column carries a mono uppercase section label, sticky.
- Sections separated by a hairline rule, `py-20` mobile, `py-28` desktop.
- Radius 4px, or 0 on rules. Nothing rounder.
- Dark sections (`tone="ink"`) used exactly three times across the funnel: "The boundary" on page 1, "The close" on page 5, and the header block on page 7. Rarity is what makes them land.

### 5.4 Motion

Three moments, CSS only, all suppressed under `prefers-reduced-motion: reduce`.

1. Check progress lines fade in sequentially, 120ms apart.
2. Finding rows resolve top to bottom, 60ms stagger, opacity plus 4px translate.
3. Source mark underline moves from dotted to solid on hover and focus, 120ms.

No scroll-triggered reveals. Nothing on page load.

### 5.5 `globals.css`

```css
@import "tailwindcss";

@theme {
  --color-ink: #0E1A26;
  --color-ink-soft: #46586A;
  --color-paper: #F6F7F8;
  --color-card: #FFFFFF;
  --color-rule: #D9DEE3;
  --color-source: #1740A6;
  --color-verified: #146B52;
  --color-stale: #8A4B08;

  --font-display: var(--font-newsreader), Georgia, serif;
  --font-body: var(--font-plex-sans), system-ui, sans-serif;
  --font-mono: var(--font-plex-mono), ui-monospace, monospace;

  --text-display-xl: clamp(2.25rem, 1.6rem + 2.6vw, 3.75rem);
  --text-display-lg: clamp(1.75rem, 1.4rem + 1.5vw, 2.5rem);
  --text-display-md: clamp(1.375rem, 1.2rem + 0.8vw, 1.75rem);
}

@layer base {
  body {
    background: var(--color-paper);
    color: var(--color-ink);
    font-family: var(--font-body);
    line-height: 1.7;
    text-rendering: optimizeLegibility;
  }
  h1, h2, h3 {
    font-family: var(--font-display);
    font-weight: 500;
    letter-spacing: -0.015em;
    font-variation-settings: "opsz" 36;
  }
  :focus-visible { outline: 2px solid var(--color-source); outline-offset: 3px; }
  ::selection { background: #D8E1F5; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 6. The funnel shell

### 6.1 Layout

```tsx
// src/app/RAG_Offer/layout.tsx
import { TabBar } from "@/components/funnel/TabBar";
import { SiteFooter } from "@/components/funnel/SiteFooter";

export default function FunnelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:p-3">
        Skip to content
      </a>
      <TabBar />
      <main id="main">{children}</main>
      <SiteFooter />
    </div>
  );
}
```

The main website header and navigation are not imported here.

### 6.2 Tab bar

Six tabs, on every page, sticky, `top-0`, `z-40`, background `--color-paper`, hairline bottom border.

| Label | Route |
|---|---|
| Check your site | `/RAG_Offer/website-figure-check` |
| No hallucinations | `/RAG_Offer/how-i-stop-hallucinations` |
| The assistant | `/RAG_Offer/see-it-working` |
| What's included | `/RAG_Offer/features` |
| Count your answers | `/RAG_Offer/verified-answers` |
| Book a call | `/RAG_Offer/book-a-call` |

Rules:

- Book a call is filled `--color-source`, white text, body face semibold, 4px radius, `px-4 py-2`, pinned right with `ml-auto`, and never scrolls out of view. On mobile the five tabs scroll horizontally inside their own container while the button stays fixed to the right of the row.
- The five tabs: font-mono `0.8125rem`, sentence case, inactive `text-ink-soft` with a transparent 2px bottom border, hover `text-ink`, active `text-ink` with a 2px bottom border in `--color-source`.
- Active state from `usePathname`, exact match. Active tab carries `aria-current="page"`.
- When Book a call is the active page, the filled button keeps its fill and gains a 2px `--color-ink` ring at 2px offset, so the current page still reads as current.
- `/RAG_Offer/thank-you` and `/RAG_Offer/privacy` show no active tab.
- Left of the tabs, a Wrigital wordmark in the display face linking to `/RAG_Offer/website-figure-check`. Not a tab, no active state.
- No hamburger, no drawer, no dropdown at any width.

```tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TABS, BOOK_TAB } from "@/lib/site";

export function TabBar() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/95 backdrop-blur-sm">
      <nav aria-label="Funnel" className="mx-auto flex max-w-6xl items-center gap-5 px-5 py-3">
        <Link href={TABS[0].href} className="font-display text-lg tracking-tight shrink-0">
          Wrigital
        </Link>
        <ul className="flex min-w-0 flex-1 items-center gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((t) => {
            const active = path === t.href;
            return (
              <li key={t.href} className="shrink-0">
                <Link
                  href={t.href}
                  aria-current={active ? "page" : undefined}
                  className={`block whitespace-nowrap border-b-2 pb-1 font-mono text-[0.8125rem] transition-colors duration-150 ${
                    active ? "border-source text-ink" : "border-transparent text-ink-soft hover:text-ink"
                  }`}
                >
                  {t.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <Link
          href={BOOK_TAB.href}
          aria-current={path === BOOK_TAB.href ? "page" : undefined}
          className={`shrink-0 rounded bg-source px-4 py-2 font-semibold text-white transition-opacity hover:opacity-90 ${
            path === BOOK_TAB.href ? "ring-2 ring-ink ring-offset-2 ring-offset-paper" : ""
          }`}
        >
          {BOOK_TAB.label}
        </Link>
      </nav>
    </header>
  );
}
```

### 6.3 Footer

Company name, registration number, registered address, contact email, privacy link. Nothing else, per the copy document.

```tsx
export function SiteFooter() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto max-w-6xl px-5 py-10 font-mono text-[0.8125rem] text-ink-soft">
        <p>Wrigital Ltd, registered in England and Wales, company number 16967085.</p>
        <p>12 Vernon Avenue, Old Basford, Nottingham, NG6 0AE</p>
        <p className="mt-3">
          <a className="underline underline-offset-4" href="mailto:hello@wrigital.com">hello@wrigital.com</a>
          <span aria-hidden="true"> / </span>
          <a className="underline underline-offset-4" href="/RAG_Offer/privacy">Privacy</a>
        </p>
      </div>
    </footer>
  );
}
```

The copy document says the footer Calendly link is one of only two other exits. That link is the Book a call tab, which is present on every page. No second Calendly link is added to the footer, because a duplicate exit in the footer competes with the pinned button directly above it.

### 6.4 `site.ts`

```ts
export const SITE = {
  name: "Wrigital Ltd",
  companyNumber: "16967085",
  registeredAddress: "12 Vernon Avenue, Old Basford, Nottingham, NG6 0AE",
  email: "hello@wrigital.com",
  calendly: "https://calendly.com/hello-wrigital/30min",
  videoId: "MVECWSCr7bM",
  base: "/RAG_Offer",
} as const;

export const TABS = [
  { label: "Check your site",   href: "/RAG_Offer/website-figure-check" },
  { label: "No hallucinations", href: "/RAG_Offer/how-i-stop-hallucinations" },
  { label: "The assistant",     href: "/RAG_Offer/see-it-working" },
  { label: "What's included",   href: "/RAG_Offer/features" },
  { label: "Count your answers", href: "/RAG_Offer/verified-answers" },
] as const;

export const BOOK_TAB = { label: "Book a call", href: "/RAG_Offer/book-a-call" } as const;
```

---

## 7. Shared components

### 7.1 `Section`

```tsx
export function Section({
  label, tone = "paper", id, children,
}: { label?: string; tone?: "paper" | "ink"; id?: string; children: React.ReactNode }) {
  const dark = tone === "ink";
  return (
    <section id={id} className={`border-t border-rule ${dark ? "bg-ink text-paper" : ""}`}>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-5 py-20 lg:grid-cols-[140px_minmax(0,1fr)] lg:py-28">
        <div aria-hidden="true" className="hidden lg:block">
          {label && (
            <p className={`sticky top-20 font-mono text-[0.6875rem] uppercase tracking-[0.12em] ${dark ? "text-paper/60" : "text-ink-soft"}`}>
              {label}
            </p>
          )}
        </div>
        <div className="max-w-[68ch]">{children}</div>
      </div>
    </section>
  );
}
```

`top-20` rather than `top-8` because the tab bar is sticky and the label must clear it.

### 7.2 `ForwardCta`

One component, used once per page, always last before the footer. This is the single most important shared component in the funnel, because it is the mechanism of the chain.

```tsx
import Link from "next/link";
import { Prose } from "./Prose";
import { track } from "@/lib/analytics";

export function ForwardCta({
  heading, body, label, href, from,
}: { heading: string; body?: string[]; label: string; href: string; from: string }) {
  return (
    <section className="border-t border-rule bg-card">
      <div className="mx-auto max-w-6xl px-5 py-16 lg:py-20">
        <div className="max-w-[68ch] rounded border border-rule bg-paper p-7 lg:p-9">
          <h2 className="text-display-md">{heading}</h2>
          {body && <Prose>{body.map((p, i) => <p key={i}>{p}</p>)}</Prose>}
          <Link
            href={href}
            onClick={() => track("forward_cta_clicked", { from, to: href })}
            className="mt-7 inline-flex items-center rounded bg-source px-6 py-3.5 font-semibold text-white transition-opacity hover:opacity-90"
          >
            {label}
          </Link>
        </div>
      </div>
    </section>
  );
}
```

The arrow in each label is part of the transcribed copy and is rendered as the character `→`. It is not an icon component.

### 7.3 `SourceMark`

Applies to the four figures in "Why this is worse than it looks in 2026" on page 1. Dotted underline, mono superscript, opens the published source in a new tab.

```tsx
export function SourceMark({ href, n, children }: { href: string; n: number; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
       className="text-ink decoration-source decoration-dotted underline underline-offset-[5px] transition-[text-decoration-style] duration-150 hover:decoration-solid focus-visible:decoration-solid">
      {children}
      <sup className="ml-0.5 font-mono text-[0.625rem] text-source">{n}</sup>
      <span className="sr-only"> (opens the published source in a new tab)</span>
    </a>
  );
}
```

| n | Figure in the copy | Source |
|---|---|---|
| 1 | CGT annual exempt amount £12,300 in 2022/23 | `https://www.gov.uk/capital-gains-tax/allowances` |
| 2 | cut to £6,000, then to £3,000 | `https://www.gov.uk/government/publications/reducing-the-annual-exempt-amount-for-capital-gains-tax` |
| 3 | dividend allowance £2,000 to £1,000 to £500 | `https://www.gov.uk/tax-on-dividends` |
| 4 | pension annual allowance £40,000 to £60,000 | `https://www.gov.uk/tax-on-your-private-pension/annual-allowance` |

`scripts/verify-source-marks.ts` asserts each URL returns 200 in CI. A dead source mark on this site is worse than no source mark.

### 7.4 `VideoEmbed`

Facade. No YouTube JavaScript until the visitor presses play.

```tsx
"use client";
import { useEffect } from "react";
import "lite-youtube-embed/src/lite-yt-embed.css";
import { track } from "@/lib/analytics";
import { SITE } from "@/lib/site";

export function VideoEmbed() {
  useEffect(() => { import("lite-youtube-embed"); }, []);
  return (
    <div className="rounded border border-rule bg-card p-2">
      <lite-youtube
        videoid={SITE.videoId}
        params="cc_load_policy=1&rel=0&modestbranding=1"
        style={{ backgroundImage: "url('/images/video-poster.jpg')" }}
        playlabel="Play: The Verified Assistant in four minutes"
        onClick={() => track("video_played", {})}
      />
    </div>
  );
}
```

### 7.5 `CalendlyEmbed`

Page 7 only. The script loads when the container enters the viewport, not on page load, so the rest of the funnel carries no third party JavaScript.

```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/site";
import { track } from "@/lib/analytics";

export function CalendlyEmbed() {
  const ref = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (!ref.current || load) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setLoad(true); track("calendly_viewed", {}); io.disconnect(); }
    }, { rootMargin: "200px" });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [load]);

  useEffect(() => {
    if (!load) return;
    const s = document.createElement("script");
    s.src = "https://assets.calendly.com/assets/external/widget.js";
    s.async = true;
    document.body.appendChild(s);
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://assets.calendly.com/assets/external/widget.css";
    document.head.appendChild(l);
  }, [load]);

  return (
    <div ref={ref} className="mx-auto max-w-4xl px-5 pb-20">
      {load ? (
        <div className="calendly-inline-widget rounded border border-rule bg-card"
             data-url={`${SITE.calendly}?hide_gdpr_banner=1&background_color=ffffff&primary_color=1740a6`}
             style={{ minWidth: 320, height: 760 }} />
      ) : (
        <div className="h-[760px] rounded border border-rule bg-card" aria-hidden="true" />
      )}
      <noscript>
        <a href={SITE.calendly} className="underline">Book a call</a>
      </noscript>
    </div>
  );
}
```

The placeholder block reserves the same height as the widget, so the embed loading causes no layout shift.

---

## 8. Data model and API

### 8.1 Types

```ts
// src/lib/check-types.ts
export type Verdict = "current" | "behind" | "unconfirmed";

export interface Finding {
  id: string;
  label: string;           // "Capital Gains Tax annual exempt amount"
  quotedValue: string;     // value found on the firm's page
  publishedValue: string;  // current published value
  taxYear: string;
  pageUrl: string;
  pageTitle: string;
  sourceUrl: string;
  sourceHost: string;
  verdict: Verdict;
}

export interface CheckResult {
  checkId: string;
  domain: string;
  startedAt: string;
  finishedAt: string;
  pagesRead: number;        // [pages]
  figuresChecked: number;   // [figures]
  confirmedCount: number;   // [confirmed]
  staleCount: number;       // [stale]
  findings: Finding[];      // verdict "behind" or "unconfirmed"
  confirmed: Finding[];     // verdict "current", emailed only
}

export type CheckErrorCode =
  | "invalid_domain" | "unreachable" | "blocked"
  | "no_pages" | "rate_limited" | "server_error";
```

```ts
// src/lib/wizard-types.ts
export interface WizardResult {
  resultId: string;
  monthlyUnverified: number;   // [n]
  workings: { label: string; value: string }[];
  callouts: string[];
  priority: string;            // the teaser naming what needs attention first
  answers: Record<string, string | number>;
}
```

### 8.2 `POST /api/check`

Request `{ domain: string }`. Response `200` with `CheckResult`, or `{ error: CheckErrorCode }`.

```ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import { redis } from "@/lib/kv";
import { checkLimiter } from "@/lib/ratelimit";
import { runFigureCheck } from "@/lib/figure-check";   // existing engine
import { toCheckResult } from "@/lib/check-adapter";   // shape adapter

export const runtime = "nodejs";
export const maxDuration = 60;

const Body = z.object({ domain: z.string().min(4).max(253) });

function normaliseDomain(raw: string) {
  const c = raw.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  return /^[a-z0-9.-]+\.[a-z]{2,}$/.test(c) ? c : null;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (!(await checkLimiter.limit(ip)).success)
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "invalid_domain" }, { status: 400 });

  const domain = normaliseDomain(parsed.data.domain);
  if (!domain) return NextResponse.json({ error: "invalid_domain" }, { status: 400 });

  try {
    const raw = await runFigureCheck(domain);
    const result = toCheckResult(raw, { checkId: nanoid(12), domain });
    await redis.set(`check:${result.checkId}`, result, { ex: 60 * 60 * 24 });
    return NextResponse.json(result);
  } catch (e: any) {
    const code = e?.code ?? "server_error";
    return NextResponse.json({ error: code }, { status: code === "server_error" ? 500 : 422 });
  }
}
```

Rate limit 5 per IP per hour.

### 8.3 `POST /api/check/report`

Request `{ checkId: string; email: string; budgetRecheck: boolean }`.

Reads the stored result, sends the customer record, sends the internal alert, and when `budgetRecheck` is true writes `recheck:{email}` to Redis with no TTL holding the domain and the request date. Returns `{ ok: true }`.

The autumn Budget re-check itself is a scheduled job outside this build. This spec records the opt-in so the promise made in the copy is captured from day one. Do not build the scheduler now.

```ts
const Body = z.object({
  checkId: z.string().min(6),
  email: z.string().email(),
  budgetRecheck: z.boolean().default(false),
});
// ... rate limit 3 per IP per hour, 410 on expired checkId,
//     502 on send failure, then:
if (body.budgetRecheck) {
  await redis.set(`recheck:${body.email}`, { domain: result.domain, requestedAt: new Date().toISOString() });
}
```

Client behaviour on `send_failed`: stay on page 1, no redirect, capture block shows

`The record did not send. Try again, or email hello@wrigital.com and I will send the record by hand.`

No redirect on failure, because page 2 asserts an email is on the way.

### 8.4 `POST /api/wizard/report`

Request `{ resultId: string; email: string }`. Sends `WizardReport`, sends the internal alert, returns `{ ok: true }`. **No redirect.** The client replaces the button with a confirmation line in place, per the page 6 rules.

### 8.5 Supporting modules

```ts
// src/lib/kv.ts
import { Redis } from "@upstash/redis";
export const redis = Redis.fromEnv();

// src/lib/ratelimit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./kv";
export const checkLimiter  = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, "1 h"), prefix: "rl:check" });
export const reportLimiter = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, "1 h"), prefix: "rl:report" });
export const wizardLimiter = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, "1 h"), prefix: "rl:wizard" });
```

---

## 9. Integrating the two existing builds

### 9.1 The figure check

Existing location `app/website-figure-check`. Refactor, do not rewrite.

1. Move the UI into `src/components/funnel/FigureCheck/`. The check now lives inside the funnel page rather than owning a route of its own.
2. Expose one component with two mounts sharing a single provider:

```tsx
<FigureCheck variant="hero" />     // above the fold
<FigureCheck variant="inline" />   // repeated inside the 2026 section
```

Submitting from either mount runs one check and renders one result. Submitting from the inline mount scrolls to `#check-result`. The findings never render twice on the page.

```ts
interface Ctx {
  status: "idle" | "running" | "done" | "error";
  domain: string;
  result: CheckResult | null;
  error: CheckErrorCode | null;
  budgetRecheck: boolean;
  setBudgetRecheck: (v: boolean) => void;
  run: (domain: string) => Promise<void>;
  sendReport: (email: string) => Promise<void>;
}
```

3. If the existing engine's return shape differs from `CheckResult`, all mapping goes in `src/lib/check-adapter.ts`. The working checker is not edited.

### 9.2 The unverified answers wizard

Existing location `/unverified-answers-count`.

Embed the existing wizard inline on `/RAG_Offer/verified-answers`, replacing the intro block in place when `Start the count` is pressed. **Not a modal, not an iframe, not a separate route.** The reader never leaves the page.

The old route stays reachable for now but is `noindex` and is never linked from the funnel.

Requirements on the wizard component:

- Renders inside a 68ch column with no fixed pixel width.
- Uses the section 5 tokens, no colour values of its own.
- Answers stay in the browser until the visitor asks for the report, matching the copy claim "your answers stay in your browser".
- Exposes `onComplete(result: WizardResult)`; the page posts the result to Redis under `wizard:{resultId}` with a 24 hour TTL only at that point.
- Renders its existing working panel, callouts and priority teaser unchanged beneath the result heading.

---

## 10. Page specifications

Each table below gives section order, the `Section` label for the audit margin, and the tone. Copy for every section comes from the matching heading in the copy document.

### 10.1 Page 1, `/RAG_Offer/website-figure-check`

| # | Section | Label | Notes |
|---|---|---|---|
| 1 | Hero | none | full block, no `Section` wrapper |
| 2 | The check | none | inside the hero block, above the fold |
| 3 | Result region | `Result` | renders after a check runs, anchor `#check-result` |
| 4 | Who I am | `Who` | photo left at `md`, caption in mono, two paragraphs |
| 5 | The boundary | `Boundary` | `tone="ink"` |
| 6 | Why this is worse than it looks in 2026 | `2026` | source marks, then the repeated check |
| 7 | What the check is not | `Scope` | `text-ink-soft`, smaller |
| 8 | Forward CTA | none | renders at the foot of the result state and also as the page's standing final block |

**Above the fold.** At 1280x720 and at 390x844 the h1, the sub-line, the lead-in paragraph, the input and the button are all visible without scrolling. The hero block is server rendered; only `FigureCheck` is a client component. The h1 is the LCP element, so nothing above it may block render. If the block overflows at 720px, reduce the `display-xl` clamp maximum to `3.25rem`. Never cut copy.

**Check form.**
- Label: `Your firm's website address`
- Placeholder: `yourfirm.co.uk`
- `inputMode="url"`, `autoComplete="url"`, `spellCheck={false}`
- Button: `Check my site`
- Small line beneath, mono, `text-ink-soft`: `Free. No account. The findings appear on screen.`

**Running state.** Button disabled, label `Checking`. Three mono progress lines appear in sequence, each gaining a hairline tick on completion, with an elapsed seconds counter to the right. Region is `aria-live="polite"`.

```
Reading your published pages
Finding the figures on those pages
Comparing each figure with the current published value
```

**Error state.** Panel border switches to `--color-stale`. Messages, by code:

| Code | Message |
|---|---|
| `invalid_domain` | `That address doesn't look right. Try the form yourfirm.co.uk` |
| `unreachable` | `Nothing responded at that address. Check the spelling and run the check again.` |
| `blocked` | `That site blocks automated readers, so the check cannot run. Email hello@wrigital.com and I will run the check by hand.` |
| `no_pages` | `No public pages could be read at that address.` |
| `rate_limited` | `That's several checks from this connection. Try again in an hour, or book a call and I will run the check with you.` |
| `server_error` | `The check failed partway through. Run the check again, and if the failure repeats, email hello@wrigital.com` |

Errors never apologise and always say what happens next.

**Result region.** Focus moves to the region heading on completion, and the page scrolls smoothly unless reduced motion is set.

Counts panel first, mono, verbatim template from the copy document:

`[pages] pages read. [figures] figures checked. [confirmed] figures confirmed.`

The panel renders in both result states with the same wording. Only the numbers differ.

Then the findings. One row per finding, `--color-card`, hairline separated. Definition list layout on mobile, a real `<table>` at `md` and above with headers `Figure`, `On your page`, `Published value`, `Source`. Each row carries a verdict chip, mono uppercase 11px: `CURRENT`, `BEHIND`, `NOT CONFIRMED`. Colour never carries meaning alone; the word is always present. `NOT CONFIRMED` covers figures found on the page that could not be matched to a published value, and is never presented as a failure.

Then the email capture, which switches copy on `staleCount > 0`:

- findings present: the "When findings were returned" block
- none: the "When no findings were returned" block

Both states render, in this order: the heading, the two paragraphs, the checkbox `Re-check my site after the autumn Budget.` unticked by default, the email field, and the button `Email me the record`.

Consent line beneath the button, mono, `text-ink-soft`:

`I will email the record and may follow up once about this check. No list, no newsletter. See the privacy notice.`

Free versus emailed is settled by the copy: findings and sources render free on screen, the email delivers the full dated record including the pages confirmed correct. Do not gate any finding.

On successful send, write the address to `sessionStorage` under `wrigital:lastEmail`, then `router.push('/RAG_Offer/thank-you?domain=' + encodeURIComponent(domain))`. The email address never appears in the URL.

**Forbidden on this page:** any countdown, urgency wording or scarcity in either result state. Never describe the record as evidence, an audit, or a compliance artefact.

### 10.2 Page 2, `/RAG_Offer/thank-you`

| # | Section | Label |
|---|---|---|
| 1 | Confirmation | none |
| 2 | Forward CTA | none |

Nothing else on this page. No video, no tab active state, `robots: { index: false, follow: false }`.

`[email]` is read client side from `sessionStorage`, falling back to `your inbox`. `[domain]` from `searchParams`, falling back to `your site`. A direct visit with neither present renders cleanly and never shows an error.

### 10.3 Page 3, `/RAG_Offer/how-i-stop-hallucinations`

| # | Section | Label |
|---|---|---|
| 1 | Header and intro | none |
| 2 | The five layers | `Layers` |
| 3 | Closing line | `Layers` (continues) |
| 4 | Forward CTA | none |

The five layers are the only numbered sequence in the funnel, so numbering is spent here and nowhere else. Numbers hang in the left gutter, mono, `--color-source`, `01` through `05`. The bold lead sentence of each layer sits in the body face semibold on its own line, the explanation beneath.

```tsx
<ol className="mt-8 space-y-8">
  {LAYERS.map((l, i) => (
    <li key={i} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4">
      <span className="pt-1 font-mono text-sm text-source">{String(i + 1).padStart(2, "0")}</span>
      <div>
        <p className="font-semibold">{l.lead}</p>
        <p className="mt-2 text-ink-soft">{l.body}</p>
      </div>
    </li>
  ))}
</ol>
```

Layer 4 contains the sentence tying the check the visitor just ran to this layer. That sentence is the hinge of the whole funnel, so nothing decorative is placed near it.

### 10.4 Page 4, `/RAG_Offer/see-it-working`

| # | Section | Label |
|---|---|---|
| 1 | Above the video | none |
| 2 | Video | none, breaks the measure |
| 3 | Beneath the video | `Notes` |
| 4 | Forward CTA | none |

The video is the dominant element. It breaks out of the 68ch measure to `max-w-4xl`, uses `aspect-video`, and runs edge to edge below `sm` with no horizontal padding. Not autoplaying, poster frame, captions on. Runtime stated as four minutes in the visible copy.

The two blocks beneath the video are separate: the numbers brief line first, then "What the video doesn't show" as its own bordered block on `--color-card`, because it is a scope statement rather than commentary.

### 10.5 Page 5, `/RAG_Offer/features`

| # | Section | Label | Notes |
|---|---|---|---|
| 1 | Header | none | eyebrow, h1, h2, italic line, audience paragraph |
| 2 | The core message | `The case` | |
| 3 | What's included | `Included` | twelve items, definition list |
| 4 | Included with a founding place | `Founding` | card on `--color-card`, hairline border |
| 5 | Price | `Price` | |
| 6 | What I won't sell you | `Excluded` | |
| 7 | Why the cohort is three firms | `Cohort` | |
| 8 | The close | `Close` | `tone="ink"` |
| 9 | Forward CTA | none | |

**Header.** `The Verified Assistant` as h1 in `display-xl`, `Founding Firms Programme` as h2 in mono uppercase `mono-label` at `--color-ink-soft` directly beneath, then the italic line in `display-md`, then the audience paragraph in `body-lg`. The programme name is set in mono rather than the display face so the product name stays the largest thing on the page.

**What's included.** Rendered as a definition list, hairline separated, no icons, no cards, no grid. A grid of tiles would flatten twelve substantial commitments into twelve decorative boxes.

```tsx
<dl className="mt-8 divide-y divide-rule border-y border-rule">
  {INCLUDED.map((i) => (
    <div key={i.term} className="py-5">
      <dt className="font-semibold">{i.term}</dt>
      <dd className="mt-1.5 text-ink-soft">{i.detail}</dd>
    </div>
  ))}
</dl>
```

**Price.** No table, no tiers, no add-ons, per the copy document. `£1,200 setup, then £250 a month` set in the display face at `display-lg`, the largest type on the page after the header. Terms and Azure paragraphs in body, the worked example in `text-ink-soft`.

### 10.6 Page 6, `/RAG_Offer/verified-answers`

| # | Section | Label | Notes |
|---|---|---|---|
| 1 | The nod | `The nod` | opens cold, no heading, `display-md` lead |
| 2 | Neither of those can ever produce a yes | `Why not` | |
| 3 | Nobody has ever written down what your AI would have to do | `The gap` | |
| 4 | The wizard intro | `Count` | heading, three paragraphs, `Start the count`, small line |
| 5 | The wizard | `Count` | replaces block 4 in place on start |
| 6 | The result | `Result` | heading `[n] unverified answers a month`, then working panel, callouts, priority teaser |
| 7 | Email capture | `Report` | full width, breaks the measure to `max-w-4xl` |
| 8 | Forward CTA | none | `Book a call →` to page 7 |

The wizard start button is `Start the count`, small line beneath in mono: `Eleven questions, about four minutes.`

Email capture button `Email me the report`, small line beneath in mono: `No follow-up sequence. The report, and nothing else.` The four report contents render as a bullet list, verbatim.

**Rules, enforced in code:**
- The email capture never blocks the result. The count, the working panel and the callouts render whether or not an address is entered.
- Submitting the email does not redirect. The button is replaced in place by a mono confirmation line: `On its way. Check your junk folder if it hasn't arrived in a couple of minutes.`
- No countdown, no scarcity, no popup, on this page or any other.

### 10.7 Page 7, `/RAG_Offer/book-a-call`

| # | Section | Label | Notes |
|---|---|---|---|
| 1 | Header | none | `tone="ink"`, h1 plus three paragraphs |
| 2 | What you'd be starting | `The offer` | price line, then the eleven item list, then the number checking line |
| 3 | Calendly | none | inline embed, `max-w-4xl` |

No forward CTA on this page and no second Book a call button anywhere on it. The embed is the CTA. The tab bar's Book a call button carries its active ring here.

The eleven item list under "What you'd be starting" renders as a plain bulleted list rather than a definition list, because these are a summary of commitments already set out in full on page 5.

---

## 11. Email

Both templates: React Email, table layout, inline styles, 600px maximum width, plain text alternative generated by Resend, and a footer carrying company name, number, registered address, privacy link, and one line explaining why the email arrived.

### 11.1 `FigureCheckRecord.tsx`

Subject switches on `staleCount`:

- findings: `Your figure check: [domain], [date]`
- clean: `Your figure check: [domain] is clean, [date]`

Body structure, transcribed from the copy document:

1. Opening line: the full record of the check on `[domain]`, run on `[date]`.
2. Counts line, correct variant for the state.
3. **What to change.** Findings first: figure found, current published value, page, source link. **This section does not render at all when there are no findings.**
4. **What was confirmed correct.** Remaining figures in page order, each against the current published value with the source link. In the clean state this is every figure.
5. Budget re-check paragraph, rendered only when the visitor ticked the box.
6. Always: the keep-this paragraph and the scope paragraph.
7. A link to `/RAG_Offer/how-i-stop-hallucinations`, then the Calendly link beneath. That order, per the copy document.

Verdict cells carry a word and a colour, never colour alone:

```tsx
const VERDICT = {
  current:     { label: "Current",       color: "#146B52" },
  behind:      { label: "Behind",        color: "#8A4B08" },
  unconfirmed: { label: "Not confirmed", color: "#46586A" },
} as const;
```

### 11.2 `WizardReport.tsx`

Subject: `Your unverified answers report, [date]`

Four sections, matching the four promises in the page 6 capture copy exactly and in that order:

1. A paragraph on AI use written from the firm's own figures, ready for a PI broker. Generated from `WizardResult` by template, not by a model, so the same inputs always produce the same paragraph.
2. Three questions for the compliance officer, in priority order, each with what a good answer sounds like.
3. What to do without hiring anybody, in named steps.
4. The ICO and FCA reading that applies, linked.

Sections 2, 3 and 4 are fixed content, the same in every send. Section 1 alone is generated from the visitor's figures. That keeps the report honest and makes it reviewable once rather than per send.

**This template needs its fixed content written before build.** See section 15.

### 11.3 `InternalAlert.tsx`

Plain, no styling effort. Subject carries the signal: `Check requested: [domain] ([stale] behind)` or `Wizard report: [n] a month`. Body: email address, domain or count, top three findings where relevant, and a link to the stored result.

### 11.4 Deliverability

Before launch: SPF, DKIM and DMARC on the sending domain, `RESEND_FROM` on a subdomain such as `checks@mail.wrigital.com`, real `replyTo` of `hello@wrigital.com`.

---

## 12. Analytics

```ts
// src/lib/analytics.ts
import { track as vercelTrack } from "@vercel/analytics";
export function track(event: string, props: Record<string, string | number | boolean> = {}) {
  try { vercelTrack(event, props); } catch {}
}
```

| Event | Fired when | Props |
|---|---|---|
| `check_started` | check submitted | `variant` |
| `check_completed` | result returned | `stale_count`, `figures_checked` |
| `check_failed` | error returned | `code` |
| `check_report_requested` | record emailed | `stale_count`, `budget_recheck` |
| `forward_cta_clicked` | any forward CTA | `from`, `to` |
| `tab_clicked` | any tab | `label` |
| `video_played` | video facade pressed | none |
| `wizard_started` | Start the count pressed | none |
| `wizard_completed` | wizard finishes | `monthly_unverified` |
| `wizard_report_requested` | report emailed | `monthly_unverified` |
| `calendly_viewed` | embed enters viewport | none |
| `calendly_booked` | Calendly `event_scheduled` message received | none |

Nothing beyond these. The number that matters is `calendly_booked` divided by unique visitors to page 1. Everything else exists to explain where the chain leaks.

Calendly booking capture:

```tsx
useEffect(() => {
  const h = (e: MessageEvent) => {
    if (e.origin.includes("calendly.com") && e.data?.event === "calendly.event_scheduled") {
      track("calendly_booked", {});
    }
  };
  window.addEventListener("message", h);
  return () => window.removeEventListener("message", h);
}, []);
```

---

## 13. Metadata and OG images

| Route | Title | Description |
|---|---|---|
| `/website-figure-check` | Check your firm's published figures | Enter your firm's address and see every allowance and threshold on your public pages compared with the current published value. Under a minute, nothing to install. |
| `/thank-you` | Your figure check record is on its way | noindex |
| `/how-i-stop-hallucinations` | How I stop hallucinations | Five independent layers, each catching what the previous layer missed. A hallucination has to survive all five to reach the screen. |
| `/see-it-working` | The Verified Assistant in four minutes | A real question going in, clickable citations, and the audit reports showing where every figure and information block came from. |
| `/features` | The Verified Assistant, Founding Firms Programme | A bespoke grounded assistant for UK FCA-regulated advice firms with 1 to 10 advisers. £1,200 setup, then £250 a month. |
| `/verified-answers` | How many unverified answers left your firm last month | Eleven questions and the estimate appears on screen, with the arithmetic shown in full. Nothing to install, no account, and your answers stay in your browser. |
| `/book-a-call` | Thirty minutes to define your AI compliance blueprint | Tell me what your compliance officer needs to see before AI is client-ready. Within two working days you receive that written as a technical specification, yours to keep. |
| `/privacy` | Privacy | noindex |

Each page sets `alternates.canonical` to the full `/RAG_Offer/...` URL and `openGraph: { type: "website", locale: "en_GB", siteName: "Wrigital" }`.

OG images are generated at the edge with `next/og`, one `opengraph-image.tsx` per route, identical layout, each carrying its own headline. Seven generated cards, no design round trip, nothing static to maintain.

```tsx
// pattern, repeated per route with its own headline
import { ImageResponse } from "next/og";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column",
                  justifyContent: "space-between", background: "#0E1A26", color: "#F6F7F8",
                  padding: 72, fontFamily: "serif" }}>
      <div style={{ fontSize: 22, letterSpacing: 4, color: "#8FA6C6" }}>WRIGITAL</div>
      <div style={{ fontSize: 72, lineHeight: 1.05, maxWidth: 900 }}>How I stop hallucinations</div>
      <div style={{ fontSize: 26, color: "#8FA6C6" }}>Every citation checked. Every link real.</div>
    </div>,
    { ...size }
  );
}
```

---

## 14. Quality floor

Non negotiable before launch.

**Accessibility**
- Every interactive element keyboard reachable, with the visible focus ring from `globals.css`.
- Check progress, check result and wizard result in `aria-live="polite"` regions.
- Verdicts carry a word as well as a colour.
- Contrast 4.5:1 minimum for body text and mono labels; `--color-stale` and `--color-verified` verified against `--color-card`.
- Founder photograph carries a real alt description, not the caption repeated.
- Video captions on by default, descriptive play label.
- Tab bar navigable by keyboard in reading order, active tab announced through `aria-current`.
- Usable at 200% zoom and at 320px width.

**Performance**
- Lighthouse 95+ performance and 100 accessibility on mobile emulation, all seven routes.
- LCP under 2.0s on page 1. The h1 is the LCP element.
- No third party JavaScript before interaction anywhere except page 7, where Calendly loads on intersection.
- Founder photograph through `next/image`, width 400, AVIF and WebP.

**Behaviour**
- Every outbound link `target="_blank" rel="noopener noreferrer"`.
- Check state survives resize and variant switch, and never renders twice.
- Direct visit to `/RAG_Offer/thank-you` with no query and no session value renders cleanly.
- Old route `/unverified-answers-count` is `noindex` and unlinked from the funnel.
- `scripts/verify-copy.ts` and `scripts/verify-source-marks.ts` both pass in CI.

---

## 15. Environment

```
NEXT_PUBLIC_SITE_URL=https://wrigital.com
RESEND_API_KEY=
RESEND_FROM="Wrigital <checks@mail.wrigital.com>"
NOTIFY_TO=hello@wrigital.com
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

Calendly URL and company details live in `src/lib/site.ts`, not in environment variables, because they belong to the copy and should move through review.

---

## 16. Build order

1. Tokens, fonts, funnel layout, `TabBar`, `SiteFooter`, `Section`, `Prose`, `ForwardCta`. Deploy a shell with seven empty routes.
2. Transcribe all copy into `src/content/copy.ts` and write `scripts/verify-copy.ts`. Copy is now locked and cannot drift during the build.
3. Pages 3, 4, 5 and 7. Static, no interactivity, and the chain runs end to end from page 3 onward.
4. Page 1 static sections, source marks, `scripts/verify-source-marks.ts`.
5. Refactor the existing check into `FigureCheck`, both mounts, `/api/check` with the adapter.
6. `/api/check/report`, `FigureCheckRecord`, Resend domain authentication, redirect to page 2. Page 2 built.
7. Page 6: embed the existing wizard, result rendering, capture, `/api/wizard/report`, `WizardReport`.
8. Metadata, seven OG routes, privacy page, analytics events.
9. Quality floor pass in section 14.

Steps 1 to 3 are shippable alone. That is the cut line if time runs short.

---

## 17. Assets

### Resolved

| Asset | Status |
|---|---|
| Founder photograph | `public/images/terry-martin-founder.jpg`, caption `Terry Martin, Wrigital Ltd, Nottingham.` |
| Company number and registered address | `16967085`, `12 Vernon Avenue, Old Basford, Nottingham, NG6 0AE` |
| Calendly URL | `https://calendly.com/hello-wrigital/30min` |
| Four minute video | `https://youtu.be/MVECWSCr7bM` |
| Video poster frame | Interim: save `https://i.ytimg.com/vi/MVECWSCr7bM/maxresdefault.jpg` to `public/images/video-poster.jpg`. A designed frame replaces it later with no code change. |
| Video captions | Not a separate file. Captions ride on the YouTube asset and load through `cc_load_policy=1`. Confirm the YouTube captions track is a reviewed track, not auto-generated. |
| Check record email template | Specified in 11.1, built as `src/emails/FigureCheckRecord.tsx` |
| Per-page OG images, titles, descriptions | Generated at the edge, section 13. Nothing static to produce. |
| Privacy policy | Written in full below |

### Outstanding, one item

**The fixed content for the wizard report email**, sections 2, 3 and 4 of `WizardReport.tsx`: the three compliance questions with what a good answer sounds like, the named steps, and the ICO and FCA reading list. This is the only asset that cannot be generated or substituted, because it is the thing the page 6 capture promises.

Until it exists, the build can proceed to step 6. It blocks step 7 only.

### Privacy policy, ready to publish

> ## Privacy notice
>
> Wrigital Ltd, company number 16967085, is the data controller for this site.
>
> **What this site collects.** A website address you enter into the figure check, the answers you give the counting tool, and an email address if you ask for a record or a report. Nothing else is requested.
>
> **Why.** The website address is used to read your public pages and compare the figures published there against current published values. Your answers to the counting tool are used to produce your estimate and your report. An email address is used to send you what you asked for, and may be used once to follow up. If you ask for a re-check after the autumn Budget, your address and domain are kept until you tell me to stop. The lawful basis is legitimate interest in responding to a request you made.
>
> **How long.** Check results and counting results are stored for 24 hours and then deleted automatically. Email addresses are held in the email sending account for as long as needed to answer a follow up, and are deleted on request.
>
> **Who else sees this.** Vercel hosts the site. Upstash stores results for 24 hours. Resend delivers email. Calendly handles bookings if you book a call. Each acts under contract and none receives your data for their own marketing.
>
> **Analytics.** Vercel Analytics records page views and a small number of anonymous events. No cookies are set for analytics and no visitor is identified.
>
> **The figure check reads public pages only.** Nothing behind a login is read, and nothing is stored beyond the 24 hour window.
>
> **Your rights.** You can ask for a copy of what is held, ask for correction, or ask for deletion. Email hello@wrigital.com and you will have a reply within five working days. You can complain to the Information Commissioner's Office at ico.org.uk.
>
> Last updated 1 August 2026.

No cookie banner is required, because no non essential cookies are set before interaction. Calendly sets cookies once its embed loads on page 7, so the privacy notice names it and the embed carries `hide_gdpr_banner=1` only because the notice covers it. If a marketing pixel is ever added anywhere, a banner becomes mandatory.
