export type ClassValue = string | number | null | undefined | false | ClassValue[] | Record<string, unknown>;

function toClassName(value: ClassValue): string {
  if (!value) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map(toClassName).filter(Boolean).join(' ');
  return Object.entries(value)
    .filter(([, v]) => Boolean(v))
    .map(([k]) => k)
    .join(' ');
}

export function cn(...inputs: ClassValue[]): string {
  return toClassName(inputs);
}