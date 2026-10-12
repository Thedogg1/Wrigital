import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/Button';
import FoundingPartnerApplyButton from '@/components/landing/FoundingPartnerApplyButton';
import LandingSlideViewer from '@/components/landing/us/LandingSlideViewer';
import FreeBlueprintForm from '@/components/landing/us/FreeBlueprintForm';
import { loadUsPresentationSlides } from '@/lib/us-landing/loadSlides';
import { contactEmail, contactMailto } from '@/lib/email/config';
import { siteUrl } from '@/lib/site';
import Link from 'next/link';
import {
  FileText,
  MessageSquare,
  RefreshCw,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-xs font-semibold tracking-widest text-[var(--color-accent)] uppercase">
      {children}
    </p>
  );
}

export default function UsaLandingPage() {
  const slides = loadUsPresentationSlides();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-[#1E2A4A] via-[#2D3561] to-[#0a2463] py-20 text-white lg:py-28">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <p className="mb-6 text-xs font-semibold tracking-widest text-[var(--color-accent)] uppercase">
              FinPrint Founding Partners Program
            </p>
            <h1 className="mb-6 text-3xl leading-tight font-bold text-white sm:text-4xl lg:text-5xl">
              Show HNW Business Owners You Understand Their Situation - before
              They&apos;ve Appointed You.
            </h1>
            <p className="mx-auto mb-6 max-w-3xl text-lg leading-relaxed text-[#CBD5E1] sm:text-xl">
              FinPrint helps US RIA advisors demonstrate a deeper understanding
              of valuable business-owner prospects without committing days of
              research and preparation before knowing whether they&apos;ll win
              the relationship.
            </p>
            <p className="mx-auto mb-10 max-w-3xl text-base leading-relaxed text-[#CBD5E1]">
              Enter discovery better prepared, ask sharper questions, and put
              personalised, advisor-reviewed financial insights in your
              prospect&apos;s hands while the appointment decision is still
              live.
            </p>
            <div className="mb-10 inline-flex flex-col items-center justify-center gap-2 rounded-xl border border-[rgba(0,200,224,0.25)] bg-white/5 px-6 py-4 sm:flex-row sm:gap-6">
              <p className="text-lg font-semibold text-white">
                $595 for two Financial Pathway Packs
              </p>
              <p className="text-sm text-[#94A3B8]">
                Around one genuine HNW business-owner prospect. Maximum 10
                FinPrint clients onboarded each month.
              </p>
            </div>
            <div className="mb-6 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
              <FoundingPartnerApplyButton />
              <Button
                href="#free-finprint"
                variant="secondary"
                className="border-white text-white hover:bg-white hover:text-[var(--color-primary)]"
              >
                Request My Complimentary Business Owner Analysis
              </Button>
            </div>
            <a
              href="#how-finprint-works"
              className="text-sm text-[#94A3B8] underline underline-offset-4 transition-colors hover:text-[var(--color-accent)]"
            >
              See How FinPrint Works
            </a>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-3xl px-6">
            <SectionLabel>The Challenge</SectionLabel>
            <h2 className="mb-8 text-3xl font-bold text-[var(--color-primary)] sm:text-4xl">
              How Do You Demonstrate Your Understanding Before They&apos;ve
              Appointed You?
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-[var(--color-text-secondary)]">
              <p>
                You already have the expertise to advise high-net-worth business
                owners.
              </p>
              <p>
                The challenge comes when a valuable prospect is choosing between
                advisors. How do you make the depth of your understanding
                visible before you&apos;ve had the opportunity to work together?
              </p>
              <p>
                Properly understanding a business owner&apos;s circumstances can
                involve their business, wealth, family priorities, liquidity,
                succession and financial decisions.
              </p>
              <p>
                That level of preparation takes time, and the prospect may still
                choose another advisor.
              </p>
              <p>
                FinPrint helps you demonstrate understanding without the
                preparation burden growing at the same rate as the opportunities
                you&apos;re pursuing.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-surface)] py-20">
          <div className="mx-auto max-w-3xl px-6">
            <SectionLabel>The FinPrint Difference</SectionLabel>
            <h2 className="mb-8 text-3xl font-bold text-[var(--color-primary)] sm:text-4xl">
              Clear for the Prospect. Deep for the Advisor.
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-[var(--color-text-secondary)]">
              <p>
                The prospect receives clear, personalised financial insights
                after advisor review and approval. The advisor retains the
                supporting evidence, calculations, research, warnings and audit
                trail.
              </p>
              <p>
                Financial Insights connects Business + Wealth + Family +
                Priorities + Decisions. It is the document for the prospect. The
                advisor receives the six-document Financial Pathway Pack and
                decides what is appropriate to present.
              </p>
              <p>
                FinPrint supports professional judgement. It does not replace
                it, and it does not provide investment, tax, or legal advice.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-3xl px-6">
            <SectionLabel>The Deliverable</SectionLabel>
            <h2 className="mb-8 text-3xl font-bold text-[var(--color-primary)] sm:text-4xl">
              A Personal Demonstration of Understanding
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-[var(--color-text-secondary)]">
              <p>The advisor receives all six:</p>
              <ol className="list-decimal space-y-2 pl-6">
                <li>
                  <span className="font-semibold text-[var(--color-text-primary)]">
                    Blueprint.
                  </span>{' '}
                  The underlying analytical foundation.
                </li>
                <li>
                  <span className="font-semibold text-[var(--color-text-primary)]">
                    Financial Insights.
                  </span>{' '}
                  The document for the prospect after advisor review and
                  approval.
                </li>
                <li>
                  <span className="font-semibold text-[var(--color-text-primary)]">
                    Warnings File.
                  </span>{' '}
                  Supporting warnings for advisor consideration.
                </li>
                <li>
                  <span className="font-semibold text-[var(--color-text-primary)]">
                    Numbers Audit.
                  </span>{' '}
                  Supporting audit of the numbers and calculations.
                </li>
                <li>
                  <span className="font-semibold text-[var(--color-text-primary)]">
                    Information Audit.
                  </span>{' '}
                  Supporting audit of the information used, gaps and related
                  information considerations.
                </li>
                <li>
                  <span className="font-semibold text-[var(--color-text-primary)]">
                    External Sources Audit.
                  </span>{' '}
                  Supporting audit of the external research and sources used.
                </li>
              </ol>
              <p>
                Clear for the prospect: the reviewed and approved Financial
                Insights document. Deep for the advisor: the rest of the Pack.
                The advisor decides what is appropriate to present.
              </p>
              <p>Financial Insights is not:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>a generic AI report</li>
                <li>meeting notes</li>
                <li>a marketing brochure</li>
                <li>a tax calculation</li>
                <li>a template with the client&apos;s name inserted</li>
              </ul>
              <p>The advisor keeps control of what reaches the prospect.</p>
            </div>
          </div>
        </section>

        <section
          id="how-finprint-works"
          className="scroll-mt-20 bg-[var(--color-surface)] py-20"
        >
          <div className="mx-auto max-w-4xl px-6">
            <SectionLabel>How FinPrint Works</SectionLabel>
            <h2 className="mb-12 text-center text-3xl font-bold text-[var(--color-primary)] sm:text-4xl">
              Understanding That Builds Before, During and After Discovery
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="rounded-xl border border-[var(--color-border-subtle)] bg-white p-8 shadow-sm">
                <FileText
                  className="mb-4 h-10 w-10 text-[var(--color-accent)]"
                  aria-hidden
                />
                <h3 className="mb-3 text-xl font-semibold text-[var(--color-primary)]">
                  Before discovery
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  The advisor supplies what they already know, then reviews and
                  approves the numerical and research foundation. Pack 1 is
                  targeted within a 24-hour window, subject to the agreed
                  workflow, a dedicated production slot, and advisor review.
                  That pre-discovery intelligence is there to prepare for the
                  meeting. Financial Insights does not reach the prospect
                  without that review.
                </p>
              </div>
              <div className="rounded-xl border border-[var(--color-border-subtle)] bg-white p-8 shadow-sm">
                <MessageSquare
                  className="mb-4 h-10 w-10 text-[var(--color-accent)]"
                  aria-hidden
                />
                <h3 className="mb-3 text-xl font-semibold text-[var(--color-primary)]">
                  During discovery
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  The advisor applies professional judgement, explores the
                  owner&apos;s circumstances, and asks the questions that
                  matter.
                </p>
              </div>
              <div className="rounded-xl border border-[var(--color-border-subtle)] bg-white p-8 shadow-sm">
                <RefreshCw
                  className="mb-4 h-10 w-10 text-[var(--color-accent)]"
                  aria-hidden
                />
                <h3 className="mb-3 text-xl font-semibold text-[var(--color-primary)]">
                  After discovery
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  FinPrint incorporates what was learned into Pack 2:
                  personalised, advisor-reviewed financial insights. These are
                  targeted to be in the prospect&apos;s hands within two hours
                  of the meeting ending, subject to the agreed workflow, a
                  dedicated production slot, and advisor review and approval.
                  The prospect may still be choosing an advisor. Appointment is
                  never promised.
                </p>
              </div>
            </div>
            <div className="mx-auto mt-12 max-w-3xl space-y-4 text-lg leading-relaxed text-[var(--color-text-secondary)]">
              <p>
                After discovery the advisor can run up to three analysis passes
                to test assumptions, explore scenarios and compare what emerges
                before deciding what to present. Appointment is never
                guaranteed.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-[#1E2A4A] to-[#2D3561] py-20">
          <div className="mx-auto max-w-5xl px-6">
            <SectionLabel>See FinPrint in Action</SectionLabel>
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              Walk Through a Financial Pathway Pack
            </h2>
            <p className="mb-10 max-w-2xl text-[#CBD5E1]">
              The slides show the shape of the Pack. They are not the
              Complimentary Business Owner Analysis, and they are not a promise
              of commercial results.
            </p>
            <LandingSlideViewer slides={slides} />
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-4xl px-6">
            <SectionLabel>Intelligent Warnings</SectionLabel>
            <h2 className="mb-8 text-center text-3xl font-bold text-[var(--color-primary)] sm:text-4xl">
              Important Issues Shouldn&apos;t Hide in the Detail
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-8">
                <AlertTriangle
                  className="mb-4 h-10 w-10 text-[var(--color-accent)]"
                  aria-hidden
                />
                <h3 className="mb-3 text-xl font-semibold text-[var(--color-primary)]">
                  Advisor Intelligent Warnings
                </h3>
                <p className="leading-relaxed text-[var(--color-text-secondary)]">
                  Highlight issues, risks, gaps, or considerations the advisor
                  may need to examine.
                </p>
              </div>
              <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-8">
                <ShieldCheck
                  className="mb-4 h-10 w-10 text-[var(--color-accent)]"
                  aria-hidden
                />
                <h3 className="mb-3 text-xl font-semibold text-[var(--color-primary)]">
                  Client Intelligent Warnings
                </h3>
                <p className="leading-relaxed text-[var(--color-text-secondary)]">
                  Turn suitable issues into wording the advisor can review and
                  approve for Financial Insights.
                </p>
              </div>
            </div>
            <p className="mx-auto mt-8 max-w-3xl text-center text-lg leading-relaxed text-[var(--color-text-secondary)]">
              Neither replaces judgement.
            </p>
          </div>
        </section>

        <section
          id="free-finprint"
          className="scroll-mt-20 bg-[var(--color-surface)] py-20"
        >
          <div className="mx-auto max-w-4xl px-6">
            <SectionLabel>Complimentary Business Owner Analysis</SectionLabel>
            <h2 className="mb-8 text-3xl font-bold text-[var(--color-primary)] sm:text-4xl">
              See the Depth of Understanding FinPrint Can Bring to a
              Business-Owner Situation.
            </h2>
            <div className="mb-10 space-y-6 text-lg leading-relaxed text-[var(--color-text-secondary)]">
              <p>
                Describe a business-owner situation your firm would recognise,
                using a representative scenario or a genuine situation with
                identifying details removed.
              </p>
              <p>
                We&apos;ll carry out the research and create a personalised
                Business Owner Analysis Blueprint, returned as an HTML report,
                for you to review. This is a genuine analysis of the situation
                you describe. It is not a generic brochure.
              </p>
              <p>The Blueprint can include:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>relevant external research</li>
                <li>financial calculations and analytical considerations</li>
                <li>assumptions and information gaps</li>
                <li>issues and decisions worth exploring</li>
                <li>areas requiring advisor judgement</li>
              </ul>
              <p>
                You&apos;ll see the research, calculations, assumptions and
                potential discovery considerations behind the analysis, so you
                can judge its depth for yourself.
              </p>
              <p>
                This complimentary analysis delivers the Blueprint only. It does
                not include the complete Financial Pathway Pack. If the firm
                later uses FinPrint, that Blueprint can be the foundation of the
                wider Pack.
              </p>
            </div>
            <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="rounded-xl border border-[var(--color-border-subtle)] bg-white p-8">
                <h3 className="mb-3 text-xl font-semibold text-[var(--color-primary)]">
                  Complimentary Business Owner Analysis
                </h3>
                <p className="leading-relaxed text-[var(--color-text-secondary)]">
                  A personalised Business Owner Analysis Blueprint from the
                  research on the situation you describe. The Blueprint only,
                  not the complete Financial Pathway Pack.
                </p>
              </div>
              <div className="rounded-xl border border-[var(--color-border-subtle)] bg-white p-8">
                <h3 className="mb-3 text-xl font-semibold text-[var(--color-primary)]">
                  Founding Partner pilot
                </h3>
                <p className="leading-relaxed text-[var(--color-text-secondary)]">
                  The complete advisor-controlled workflow on one genuine
                  qualified HNW business-owner prospect. $595 covers two Packs
                  around that prospect: Pack 1 before discovery, targeted
                  within 24 hours, and Pack 2 after the meeting, targeted
                  within two hours. No appointment is guaranteed.
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-[var(--color-border-subtle)] bg-white p-6 shadow-sm sm:p-8">
              <p className="mb-8 text-lg leading-relaxed text-[var(--color-text-secondary)]">
                Describe a business-owner situation your firm would recognise.
                Use a representative scenario, or a genuine one with identifying
                details removed. We&apos;ll carry out the research and create a
                personalised Business Owner Analysis Blueprint for you to
                review.
              </p>
              <FreeBlueprintForm />
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-3xl px-6">
            <SectionLabel>Controlled by Design</SectionLabel>
            <h2 className="mb-8 text-3xl font-bold text-[var(--color-primary)] sm:text-4xl">
              Your Firm Retains the Judgement.
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-[var(--color-text-secondary)]">
              <p>
                Advisor review and approval remain central. FinPrint supports
                professional judgement. It does not replace it. AI sits behind
                parts of the process. AI is not the primary offer.
              </p>
              <p>
                Financially material calculations are formula-driven and
                deterministic where that is how the system works. Narrative can
                use AI. Outputs are built to be traceable and explainable.
              </p>
              <p>
                Authoritative sources include curated material from the IRS, the
                SEC, and FINRA. External sources can be live at the time of
                generation and cited in full.
              </p>
              <p>
                The advisor decides what goes in front of the prospect. No
                client data is stored server-side between sessions. The firm
                holds the payload. Nothing persists without advisor action.
              </p>
              <p className="font-semibold text-[var(--color-text-primary)]">
                No silent failures. No unsupported claims. No figures the firm
                cannot defend.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-surface)] py-20">
          <div className="mx-auto max-w-3xl px-6">
            <SectionLabel>Who FinPrint Is For</SectionLabel>
            <h2 className="mb-8 text-3xl font-bold text-[var(--color-primary)] sm:text-4xl">
              FinPrint Isn&apos;t for Every Prospect, and FinPrint Isn&apos;t
              for Every Firm
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-[var(--color-text-secondary)]">
              <p className="font-semibold text-[var(--color-text-primary)]">
                Strong fit:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  A US RIA advisor who already serves HNW business owners
                  approaching a liquidity event, sale, succession or exit
                </li>
                <li>
                  Typically working with owners 3 to 7 years from that event
                </li>
                <li>
                  A practice where the average client generates $10,000 or more
                  in annual revenue, typically representing $1 million or more
                  in assets under management
                </li>
                <li>
                  Already receiving qualified, high-value business-owner
                  opportunities
                </li>
                <li>
                  A further suitable relationship worth materially more than the
                  cost of a Pack
                </li>
                <li>
                  Able to review and approve the output before it reaches the
                  prospect
                </li>
              </ul>
              <p className="font-semibold text-[var(--color-text-primary)]">
                Not designed for:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Cold names</li>
                <li>Purchased lists</li>
                <li>Low-intent enquiries</li>
                <li>Low-value prospects</li>
                <li>Firms without enough initial prospect context</li>
                <li>Firms without an advisor-led review</li>
                <li>Mass-market prospecting</li>
                <li>
                  Firms without a meaningful HNW or business-owner proposition
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="founding-partners" className="scroll-mt-20 bg-white py-20">
          <div className="mx-auto max-w-3xl px-6">
            <SectionLabel>Founding Partners Program</SectionLabel>
            <h2 className="mb-8 text-3xl font-bold text-[var(--color-primary)] sm:text-4xl">
              Two Packs Around One Genuine Prospect
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-[var(--color-text-secondary)]">
              <p>
                The Founding Partner engagement is one complete FinPrint
                engagement around one genuine HNW business-owner prospect.
                Wrigital can onboard a maximum of 10 FinPrint clients per month.
              </p>
              <div className="my-8 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-8 text-center">
                <p className="mb-3 text-sm font-semibold tracking-widest text-[var(--color-accent)] uppercase">
                  Founding Partner Price
                </p>
                <p className="mb-3 text-4xl font-bold text-[var(--color-primary)] sm:text-5xl">
                  $595
                </p>
                <p className="mb-3 text-[var(--color-text-primary)]">
                  Two complete Financial Pathway Packs around one genuine HNW
                  business-owner prospect
                </p>
                <p className="text-[var(--color-text-secondary)]">
                  Subsequent Financial Pathway Packs are $1,500 each
                </p>
              </div>
              <p>
                Pack 1 is prepared before discovery from what the advisor
                already knows. It is targeted within a 24-hour window. Pack 2
                is prepared after discovery. Personalised financial insights
                are targeted to be in the prospect&apos;s hands within two
                hours of the meeting ending. Both windows depend on the agreed
                workflow, a dedicated production slot, and prompt advisor
                review.
              </p>
              <p>
                The Complimentary Business Owner Analysis is the Blueprint the
                firm inspects first. The $595 engagement is in return for brief
                feedback. If satisfied, Founding Partners may be invited to
                consider a short testimonial or case study. FinPrint does not
                guarantee the prospect will appoint the firm.
              </p>
            </div>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <FoundingPartnerApplyButton />
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-[#1E2A4A] via-[#2D3561] to-[#0a2463] py-20 text-white">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <SectionLabel>Founding Partners</SectionLabel>
            <h2 className="mb-8 text-3xl font-bold text-white sm:text-4xl">
              Enter Discovery Prepared. Follow Through While the Decision Is
              Still Live.
            </h2>
            <div className="mb-10 inline-flex flex-col items-center justify-center gap-2 rounded-xl border border-[rgba(0,200,224,0.25)] bg-white/5 px-6 py-4 sm:flex-row sm:gap-6">
              <p className="text-lg font-semibold text-white">
                $595 for two Financial Pathway Packs
              </p>
              <p className="text-sm text-[#94A3B8]">
                Around one genuine HNW business-owner prospect. Maximum 10
                FinPrint clients onboarded each month.
              </p>
            </div>
            <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
              <FoundingPartnerApplyButton />
              <Button
                href="#free-finprint"
                variant="secondary"
                className="border-white text-white hover:bg-white hover:text-[var(--color-primary)]"
              >
                Request My Complimentary Business Owner Analysis
              </Button>
            </div>

            <div className="space-y-1 text-[#CBD5E1]">
              <p>
                <a
                  href={contactMailto}
                  className="text-[var(--color-accent)] hover:underline"
                >
                  {contactEmail}
                </a>
              </p>
              <p>
                <a
                  href={siteUrl}
                  className="text-[var(--color-accent)] hover:underline"
                >
                  {siteUrl.replace(/^https?:\/\//, '')}
                </a>
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-[var(--color-border-subtle)] bg-[var(--color-surface)] py-8">
          <div className="mx-auto max-w-4xl space-y-3 px-6 text-center text-sm text-[var(--color-text-secondary)]">
            <p>
              Wrigital | FinPrint | Advisor-Reviewed Financial Pathway Packs for
              US Advisory Firms
            </p>
            <p>
              FinPrint is a technology product from Wrigital. It does not
              provide financial, tax, or investment advice. All outputs are
              designed for use by SEC- and FINRA-regulated financial advisors
              and are subject to advisor review and approval before use.
            </p>
            <p>
              Marcus T. Ellison and Ellison Dynamics, where referenced in
              demonstration materials, are AI-generated fictional characters
              created for demonstration purposes only.
            </p>
            <p className="flex flex-wrap justify-center gap-4">
              <Link
                href="/privacy"
                className="text-[var(--color-primary)] hover:underline"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-[var(--color-primary)] hover:underline"
              >
                Terms of Use
              </Link>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
