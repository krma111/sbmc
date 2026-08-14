'use client';

interface Step1NameProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  question: string;
  placeholder: string;
}

export function Step1Name({ value, onChange, error, question, placeholder }: Step1NameProps) {
  return (
    <div>
      <label htmlFor="business-name" className="block text-lg font-bold tracking-tight text-charcoal">
        {question}
      </label>
      <input
        id="business-name"
        type="text"
        autoComplete="organization"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? 'business-name-error' : undefined}
        className="mt-4 w-full rounded-lg border-2 border-neutral-200 bg-white px-4 py-3.5 text-base text-charcoal placeholder:text-neutral-300 transition-colors focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/20"
      />
      {error ? (
        <p id="business-name-error" role="alert" className="mt-2 text-sm font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}