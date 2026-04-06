/**
 * Demo overrides for last survey date — used to force specific facilities
 * into upcoming survey windows for prototype purposes.
 * Keyed by facility ID.
 */
export const SURVEY_DATE_OVERRIDES: Record<string, string> = {
  'fac-avir-at-abilene':      '2025-01-18', // windowEnd ≈ Apr 18 2026 — 13 days out
  'fac-avir-at-adams':        '2025-02-05', // windowEnd ≈ May 5  2026 — 30 days out
  'fac-avir-at-arbor-terrace':'2025-02-22', // windowEnd ≈ May 22 2026 — 47 days out
  'fac-avir-at-arlington':    '2025-03-10', // windowEnd ≈ Jun 10 2026 — 66 days out
  'fac-avir-at-athens':       '2025-03-28', // windowEnd ≈ Jun 28 2026 — 84 days out
};

/** Returns the effective last survey date for a facility (override if present, else real). */
export function effectiveLastSurveyDate(facilityId: string, realDate: string): string {
  return SURVEY_DATE_OVERRIDES[facilityId] ?? realDate;
}
