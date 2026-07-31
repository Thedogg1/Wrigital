import type { Metadata } from 'next';
import { Section } from '@/components/funnel/Section';
import { Prose } from '@/components/funnel/Prose';
import { SourceMark } from '@/components/funnel/SourceMark';
import { Photo } from '@/components/funnel/Photo';
import { BookACall } from '@/components/funnel/BookACall';
import { FigureCheck, CheckResult } from '@/components/funnel/FigureCheck';
import { FigureCheckProvider } from '@/components/funnel/FigureCheck/FigureCheckProvider';

export const metadata: Metadata = {
  title: 'Verified AI for UK FCA-regulated advice firms',
  description:
    "Check your own website first. Enter your firm's address and see every allowance and threshold on your public pages compared with the current published value. Under a minute, nothing to install.",
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Wrigital',
  },
};

export default function HomePage() {
  return (
    <FigureCheckProvider>
      <div className="mx-auto flex min-h-[calc(100svh-57px)] max-w-6xl flex-col justify-center px-5 py-10">
        <h1 className="max-w-[20ch] text-display-xl">
          Generic AI asks your firm to accept its standards. I build to yours.
        </h1>
        <p className="mt-5 max-w-[60ch] text-[1.125rem] text-ink-soft">
          Verified AI systems for UK FCA-regulated advice firms. Every claim
          carries a citation, every citation is checked, and every source opens
          when you click it.
        </p>
        <div className="mt-9">
          <FigureCheck variant="hero" />
        </div>
      </div>

      <CheckResult />

      <Section label="Who">
        <Photo
          src="/images/terry-martin-founder.jpg"
          alt="Terry Martin, founder of Wrigital Ltd, photographed in Nottingham"
          caption="Terry Martin, Wrigital Ltd, Nottingham."
        />
        <p className="mt-6 font-display text-display-md">Terry Martin</p>
        <Prose>
          <p>
            Among other well known companies, I spent 3 years working for Nat
            West Group Audit. I developed and provided second line support for
            the system the auditors used to collect and analyze audit findings.
            Everything had to be traceable, but their biggest fear was silent
            errors. This experience taught me to build with the assumption that
            my work will be scrutinized, because in regulated companies, it
            always will be.
          </p>
          <p>I now build AI systems for FCA-regulated advice firms.</p>
        </Prose>
      </Section>

      <Section label="Boundary" tone="ink">
        <Prose>
          <p>
            I&apos;m not your compliance officer and I won&apos;t pretend to be.
            Your compliance function sets the standard, and that is exactly as
            it should be. My job is to build to that standard, and to make sure
            the system can evidence that it has.
          </p>
          <p>
            That&apos;s the same discipline I learned building for auditors. You
            don&apos;t argue that your work is correct. You make your work
            inspectable, and let someone check.
          </p>
        </Prose>
      </Section>

      <Section label="Bridge">
        <Prose>
          <p>
            Most AI sold to regulated firms is built for capability first and
            wrapped in governance afterwards. That&apos;s the wrong way round,
            and cannot be retrofitted. You cannot add an audit trail to a system
            that was never built to leave one.
          </p>
          <p>
            Verification is the part people assume is impossible. Verification
            isn&apos;t impossible. Verification is ordinary engineering: fetch
            the page, check the page exists, check the page says what the claim
            says, drop the source if not. Nothing clever.
          </p>
          <p>
            The check at the top of this page is that same engineering, run on
            something you can verify yourself in thirty seconds.
          </p>
        </Prose>
      </Section>

      <Section label="2026">
        <Prose>
          <h2>Why this is worse than it looks in 2026</h2>
          <p>
            The Capital Gains Tax annual exempt amount was{' '}
            <SourceMark
              n={1}
              href="https://www.gov.uk/capital-gains-tax/allowances"
            >
              £12,300 in 2022/23
            </SourceMark>
            . The allowance was{' '}
            <SourceMark
              n={2}
              href="https://www.gov.uk/government/publications/reducing-the-annual-exempt-amount-for-capital-gains-tax"
            >
              cut to £6,000, then to £3,000
            </SourceMark>
            . The dividend allowance went from{' '}
            <SourceMark n={3} href="https://www.gov.uk/tax-on-dividends">
              £2,000 to £1,000 to £500
            </SourceMark>{' '}
            across the same period. The pension annual allowance rose from{' '}
            <SourceMark
              n={4}
              href="https://www.gov.uk/tax-on-your-private-pension/annual-allowance"
            >
              £40,000 to £60,000
            </SourceMark>{' '}
            in 2023/24.
          </p>
          <p>
            <strong>Anything stale has been stale for years.</strong> These
            aren&apos;t April 2026 changes. A page still quoting £6,000 has been
            publicly wrong through two or three tax years.
          </p>
          <p>
            <strong>This April gave you no warning.</strong> None of the main
            personal allowances moved in April 2026. The dividend rate change
            was the only thing most firms had to touch. A firm that updated its
            dividend rates and found nothing else to change concluded the site
            was current. The 2023 and 2024 cuts were never caught, because the
            review that would have caught them was looking at the wrong year.
          </p>
          <p>
            <strong>Your prospects check now.</strong> They paste adviser
            websites into chatbots and ask them questions. A wrong allowance on
            a public page is no longer something a visitor has to notice for
            themselves.
          </p>
        </Prose>
        <div className="mt-10">
          <FigureCheck variant="inline" />
        </div>
      </Section>

      <Section label="Scope">
        <div className="space-y-5 text-[0.9375rem] leading-[1.7] text-ink-soft">
          <p>
            This checks whether published figures are current. The check
            doesn&apos;t assess compliance, suitability or financial promotion
            rules, and doesn&apos;t replace anyone&apos;s review. Your firm
            remains responsible for its own content. If the check finds nothing,
            that&apos;s a good result and cost you nothing to have confirmed.
          </p>
        </div>
      </Section>

      <BookACall variant="standing" placement="home_footer" />
    </FigureCheckProvider>
  );
}
