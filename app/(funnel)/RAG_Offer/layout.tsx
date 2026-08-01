import { FunnelNav } from '@/components/funnel/FunnelNav';

export default function RagOfferLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FunnelNav />
      {children}
    </>
  );
}
