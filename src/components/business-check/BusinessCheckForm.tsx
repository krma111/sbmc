'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { BusinessCategory, BusinessCheckData, BiggestChallenge, PreviewLead, PreferredLanguage } from '@/types/lead';
import { step1Schema, step2Schema, step3Schema, step4Schema, step5Schema, businessCheckSchema } from '@/lib/validation/schemas';
import { getRecommendation } from '@/lib/recommendation/engine';
import { leadRepository } from '@/lib/preview-storage';
import { createLeadOnServer, saveStepOnServer } from '@/lib/api/leads';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Step1Name } from './steps/Step1Name';
import { Step2Category } from './steps/Step2Category';
import { Step3Location } from './steps/Step3Location';
import { Step4Challenge } from './steps/Step4Challenge';
import { Step5WhatsApp } from './steps/Step5WhatsApp';
import { ResultScreen } from '@/components/results/ResultScreen';

interface FormTranslations {
  progress: string;
  next: string;
  back: string;
  submit: string;
  submitting: string;
  restart: string;
  edit: string;
  steps: {
    1: { question: string; placeholder: string; validation: { required: string; minLength: string; maxLength: string } };
    2: { question: string; placeholder: string; options: Record<BusinessCategory, string> };
    3: { question: string; placeholder: string; validation: { required: string; minLength: string; maxLength: string } };
    4: { question: string; placeholder: string; options: Record<BiggestChallenge, string> };
    5: { question: string; placeholder: string; consent: string; validation: { required: string; invalid: string; consentRequired: string } };
  };
}

interface ResultTranslations {
  heading: string;
  leadId: string;
  businessName: string;
  businessCategory: string;
  location: string;
  challenge: string;
  recommendedService: string;
  price: string;
  reason: string;
  freeSampleNote: string;
  continueWhatsApp: string;
  editAnswers: string;
  startAgain: string;
  whatsappOpening: string;
  copyMessage: string;
  copyNumber: string;
  messageCopied: string;
  numberCopied: string;
}

interface BusinessCheckFormProps {
  locale: 'en' | 'hi';
  t: FormTranslations;
  resultT: ResultTranslations;
}

const STEPS = 5;

export function BusinessCheckForm({ locale, t, resultT }: BusinessCheckFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<Partial<BusinessCheckData>>({ preferredLanguage: locale });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<PreviewLead | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);
  const submitRef = useRef(false);

  // Restore draft on mount
  useEffect(() => {
    const draft = leadRepository.getDraft();
    if (draft && draft.data) {
      setCurrentStep(Math.min(draft.currentStep, STEPS));
      setData((prev) => ({ ...prev, ...draft.data }));
      setDraftRestored(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist draft whenever step or data changes
  useEffect(() => {
    if (result) return;
    leadRepository.saveDraft({
      currentStep,
      data,
      updatedAt: new Date().toISOString(),
    });
  }, [currentStep, data, result]);

  const categoryOptions = useMemo(
    () =>
      Object.entries(t.steps['2'].options).map(([id, label]) => ({ id: id as BusinessCategory, label })),
    [t]
  );

  const challengeOptions = useMemo(
    () =>
      Object.entries(t.steps['4'].options).map(([id, label]) => ({ id: id as BiggestChallenge, label })),
    [t]
  );

  const validateStep = useCallback(
    (step: number, current: Partial<BusinessCheckData>): Record<string, string> => {
      const nextErrors: Record<string, string> = {};
      const v1 = t.steps['1'].validation;
      const v3 = t.steps['3'].validation;
      const v5 = t.steps['5'].validation;

      switch (step) {
        case 1: {
          const parsed = step1Schema.safeParse({ businessName: current.businessName ?? '' });
          if (!parsed.success) {
            const issue = parsed.error.issues[0];
            if (issue) {
              nextErrors.businessName =
                issue.code === 'too_small' ? v1.minLength : issue.code === 'too_big' ? v1.maxLength : v1.required;
            }
          }
          break;
        }
        case 2: {
          if (!current.businessCategory) {
            nextErrors.businessCategory = t.steps['2'].placeholder;
          }
          break;
        }
        case 3: {
          const parsed = step3Schema.safeParse({ cityArea: current.cityArea ?? '' });
          if (!parsed.success) {
            const issue = parsed.error.issues[0];
            if (issue) {
              nextErrors.cityArea = issue.code === 'too_small' ? v3.minLength : issue.code === 'too_big' ? v3.maxLength : v3.required;
            }
          }
          break;
        }
        case 4: {
          if (!current.biggestChallenge) {
            nextErrors.biggestChallenge = t.steps['4'].placeholder;
          }
          break;
        }
        case 5: {
          if (!current.consent) {
            nextErrors.consent = v5.consentRequired;
          }
          const parsed = step5Schema.safeParse({
            whatsappNumber: current.whatsappNumber ?? '',
            preferredLanguage: (current.preferredLanguage ?? locale) as PreferredLanguage,
            consent: true,
          });
          if (!parsed.success) {
            const issue = parsed.error.issues[0];
            if (issue && issue.path[0] === 'whatsappNumber') {
              nextErrors.whatsappNumber = issue.code === 'too_small' ? v5.required : v5.invalid;
            }
          }
          break;
        }
      }
      return nextErrors;
    },
    [t, locale]
  );

  const handleNext = () => {
    const stepErrors = validateStep(currentStep, data);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    const next = Math.min(currentStep + 1, STEPS);
    setCurrentStep(next);
    saveStepOnServer(next, data);
  };

  const handleBack = () => {
    setErrors({});
    const next = Math.max(currentStep - 1, 1);
    setCurrentStep(next);
    saveStepOnServer(next, data);
  };

  const handleRestart = () => {
    leadRepository.clearDraft();
    setData({ preferredLanguage: locale });
    setErrors({});
    setResult(null);
    setCurrentStep(1);
  };

  const handleEdit = () => {
    setResult(null);
    leadRepository.saveDraft({
      currentStep: STEPS,
      data,
      updatedAt: new Date().toISOString(),
    });
    setCurrentStep(STEPS);
  };

  const handleSubmit = async () => {
    if (submitRef.current) return;
    const stepErrors = validateStep(5, data);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    if (submitRef.current) return;
    submitRef.current = true;
    setSubmitting(true);
    setErrors({});

    const parsed = businessCheckSchema.safeParse({
      ...data,
      preferredLanguage: (data.preferredLanguage ?? locale) as PreferredLanguage,
    });

    if (!parsed.success) {
      setErrors({ whatsappNumber: t.steps['5'].validation.invalid });
      submitRef.current = false;
      setSubmitting(false);
      return;
    }

    const valid = parsed.data;
    const recommendation = getRecommendation(valid.biggestChallenge, valid.businessCategory);

    await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 300));

    try {
      const serverLead = await createLeadOnServer(valid);
      let lead: PreviewLead;

      if (serverLead) {
        lead = serverLead;
      } else {
        lead = await leadRepository.createLead({
          businessName: valid.businessName,
          businessCategory: valid.businessCategory,
          cityArea: valid.cityArea,
          biggestChallenge: valid.biggestChallenge,
          whatsappNumber: valid.whatsappNumber,
          preferredLanguage: valid.preferredLanguage,
          recommendedService: recommendation.serviceName,
          recommendedPrice: recommendation.price,
          recommendationReason: recommendation.reason,
          status: 'new',
          source: 'preview',
        });
      }

      leadRepository.clearDraft();
      setResult(lead);
    } catch {
      setErrors({ submit: locale === 'hi' ? 'कुछ गड़बड़ हो गई' : 'Something went wrong' });
    } finally {
      submitRef.current = false;
      setSubmitting(false);
    }
  };

  const handleEnterKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentStep < STEPS) {
      e.preventDefault();
      handleNext();
    }
  };

  if (result) {
    return <ResultScreen locale={locale} lead={result} t={resultT} onEdit={handleEdit} onRestart={handleRestart} />;
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-neutral-400" aria-live="polite">
            {t.progress.replace('{{current}}', String(currentStep))}
          </p>
          {draftRestored ? (
            <button
              type="button"
              onClick={handleRestart}
              className="text-xs font-semibold text-neutral-400 underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-charcoal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
            >
              {t.restart}
            </button>
          ) : null}
        </div>

        <ProgressBar current={currentStep} total={STEPS} className="mt-3" />

        <div className="mt-8" onKeyDown={handleEnterKey}>
          {currentStep === 1 ? (
            <Step1Name
              value={data.businessName ?? ''}
              onChange={(v) => {
                setData((d) => ({ ...d, businessName: v }));
                if (errors.businessName) setErrors((e) => ({ ...e, businessName: '' }));
              }}
              error={errors.businessName}
              question={t.steps['1'].question}
              placeholder={t.steps['1'].placeholder}
            />
          ) : null}

          {currentStep === 2 ? (
            <Step2Category
              value={(data.businessCategory as BusinessCategory) ?? null}
              onChange={(v) => {
                setData((d) => ({ ...d, businessCategory: v }));
                if (errors.businessCategory) setErrors((e) => ({ ...e, businessCategory: '' }));
              }}
              error={errors.businessCategory}
              question={t.steps['2'].question}
              options={categoryOptions}
            />
          ) : null}

          {currentStep === 3 ? (
            <Step3Location
              value={data.cityArea ?? ''}
              onChange={(v) => {
                setData((d) => ({ ...d, cityArea: v }));
                if (errors.cityArea) setErrors((e) => ({ ...e, cityArea: '' }));
              }}
              error={errors.cityArea}
              question={t.steps['3'].question}
              placeholder={t.steps['3'].placeholder}
            />
          ) : null}

          {currentStep === 4 ? (
            <Step4Challenge
              value={(data.biggestChallenge as BiggestChallenge) ?? null}
              onChange={(v) => {
                setData((d) => ({ ...d, biggestChallenge: v }));
                if (errors.biggestChallenge) setErrors((e) => ({ ...e, biggestChallenge: '' }));
              }}
              error={errors.biggestChallenge}
              question={t.steps['4'].question}
              options={challengeOptions}
            />
          ) : null}

          {currentStep === 5 ? (
            <Step5WhatsApp
              value={data.whatsappNumber ?? ''}
              onChange={(v) => {
                setData((d) => ({ ...d, whatsappNumber: v }));
                if (errors.whatsappNumber) setErrors((e) => ({ ...e, whatsappNumber: '' }));
              }}
              consent={data.consent ?? false}
              onConsentChange={(v) => {
                setData((d) => ({ ...d, consent: v }));
                if (errors.consent) setErrors((e) => ({ ...e, consent: '' }));
              }}
              error={errors.whatsappNumber}
              consentError={errors.consent}
              question={t.steps['5'].question}
              placeholder={t.steps['5'].placeholder}
              consentLabel={t.steps['5'].consent}
            />
          ) : null}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1 || submitting}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border-2 border-neutral-200 bg-white px-5 text-sm font-bold text-charcoal transition-colors hover:border-neutral-300 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
          >
            <svg className="mr-1.5 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            {t.back}
          </button>

          {currentStep < STEPS ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-charcoal px-6 text-sm font-bold text-white shadow-sm transition-colors hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
            >
              {t.next}
              <svg className="ml-1.5 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              aria-busy={submitting}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-green px-6 text-sm font-bold text-white shadow-sm transition-colors hover:bg-green/90 disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
            >
              {submitting ? (
                <>
                  <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {t.submitting}
                </>
              ) : (
                t.submit
              )}
            </button>
          )}
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-neutral-400" aria-live="polite">
          {locale === 'hi'
            ? 'आपकी जानकारी सुरक्षित रूप से सेव होती है ताकि हम WhatsApp पर फॉलो-अप कर सकें — भले ही आप अभी बीच में ही छोड़ दें।'
            : 'Your answers are saved securely so we can follow up on WhatsApp — even if you leave now.'}
        </p>
      </div>
    </div>
  );
}