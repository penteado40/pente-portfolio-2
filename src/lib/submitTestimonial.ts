import type { Testimonial } from './testimonial';

export type SubmitTestimonialResult = { ok: true } | { ok: false; error: string };

export async function submitTestimonial(input: Testimonial): Promise<SubmitTestimonialResult> {
  try {
    const res = await fetch('/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (res.ok) return { ok: true };

    const data = await res.json().catch(() => null);
    return { ok: false, error: data?.error ?? `Request failed with status ${res.status}` };
  } catch {
    return { ok: false, error: 'Network error' };
  }
}
