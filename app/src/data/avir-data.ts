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
  /** True when this facility is actively working through Plan of Correction */
  pocMode?: boolean;
  /** ISO date when POC responses are due (survey date + 45 days) */
  pocDueDate?: string;
  /** Survey date that triggered the current POC cycle */
  pocSurveyDate?: string;
  /** POC stage counts — for non-Meadow facilities these are seeded */
  pocStageCounts?: Partial<Record<PocStage, number>>;
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

export type PocStage = 'Open' | 'Submitted' | 'Approved' | 'Work Order' | 'Final Review' | 'Rejected' | 'Closed';
export type CitationSeverity = 'IJ' | 'Actual Harm' | 'Potential Harm' | 'No Harm';

export interface WorkOrder {
  /** Display ID e.g. "#5101" */
  id: string;
  status: 'Open' | 'In Progress' | 'Completed';
  title: string;
  location: string;
  assignee: string;
  dueDate: string; // ISO YYYY-MM-DD
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
  /** POC workflow stage — only set for facilities in pocMode */
  pocStatus?: PocStage;
  /** CMS severity level — set for POC mode citations */
  severity?: CitationSeverity;
  /** Written plan of correction response text */
  pocResponse?: string;
  /** Completion date committed in the POC */
  pocCompletionDate?: string;
  /** Work order attached to this citation (when pocStatus = 'Work Order') */
  workOrder?: WorkOrder;
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

// Raw JSON element shapes (needed for noImplicitAny when TS can't infer from JSON)
type RawCitation = { date: string; region: string; facility: string; surveyor: string; tag: string; description: string; observation: string; status?: string };
type RawKTagHistoryEntry = { year: number; date: string; region: string; facility: string; surveyRegion: string; surveyor: string; citedTags: string[]; waiverTags: string[]; total: number };
type RawSurvey = { date: string; region: string; facility: string; surveyor?: string; kTags: number; nTags: number; eTags: number; total: number; isWaiver: boolean; isPending: boolean };
const rawSurveys = rawData.surveys as RawSurvey[];

// --- Build facilities ---

const facilityMap = new Map<string, {
  name: string; region: string; surveys: RawSurvey[];
  totalK: number; totalN: number; totalE: number; total: number; hasWaiver: boolean;
}>();

for (const s of rawSurveys) {
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

// Facilities currently in Plan of Correction mode (survey date → POC due date = survey + 45 days)
const POC_FACILITIES: Record<string, { surveyDate: string; pocDueDate: string; pocStageCounts?: Partial<Record<PocStage, number>> }> = {
  'fac-avir-at-the-meadow': { surveyDate: '2026-03-04', pocDueDate: '2026-04-18' }, // stage counts computed from real citations
  'fac-avir-at-weatherford': { surveyDate: '2026-03-12', pocDueDate: '2026-04-26', pocStageCounts: { Open: 5, Submitted: 2, Approved: 1, 'Work Order': 1 } },
  'fac-avir-at-bay-city':    { surveyDate: '2026-02-27', pocDueDate: '2026-04-13', pocStageCounts: { Open: 7, Submitted: 3, Approved: 3, 'Work Order': 3, 'Final Review': 2 } },
  'fac-avir-at-irving':      { surveyDate: '2026-02-26', pocDueDate: '2026-04-12', pocStageCounts: { Open: 4, Submitted: 2, Approved: 3, 'Work Order': 2, 'Final Review': 1 } },
  'fac-avir-at-schertz':     { surveyDate: '2026-02-25', pocDueDate: '2026-04-11', pocStageCounts: { Open: 5, Submitted: 3, Approved: 2, 'Work Order': 3, 'Final Review': 1, Closed: 1 } },
  'fac-avir-at-pittsburg':   { surveyDate: '2026-02-24', pocDueDate: '2026-04-10', pocStageCounts: { Open: 3, Submitted: 2, Approved: 1, 'Work Order': 1 } },
  'fac-avir-at-pampa':       { surveyDate: '2026-02-11', pocDueDate: '2026-03-28', pocStageCounts: { Open: 1, Submitted: 1, Approved: 1, 'Work Order': 3, 'Final Review': 4, Closed: 4 } },
};

export const facilities: AvirFacility[] = [...facilityMap.entries()]
  .sort(([, a], [, b]) => a.name.localeCompare(b.name))
  .map(([name, f]) => {
    const lastSurvey = f.surveys.sort((a, b) => b.date.localeCompare(a.date))[0];
    const id = makeFacId(name);
    const poc = POC_FACILITIES[id];
    return {
      id,
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
      ...(poc ? { pocMode: true, pocDueDate: poc.pocDueDate, pocSurveyDate: poc.surveyDate, ...(poc.pocStageCounts ? { pocStageCounts: poc.pocStageCounts } : {}) } : {}),
    };
  });

const facIdByName = new Map(facilities.map((f) => [f.name, f.id]));
function getFacId(name: string): string {
  return facIdByName.get(name) || makeFacId(name);
}

// --- Build surveys ---

let surveyIdx = 0;
export const surveys: AvirSurvey[] = rawSurveys
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
const waiverFacilities = new Set(rawSurveys.filter((s) => s.isWaiver).map((s) => s.facility));

const kCitations: AvirCitation[] = (rawData.kCitations2026 as RawCitation[]).map((c) => ({
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

const nCitations: AvirCitation[] = (rawData.nCitations2026 as RawCitation[]).map((c) => ({
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

const eCitations: AvirCitation[] = (rawData.eCitations2026 as RawCitation[]).map((c) => ({
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

// Citations with written POCs — keyed by "facilityId|tag"
// pocStatus defaults to 'Submitted' if not specified
const POC_SUBMITTED: Record<string, { response: string; completionDate: string; pocStatus?: PocStage; workOrder?: WorkOrder }> = {
  'fac-avir-at-the-meadow|K-100': {
    completionDate: '2026-04-27',
    response: 'The facility has implemented a comprehensive Life Safety Code compliance program. The Director of Maintenance has completed a full audit of all general requirements and documented corrective actions. Staff have been retrained on applicable NFPA 101 standards. A monthly compliance checklist has been created and will be reviewed by the Administrator. Initial audit completed 3/18/2026; staff training completed 3/25/2026.',
    pocStatus: 'Approved' as const,
  },
  'fac-avir-at-the-meadow|K-211': {
    completionDate: '2026-04-24',
    response: 'All means of egress throughout the facility have been inspected, cleared of obstructions, and verified to meet minimum width requirements per NFPA 101. The Maintenance Director conducted a corridor-by-corridor walkthrough on 3/20/2026. Signage has been updated where needed. A bi-weekly egress inspection schedule has been added to the maintenance log. No obstructions were found during the re-inspection on 3/27/2026.',
    pocStatus: 'Approved' as const,
  },
  'fac-avir-at-the-meadow|K-222': {
    completionDate: '2026-04-25',
    response: 'All egress doors have been inspected by the Director of Maintenance and a certified fire door inspector. Doors found to be non-compliant were repaired or replaced by 3/22/2026. Positive-latching hardware has been verified on all corridor doors. A door inspection log has been created and will be completed monthly. Staff have been educated on not propping open fire doors during the all-hands meeting on 3/26/2026.',
    pocStatus: 'Approved' as const,
  },
  'fac-avir-at-the-meadow|K-291': {
    completionDate: '2026-04-26',
    response: 'Emergency lighting units have been tested throughout the facility. Failed battery packs were identified in 4 units and replaced by 3/19/2026. A 90-minute load test was performed on all units and documented in the maintenance log. Monthly testing has been added to the preventive maintenance schedule. The Maintenance Director will report results to the Safety Committee quarterly.',
    pocStatus: 'Approved' as const,
  },
  'fac-avir-at-the-meadow|K-293': {
    completionDate: '2026-04-22',
    response: 'All exit signs have been inspected and tested. Three non-illuminated signs were replaced with LED combo emergency/exit units by 3/21/2026. All signs are now visible from both directions and tested to confirm proper operation. Exit sign inspection has been added to the monthly life safety rounds. Results will be documented and retained for survey readiness.',
  },
  'fac-avir-at-the-meadow|K-300': {
    completionDate: '2026-04-28',
    response: 'The facility has reviewed and updated its fire protection policies and procedures in accordance with NFPA 101 and CMS requirements. The Safety Officer led a multi-disciplinary team review on 3/24/2026. Updated policies were approved by the Administrator and distributed to all department heads. Staff education sessions were completed in all three shifts by 3/31/2026. Documentation is on file and available for review.',
  },

  // ── Work Order citations (10 Open, 2 In Progress) ──────────────────────────

  'fac-avir-at-the-meadow|K-345': {
    completionDate: '2026-05-02',
    response: 'The Director of Maintenance has coordinated with the contracted fire alarm inspection company to schedule a complete inspection and functional test of all fire alarm initiating devices, including the inspector\'s test valve in the Hall 1 West biohazard closet. The vendor has been notified and a work order has been issued. Testing will be documented in the facility\'s fire alarm inspection log and retained for CMS survey readiness.',
    pocStatus: 'Work Order' as const,
    workOrder: { id: '#5101', status: 'Open', title: 'Fire alarm inspector\'s valve test — Hall 1 West biohazard closet', location: 'Hall 1 West — Biohazard Closet', assignee: 'Marcus Webb', dueDate: '2026-05-02' },
  },
  'fac-avir-at-the-meadow|K-353': {
    completionDate: '2026-05-05',
    response: 'The defective sidewall sprinkler head in the Dietary Manager\'s Office on Hall 1 Central has been flagged for immediate replacement. The Director of Maintenance has issued a work order to the licensed sprinkler contractor. The area has been monitored daily pending replacement. Upon completion, the system will be inspected and documentation filed per NFPA 25 requirements.',
    pocStatus: 'Work Order' as const,
    workOrder: { id: '#5102', status: 'Open', title: 'Replace defective sidewall sprinkler head — Dietary Manager\'s Office', location: 'Hall 1 Central — Dietary Manager\'s Office', assignee: 'Marcus Webb', dueDate: '2026-05-05' },
  },
  'fac-avir-at-the-meadow|K-355': {
    completionDate: '2026-05-03',
    response: 'The fire extinguisher in the outdoor enclosed area by Hall 100 East has been identified for immediate annual inspection and re-tagging. The Director of Maintenance has contacted the certified fire extinguisher vendor and issued a work order. All portable fire extinguishers will be inspected monthly going forward, with documentation maintained in the life safety binder.',
    pocStatus: 'Work Order' as const,
    workOrder: { id: '#5103', status: 'Open', title: 'Annual inspection and re-tag — outdoor fire extinguisher, Hall 100 East', location: 'Outdoor Enclosed Area — Hall 100 East', assignee: 'Carlos Vega', dueDate: '2026-05-03' },
  },
  'fac-avir-at-the-meadow|K-363': {
    completionDate: '2026-05-01',
    response: 'The laundry chute door on Hall 2 Central that failed to latch to the frame has been identified for repair. A work order has been issued to the maintenance team to adjust the door hardware and confirm positive latching. The door will be re-inspected after repair. A corridor door inspection checklist has been added to the monthly life safety rounds.',
    pocStatus: 'Work Order' as const,
    workOrder: { id: '#5104', status: 'Open', title: 'Repair laundry chute door latch — Hall 2 Central', location: 'Hall 2 Central — Laundry Chute', assignee: 'Carlos Vega', dueDate: '2026-05-01' },
  },
  'fac-avir-at-the-meadow|K-511': {
    completionDate: '2026-04-30',
    response: 'The electrical panel in the boiler room on Hall 1 Central that was found with an unsecured access door has been flagged for immediate correction. A work order has been issued to secure the panel door and verify all breaker labels are current. The boiler room will be added to the monthly safety walkthrough checklist to prevent recurrence.',
    pocStatus: 'Work Order' as const,
    workOrder: { id: '#5105', status: 'Open', title: 'Secure electrical panel door — Boiler Room, Hall 1 Central', location: 'Boiler Room — Hall 1 Central', assignee: 'Marcus Webb', dueDate: '2026-04-30' },
  },
  'fac-avir-at-the-meadow|K-712': {
    completionDate: '2026-05-10',
    response: 'The facility has identified a gap in quarterly fire drill documentation across all three shifts. The Director of Nursing and Safety Officer have collaborated to establish a fire drill calendar for Q2 2026. A work order has been issued to coordinate drill scheduling, staff notification, and documentation. Completed drills will be logged and reviewed by the Safety Committee monthly.',
    pocStatus: 'Work Order' as const,
    workOrder: { id: '#5106', status: 'Open', title: 'Schedule and document Q2 quarterly fire drills — all shifts', location: 'Facility-wide', assignee: 'Sarah Nguyen', dueDate: '2026-05-10' },
  },
  'fac-avir-at-the-meadow|N-0028': {
    completionDate: '2026-05-04',
    response: 'The 80 kW generator access doors that were found unlocked have been addressed. A work order has been issued to install an approved locking mechanism on both access doors to prevent unauthorized entry. The Director of Maintenance will verify the lock installation and document the completion. Generator access will be added to the monthly life safety inspection checklist.',
    pocStatus: 'Work Order' as const,
    workOrder: { id: '#5107', status: 'Open', title: 'Install locking mechanism on 80 kW generator access doors', location: 'Generator Room — Utility Area', assignee: 'Marcus Webb', dueDate: '2026-05-04' },
  },
  'fac-avir-at-the-meadow|N-0070': {
    completionDate: '2026-05-06',
    response: 'Five emergency light fixtures along the corridor by Rooms 225–231 were found non-functional. A work order has been issued to replace failed units with code-compliant LED emergency lighting. Replacement units will be tested for 90-minute battery duration per NFPA 101. Monthly testing of all emergency lighting will be added to the preventive maintenance schedule.',
    pocStatus: 'Work Order' as const,
    workOrder: { id: '#5108', status: 'Open', title: 'Replace failed emergency light fixtures — Rooms 225–231 corridor', location: 'Hall 2 — Rooms 225–231 Corridor', assignee: 'Carlos Vega', dueDate: '2026-05-06' },
  },
  'fac-avir-at-the-meadow|N-0163': {
    completionDate: '2026-04-29',
    response: 'The broken doorknob on the resident room smoke-resistant door on Hall 1 West was identified as a life safety deficiency. A work order has been issued to replace the doorknob assembly and verify the door closes and latches properly. The repair will be completed within 48 hours and re-inspected by the Director of Maintenance. A corridor door audit has been added to the monthly rounds.',
    pocStatus: 'Work Order' as const,
    workOrder: { id: '#5109', status: 'Open', title: 'Replace broken doorknob — smoke-resistant door, Hall 1 West', location: 'Hall 1 West — Resident Room Door', assignee: 'Carlos Vega', dueDate: '2026-04-29' },
  },
  'fac-avir-at-the-meadow|N-0388': {
    completionDate: '2026-05-01',
    response: 'A review of fire extinguisher inspection records confirmed that monthly inspections had not been consistently documented per NFPA 10. A work order has been issued to conduct an immediate inspection of all portable fire extinguishers facility-wide. A monthly inspection log has been created and assigned to the maintenance team. Completed logs will be filed in the life safety binder.',
    pocStatus: 'Work Order' as const,
    workOrder: { id: '#5110', status: 'Open', title: 'Complete facility-wide portable fire extinguisher inspections per NFPA 10', location: 'Facility-wide', assignee: 'Marcus Webb', dueDate: '2026-05-01' },
  },
  'fac-avir-at-the-meadow|K-741': {
    completionDate: '2026-04-28',
    response: 'The damaged ashtray in the designated smoking area south of the facility has been removed and replaced with a code-compliant, self-extinguishing ashtray receptacle. The smoking area has been inspected and all materials meet NFPA 101 requirements. Staff have been reminded of smoking area maintenance requirements. The area will be included in the monthly environmental safety rounding.',
    pocStatus: 'Work Order' as const,
    workOrder: { id: '#5111', status: 'In Progress', title: 'Replace ashtray with self-extinguishing receptacle — South smoking area', location: 'South Smoking Area — Exterior', assignee: 'Carlos Vega', dueDate: '2026-04-28' },
  },
  'fac-avir-at-the-meadow|K-916': {
    completionDate: '2026-05-02',
    response: 'The generator annunciator panel at the Hall 1 East Nurse Station was found displaying an error condition. A work order has been issued to the electrical contractor to inspect and repair the annunciator. The generator has been confirmed operational via direct test. Upon annunciator repair, a full functional test will be performed and documented in the generator log.',
    pocStatus: 'Work Order' as const,
    workOrder: { id: '#5112', status: 'In Progress', title: 'Repair generator annunciator panel — Hall 1 East Nurse Station', location: 'Hall 1 East — Nurse Station', assignee: 'Marcus Webb', dueDate: '2026-05-02' },
  },

  // ── Final Review citations (4) — completed work orders ────────────────────

  'fac-avir-at-the-meadow|K-918': {
    completionDate: '2026-04-20',
    response: 'The facility failed to conduct monthly electrolyte specific gravity testing on the generator battery. The Director of Maintenance has established a monthly generator battery testing protocol. A work order was issued to perform immediate testing and document baseline readings. Going forward, testing results will be logged in the preventive maintenance binder and reviewed by the Safety Committee quarterly.',
    pocStatus: 'Final Review' as const,
    workOrder: { id: '#5201', status: 'Completed', title: 'Establish monthly generator battery electrolyte testing protocol', location: 'Generator Room — Utility Area', assignee: 'Marcus Webb', dueDate: '2026-04-20' },
  },
  'fac-avir-at-the-meadow|N-0046': {
    completionDate: '2026-04-18',
    response: 'An electrical panel in the boiler room on Hall 1 Central was observed with an unsecured door exposing live components. The maintenance team immediately secured the panel door and verified all components were properly enclosed. A work order was issued to install a panel lock and conduct a full inspection of all electrical panels facility-wide. Documentation has been filed and panels added to the monthly safety rounds.',
    pocStatus: 'Final Review' as const,
    workOrder: { id: '#5202', status: 'Completed', title: 'Secure electrical panel and conduct facility-wide panel inspection — Boiler Room', location: 'Boiler Room — Hall 1 Central', assignee: 'Marcus Webb', dueDate: '2026-04-18' },
  },
  'fac-avir-at-the-meadow|N-0154': {
    completionDate: '2026-04-16',
    response: 'Observation on Hall 1 West revealed only one over-bed light was provided in a resident room that required two. The Director of Maintenance issued a work order to install the required second over-bed light fixture and verify all resident rooms on Hall 1 West meet lighting requirements. The installation was completed and all fixtures tested for proper operation. A lighting audit has been added to the quarterly environmental rounds.',
    pocStatus: 'Final Review' as const,
    workOrder: { id: '#5203', status: 'Completed', title: 'Install missing over-bed light fixture — Hall 1 West resident room', location: 'Hall 1 West — Resident Room', assignee: 'Carlos Vega', dueDate: '2026-04-16' },
  },
  'fac-avir-at-the-meadow|N-0400': {
    completionDate: '2026-04-15',
    response: 'A fire extinguisher in the laundry room was found on the floor rather than mounted at the required height per NFPA 10. The Director of Maintenance immediately relocated and mounted the extinguisher at the correct height using an approved wall bracket. A work order was issued to audit all fire extinguisher mounting heights facility-wide. All units have been verified and documentation filed in the life safety binder.',
    pocStatus: 'Final Review' as const,
    workOrder: { id: '#5204', status: 'Completed', title: 'Mount fire extinguisher at correct height and audit all locations', location: 'Laundry Room', assignee: 'Carlos Vega', dueDate: '2026-04-15' },
  },
  'fac-avir-at-the-meadow|N-0217': {
    completionDate: '2026-04-14',
    response: 'Observation revealed a soiled linen barrel and soiled cart were stored in a resident toilet facility, creating an infection control and odor hazard. The Director of Nursing immediately removed the items and relocated them to the designated soiled utility room. A work order was issued to install a reminder sign on the bathroom door and add soiled storage compliance to daily housekeeping rounds. Staff were re-educated on proper soiled linen storage at the next shift huddle.',
    pocStatus: 'Final Review' as const,
    workOrder: { id: '#5205', status: 'Completed', title: 'Remove soiled linen from resident bathroom and reinforce storage policy', location: 'Resident Toilet Facility — Hall 1', assignee: 'Sarah Nguyen', dueDate: '2026-04-14' },
  },
  'fac-avir-at-the-meadow|N-0298': {
    completionDate: '2026-04-17',
    response: 'The exit door by Room 160 on Hall 1 East was found not holding open as required. The Director of Maintenance inspected the hold-open device and found the electromagnetic hold-open mechanism had failed. A work order was issued to repair and test the hold-open device. The repair was completed and the door confirmed to hold open properly on activation of the fire alarm system. Hold-open device testing has been added to the quarterly fire alarm inspection.',
    pocStatus: 'Final Review' as const,
    workOrder: { id: '#5206', status: 'Completed', title: 'Repair electromagnetic hold-open device — exit door by Room 160, Hall 1 East', location: 'Hall 1 East — Exit Door, Room 160', assignee: 'Carlos Vega', dueDate: '2026-04-17' },
  },
  'fac-avir-at-the-meadow|N-0823': {
    completionDate: '2026-04-21',
    response: 'The facility failed to ensure emergency lighting exit signs were tested at a minimum of 30 seconds monthly and 90 minutes annually. The Director of Maintenance conducted an immediate facility-wide emergency lighting test. A work order was issued to document all test results and replace any units that failed. A monthly testing log has been created and assigned to maintenance staff. Annual 90-minute load tests have been scheduled and added to the preventive maintenance calendar.',
    pocStatus: 'Final Review' as const,
    workOrder: { id: '#5207', status: 'Completed', title: 'Complete facility-wide emergency lighting 30-second and 90-minute testing', location: 'Facility-wide', assignee: 'Marcus Webb', dueDate: '2026-04-21' },
  },

  // ── Closed citations (3) — review completed, all work done ───────────────

  'fac-avir-at-the-meadow|N-0847': {
    completionDate: '2026-03-25',
    response: 'The facility observed a non-compliant ashtray receptacle in the designated outdoor smoking area. The deficient receptacle was immediately removed and replaced with an approved self-closing, self-extinguishing receptacle. The smoking area policy has been reviewed and updated. All staff were re-educated on the smoking policy and proper use of designated areas during the next shift huddle on 3/18/2026. Monthly environmental rounds now include verification of smoking area compliance.',
    pocStatus: 'Closed' as const,
  },
  'fac-avir-at-the-meadow|E-0009': {
    completionDate: '2026-03-28',
    response: 'The facility identified a gap in its emergency preparedness documentation related to local, state, and tribal collaboration requirements. The Emergency Preparedness Coordinator conducted a full review of all collaboration agreements and updated the emergency plan to include current contact lists and memoranda of understanding with local emergency management and tribal liaisons. The updated plan was reviewed and signed by the Administrator on 3/22/2026 and submitted to the state agency. Annual review of all collaboration agreements has been added to the EP committee calendar.',
    pocStatus: 'Closed' as const,
  },
  'fac-avir-at-the-meadow|N-0805': {
    completionDate: '2026-03-22',
    response: 'Weekly generator operation testing records were found incomplete for two weeks in Q1 2026. The Director of Maintenance immediately conducted a manual operational test and documented results. A standardized weekly generator log has been created and assigned to the maintenance team lead. Completed logs are reviewed by the Director of Maintenance each Monday and filed in the life safety binder. Maintenance staff were re-educated on documentation requirements on 3/15/2026. No further gaps have been identified since corrective action.',
    pocStatus: 'Closed' as const,
  },
};
const SEVERITY_BY_TYPE: Record<string, CitationSeverity[]> = {
  K: ['IJ', 'Actual Harm', 'Potential Harm', 'Potential Harm', 'Potential Harm'],
  N: ['Potential Harm', 'Potential Harm', 'Potential Harm', 'Actual Harm', 'No Harm'],
  E: ['Potential Harm', 'No Harm', 'Potential Harm'],
};
const pocSeverityCounters: Record<string, number> = {};
export const citations: AvirCitation[] = [...kCitations, ...nCitations, ...eCitations]
  .sort((a, b) => b.date.localeCompare(a.date))
  .map((c) => {
    if (!POC_FACILITIES[c.facilityId]) return c;
    const key = `${c.facilityId}-${c.tagType}`;
    const idx = pocSeverityCounters[key] = (pocSeverityCounters[key] ?? -1) + 1;
    const pool = SEVERITY_BY_TYPE[c.tagType] ?? SEVERITY_BY_TYPE.N;
    const severity: CitationSeverity = pool[idx % pool.length];
    const submitKey = `${c.facilityId}|${c.tag}`;
    const submitted = POC_SUBMITTED[submitKey];
    if (submitted) {
      return { ...c, pocStatus: (submitted.pocStatus ?? 'Submitted') as PocStage, severity, pocResponse: submitted.response, pocCompletionDate: submitted.completionDate, workOrder: submitted.workOrder };
    }
    return { ...c, pocStatus: 'Open' as PocStage, severity };
  });

// --- Build K-Tag history (2025+) ---

let histIdx = 0;
export const kTagHistory: AvirKTagHistory[] = (rawData.kTagsHistory as RawKTagHistoryEntry[]).map((h) => ({
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
