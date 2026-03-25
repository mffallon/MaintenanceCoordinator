import type { SurveyTrend, CategoryBreakdown, StateData } from '../types';

// Monthly trend data (mocked but realistic based on Excel totals: 1,723 citations across 127 facilities)
export const surveyTrends: SurveyTrend[] = [
  { month: 'Jan 2024', citations: 82, surveys: 8, avgRiskScore: 12.4 },
  { month: 'Feb 2024', citations: 95, surveys: 11, avgRiskScore: 14.1 },
  { month: 'Mar 2024', citations: 110, surveys: 12, avgRiskScore: 13.8 },
  { month: 'Apr 2024', citations: 78, surveys: 9, avgRiskScore: 11.2 },
  { month: 'May 2024', citations: 120, surveys: 10, avgRiskScore: 15.5 },
  { month: 'Jun 2024', citations: 135, surveys: 14, avgRiskScore: 14.9 },
  { month: 'Jul 2024', citations: 98, surveys: 8, avgRiskScore: 12.1 },
  { month: 'Aug 2024', citations: 145, surveys: 13, avgRiskScore: 16.2 },
  { month: 'Sep 2024', citations: 160, surveys: 15, avgRiskScore: 15.8 },
  { month: 'Oct 2024', citations: 130, surveys: 11, avgRiskScore: 13.6 },
  { month: 'Nov 2024', citations: 175, surveys: 16, avgRiskScore: 17.1 },
  { month: 'Dec 2024', citations: 155, surveys: 12, avgRiskScore: 14.5 },
  { month: 'Jan 2025', citations: 140, surveys: 10, avgRiskScore: 13.9 },
];

// Severity breakdown by month for stacked area chart (realistic proportions based on Excel F-Tag data)
// IJ ~2%, Actual Harm ~5%, Potential Harm ~80%, No Harm ~13% (from Excel national data)
export const severityTrends = surveyTrends.map((t) => {
  const ij = Math.round(t.citations * (0.015 + Math.random() * 0.015));
  const ah = Math.round(t.citations * (0.04 + Math.random() * 0.03));
  const nh = Math.round(t.citations * (0.10 + Math.random() * 0.06));
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

// Real data from Excel Citation Categories sheet
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
