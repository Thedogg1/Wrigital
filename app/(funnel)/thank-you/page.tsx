import { redirect } from 'next/navigation';

export default async function ThankYouRedirect({
  searchParams,
}: {
  searchParams: Promise<{ domain?: string }>;
}) {
  const params = await searchParams;
  const domain = params.domain
    ? `?domain=${encodeURIComponent(params.domain)}`
    : '';
  redirect(`/RAG_Offer/thank-you${domain}`);
}
