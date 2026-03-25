import type { SurveyTrend, CategoryBreakdown, StateData } from '../types';

// Last 12 months of data (Apr 2025–Mar 2026) — realistic based on Excel totals
export const surveyTrends: SurveyTrend[] = [
  { month: 'Apr 2025', citations: 95, surveys: 11, avgRiskScore: 14.1 },
  { month: 'May 2025', citations: 110, surveys: 12, avgRiskScore: 13.8 },
  { month: 'Jun 2025', citations: 78, surveys: 9, avgRiskScore: 11.2 },
  { month: 'Jul 2025', citations: 120, surveys: 10, avgRiskScore: 15.5 },
  { month: 'Aug 2025', citations: 135, surveys: 14, avgRiskScore: 14.9 },
  { month: 'Sep 2025', citations: 98, surveys: 8, avgRiskScore: 12.1 },
  { month: 'Oct 2025', citations: 145, surveys: 13, avgRiskScore: 16.2 },
  { month: 'Nov 2025', citations: 160, surveys: 15, avgRiskScore: 15.8 },
  { month: 'Dec 2025', citations: 130, surveys: 11, avgRiskScore: 13.6 },
  { month: 'Jan 2026', citations: 175, surveys: 16, avgRiskScore: 17.1 },
  { month: 'Feb 2026', citations: 155, surveys: 12, avgRiskScore: 14.5 },
  { month: 'Mar 2026', citations: 140, surveys: 10, avgRiskScore: 13.9 },
];

// Severity breakdown by month for stacked area chart (deterministic, realistic proportions)
// IJ ~2%, Actual Harm ~5%, Potential Harm ~80%, No Harm ~13% (from Excel national data)
const ijPcts = [0.02, 0.015, 0.025, 0.018, 0.02, 0.03, 0.015, 0.022, 0.018, 0.02, 0.025, 0.015];
const ahPcts = [0.05, 0.06, 0.04, 0.055, 0.05, 0.065, 0.045, 0.05, 0.06, 0.04, 0.055, 0.05];
const nhPcts = [0.12, 0.14, 0.11, 0.13, 0.12, 0.15, 0.10, 0.13, 0.14, 0.11, 0.12, 0.13];
export const severityTrends = surveyTrends.map((t, i) => {
  const ij = Math.round(t.citations * ijPcts[i]);
  const ah = Math.round(t.citations * ahPcts[i]);
  const nh = Math.round(t.citations * nhPcts[i]);
  const ph = t.citations - ij - ah - nh;
  return {
    month: t.month,
    total: t.citations,
    'Immediate Jeopardy': ij,
    'Actual Harm': ah,
    'Potential Harm': ph,
    'No Harm': nh,
  };
});

// Real data from Excel Citation Categories sheet, with severity breakdown
// Proportions based on Excel F-Tag reference: IJ varies by category, Abuse highest IJ rate
export const categoryBreakdown: CategoryBreakdown[] = [
  { category: 'Quality of Life and Care', count: 520, facilitiesAffected: 66, percentOfPortfolio: 52.0 },
  { category: 'Resident Assessment & Care Planning', count: 185, facilitiesAffected: 20, percentOfPortfolio: 15.7 },
  { category: 'Abuse, Neglect & Exploitation', count: 142, facilitiesAffected: 10, percentOfPortfolio: 7.9 },
  { category: 'Resident Rights', count: 110, facilitiesAffected: 9, percentOfPortfolio: 7.1 },
  { category: 'Pharmacy Services', count: 95, facilitiesAffected: 6, percentOfPortfolio: 4.7 },
  { category: 'Infection Control', count: 90, facilitiesAffected: 6, percentOfPortfolio: 4.7 },
  { category: 'Nutrition and Dietary', count: 65, facilitiesAffected: 4, percentOfPortfolio: 3.1 },
  { category: 'Nursing & Physician Services', count: 42, facilitiesAffected: 3, percentOfPortfolio: 2.4 },
  { category: 'Administration', count: 38, facilitiesAffected: 3, percentOfPortfolio: 2.4 },
];

export const categorySeverity = [
  { category: 'Quality of Life & Care', ij: 18, actualHarm: 38, potentialHarm: 420, noHarm: 44 },
  { category: 'Assessment & Planning', ij: 5, actualHarm: 12, potentialHarm: 155, noHarm: 13 },
  { category: 'Abuse & Exploitation', ij: 55, actualHarm: 42, potentialHarm: 40, noHarm: 5 },
  { category: 'Resident Rights', ij: 2, actualHarm: 8, potentialHarm: 90, noHarm: 10 },
  { category: 'Pharmacy Services', ij: 1, actualHarm: 3, potentialHarm: 85, noHarm: 6 },
  { category: 'Infection Control', ij: 8, actualHarm: 2, potentialHarm: 75, noHarm: 5 },
];

// Real data from Excel State Summary sheet
export const stateData: StateData[] = [
  { state: 'FL', facilities: 18, totalCitations: 121, avgCitationsPerFacility: 6.7, ijCitations: 2, actualHarm: 2, avgRiskScore: 1.7, vsNationalAvg: -2.8 },
  { state: 'TN', facilities: 18, totalCitations: 113, avgCitationsPerFacility: 6.3, ijCitations: 7, actualHarm: 8, avgRiskScore: 6.3, vsNationalAvg: -3.2 },
  { state: 'MA', facilities: 12, totalCitations: 125, avgCitationsPerFacility: 10.4, ijCitations: 0, actualHarm: 9, avgRiskScore: 3.8, vsNationalAvg: 0.9 },
  { state: 'WA', facilities: 11, totalCitations: 399, avgCitationsPerFacility: 36.3, ijCitations: 3, actualHarm: 21, avgRiskScore: 12.5, vsNationalAvg: 26.8 },
  { state: 'CO', facilities: 9, totalCitations: 74, avgCitationsPerFacility: 8.2, ijCitations: 1, actualHarm: 11, avgRiskScore: 7.2, vsNationalAvg: -1.3 },
  { state: 'MO', facilities: 8, totalCitations: 176, avgCitationsPerFacility: 22.0, ijCitations: 3, actualHarm: 9, avgRiskScore: 10.5, vsNationalAvg: 12.5 },
  { state: 'ID', facilities: 7, totalCitations: 75, avgCitationsPerFacility: 10.7, ijCitations: 0, actualHarm: 1, avgRiskScore: 0.7, vsNationalAvg: 1.2 },
  { state: 'AZ', facilities: 6, totalCitations: 75, avgCitationsPerFacility: 12.5, ijCitations: 0, actualHarm: 3, avgRiskScore: 2.5, vsNationalAvg: 3.0 },
  { state: 'IN', facilities: 6, totalCitations: 80, avgCitationsPerFacility: 13.3, ijCitations: 0, actualHarm: 0, avgRiskScore: 0, vsNationalAvg: 3.8 },
  { state: 'KS', facilities: 5, totalCitations: 89, avgCitationsPerFacility: 17.8, ijCitations: 4, actualHarm: 3, avgRiskScore: 11.0, vsNationalAvg: 8.3 },
  { state: 'NE', facilities: 4, totalCitations: 52, avgCitationsPerFacility: 13.0, ijCitations: 1, actualHarm: 2, avgRiskScore: 8.5, vsNationalAvg: 3.5 },
  { state: 'NM', facilities: 3, totalCitations: 31, avgCitationsPerFacility: 10.3, ijCitations: 2, actualHarm: 2, avgRiskScore: 10.0, vsNationalAvg: 0.8 },
];
