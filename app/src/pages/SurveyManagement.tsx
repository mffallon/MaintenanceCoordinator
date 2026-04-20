import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Chip, TextField, InputAdornment, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
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

const TODAY = new Date('2026-04-05');

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
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
  return facilities
    .filter((f) => f.lastSurveyDate)
    .map((f) => {
      const lastSurveyDate = effectiveLastSurveyDate(f.id, f.lastSurveyDate);
      const last = new Date(lastSurveyDate);
      const windowStart = toISO(addMonths(last, 9));
      const windowEnd = toISO(addMonths(last, 15));
      const days = daysUntil(windowEnd);
      const status =
        days < 0 ? 'Overdue' :
        days <= 30 ? 'Due Soon' :
        days <= 90 ? 'Upcoming' : 'On Track';
      const lastSurvey = surveys.filter((s) => s.facilityId === f.id).sort((a, b) => b.date.localeCompare(a.date))[0];
      return {
        id: f.id,
        facilityId: f.id,
        name: f.name,
        region: f.region,
        lastSurveyDate,
        windowStart,
        windowEnd,
        daysUntilDue: days,
        status,
        totalCitations: f.totalCitations,
        alerts: deriveAlerts(f.totalCitations, f.id),
        lastSurveyor: lastSurvey?.surveyor || '—',
      };
    })
    .sort((a, b) => a.daysUntilDue - b.daysUntilDue);
}

const allUpcomingRows = buildUpcomingRows();

export default function SurveyManagement() {
  const navigate = useNavigate();
  const { passesFilter } = useCommunityFilter();
  const [search, setSearch] = useState('');
  const rows = useMemo(() => {
    return allUpcomingRows.filter((r) => {
      if (!passesFilter(r.facilityId)) return false;
      if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [passesFilter, search]);

  const overdueCount = rows.filter((r) => r.status === 'Overdue').length;
  const dueSoonCount = rows.filter((r) => r.status === 'Due Soon').length;
  const upcomingCount = rows.filter((r) => r.status === 'Upcoming').length;
  const dueSoonAlerts = rows.filter((r) => r.status === 'Due Soon').reduce((s, r) => s + r.alerts, 0);
  const upcomingAlerts = rows.filter((r) => r.status === 'Upcoming').reduce((s, r) => s + r.alerts, 0);

  // Card style definitions per Figma
  const cards = [
    {
      title: 'Overdue Surveys', count: overdueCount, subtitle: 'Window has passed',
      outerBg: '#fddce2', borderColor: '#fcc6d1', titleColor: '#4f0513', numberColor: '#ad0b2a',
      alerts: 0,
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
      <PageFilters />

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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5 }}>
          <Typography sx={{ fontSize: '16px', color: '#293036', fontWeight: 700, letterSpacing: '-0.176px' }}>
            {rows.length} communities
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
                <TableCell colSpan={3} sx={{ fontWeight: 600, fontSize: '14px', color: '#293036', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '3px', px: 2, borderBottom: '1px solid rgba(41,48,54,0.15)', textAlign: 'center' }}>
                  Survey Window
                </TableCell>
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
                <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#293036', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2, width: 130, textAlign: 'center' }}>Open date</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#293036', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2, width: 130, textAlign: 'center' }}>Close date</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#293036', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2 }}>Community</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#293036', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2, width: 150 }}>Surveyor</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#293036', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2, width: 130 }} align="right">Prev. Citations</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#293036', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2, width: 80 }} align="right">Alerts</TableCell>
                <TableCell sx={{ bgcolor: '#e0e4e7', width: 48, px: 0 }} />
              </TableRow>
            </TableHead>
            <TableBody sx={{ bgcolor: 'white' }}>
              {rows.map((r, idx) => {
                const isOverdue = r.status === 'Overdue';
                const isDueSoon = r.status === 'Due Soon';
                const isUpcoming = r.status === 'Upcoming';
                const borderColor = isOverdue ? '#D32F2F' : isDueSoon ? '#ED6C02' : isUpcoming ? '#FDE68A' : 'transparent';
                const isLast = idx === rows.length - 1;
                return (
                  <TableRow key={r.id} hover sx={{
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#F0F7FF' },
                    bgcolor: isOverdue ? '#FFF5F5' : isDueSoon ? '#FFFBEB' : 'inherit',
                    ...(isLast && { '& td': { borderBottom: 'none' } }),
                  }}
                    onClick={() => navigate(`/surveys/${r.facilityId}`)}>
                    <TableCell align="center" sx={borderColor !== 'transparent' ? { boxShadow: `inset 4px 0 0 0 ${borderColor}` } : {}}>
                      <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#293036' }}>{r.daysUntilDue}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#293036' }}>{fmtDate(r.windowStart)}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#293036' }}>{fmtDate(r.windowEnd)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#293036' }}>
                        {r.name.replace('Avir at ', '')}
                      </Typography>
                      <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#293036' }}>{r.region}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#293036' }}>{r.lastSurveyor}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#293036' }}>{r.totalCitations}</Typography>
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
