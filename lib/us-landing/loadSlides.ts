import fs from 'fs';
import path from 'path';
import { USA_LANDING_SLIDES } from './slideManifest';

export interface UsaPresentationSlide {
  id: string;
  label: string;
  html: string;
}

function prepareSlideHtmlForEmbed(rawHtml: string): string {
  return rawHtml.replace(/min-height:\s*100vh/gi, 'min-height: auto');
}

export function loadUsPresentationSlides(): UsaPresentationSlide[] {
  const slidesDir = path.join(process.cwd(), 'content', 'us-landing', 'slides');

  return USA_LANDING_SLIDES.map((slide) => {
    const filePath = path.join(slidesDir, slide.file);
    const rawHtml = fs.readFileSync(filePath, 'utf-8');

    return {
      id: slide.id,
      label: slide.label,
      html: prepareSlideHtmlForEmbed(rawHtml),
    };
  });
}
