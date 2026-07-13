import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/Button';
import LandingSlideViewer from '@/components/landing/uk/LandingSlideViewer';
import EmbeddedExitCalculator from '@/components/landing/uk/EmbeddedExitCalculator';
import { loadPresentationSlides } from '@/lib/uk-landing/loadSlides';
import { contactEmail, contactMailto } from '@/lib/email/config';
import { siteUrl } from '@/lib/site';
import Link from 'next/link';
import { FileText, CheckCircle, BarChart3 } from 'lucide-react';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className='text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] mb-4'>
      {children}
    </p>
  );
}

export default function UkLandingPage() {
  const slides = loadPresentationSlides();

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />

      <main className='flex-1'>
        {/* HERO */}
        <section className='bg-gradient-to-br from-[#1E2A4A] via-[#2D3561] to-[#0a2463] text-white py-20 lg:py-28'>
          <div className='max-w-5xl mx-auto px-6 text-center'>
            <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-white'>
              Your Prospect Is Already Using AI. Wrigital Sets the Standard.
            </h1>
            <p className='text-lg sm:text-xl text-[#CBD5E1] max-w-3xl mx-auto mb-8 leading-relaxed'>
              Enterprise-grade governance, compliance and adviser-specific intelligence; built for
              firms that cannot afford to compromise.
            </p>
            <div className='text-base text-[#CBD5E1] max-w-2xl mx-auto mb-10 space-y-4 leading-relaxed text-left sm:text-center'>
              <p>
                Financial advisers targeting high-net-worth business owners rarely struggle to get in
                the room. Referrals and reputation open the door.
              </p>
              <p>Converting that introduction into a client is where momentum dies.</p>
              <p>
                Something has changed. Before a prospect takes your call, they&apos;ve already asked
                ChatGPT what their business is worth on exit. They&apos;ve heard the same pitch from
                three other advisers. Their expectations have risen, and the approach that worked
                three years ago doesn&apos;t work the same way anymore.
              </p>
              <p>
                Wrigital is the only system that delivers a complete, quantified financial picture
                of your prospect before you&apos;ve sat down together. Adviser-reviewed,
                formula-driven, FCA-defensible, and designed to make the first meeting close.
              </p>
            </div>
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-4'>
              <Button href='#calculator' className='bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-strong)] border-none'>
                Calculate Your Client&apos;s Exit Tax Position — Free
              </Button>
            </div>
            <p className='text-sm text-[#94A3B8] italic'>
              No obligation. No data stored. Results in under two minutes.
            </p>
          </div>
        </section>

        {/* PROBLEM */}
        <section className='py-20 bg-white'>
          <div className='max-w-3xl mx-auto px-6'>
            <SectionLabel>The Problem</SectionLabel>
            <h2 className='text-3xl sm:text-4xl font-bold text-[var(--color-primary)] mb-8'>
              The Meeting Went Well. They Still Didn&apos;t Sign.
            </h2>
            <div className='space-y-6 text-[var(--color-text-secondary)] text-lg leading-relaxed'>
              <p>
                You asked the right questions. You listened. You had the credentials, the referral
                and the rapport. They said they&apos;d come back to you.
              </p>
              <p>They didn&apos;t.</p>
              <p>
                It&apos;s not your expertise they&apos;re questioning, but if you genuinely
                understand their specific situation. Not business owners in general, but them.
                Their company. Their tax exposure. Their exit timeline. Their actual numbers.
              </p>
              <p>
                Most advisers arrive at the first meeting ready to listen. The prospect has already
                decided whether this adviser feels different from the last three they met, and that
                decision is often made before anyone sits down.
              </p>
              <p>
                Warm leads go cold not from lost interest; they go cold because there&apos;s no
                compelling reason to stay engaged. Life intervenes. The momentum dies. A competitor
                makes contact at the wrong moment.
              </p>
              <p className='font-semibold text-[var(--color-text-primary)]'>
                The gap isn&apos;t in your advice. It&apos;s in what you show them before you give
                it.
              </p>
            </div>
          </div>
        </section>

        {/* AGITATION */}
        <section className='py-20 bg-[var(--color-surface)]'>
          <div className='max-w-3xl mx-auto px-6'>
            <h2 className='text-3xl sm:text-4xl font-bold text-[var(--color-primary)] mb-8'>
              What&apos;s Happening Between the Referral and the First Meeting
            </h2>
            <div className='space-y-6 text-[var(--color-text-secondary)] text-lg leading-relaxed'>
              <p>
                Between the moment a business owner is referred to you and the moment they sit down
                for your discovery call, several things are already happening.
              </p>
              <p>
                They&apos;ve typed your name into Google. They&apos;ve looked at your LinkedIn.
                They&apos;ve asked an AI tool what a business worth £8 million would be liable for
                on exit. They&apos;ve compared how you described your service with how three other
                advisers described theirs.
              </p>
              <p>And right now, your positioning looks almost identical to everyone else&apos;s.</p>
              <p>
                They&apos;ve heard the same words. Holistic. Independent. Client-focused.
                They&apos;ve had the same conversation. They&apos;re waiting for something that makes
                one adviser feel unmistakably different from the rest.
              </p>
              <p>
                What&apos;s missing isn&apos;t effort or expertise; it&apos;s the ability to show a
                prospect something tangible about their own situation before they&apos;ve had to ask
                for it.
              </p>
              <p>
                Empathy alone doesn&apos;t convert — not reliably, not consistently, not at the
                volume a growing firm requires. The prospect feels heard in the room and forgotten
                by the follow-up email. That gap is where deals die.
              </p>
              <p className='font-semibold text-[var(--color-text-primary)]'>
                The advisers who convert at the highest rates give prospects something to hold, read
                and think about between conversations. Something personalised. Something that
                demonstrates understanding before asking for trust.
              </p>
            </div>
          </div>
        </section>

        {/* SOLUTION */}
        <section className='py-20 bg-white'>
          <div className='max-w-3xl mx-auto px-6'>
            <SectionLabel>The Solution</SectionLabel>
            <h2 className='text-3xl sm:text-4xl font-bold text-[var(--color-primary)] mb-8'>
              Intelligence That Makes the First Meeting a Formality
            </h2>
            <div className='space-y-6 text-[var(--color-text-secondary)] text-lg leading-relaxed'>
              <p>
                Wrigital converts the sparse notes you already have into a complete,
                adviser-reviewed financial intelligence report on your HNW business owner prospect;
                it is ready before you walk into the room.
              </p>
              <p>
                Not a generic summary. Not a template dressed up with a name and a number. A
                formula-driven document that identifies the specific financial risks, tax exposures
                and planning opportunities relevant to this client&apos;s situation, with every
                figure traceable and every claim defensible.
              </p>
              <p>The prospect receives a curated version. You keep the full audit trail.</p>
              <p>
                Your first meeting becomes a conversation about solutions; your prospect already
                knows you&apos;ve done the work before they&apos;ve told you a thing.
              </p>
              <p className='font-semibold text-[var(--color-text-primary)]'>
                Everyone else is using AI to cut costs. Wrigital uses it to win clients.
              </p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className='py-20 bg-[var(--color-surface)]'>
          <div className='max-w-4xl mx-auto px-6'>
            <SectionLabel>How It Works</SectionLabel>
            <h2 className='text-3xl sm:text-4xl font-bold text-[var(--color-primary)] mb-12 text-center'>
              Three Steps. One Report. One Conversation Starter.
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              <div className='bg-white rounded-xl p-8 border border-[var(--color-border-subtle)] shadow-sm'>
                <FileText className='w-10 h-10 text-[var(--color-accent)] mb-4' aria-hidden />
                <h3 className='text-xl font-semibold text-[var(--color-primary)] mb-3'>
                  Step 1: Send Your Sparse Notes
                </h3>
                <p className='text-[var(--color-text-secondary)] text-sm leading-relaxed'>
                  You don&apos;t need a complete fact-find. A referral name, a rough business
                  valuation, a sense of the client&apos;s exit timeline, and any personality details
                  the referrer shared. That&apos;s enough.
                </p>
                <p className='text-[var(--color-text-secondary)] text-sm leading-relaxed mt-3'>
                  Wrigital is built to work from what you already know, not from what you wish
                  you&apos;d asked.
                </p>
              </div>
              <div className='bg-white rounded-xl p-8 border border-[var(--color-border-subtle)] shadow-sm'>
                <CheckCircle className='w-10 h-10 text-[var(--color-accent)] mb-4' aria-hidden />
                <h3 className='text-xl font-semibold text-[var(--color-primary)] mb-3'>
                  Step 2: Review and Approve Every Figure
                </h3>
                <p className='text-[var(--color-text-secondary)] text-sm leading-relaxed'>
                  Wrigital extracts and calculates a personalised set of financial data points from
                  your notes, which could include Business Asset Disposal Relief eligibility, retained
                  cash risk, concentration risk and more.
                </p>
                <p className='text-[var(--color-text-secondary)] text-sm leading-relaxed mt-3'>
                  Every figure is formula-driven. Every field is adviser-reviewed before the report
                  generates. You approve it; you can justify every number if challenged. Mandatory
                  fields ensure the core output always runs. Optional fields, selected based on the
                  client&apos;s profile, unlock deeper intelligence across the full report.
                </p>
              </div>
              <div className='bg-white rounded-xl p-8 border border-[var(--color-border-subtle)] shadow-sm'>
                <BarChart3 className='w-10 h-10 text-[var(--color-accent)] mb-4' aria-hidden />
                <h3 className='text-xl font-semibold text-[var(--color-primary)] mb-3'>
                  Step 3: The Report Does the Work
                </h3>
                <p className='text-[var(--color-text-secondary)] text-sm leading-relaxed'>
                  Your prospect receives a prioritised list of planning questions shaped around their
                  actual financial position. You have quietly designed the agenda; your prospect
                  arrives at the first meeting already engaged, already thinking, already invested in
                  the outcome.
                </p>
                <p className='text-[var(--color-text-secondary)] text-sm leading-relaxed mt-3 font-medium text-[var(--color-text-primary)]'>
                  Every report contains four sections as standard:
                </p>
                <ul className='text-[var(--color-text-secondary)] text-sm leading-relaxed mt-2 list-disc pl-5 space-y-1'>
                  <li>Executive Summary</li>
                  <li>
                    Your Story — a narrative that converts the numbers into plain-language insight
                    around the client&apos;s real concerns.
                  </li>
                  <li>
                    What to Discuss With Your Adviser — frames the agenda without the prospect
                    realising you influenced it.
                  </li>
                  <li>Relevant pivot tables built from the formula calculations.</li>
                </ul>
                <p className='text-[var(--color-text-secondary)] text-sm leading-relaxed mt-3 font-medium text-[var(--color-text-primary)]'>
                  Beyond that, Wrigital selects additional sections based on the client&apos;s
                  specific circumstances:
                </p>
                <ul className='text-[var(--color-text-secondary)] text-sm leading-relaxed mt-2 list-disc pl-5 space-y-1'>
                  <li>Core Business and Market Benchmarks</li>
                  <li>Risk, Governance and Resilience</li>
                  <li>Liquidity and Concentration Risk</li>
                  <li>Exit and Valuation Planning</li>
                  <li>Tax and Estate Planning</li>
                </ul>
                <p className='text-[var(--color-text-secondary)] text-sm leading-relaxed mt-3'>
                  No two reports are identical; the system builds around the client, not around a
                  template.
                </p>
                <p className='text-[var(--color-text-secondary)] text-sm leading-relaxed mt-3'>
                  Three separate audit reports give you a complete, FCA-defensible record: a numbers
                  audit, a knowledge base audit drawing on gov.uk, HMRC and FCA sources, and a live
                  external sources report with full citations at the time of generation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PRESENTATION */}
        <section className='py-20 bg-gradient-to-b from-[#1E2A4A] to-[#2D3561]'>
          <div className='max-w-5xl mx-auto px-6'>
            <SectionLabel>See Wrigital in Action</SectionLabel>
            <h2 className='text-3xl sm:text-4xl font-bold text-white mb-4'>
              From Sparse Notes to FCA-Ready Intelligence
            </h2>
            <p className='text-[#CBD5E1] mb-10 max-w-2xl'>
              Walk through a sample pre-meeting report — built for UK financial advisers working with
              HNW business owner clients.
            </p>
            <LandingSlideViewer slides={slides} />
          </div>
        </section>

        {/* CALCULATOR */}
        <section id='calculator' className='py-20 bg-white scroll-mt-20'>
          <div className='max-w-4xl mx-auto px-6'>
            <SectionLabel>Free Tool</SectionLabel>
            <h2 className='text-3xl sm:text-4xl font-bold text-[var(--color-primary)] mb-3'>
              See What Your Client Is Liable For on Exit — Right Now
            </h2>
            <p className='text-xl text-[var(--color-text-secondary)] mb-8'>
              The Wrigital Exit Tax Optimisation Calculator
            </p>
            <div className='space-y-6 text-[var(--color-text-secondary)] mb-10 leading-relaxed'>
              <p>
                When a business owner tells you they&apos;re thinking about selling in the next twelve
                months, there is one question above everything else they want answered.
              </p>
              <p className='italic text-[var(--color-text-primary)]'>
                What will I walk away with after tax?
              </p>
              <p>
                And every adviser knows what their honest answer usually is: I&apos;ll need to get back to
                you. My accountant normally handles the tax side.
              </p>
              <p>
                That moment of hesitation is where your positioning is decided. Not in your credentials.
                Not in your fee structure. In whether you had the number when they needed it.
              </p>
              <p>
                Enter six figures about your client&apos;s exit position. In under two minutes you have
                their estimated net proceeds after CGT, their BADR eligibility and their
                concentration risk — clearly laid out and ready to show.
              </p>
              <p className='font-semibold text-[var(--color-text-primary)]'>
                This calculator doesn&apos;t replace your accountant. It makes you the person who knew
                the answer before the accountant was asked.
              </p>
              <p className='text-sm italic'>
                No sign-in required. Results are yours to use immediately.
              </p>
            </div>
            <EmbeddedExitCalculator />
          </div>
        </section>

        {/* WHO IT'S FOR */}
        <section className='py-20 bg-white'>
          <div className='max-w-3xl mx-auto px-6'>
            <SectionLabel>Who It&apos;s Built For</SectionLabel>
            <h2 className='text-3xl sm:text-4xl font-bold text-[var(--color-primary)] mb-8'>
              Built for Ambitious Advisers Who Want to Win Clients — Not Just Serve Them
            </h2>
            <div className='space-y-6 text-[var(--color-text-secondary)] text-lg leading-relaxed'>
              <p>
                Wrigital is designed specifically for FCA-regulated financial advisers and firm
                owners working with high-net-worth business owner clients, who are building a
                practice where quality of conversion matters more than volume of meetings.
              </p>
              <p>
                You already have the relationships, the referral networks and the capability. What
                you need is a repeatable system that makes your first meetings convert and keeps your
                existing clients feeling they are being served at a level no generalist practice can
                match.
              </p>
              <p>
                You are not looking for AI that cuts paraplanner hours; you are looking for AI that
                wins clients. That&apos;s a different problem. It requires a different solution.
              </p>
              <p className='font-semibold text-[var(--color-text-primary)]'>
                Ambitious, technology-focused owners of firms with 10 to 20 advisers are not in pain.
                They are desperate to find a way to win clients before everyone else does. If you are
                ambitious enough, the implications of falling behind will feel like pain.
              </p>
            </div>
          </div>
        </section>

        {/* FULL PRODUCT */}
        <section className='py-20 bg-[var(--color-surface)]'>
          <div className='max-w-3xl mx-auto px-6'>
            <SectionLabel>The Full System</SectionLabel>
            <h2 className='text-3xl sm:text-4xl font-bold text-[var(--color-primary)] mb-8'>
              Pre-Meeting Intelligence Is Just the Beginning
            </h2>
            <div className='space-y-6 text-[var(--color-text-secondary)] text-lg leading-relaxed'>
              <p>
                The Wrigital pre-meeting report is the system&apos;s opening move. The full capability
                runs across the entire client acquisition journey.
              </p>
              <p>
                <strong className='text-[var(--color-text-primary)]'>Before the meeting:</strong> A
                personalised financial intelligence report positions you as someone who already
                understands the client; not someone about to ask them to explain their situation from
                scratch. Your prospect arrives already trusting you.
              </p>
              <p>
                <strong className='text-[var(--color-text-primary)]'>During the meeting:</strong> You
                already know the numbers. The conversation is about planning, not discovery. The
                emotional motivator — fear of falling behind, ambition to protect what they&apos;ve
                built — stays at the centre of the conversation rather than being buried under
                credentials and features.
              </p>
              <p>
                <strong className='text-[var(--color-text-primary)]'>After the meeting:</strong> A
                post-meeting report, generated from the full fact-find and meeting notes, gives the
                client a tangible record of what was discussed and gives you a follow-up tool with
                genuine content to return to. Warm leads don&apos;t stay warm by accident.
              </p>
              <p>
                <strong className='text-[var(--color-text-primary)]'>When engagement drops:</strong> A
                re-engagement report, run with a different analytical angle and fresh market data,
                gives you a credible reason to make contact. Not a newsletter. Not a check-in. A
                personalised, numbered, professionally constructed reason to talk.
              </p>
              <p>
                Every report generates a numbers audit, a regulatory knowledge base audit and a live
                external sources report with full citations. Every claim is traceable. Every figure is
                defensible.
              </p>
              <p className='font-semibold text-[var(--color-text-primary)]'>
                The trust that was built in the meeting is reinforced every time you make contact —
                because every contact is built on intelligence, not guesswork.
              </p>
            </div>
          </div>
        </section>

        {/* COMPLIANCE */}
        <section className='py-20 bg-white'>
          <div className='max-w-3xl mx-auto px-6'>
            <SectionLabel>FCA-Ready</SectionLabel>
            <h2 className='text-3xl sm:text-4xl font-bold text-[var(--color-primary)] mb-8'>
              Built to Operate Inside a Regulated Environment
            </h2>
            <div className='space-y-6 text-[var(--color-text-secondary)] text-lg leading-relaxed'>
              <p>
                Wrigital is not a general-purpose AI tool applied to financial services. It is
                built from the ground up for FCA-regulated advice practices.
              </p>
              <p>
                No data is stored server-side between sessions. You hold the client data payload. The
                system generates the report and returns control to you. Nothing persists without
                adviser action.
              </p>
              <p>
                Every financially material figure is formula-driven, not generated by AI inference.
                AI is used for narrative intelligence and pattern recognition; the numbers come from
                a deterministic, auditable calculation layer, reviewed and approved by the adviser
                before any output is produced.
              </p>
              <p>
                The knowledge base draws exclusively from authoritative, curated sources: gov.uk,
                HMRC and the FCA. External sources are live at the time of blueprint generation and
                cited in full.
              </p>
              <p className='font-semibold text-[var(--color-text-primary)]'>
                No silent failures. No unsupported claims. No figures you cannot defend.
              </p>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className='py-20 bg-gradient-to-br from-[#1E2A4A] via-[#2D3561] to-[#0a2463] text-white'>
          <div className='max-w-3xl mx-auto px-6 text-center'>
            <SectionLabel>Get Started</SectionLabel>
            <h2 className='text-3xl sm:text-4xl font-bold mb-8 text-white'>
              The Window Is Open Now. It Will Not Stay Open.
            </h2>
            <p className='text-[#CBD5E1] text-lg mb-6 leading-relaxed'>
              Right now, most adviser firms are using AI around the edges — meeting notes, compliance
              summaries, drafted emails. That&apos;s useful. It is not a competitive differentiator.
            </p>
            <p className='text-[#CBD5E1] text-lg mb-6 leading-relaxed'>
              A minority of firms have AI built into their core client-growth strategy. Those that
              reach AI-driven client conversion first will hold a structural advantage that slower
              competitors will find very difficult to close. In two to three years, when every firm
              has &quot;AI somewhere,&quot; the companies that embedded it into first meetings,
              follow-ups and re-engagements will have better processes, deeper client data and
              stronger relationships than the firms that waited.
            </p>
            <p className='text-[#CBD5E1] text-lg mb-6 leading-relaxed'>
              Wrigital is not a tool you add to your stack; it is the system you build your
              client-acquisition workflow around.
            </p>
            <p className='text-[#CBD5E1] text-lg mb-12 leading-relaxed'>
              The consequence of delaying is simple: By the time you decide to take this seriously,
              the adviser in your patch who moved first will already have a structural advantage you
              cannot easily close.
            </p>
            <div className='max-w-xl mx-auto text-left mb-12'>
              <div className='bg-[#1E2A4A]/60 rounded-xl p-8 border border-[rgba(0,200,224,0.2)]'>
                <h3 className='text-xl font-semibold text-white mb-3'>Try the Calculator</h3>
                <p className='text-[#94A3B8] text-sm mb-6'>
                  Run the numbers for a current prospect in under two minutes. No account. No
                  obligation. Receive your extended exit tax report and a sample intelligence report,
                  then book a discovery call to find out more.
                </p>
                <Button href='#calculator' className='bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-strong)] border-none w-full sm:w-auto'>
                  Calculate Your Client&apos;s Exit Tax Position — Free →
                </Button>
              </div>
            </div>

            <div className='text-[#CBD5E1] space-y-1'>
              <p>
                <a href={contactMailto} className='text-[var(--color-accent)] hover:underline'>
                  {contactEmail}
                </a>
              </p>
              <p>
                <a href={siteUrl} className='text-[var(--color-accent)] hover:underline'>
                  {siteUrl.replace(/^https?:\/\//, '')}
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* UK FOOTER NOTE */}
        <section className='py-8 bg-[var(--color-surface)] border-t border-[var(--color-border-subtle)]'>
          <div className='max-w-4xl mx-auto px-6 text-center text-sm text-[var(--color-text-secondary)] space-y-3'>
            <p>Wrigital Ltd | AI-Powered Pre-Meeting Intelligence for Financial Advisers</p>
            <p>
              Wrigital is a technology platform. It does not provide financial advice. All outputs
              are designed for use by FCA-regulated financial advisers and are subject to adviser
              review and approval before use.
            </p>
            <p>
              Robert Hartley and Hartley Precision Components Ltd, where referenced in demonstration
              materials, are AI-generated fictional characters created for demonstration purposes
              only.
            </p>
            <p className='flex flex-wrap justify-center gap-4'>
              <Link href='/privacy' className='text-[var(--color-primary)] hover:underline'>
                Privacy Policy
              </Link>
              <Link href='/terms' className='text-[var(--color-primary)] hover:underline'>
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
