/**
 * Returns a predicate that checks if a date string (YYYY-MM-DD) passes the given date range filter.
 * Uses a fixed reference date consistent with the prototype dataset.
 */
const REF_DATE = new Date('2026-04-05');

export function makeDateFilter(dateRange: string): (dateStr: string) => boolean {
  if (dateRange === 'all') return () => true;

  let cutoff: Date | null = null;
  let monthFilter: string | null = null;

  const y = REF_DATE.getFullYear();
  const m = REF_DATE.getMonth();
  const d = REF_DATE.getDate();

  if (dateRange === '30d') cutoff = new Date(y, m, d - 30);
  else if (dateRange === '60d') cutoff = new Date(y, m, d - 60);
  else if (dateRange === '90d') cutoff = new Date(y, m, d - 90);
  else if (dateRange === 'ytd') cutoff = new Date(y, 0, 1);
  else if (dateRange === '12m') cutoff = new Date(y - 1, m, d);
  else if (dateRange.match(/^\d{4}-\d{2}$/)) monthFilter = dateRange;

  return (dateStr: string) => {
    if (!dateStr) return false;
    if (cutoff && new Date(dateStr) < cutoff) return false;
    if (monthFilter && !dateStr.startsWith(monthFilter)) return false;
    return true;
  };
}
