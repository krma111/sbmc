'use client';

import { cn } from '@/lib/utils';
import { TiltCard } from '@/components/experience/TiltCard';

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <TiltCard className={cn('glass rounded-xl border border-white/10 p-6', className)}>
      {children}
    </TiltCard>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
  className?: string;
}) {
  return (
    <div className={cn(align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl', className)}>
      {eyebrow ? (
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan">{eyebrow}</p>
      ) : null}
      <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-neutral-300">{description}</p>
      ) : null}
    </div>
  );
}