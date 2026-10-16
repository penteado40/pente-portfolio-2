const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Where a finite row of cards stands: `first` is the first card in view,
 * `perView` how many fit. The row splits into windows of a view each, one
 * per dot, the last one flush with the end. The arrows step from window to
 * window and stop at either end; nothing wraps around. `prev`/`next` are
 * the first card to scroll to, or null at that end.
 */
export function carouselWindow(first: number, perView: number, total: number) {
  const view = Math.max(1, Math.min(perView, total));
  const lastStart = Math.max(0, total - view);
  const start = Math.min(Math.max(0, first), lastStart);

  const pages = Math.max(1, Math.ceil(total / view));
  const page = start === lastStart ? pages - 1 : Math.floor(start / view);

  const pageStart = (p: number) => Math.min(p * view, lastStart);
  const rangeFrom = (s: number) => (view === 1 ? pad(s + 1) : `${pad(s + 1)}–${pad(s + view)}`);
  const range = rangeFrom(start);

  return {
    /** "01–03", the cards in view. */
    range,
    label: `${range} / ${pad(total)}`,
    // A swipe can leave the row between windows: back then goes to the
    // start of the window it is in, forward to the next one.
    prev: start > 0 ? pageStart(start === pageStart(page) ? page - 1 : page) : null,
    next: start < lastStart ? pageStart(page + 1) : null,
    pages,
    page,
    /** The first card of a dot's window. */
    pageStart,
    /** A dot's window, "04–06". */
    pageRange: (p: number) => rangeFrom(pageStart(p)),
  };
}
