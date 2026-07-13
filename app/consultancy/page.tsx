import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/marketing/Hero';
import { CtaBand, Section } from '@/components/marketing/CtaBand';
import { FaqAccordion } from '@/components/marketing/FaqAccordion';
import { StepList } from '@/components/marketing/StepList';
import { ScrollReveal } from '@/components/marketing/ScrollReveal';
import { calendlyUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'AI strategy and delivery for regulated firms.',
  description:
    'We advise on AI effectiveness and implement our recommendations. Your consultant is answerable to you.',
  alternates: { canonical: '/consultancy' },
};

const faqItems = [
  {
    q: 'How do we evidence AI decisions?',
    a: 'Every figure is number-checked and every narrative is governed, with a full audit trail behind both. The evidence exists before anyone asks for it.',
  },
  {
    q: 'How do we avoid black-box risk?',
    a: 'The logic sits in plain, readable documents, not buried in code. What the system produces, and where its limits sit, is documented and auditable.',
  },
  {
    q: 'How do we ensure advisers stay in control?',
    a: 'The system drafts a blueprint; the adviser inspects it, edits it and owns every choice in it. Nothing reaches a client without that review.',
  },
  {
    q: 'Where do we start without breaking things?',
    a: 'With the assessment. It establishes what AI is worth to your firm, what the risk is and what to build first, before we write a line of it.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

export default function ConsultancyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Header />
      <main>
        <Hero
          title="AI strategy and delivery for regulated firms."
          subtitle="We advise on AI effectiveness and implement our recommendations. Your consultant is answerable to you."
          primary={{ label: 'Book an assessment', href: calendlyUrl }}
          image="/images/consultancy-hero.png"
        />

        <Section>
          <ScrollReveal>
            <h2 className="mb-6 text-3xl font-semibold text-[var(--color-primary)]">
              Our Clients
            </h2>
            <p className="max-w-3xl text-lg text-[var(--color-text-secondary)]">
              We work with regulated professional-services firms whose world we know
              from the inside. Financial advisers first, then accountants and
              solicitors. Firms with money, a real need and genuine anxiety about
              adopting AI in a way that survives scrutiny. Firms testing AI, but
              unwilling to gamble with regulator trust.
            </p>
          </ScrollReveal>
        </Section>

        <Section banded>
          <ScrollReveal>
            <h2 className="mb-4 text-3xl font-semibold text-[var(--color-primary)]">
              The problem this solves
            </h2>
            <p className="mb-6 max-w-3xl text-xl font-medium text-[var(--color-primary)]">
              Most firms stall, and it is not for lack of interest.
            </p>
            <p className="max-w-3xl text-[var(--color-text-secondary)]">
              A regulated firm cannot pilot AI the way a startup can. A wrong move
              costs regulator trust, and regulator trust took years to earn.
            </p>
            <p className="mt-4 max-w-3xl text-[var(--color-text-secondary)]">
              So the firm waits. It watches competitors move and it waits, because
              waiting feels safer than a wrong move. How long does that hold?
            </p>
          </ScrollReveal>
        </Section>

        <Section>
          <ScrollReveal>
            <h2 className="mb-6 text-3xl font-semibold text-[var(--color-primary)]">
              Why now
            </h2>
            <p className="max-w-3xl text-lg text-[var(--color-text-secondary)]">
              Regulator attention is changing how AI pilots are judged. The FCA now
              tests AI systems in live UK markets under supervision, and it will
              publish guidance on good and poor practice for the sector. The firms that
              build governance in from the start will meet that scrutiny with less
              friction than the firms forced to retrofit it under pressure.
            </p>
            <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
              <cite>
                <sup>
                  <a
                    href="https://www.fca.org.uk/news/press-releases/fca-announces-second-cohort-ai-live-testing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-[var(--color-primary)]"
                  >
                    Financial Conduct Authority, &quot;FCA announces second cohort for
                    AI Live Testing&quot;, 21 April 2026
                  </a>
                </sup>
              </cite>
            </p>
          </ScrollReveal>
        </Section>

        <Section banded>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <ScrollReveal>
              <h2 className="mb-6 text-3xl font-semibold text-[var(--color-primary)]">
                Automation is not depth
              </h2>
              <p className="text-[var(--color-text-secondary)]">
                Most AI consultancies build on no-code platforms. Those platforms
                optimise for speed and ease, and they deliver what their templates
                allow.
              </p>
              <p className="mt-4 text-[var(--color-text-secondary)]">
                A regulated firm needs what no template anticipates. Deterministic
                calculations. A governed pipeline. An audit trail that survives
                inspection. A licensed professional in control of every output.
              </p>
              <p className="mt-4 text-[var(--color-text-secondary)]">
                We write code, which lets us build to your obligations rather than to
                a platform&apos;s limits.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <Image
                  src="/images/consultancy-automation-not-depth.png"
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
                  src="/images/consultancy-three-gates.png"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal>
              <h2 className="mb-6 text-3xl font-semibold text-[var(--color-primary)]">
                Three gates a template cannot give you
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-[var(--color-primary)]">
                    Nothing enters the knowledge base unapproved.
                  </h3>
                  <p className="text-[var(--color-text-secondary)]">
                    A no-code pipeline ingests whatever you point it at, and the AI
                    then draws on it. We sanitise and approve data before it enters
                    the knowledge base, so what the system knows has passed inspection.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-[var(--color-primary)]">
                    The model never writes a citation.
                  </h3>
                  <p className="text-[var(--color-text-secondary)]">
                    Our code constructs each citation from the page the system visited,
                    and our indexer places it inline. So the model cannot invent a
                    source, because the model never writes one.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-[var(--color-primary)]">
                    The adviser approves every output.
                  </h3>
                  <p className="text-[var(--color-text-secondary)]">
                    The system drafts a blueprint. The adviser inspects it, edits it
                    and owns every choice in it. Nothing reaches a client without that
                    review.
                  </p>
                </div>
              </div>
              <p className="mt-6 text-[var(--color-text-secondary)]">
                Approved data goes in. Adviser-approved work comes out. Every gate is
                yours.
              </p>
              <p className="mt-4 text-[var(--color-text-secondary)]">
                The gates exist because we write code. We build your business logic
                into a tier of its own, where it can be read, tested and changed. A
                no-code platform scatters its rules through a workflow, and nobody can
                say where a decision came from.
              </p>
              <p className="mt-4">
                <Link
                  href="/client-intelligence-engine"
                  className="font-medium text-[var(--color-primary)] underline-offset-4 hover:underline"
                >
                  See the full mechanism on the Client Intelligence Engine page.
                </Link>
              </p>
            </ScrollReveal>
          </div>
        </Section>

        <Section banded>
          <ScrollReveal>
            <h2 className="mb-6 text-3xl font-semibold text-[var(--color-primary)]">
              Testing you can show a regulator
            </h2>
            <p className="max-w-3xl text-lg text-[var(--color-text-secondary)]">
              Code can be tested. We test the system against its specification and
              repeat those tests after every change, so the evidence exists before
              anyone asks for it.
            </p>
            <p className="mt-4 max-w-3xl text-lg text-[var(--color-text-secondary)]">
              A no-code platform offers the vendor&apos;s assurance instead. Financial
              services asks for more than assurance.
            </p>
          </ScrollReveal>
        </Section>

        <Section>
          <ScrollReveal>
            <h2 className="mb-6 text-3xl font-semibold text-[var(--color-primary)]">
              Why us
            </h2>
            <p className="max-w-3xl text-lg text-[var(--color-text-secondary)]">
              Most AI consultancy firms advise. Few implement. We do both, meaning we
              know when to recommend a bespoke AI solution and when not to.
            </p>
            <p className="mt-4 max-w-3xl text-lg text-[var(--color-text-secondary)]">
              A firm that only advises has every reason to say yes. We have a reason to
              say no.
            </p>
            <p className="mt-4 max-w-3xl text-lg text-[var(--color-text-secondary)]">
              We built FinPrint, a working bespoke AI, for an FCA-regulated context.
              It generates verified pre and post-meeting intelligence, with a governed
              pipeline, deterministic calculations and a full audit trail. Our roots are
              in banking-grade compliance systems, where AI that cannot be explained
              has never been an option.
            </p>
          </ScrollReveal>
        </Section>

        <Section banded>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <ScrollReveal>
                <h2 className="mb-8 text-3xl font-semibold text-[var(--color-primary)]">
                  How we work
                </h2>
                <StepList
                  steps={[
                    {
                      title: 'Your consultant is answerable to you.',
                      body: 'Your consultant determines a strategy and leads implementation. You brief one person, and when something goes wrong you know who to call.',
                    },
                    {
                      title: 'We start with the assessment.',
                      body: 'Before we build anything, we establish what AI is worth to your firm, what the risk is and what to build first. The deliverable is a document and a set of clear decisions.',
                    },
                    {
                      title: 'We implement to a defined standard.',
                      body: 'We build to a specification and gate the work against a standard you could not define for yourself. The business logic sits in readable documents, so what we implement is auditable from the start.',
                    },
                    {
                      title: 'Then we stay.',
                      body: 'A retainer keeps the work maintained, tuned and extended. Think of us as your AI capability, a few days a month.',
                    },
                  ]}
                />
              </ScrollReveal>
            </div>
            <ScrollReveal delay={0.1}>
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <Image
                  src="/images/consultancy-how-we-work.png"
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
          <ScrollReveal>
            <h2 className="mb-6 text-3xl font-semibold text-[var(--color-primary)]">
              Three things we won&apos;t do
            </h2>
            <p className="max-w-3xl text-lg text-[var(--color-text-secondary)]">
              Replace advisers, shortcut compliance, or over-promise outcomes. Our AI
              supports the adviser and keeps them in control; the governance is the
              point, never an obstacle to work around; and where a bespoke AI is the
              wrong call, we say so.
            </p>
          </ScrollReveal>
        </Section>

        <Section banded>
          <ScrollReveal>
            <h2 className="mb-8 text-3xl font-semibold text-[var(--color-primary)]">
              Questions boards and regulators ask
            </h2>
            <FaqAccordion items={faqItems} />
          </ScrollReveal>
        </Section>

        <CtaBand
          title="The assessment is the conversation to have before anyone writes a line of AI into your firm."
          body="It is the clearest, fastest read on what AI is worth to your firm and what it costs you to keep guessing. In a supervised industry, this is the step you cannot skip."
          cta={{ label: 'Book an assessment', href: calendlyUrl }}
        />
      </main>
      <Footer />
    </>
  );
}
