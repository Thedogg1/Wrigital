export default function BlogLoading() {
  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-80 animate-pulse rounded-lg bg-[var(--color-surface)]"
        />
      ))}
    </div>
  );
}
