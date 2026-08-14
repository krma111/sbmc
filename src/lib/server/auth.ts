export function isAdminRequest(token: string | null | undefined): boolean {
  if (!token) return false;
  const expected = process.env.ADMIN_PASSWORD ?? 'sbmc-admin';
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}