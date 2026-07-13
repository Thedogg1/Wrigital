'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { leadFormFieldsSchema } from '@/features/lead-capture/leadSchema';
import { calendlyUrl } from '@/lib/site';

type ModalStep = 'form' | 'confirmation';

type LeadCaptureModalProps = {
  isOpen: boolean;
  onClose: () => void;
  reportHtml: string;
  endpoint: '/api/uk-lead-capture' | '/api/us-lead-capture';
};

export default function LeadCaptureModal({
  isOpen,
  onClose,
  reportHtml,
  endpoint,
}: LeadCaptureModalProps) {
  const [step, setStep] = useState<ModalStep>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [firmName, setFirmName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    setStep('form');
    setName('');
    setEmail('');
    setFirmName('');
    setError('');
    setIsSubmitting(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => nameInputRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, [isOpen]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const parsed = leadFormFieldsSchema.safeParse({ name, email, firmName });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Please check your details.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...parsed.data,
          exitReportHtml: reportHtml,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          typeof data.error === 'string'
            ? data.error
            : 'Something went wrong. Please try again.',
        );
        return;
      }
      setStep('confirmation');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {step === 'form' ? (
          <>
            <DialogHeader>
              <DialogTitle>Receive your reports</DialogTitle>
              <DialogDescription>
                Enter your details and we will email your exit tax calculation and a
                sample intelligence report.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lead-name">Name</Label>
                <Input
                  id="lead-name"
                  ref={nameInputRef}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lead-email">Email</Label>
                <Input
                  id="lead-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lead-firm">Firm name</Label>
                <Input
                  id="lead-firm"
                  value={firmName}
                  onChange={(e) => setFirmName(e.target.value)}
                  autoComplete="organization"
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-[var(--color-critical)]" role="alert">
                  {error}
                </p>
              )}
              <button
                type="submit"
                className={cn(buttonVariants(), 'w-full')}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending…' : 'Send my reports'}
              </button>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Check your inbox</DialogTitle>
              <DialogDescription>
                Your extended exit tax report and sample intelligence report are on
                their way.
              </DialogDescription>
            </DialogHeader>
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants(), 'w-full text-center')}
            >
              Book a discovery call
            </a>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
