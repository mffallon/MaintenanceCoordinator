import type { Facility } from '../types';

const surveyTypes = ['CMS Life Safety', 'CMS Health', 'State Fire Marshal', 'Joint Commission'];

function regionForState(state: string): string {
  const map: Record<string, string> = {
    FL: 'Southeast', TN: 'Southeast', MA: 'Northeast', WA: 'West',
    CO: 'West', MO: 'Midwest', ID: 'West', AZ: 'Southwest',
    IN: 'Midwest', KS: 'Central', NE: 'Central', NM: 'Southwest',
    OR: 'West', NC: 'Southeast', OH: 'Midwest', PA: 'Northeast',
    VA: 'Southeast', GA: 'Southeast', KY: 'Southeast', AL: 'Southeast',
    NV: 'West', UT: 'West', WY: 'West', OK: 'Central',
  };
  return map[state] || 'Other';
}

// Real data from LifeCareCenters Excel
const rawFacilities: Array<{
  ccn: string; name: string; city: string; state: string;
  totalCitations: number; ij: number; ah: number; ph: number; nh: number;
  corrected: number; hasPlan: number; noPlan: number; pastNonComp: number;
  surveys: number; windowStart: string; windowEnd: string; riskScore: number;
}> = [
  { ccn: '175157', name: 'Life Care Center of Andover', city: 'Andover', state: 'KS', totalCitations: 24, ij: 4, ah: 2, ph: 17, nh: 1, corrected: 19, hasPlan: 0, noPlan: 0, pastNonComp: 5, surveys: 5, windowStart: '02/29/2024', windowEnd: '11/17/2025', riskScore: 50 },
  { ccn: '265185', name: 'Life Care Center of Cape Girardeau', city: 'Cape Girardeau', state: 'MO', totalCitations: 40, ij: 2, ah: 5, ph: 32, nh: 1, corrected: 38, hasPlan: 0, noPlan: 1, pastNonComp: 1, surveys: 9, windowStart: '01/05/2024', windowEnd: '12/16/2025', riskScore: 48 },
  { ccn: '505272', name: 'Life Care Center of Mount Vernon', city: 'Mount Vernon', state: 'WA', totalCitations: 63, ij: 1, ah: 6, ph: 56, nh: 0, corrected: 63, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 9, windowStart: '03/20/2024', windowEnd: '11/18/2025', riskScore: 40 },
  { ccn: '445479', name: 'Life Care Center of Gray', city: 'Gray', state: 'TN', totalCitations: 6, ij: 4, ah: 0, ph: 2, nh: 0, corrected: 6, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 2, windowStart: '04/12/2024', windowEnd: '06/20/2024', riskScore: 40 },
  { ccn: '285134', name: 'Life Care Center of Elkhorn', city: 'Elkhorn', state: 'NE', totalCitations: 19, ij: 0, ah: 2, ph: 17, nh: 0, corrected: 11, hasPlan: 0, noPlan: 8, pastNonComp: 0, surveys: 3, windowStart: '08/13/2024', windowEnd: '12/08/2025', riskScore: 34 },
  { ccn: '505080', name: 'Life Care Center of Kennewick', city: 'Kennewick', state: 'WA', totalCitations: 25, ij: 2, ah: 2, ph: 21, nh: 0, corrected: 23, hasPlan: 2, noPlan: 0, pastNonComp: 0, surveys: 13, windowStart: '02/12/2024', windowEnd: '12/17/2025', riskScore: 32 },
  { ccn: '325103', name: 'Life Care Center of Farmington', city: 'Farmington', state: 'NM', totalCitations: 31, ij: 2, ah: 2, ph: 27, nh: 0, corrected: 31, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 6, windowStart: '02/02/2024', windowEnd: '11/20/2025', riskScore: 30 },
  { ccn: '445302', name: 'Life Care Center of Elizabethton', city: 'Elizabethton', state: 'TN', totalCitations: 3, ij: 3, ah: 0, ph: 0, nh: 0, corrected: 0, hasPlan: 0, noPlan: 0, pastNonComp: 3, surveys: 1, windowStart: '02/29/2024', windowEnd: '02/29/2024', riskScore: 30 },
  { ccn: '505188', name: 'Life Care Center of Federal Way', city: 'Federal Way', state: 'WA', totalCitations: 65, ij: 0, ah: 5, ph: 60, nh: 0, corrected: 65, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 7, windowStart: '01/10/2024', windowEnd: '03/18/2025', riskScore: 25 },
  { ccn: '225546', name: 'Life Care Center of Merrimack Valley', city: 'Billerica', state: 'MA', totalCitations: 18, ij: 0, ah: 4, ph: 14, nh: 0, corrected: 18, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 2, windowStart: '12/04/2024', windowEnd: '08/14/2025', riskScore: 20 },
  { ccn: '105516', name: 'Darcy Hall of Life Care', city: 'West Palm Beach', state: 'FL', totalCitations: 14, ij: 2, ah: 0, ph: 12, nh: 0, corrected: 14, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 4, windowStart: '06/01/2024', windowEnd: '09/05/2025', riskScore: 20 },
  { ccn: '285137', name: 'Life Care Center of Omaha', city: 'Omaha', state: 'NE', totalCitations: 22, ij: 1, ah: 1, ph: 20, nh: 0, corrected: 20, hasPlan: 1, noPlan: 1, pastNonComp: 0, surveys: 4, windowStart: '05/15/2024', windowEnd: '11/19/2025', riskScore: 18 },
  { ccn: '65356', name: 'Life Care Center of Colorado Springs', city: 'Colorado Springs', state: 'CO', totalCitations: 16, ij: 1, ah: 0, ph: 15, nh: 0, corrected: 16, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 3, windowStart: '07/22/2024', windowEnd: '12/09/2025', riskScore: 18 },
  { ccn: '445231', name: 'Life Care Center of Cleveland', city: 'Cleveland', state: 'TN', totalCitations: 8, ij: 0, ah: 2, ph: 6, nh: 0, corrected: 8, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 2, windowStart: '03/01/2024', windowEnd: '09/15/2025', riskScore: 15 },
  { ccn: '505107', name: 'Life Care Center of Puyallup', city: 'Puyallup', state: 'WA', totalCitations: 42, ij: 0, ah: 3, ph: 39, nh: 0, corrected: 42, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 6, windowStart: '04/10/2024', windowEnd: '10/22/2025', riskScore: 15 },
  { ccn: '105343', name: 'Life Care Center of Sarasota', city: 'Sarasota', state: 'FL', totalCitations: 9, ij: 0, ah: 1, ph: 8, nh: 0, corrected: 9, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 3, windowStart: '01/15/2024', windowEnd: '06/30/2025', riskScore: 12 },
  { ccn: '225102', name: 'Life Care Center of Acton', city: 'Acton', state: 'MA', totalCitations: 11, ij: 0, ah: 1, ph: 10, nh: 0, corrected: 11, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 2, windowStart: '06/20/2024', windowEnd: '01/15/2026', riskScore: 10 },
  { ccn: '155012', name: 'Life Care Center of Boise', city: 'Boise', state: 'ID', totalCitations: 12, ij: 0, ah: 0, ph: 12, nh: 0, corrected: 12, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 3, windowStart: '09/01/2024', windowEnd: '02/28/2026', riskScore: 8 },
  { ccn: '35036', name: 'Life Care Center of Scottsdale', city: 'Scottsdale', state: 'AZ', totalCitations: 14, ij: 0, ah: 1, ph: 13, nh: 0, corrected: 14, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 4, windowStart: '03/15/2024', windowEnd: '08/20/2025', riskScore: 10 },
  { ccn: '155089', name: 'Life Care Center of Treasure Valley', city: 'Boise', state: 'ID', totalCitations: 8, ij: 0, ah: 0, ph: 8, nh: 0, corrected: 8, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 2, windowStart: '11/01/2024', windowEnd: '05/15/2026', riskScore: 5 },
  { ccn: '265044', name: 'Life Care Center of Kansas City', city: 'Kansas City', state: 'MO', totalCitations: 28, ij: 0, ah: 2, ph: 26, nh: 0, corrected: 28, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 5, windowStart: '02/01/2024', windowEnd: '07/30/2025', riskScore: 12 },
  { ccn: '265099', name: 'Life Care Center of St. Louis', city: 'St. Louis', state: 'MO', totalCitations: 35, ij: 1, ah: 1, ph: 33, nh: 0, corrected: 35, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 7, windowStart: '01/20/2024', windowEnd: '09/10/2025', riskScore: 16 },
  { ccn: '505199', name: 'Life Care Center of Kirkland', city: 'Kirkland', state: 'WA', totalCitations: 38, ij: 0, ah: 2, ph: 36, nh: 0, corrected: 38, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 5, windowStart: '05/05/2024', windowEnd: '11/01/2025', riskScore: 10 },
  { ccn: '105411', name: 'Life Care Center of Orlando', city: 'Orlando', state: 'FL', totalCitations: 5, ij: 0, ah: 0, ph: 5, nh: 0, corrected: 5, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 2, windowStart: '08/01/2024', windowEnd: '02/15/2026', riskScore: 3 },
  { ccn: '105299', name: 'Life Care Center of Ocala', city: 'Ocala', state: 'FL', totalCitations: 7, ij: 0, ah: 0, ph: 7, nh: 0, corrected: 7, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 3, windowStart: '04/20/2024', windowEnd: '10/05/2025', riskScore: 5 },
  { ccn: '445199', name: 'Life Care Center of Hixson', city: 'Hixson', state: 'TN', totalCitations: 4, ij: 0, ah: 0, ph: 4, nh: 0, corrected: 4, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 2, windowStart: '07/10/2024', windowEnd: '01/05/2026', riskScore: 3 },
  { ccn: '155034', name: 'Life Care Center of Idaho Falls', city: 'Idaho Falls', state: 'ID', totalCitations: 10, ij: 0, ah: 0, ph: 10, nh: 0, corrected: 10, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 3, windowStart: '10/15/2024', windowEnd: '04/10/2026', riskScore: 5 },
  { ccn: '35099', name: 'Life Care Center of Tucson', city: 'Tucson', state: 'AZ', totalCitations: 18, ij: 0, ah: 1, ph: 17, nh: 0, corrected: 18, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 4, windowStart: '06/01/2024', windowEnd: '12/01/2025', riskScore: 8 },
  { ccn: '155067', name: 'Life Care Center of Lewiston', city: 'Lewiston', state: 'ID', totalCitations: 15, ij: 0, ah: 1, ph: 14, nh: 0, corrected: 15, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 3, windowStart: '02/20/2024', windowEnd: '08/20/2025', riskScore: 8 },
  { ccn: '65123', name: 'Life Care Center of Pueblo', city: 'Pueblo', state: 'CO', totalCitations: 11, ij: 0, ah: 2, ph: 9, nh: 0, corrected: 11, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 3, windowStart: '03/10/2024', windowEnd: '09/25/2025', riskScore: 12 },
  { ccn: '65201', name: 'Life Care Center of Longmont', city: 'Longmont', state: 'CO', totalCitations: 8, ij: 0, ah: 1, ph: 7, nh: 0, corrected: 8, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 2, windowStart: '05/01/2024', windowEnd: '11/15/2025', riskScore: 8 },
  { ccn: '225301', name: 'Life Care Center of Leominster', city: 'Leominster', state: 'MA', totalCitations: 13, ij: 0, ah: 1, ph: 12, nh: 0, corrected: 13, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 2, windowStart: '09/15/2024', windowEnd: '03/15/2026', riskScore: 8 },
  { ccn: '225188', name: 'Life Care Center of Nashoba Valley', city: 'Littleton', state: 'MA', totalCitations: 16, ij: 0, ah: 1, ph: 15, nh: 0, corrected: 16, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 3, windowStart: '07/01/2024', windowEnd: '01/01/2026', riskScore: 8 },
  { ccn: '155045', name: 'Life Care Center of Post Falls', city: 'Post Falls', state: 'ID', totalCitations: 6, ij: 0, ah: 0, ph: 6, nh: 0, corrected: 6, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 2, windowStart: '12/01/2024', windowEnd: '06/01/2026', riskScore: 3 },
  { ccn: '445089', name: 'Life Care Center of Collegedale', city: 'Collegedale', state: 'TN', totalCitations: 0, ij: 0, ah: 0, ph: 0, nh: 0, corrected: 0, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 1, windowStart: '10/01/2024', windowEnd: '04/01/2026', riskScore: 0 },
  { ccn: '105201', name: 'Life Care Center of Altamonte Springs', city: 'Altamonte Springs', state: 'FL', totalCitations: 0, ij: 0, ah: 0, ph: 0, nh: 0, corrected: 0, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 1, windowStart: '11/15/2024', windowEnd: '05/15/2026', riskScore: 0 },
  { ccn: '105556', name: 'Life Care Center of Estero', city: 'Estero', state: 'FL', totalCitations: 0, ij: 0, ah: 0, ph: 0, nh: 0, corrected: 0, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 2, windowStart: '08/20/2024', windowEnd: '02/20/2026', riskScore: 0 },
  { ccn: '445567', name: 'Life Care Center of Athens', city: 'Athens', state: 'TN', totalCitations: 0, ij: 0, ah: 0, ph: 0, nh: 0, corrected: 0, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 1, windowStart: '09/10/2024', windowEnd: '03/10/2026', riskScore: 0 },
  { ccn: '155078', name: 'Life Care Center of Sandpoint', city: 'Sandpoint', state: 'ID', totalCitations: 0, ij: 0, ah: 0, ph: 0, nh: 0, corrected: 0, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 1, windowStart: '01/05/2025', windowEnd: '07/05/2026', riskScore: 0 },
  { ccn: '105188', name: 'Life Care Center of Inverrary', city: 'Lauderhill', state: 'FL', totalCitations: 3, ij: 0, ah: 0, ph: 3, nh: 0, corrected: 3, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 2, windowStart: '06/15/2024', windowEnd: '12/15/2025', riskScore: 2 },
  { ccn: '445401', name: 'Life Care Center of Morristown', city: 'Morristown', state: 'TN', totalCitations: 5, ij: 0, ah: 0, ph: 5, nh: 0, corrected: 5, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 2, windowStart: '04/01/2024', windowEnd: '10/01/2025', riskScore: 3 },
  { ccn: '175201', name: 'Life Care Center of Wichita', city: 'Wichita', state: 'KS', totalCitations: 20, ij: 0, ah: 0, ph: 20, nh: 0, corrected: 20, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 4, windowStart: '03/20/2024', windowEnd: '09/20/2025', riskScore: 5 },
  { ccn: '35156', name: 'Life Care Center of Paradise Valley', city: 'Phoenix', state: 'AZ', totalCitations: 11, ij: 0, ah: 0, ph: 11, nh: 0, corrected: 11, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 3, windowStart: '07/01/2024', windowEnd: '01/01/2026', riskScore: 5 },
  { ccn: '505155', name: 'Life Care Center of Renton', city: 'Renton', state: 'WA', totalCitations: 30, ij: 0, ah: 1, ph: 29, nh: 0, corrected: 30, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 4, windowStart: '02/15/2024', windowEnd: '08/15/2025', riskScore: 8 },
  { ccn: '445155', name: 'Life Care Center of Greeneville', city: 'Greeneville', state: 'TN', totalCitations: 7, ij: 0, ah: 1, ph: 6, nh: 0, corrected: 7, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 2, windowStart: '05/20/2024', windowEnd: '11/20/2025', riskScore: 8 },
  { ccn: '65278', name: 'Life Care Center of Greeley', city: 'Greeley', state: 'CO', totalCitations: 9, ij: 0, ah: 2, ph: 7, nh: 0, corrected: 9, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 2, windowStart: '08/10/2024', windowEnd: '02/10/2026', riskScore: 12 },
  { ccn: '265178', name: 'Life Care Center of Brookfield', city: 'Brookfield', state: 'MO', totalCitations: 22, ij: 0, ah: 1, ph: 21, nh: 0, corrected: 22, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 4, windowStart: '01/15/2024', windowEnd: '07/15/2025', riskScore: 8 },
  { ccn: '505211', name: 'Life Care Center of Lacey', city: 'Lacey', state: 'WA', totalCitations: 29, ij: 0, ah: 1, ph: 28, nh: 0, corrected: 29, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 4, windowStart: '06/10/2024', windowEnd: '12/10/2025', riskScore: 8 },
  { ccn: '225401', name: 'Life Care Center of Plymouth', city: 'Plymouth', state: 'MA', totalCitations: 10, ij: 0, ah: 0, ph: 10, nh: 0, corrected: 10, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 2, windowStart: '04/15/2024', windowEnd: '10/15/2025', riskScore: 5 },
  { ccn: '445333', name: 'Life Care Center of Crossville', city: 'Crossville', state: 'TN', totalCitations: 9, ij: 0, ah: 0, ph: 9, nh: 0, corrected: 9, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 2, windowStart: '11/01/2024', windowEnd: '05/01/2026', riskScore: 5 },
  { ccn: '505233', name: 'Life Care Center of Richland', city: 'Richland', state: 'WA', totalCitations: 20, ij: 0, ah: 0, ph: 20, nh: 0, corrected: 20, hasPlan: 0, noPlan: 0, pastNonComp: 0, surveys: 3, windowStart: '09/01/2024', windowEnd: '03/01/2026', riskScore: 5 },
];

function parseDate(d: string): Date {
  const [m, dd, y] = d.split('/').map(Number);
  return new Date(y, m - 1, dd);
}

function formatISO(d: string): string {
  const date = parseDate(d);
  return date.toISOString().split('T')[0];
}

const now = new Date('2026-04-02');

const allFacilities: Facility[] = rawFacilities.map((r, i) => {
  const endDate = parseDate(r.windowEnd);
  const daysUntilEnd = Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const nearing90 = daysUntilEnd >= 0 && daysUntilEnd <= 90;
  const defFree = r.totalCitations === 0;
  const kTags = r.ij > 0 ? Math.max(1, Math.floor(r.ij * 1.5)) : 0;
  const eTags = r.ah > 0 ? Math.max(1, Math.floor(r.ah * 0.8)) : 0;
  const stateTags = Math.max(0, r.totalCitations - kTags - eTags);
  const hasPoc = r.totalCitations > 10;
  const pocDue = hasPoc ? new Date(endDate.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null;

  return {
    id: `fac-${i + 1}`,
    ccn: r.ccn,
    name: r.name,
    city: r.city,
    state: r.state,
    region: regionForState(r.state),
    totalCitations: r.totalCitations,
    ijCitations: r.ij,
    actualHarm: r.ah,
    potentialHarm: r.ph,
    noHarm: r.nh,
    corrected: r.corrected,
    hasPlan: r.hasPlan,
    noPlan: r.noPlan,
    pastNonComp: r.pastNonComp,
    surveys: r.surveys,
    surveyWindowStart: formatISO(r.windowStart),
    surveyWindowEnd: formatISO(r.windowEnd),
    riskScore: r.riskScore,
    lastSurveyDate: formatISO(r.windowEnd),
    surveyType: surveyTypes[i % surveyTypes.length],
    nearing90Days: nearing90,
    deficiencyFree: defFree,
    kTags,
    eTags,
    stateTags,
    documentationGaps: {
      tasks: defFree ? 0 : Math.floor(Math.random() * 6),
      logs: defFree ? 0 : Math.floor(Math.random() * 4),
      docs: defFree ? 0 : Math.floor(Math.random() * 3),
    },
    pocCount: hasPoc ? Math.floor(r.totalCitations / 8) + 1 : 0,
    pocDueDate: pocDue,
    pocStatus: hasPoc
      ? r.corrected > r.totalCitations * 0.8
        ? 'on-track'
        : r.noPlan > 0
          ? 'overdue'
          : 'completed'
      : defFree
        ? null
        : 'not-started',
    benchmarkVsPeers: +(r.totalCitations / Math.max(r.surveys, 1) - 9.5).toFixed(1),
  };
});

// Shift 2 facilities per oversized region to have upcoming survey windows
const oversizedRegions = new Set<string>();
const regionCountsCheck: Record<string, number> = {};
for (const f of allFacilities) {
  regionCountsCheck[f.region] = (regionCountsCheck[f.region] || 0) + 1;
}
for (const [r, c] of Object.entries(regionCountsCheck)) {
  if (c > 5) oversizedRegions.add(r);
}
// For oversized regions, shift some window dates into the future
let shifted = 0;
const shiftedRegions: Record<string, number> = {};
for (const f of allFacilities) {
  if (oversizedRegions.has(f.region)) {
    const alreadyShifted = shiftedRegions[f.region] || 0;
    if (alreadyShifted < 2 && new Date(f.surveyWindowEnd) < now) {
      // Shift window to upcoming (30-90 days from now)
      const offset = 30 + alreadyShifted * 30;
      const newEnd = new Date(now.getTime() + offset * 24 * 60 * 60 * 1000);
      const newStart = new Date(newEnd.getTime() - 270 * 24 * 60 * 60 * 1000);
      f.surveyWindowEnd = newEnd.toISOString().split('T')[0];
      f.surveyWindowStart = newStart.toISOString().split('T')[0];
      f.nearing90Days = offset <= 90;
      f.lastSurveyDate = f.surveyWindowEnd;
      shiftedRegions[f.region] = alreadyShifted + 1;
    }
  }
}

// Now cap each region at 5, prioritizing facilities with upcoming windows
const sortedFacilities = [...allFacilities].sort((a, b) => {
  // Same region: put upcoming surveys first
  if (a.region === b.region) {
    const aEnd = new Date(a.surveyWindowEnd).getTime();
    const bEnd = new Date(b.surveyWindowEnd).getTime();
    const aUpcoming = aEnd >= now.getTime() ? 0 : 1;
    const bUpcoming = bEnd >= now.getTime() ? 0 : 1;
    if (aUpcoming !== bUpcoming) return aUpcoming - bUpcoming;
    return bEnd - aEnd; // More recent first
  }
  return 0;
});

const regionCounts: Record<string, number> = {};
export const facilities: Facility[] = sortedFacilities.filter((f) => {
  const count = regionCounts[f.region] || 0;
  if (count >= 5) return false;
  regionCounts[f.region] = count + 1;
  return true;
});
