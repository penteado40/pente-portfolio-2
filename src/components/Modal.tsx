'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { XIcon } from '@phosphor-icons/react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  closeLabel: string;
  children: ReactNode;
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({ isOpen, onClose, closeLabel, children }: ModalProps) {
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    triggerRef.current = document.activeElement as HTMLElement;
    document.body.style.overflow = 'hidden';

    const focusable = cardRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    focusable?.[0]?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key !== 'Tab' || !cardRef.current) return;

      const items = cardRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      triggerRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-background/70 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            ref={cardRef}
            role="dialog"
            aria-modal="true"
            className="glass-strong relative w-full max-w-md rounded-3xl p-6 md:p-8"
            initial={reduce ? false : { opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              reduce
                ? { opacity: 0, transition: { duration: 0 } }
                : { opacity: 0, scale: 0.95, y: 8, transition: { duration: 0.15, ease: 'easeIn' } }
            }
            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 30 }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="absolute top-4 right-4 glass-strong p-1.5 rounded-full text-ink/80 hover:text-ink transition-colors"
            >
              <XIcon size={16} weight="bold" />
            </button>

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
