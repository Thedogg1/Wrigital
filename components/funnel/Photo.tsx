import Image from 'next/image';

export function Photo({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  return (
    <figure className="max-w-[400px]">
      <Image
        src={src}
        alt={alt}
        width={400}
        height={500}
        priority={false}
        className="rounded border border-rule"
        sizes="400px"
      />
      <figcaption className="mt-3 font-mono text-[0.8125rem] text-ink-soft">
        {caption}
      </figcaption>
    </figure>
  );
}
