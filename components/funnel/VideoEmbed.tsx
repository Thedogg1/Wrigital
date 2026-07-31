'use client';

import { useState } from 'react';
import { track } from '@/lib/analytics';
import { SITE } from '@/lib/site';

/** Facade: no YouTube JS until play. Spec §5.5 / §9.3. */
export function VideoEmbed() {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded border border-rule bg-card">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${SITE.videoId}?autoplay=1&cc_load_policy=1&rel=0&modestbranding=1`}
          title="Play: four minutes inside the assistant"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="rounded border border-rule bg-card p-2">
      <button
        type="button"
        className="relative aspect-video w-full overflow-hidden rounded bg-ink bg-cover bg-center"
        style={{ backgroundImage: "url('/images/video-poster.jpg')" }}
        aria-label="Play: four minutes inside the assistant"
        onClick={() => {
          track('video_played', {});
          setPlaying(true);
        }}
      >
        <span className="absolute inset-0 flex items-center justify-center bg-ink/30">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-paper text-paper">
            <span className="ml-1 font-mono text-sm">Play</span>
          </span>
        </span>
      </button>
    </div>
  );
}
