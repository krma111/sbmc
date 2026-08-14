'use client';

import { cn } from '@/lib/utils';

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export function ProgressBar({ current, total, className }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between text-xs font-semibold text-neutral-500">
        <span aria-hidden="true">
          Step {current} of {total}
        </span>
        <span>{percentage}%</span>
      </div>
      <div
        className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-200"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-label={`Form progress: step ${current} of ${total}`}
      >
        <div
          className="h-full rounded-full bg-cyan transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}