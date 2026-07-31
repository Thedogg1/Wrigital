export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-5 text-[1.0625rem] leading-[1.7] [&_strong]:font-semibold [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-display-lg [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-display-md">
      {children}
    </div>
  );
}
