export default function BlogPostLoading() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse px-6 py-16">
      <div className="mb-8 h-64 rounded-lg bg-[var(--color-surface)]" />
      <div className="mb-4 h-10 w-3/4 rounded bg-[var(--color-surface)]" />
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-4 rounded bg-[var(--color-surface)]" />
        ))}
      </div>
    </div>
  );
}
