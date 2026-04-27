/**
 * Format ISO date string (YYYY-MM-DD) to M/D/YYYY
 */
export function fmtDate(isoDate: string | null | undefined): string {
  if (!isoDate) return '—';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  return `${month}/${day}/${parts[0]}`;
}
