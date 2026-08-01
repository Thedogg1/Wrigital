import { TabBar } from '@/components/funnel/TabBar';

export default function RagOfferLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TabBar />
      {children}
    </>
  );
}
