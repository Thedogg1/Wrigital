import fs from 'fs';
import path from 'path';
import { UK_LANDING_SLIDES } from './slideManifest';

export interface UkPresentationSlide {
  id: string;
  label: string;
  html: string;
}

function prepareSlideHtmlForEmbed(rawHtml: string): string {
  return rawHtml.replace(/min-height:\s*100vh/gi, 'min-height: auto');
}

export function loadPresentationSlides(): UkPresentationSlide[] {
  const slidesDir = path.join(process.cwd(), 'content', 'uk-landing', 'slides');

  return UK_LANDING_SLIDES.map((slide) => {
    const filePath = path.join(slidesDir, slide.file);
    const rawHtml = fs.readFileSync(filePath, 'utf-8');

    return {
      id: slide.id,
      label: slide.label,
      html: prepareSlideHtmlForEmbed(rawHtml),
    };
  });
}
