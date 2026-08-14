import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Preview Leads | SBMC',
  description: 'Preview-only view of leads stored in this browser. Not a production database.',
  robots: { index: false, follow: false },
};

export default function PreviewLeadsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}