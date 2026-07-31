import type { Metadata } from 'next';
import { Section } from '@/components/funnel/Section';
import { Prose } from '@/components/funnel/Prose';
import { BookACall } from '@/components/funnel/BookACall';

export const metadata: Metadata = {
  title: 'The Verified Assistant, Founding Firms Programme',
  description:
    'A bespoke grounded assistant for UK advice firms with 1 to 10 advisers. Every citation checked, every link real, every session saved as a file your compliance officer can inspect. £1,200 setup, then £250 a month.',
  alternates: { canonical: '/the-assistant' },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Wrigital',
  },
};

const includedItems = [
  {
    term: 'Design and build.',
    detail:
      'We agree your niche collections, your own material and the grounding rules up front. Live on your intranet two working days after sign-off.',
  },
  {
    term: 'A defined library, in three layers, built for the firm rather than per adviser.',
    detail:
      'Eight universal collections built from HMRC, FCA and gov.uk, curated and verified once and deployed into your tenant. Five niche collections chosen for the specialisms your firm covers, so a pensions specialist asked an IHT question still receives a grounded answer. And your own material, house positions, advice process, panel, held as its own labelled tier, so an adviser can always see whether a claim came from the regulator or from your files. That last layer is the layer no competitor tool can ever have.',
  },
  {
    term: 'Verified citations on every factual claim.',
    detail:
      'Every candidate source is checked automatically before entering your index: the page must exist, and must score above a relevance threshold against the claim the page supports. Done in code, not by an AI deciding whether something looks right.',
  },
  {
    term: '"I can\'t ground that" instead of a confident guess.',
    detail:
      'The system fails loudly rather than degrading politely in the dark. Everything outside the library is out of scope by design.',
  },
  {
    term: "The system won't tell you what to advise.",
    detail:
      'Ask anything that could shape a recommendation, a drawdown route, a wrapper, a strategy, and you receive two to four labelled options with the trade-offs, who each suits, and what you\'d need to know about the client before choosing. Never a single "do this." Facts stay instant: a statutory allowance, a figure from the client brief, single answer, cited. The friction sits only where the judgement sits.',
  },
  {
    term: 'Every session ends as a file.',
    detail:
      'You cannot simply accept an option. First you record your rationale: why you chose what you chose, and any variations you are making to the advice. The final output then saves as a single HTML file, with the information audit and citations you can click. Send the file to your compliance officer as is, nothing to export, nothing written up afterwards from memory.',
  },
  {
    term: 'Built to your firm, not to my defaults.',
    detail:
      "This is a bespoke build, not a licence. The chat window, the grounding rules and how the assistant behaves are configured to your workflow, and to your compliance officer's instructions, at setup. Small changes afterwards are part of the service, not a change request.",
  },
  {
    term: 'Rebuilt, not patched.',
    detail:
      'Every quarter the index is deleted, rebuilt from source, and every citation re-verified from scratch.',
  },
  {
    term: 'A source audit report as standard.',
    detail:
      'What your assistant is allowed to read. Never sold as a premium. Charging for an audit trail would contradict the entire argument for having one.',
  },
  {
    term: 'You steer what goes in.',
    detail:
      'Send links to anything you want included and the material lands in the next build. Once a year we revisit the design properly.',
  },
  {
    term: 'Runs in your tenant, on your intranet.',
    detail:
      'Your questions never leave your environment. Azure costs at cost on your own subscription, with a spend cap set at setup. No standing access for me. Scoped, granted by you, revocable by you.',
  },
  {
    term: 'Support 11:00 to 16:00, Monday to Friday,',
    detail: 'on a shared Slack channel with a named responder.',
  },
];

const excludedItems = [
  {
    term: 'No chatbot between you and your clients.',
    detail:
      'AI belongs behind the adviser, never between the adviser and the prospect.',
  },
  {
    term: 'Number checking is a separate build.',
    detail:
      'This offer is grounded answers with verified, clickable citations. Arithmetic auditing, where every figure in an answer is traced and checked, is real and I build it, but sits outside this price. Ask on the call and I\'ll quote honestly.',
  },
  {
    term: "No promises about when you'll hit your business objectives.",
    detail:
      'I build the capability and measure what the capability touches. The objective is yours, and we calculate the timeline together from your own numbers.',
  },
  {
    term: "Anything outside what I've built",
    detail: 'is quoted honestly as custom work, or referred elsewhere.',
  },
];

export default function TheAssistantPage() {
  return (
    <>
      <div className="mx-auto max-w-6xl px-5 py-20 lg:py-28">
        <div className="max-w-[68ch]">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-soft">
            Founding Firms Programme
          </p>
          <h1 className="mt-4 text-display-xl">The Verified Assistant</h1>
          <p className="mt-5 text-display-md italic">
            Every citation checked. Every link real.
          </p>
          <p className="mt-5 text-[1.125rem] leading-[1.65]">
            For UK FCA-regulated advice firms with 1 to 10 advisers whose
            clients have started turning up with AI, and who have tested a
            chatbot themselves and concluded the tool can&apos;t go anywhere
            near a client.
          </p>
        </div>
      </div>

      <Section label="The case">
        <Prose>
          <p>Your clients are already using AI. On you.</p>
          <p>
            Telling them the tools make things up loses more credibility with
            every passing month.
          </p>
          <p>
            The answer isn&apos;t to argue with their AI, and isn&apos;t a
            chatbot with better answers. Their AI is good at the part of your
            work clients can see. Your value is in the part they cannot.
          </p>
          <p>
            Your client&apos;s AI gives them a conclusion. Yours shows what went
            into a conclusion: what was checked, what was weighed, what was
            rejected, and why. Every source opens when you click.
          </p>
          <p>
            Their AI produces answers. Yours makes your judgement visible.
          </p>
        </Prose>
      </Section>

      <Section label="Included">
        <h2 className="text-display-lg">What&apos;s included</h2>
        <dl className="mt-8 divide-y divide-rule border-y border-rule">
          {includedItems.map((item) => (
            <div key={item.term} className="py-5">
              <dt className="font-semibold">{item.term}</dt>
              <dd className="mt-1.5 text-ink-soft">{item.detail}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section label="Founding">
        <div className="rounded border border-rule bg-card p-7 lg:p-9">
          <h2 className="text-display-lg">Included with a founding place</h2>
          <div className="mt-4 space-y-5 text-[1.0625rem] leading-[1.7] [&_strong]:font-semibold">
            <p>
              <strong>Continuous figure monitoring on your public website.</strong>{' '}
              The check you ran to get here, run every month, automatically, for
              as long as you stay. A dated record each time showing every figure
              found and the published value each was compared against, and an
              alert the moment something you publish falls behind a change you
              didn&apos;t notice.
            </p>
            <p>Founding firms only. Never sold separately.</p>
          </div>
        </div>
      </Section>

      <Section label="Price">
        <h2 className="text-display-lg">Price</h2>
        <p className="mt-4 font-display text-display-lg font-medium tracking-[-0.015em]">
          £1,200 setup, then £250 a month
        </p>
        <div className="mt-5 space-y-5 text-[1.0625rem] leading-[1.7]">
          <p>
            Six-month term, monthly rolling after that. Founding firms keep
            their rate for as long as they stay.
          </p>
          <p>
            Azure running costs sit on your own subscription at cost, with a
            spend cap set at setup. No usage caps, no marked-up infrastructure,
            no surprise invoices.
          </p>
          <p className="text-ink-soft">
            A typical firm charging 0.5% to 1% ongoing earns £2,500 to £5,000 a
            year from a single £500,000 client. Retaining one fee-challenged
            client pays for this several times over.
          </p>
        </div>
      </Section>

      <Section label="Excluded">
        <h2 className="text-display-lg">What I won&apos;t sell you</h2>
        <dl className="mt-8 divide-y divide-rule border-y border-rule">
          {excludedItems.map((item) => (
            <div key={item.term} className="py-5">
              <dt className="font-semibold">{item.term}</dt>
              <dd className="mt-1.5 text-ink-soft">{item.detail}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section label="Cohort">
        <h2 className="text-display-lg">Why the cohort is three firms</h2>
        <div className="mt-4 space-y-5 text-[1.0625rem] leading-[1.7]">
          <p>
            Every library is built and verified end to end before going live,
            and the verification pass is slow by design. Every candidate source
            fetched and scored. That&apos;s the constraint, and that same
            constraint makes the citations worth anything.
          </p>
          <p>
            The opening cohort is three firms. Cohorts start monthly after that.
          </p>
          <p>
            The FCA&apos;s good and poor practice report on AI lands later this
            year. A firm starting now meets the report with a documented,
            evidenced position. A firm starting two intakes later meets the
            report with nothing on paper.
          </p>
        </div>
      </Section>

      <Section label="Close" tone="ink">
        <Prose>
          <p>
            No five-figure first decision. No lock-in beyond the six-month term.
            And a system your compliance officer can inspect.
          </p>
          <p>If the citations don&apos;t stand up, don&apos;t sign.</p>
        </Prose>
      </Section>

      <BookACall variant="standing" placement="assistant_footer" />
    </>
  );
}
