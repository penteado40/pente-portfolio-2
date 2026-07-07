import type { ApprovedTestimonial } from './testimonial';

export async function getTestimonials(): Promise<ApprovedTestimonial[]> {
  const apiUrl = process.env.API_URL;
  const apiKey = process.env.API_KEY;

  if (!apiUrl) return [];

  try {
    const res = await fetch(`${apiUrl}/testimonials/approved`, {
      headers: { 'X-API-Key': apiKey ?? '' },
      next: { revalidate: 300 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
