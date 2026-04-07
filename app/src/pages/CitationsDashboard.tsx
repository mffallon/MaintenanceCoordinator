import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Grid, Typography, TextField, Button, Chip, FormControl, InputLabel,
  Select, MenuItem, Switch, FormControlLabel, IconButton, Tooltip, Paper,
  Menu, ListItemIcon, ListItemText, Divider, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  LinearProgress,
} from '@mui/material';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { BarChart } from '@mui/x-charts';
import { LineChart as MuiLineChart } from '@mui/x-charts';
import BusinessIcon from '@mui/icons-material/Business';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import ShieldIcon from '@mui/icons-material/Shield';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CategoryIcon from '@mui/icons-material/Category';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AddTaskIcon from '@mui/icons-material/AddTask';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SummaryCard from '../components/SummaryCard';
import PageHeader from '../components/PageHeader';
import PageFilters from '../components/PageFilters';
import { useCommunityFilter } from '../components/CommunityFilter';
import { facilities, citations, surveys, regions as avirRegions } from '../data/avir-data';
import { effectiveLastSurveyDate } from '../utils/surveyWindowOverrides';
import EventNoteIcon from '@mui/icons-material/EventNote';
import type { AvirFacility, AvirSurvey } from '../data/avir-data';
import { fmtDate } from '../utils/formatDate';
import { makeDateFilter } from '../utils/dateFilter';

// Build survey trend data grouped by month (accepts filtered surveys)
function buildSurveyTrends(filteredSurveys: AvirSurvey[]) {
  const monthMap = new Map<string, { month: string; kTags: number; nTags: number; eTags: number; total: number; surveys: number }>();
  for (const s of filteredSurveys) {
    if (!s.date) continue;
    const d = new Date(s.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    if (!monthMap.has(key)) {
      monthMap.set(key, { month: label, kTags: 0, nTags: 0, eTags: 0, total: 0, surveys: 0 });
    }
    const m = monthMap.get(key)!;
    m.kTags += s.kTags;
    m.nTags += s.nTags;
    m.eTags += s.eTags;
    m.total += s.total;
    m.surveys += 1;
  }
  return [...monthMap.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v);
}

// Build tag type breakdown by region for bar chart (accepts filtered facilities)
function buildRegionBreakdown(filteredFacilities: AvirFacility[]) {
  const regionMap = new Map<string, { region: string; kTags: number; nTags: number; eTags: number }>();
  for (const fac of filteredFacilities) {
    if (!regionMap.has(fac.region)) {
      regionMap.set(fac.region, { region: fac.region, kTags: 0, nTags: 0, eTags: 0 });
    }
    const r = regionMap.get(fac.region)!;
    r.kTags += fac.totalKTags;
    r.nTags += fac.totalNTags;
    r.eTags += fac.totalETags;
  }
  return [...regionMap.values()].sort((a, b) => (b.kTags + b.nTags + b.eTags) - (a.kTags + a.nTags + a.eTags));
}

// Upcoming survey window data (mirrors SurveyManagement overrides)
const TODAY_DASH = new Date('2026-04-05');
function deriveUpcomingAlerts(facilityId: string): number {
  const facCitations = citations.filter((c) => c.facilityId === facilityId);
  const openCits = facCitations.filter((c) => c.status === 'Open' || c.status === 'Pending');
  const tasks = openCits.length;
  const seed = facilityId.length % 5;
  const total = facCitations.length;
  const logs = total > 10 ? seed + 2 : total > 0 ? seed : 0;
  const docs = total > 15 ? 3 : total > 5 ? 1 : 0;
  return tasks + logs + docs;
}

const upcomingSurveyRows = facilities
  .filter((f) => f.lastSurveyDate)
  .map((f) => {
    const last = new Date(effectiveLastSurveyDate(f.id, f.lastSurveyDate));
    const windowStart = new Date(last);
    windowStart.setMonth(windowStart.getMonth() + 9);
    const windowEnd = new Date(last);
    windowEnd.setMonth(windowEnd.getMonth() + 15);
    const windowStartISO = windowStart.toISOString().split('T')[0];
    const windowEndISO = windowEnd.toISOString().split('T')[0];
    const days = Math.round((windowEnd.getTime() - TODAY_DASH.getTime()) / (1000 * 60 * 60 * 24));
    const status = days < 0 ? 'Overdue' : days <= 30 ? 'Due Soon' : days <= 90 ? 'Upcoming' : 'On Track';
    const alerts = deriveUpcomingAlerts(f.id);
    const prevCitations = citations.filter((c) => c.facilityId === f.id).length;
    const lastSurvey = surveys.filter((s) => s.facilityId === f.id).sort((a, b) => b.date.localeCompare(a.date))[0];
    const lastSurveyor = lastSurvey?.surveyor || '—';
    return { id: f.id, name: f.name, region: f.region, windowStart: windowStartISO, windowEnd: windowEndISO, daysUntilDue: days, status, alerts, prevCitations, lastSurveyor };
  })
  .filter((r) => r.daysUntilDue >= 0 && r.daysUntilDue <= 90)
  .sort((a, b) => a.daysUntilDue - b.daysUntilDue);

function UpcomingSurveysPanel() {
  const navigate = useNavigate();
  const { passesFilter } = useCommunityFilter();
  const rows = upcomingSurveyRows.filter((r) => passesFilter(r.id));
  if (rows.length === 0) return null;

  const statusColors: Record<string, { color: string; bg: string; border: string }> = {
    'Overdue':  { color: '#991B1B', bg: '#FEE2E2', border: '#FECACA' },
    'Due Soon': { color: '#92400E', bg: '#FEF3C7', border: '#FDE68A' },
    'Upcoming': { color: '#1E40AF', bg: '#DBEAFE', border: '#BFDBFE' },
  };

  return (
    <Paper sx={{ p: 2.5, mb: 3, borderRadius: '8px', border: '1px solid #E2E8F0' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <EventNoteIcon sx={{ color: '#0065BD' }} />
          <Typography variant="h6">Upcoming Surveys — Next 90 Days</Typography>
          <Chip label={`${rows.length} communities`} size="small" color="primary" />
        </Box>
        <Button variant="text" size="small" onClick={() => navigate('/surveys')}>View all →</Button>
      </Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 400, color: '#293036', fontSize: '14px', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2, width: 160 }}>Window Opens</TableCell>
              <TableCell sx={{ fontWeight: 400, color: '#293036', fontSize: '14px', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2 }}>Community</TableCell>
              <TableCell sx={{ fontWeight: 400, color: '#293036', fontSize: '14px', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2, width: 140 }}>Surveyor</TableCell>
              <TableCell sx={{ fontWeight: 400, color: '#293036', fontSize: '14px', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2, width: 110 }} align="right">Prev. Citations</TableCell>
              <TableCell sx={{ fontWeight: 400, color: '#293036', fontSize: '14px', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2, width: 90 }} align="right">Alerts</TableCell>
              <TableCell sx={{ bgcolor: '#e0e4e7', width: 32, px: 0 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => {
              const sc = statusColors[r.status] || statusColors['Upcoming'];
              return (
                <TableRow key={r.id} hover sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#F0F7FF' } }}
                  onClick={() => navigate(`/surveys/${r.id}`)}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{fmtDate(r.windowStart)}</Typography>
                    {r.daysUntilDue <= 30
                      ? <Chip label={`${r.daysUntilDue} days away`} size="small" sx={{ mt: 0.25, fontWeight: 700, fontSize: '0.68rem', bgcolor: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, height: 18 }} />
                      : <Typography variant="caption" sx={{ color: '#64748B' }}>{r.daysUntilDue} days away</Typography>
                    }
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                      {r.name.replace('Avir at ', '')}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>{r.region}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">{r.lastSurveyor}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{r.prevCitations}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    {r.alerts > 0
                      ? <Chip label={r.alerts} size="small" sx={{ fontWeight: 700, fontSize: '0.7rem', bgcolor: '#FEE2E2', color: '#991B1B', minWidth: 32 }} />
                      : <Typography variant="caption" sx={{ color: '#94A3B8' }}>—</Typography>
                    }
                  </TableCell>
                  <TableCell sx={{ px: 0 }}>
                    <ChevronRightIcon sx={{ fontSize: 18, color: '#94A3B8' }} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

const DASH_TODAY = '2026-04-05';
const THIRTY_DAY_CUTOFF = (() => {
  const d = new Date(DASH_TODAY);
  d.setDate(d.getDate() - 30);
  return d.toISOString().split('T')[0];
})();

function RecentlyCompletedSurveys() {
  const navigate = useNavigate();
  const { passesFilter } = useCommunityFilter();

  const recentSurveys = useMemo(() => {
    return surveys
      .filter((s) => passesFilter(s.facilityId) && s.date >= THIRTY_DAY_CUTOFF)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [passesFilter]);

  return (
    <Paper sx={{ p: 2.5, mb: 3, borderRadius: '8px', border: '1px solid #E2E8F0' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AssignmentIcon sx={{ color: '#0065BD' }} />
          <Typography variant="h6">Recently Completed Surveys</Typography>
          <Chip label="Last 30 days" size="small" color="primary" />
        </Box>
        <Button variant="text" size="small" onClick={() => navigate('/citations-remix')} sx={{ fontWeight: 600, fontSize: '0.8rem' }}>View all →</Button>
      </Box>

      {recentSurveys.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
          No surveys completed in the last 30 days
        </Typography>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 400, color: '#293036', fontSize: '14px', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2, width: 110 }}>Survey Date</TableCell>
                <TableCell sx={{ fontWeight: 400, color: '#293036', fontSize: '14px', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2 }}>Community</TableCell>
                <TableCell sx={{ fontWeight: 400, color: '#293036', fontSize: '14px', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2, width: 140 }}>Surveyor</TableCell>
                <TableCell sx={{ fontWeight: 400, color: '#293036', fontSize: '14px', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2, width: 70 }} align="right">K</TableCell>
                <TableCell sx={{ fontWeight: 400, color: '#293036', fontSize: '14px', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2, width: 70 }} align="right">N</TableCell>
                <TableCell sx={{ fontWeight: 400, color: '#293036', fontSize: '14px', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2, width: 70 }} align="right">E</TableCell>
                <TableCell sx={{ fontWeight: 400, color: '#293036', fontSize: '14px', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2, width: 80 }} align="right">Total</TableCell>
                <TableCell sx={{ bgcolor: '#e0e4e7', width: 32, px: 0 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {recentSurveys.map((srv) => (
                <TableRow key={srv.id} hover
                  sx={{ cursor: 'pointer', '&:hover': { bgcolor: srv.total === 0 ? '#DCFCE7' : '#F0F7FF' }, bgcolor: srv.total === 0 ? '#F0FDF4' : 'inherit' }}
                  onClick={() => navigate(`/facility/${srv.facilityId}`)}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{fmtDate(srv.date)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{srv.facility.replace('Avir at ', '')}</Typography>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>{srv.region}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">{srv.surveyor || '—'}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 600, color: srv.kTags > 0 ? '#DC2626' : '#94A3B8', fontSize: '0.8rem' }}>{srv.kTags || '—'}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 600, color: srv.nTags > 0 ? '#2563EB' : '#94A3B8', fontSize: '0.8rem' }}>{srv.nTags || '—'}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 600, color: srv.eTags > 0 ? '#D97706' : '#94A3B8', fontSize: '0.8rem' }}>{srv.eTags || '—'}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    {srv.total === 0
                      ? <Chip label="Def-Free" size="small" sx={{ bgcolor: '#BBF7D0', color: '#166534', fontWeight: 700, fontSize: '0.65rem' }} />
                      : <Typography variant="body2" sx={{ fontWeight: 700 }}>{srv.total}</Typography>}
                  </TableCell>
                  <TableCell sx={{ px: 0 }}>
                    <ChevronRightIcon sx={{ fontSize: 18, color: '#94A3B8' }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}



export default function CitationsDashboard() {
  const navigate = useNavigate();
  const { passesFilter } = useCommunityFilter();

  // Filters
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [rowMenuAnchor, setRowMenuAnchor] = useState<null | HTMLElement>(null);
  const [rowMenuFacId, setRowMenuFacId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return facilities.filter((f) => {
      if (!passesFilter(f.id)) return false;
      if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedRegion && f.region !== selectedRegion) return false;
      return true;
    });
  }, [search, selectedRegion, passesFilter]);

  // Community filtered base datasets
  const communityFacilities = useMemo(() => facilities.filter((f) => passesFilter(f.id)), [passesFilter]);
  const communitySurveys = useMemo(() => surveys.filter((s) => passesFilter(s.facilityId)), [passesFilter]);
  const ytdFilter = useMemo(() => makeDateFilter('ytd'), []);
  const communitySurveysYTD = useMemo(() => communitySurveys.filter((s) => ytdFilter(s.date)), [communitySurveys, ytdFilter]);
  const communityCitations = useMemo(() => citations.filter((c) => passesFilter(c.facilityId)), [passesFilter]);

  // Summary stats (filtered by community)
  const filteredStats = useMemo(() => ({
    totalFacilities: communityFacilities.length,
    surveyedFacilities: communityFacilities.filter((f) => f.surveyed).length,
    totalSurveys: communitySurveysYTD.length,
    totalCitations: communityCitations.length,
    totalKTags: communityCitations.filter((c) => c.tagType === 'K').length,
    totalNTags: communityCitations.filter((c) => c.tagType === 'N').length,
    totalETags: communityCitations.filter((c) => c.tagType === 'E').length,
    deficiencyFree: communitySurveysYTD.filter((s) => s.total === 0 && !s.isPending).length,
  }), [communityFacilities, communitySurveysYTD, communityCitations]);

  const avgCitationsNum = communityFacilities.length > 0 ? communityFacilities.reduce((s, f) => s + f.totalCitations, 0) / communityFacilities.length : 0;
  const avgCitations = avgCitationsNum.toFixed(1);

  // Chart data — trend always shows last 12 months regardless of date filter
  const last12MonthsCutoff = useMemo(() => {
    const d = new Date('2026-04-05');
    d.setMonth(d.getMonth() - 12);
    return d.toISOString().split('T')[0];
  }, []);
  const surveys12m = useMemo(
    () => surveys.filter((s) => passesFilter(s.facilityId) && s.date >= last12MonthsCutoff),
    [passesFilter, last12MonthsCutoff],
  );
  const surveyTrendData = useMemo(() => buildSurveyTrends(surveys12m), [surveys12m]);
  const regionBreakdown = useMemo(() => buildRegionBreakdown(communityFacilities), [communityFacilities]);

  const resetFilters = () => {
    setSearch(''); setSelectedRegion('');
  };

  const columns: GridColDef[] = [
    {
      field: 'name', headerName: 'Community', flex: 2, minWidth: 220,
      renderCell: (p: GridRenderCellParams) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            onClick={() => navigate(`/facility/${p.row.id}`)}>
            {p.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">{p.row.region}, {p.row.state}</Typography>
        </Box>
      ),
    },
    { field: 'region', headerName: 'Region', width: 110 },
    { field: 'lastSurveyDate', headerName: 'Last Survey', width: 110,
      renderCell: (p: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{p.value ? fmtDate(p.value as string) : '—'}</Typography>
      ),
    },
    { field: 'surveyCount', headerName: 'Surveys', width: 80, align: 'center' as const, headerAlign: 'center' as const, type: 'number' as const },
    { field: 'totalCitations', headerName: 'Citations', width: 90, align: 'center' as const, headerAlign: 'center' as const, type: 'number' as const },
    {
      field: 'totalKTags', headerName: 'K Tags', width: 80, align: 'center' as const, headerAlign: 'center' as const,
      renderCell: (p: GridRenderCellParams) => (p.value as number) > 0
        ? <Chip label={p.value} size="small" sx={{ bgcolor: '#FEE2E2', color: '#991B1B', fontWeight: 700, minWidth: 36 }} />
        : <Typography variant="caption" color="text.secondary">0</Typography>,
    },
    {
      field: 'totalNTags', headerName: 'N Tags', width: 80, align: 'center' as const, headerAlign: 'center' as const,
      renderCell: (p: GridRenderCellParams) => (p.value as number) > 0
        ? <Chip label={p.value} size="small" sx={{ bgcolor: '#DBEAFE', color: '#1E40AF', fontWeight: 700, minWidth: 36 }} />
        : <Typography variant="caption" color="text.secondary">0</Typography>,
    },
    {
      field: 'totalETags', headerName: 'E Tags', width: 80, align: 'center' as const, headerAlign: 'center' as const,
      renderCell: (p: GridRenderCellParams) => (p.value as number) > 0
        ? <Chip label={p.value} size="small" sx={{ bgcolor: '#FEF9C3', color: '#854D0E', fontWeight: 700, minWidth: 36 }} />
        : <Typography variant="caption" color="text.secondary">0</Typography>,
    },
    {
      field: 'hasWaiver', headerName: 'Waiver', width: 80, align: 'center' as const, headerAlign: 'center' as const,
      renderCell: (p: GridRenderCellParams) => p.value
        ? <Chip label="Yes" size="small" sx={{ bgcolor: '#FEF3C7', color: '#92400E', fontWeight: 700 }} />
        : <Typography variant="caption" color="text.secondary">No</Typography>,
    },
    {
      field: 'actions', headerName: '', width: 50, sortable: false, filterable: false,
      renderCell: (p: GridRenderCellParams) => (
        <IconButton size="small" onClick={(e) => { setRowMenuAnchor(e.currentTarget); setRowMenuFacId(p.row.id); }}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Citations Dashboard"
        actions={
          <Button variant="contained" color="primary" startIcon={<UploadFileIcon />} size="small">Upload Survey</Button>
        }
      />
      <PageFilters />

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard title="Survey Windows Approaching" value={upcomingSurveyRows.filter((r) => passesFilter(r.id)).length} icon={<EventNoteIcon />} color="#B45309"
            subtitle="Within 90 days"
            action={{ label: 'View', onClick: () => navigate('/surveys') }} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard title="Overdue POCs" value={communityCitations.filter((c) => c.status === 'Open' && Math.round((TODAY_DASH.getTime() - new Date(c.date).getTime()) / 86400000) > 60).length} subtitle={`Of ${communityCitations.filter((c) => c.status === 'Open' || c.status === 'Pending').length} open POCs`} icon={<TaskAltIcon />} color="#7B1FA2"
            action={{ label: 'View', onClick: () => navigate('/poc') }} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard title="Deficiency-Free Surveys" value={filteredStats.deficiencyFree} subtitle={`Out of ${filteredStats.totalSurveys} total surveys`} icon={<ShieldIcon />} color="#2E7D32"
            action={{ label: 'Review', onClick: () => navigate('/citations-remix') }} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard title="Avg Citations per Survey" value={avgCitations} subtitle={`Across ${communityFacilities.length} communities`} icon={<TrendingUpIcon />} color="#F57C00"
            action={{ label: 'Communities', onClick: () => navigate('/facilities') }} />
        </Grid>
      </Grid>

      {/* Upcoming Surveys */}
      <UpcomingSurveysPanel />

      {/* Recently Completed Surveys */}
      <RecentlyCompletedSurveys />


    </Box>
  );
}
