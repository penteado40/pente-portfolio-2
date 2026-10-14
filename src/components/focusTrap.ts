/**
 * Where a Tab press should send focus to keep it inside `items`, or null to
 * let the browser move it. Wraps at both ends, and pulls focus back in when
 * it sits outside the list.
 */
export function wrapFocus<T>(items: readonly T[], active: T | null, backwards: boolean): T | null {
  if (items.length === 0) return null;
  const first = items[0];
  const last = items[items.length - 1];
  if (!items.includes(active as T)) return backwards ? last : first;
  if (backwards && active === first) return last;
  if (!backwards && active === last) return first;
  return null;
}
