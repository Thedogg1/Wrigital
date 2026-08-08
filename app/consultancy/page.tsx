import type { Metadata } from 'next';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/marketing/Hero';
import { Section } from '@/components/marketing/CtaBand';
import { BrochureForm } from '@/components/marketing/BrochureForm';
import { StepList } from '@/components/marketing/StepList';
import { ScrollReveal } from '@/components/marketing/ScrollReveal';
import { calendlyUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'AI solutions that prove their own working',
  description:
    'We build AI for professional and regulated firms. Every answer shows the source, every figure shows the calculation. Request the brochure or book a call.',
  alternates: { canonical: 'https://wrigital.com/consultancy' },
};

const howWeDoItSteps = [
  {
    title: 'We start with your problem, and your standard.',
    body: 'Before anything is built we establish what the solution must do and who has to approve the result. Your compliance officer, your quality manager, your board. Their requirements become the specification, written in their own words, so the sign-off at the end is them approving their own standard, met.',
  },
  {
    title: 'We write code.',
    body: "Most AI consultancies assemble no-code workflows. Those platforms optimise for speed, and deliver what their templates anticipate. Your obligations are not what a template anticipates. Writing code means the solution is built to your requirements rather than to a vendor's limits.",
  },
  {
    title: 'Nothing reaches you unchecked.',
    body: 'Verification happens in code, before output, not by an AI deciding whether something looks right. A cited source is fetched and confirmed to say what the claim says. A figure is calculated by a fixed formula and checked against the formula. What the solution knows has passed inspection before the solution is allowed to know anything.',
  },
  {
    title: 'The solution fails loudly.',
    body: 'A silent error is the expensive kind, because nobody looks for a mistake nobody reported. Our solutions refuse rather than guess. Where the answer cannot be grounded, the solution says so and stops.',
  },
  {
    title: 'The professional stays in charge, and the record writes itself.',
    body: 'On anything requiring judgement, the solution presents options with trade-offs and the qualified person decides. Their reasoning is recorded onto the output. The audit trail exists as a by-product of normal work, so nobody has to reconstruct the trail afterwards from memory.',
  },
];

export default function ConsultancyPage() {
  return (
    <>
      <Header />
      <main>
        <Hero
          title="Be the firm in your field using AI that proves its own working."
          subtitle="We build AI solutions for professional and regulated firms. Every answer shows the source. Every figure shows the calculation. Innovation you can put your name on."
          supporting="Bring us the problem. Where AI solves the problem well, we build the solution. Where AI does not, we say so."
          primary={{ label: 'Get the brochure', href: '#brochure' }}
          secondary={{ label: 'Book a call', href: calendlyUrl }}
          image="/images/consultancy-hero.png"
        />

        <Section banded>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <ScrollReveal>
              <h2 className="mb-4 text-3xl font-semibold text-[var(--color-primary)]">
                Why we do what we do
              </h2>
              <p className="mb-6 max-w-3xl text-xl font-medium text-[var(--color-primary)]">
                Most AI fails professionals for the same reason.
              </p>
              <p className="text-[var(--color-text-secondary)]">
                The tools impress right up to the moment somebody asks how the answer
                was reached. Then the trail goes cold. No source, no calculation,
                nothing you can put in front of a client, an auditor, a regulator or a
                board.
              </p>
              <p className="mt-4 text-[var(--color-text-secondary)]">
                So the work stalls. The technology can do the job. What stops the work
                is that nobody in the firm can stand behind what the technology
                produces.
              </p>
              <p className="mt-4 text-[var(--color-text-secondary)]">
                We started Wrigital because that failure is an engineering problem, and
                engineering problems have solutions.
              </p>
              <p className="mt-4 text-[var(--color-text-secondary)]">
                Our founder spent three years in NatWest Group Audit, supporting the
                system auditors used to collect and analyse their findings. Everything
                had to be traceable. The fear governing every decision was the silent
                error, the wrong figure that passes through unnoticed because nothing
                was built to catch a wrong figure.
              </p>
              <p className="mt-4 text-[var(--color-text-secondary)]">
                That is the standard we build to. You do not argue that your work is
                correct. You make your work inspectable, and let someone check.
              </p>
              <p className="mt-4 text-[var(--color-text-secondary)]">
                Which is also why we will tell you when AI is the wrong answer to your
                problem. A vendor who only builds has every reason to say yes.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <figure className="mx-auto max-w-sm">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                  <Image
                    src="/images/terry-martin-founder.jpg"
                    alt="Terry Martin, founder of Wrigital Ltd"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 384px"
                  />
                </div>
                <figcaption className="mt-3 text-sm text-[var(--color-text-secondary)]">
                  Terry Martin, Wrigital Ltd, Nottingham.
                </figcaption>
              </figure>
            </ScrollReveal>
          </div>
        </Section>

        <Section>
          <ScrollReveal>
            <h2 className="mb-4 text-3xl font-semibold text-[var(--color-primary)]">
              How we do it
            </h2>
            <p className="mb-10 max-w-3xl text-xl font-medium text-[var(--color-primary)]">
              Five rules, applied to whatever we build for you.
            </p>
            <StepList steps={howWeDoItSteps} />
          </ScrollReveal>
        </Section>

        <Section id="brochure" banded className="scroll-mt-24">
          <ScrollReveal>
            <h2 className="mb-4 text-3xl font-semibold text-[var(--color-primary)]">
              What we can do for you
            </h2>
            <p className="mb-6 max-w-3xl text-xl font-medium text-[var(--color-primary)]">
              The full range, in one document.
            </p>
            <p className="max-w-3xl text-[var(--color-text-secondary)]">
              Everything above applies to whatever problem you bring. What we build,
              what each solution includes, what each costs and how to start are all in
              the brochure.
            </p>
            <p className="mt-4 max-w-3xl text-[var(--color-text-secondary)]">
              Inside: the Verified Assistant, number auditing, client intelligence,
              bespoke solutions built on Azure, and the AI Specification for firms who
              know AI should be doing something but not yet what.
            </p>

            <BrochureForm />

            <p className="mt-6 max-w-xl text-sm text-[var(--color-text-secondary)]">
              The brochure arrives by email in a minute or so. Terry rings you at the
              time you picked, or as close to it as he can manage. We will not pass
              your details to anyone, and we will not sign you up to anything you did
              not ask for.
            </p>
            <p className="mt-4 text-[var(--color-text-secondary)]">
              Rather book a time yourself?{' '}
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[var(--color-primary)] underline-offset-4 hover:underline"
              >
                Book a call
              </a>
            </p>
          </ScrollReveal>
        </Section>
      </main>
      <Footer />
    </>
  );
}
