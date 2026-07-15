import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { WrigitalLogo } from '@/components/brand/WrigitalLogo';
import Footer from '@/components/layout/Footer';
import { MetaPixel } from '@/components/analytics/MetaPixel';
import { Section } from '@/components/marketing/CtaBand';
import { FaqAccordion } from '@/components/marketing/FaqAccordion';
import { ScrollReveal } from '@/components/marketing/ScrollReveal';
import { LinkButton } from '@/components/marketing/shared';
import { buttonVariants } from '@/components/ui/button';
import {
  azureAiCredentialUrl,
  calendlyDonkeyUrl,
  siteUrl,
} from '@/lib/site';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'We find your biggest piece of donkey work',
  description:
    'We find your biggest piece of donkey work, then you forget it ever existed. Fixed-price AI and automation for Nottingham businesses. Free assessment.',
  alternates: { canonical: '/local' },
  robots: { index: false, follow: false },
  openGraph: {
    title: 'We find your biggest piece of donkey work',
    description:
      'We find your biggest piece of donkey work, then you forget it ever existed. Fixed-price AI and automation for Nottingham businesses. Free assessment.',
    url: `${siteUrl}/local`,
    images: [{ url: '/images/donkey-hero.png' }],
  },
};

const boxLabels = [
  'QUOTES',
  'INVOICES',
  'CHASING',
  'DATA ENTRY',
  'THE SAME TEN QUESTIONS',
] as const;

const donkeyList = [
  'Writing quotes at the kitchen table after the kids are in bed',
  'Chasing the same invoice for the third time',
  'Typing the same order into three different systems',
  'Answering "are you open Sunday?" for the tenth time today',
  'The report you rebuild by hand every Monday morning',
];

const faqItems = [
  {
    q: '"Can\'t I just use ChatGPT?"',
    a: 'For drafting emails, yes, and on the call we will show you how, free. The paid work is the plumbing: connecting your bookings to your invoices to your reminders so the job runs without you. A chatbot cannot do your plumbing.',
  },
  {
    q: '"What happens when it breaks?"',
    a: 'It tells you. Everything we build logs its work, and your handover document shows you how to check it in two minutes.',
  },
  {
    q: '"Who does the work, by name?"',
    a: 'The consultant on your first call builds your system, tests it and hands it over. One person, first call to finished work, based in Nottingham.',
  },
  {
    q: '"What if automation is wrong for my business?"',
    a: 'Then the assessment document says so, and it is still yours to keep. We would rather tell you now than invoice you for finding out.',
  },
];

function LocalHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg)]/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex shrink-0 items-center">
          <WrigitalLogo />
        </Link>
        <a
          href={calendlyDonkeyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ size: 'sm' }))}
        >
          Find my donkey work
        </a>
      </nav>
    </header>
  );
}

export default function LocalLandingPage() {
  return (
    <>
      <MetaPixel />
      <LocalHeader />
      <main>
        {/* HERO */}
        <section className="bg-[var(--color-bg)] py-16 lg:py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
            <ScrollReveal>
              <h1 className="mb-6 text-3xl font-bold leading-tight text-[var(--color-primary)] sm:text-4xl lg:text-5xl">
                We find your biggest piece of donkey work. Then you forget it
                ever existed.
              </h1>
              <p className="mb-8 text-lg leading-relaxed text-[var(--color-text-secondary)] sm:text-xl">
                AI and automation for Nottingham businesses. One consultant,
                fixed price, fixed date, and a system you can check any time you
                like.
              </p>
              <LinkButton
                cta={{
                  label: 'Find my donkey work',
                  href: calendlyDonkeyUrl,
                }}
              />
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="relative">
                <div className="relative aspect-video overflow-hidden rounded-xl">
                  <Image
                    src="/images/donkey-hero.png"
                    alt="A donkey buried under a stack of cardboard boxes"
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <ul className="mt-4 flex flex-wrap gap-2" aria-label="Box labels">
                  {boxLabels.map((label) => (
                    <li
                      key={label}
                      className="rounded-md bg-[var(--color-primary)] px-3 py-1.5 text-xs font-semibold tracking-wide text-[var(--color-text-inverse)]"
                    >
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* SECTION 1: Name the donkey */}
        <Section banded>
          <ScrollReveal>
            <h2 className="mb-8 text-3xl font-semibold text-[var(--color-primary)]">
              Which of these follows you home?
            </h2>
            <ul className="mb-8 max-w-3xl list-disc space-y-3 pl-6 text-lg text-[var(--color-text-secondary)]">
              {donkeyList.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="max-w-3xl text-lg text-[var(--color-text-secondary)]">
              Every business has one job like this. It gets done, because you do
              it, in the hours that were supposed to be yours. We call it donkey
              work, and finding yours is what we do first.
            </p>
          </ScrollReveal>
        </Section>

        {/* SECTION 2: What it costs you */}
        <Section>
          <ScrollReveal>
            <h2 className="mb-6 text-3xl font-semibold text-[var(--color-primary)]">
              Donkey work looks free because nobody invoices you for it.
            </h2>
            <p className="max-w-3xl text-lg text-[var(--color-text-secondary)]">
              Run the numbers once. If your time is worth £40 an hour and donkey
              work takes five hours a week, that job costs your business around
              £10,000 a year. Every year. And that figure counts the hours; it
              says nothing about the evenings.
            </p>
            <p className="mt-4 max-w-3xl text-lg text-[var(--color-text-secondary)]">
              The fix is a one-off build at a fixed price, a fraction of one
              year&apos;s cost. We put your real numbers to it on the assessment
              call, and if the sums say &quot;keep doing it by hand,&quot; we tell
              you that instead.
            </p>
          </ScrollReveal>
        </Section>

        {/* SECTION 3: How it works */}
        <Section banded>
          <ScrollReveal>
            <h2 className="mb-10 text-3xl font-semibold text-[var(--color-primary)]">
              Three steps. One consultant. No handoffs.
            </h2>
            <ol className="max-w-3xl space-y-10">
              <li>
                <h3 className="mb-3 text-xl font-semibold text-[var(--color-primary)]">
                  1. We find it.
                </h3>
                <p className="text-lg text-[var(--color-text-secondary)]">
                  A free assessment call, an hour at most. We map where your hours
                  go and name the biggest piece of donkey work, with a number
                  attached: what it costs you, what removing it costs, what the
                  payback looks like. You get it in writing, and the document is
                  yours whether you hire us or hand it to your nephew who is good
                  with computers.
                </p>
              </li>
              <li>
                <h3 className="mb-3 text-xl font-semibold text-[var(--color-primary)]">
                  2. We remove it.
                </h3>
                <p className="text-lg text-[var(--color-text-secondary)]">
                  We build the fix ourselves, in code, to a fixed price and a
                  fixed delivery date. Software takes the job; anything needing
                  judgement comes to you with the context attached.
                </p>
              </li>
              <li>
                <h3 className="mb-3 text-xl font-semibold text-[var(--color-primary)]">
                  3. You forget it.
                </h3>
                <p className="text-lg text-[var(--color-text-secondary)]">
                  And here is why forgetting is safe:{' '}
                  <strong className="font-semibold text-[var(--color-primary)]">
                    you can forget it because you can check it.
                  </strong>{' '}
                  Everything we build logs what it does. You get a plain-English
                  handover document, and the system&apos;s record is open to you
                  any time you care to look. We stay one phone call away.
                </p>
              </li>
            </ol>
          </ScrollReveal>
        </Section>

        {/* Visual between 3 and 4 */}
        <Section>
          <ScrollReveal>
            <div className="relative mx-auto aspect-video max-w-4xl overflow-hidden rounded-xl">
              <Image
                src="/images/donkey-mid-page-trotting.png"
                alt="A donkey trotting away, leaving the boxes behind"
                fill
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
              />
            </div>
          </ScrollReveal>
        </Section>

        {/* SECTION 4: Why trust us */}
        <Section banded>
          <ScrollReveal>
            <h2 className="mb-6 text-3xl font-semibold text-[var(--color-primary)]">
              We build to a standard most local jobs never see.
            </h2>
            <p className="max-w-3xl text-lg text-[var(--color-text-secondary)]">
              We built FinPrint, a working AI platform for regulated financial
              advisers, an industry where a regulator checks the homework and
              every number must survive inspection. Your build gets that same
              discipline at local-business prices.
            </p>
            <p className="mt-4 max-w-3xl text-lg text-[var(--color-text-secondary)]">
              Our founder spent years at NatWest building systems where a wrong
              number could end a career. The habit stuck: if a system makes a
              decision, it shows its working.
            </p>
            <p className="mt-4 max-w-3xl text-lg text-[var(--color-text-secondary)]">
              And the promise that costs us work but keeps our name good:{' '}
              <strong className="font-semibold text-[var(--color-primary)]">
                where automation is the wrong call, we say so.
              </strong>
            </p>
          </ScrollReveal>
        </Section>

        {/* SECTION 5: What it costs */}
        <Section>
          <ScrollReveal>
            <h2 className="mb-8 text-3xl font-semibold text-[var(--color-primary)]">
              Fixed prices. No day rates, no meters running.
            </h2>
            <div className="max-w-3xl overflow-x-auto">
              <table className="w-full border-collapse text-left text-[var(--color-text-secondary)]">
                <tbody>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <th
                      scope="row"
                      className="py-5 pr-6 align-top text-base font-semibold text-[var(--color-primary)] sm:text-lg"
                    >
                      The assessment
                    </th>
                    <td className="py-5 text-base sm:text-lg">
                      Free for Nottingham businesses at the moment. One call, one
                      written document naming your donkey work and the numbers.
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <th
                      scope="row"
                      className="py-5 pr-6 align-top text-base font-semibold text-[var(--color-primary)] sm:text-lg"
                    >
                      The build
                    </th>
                    <td className="py-5 text-base sm:text-lg">
                      £1,500 to £3,000, fixed, agreed before we start, with a
                      delivery date beside it. The exact price depends on the job,
                      and it goes in writing before you commit to anything.
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="py-5 pr-6 align-top text-base font-semibold text-[var(--color-primary)] sm:text-lg"
                    >
                      Keeping it running
                    </th>
                    <td className="py-5 text-base sm:text-lg">
                      Optional, from £150 a month. We watch the logs, tune the
                      system and stay on the end of the phone.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </Section>

        {/* SECTION 6: FAQ */}
        <Section banded>
          <ScrollReveal>
            <h2 className="mb-8 text-3xl font-semibold text-[var(--color-primary)]">
              The questions everyone asks
            </h2>
            <FaqAccordion items={faqItems} />
          </ScrollReveal>
        </Section>

        {/* TRUST STRIP */}
        <section className="border-y border-[var(--color-border-subtle)] bg-[var(--color-bg)] py-10">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-8 px-6 sm:flex-row sm:gap-10">
            <a
              href={azureAiCredentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 transition-opacity hover:opacity-90"
            >
              <Image
                src="/images/AI102.JPG"
                alt="Microsoft Certified: Azure AI Engineer Associate"
                width={120}
                height={120}
                className="h-24 w-24 object-contain sm:h-28 sm:w-28"
              />
            </a>
            <p className="text-center text-sm text-[var(--color-text-secondary)] sm:text-left">
              Former NatWest developer
            </p>
            <p className="max-w-xs text-center text-sm text-[var(--color-text-secondary)] sm:text-left">
              Built FinPrint, a working AI platform for FCA-regulated financial
              advisers
            </p>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="bg-[var(--color-primary)] py-20 text-[var(--color-text-inverse)]">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="mb-8 text-2xl font-semibold sm:text-3xl">
              Your donkey work is costing you evenings and about £10,000 a year.
              Finding it costs an hour.
            </h2>
            <LinkButton
              cta={{
                label: 'Find my donkey work',
                href: calendlyDonkeyUrl,
              }}
              variant="secondary"
            />
            <p className="mt-6 text-sm text-[var(--color-text-inverse)]/80">
              Free assessment currently limited to five Nottingham businesses a
              month. The written summary is yours either way.
            </p>
          </div>
        </section>

        {/* Footer visual */}
        <section className="bg-[var(--color-bg)] py-12">
          <div className="mx-auto max-w-4xl px-6">
            <div className="relative aspect-video overflow-hidden rounded-xl">
              <Image
                src="/images/donkey_owner-footer.png"
                alt="A donkey grazing in a field while the owner drinks tea with feet up"
                fill
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
