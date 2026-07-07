'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { useLocale } from '@/i18n/LocaleProvider';
import { Modal } from './Modal';
import { TestimonialForm } from './TestimonialForm';

const TestimonialModalContext = createContext<{ open: () => void } | null>(null);

export function TestimonialModalProvider({ children }: { children: ReactNode }) {
  const { dict } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <TestimonialModalContext.Provider value={{ open: () => setIsOpen(true) }}>
      {children}
      <Modal isOpen={isOpen} onClose={close} closeLabel={dict.testimonialForm.close}>
        <TestimonialForm onSuccessClose={close} />
      </Modal>
    </TestimonialModalContext.Provider>
  );
}

export function useTestimonialModal() {
  const ctx = useContext(TestimonialModalContext);
  if (!ctx) throw new Error('useTestimonialModal must be used within a TestimonialModalProvider');
  return ctx;
}
