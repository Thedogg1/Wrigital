import { track as vercelTrack } from '@vercel/analytics';

export function track(
  event: string,
  props: Record<string, string | number | boolean> = {},
) {
  try {
    vercelTrack(event, props);
  } catch {
    /* ignore analytics failures */
  }
}
