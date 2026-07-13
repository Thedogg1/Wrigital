export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-07-27';

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';

export const token =
  process.env.NEXT_PUBLIC_SANITY_TOKEN ||
  process.env.SANITY_API_READ_TOKEN ||
  undefined;

export function hasSanityConfig(): boolean {
  return Boolean(projectId);
}
