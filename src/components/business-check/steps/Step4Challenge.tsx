'use client';

import type { BiggestChallenge } from '@/types/lead';

interface Step4ChallengeProps {
  value: BiggestChallenge | null;
  onChange: (value: BiggestChallenge) => void;
  error?: string;
  question: string;
  options: { id: BiggestChallenge; label: string }[];
}

export function Step4Challenge({ value, onChange, error, question, options }: Step4ChallengeProps) {
  return (
    <div>
      <fieldset>
        <legend className="text-lg font-bold tracking-tight text-charcoal">{question}</legend>
        <div className="mt-4 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label={question}>
          {options.map((option) => {
            const selected = value === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onChange(option.id)}
                className={`flex min-h-12 items-center rounded-lg border-2 px-4 py-3 text-left text-sm font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan ${
                  selected
                    ? 'border-cyan bg-cyan/5 text-charcoal shadow-sm'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                }`}
              >
                <span
                  className={`mr-3 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                    selected ? 'border-cyan' : 'border-neutral-300'
                  }`}
                  aria-hidden="true"
                >
                  {selected ? <span className="h-2 w-2 rounded-full bg-cyan" /> : null}
                </span>
                {option.label}
              </button>
            );
          })}
        </div>
      </fieldset>
      {error ? (
        <p role="alert" className="mt-3 text-sm font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}