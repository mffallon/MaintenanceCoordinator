import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Chip, TextField, InputAdornment, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PageHeader from '../components/PageHeader';
import PageFilters from '../components/PageFilters';
import { useCommunityFilter } from '../components/CommunityFilter';
import { facilities, citations, surveys } from '../data/avir-data';
import { effectiveLastSurveyDate } from '../utils/surveyWindowOverrides';
import { fmtDate } from '../utils/formatDate';
import SurveyWindowIndicator from '../components/SurveyWindowIndicator';

const TODAY = new Date('2026-04-02');

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function splitOffsetDays(facilityId: string): number {
  let h = 0;
  for (const c of facilityId) h = (h * 31 + c.charCodeAt(0)) & 0x7fffffff;
  return 10 + (h % 18); // 10–27 days apart
}

const SURVEY_TYPES = ['Life Safety', 'Emergency Preparedness'] as const;
type SurveyType = typeof SURVEY_TYPES[number];

function fmtSurveyor(name: string): string {
  if (!name || name === '—') return name;
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return name;
  return `${parts[0][0]}. ${parts.slice(1).join(' ')}`;
}

function toISO(d: Date): string {
  return d.toISOString().split('T')[0];
}

function daysUntil(dateStr: string): number {
  return Math.round((new Date(dateStr).getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24));
}

function deriveAlerts(totalCitations: number, facilityId: string): number {
  const facCitations = citations.filter((c) => c.facilityId === facilityId);
  const openCits = facCitations.filter((c) => c.status === 'Open' || c.status === 'Pending');
  const tasks = openCits.length;
  const seed = facilityId.length % 5;
  const logs = totalCitations > 10 ? seed + 2 : totalCitations > 0 ? seed : 0;
  const docs = totalCitations > 15 ? 3 : totalCitations > 5 ? 1 : 0;
  return tasks + logs + docs;
}

function buildUpcomingRows() {
  // Track the most recent real survey date per facility (for override targeting)
  const latestRealByFacility: Record<string, string> = {};
  for (const s of surveys) {
    if (!latestRealByFacility[s.facilityId] || s.date > latestRealByFacility[s.facilityId]) {
      latestRealByFacility[s.facilityId] = s.date;
    }
  }

  const makeRow = (
    s: typeof surveys[number],
    facility: NonNullable<ReturnType<typeof facilities.find>>,
    surveyDate: string,
    realSurveyDate: string,
    kTags: number | null,
    eTags: number | null,
    idSuffix: string,
  ) => {
    const last = new Date(surveyDate);
    const windowStart = toISO(addMonths(last, 9));
    const windowEnd = toISO(addMonths(last, 15));
    const daysToStart = daysUntil(windowStart);
    const daysToEnd = daysUntil(windowEnd);
    const status =
      daysToEnd < 0 ? 'Overdue' :
      daysToStart < 0 ? 'In Window' :
      daysToStart <= 30 ? 'Due Soon' :
      daysToStart <= 90 ? 'Upcoming' : 'On Track';
    const tagCount = (kTags ?? 0) + (eTags ?? 0);
    return {
      id: `${s.facilityId}-${s.date}-${idSuffix}`,
      facilityId: s.facilityId,
      name: facility.name,
      region: facility.region,
      surveyDate,
      realSurveyDate,
      windowStart,
      windowEnd,
      daysUntilDue: daysToStart,
      status,
      kTags,
      eTags,
      alerts: deriveAlerts(tagCount, s.facilityId),
      surveyor: s.surveyor || '—',
      surveyType: (kTags !== null ? 'Life Safety' : 'Emergency Preparedness') as SurveyType,
    };
  };

  return surveys
    .flatMap((s) => {
      const facility = facilities.find((f) => f.id === s.facilityId);
      if (!facility) return [];
      const isLatest = latestRealByFacility[s.facilityId] === s.date;
      const baseSurveyDate = isLatest ? effectiveLastSurveyDate(s.facilityId, s.date) : s.date;
      const hasBoth = s.kTags > 0 && s.eTags > 0;
      if (hasBoth) {
        const offset = splitOffsetDays(s.facilityId);
        const dateK = toISO(addDays(new Date(s.date), -offset));
        const dateE = toISO(addDays(new Date(s.date), offset));
        const sdK = isLatest ? effectiveLastSurveyDate(s.facilityId, dateK) : dateK;
        const sdE = isLatest ? effectiveLastSurveyDate(s.facilityId, dateE) : dateE;
        return [
          makeRow(s, facility, sdK, dateK, s.kTags, null, 'k'),
          makeRow(s, facility, sdE, dateE, null, s.eTags, 'e'),
        ];
      }
      return [makeRow(s, facility, baseSurveyDate, s.date,
        s.kTags > 0 ? s.kTags : null,
        s.eTags > 0 ? s.eTags : null,
        'only')];
    })
    .sort((a, b) => a.daysUntilDue - b.daysUntilDue);
}

const allUpcomingRows = buildUpcomingRows();

export default function SurveyManagement() {
  const navigate = useNavigate();
  const { passesFilter } = useCommunityFilter();
  const [search, setSearch] = useState('');
  const [surveyTypeFilter, setSurveyTypeFilter] = useState<SurveyType | ''>('');
  const rows = useMemo(() => {
    return allUpcomingRows.filter((r) => {
      if (!passesFilter(r.facilityId)) return false;
      if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (surveyTypeFilter && r.surveyType !== surveyTypeFilter) return false;
      return true;
    });
  }, [passesFilter, search, surveyTypeFilter]);

  const todayISO = toISO(TODAY);
  // "In Survey window" uses each facility's real last-survey date (ignoring demo overrides
  // used to fake upcoming surveys), so it reflects communities whose actual most-recent
  // survey puts them inside the active 9–15 month window.
  const inWindowFacilities = facilities.filter((f) => {
    if (!f.lastSurveyDate || !passesFilter(f.id)) return false;
    const last = new Date(effectiveLastSurveyDate(f.id, f.lastSurveyDate));
    const ws = toISO(addMonths(last, 9));
    const we = toISO(addMonths(last, 15));
    return ws <= todayISO && todayISO <= we;
  });
  const inWindowCount = inWindowFacilities.length;
  const inWindowAlerts = inWindowFacilities.reduce((s, f) => s + deriveAlerts(f.totalCitations, f.id), 0);
  const dueSoonCount = rows.filter((r) => r.status === 'Due Soon').length;
  const upcomingCount = rows.filter((r) => r.status === 'Upcoming').length;
  const dueSoonAlerts = rows.filter((r) => r.status === 'Due Soon').reduce((s, r) => s + r.alerts, 0);
  const upcomingAlerts = rows.filter((r) => r.status === 'Upcoming').reduce((s, r) => s + r.alerts, 0);

  // Card style definitions per Figma
  const cards = [
    {
      title: 'In Survey window', count: inWindowCount, subtitle: 'Currently in the 9–15 month post-survey window',
      outerBg: '#fddce2', borderColor: '#fcc6d1', titleColor: '#4f0513', numberColor: '#ad0b2a',
      alerts: inWindowAlerts,
    },
    {
      title: 'Due soon', count: dueSoonCount, subtitle: 'Open within 30 days',
      outerBg: '#fde5d9', borderColor: '#fcd7c5', titleColor: '#702906', numberColor: '#cf4b0b',
      alerts: dueSoonAlerts,
    },
    {
      title: 'Upcoming', count: upcomingCount, subtitle: 'Open within 90 days',
      outerBg: '#fff2d1', borderColor: '#fee08d', titleColor: '#613b01', numberColor: '#835701',
      alerts: upcomingAlerts,
    },
  ];

  return (
    <Box>
      <PageHeader title="Pre-Survey Planning" />
      <PageFilters extraFilters={
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Survey Type</InputLabel>
          <Select value={surveyTypeFilter} label="Survey Type" displayEmpty renderValue={(v) => v || 'All'} onChange={(e) => setSurveyTypeFilter(e.target.value as SurveyType | '')}>
            <MenuItem value="">All</MenuItem>
            {SURVEY_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </Select>
        </FormControl>
      } />

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 2, my: 3 }}>
        {cards.map((card) => (
          <Box key={card.title} sx={{ flex: 1, borderRadius: '8px', bgcolor: card.outerBg, border: `1px solid ${card.borderColor}` }}>
            <Box sx={{ px: 2, py: 1, height: 44, display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ fontWeight: 600, fontSize: '16px', color: card.titleColor, letterSpacing: '-0.176px' }}>
                {card.title}
              </Typography>
            </Box>
            <Box sx={{ bgcolor: 'white', borderRadius: '8px', borderTop: `1px solid ${card.borderColor}`, p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '36px', color: card.numberColor, lineHeight: '44px', letterSpacing: '-0.684px' }}>
                  {card.count}
                </Typography>
                {card.alerts > 0 && (
                  <Chip label={`${card.alerts} alert${card.alerts !== 1 ? 's' : ''}`} color="error" size="small" />
                )}
              </Box>
              <Typography sx={{ fontWeight: 400, fontSize: '14px', color: '#293036', lineHeight: '16px', letterSpacing: '-0.084px', mt: '4px' }}>
                {card.subtitle}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Table Section */}
      <Paper elevation={0} sx={{ mb: 2, borderRadius: '8px', border: '1px solid #e0e4e7', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5 }}>
          <Typography sx={{ fontSize: '16px', color: '#293036', fontWeight: 700, letterSpacing: '-0.176px', mr: 'auto' }}>
            {rows.length} surveys
          </Typography>
          <TextField
            size="small" placeholder="Search communities"
            value={search} onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 220 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
          />
        </Box>
        <TableContainer sx={{ bgcolor: '#e0e4e7' }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#e0e4e7' }}>
              {/* Group header row */}
              <TableRow>
                <TableCell colSpan={2} sx={{ fontWeight: 600, fontSize: '14px', color: '#293036', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '3px', px: 2, borderBottom: '1px solid rgba(41,48,54,0.15)', textAlign: 'center' }}>
                  Survey Window
                </TableCell>
                <TableCell sx={{ bgcolor: '#e0e4e7', borderBottom: 'none', py: '3px' }} />
                <TableCell sx={{ bgcolor: '#e0e4e7', borderBottom: 'none', py: '3px' }} />
                <TableCell sx={{ bgcolor: '#e0e4e7', borderBottom: 'none', py: '3px' }} />
                <TableCell sx={{ bgcolor: '#e0e4e7', borderBottom: 'none', py: '3px' }} />
                <TableCell sx={{ bgcolor: '#e0e4e7', borderBottom: 'none', py: '3px' }} />
                <TableCell sx={{ bgcolor: '#e0e4e7', borderBottom: 'none', py: '3px' }} />
              </TableRow>
              {/* Sub-header row */}
              <TableRow>
                <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#293036', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2, whiteSpace: 'nowrap', width: 150 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                    Days until open
                    <ArrowDownwardIcon sx={{ fontSize: 16, color: '#293036' }} />
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#293036', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2, width: 240, whiteSpace: 'nowrap' }}>Timeline (Months since survey)</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#293036', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2 }}>Community</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#293036', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2, width: 150 }}>Surveyor</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#293036', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2, width: 90, whiteSpace: 'nowrap' }} align="right">K-Tags</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#293036', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2, width: 90, whiteSpace: 'nowrap' }} align="right">E-Tags</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#293036', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2, width: 80 }} align="right">Alerts</TableCell>
                <TableCell sx={{ bgcolor: '#e0e4e7', width: 48, px: 0 }} />
              </TableRow>
            </TableHead>
            <TableBody sx={{ bgcolor: 'white' }}>
              {rows.map((r, idx) => {
                const isOverdue = r.status === 'Overdue';
                const isInWindow = r.status === 'In Window';
                const isDueSoon = r.status === 'Due Soon';
                const isUpcoming = r.status === 'Upcoming';
                const borderColor = isOverdue ? '#D32F2F' : isInWindow ? '#DC2626' :isDueSoon ? '#ED6C02' : isUpcoming ? '#FDE68A' : 'transparent';
                const isLast = idx === rows.length - 1;
                return (
                  <TableRow key={r.id} hover sx={{
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#F0F7FF' },
                    bgcolor: 'inherit',
                    ...(isLast && { '& td': { borderBottom: 'none' } }),
                  }}
                    onClick={() => navigate(`/surveys/${r.facilityId}`)}>
                    <TableCell align="center" sx={borderColor !== 'transparent' ? { boxShadow: `inset 4px 0 0 0 ${borderColor}` } : {}}>
                      {r.daysUntilDue < 0 ? (
                        <>
                          <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#166534' }}>Now</Typography>
                          <Typography sx={{ fontSize: '12px', fontWeight: 400, color: '#64748B' }}>Opened {fmtDate(r.windowStart)}</Typography>
                        </>
                      ) : (
                        <>
                          <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#293036' }}>{r.daysUntilDue}</Typography>
                          <Typography sx={{ fontSize: '12px', fontWeight: 400, color: '#64748B' }}>{fmtDate(r.windowStart)}</Typography>
                        </>
                      )}
                    </TableCell>
                    <TableCell sx={{ px: 2, py: 1 }}>
                      <SurveyWindowIndicator
                        monthsSinceLastSurvey={(TODAY.getTime() - new Date(r.surveyDate).getTime()) / (1000 * 60 * 60 * 24 * 30.4375)}
                        maxWidth={99999}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#293036' }}>
                        {r.name.replace('Avir at ', '')}
                      </Typography>
                      <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#293036' }}>{r.region}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#293036' }}>{fmtSurveyor(r.surveyor)}</Typography>
                        <Chip label={r.surveyType} size="small" sx={{ fontSize: '11px', height: 18, fontWeight: 500,
                          bgcolor: r.surveyType === 'Life Safety' ? '#FEE0C8' : '#C8E9F7',
                          color: r.surveyType === 'Life Safety' ? '#7C2D06' : '#0A5276',
                        }} />
                      </Box>
                      <Typography sx={{ fontSize: '12px', fontWeight: 400, color: '#64748B' }}>{fmtDate(r.realSurveyDate)}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontSize: '14px', fontWeight: r.kTags ? 700 : 400, color: r.kTags ? '#991B1B' : '#94A3B8' }}>
                        {r.kTags ?? '—'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontSize: '14px', fontWeight: r.eTags ? 700 : 400, color: r.eTags ? '#0369A1' : '#94A3B8' }}>
                        {r.eTags ?? '—'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={r.alerts > 0 ? { bgcolor: '#FEE2E2' } : {}}>
                      <Typography sx={{ fontSize: '14px', fontWeight: r.alerts > 0 ? 700 : 400, color: r.alerts > 0 ? '#991B1B' : '#293036' }}>
                        {r.alerts}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ px: 1 }}>
                      <IconButton size="small">
                        <ArrowForwardIcon sx={{ fontSize: 18, color: '#293036' }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
