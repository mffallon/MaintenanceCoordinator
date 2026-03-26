/**
 * Format ISO date string (YYYY-MM-DD) to MM-DD-YYYY
 */
export function fmtDate(isoDate: string | null | undefined): string {
  if (!isoDate) return '—';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  return `${parts[1]}-${parts[2]}-${parts[0]}`;
}
