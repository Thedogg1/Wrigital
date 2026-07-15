'use client';

import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { UkPresentationSlide } from '@/lib/uk-landing/loadSlides';

interface LandingSlideViewerProps {
  slides: UkPresentationSlide[];
}

export default function LandingSlideViewer({ slides }: LandingSlideViewerProps) {
  const [index, setIndex] = useState(0);
  const total = slides.length;
  const current = slides[index];

  const goPrev = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setIndex((i) => Math.min(total - 1, i + 1));
  }, [total]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goPrev, goNext]);

  if (!current) return null;

  return (
    <div className='rounded-xl overflow-hidden border border-[rgba(0,200,224,0.25)] bg-[#1E2A4A] shadow-lg'>
      <div className='flex items-center justify-between gap-4 px-4 sm:px-6 py-3 border-b border-[rgba(0,200,224,0.2)] bg-[#2D3561]'>
        <div className='min-w-0'>
          <p className='text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#00C8E0] mb-0.5'>
            FinPrint Presentation
          </p>
          <p className='text-sm sm:text-base font-medium text-white truncate'>{current.label}</p>
        </div>
        <p className='text-xs sm:text-sm text-[#94A3B8] whitespace-nowrap shrink-0'>
          {index + 1} / {total}
        </p>
      </div>

      <div className='relative bg-[#1E2A4A]'>
        <iframe
          key={current.id}
          title={current.label}
          srcDoc={current.html}
          className='w-full h-[min(72vh,640px)] min-h-[360px] border-0 block'
          sandbox='allow-same-origin'
        />
      </div>

      <div className='flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-[rgba(0,200,224,0.2)] bg-[#2D3561]'>
        <button
          type='button'
          onClick={goPrev}
          disabled={index === 0}
          className='inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#1E2A4A] border border-[rgba(0,200,224,0.3)] hover:bg-[rgba(0,200,224,0.08)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
          aria-label='Previous slide'
        >
          <ChevronLeft className='w-4 h-4' aria-hidden />
          Previous
        </button>

        <div className='hidden sm:flex items-center gap-1.5' aria-hidden>
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type='button'
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-6 bg-[#00C8E0]' : 'w-2 bg-[#94A3B8]/50 hover:bg-[#94A3B8]'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          type='button'
          onClick={goNext}
          disabled={index === total - 1}
          className='inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-[#1E2A4A] bg-gradient-to-r from-[#00C8E0] to-[#3B82F6] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity'
          aria-label='Next slide'
        >
          Next
          <ChevronRight className='w-4 h-4' aria-hidden />
        </button>
      </div>
    </div>
  );
}
