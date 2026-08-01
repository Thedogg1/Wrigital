import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Section } from '@/components/marketing/CtaBand';
import UnverifiedAnswersFlow from '@/components/unverified-answers/UnverifiedAnswersFlow';
import { PAGE_DESCRIPTION, PAGE_TITLE } from '@/lib/unverifiedAnswers';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  robots: { index: false, follow: false },
  alternates: { canonical: '/unverified-answer-count' },
};

export default function UnverifiedAnswerCountPage() {
  return (
    <>
      <Header />
      <main>
        <Section className="pt-10 lg:pt-14">
          <UnverifiedAnswersFlow />
        </Section>
      </main>
      <Footer />
    </>
  );
}
