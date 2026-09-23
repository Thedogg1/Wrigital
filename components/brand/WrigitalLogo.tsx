type WrigitalLogoProps = {
  /** Main site: "Wrigital". FinPrint page: "FinPrint, by Wrigital". */
  variant?: 'main' | 'finprint';
  /** Use light mark and text for dark backgrounds. */
  onDark?: boolean;
  className?: string;
};

/** Document-stripe mark — transparent, uses brand tokens (no cream box). */
function WrigitalMark({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  const lines = [4, 9.5, 15, 20.5, 26, 31.5];
  const primary = onDark ? '#FFFFFF' : 'var(--color-primary)';
  const accent = onDark ? '#00C8E0' : 'var(--color-accent)';

  return (
    <svg
      viewBox="0 0 36 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {lines.map((y, i) => (
        <rect
          key={y}
          x="2"
          y={y}
          width="32"
          height="2.75"
          rx="1.25"
          fill={i % 2 === 0 ? primary : accent}
        />
      ))}
    </svg>
  );
}

export function WrigitalLogo({
  variant = 'main',
  onDark = false,
  className = '',
}: WrigitalLogoProps) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 ${
        onDark ? 'text-white' : 'text-[var(--color-primary)]'
      } ${className}`}
    >
      <WrigitalMark
        onDark={onDark}
        className="h-8 w-7 shrink-0 sm:h-9 sm:w-8"
      />
      {variant === 'finprint' ? (
        <span className="flex flex-col leading-tight">
          <span
            className="text-lg font-semibold tracking-tight sm:text-xl"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            FinPrint
          </span>
          <span
            className={`text-[11px] font-normal sm:text-xs ${
              onDark ? 'text-[#94A3B8]' : 'text-[var(--color-text-secondary)]'
            }`}
          >
            by Wrigital
          </span>
        </span>
      ) : (
        <span
          className="text-xl font-semibold tracking-tight sm:text-2xl"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Wrigital
        </span>
      )}
    </span>
  );
}
