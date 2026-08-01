import type { Metadata } from 'next';
import { Section } from '@/components/funnel/Section';
import { Prose } from '@/components/funnel/Prose';
import { BookACall } from '@/components/funnel/BookACall';
import { WizardSection } from '@/components/funnel/wizard/WizardSection';

export const metadata: Metadata = {
  title: 'What verification actually is',
  description:
    'Why testing a consumer chatbot can never produce a yes from compliance, and what a system has to do instead: a signed off library, sources fetched and scored in code, and a quarterly rebuild.',
  alternates: { canonical: '/RAG_Offer/verified-answers' },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Wrigital',
  },
};

const verificationSteps = [
  'The assistant answers only from a signed-off library. Nothing outside that library is in scope.',
  'Every candidate source is fetched before entering the index. The page has to exist.',
  'The content is scored against the claim the page is supposed to support. Below the threshold, the source is dropped.',
  'Verification happens in code, not by an AI deciding whether something looks right.',
  'Every quarter the index is deleted and rebuilt from source, and every citation is re-verified from scratch. A knowledge base that\'s patched accumulates rot. A knowledge base that\'s rebuilt cannot.',
];

export default function VerifiedAnswersPage() {
  return (
    <>
      <Section label="The nod">
        <p className="text-display-md italic">
          You&apos;ve tested the tools yourself. Evenings, weekends, a made-up
          client scenario. Genuinely impressive. And every session ends the same
          way: brilliant, but not client-ready.
        </p>
        <p className="mt-5 text-[1.0625rem] leading-[1.7]">
          So you asked compliance. And you got back either &quot;best to be
          cautious for now&quot; or a policy document saying be careful with
          client data, which you already knew. So you&apos;re waiting for the FCA
          report to make things clearer.
        </p>
      </Section>

      <Section label="Wizard">
        <WizardSection />
      </Section>

      <Section label="Why not">
        <Prose>
          <h2>Neither of those can ever produce a yes</h2>
          <p>
            The testing can&apos;t, because you were evaluating a consumer
            product for properties the product architecturally cannot have. No
            amount of clever prompting makes a generic chatbot show its
            arithmetic, verify its sources, or leave an audit trail. Those
            aren&apos;t settings that were left off. They&apos;re absent by
            design.
          </p>
          <p>
            Worse, the loop teaches the wrong lesson. Each session reinforces
            &quot;AI can&apos;t be used in regulated work,&quot; when the true
            statement is &quot;this product class can&apos;t.&quot;
          </p>
          <p>
            And the compliance question can&apos;t produce a yes either, because
            &quot;can we use AI?&quot; has no answer. &quot;Here is a specific
            system, with this data, producing this evidence, does that meet your
            requirements?&quot; does.
          </p>
          <p>
            On the waiting: the FCA has already clarified its position. No new
            AI-specific rules. Existing frameworks apply. Which means the
            accountability exists today, and the upcoming report will illustrate
            practice rather than create obligations.
          </p>
        </Prose>
      </Section>

      <Section label="Verification">
        <Prose>
          <h2>What verification actually is</h2>
        </Prose>
        <ol className="mt-6 space-y-5">
          {verificationSteps.map((s, i) => (
            <li
              key={i}
              className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3"
            >
              <span className="pt-1 font-mono text-sm text-source">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p>{s}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section label="The gap">
        <Prose>
          <h2>Nobody has ever written down what your AI would have to do</h2>
          <p>
            Somewhere in your firm, on paper, or in your compliance
            officer&apos;s head, there&apos;s an answer to this question: what
            would we need to see before AI was client-ready?
          </p>
          <p>
            Which numbers must be checkable. Which claims must carry a source.
            What the system must do when the answer isn&apos;t known. What
            evidence must exist afterwards.
          </p>
          <p>
            That answer has never been turned into build requirements. Not by
            your compliance consultant, not by any vendor, not by you. And that
            isn&apos;t negligence. The translation requires someone fluent in
            both your obligations and software engineering, and that person
            doesn&apos;t exist in your world.
          </p>
          <p>
            Untranslated requirements can&apos;t be built to, and they can&apos;t
            be tested against. So the firm fails generic tools individually and
            concludes &quot;we can&apos;t use AI,&quot; when the true statement
            is{' '}
            <strong>
              &quot;nothing has ever been built to our requirements.&quot;
            </strong>
          </p>
          <p>
            That&apos;s the job. You set the bar; I&apos;m the developer who
            builds to it. I did that for a bank&apos;s auditors. I&apos;ll do
            that for your compliance officer.
          </p>
        </Prose>
      </Section>

      <BookACall variant="compliance" placement="verified_answers" />
    </>
  );
}
