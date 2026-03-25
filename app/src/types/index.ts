export interface Facility {
  id: string;
  ccn: string;
  name: string;
  city: string;
  state: string;
  region: string;
  totalCitations: number;
  ijCitations: number;
  actualHarm: number;
  potentialHarm: number;
  noHarm: number;
  corrected: number;
  hasPlan: number;
  noPlan: number;
  pastNonComp: number;
  surveys: number;
  surveyWindowStart: string;
  surveyWindowEnd: string;
  riskScore: number;
  lastSurveyDate: string;
  surveyType: string;
  nearing90Days: boolean;
  deficiencyFree: boolean;
  kTags: number;
  eTags: number;
  stateTags: number;
  documentationGaps: { tasks: number; logs: number; docs: number };
  pocCount: number;
  pocDueDate: string | null;
  pocStatus: 'on-track' | 'overdue' | 'completed' | 'not-started' | null;
  benchmarkVsPeers: number; // positive = above avg, negative = below
}

export interface Citation {
  id: string;
  facilityId: string;
  tag: string;
  description: string;
  category: string;
  severity: 'IJ' | 'Actual Harm' | 'Potential Harm' | 'No Harm';
  scope: 'Isolated' | 'Pattern' | 'Widespread';
  status: 'Open' | 'Corrected' | 'Has Plan' | 'No Plan' | 'Past Non-Compliance';
  surveyDate: string;
  surveyType: string;
  documentationGaps: { tasks: boolean; logs: boolean; docs: boolean };
  resolutionSteps: string;
  preventionStrategies: string;
}

export interface SurveyTrend {
  month: string;
  citations: number;
  surveys: number;
  avgRiskScore: number;
}

export interface CategoryBreakdown {
  category: string;
  count: number;
  facilitiesAffected: number;
  percentOfPortfolio: number;
}

export interface StateData {
  state: string;
  facilities: number;
  totalCitations: number;
  avgCitationsPerFacility: number;
  ijCitations: number;
  actualHarm: number;
  avgRiskScore: number;
  vsNationalAvg: number;
}
