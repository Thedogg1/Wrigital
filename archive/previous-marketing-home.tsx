import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/marketing/Hero';
import { CtaBand, Section } from '@/components/marketing/CtaBand';
import { FeatureCard } from '@/components/marketing/FeatureCard';
import { ScrollReveal } from '@/components/marketing/ScrollReveal';
import { calendlyUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Accountable AI for regulated firms.',  description:
    'AI you can present to regulator. We advise, we implement and we document.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      <Header variant="main" />
      <main>
        <Hero
          title="Accountable AI for regulated firms."
          subtitle="AI you can put in front of a regulator. We advise, we implement and we document ."
          primary={{ label: 'Explore the Consultancy', href: '/consultancy' }}
          secondary={{ label: 'See FinPrint', href: '/client-conversion-financial-advisers' }}
          image="/images/home-hero.png"
        />

        <Section>
          <ScrollReveal>
            <h2 className="mb-4 text-3xl font-semibold text-[var(--color-primary)]">
              What Wrigital Does
            </h2>
            <p className="mb-6 max-w-3xl text-xl font-medium text-[var(--color-primary)]">
              We help regulated firms adopt AI with confidence.
            </p>
            <p className="max-w-3xl text-lg text-[var(--color-text-secondary)]">
              The logic, the decisions and the limits are documented, auditable and
              able to survive compliance scrutiny. Every decision is documented.
              Every limit sits on the record.
            </p>
            <p className="mt-4 max-w-3xl text-lg text-[var(--color-text-secondary)]">
              That discipline is the whole point. It lets a regulated firm adopt AI
              without staking its compliance record on it.
            </p>
            <p className="mt-4 max-w-3xl text-lg text-[var(--color-text-secondary)]">
              We build for regulated professional-services firms: Financial advisers
              first, then accountants and solicitors.
            </p>
          </ScrollReveal>
        </Section>

        <Section banded>
          <ScrollReveal>
            <h2 className="mb-8 text-3xl font-semibold text-[var(--color-primary)]">
              Two ways to work with us
            </h2>
            <p className="mb-10 max-w-3xl text-[var(--color-text-secondary)]">
              There are two doors, and both lead to the same standard:
            </p>
          </ScrollReveal>
          <div className="grid gap-8 md:grid-cols-2">
            <ScrollReveal delay={0.05}>
              <FeatureCard title="Consultancy." href="/consultancy" hover>
                <p>
                  We advise on AI usage and implement our recommendations. One expert. One relationship. End-to-end delivery.
                </p>
              </FeatureCard>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <FeatureCard
                title="FinPrint."
                href="/client-conversion-financial-advisers"
                hover
              >
                <p>
                  Our product, and our proof. FinPrint is a working
                  client-intelligence system we built for an FCA-regulated context.
                  Every number used is auditable. It demonstrates our standards.
                </p>
              </FeatureCard>
            </ScrollReveal>
          </div>
        </Section>

        <Section>
          <ScrollReveal>
            <h2 className="mb-4 text-3xl font-semibold text-[var(--color-primary)]">
            A one-consultant model
            </h2>
            <p className="mb-6 max-w-3xl text-xl font-medium text-[var(--color-primary)]">
              You get one owner, from first call to finished work.
            </p>
            <p className="max-w-3xl text-lg text-[var(--color-text-secondary)]">
              Unlike traditional consulting models that hand work between sales, 
              consultants, project managers, and delivery teams, our engagement
               model provides a single experienced consultant who acts as your advisor, 
               implementation lead, and primary point of contact throughout. 
               This ensures continuity, faster decision-making, and clear accountability.
            </p>
          </ScrollReveal>
        </Section>

        <Section banded>
          <ScrollReveal>
            <h2 className="mb-4 text-3xl font-semibold text-[var(--color-primary)]">
              Proof
            </h2>
            <p className="mb-6 max-w-3xl text-xl font-medium text-[var(--color-primary)]">
              Our proof is a system we built, not a slide.
            </p>
            <p className="max-w-3xl text-lg text-[var(--color-text-secondary)]">
              FinPrint is a working AI system we built for an FCA-regulated context.
              It generates verified pre and post-meeting intelligence, with a
              governed pipeline, deterministic calculations and a full audit trail.
              Documented throughout and replicable.
            </p>
            <p className="mt-4 max-w-3xl text-lg text-[var(--color-text-secondary)]">
              Anyone can describe AI they might build. We built Finprint.
            </p>
          </ScrollReveal>
        </Section>

        <CtaBand
          title="Not sure which door is yours?"
          body="Most firms start with the consultancy assessment, then decide. It is the quickest route to a clear answer."
          cta={{ label: 'Book an assessment', href: calendlyUrl }}
        />
      </main>
      <Footer />
    </>
  );
}
