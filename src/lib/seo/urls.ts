export const ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export function siteUrl(path = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${ORIGIN}${cleanPath}`;
}