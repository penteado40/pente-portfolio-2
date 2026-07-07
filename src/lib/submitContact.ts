import type { ContactInput } from './contact';

export type SubmitContactResult = { ok: true } | { ok: false; error: string };

export async function submitContact(input: ContactInput): Promise<SubmitContactResult> {
  try {
    const res = await fetch('/api/contacts', {
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
