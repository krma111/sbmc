'use client';

interface Step3LocationProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  question: string;
  placeholder: string;
}

export function Step3Location({ value, onChange, error, question, placeholder }: Step3LocationProps) {
  return (
    <div>
      <label htmlFor="city-area" className="block text-lg font-bold tracking-tight text-charcoal">
        {question}
      </label>
      <div className="relative mt-4">
        <svg
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <input
          id="city-area"
          type="text"
          autoComplete="address-level2"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'city-area-error' : undefined}
          className="w-full rounded-lg border-2 border-neutral-200 bg-white py-3.5 pl-12 pr-4 text-base text-charcoal placeholder:text-neutral-300 transition-colors focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/20"
        />
      </div>
      {error ? (
        <p id="city-area-error" role="alert" className="mt-2 text-sm font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}