import type { Metadata } from 'next';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/marketing/Hero';
import { Section } from '@/components/marketing/CtaBand';
import { LinkButton } from '@/components/marketing/shared';
import { ScrollReveal } from '@/components/marketing/ScrollReveal';
import { calendlyUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'The judgment behind the work.',
  description:
    'AI strategy has no veterans. Wrigital was founded on the three disciplines that decide whether an AI project earns its cost.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <Hero
          title="The judgment behind the work."
          subtitle="AI strategy has no veterans. Wrigital was founded on the three disciplines that decide whether an AI project earns its cost."
          image="/images/about-hero.png"
        />

        <Section>
          <ScrollReveal>
            <h2 className="mb-6 text-3xl font-semibold text-[var(--color-primary)]">
              Nobody has a decade of AI strategy behind them
            </h2>
            <p className="max-w-3xl text-lg text-[var(--color-text-secondary)]">
              The field is young. A firm choosing an AI partner cannot
              lean on a track record, and the market knows it. Anyone with a
              subscription and a network can call themselves an AI consultant, and
              many have.
            </p>
            <p className="mt-4 max-w-3xl text-lg text-[var(--color-text-secondary)]">
              That leaves one question worth asking. What did this person do before AI,
              and does it qualify them to advise on it?
            </p>
          </ScrollReveal>
        </Section>

        <Section banded>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <ScrollReveal>
              <h2 className="mb-4 text-3xl font-semibold text-[var(--color-primary)]">
                Terry Martin, founder
              </h2>
              <p className="mb-8 max-w-3xl text-xl font-medium text-[var(--color-primary)]">
                Three disciplines, and the combination is the point.
              </p>
              <p className="mb-8 max-w-3xl text-lg text-[var(--color-text-secondary)]">
                Terry Martin founded Wrigital. His background sits across marketing
                strategy, AI engineering and banking compliance, and each one answers
                a question the buyer of an AI project should ask.
              </p>
              <div className="space-y-8">
                <div>
                  <h3 className="mb-3 text-xl font-semibold text-[var(--color-primary)]">
                    Will this solve a business problem, or produce a demo?
                  </h3>
                  <p className="text-[var(--color-text-secondary)]">
                    Terry holds a postgraduate diploma in Marketing Management from the
                    University of Derby and a postgraduate diploma in Digital
                    Marketing. Strategy was the core discipline of both.
                  </p>
                  <p className="mt-4 text-[var(--color-text-secondary)]">
                    Marketing strategy starts with a business objective and works back
                    to the method. That discipline decides whether an AI project earns
                    its place, and it is the reason we can recommend against building.
                    A technologist reaches for the build. A strategist asks what the
                    firm is trying to achieve.
                  </p>
                </div>
                <div>
                  <h3 className="mb-3 text-xl font-semibold text-[var(--color-primary)]">
                    Can you engineer this, or are you prompting?
                  </h3>
                  <p className="text-[var(--color-text-secondary)]">
                    Terry is a Microsoft Certified Azure AI Engineer Associate, holding
                    the AI-102 certification.
                  </p>
                  <p className="mt-4 text-[var(--color-text-secondary)]">
                    The distance between using an AI product and engineering one is the
                    distance between a template and a system. Deterministic
                    calculation, a governed retrieval pipeline, an approval gate on the
                    knowledge base, citations constructed in code: These are
                    engineering, and they are what a regulated firm needs.
                  </p>
                </div>
                <div>
                  <h3 className="mb-3 text-xl font-semibold text-[var(--color-primary)]">
                    Have you worked where being wrong has consequences?
                  </h3>
                  <p className="text-[var(--color-text-secondary)]">
                    Terry worked as a developer for Nat West Group Audit.
                  </p>
                  <p className="mt-4 text-[var(--color-text-secondary)]">
                    Audit asks one question of everything it touches. Can this be
                    evidenced? He spent his early career inside a bank&apos;s compliance
                    function, where a number that cannot be traced is a finding, and a
                    system that cannot explain itself does not go live. Wrigital builds
                    AI to that standard because its founder learned the standard where
                    it is enforced.
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="relative mx-auto aspect-[3/4] max-w-sm overflow-hidden rounded-xl">
                <Image
                  src="/images/terry-martin-founder.jpg"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 384px"
                  priority
                />
              </div>
            </ScrollReveal>
          </div>
        </Section>

        <Section>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <ScrollReveal>
              <h2 className="mb-6 text-3xl font-semibold text-[var(--color-primary)]">
                Why the combination matters
              </h2>
              <p className="text-[var(--color-text-secondary)]">
                Each discipline alone produces a familiar failure.
              </p>
              <p className="mt-4 text-[var(--color-text-secondary)]">
                A strategist without engineering recommends what they cannot build. An
                engineer without strategy builds what nobody needed. A compliance mind
                without either says no to everything.
              </p>
              <p className="mt-4 text-[var(--color-text-secondary)]">
                Together they produce a firm that can choose the right problem,
                engineer the system and evidence it afterwards. That combination is
                rare, and unlike a track record, it can be checked.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <Image
                  src="/images/about-combination-matters.png"
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
              One artefact, both disciplines
            </h2>
            <p className="mb-6 max-w-3xl text-xl font-medium text-[var(--color-primary)]">
              A niche pack is a market definition, compiled into code.
            </p>
            <p className="max-w-3xl text-lg text-[var(--color-text-secondary)]">
              Look at what FinPrint runs on. Defining a niche is marketing work: which
              client type is worth serving, what matters to them, and which questions
              decide whether they act. Turning that definition into frameworks, formulas
              and a curated knowledge base is engineering work.
            </p>
            <p className="mt-4 max-w-3xl text-lg text-[var(--color-text-secondary)]">
              A niche pack is the first compiled into the second, and it sits in a
              business logic tier where a stakeholder can open it and challenge it.
              Terry learned that separation at NatWest, where the people who questioned
              the business logic and the people who wrote it were seldom the same.
            </p>
            <p className="mt-4 max-w-3xl text-lg text-[var(--color-text-secondary)]">
              Neither discipline produces that artefact alone. A marketer can describe
              the segment. An engineer can build the pipeline. The pack needs both, in
              the same head.
            </p>
          </ScrollReveal>
        </Section>

        <Section>
          <ScrollReveal>
            <h2 className="mb-6 text-3xl font-semibold text-[var(--color-primary)]">
              What we do with it
            </h2>
            <p className="mb-8 max-w-3xl text-lg text-[var(--color-text-secondary)]">
              We advise regulated firms on AI usage and implement our recommendations. We built FinPrint, a working bespoke AI for an FCA-regulated
              context, and we bring the same discipline to the firms we work with.
            </p>
            <div className="flex flex-wrap gap-4">
              <LinkButton
                cta={{ label: 'Explore the Consultancy', href: '/consultancy' }}
              />
              <LinkButton
                cta={{ label: 'Book an assessment', href: calendlyUrl }}
                variant="outline"
              />
            </div>
          </ScrollReveal>
        </Section>
      </main>
      <Footer />
    </>
  );
}
