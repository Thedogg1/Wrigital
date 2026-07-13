import { createImageUrlBuilder } from '@sanity/image-url';

import { dataset, hasSanityConfig, projectId } from '../env';
import type { Image as SanityImage } from '@/types';

function getImageBuilder() {
  if (!hasSanityConfig()) {
    throw new Error('Sanity is not configured');
  }

  return createImageUrlBuilder({
    projectId,
    dataset,
  });
}

export const urlForImage = (source: SanityImage) => {
  if (!source) {
    throw new Error('Image source is required');
  }

  const url = getImageBuilder().image(source).auto('format').fit('max').url();

  if (!url) {
    throw new Error('Failed to generate image URL');
  }

  return url;
};
