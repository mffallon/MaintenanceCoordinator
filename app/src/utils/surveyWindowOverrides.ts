/**
 * Demo overrides for last survey date — used to force specific facilities
 * into upcoming survey windows for prototype purposes.
 * Keyed by facility ID.
 */
export const SURVEY_DATE_OVERRIDES: Record<string, string> = {
  // In Survey Window (window already open)
  'fac-avir-at-cotulla':       '2025-02-15', // ws=Nov 15 2025, we=May 15 2026 — in window
  'fac-avir-at-temple-west':   '2025-03-10', // ws=Dec 10 2025, we=Jun 10 2026 — in window
  // Due Soon (≤30 days until open)
  'fac-avir-at-kaufman':       '2025-07-10', // ws=Apr 10 2026 —  8 days
  'fac-avir-at-caldwell':      '2025-07-18', // ws=Apr 18 2026 — 16 days
  'fac-avir-at-belton':        '2025-07-25', // ws=Apr 25 2026 — 23 days
  // Upcoming (31–90 days until open)
  'fac-avir-at-lancaster':     '2025-08-05', // ws=May  5 2026 — 33 days
  'fac-avir-at-river-ridge':   '2025-08-20', // ws=May 20 2026 — 48 days
  'fac-avir-at-snyder':        '2025-09-05', // ws=Jun  5 2026 — 64 days
  'fac-avir-at-arlington':     '2025-09-07', // ws=Jun  7 2026 — 66 days
  'fac-avir-at-athens':        '2025-09-25', // ws=Jun 25 2026 — 84 days
};

/** Returns the effective last survey date for a facility (override if present, else real). */
export function effectiveLastSurveyDate(facilityId: string, realDate: string): string {
  return SURVEY_DATE_OVERRIDES[facilityId] ?? realDate;
}
