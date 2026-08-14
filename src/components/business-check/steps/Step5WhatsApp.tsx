'use client';

interface Step5WhatsAppProps {
  value: string;
  onChange: (value: string) => void;
  consent: boolean;
  onConsentChange: (value: boolean) => void;
  error?: string;
  consentError?: string;
  question: string;
  placeholder: string;
  consentLabel: string;
}

export function Step5WhatsApp({
  value,
  onChange,
  consent,
  onConsentChange,
  error,
  consentError,
  question,
  placeholder,
  consentLabel,
}: Step5WhatsAppProps) {
  return (
    <div>
      <label htmlFor="whatsapp-number" className="block text-lg font-bold tracking-tight text-charcoal">
        {question}
      </label>
      <div className="relative mt-4">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-400" aria-hidden="true">
          +91
        </span>
        <input
          id="whatsapp-number"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'whatsapp-number-error' : undefined}
          className="w-full rounded-lg border-2 border-neutral-200 bg-white py-3.5 pl-14 pr-4 text-base text-charcoal placeholder:text-neutral-300 transition-colors focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/20"
        />
      </div>
      {error ? (
        <p id="whatsapp-number-error" role="alert" className="mt-2 text-sm font-medium text-red-600">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex items-start gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
        <input
          id="consent"
          type="checkbox"
          checked={consent}
          onChange={(e) => onConsentChange(e.target.checked)}
          aria-invalid={consentError ? true : undefined}
          aria-describedby={consentError ? 'consent-error' : undefined}
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-cyan"
        />
        <label htmlFor="consent" className="cursor-pointer text-sm leading-6 text-neutral-600">
          {consentLabel}
        </label>
      </div>
      {consentError ? (
        <p id="consent-error" role="alert" className="mt-2 text-sm font-medium text-red-600">
          {consentError}
        </p>
      ) : null}
    </div>
  );
}