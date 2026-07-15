export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wrigital.com';

export const calendlyUrl =
  process.env.NEXT_PUBLIC_CALENDLY_URL ??
  'https://calendly.com/wrigital/assessment';

/** Separate Calendly event for the Facebook /local “Donkey Work Assessment” lane. */
export const calendlyDonkeyUrl =
  process.env.NEXT_PUBLIC_CALENDLY_DONKEY_URL ?? calendlyUrl;

export const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '';

/** Microsoft Learn share link for the Azure AI Engineer Associate credential. */
export const azureAiCredentialUrl =
  'https://learn.microsoft.com/api/credentials/share/en-us/TerryMartin-9915/B91D90D12A0912B2?sharingId=543089ED5F6376A9';
