// Avir Life Safety Results — extracted from Excel
// Sources: Survey Overview, 2025-Present K-Tags, 2026 K/N/E-Tags detail sheets
import rawData from './avir_raw.json';

// --- Types ---

export interface AvirFacility {
  id: string;
  name: string;
  region: string;
  state: string;
  surveyed: boolean;
  surveyCount: number;
  lastSurveyDate: string;
  totalKTags: number;
  totalNTags: number;
  totalETags: number;
  totalCitations: number;
  hasWaiver: boolean;
}

export interface AvirSurvey {
  id: string;
  date: string;
  region: string;
  facility: string;
  facilityId: string;
  surveyor: string;
  kTags: number;
  nTags: number;
  eTags: number;
  total: number;
  isWaiver: boolean;
  isPending: boolean;
}

export interface AvirCitation {
  id: string;
  date: string;
  region: string;
  facility: string;
  facilityId: string;
  surveyor: string;
  tag: string;
  tagType: 'K' | 'N' | 'E';
  description: string;
  observation: string;
  status: string;
  isWaiver: boolean;
}

export interface AvirKTagHistory {
  id: string;
  year: number;
  date: string;
  region: string;
  facility: string;
  facilityId: string;
  surveyRegion: string;
  surveyor: string;
  citedTags: string[];
  waiverTags: string[];
  total: number;
}

// --- Build facilities ---

const facilityMap = new Map<string, {
  name: string; region: string; surveys: typeof rawData.surveys;
  totalK: number; totalN: number; totalE: number; total: number; hasWaiver: boolean;
}>();

for (const s of rawData.surveys) {
  const name = s.facility;
  if (!facilityMap.has(name)) {
    facilityMap.set(name, {
      name, region: s.region, surveys: [], totalK: 0, totalN: 0, totalE: 0, total: 0, hasWaiver: false,
    });
  }
  const fac = facilityMap.get(name)!;
  if (s.date) {
    fac.surveys.push(s);
    fac.totalK += s.kTags;
    fac.totalN += s.nTags;
    fac.totalE += s.eTags;
    fac.total += s.total;
    if (s.isWaiver) fac.hasWaiver = true;
  }
}

// Add any facilities from 2025 K-tag history not already in Survey Overview
for (const h of rawData.kTagsHistory) {
  if (!facilityMap.has(h.facility)) {
    facilityMap.set(h.facility, {
      name: h.facility, region: h.region, surveys: [], totalK: 0, totalN: 0, totalE: 0, total: 0, hasWaiver: false,
    });
  }
}

function makeFacId(name: string): string {
  return 'fac-' + name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
}

export const facilities: AvirFacility[] = [...facilityMap.entries()]
  .sort(([, a], [, b]) => a.name.localeCompare(b.name))
  .map(([name, f]) => {
    const lastSurvey = f.surveys.sort((a, b) => b.date.localeCompare(a.date))[0];
    return {
      id: makeFacId(name),
      name,
      region: f.region,
      state: 'TX',
      surveyed: f.surveys.length > 0,
      surveyCount: f.surveys.length,
      lastSurveyDate: lastSurvey?.date || '',
      totalKTags: f.totalK,
      totalNTags: f.totalN,
      totalETags: f.totalE,
      totalCitations: f.total,
      hasWaiver: f.hasWaiver,
    };
  });

const facIdByName = new Map(facilities.map((f) => [f.name, f.id]));
function getFacId(name: string): string {
  return facIdByName.get(name) || makeFacId(name);
}

// --- Build surveys ---

let surveyIdx = 0;
export const surveys: AvirSurvey[] = rawData.surveys
  .filter((s) => s.date)
  .map((s) => ({
    id: `srv-${++surveyIdx}`,
    date: s.date,
    region: s.region,
    facility: s.facility,
    facilityId: getFacId(s.facility),
    surveyor: s.surveyor || '',
    kTags: s.kTags,
    nTags: s.nTags,
    eTags: s.eTags,
    total: s.total,
    isWaiver: s.isWaiver,
    isPending: s.isPending,
  }))
  .sort((a, b) => b.date.localeCompare(a.date));

// --- Build citations (2026 detail) ---

let citIdx = 0;
function normTag(tag: string): string {
  // Normalize: K-211, N0319 -> K-211, N-0319
  if (tag.startsWith('N') && !tag.includes('-')) return `N-${tag.slice(1)}`;
  if (tag.startsWith('E') && !tag.includes('-')) return `E-${tag.slice(1)}`;
  return tag;
}

function tagType(tag: string): 'K' | 'N' | 'E' {
  if (tag.startsWith('K')) return 'K';
  if (tag.startsWith('E')) return 'E';
  return 'N';
}

// Check which surveys have waivers
const waiverFacilities = new Set(rawData.surveys.filter((s) => s.isWaiver).map((s) => s.facility));

const kCitations: AvirCitation[] = rawData.kCitations2026.map((c) => ({
  id: `cit-${++citIdx}`,
  date: c.date,
  region: c.region,
  facility: c.facility,
  facilityId: getFacId(c.facility),
  surveyor: c.surveyor,
  tag: normTag(c.tag),
  tagType: 'K' as const,
  description: c.description,
  observation: c.observation,
  status: c.status || 'Open',
  isWaiver: waiverFacilities.has(c.facility),
}));

const nCitations: AvirCitation[] = rawData.nCitations2026.map((c) => ({
  id: `cit-${++citIdx}`,
  date: c.date,
  region: c.region,
  facility: c.facility,
  facilityId: getFacId(c.facility),
  surveyor: c.surveyor,
  tag: normTag(c.tag),
  tagType: 'N' as const,
  description: c.description,
  observation: c.observation,
  status: c.status || 'Open',
  isWaiver: false,
}));

const eCitations: AvirCitation[] = rawData.eCitations2026.map((c) => ({
  id: `cit-${++citIdx}`,
  date: c.date,
  region: c.region,
  facility: c.facility,
  facilityId: getFacId(c.facility),
  surveyor: c.surveyor,
  tag: normTag(c.tag),
  tagType: 'E' as const,
  description: c.description,
  observation: c.observation,
  status: c.status || 'Pending',
  isWaiver: false,
}));

export const citations: AvirCitation[] = [...kCitations, ...nCitations, ...eCitations]
  .sort((a, b) => b.date.localeCompare(a.date));

// --- Build K-Tag history (2025+) ---

let histIdx = 0;
export const kTagHistory: AvirKTagHistory[] = rawData.kTagsHistory.map((h) => ({
  id: `kh-${++histIdx}`,
  year: h.year,
  date: h.date,
  region: h.region,
  facility: h.facility,
  facilityId: getFacId(h.facility),
  surveyRegion: h.surveyRegion,
  surveyor: h.surveyor,
  citedTags: h.citedTags,
  waiverTags: h.waiverTags,
  total: h.total,
})).sort((a: AvirKTagHistory, b: AvirKTagHistory) => b.date.localeCompare(a.date));

// --- Build N-Tag and E-Tag history (grouped by survey: date+facility) ---

function buildTagHistory(cits: AvirCitation[], prefix: string): AvirKTagHistory[] {
  const groupMap = new Map<string, { date: string; region: string; facility: string; facilityId: string; surveyor: string; tags: string[] }>();
  for (const c of cits) {
    const key = `${c.date}|${c.facilityId}`;
    if (!groupMap.has(key)) {
      groupMap.set(key, { date: c.date, region: c.region, facility: c.facility, facilityId: c.facilityId, surveyor: c.surveyor, tags: [] });
    }
    groupMap.get(key)!.tags.push(c.tag);
  }
  let idx = 0;
  return [...groupMap.values()]
    .map((g) => ({
      id: `${prefix}h-${++idx}`,
      year: new Date(g.date).getFullYear(),
      date: g.date,
      region: g.region,
      facility: g.facility,
      facilityId: g.facilityId,
      surveyRegion: '',
      surveyor: g.surveyor,
      citedTags: g.tags.sort(),
      waiverTags: [] as string[],
      total: g.tags.length,
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export const nTagHistory: AvirKTagHistory[] = buildTagHistory(nCitations, 'n');
export const eTagHistory: AvirKTagHistory[] = buildTagHistory(eCitations, 'e');

// --- Derived data ---

export const regions = [...new Set(facilities.map((f) => f.region))].sort();
export const surveyors = [...new Set(surveys.map((s) => s.surveyor).filter(Boolean))].sort();

// All unique tags with descriptions
const tagDescMap = new Map<string, string>();
for (const c of citations) {
  if (c.description && !tagDescMap.has(c.tag)) tagDescMap.set(c.tag, c.description);
}
export const tagDescriptions = tagDescMap;

// Summary stats
export const stats = {
  totalFacilities: facilities.length,
  surveyedFacilities: facilities.filter((f) => f.surveyed).length,
  totalSurveys: surveys.length,
  totalCitations: citations.length,
  totalKTags: citations.filter((c) => c.tagType === 'K').length,
  totalNTags: citations.filter((c) => c.tagType === 'N').length,
  totalETags: citations.filter((c) => c.tagType === 'E').length,
  deficiencyFree: surveys.filter((s) => s.total === 0 && !s.isPending).length,
  uniqueKTags: new Set(citations.filter((c) => c.tagType === 'K').map((c) => c.tag)).size,
  uniqueNTags: new Set(citations.filter((c) => c.tagType === 'N').map((c) => c.tag)).size,
  uniqueETags: new Set(citations.filter((c) => c.tagType === 'E').map((c) => c.tag)).size,
};
