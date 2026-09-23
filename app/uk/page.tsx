import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/Button';
import LandingSlideViewer from '@/components/landing/uk/LandingSlideViewer';
import EmbeddedExitCalculator from '@/components/landing/uk/EmbeddedExitCalculator';
import { loadPresentationSlides } from '@/lib/uk-landing/loadSlides';
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

const foundingPartnersMailto = `mailto:${contactEmail}?subject=${encodeURIComponent(
  'FinPrint Founding Partners Programme Application',
)}`;

export default function UkLandingPage() {
  const slides = loadPresentationSlides();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* HERO */}
        <section className="bg-gradient-to-br from-[#1E2A4A] via-[#2D3561] to-[#0a2463] py-20 text-white lg:py-28">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <p className="mb-6 text-xs font-semibold tracking-widest text-[var(--color-accent)] uppercase">
              FinPrint Founding Partners Programme
            </p>
            <h1 className="mb-6 text-3xl leading-tight font-bold text-white sm:text-4xl lg:text-5xl">
              Show HNW Business Owners You Understand Their World, and Progress
              Them Towards Paid Advice
            </h1>
            <p className="mx-auto mb-6 max-w-3xl text-lg leading-relaxed text-[#CBD5E1] sm:text-xl">
              FinPrint helps UK financial advice firms turn complex prospect
              information into a clear, personal, adviser-reviewed demonstration
              of understanding, while the appointment decision is still live.
            </p>
            <p className="mx-auto mb-10 max-w-3xl text-base leading-relaxed text-[#CBD5E1]">
              Give valuable business-owner prospects tangible evidence that your
              firm understands their business, wealth, family circumstances,
              priorities and the decisions they&apos;re facing, without
              committing heavy adviser and paraplanner time before you know
              they&apos;ll become a client.
            </p>
            <div className="mb-10 inline-flex flex-col items-center justify-center gap-2 rounded-xl border border-[rgba(0,200,224,0.25)] bg-white/5 px-6 py-4 sm:flex-row sm:gap-6">
              <p className="text-lg font-semibold text-white">
                Our Founding Partner Pilot costs £495
              </p>
              <p className="text-sm text-[#94A3B8]">
                Open to the first 10 qualifying UK IFA firms.
              </p>
            </div>
            <div className="mb-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                href={foundingPartnersMailto}
                className="border-none bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-strong)]"
              >
                Apply to Become a Founding Partner
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

        {/* THE CHALLENGE */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-3xl px-6">
            <SectionLabel>The Challenge</SectionLabel>
            <h2 className="mb-8 text-3xl font-bold text-[var(--color-primary)] sm:text-4xl">
              How Much Work Do You Do Before They Become a Client?
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-[var(--color-text-secondary)]">
              <p>
                Established IFA firms already have the skill to advise complex
                HNW business owners. The harder question sits earlier. Can that
                skill and care show up clearly enough, soon enough, to shape who
                the prospect appoints?
              </p>
              <p>
                For a valuable business-owner prospect, doing the preparation
                properly can mean understanding linked issues across:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>their business</li>
                <li>personal wealth</li>
                <li>family circumstances</li>
                <li>pensions and investments</li>
                <li>property and debt</li>
                <li>succession and exit plans</li>
                <li>tax considerations</li>
                <li>liquidity</li>
                <li>competing personal objectives</li>
              </ul>
              <p>
                And yet the firm does not yet know whether the prospect will
                appoint them.
              </p>
              <p>
                Too little preparation and the prospect experience can feel
                generic. Too much preparation and costly adviser and paraplanner
                time is committed before there is a client relationship.
              </p>
              <p className="font-semibold text-[var(--color-text-primary)]">
                FinPrint is designed to make your firm&apos;s specialist
                understanding visible without requiring the cost of winning
                complex clients to rise at the same rate as your opportunities.
              </p>
            </div>
          </div>
        </section>

        {/* THE FINPRINT DIFFERENCE */}
        <section className="bg-[var(--color-surface)] py-20">
          <div className="mx-auto max-w-3xl px-6">
            <SectionLabel>The FinPrint Difference</SectionLabel>
            <h2 className="mb-8 text-3xl font-bold text-[var(--color-primary)] sm:text-4xl">
              Make Your Expertise Visible
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-[var(--color-text-secondary)]">
              <p>
                Capable advisers often already know how to help. What the
                prospect needs is tangible proof that your firm understands{' '}
                <em>their</em> particular situation.
              </p>
              <p className="text-xl font-semibold text-[var(--color-text-primary)]">
                Not just their numbers. Their situation.
              </p>
              <p>
                FinPrint connects Business + Wealth + Family + Priorities +
                Decisions into a coherent prospect-facing Financial Pathway
                Pack.
              </p>
              <p>
                The Pack is built to show understanding. The adviser remains
                responsible for professional judgement, review and approval.
                FinPrint does not provide regulated financial advice.
              </p>
            </div>
          </div>
        </section>

        {/* FINANCIAL PATHWAY PACK */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-3xl px-6">
            <SectionLabel>The Deliverable</SectionLabel>
            <h2 className="mb-8 text-3xl font-bold text-[var(--color-primary)] sm:text-4xl">
              A Personal Demonstration of Understanding
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-[var(--color-text-secondary)]">
              <p>
                The Financial Pathway Pack is the core FinPrint deliverable. And
                the Pack is not merely:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>a generic AI report</li>
                <li>meeting notes</li>
                <li>a marketing brochure</li>
                <li>a tax calculation</li>
                <li>a template with the client&apos;s name inserted</li>
              </ul>
              <p>
                Instead, fragmented information about the prospect becomes a
                clear, evidence-grounded and adviser-reviewed picture of the
                issues, priorities and decisions relevant to them.
              </p>
              <p>
                Clear, jargon-free writing sits at the centre. The aim is
                simple. Help the prospect feel understood, in language they can
                follow, while the adviser keeps full control of what reaches
                them.
              </p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
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
                  Step 1. Before Discovery
                </h3>
                <p className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">
                  Initial Financial Pathway Pack within 24 hours
                </p>
                <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  FinPrint turns the available prospect information into an
                  initial Financial Pathway Pack. The adviser reviews the
                  analysis, validates the content and prepares for discovery.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  Adviser review stays in the path. Nothing reaches the prospect
                  without that step.
                </p>
              </div>
              <div className="rounded-xl border border-[var(--color-border-subtle)] bg-white p-8 shadow-sm">
                <MessageSquare
                  className="mb-4 h-10 w-10 text-[var(--color-accent)]"
                  aria-hidden
                />
                <h3 className="mb-3 text-xl font-semibold text-[var(--color-primary)]">
                  Step 2. During Discovery
                </h3>
                <p className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">
                  Add the Context Only a Conversation Can Reveal
                </p>
                <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  Discovery adds nuance, motives, priorities and information
                  that were not available at the start. The adviser retains
                  professional judgement and control throughout.
                </p>
              </div>
              <div className="rounded-xl border border-[var(--color-border-subtle)] bg-white p-8 shadow-sm">
                <RefreshCw
                  className="mb-4 h-10 w-10 text-[var(--color-accent)]"
                  aria-hidden
                />
                <h3 className="mb-3 text-xl font-semibold text-[var(--color-primary)]">
                  Step 3. After Discovery
                </h3>
                <p className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">
                  Updated While the Appointment Decision Is Still Live
                </p>
                <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  FinPrint updates the Financial Pathway Pack following
                  discovery. The workflow is designed so the adviser can review,
                  refine and approve the updated Pack with a target of placing
                  the Pack in the prospect&apos;s hands within two hours of the
                  discovery meeting ending, assuming an efficient workflow and
                  prompt adviser review.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  That timing matters. The prospect may receive tangible
                  evidence of the firm&apos;s understanding while still
                  evaluating advisers, and potentially before meeting the next
                  adviser on their shortlist. Appointment is never promised.
                </p>
              </div>
            </div>
            <div className="mx-auto mt-12 max-w-3xl space-y-4 text-lg leading-relaxed text-[var(--color-text-secondary)]">
              <p>
                After discovery, the firm can run up to three analysis passes to
                test assumptions, explore scenarios and compare readings before
                deciding which version is right to put in front of the prospect.
              </p>
              <p>
                The aim is to reduce the pressure of a single shot at the right
                reading. Conversion is never guaranteed.
              </p>
            </div>
          </div>
        </section>

        {/* PRESENTATION */}
        <section className="bg-gradient-to-b from-[#1E2A4A] to-[#2D3561] py-20">
          <div className="mx-auto max-w-5xl px-6">
            <SectionLabel>See FinPrint in Action</SectionLabel>
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              Walk Through a Sample Financial Pathway Pack
            </h2>
            <p className="mb-10 max-w-2xl text-[#CBD5E1]">
              Explore a sample walkthrough built for UK financial advisers
              working with HNW business-owner prospects. The slides show the
              shape of the Pack, not a promise of commercial results.
            </p>
            <LandingSlideViewer slides={slides} />
          </div>
        </section>

        {/* INTELLIGENT WARNINGS */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-4xl px-6">
            <SectionLabel>Intelligent Warnings</SectionLabel>
            <h2 className="mb-8 text-center text-3xl font-bold text-[var(--color-primary)] sm:text-4xl">
              Important Issues Shouldn&apos;t Hide in the Detail
            </h2>
            <p className="mx-auto mb-12 max-w-3xl text-center text-lg leading-relaxed text-[var(--color-text-secondary)]">
              Complex business-owner situations often hide material points in
              the noise. FinPrint surfaces two Intelligent Warnings outputs to
              support adviser judgement, not replace that judgement.
            </p>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-8">
                <AlertTriangle
                  className="mb-4 h-10 w-10 text-[var(--color-accent)]"
                  aria-hidden
                />
                <h3 className="mb-3 text-xl font-semibold text-[var(--color-primary)]">
                  Adviser Intelligent Warnings
                </h3>
                <p className="leading-relaxed text-[var(--color-text-secondary)]">
                  Highlights important issues, risks, information gaps or
                  considerations the adviser may need to examine before the Pack
                  goes further.
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
                  Turns suitable issues into clear client-facing wording that
                  the adviser can review, approve and send.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CALCULATOR */}
        <section
          id="calculator"
          className="scroll-mt-20 bg-[var(--color-surface)] py-20"
        >
          <div className="mx-auto max-w-4xl px-6">
            <SectionLabel>A FinPrint Preview</SectionLabel>
            <h2 className="mb-3 text-3xl font-bold text-[var(--color-primary)] sm:text-4xl">
              See a Small Part of What FinPrint Can Surface
            </h2>
            <div className="mb-10 space-y-6 leading-relaxed text-[var(--color-text-secondary)]">
              <p>
                The calculator below shows a narrow part of the FinPrint
                approach: Turning a handful of facts about a business-owner
                prospect into useful, quantified insight.
              </p>
              <p>
                Enter a sample exit scenario to see the type of calculation that
                could sit inside a Financial Pathway Pack.
              </p>
              <p className="font-semibold text-[var(--color-text-primary)]">
                The full FinPrint process goes much further.
              </p>
              <p>
                FinPrint connects the prospect&apos;s business, wealth, family
                circumstances, priorities and key decisions into a personal,
                adviser-reviewed picture designed to show that your firm
                understands their situation, not simply their numbers.
              </p>
              <p className="text-sm italic">
                Preview a FinPrint calculation. No sign-in required. Results are
                yours to review at once.
              </p>
            </div>
            <EmbeddedExitCalculator />
          </div>
        </section>

        {/* CONTROLLED BY DESIGN */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-3xl px-6">
            <SectionLabel>Controlled by Design</SectionLabel>
            <h2 className="mb-8 text-3xl font-bold text-[var(--color-primary)] sm:text-4xl">
              AI Does the Heavy Lifting. Your Firm Retains the Judgement.
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-[var(--color-text-secondary)]">
              <p>
                AI sits behind parts of the FinPrint process. AI is not the
                primary offer. Adviser review and approval remain central.
              </p>
              <p>
                Financially material calculations are formula-driven and
                deterministic where that is how the system works. Narrative
                intelligence can use AI. Outputs are built to be traceable and
                explainable.
              </p>
              <p>
                Authoritative sources are used where applicable, including
                curated material drawn from gov.uk, HMRC and the FCA. External
                sources can be live at the time of generation and cited in full.
              </p>
              <p>
                The adviser decides what goes in front of the prospect. FinPrint
                supports professional judgement rather than replacing that
                judgement.
              </p>
              <p>
                No client data is stored server-side between sessions. Your firm
                holds the client data payload. The system generates the output
                and returns control to you. Nothing persists without adviser
                action.
              </p>
              <p className="font-semibold text-[var(--color-text-primary)]">
                No silent failures. No unsupported claims. No figures you cannot
                defend.
              </p>
            </div>
          </div>
        </section>

        {/* WHO IT'S FOR */}
        <section className="bg-[var(--color-surface)] py-20">
          <div className="mx-auto max-w-3xl px-6">
            <SectionLabel>Who FinPrint Is For</SectionLabel>
            <h2 className="mb-8 text-3xl font-bold text-[var(--color-primary)] sm:text-4xl">
              FinPrint Isn&apos;t for Every Prospect, and FinPrint Isn&apos;t
              for Every Firm
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-[var(--color-text-secondary)]">
              <p>
                FinPrint is built for a selective use case. The fit is strongest
                where the prospect opportunity already justifies personalised
                pre-engagement work.
              </p>
              <p className="font-semibold text-[var(--color-text-primary)]">
                Strong fit:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  Established UK IFA / financial planning / wealth management
                  firm
                </li>
                <li>Typically 8-15 advisers</li>
                <li>Around £2.5m-£6m annual firm turnover</li>
                <li>
                  Already working with, or actively seeking, HNW business
                  owners, founders, directors, partners, practice owners and
                  post-exit entrepreneurs
                </li>
                <li>
                  Already receiving credible, qualified high-value opportunities
                </li>
                <li>
                  Winning a further suitable relationship would be worth
                  materially more than the cost of a FinPrint Pack
                </li>
                <li>
                  Already commits adviser and paraplanner resource to prospect
                  preparation
                </li>
                <li>
                  Can review and approve the output before the Pack reaches the
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
                <li>
                  Firms without an adviser-led review and approval process
                </li>
                <li>Mass-market prospecting</li>
                <li>
                  Firms without a meaningful HNW or business-owner proposition
                </li>
              </ul>
              <p>
                That focus is deliberate. FinPrint is meant for firms already
                investing serious time in the right conversations, and looking
                for a more scalable way to show understanding before
                appointment.
              </p>
            </div>
          </div>
        </section>

        {/* FOUNDING PARTNERS */}
        <section id="founding-partners" className="scroll-mt-20 bg-white py-20">
          <div className="mx-auto max-w-3xl px-6">
            <SectionLabel>Founding Partners Programme</SectionLabel>
            <h2 className="mb-8 text-3xl font-bold text-[var(--color-primary)] sm:text-4xl">
              Help Shape FinPrint Before Wider Release
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-[var(--color-text-secondary)]">
              <p>
                Wrigital is inviting the first 10 qualifying UK IFA firms to
                take part in the FinPrint Founding Partners Programme. This is
                early access during commercial validation and refinement, not a
                generic software sale.
              </p>
              <div className="my-8 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-8 text-center">
                <p className="mb-3 text-sm font-semibold tracking-widest text-[var(--color-accent)] uppercase">
                  Founding Partner Price
                </p>
                <p className="mb-3 text-4xl font-bold text-[var(--color-primary)] sm:text-5xl">
                  £495
                </p>
                <p className="text-[var(--color-text-secondary)]">
                  Planned standard Financial Pathway Pack price is £1,200
                </p>
              </div>
              <p>
                Founding Partners receive early access at £495 because FinPrint
                is still in commercial validation and refinement. In return,
                participating firms will be asked for structured feedback on the
                FinPrint experience, workflow and usefulness in suitable
                prospect situations.
              </p>
              <p>
                The programme is selective. Places are for firms that fit the
                intended FinPrint use case described above.
              </p>
              <p>
                FinPrint does not guarantee that a prospect will appoint the
                firm. The Pack is designed to help make understanding visible
                while that decision is still open.
              </p>
            </div>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                href={foundingPartnersMailto}
                className="border-none bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-strong)]"
              >
                Apply to Become a Founding Partner
              </Button>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="bg-gradient-to-br from-[#1E2A4A] via-[#2D3561] to-[#0a2463] py-20 text-white">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <SectionLabel>Founding Partners</SectionLabel>
            <h2 className="mb-8 text-3xl font-bold text-white sm:text-4xl">
              We&apos;re Looking for 10 Firms FinPrint Was Built For
            </h2>
            <p className="mb-6 text-lg leading-relaxed text-[#CBD5E1]">
              If your firm already works with valuable business-owner prospects,
              already invests professional time preparing for discovery, and
              wants a more scalable way to show understanding before
              appointment, your firm may be a strong fit for the Founding
              Partners Programme.
            </p>
            <div className="mb-10 inline-flex flex-col items-center justify-center gap-2 rounded-xl border border-[rgba(0,200,224,0.25)] bg-white/5 px-6 py-4 sm:flex-row sm:gap-6">
              <p className="text-lg font-semibold text-white">
                Become a Founding Partner for £495
              </p>
              <p className="text-sm text-[#94A3B8]">
                First 10 qualifying UK IFA firms
              </p>
            </div>
            <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                href={foundingPartnersMailto}
                className="border-none bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-strong)]"
              >
                Apply to Become a Founding Partner
              </Button>
              <Button
                href="#calculator"
                variant="secondary"
                className="border-white text-white hover:bg-white hover:text-[var(--color-primary)]"
              >
                Preview a FinPrint Calculation
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

        {/* UK FOOTER NOTE */}
        <section className="border-t border-[var(--color-border-subtle)] bg-[var(--color-surface)] py-8">
          <div className="mx-auto max-w-4xl space-y-3 px-6 text-center text-sm text-[var(--color-text-secondary)]">
            <p>
              Wrigital Ltd | FinPrint | Adviser-Reviewed Financial Pathway Packs
              for UK Financial Advice Firms
            </p>
            <p>
              FinPrint is a technology product from Wrigital. FinPrint does not
              provide financial advice. All outputs are designed for use by
              FCA-regulated financial advisers and are subject to adviser review
              and approval before use.
            </p>
            <p>
              Robert Hartley and Hartley Precision Components Ltd, where
              referenced in demonstration materials, are AI-generated fictional
              characters created for demonstration purposes only.
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
