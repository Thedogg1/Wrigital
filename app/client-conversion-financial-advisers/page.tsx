import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/marketing/Hero';
import { Section } from '@/components/marketing/CtaBand';
import { LinkButton } from '@/components/marketing/shared';
import { ScrollReveal } from '@/components/marketing/ScrollReveal';
import { calendlyUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Client intelligence you can prove.',
  description:
    'FinPrint is a glass-box AI system for UK advisers to business-owning high-net-worth clients. Every figure is auditable. Every calculation is transparent. The adviser owns every choice before a client sees it.',
  alternates: { canonical: '/client-conversion-financial-advisers' },
};

export default function FinPrintPage() {
  return (
    <>
      <Header variant="finprint" />
      <main>
        <Hero
          fullWidthImage
          title="Client intelligence you can prove."
          subtitle="FinPrint is a glass-box AI system for UK advisers to business-owning high-net-worth clients. Every figure is auditable. Every calculation is transparent. The adviser owns every choice before a client sees it."
          supporting="Most advisers use it to win new clients. It earns that trust because nothing in it is a black box."
          primary={{ label: 'Request a sample report', href: '#request-sample' }}
          secondary={{
            label: 'See how the engine works',
            href: '/client-intelligence-engine',
          }}
          image="/images/finprint-hero.png"
        />

        <Section>
          <ScrollReveal>
            <h2 className="mb-6 text-3xl font-semibold text-[var(--color-primary)]">
              Built for one client, in depth
            </h2>
            <p className="max-w-3xl text-lg text-[var(--color-text-secondary)]">
              FinPrint is built for a single niche: UK business owners with high net
              worth. The frameworks, report sections, formulas and knowledge base are
              specific to that world, not a general model asked to guess at it. That
              focus is why the intelligence holds up.
            </p>
            <p className="mt-4 max-w-3xl text-lg text-[var(--color-text-secondary)]">
              It turns the little you know about a prospect into a complete, verified
              picture, ready before you sit down.
            </p>
          </ScrollReveal>
        </Section>

        <Section banded>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <ScrollReveal>
              <h2 className="mb-6 text-3xl font-semibold text-[var(--color-primary)]">
                The system proposes. The adviser disposes.
              </h2>
              <p className="text-[var(--color-text-secondary)]">
                FinPrint drafts a blueprint for each client. It selects the niche
                frameworks, report sections and formulas that fit, and writes them
                into a payload you can open. You inspect it, you edit it, and you own
                every choice in it.
              </p>
              <p className="mt-4 text-[var(--color-text-secondary)]">
                The AI never has the last word. It assembles a draft from a library we
                built and you can inspect, and the licensed professional decides what
                stays. The reasons for what a client sees sit with you, not the machine.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <Image
                  src="/images/finprint-system-proposes.png"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </ScrollReveal>
          </div>
        </Section>

        <Section>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <ScrollReveal delay={0.1}>
              <div className="relative aspect-video overflow-hidden rounded-xl lg:order-first">
                <Image
                  src="/images/finprint-figure-verified.png"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal>
              <h2 className="mb-6 text-3xl font-semibold text-[var(--color-primary)]">
                Every figure verified. No silent failures.
              </h2>
              <p className="text-[var(--color-text-secondary)]">
                Every figure is number-checked, so a figure is confirmed, not assumed.
                Every source is attributed. Every step sits in a full audit trail.
                FinPrint is built for a supervised industry, and it shows its working.
              </p>
              <p className="mt-4 text-[var(--color-text-secondary)]">
                That is the compliance footing an FCA-regulated firm needs, produced
                within two hours of the meeting.
              </p>
              <p className="mt-4">
                <Link
                  href="/client-intelligence-engine"
                  className="font-medium text-[var(--color-primary)] underline-offset-4 hover:underline"
                >
                  See the full architecture on the Client Intelligence Engine page.
                </Link>
              </p>
            </ScrollReveal>
          </div>
        </Section>

        <Section banded>
          <ScrollReveal>
            <h2 className="mb-6 text-3xl font-semibold text-[var(--color-primary)]">
              What each engagement produces
            </h2>
            <p className="mb-6 max-w-3xl text-lg text-[var(--color-text-secondary)]">
              A governed pack, built for the meeting:
            </p>
            <ul className="max-w-3xl list-disc space-y-2 pl-6 text-lg text-[var(--color-text-secondary)]">
              <li>A client-facing report, written for the client to read and hold</li>
              <li>A numbers audit, so every figure traces back</li>
              <li>An information sources review</li>
              <li>An external sources review</li>
              <li>The blueprint, your record of what went in and why</li>
              <li>
                A warnings file, raising what the numbers say you cannot miss
              </li>
            </ul>
            <p className="mt-6 max-w-3xl text-lg text-[var(--color-text-secondary)]">
              The warnings file is a validation engine&apos;s output, not a checklist.
              It checks the figures against the client&apos;s real position and flags
              what will not reconcile: tax under-declared, lifestyle spending the
              numbers cannot support, an exposure nobody has priced. An adviser is
              seldom sued for being wrong. They are sued for missing what they should
              have seen.
            </p>
            <p className="mt-4 max-w-3xl text-lg text-[var(--color-text-secondary)]">
              It does quiet double duty, since it also gives you a reason to re-engage
              a lead that has gone quiet.
            </p>
          </ScrollReveal>
        </Section>

        <Section>
          <ScrollReveal>
            <h2 className="mb-4 text-3xl font-semibold text-[var(--color-primary)]">
              Most advisers use it to win clients
            </h2>
            <p className="mb-8 max-w-3xl text-lg text-[var(--color-text-secondary)]">
              Winning clients is the common use, and the report works at every stage of
              the conversation:
            </p>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: 'Before.',
                  body: 'Prospects have heard the same pitch from everyone and hold back until they feel seen. FinPrint hands them insight before the first meeting, so you walk in trusted, before you have made your case.',
                },
                {
                  title: 'During.',
                  body: 'The report frees you to listen. It anchors the real motivator, the ambition to protect and grow, at the centre of the conversation.',
                },
                {
                  title: 'After.',
                  body: 'Warm leads cool when nothing gives them a reason to re-engage. A follow-on report, run with real numbers and fresh market data, gives you one in a single email.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6"
                >
                  <h3 className="mb-3 font-semibold text-[var(--color-primary)]">
                    {item.title}
                  </h3>
                  <p className="text-[var(--color-text-secondary)]">{item.body}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </Section>

        <Section banded id="request-sample">
          <ScrollReveal>
            <h2 className="mb-4 text-3xl font-semibold text-[var(--color-primary)]">
              The offer
            </h2>
            <p className="mb-4 max-w-3xl text-xl font-medium text-[var(--color-primary)]">
              The two-report pack.
            </p>
            <p className="mb-8 max-w-3xl text-lg text-[var(--color-text-secondary)]">
              The two-report pack is £12,000, with additional reports at £500 each.
              Verified, governed and produced within two hours of the meeting.
            </p>
            <div className="flex flex-wrap gap-4">
              <LinkButton
                cta={{ label: 'Request a sample report', href: calendlyUrl }}
              />
              <LinkButton
                cta={{ label: 'Book a discovery call', href: calendlyUrl }}
                variant="outline"
              />
            </div>
          </ScrollReveal>
        </Section>

        <Section>
          <ScrollReveal>
            <h2 className="mb-4 text-3xl font-semibold text-[var(--color-primary)]">
              Work a different niche?
            </h2>
            <p className="max-w-3xl text-lg text-[var(--color-text-secondary)]">
              FinPrint is built for UK business-owning high-net-worth clients. If your
              firm works a different niche, we can build one to order. Ask, and we will
              scope it with you.
            </p>
          </ScrollReveal>
        </Section>

        <Section banded>
          <ScrollReveal>
            <h2 className="mb-4 text-3xl font-semibold text-[var(--color-primary)]">
              See what a prospect would receive
            </h2>
            <p className="mb-8 max-w-3xl text-[var(--color-text-secondary)]">
              The quickest way to understand FinPrint is to see a sample report for a
              profile that matches your work, then talk it through.
            </p>
            <LinkButton
              cta={{ label: 'Request a sample report', href: calendlyUrl }}
            />
          </ScrollReveal>
        </Section>
      </main>
      <Footer />
    </>
  );
}
