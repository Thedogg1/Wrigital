import type { Metadata } from 'next';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/marketing/Hero';
import { CtaBand, Section } from '@/components/marketing/CtaBand';
import { ScrollReveal } from '@/components/marketing/ScrollReveal';
import { calendlyUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'The Client Intelligence Engine.',
  description:
    'A glass-box AI system for regulated advice. Every figure auditable, every source real, and a licensed adviser in control of every output.',
  alternates: { canonical: '/client-intelligence-engine' },
};

export default function EnginePage() {
  return (
    <>
      <Header />
      <main>
        <Hero
          title="The Client Intelligence Engine."
          subtitle="A glass-box AI system for regulated advice. Every figure auditable, every source real, and a licensed adviser in control of every output."
          primary={{
            label: 'See FinPrint',
            href: '/client-conversion-financial-advisers',
          }}
          secondary={{ label: 'Book an assessment', href: calendlyUrl }}
          image="/images/engine-hero.png"
        />

        <Section>
          <ScrollReveal>
            <h2 className="mb-6 text-3xl font-semibold text-[var(--color-primary)]">
              Most AI is a black box that regulated professionals cannot use.
            </h2>
            <p className="max-w-3xl text-lg text-[var(--color-text-secondary)]">
              A general model produces an answer you cannot check. For a supervised
              profession, that is the problem, not the product. An adviser who cannot
              show how a number was reached cannot stand behind it, and a compliance
              officer cannot sign off what they cannot see.
            </p>
            <p className="mt-4 max-w-3xl text-lg text-[var(--color-text-secondary)]">
              We built the engine to remove that objection.
            </p>
          </ScrollReveal>
        </Section>

        <Section banded>
          <ScrollReveal>
            <h2 className="mb-4 text-3xl font-semibold text-[var(--color-primary)]">
              Deterministic calculation
            </h2>
            <p className="mb-6 max-w-3xl text-xl font-medium text-[var(--color-primary)]">
              A figure is calculated, not guessed.
            </p>
            <p className="max-w-3xl text-lg text-[var(--color-text-secondary)]">
              Figures come from fixed formulas, so the same inputs return the same
              outputs every time. A language model estimates. Our code calculates.
              Every figure is then checked against its formula before it reaches a
              report, which is the number audit.
            </p>
          </ScrollReveal>
        </Section>

        <Section>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <ScrollReveal>
              <h2 className="mb-4 text-3xl font-semibold text-[var(--color-primary)]">
                Citations the model cannot invent
              </h2>
              <p className="mb-6 text-xl font-medium text-[var(--color-primary)]">
                The model never returns a source.
              </p>
              <p className="text-[var(--color-text-secondary)]">
                An AI that writes its own citations can invent them.  Deterministic code writes ours.
              </p>
              <p className="mt-4 text-[var(--color-text-secondary)]">
                Our code constructs each citation from the page visited,
                and our indexer places it inline before it goes into the RAG database. So a source
                is a record of where the system went, not a plausible-looking reference
                a model produced. Every claim traces back to a page that exists.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <Image
                  src="/images/engine-citations.png"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </ScrollReveal>
          </div>
        </Section>

        <Section banded>
          <ScrollReveal>
            <h2 className="mb-4 text-3xl font-semibold text-[var(--color-primary)]">
              Nothing enters the knowledge base unapproved
            </h2>
            <p className="mb-6 max-w-3xl text-xl font-medium text-[var(--color-primary)]">
              What the system knows has passed inspection.
            </p>
            <p className="max-w-3xl text-lg text-[var(--color-text-secondary)]">
              A no-code pipeline ingests whatever you point it at, and the AI then
              draws on it, unchecked. We sanitise and approve data before it enters the
              knowledge base.
            </p>
            <p className="mt-4 max-w-3xl text-lg text-[var(--color-text-secondary)]">
              So the engine draws on a body of knowledge that someone cleared, and you
              can see what went in.
            </p>
          </ScrollReveal>
        </Section>

        <Section>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <ScrollReveal delay={0.1}>
              <div className="relative aspect-video overflow-hidden rounded-xl lg:order-first">
                <Image
                  src="/images/engine-risk.png"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal>
              <h2 className="mb-4 text-3xl font-semibold text-[var(--color-primary)]">
                Risk the adviser cannot afford to miss
              </h2>
              <p className="mb-6 text-xl font-medium text-[var(--color-primary)]">
                The system catches what an adviser should have seen.
              </p>
              <p className="text-[var(--color-text-secondary)]">
                An adviser is seldom sued for being wrong. They are sued for missing
                something they were expected to catch.
              </p>
              <p className="mt-4 text-[var(--color-text-secondary)]">
                We hold a no-silent-errors policy, which means numerical discrepancies halt the process and don't fall back to default values. 
                That policy produces the validation engine. It
                checks the figures against each other and against the client&apos;s real
                position, and when the numbers cannot reconcile, it raises a flag.
              </p>
              <p className="mt-4 text-[var(--color-text-secondary)]">
                Tax that has been under-declared. Lifestyle spending the numbers cannot
                support. An exposure nobody has priced. These are findings against real
                numbers, not prompts from a checklist. A framework tells an adviser
                which topics to consider. A validation engine tells them a figure is
                wrong.
              </p>
              <p className="mt-4 text-[var(--color-text-secondary)]">
                The flags land in a warnings file the adviser reads before the meeting.
                They decide what to do about each one, and the record shows they were
                told.
              </p>
            </ScrollReveal>
          </div>
        </Section>

        <Section banded>
          <ScrollReveal>
            <h2 className="mb-4 text-3xl font-semibold text-[var(--color-primary)]">
              Validation as you type
            </h2>
            <p className="mb-6 max-w-3xl text-xl font-medium text-[var(--color-primary)]">
              Errors caught at the point of entry.
            </p>
            <p className="max-w-3xl text-lg text-[var(--color-text-secondary)]">
              We migrated the validation to the front end, where it runs as the data goes in. 
              It behaves like the spell checker in a word processor, marking what looks wrong while the
              adviser keeps moving.
            </p>
            <p className="mt-4 max-w-3xl text-lg text-[var(--color-text-secondary)]">
              So a typo is caught where it is made, and the warnings file is left to
              carry what matters.
            </p>
          </ScrollReveal>
        </Section>

        <Section>
          <ScrollReveal>
            <h2 className="mb-4 text-3xl font-semibold text-[var(--color-primary)]">
              The system proposes. The adviser disposes.
            </h2>
            <p className="mb-6 max-w-3xl text-xl font-medium text-[var(--color-primary)]">
              The reasons sit with the licensed professional.
            </p>
            <p className="max-w-3xl text-lg text-[var(--color-text-secondary)]">
              For each client, the engine drafts a blueprint. It selects the niche
              frameworks, report sections and formulas that fit, and writes them into
              a payload the adviser opens. The adviser inspects it, edits it and owns
              every choice in it.
            </p>
            <p className="mt-4 max-w-3xl text-lg text-[var(--color-text-secondary)]">
              The engine drafts from a library we built and you can inspect. The
              adviser decides. So the reasons for what a client sees sit with the
              licensed professional, not the machine.
            </p>
          </ScrollReveal>
        </Section>

        <Section banded>
          <ScrollReveal>
            <h2 className="mb-4 text-3xl font-semibold text-[var(--color-primary)]">
              Three tiers, and the model sits at the bottom
            </h2>
            <p className="mb-6 max-w-3xl text-xl font-medium text-[var(--color-primary)]">
              The model sits at the bottom, not in charge.
            </p>
            <p className="max-w-3xl text-lg text-[var(--color-text-secondary)]">
              FinPrint is built as a three-tier system, and the order matters.
            </p>
            <p className="mt-4 max-w-3xl text-lg text-[var(--color-text-secondary)]">
              The bottom tier is the LLM, which calls the RAG database for context. It
              retrieves and it drafts. The middle tier is the business logic, where the
              niche packs, the formulas, the validation engine and the blueprint
              selection sit. The top tier is where the adviser inspects the work and
              edits it.
            </p>
            <p className="mt-4 max-w-3xl text-lg text-[var(--color-text-secondary)]">
              Most AI products invert this. The model is the system, and everything
              else is plumbing arranged around it, so whatever the model says becomes
              the answer. Here the model is a component. It proposes, and the
              business logic above it decides what survives.
            </p>
            <p className="mt-4 max-w-3xl text-lg text-[var(--color-text-secondary)]">
              Separating the logic is what makes it answerable. The rules sit in one
              place, so we can point at them, test them and change them without
              disturbing the rest. A no-code platform has no logic tier. Its rules
              scatter through a workflow, wherever the last person dropped them, and
              nobody can say where a decision came from.
            </p>
            <p className="mt-4 max-w-3xl text-lg text-[var(--color-text-secondary)]">
              This is why the gates exist. Approval on the knowledge base governs what
              the bottom tier can draw on. The formulas, the validation and the
              blueprint sit in business logic. The adviser&apos;s review sits at the
              top. Each gate has a place to live.
            </p>
          </ScrollReveal>
        </Section>

        <Section>
          <ScrollReveal>
            <h2 className="mb-4 text-3xl font-semibold text-[var(--color-primary)]">
              A niche pack is business logic
            </h2>
            <p className="mb-6 max-w-3xl text-xl font-medium text-[var(--color-primary)]">
              We compile a market definition into working code.
            </p>
            <p className="max-w-3xl text-lg text-[var(--color-text-secondary)]">
              Defining a niche is marketing work. Which client type is worth serving,
              what matters to them, what does not, and which questions decide whether
              they act. Encoding that definition as frameworks, report sections,
              formulas and a curated knowledge base is engineering work. A niche pack is
              the first compiled into the second.
            </p>
            <p className="mt-4 max-w-3xl text-lg text-[var(--color-text-secondary)]">
              For each client, the engine selects from the pack and drafts the
              blueprint. The adviser confirms the selection. So the market thinking
              that shapes a report can be opened, read and challenged, because it sits
              in a tier built to be read.
            </p>
            <p className="mt-4 max-w-3xl text-lg text-[var(--color-text-secondary)]">
              A narrow niche gives a deep pack, and a deep pack gives a sharper report.
              FinPrint runs on the pack for UK business owners with high net worth as standard.
              Work solely with dental practice owners or only deal with solicitors?
              Optionally, we can produce business logic specifically for your niche.
            </p>
          </ScrollReveal>
        </Section>

        <Section banded>
          <ScrollReveal>
            <h2 className="mb-6 text-3xl font-semibold text-[var(--color-primary)]">
              The engine supports. The adviser determines.
            </h2>
            <p className="max-w-3xl text-lg text-[var(--color-text-secondary)]">
              The engine analyses, drafts and documents. It does not make suitability
              determinations, give advice or approve a strategy. Those belong to the
              licensed professional, who reviews the analysis, applies judgment and
              takes responsibility for the outcome.
            </p>
            <p className="mt-4 max-w-3xl text-lg text-[var(--color-text-secondary)]">
              The engine exists to make that judgment faster to reach and easier to
              evidence.
            </p>
          </ScrollReveal>
        </Section>

        <Section>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <ScrollReveal>
              <h2 className="mb-4 text-3xl font-semibold text-[var(--color-primary)]">
                The audit trail
              </h2>
              <p className="mb-6 text-xl font-medium text-[var(--color-primary)]">
                The whole chain survives inspection.
              </p>
              <p className="text-[var(--color-text-secondary)]">
                Every step is recorded: what went into the knowledge base, what the
                engine retrieved, what it calculated, what it proposed and what the
                adviser changed. So the record exists before anyone asks for it, and it
                holds up after the fact.
              </p>
              <p className="mt-4 text-[var(--color-text-secondary)]">
                No silent errors. When a figure cannot be verified, the system says so
                rather than filling the gap. That policy is what the validation engine
                enforces.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <Image
                  src="/images/engine-audit-trail.png"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </ScrollReveal>
          </div>
        </Section>

        <Section banded>
          <ScrollReveal>
            <h2 className="mb-6 text-3xl font-semibold text-[var(--color-primary)]">
              Built to a banking standard
            </h2>
            <p className="max-w-3xl text-lg text-[var(--color-text-secondary)]">
              Our roots are in banking-grade compliance systems, where AI that cannot
              be explained has never been an option. We built the engine to that
              standard, with multiple verification touchpoints, deterministic execution
              and no silent failures.
            </p>
            <p className="mt-4 max-w-3xl text-lg text-[var(--color-text-secondary)]">
              This is compliance-first architecture, from people who built compliance
              systems inside a bank.
            </p>
          </ScrollReveal>
        </Section>

        <CtaBand
          title="See it applied, or put it to work"
          body="We built FinPrint on the engine, for one niche. The consultancy brings the same engine, and the same discipline, to your firm."
          cta={{
            label: 'See FinPrint',
            href: '/client-conversion-financial-advisers',
          }}
          secondary={{ label: 'Book an assessment', href: calendlyUrl }}
        />
      </main>
      <Footer />
    </>
  );
}
