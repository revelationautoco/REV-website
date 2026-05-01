/**
 * Public contact details. Set NEXT_PUBLIC_* in `.env.local` or hosting env
 * (no secrets — these are exposed to the browser).
 */
function envOr(
  value: string | undefined,
  fallback: string,
): string {
  const v = value?.trim();
  return v || fallback;
}

export const siteContact = {
  phoneDisplay: envOr(
    process.env.NEXT_PUBLIC_CONTACT_PHONE_DISPLAY,
    "(806) 683-8024",
  ),
  /** E.164 for `tel:` links, e.g. +15551234567 */
  phoneE164: envOr(
    process.env.NEXT_PUBLIC_CONTACT_PHONE_E164,
    "+18066838024",
  ),
  email: envOr(
    process.env.NEXT_PUBLIC_CONTACT_EMAIL,
    "revelationauto.co@gmail.com",
  ),
} as const;

export function telHref(): string {
  const digits = siteContact.phoneE164.replace(/\s/g, "");
  return `tel:${digits}`;
}
