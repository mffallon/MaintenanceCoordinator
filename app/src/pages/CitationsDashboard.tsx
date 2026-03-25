import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Grid, Typography, TextField, Button, Chip, FormControl, InputLabel,
  Select, MenuItem, Switch, FormControlLabel, IconButton, Tooltip, Paper,
  Menu, ListItemIcon, ListItemText, Divider, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  LinearProgress,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer,
} from 'recharts';
import { LineChart as MuiLineChart } from '@mui/x-charts/LineChart';
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
import BookmarkIcon from '@mui/icons-material/Bookmark';
import VisibilityIcon from '@mui/icons-material/Visibility';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AddTaskIcon from '@mui/icons-material/AddTask';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SummaryCard from '../components/SummaryCard';
import PageHeader from '../components/PageHeader';
import { facilities } from '../data/facilities';
import { citations } from '../data/citations';
import { surveyTrends, severityTrends, categorySeverity } from '../data/trends';

const COLORS = ['#1565C0', '#7B1FA2', '#D32F2F', '#ED6C02', '#2E7D32', '#0288D1', '#F57C00', '#5E35B1', '#00838F'];

const states = [...new Set(facilities.map((f) => f.state))].sort();
const regions = [...new Set(facilities.map((f) => f.region))].sort();
const surveyTypes = ['CMS Life Safety', 'CMS Health', 'State Fire Marshal', 'Joint Commission'];

// Build upcoming deadline rows: open/has-plan citations grouped by facility, with POC due dates
function buildUpcomingDeadlines() {
  const now = new Date();
  const rows: Array<{
    id: string;
    facilityId: string;
    facilityName: string;
    city: string;
    state: string;
    region: string;
    tag: string;
    tagType: 'F' | 'K' | 'E';
    category: string;
    severity: string;
    scope: string;
    status: string;
    deadline: string;
    daysRemaining: number;
    surveyDate: string;
  }> = [];

  for (const fac of facilities) {
    if (!fac.pocDueDate && fac.totalCitations === 0) continue;

    const facCitations = citations.filter(
      (c) => c.facilityId === fac.id && (c.status === 'Open' || c.status === 'Has Plan' || c.status === 'No Plan')
    );

    for (const cit of facCitations) {
      // Spread deadlines around "now" so we get a realistic mix of overdue, due-soon, and upcoming
      // Use a seeded offset based on citation index to keep it deterministic
      const citIdx = rows.length;
      const spreadDays = [
        -14, -10, -7, -5, -3, -1,          // overdue
        0, 1, 2, 3, 4, 5,                   // due this week
        7, 9, 11, 14, 18, 21,               // due in 2-3 weeks
        25, 30, 35, 40, 45, 50, 55, 60,     // due in 1-2 months
        70, 80, 90, 100, 110, 120,           // further out
      ];
      const dayOffset = spreadDays[citIdx % spreadDays.length]
        + Math.floor(citIdx / spreadDays.length) * 5; // shift later rounds further out

      const deadline = new Date(now.getTime() + dayOffset * 24 * 60 * 60 * 1000);
      const daysRemaining = dayOffset;

      const tagType: 'F' | 'K' | 'E' = cit.tag.startsWith('K') ? 'K' : cit.tag.startsWith('E') ? 'E' : 'F';

      rows.push({
        id: cit.id,
        facilityId: fac.id,
        facilityName: fac.name,
        city: fac.city,
        state: fac.state,
        region: fac.region,
        tag: cit.tag,
        tagType,
        category: cit.category,
        severity: cit.severity,
        scope: cit.scope,
        status: cit.status,
        deadline: deadline.toISOString().split('T')[0],
        daysRemaining,
        surveyDate: cit.surveyDate,
      });
    }
  }

  // Sort by soonest deadline first, then by tag type priority (F > K > E)
  const tagPriority = { F: 0, K: 1, E: 2 };
  rows.sort((a, b) => {
    if (a.daysRemaining !== b.daysRemaining) return a.daysRemaining - b.daysRemaining;
    return tagPriority[a.tagType] - tagPriority[b.tagType];
  });

  return rows;
}

const deadlineRows = buildUpcomingDeadlines();

function UpcomingDeadlinesTable() {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);
  const displayRows = showAll ? deadlineRows : deadlineRows.slice(0, 15);

  const tagChip = (tag: string, type: 'F' | 'K' | 'E') => {
    const styles = {
      F: { bgcolor: '#DBEAFE', color: '#1E40AF', border: '1.5px solid #93C5FD' },
      K: { bgcolor: '#FEE2E2', color: '#991B1B', border: '1.5px solid #FCA5A5' },
      E: { bgcolor: '#FEF9C3', color: '#854D0E', border: '1.5px solid #FDE047' },
    };
    return (
      <Chip label={tag} size="small"
        sx={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.8rem', ...styles[type] }} />
    );
  };

  const severityChip = (sev: string) => {
    const map: Record<string, { bg: string; color: string }> = {
      'IJ': { bg: '#FEE2E2', color: '#991B1B' },
      'Actual Harm': { bg: '#FED7AA', color: '#9A3412' },
      'Potential Harm': { bg: '#FEF9C3', color: '#854D0E' },
      'No Harm': { bg: '#E2E8F0', color: '#475569' },
    };
    const s = map[sev] || map['No Harm'];
    return <Chip label={sev} size="small" sx={{ bgcolor: s.bg, color: s.color, fontWeight: 600, fontSize: '0.7rem' }} />;
  };

  const deadlineIndicator = (days: number) => {
    let color = '#16A34A';
    let bg = '#DCFCE7';
    let label = `${days}d`;
    if (days < 0) { color = '#991B1B'; bg = '#FEE2E2'; label = `${Math.abs(days)}d overdue`; }
    else if (days <= 7) { color = '#991B1B'; bg = '#FEE2E2'; }
    else if (days <= 14) { color = '#9A3412'; bg = '#FED7AA'; }
    else if (days <= 30) { color = '#854D0E'; bg = '#FEF9C3'; }

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <Box sx={{
          width: 8, height: 8, borderRadius: '50%',
          bgcolor: days < 0 ? '#DC2626' : days <= 7 ? '#DC2626' : days <= 14 ? '#EA580C' : days <= 30 ? '#CA8A04' : '#16A34A',
          animation: days <= 7 ? 'pulse 2s infinite' : 'none',
          '@keyframes pulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.4 } },
        }} />
        <Chip label={label} size="small"
          sx={{ bgcolor: bg, color, fontWeight: 700, fontSize: '0.75rem', height: 24 }} />
      </Box>
    );
  };

  const statusChip = (status: string) => {
    const map: Record<string, { bg: string; color: string }> = {
      'Open': { bg: '#FEE2E2', color: '#991B1B' },
      'Has Plan': { bg: '#DBEAFE', color: '#1E40AF' },
      'No Plan': { bg: '#FEF3C7', color: '#92400E' },
    };
    const s = map[status] || { bg: '#F1F5F9', color: '#475569' };
    return <Chip label={status} size="small" sx={{ bgcolor: s.bg, color: s.color, fontWeight: 600, fontSize: '0.7rem' }} />;
  };

  // Summary counts
  const overdueCount = deadlineRows.filter((r) => r.daysRemaining < 0).length;
  const within7 = deadlineRows.filter((r) => r.daysRemaining >= 0 && r.daysRemaining <= 7).length;
  const within30 = deadlineRows.filter((r) => r.daysRemaining > 7 && r.daysRemaining <= 30).length;
  const fTagCount = deadlineRows.filter((r) => r.tagType === 'F').length;
  const kTagCount = deadlineRows.filter((r) => r.tagType === 'K').length;
  const eTagCount = deadlineRows.filter((r) => r.tagType === 'E').length;

  return (
    <Paper sx={{ p: 2.5, mb: 3, borderRadius: 3, border: '1px solid #E2E8F0' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AccessTimeIcon sx={{ color: '#DC2626' }} />
          <Typography variant="h6">Upcoming Citation Deadlines</Typography>
          <Chip label={`${deadlineRows.length} open`} size="small" color="primary" />
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {overdueCount > 0 && <Chip label={`${overdueCount} overdue`} size="small" sx={{ bgcolor: '#FEE2E2', color: '#991B1B', fontWeight: 700 }} />}
          {within7 > 0 && <Chip label={`${within7} due this week`} size="small" sx={{ bgcolor: '#FED7AA', color: '#9A3412', fontWeight: 700 }} />}
          <Chip label={`${within30} due in 30d`} size="small" sx={{ bgcolor: '#FEF9C3', color: '#854D0E', fontWeight: 600 }} />
          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
          <Chip label={`F: ${fTagCount}`} size="small" sx={{ bgcolor: '#DBEAFE', color: '#1E40AF', fontWeight: 700 }} />
          <Chip label={`K: ${kTagCount}`} size="small" sx={{ bgcolor: '#FEE2E2', color: '#991B1B', fontWeight: 700 }} />
          <Chip label={`E: ${eTagCount}`} size="small" sx={{ bgcolor: '#FEF9C3', color: '#854D0E', fontWeight: 700 }} />
        </Box>
      </Box>

      <TableContainer sx={{ maxHeight: showAll ? 600 : 460 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC', width: 90 }}>Deadline</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC', width: 80 }}>Days Left</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC', width: 90 }}>Tag</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC', width: 110 }}>Severity</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC', width: 90 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC' }}>Facility</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC', width: 60 }}>State</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC', width: 95 }}>Survey Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayRows.map((row) => (
              <TableRow key={row.id} hover
                sx={{
                  cursor: 'pointer',
                  bgcolor: row.daysRemaining < 0 ? '#FEF2F2' : row.daysRemaining <= 7 ? '#FFFBEB' : 'transparent',
                  '&:hover': { bgcolor: row.daysRemaining < 0 ? '#FEE2E2' : '#F0F7FF' },
                }}
                onClick={() => navigate(`/facility/${row.facilityId}`)}
              >
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{row.deadline}</Typography>
                </TableCell>
                <TableCell>{deadlineIndicator(row.daysRemaining)}</TableCell>
                <TableCell>{tagChip(row.tag, row.tagType)}</TableCell>
                <TableCell>
                  <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>{row.category}</Typography>
                </TableCell>
                <TableCell>{severityChip(row.severity)}</TableCell>
                <TableCell>{statusChip(row.status)}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main', fontSize: '0.8rem' }}>
                    {row.facilityName.replace('Life Care Center of ', 'LCC ')}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>{row.state}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption">{row.surveyDate}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {deadlineRows.length > 15 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1.5 }}>
          <Button size="small" onClick={() => navigate('/citations')}>
            View all &rarr;
          </Button>
        </Box>
      )}
    </Paper>
  );
}

// Build upcoming survey rows sorted by soonest window end
function buildUpcomingSurveys() {
  const now = new Date();
  return facilities
    .map((fac) => {
      const windowEnd = new Date(fac.surveyWindowEnd);
      const windowStart = new Date(fac.surveyWindowStart);
      const daysUntilEnd = Math.ceil((windowEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const daysUntilStart = Math.ceil((windowStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      let surveyStatus: string;
      if (daysUntilEnd < 0) surveyStatus = 'Window Passed';
      else if (daysUntilEnd <= 30) surveyStatus = 'Due Soon';
      else if (daysUntilStart <= 0) surveyStatus = 'In Window';
      else surveyStatus = 'Upcoming';

      // Mock whether survey has been uploaded
      const uploaded = fac.surveys > 2 && fac.totalCitations > 0;

      return {
        id: fac.id,
        name: fac.name,
        city: fac.city,
        state: fac.state,
        region: fac.region,
        surveyType: fac.surveyType,
        windowStart: fac.surveyWindowStart,
        windowEnd: fac.surveyWindowEnd,
        daysUntilEnd,
        surveyStatus,
        lastSurveyDate: fac.lastSurveyDate,
        totalSurveys: fac.surveys,
        totalCitations: fac.totalCitations,
        uploaded,
        nearing90Days: fac.nearing90Days,
      };
    })
    .sort((a, b) => a.daysUntilEnd - b.daysUntilEnd);
}

const surveyRows = buildUpcomingSurveys();

function UpcomingSurveysTable() {
  const navigate = useNavigate();

  const statusChip = (status: string) => {
    const map: Record<string, { bg: string; color: string }> = {
      'Window Passed': { bg: '#F1F5F9', color: '#64748B' },
      'Due Soon': { bg: '#FEE2E2', color: '#991B1B' },
      'In Window': { bg: '#FEF3C7', color: '#92400E' },
      'Upcoming': { bg: '#DBEAFE', color: '#1E40AF' },
    };
    const s = map[status] || { bg: '#F1F5F9', color: '#475569' };
    return <Chip label={status} size="small" sx={{ bgcolor: s.bg, color: s.color, fontWeight: 700, fontSize: '0.75rem' }} />;
  };

  const windowIndicator = (days: number) => {
    let color = '#16A34A'; let bg = '#DCFCE7'; let label = `${days}d`;
    if (days < 0) { color = '#64748B'; bg = '#F1F5F9'; label = 'Passed'; }
    else if (days <= 30) { color = '#991B1B'; bg = '#FEE2E2'; }
    else if (days <= 60) { color = '#9A3412'; bg = '#FED7AA'; }
    else if (days <= 90) { color = '#854D0E'; bg = '#FEF9C3'; }
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <Box sx={{
          width: 8, height: 8, borderRadius: '50%',
          bgcolor: days < 0 ? '#94A3B8' : days <= 30 ? '#DC2626' : days <= 60 ? '#EA580C' : days <= 90 ? '#CA8A04' : '#16A34A',
        }} />
        <Chip label={label} size="small" sx={{ bgcolor: bg, color, fontWeight: 700, fontSize: '0.75rem', height: 24 }} />
      </Box>
    );
  };

  const dueSoon = surveyRows.filter((r) => r.surveyStatus === 'Due Soon').length;
  const inWindow = surveyRows.filter((r) => r.surveyStatus === 'In Window').length;
  const upcoming = surveyRows.filter((r) => r.surveyStatus === 'Upcoming').length;
  const passed = surveyRows.filter((r) => r.surveyStatus === 'Window Passed').length;
  const displayRows = surveyRows.filter((r) => r.daysUntilEnd >= -30).slice(0, 15);

  return (
    <Paper sx={{ p: 2.5, mb: 3, borderRadius: 3, border: '1px solid #E2E8F0' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <CalendarTodayIcon sx={{ color: '#1565C0' }} />
          <Typography variant="h6">Upcoming Surveys</Typography>
          <Chip label={`${surveyRows.length} facilities`} size="small" color="primary" />
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {dueSoon > 0 && <Chip label={`${dueSoon} due soon`} size="small" sx={{ bgcolor: '#FEE2E2', color: '#991B1B', fontWeight: 700 }} />}
          <Chip label={`${inWindow} in window`} size="small" sx={{ bgcolor: '#FEF3C7', color: '#92400E', fontWeight: 700 }} />
          <Chip label={`${upcoming} upcoming`} size="small" sx={{ bgcolor: '#DBEAFE', color: '#1E40AF', fontWeight: 600 }} />
          <Chip label={`${passed} passed`} size="small" sx={{ bgcolor: '#F1F5F9', color: '#64748B', fontWeight: 600 }} />
        </Box>
      </Box>

      <TableContainer sx={{ maxHeight: 460 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC' }}>Facility</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC', width: 60 }}>State</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC', width: 100 }}>Region</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC', width: 130 }}>Survey Type</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC', width: 110 }}>Window Start</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC', width: 110 }}>Window End</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC', width: 100 }}>Days Left</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC', width: 110 }}>Survey Status</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC', width: 90 }}>Uploaded</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC', width: 100 }}>Last Survey</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayRows.map((row) => (
              <TableRow key={row.id} hover
                sx={{
                  cursor: 'pointer',
                  bgcolor: row.surveyStatus === 'Due Soon' ? '#FEF2F2'
                    : row.surveyStatus === 'In Window' ? '#FFFBEB' : 'transparent',
                  '&:hover': { bgcolor: row.surveyStatus === 'Due Soon' ? '#FEE2E2' : '#F0F7FF' },
                }}
                onClick={() => navigate(`/facility/${row.id}`)}
              >
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main', fontSize: '0.8rem' }}>
                    {row.name.replace('Life Care Center of ', 'LCC ')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">{row.city}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>{row.state}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption">{row.region}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption">{row.surveyType}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{row.windowStart}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{row.windowEnd}</Typography>
                </TableCell>
                <TableCell>{windowIndicator(row.daysUntilEnd)}</TableCell>
                <TableCell>{statusChip(row.surveyStatus)}</TableCell>
                <TableCell>
                  <Chip
                    label={row.uploaded ? 'Yes' : 'No'}
                    size="small"
                    sx={{
                      bgcolor: row.uploaded ? '#DCFCE7' : '#FEF3C7',
                      color: row.uploaded ? '#166534' : '#92400E',
                      fontWeight: 600, fontSize: '0.7rem',
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="caption">{row.lastSurveyDate}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1.5 }}>
        <Button size="small" onClick={() => navigate('/surveys?tab=upcoming')}>
          View all &rarr;
        </Button>
      </Box>
    </Paper>
  );
}

function RecentSurveysTable() {
  const navigate = useNavigate();
  const recentFacilities = [...facilities]
    .sort((a, b) => new Date(b.lastSurveyDate).getTime() - new Date(a.lastSurveyDate).getTime())
    .slice(0, 10);

  return (
    <Paper sx={{ p: 2.5, mb: 3, borderRadius: 3, border: '1px solid #E2E8F0' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AssignmentIcon sx={{ color: '#0065BD' }} />
          <Typography variant="h6">Recent Surveys</Typography>
          <Chip label={`${recentFacilities.length} latest`} size="small" color="primary" />
        </Box>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC' }}>Facility</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC', width: 60 }}>State</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC', width: 100 }}>Region</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC', width: 130 }}>Survey Type</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC', width: 110 }}>Last Survey</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC', width: 80 }} align="center">Citations</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC', width: 70 }} align="center">K Tags</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC', width: 70 }} align="center">E Tags</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC', width: 80 }} align="center">State Tags</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC', width: 80 }} align="center">Def-Free</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentFacilities.map((fac) => (
              <TableRow key={fac.id} hover
                sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#F0F7FF' } }}
                onClick={() => navigate(`/facility/${fac.id}`)}
              >
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main', fontSize: '0.8rem' }}>
                    {fac.name.replace('Life Care Center of ', 'LCC ')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">{fac.city}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>{fac.state}</Typography>
                </TableCell>
                <TableCell><Typography variant="caption">{fac.region}</Typography></TableCell>
                <TableCell><Typography variant="caption">{fac.surveyType}</Typography></TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{fac.lastSurveyDate}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{fac.totalCitations}</Typography>
                </TableCell>
                <TableCell align="center">
                  {fac.kTags > 0
                    ? <Chip label={fac.kTags} size="small" sx={{ bgcolor: '#FEE2E2', color: '#991B1B', fontWeight: 700, minWidth: 30 }} />
                    : <Typography variant="caption" color="text.secondary">0</Typography>}
                </TableCell>
                <TableCell align="center">
                  {fac.eTags > 0
                    ? <Chip label={fac.eTags} size="small" sx={{ bgcolor: '#FEF9C3', color: '#854D0E', fontWeight: 700, minWidth: 30 }} />
                    : <Typography variant="caption" color="text.secondary">0</Typography>}
                </TableCell>
                <TableCell align="center">
                  {fac.stateTags > 0
                    ? <Chip label={fac.stateTags} size="small" sx={{ bgcolor: '#E0E7FF', color: '#3730A3', fontWeight: 700, minWidth: 30 }} />
                    : <Typography variant="caption" color="text.secondary">0</Typography>}
                </TableCell>
                <TableCell align="center">
                  {fac.deficiencyFree
                    ? <Chip label="★" size="small" sx={{ bgcolor: '#BBF7D0', color: '#166534', fontWeight: 700 }} />
                    : <Typography variant="caption" color="text.secondary">—</Typography>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1.5 }}>
        <Button size="small" onClick={() => navigate('/surveys?tab=historical')}>
          View all &rarr;
        </Button>
      </Box>
    </Paper>
  );
}

function MissingDocumentationTable() {
  const navigate = useNavigate();

  // Facilities with any documentation gaps, sorted by total gaps descending
  const facilitiesWithGaps = facilities
    .filter((f) => f.documentationGaps.tasks + f.documentationGaps.logs + f.documentationGaps.docs > 0)
    .map((f) => ({
      ...f,
      totalGaps: f.documentationGaps.tasks + f.documentationGaps.logs + f.documentationGaps.docs,
    }))
    .sort((a, b) => b.totalGaps - a.totalGaps)
    .slice(0, 15);

  const totalGapFacilities = facilities.filter((f) => f.documentationGaps.tasks + f.documentationGaps.logs + f.documentationGaps.docs > 0).length;

  return (
    <Paper sx={{ p: 2.5, mb: 3, borderRadius: 3, border: '1px solid #E2E8F0' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <WarningAmberIcon sx={{ color: '#DC2626' }} />
          <Typography variant="h6">Missing Documentation</Typography>
          <Chip label={`${totalGapFacilities} facilities`} size="small" sx={{ bgcolor: '#FEE2E2', color: '#991B1B', fontWeight: 700 }} />
        </Box>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC' }}>Facility</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC', width: 60 }}>State</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC', width: 100 }}>Region</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC', width: 90 }} align="center">Tasks</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC', width: 90 }} align="center">Logs</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC', width: 90 }} align="center">Docs</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC', width: 90 }} align="center">Total Gaps</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC', width: 80 }} align="center">Citations</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', bgcolor: '#F8FAFC', width: 100 }}>POC Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {facilitiesWithGaps.map((fac) => (
              <TableRow key={fac.id} hover
                sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#F0F7FF' } }}
                onClick={() => navigate(`/facility/${fac.id}`)}
              >
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main', fontSize: '0.8rem' }}>
                    {fac.name.replace('Life Care Center of ', 'LCC ')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">{fac.city}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>{fac.state}</Typography>
                </TableCell>
                <TableCell><Typography variant="caption">{fac.region}</Typography></TableCell>
                <TableCell align="center">
                  {fac.documentationGaps.tasks > 0
                    ? <Chip label={fac.documentationGaps.tasks} size="small" sx={{ bgcolor: '#FEE2E2', color: '#991B1B', fontWeight: 700, minWidth: 30 }} />
                    : <Typography variant="caption" color="text.secondary">0</Typography>}
                </TableCell>
                <TableCell align="center">
                  {fac.documentationGaps.logs > 0
                    ? <Chip label={fac.documentationGaps.logs} size="small" sx={{ bgcolor: '#FEF9C3', color: '#854D0E', fontWeight: 700, minWidth: 30 }} />
                    : <Typography variant="caption" color="text.secondary">0</Typography>}
                </TableCell>
                <TableCell align="center">
                  {fac.documentationGaps.docs > 0
                    ? <Chip label={fac.documentationGaps.docs} size="small" sx={{ bgcolor: '#E0E7FF', color: '#3730A3', fontWeight: 700, minWidth: 30 }} />
                    : <Typography variant="caption" color="text.secondary">0</Typography>}
                </TableCell>
                <TableCell align="center">
                  <Chip label={fac.totalGaps} size="small" sx={{ bgcolor: '#FEE2E2', color: '#991B1B', fontWeight: 700, minWidth: 36 }} />
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{fac.totalCitations}</Typography>
                </TableCell>
                <TableCell>
                  {fac.pocStatus ? (
                    <Chip label={fac.pocStatus === 'on-track' ? 'On Track' : fac.pocStatus === 'overdue' ? 'Overdue' : fac.pocStatus === 'completed' ? 'Completed' : 'Not Started'} size="small"
                      sx={{
                        fontWeight: 600,
                        bgcolor: fac.pocStatus === 'overdue' ? '#FEE2E2' : fac.pocStatus === 'on-track' ? '#DBEAFE' : fac.pocStatus === 'completed' ? '#BBF7D0' : '#F1F5F9',
                        color: fac.pocStatus === 'overdue' ? '#991B1B' : fac.pocStatus === 'on-track' ? '#1E40AF' : fac.pocStatus === 'completed' ? '#166534' : '#64748B',
                      }} />
                  ) : <Typography variant="caption" color="text.secondary">—</Typography>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default function CitationsDashboard() {
  const navigate = useNavigate();

  // Filters
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedSurveyType, setSelectedSurveyType] = useState('');
  const [deficiencyFreeOnly, setDeficiencyFreeOnly] = useState(false);
  const [docGapsOnly, setDocGapsOnly] = useState(false);
  const [pocDueSoon, setPocDueSoon] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [rowMenuAnchor, setRowMenuAnchor] = useState<null | HTMLElement>(null);
  const [rowMenuFacId, setRowMenuFacId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return facilities.filter((f) => {
      if (search && !f.name.toLowerCase().includes(search.toLowerCase()) && !f.city.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedState && f.state !== selectedState) return false;
      if (selectedRegion && f.region !== selectedRegion) return false;
      if (selectedSurveyType && f.surveyType !== selectedSurveyType) return false;
      if (deficiencyFreeOnly && !f.deficiencyFree) return false;
      if (docGapsOnly && f.documentationGaps.tasks + f.documentationGaps.logs + f.documentationGaps.docs === 0) return false;
      if (pocDueSoon && f.pocStatus !== 'overdue' && f.pocStatus !== 'on-track') return false;
      return true;
    });
  }, [search, selectedState, selectedRegion, selectedSurveyType, deficiencyFreeOnly, docGapsOnly, pocDueSoon]);

  // Summary stats
  const inWindow = facilities.filter((f) => {
    const end = new Date(f.surveyWindowEnd);
    return end >= new Date();
  }).length;
  const nearing90 = facilities.filter((f) => f.nearing90Days).length;
  const recentSurveys = facilities.filter((f) => {
    const d = new Date(f.lastSurveyDate);
    const now = new Date();
    return (now.getTime() - d.getTime()) < 90 * 24 * 60 * 60 * 1000;
  }).length;
  const openPocs = facilities.filter((f) => f.pocStatus === 'on-track' || f.pocStatus === 'overdue').length;
  const defFree = facilities.filter((f) => f.deficiencyFree).length;
  const avgCitations = (facilities.reduce((s, f) => s + f.totalCitations, 0) / facilities.length).toFixed(1);
  const topCategory = 'Quality of Life & Care';

  const resetFilters = () => {
    setSearch(''); setSelectedState(''); setSelectedRegion('');
    setSelectedSurveyType('');
    setDeficiencyFreeOnly(false); setDocGapsOnly(false); setPocDueSoon(false);
  };


  const pocChip = (status: string | null) => {
    if (!status) return <Typography variant="caption" color="text.secondary">—</Typography>;
    const map: Record<string, { bg: string; color: string; label: string }> = {
      'on-track': { bg: '#DBEAFE', color: '#1E40AF', label: 'On Track' },
      'overdue': { bg: '#FECACA', color: '#991B1B', label: 'Overdue' },
      'completed': { bg: '#BBF7D0', color: '#166534', label: 'Completed' },
      'not-started': { bg: '#F1F5F9', color: '#64748B', label: 'Not Started' },
    };
    const s = map[status] || map['not-started'];
    return <Chip label={s.label} size="small" sx={{ bgcolor: s.bg, color: s.color, fontWeight: 600 }} />;
  };

  const columns: GridColDef[] = [
    {
      field: 'name', headerName: 'Facility', flex: 2, minWidth: 220,
      renderCell: (p: GridRenderCellParams) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            onClick={() => navigate(`/facility/${p.row.id}`)}>
            {p.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">{p.row.city}, {p.row.state}</Typography>
        </Box>
      ),
    },
    { field: 'state', headerName: 'State', width: 70, align: 'center', headerAlign: 'center' },
    { field: 'region', headerName: 'Region', width: 110 },
    { field: 'surveyType', headerName: 'Survey Type', width: 140 },
    { field: 'lastSurveyDate', headerName: 'Last Survey', width: 110 },
    {
      field: 'nearing90Days', headerName: '90-Day', width: 80, align: 'center', headerAlign: 'center',
      renderCell: (p: GridRenderCellParams) => p.value
        ? <Chip label="Yes" size="small" sx={{ bgcolor: '#FEF3C7', color: '#92400E', fontWeight: 700 }} />
        : <Typography variant="caption" color="text.secondary">No</Typography>,
    },
    { field: 'totalCitations', headerName: 'Citations', width: 90, align: 'center', headerAlign: 'center', type: 'number' },
    {
      field: 'kTags', headerName: 'K Tags', width: 80, align: 'center', headerAlign: 'center',
      renderCell: (p: GridRenderCellParams) => p.value > 0
        ? <Chip label={p.value} size="small" sx={{ bgcolor: '#FEE2E2', color: '#991B1B', fontWeight: 700, minWidth: 36 }} />
        : <Typography variant="caption" color="text.secondary">0</Typography>,
    },
    {
      field: 'eTags', headerName: 'E Tags', width: 80, align: 'center', headerAlign: 'center',
      renderCell: (p: GridRenderCellParams) => p.value > 0
        ? <Chip label={p.value} size="small" sx={{ bgcolor: '#FEF9C3', color: '#854D0E', fontWeight: 700, minWidth: 36 }} />
        : <Typography variant="caption" color="text.secondary">0</Typography>,
    },
    {
      field: 'stateTags', headerName: 'State Tags', width: 90, align: 'center', headerAlign: 'center',
      renderCell: (p: GridRenderCellParams) => p.value > 0
        ? <Chip label={p.value} size="small" sx={{ bgcolor: '#E0E7FF', color: '#3730A3', fontWeight: 700, minWidth: 36 }} />
        : <Typography variant="caption" color="text.secondary">0</Typography>,
    },
    {
      field: 'documentationGaps', headerName: 'Doc Gaps', width: 130, sortable: false,
      renderCell: (p: GridRenderCellParams) => {
        const g = p.value as { tasks: number; logs: number; docs: number };
        const total = g.tasks + g.logs + g.docs;
        if (total === 0) return <Chip label="None" size="small" sx={{ bgcolor: '#BBF7D0', color: '#166534' }} />;
        return (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {g.tasks > 0 && <Chip label={`T:${g.tasks}`} size="small" sx={{ bgcolor: '#FEE2E2', color: '#991B1B', height: 20, fontSize: '0.65rem' }} />}
            {g.logs > 0 && <Chip label={`L:${g.logs}`} size="small" sx={{ bgcolor: '#FEF9C3', color: '#854D0E', height: 20, fontSize: '0.65rem' }} />}
            {g.docs > 0 && <Chip label={`D:${g.docs}`} size="small" sx={{ bgcolor: '#E0E7FF', color: '#3730A3', height: 20, fontSize: '0.65rem' }} />}
          </Box>
        );
      },
    },
    {
      field: 'pocStatus', headerName: 'POC Status', width: 120, align: 'center', headerAlign: 'center',
      renderCell: (p: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {pocChip(p.value as string)}
          {p.row.pocCount > 0 && <Typography variant="caption" color="text.secondary">{p.row.pocCount} POCs</Typography>}
        </Box>
      ),
    },
    {
      field: 'deficiencyFree', headerName: 'Def-Free', width: 80, align: 'center', headerAlign: 'center',
      renderCell: (p: GridRenderCellParams) => p.value
        ? <Chip label="★" size="small" sx={{ bgcolor: '#BBF7D0', color: '#166534', fontWeight: 700 }} />
        : <Typography variant="caption" color="text.secondary">—</Typography>,
    },
    {
      field: 'benchmarkVsPeers', headerName: 'vs Peers', width: 100, type: 'number', align: 'center', headerAlign: 'center',
      renderCell: (p: GridRenderCellParams) => {
        const v = p.value as number;
        return (
          <Typography variant="body2" sx={{ fontWeight: 600, color: v > 0 ? 'error.main' : v < 0 ? 'success.main' : 'text.secondary' }}>
            {v > 0 ? '+' : ''}{v}
          </Typography>
        );
      },
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

  // Survey window distribution for small chart
  return (
    <Box>
      <PageHeader
        title="Citations Dashboard"
        actions={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" startIcon={<BookmarkIcon />} size="small">Saved Views</Button>
            <Button variant="outlined" startIcon={<FileDownloadIcon />} size="small">Export</Button>
          </Box>
        }
      />

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 2 }}>
          <SummaryCard title="In Survey Window" value={inWindow} icon={<BusinessIcon />} color="#1565C0" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 2 }}>
          <SummaryCard title="Nearing 90 Days" value={nearing90} icon={<WarningAmberIcon />} color="#ED6C02"
            chip={nearing90 > 5 ? { label: 'Action Needed', color: 'warning' } : undefined} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 2 }}>
          <SummaryCard title="Recent Surveys" value={recentSurveys} subtitle="Last 90 days" icon={<AssignmentIcon />} color="#0288D1" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 2 }}>
          <SummaryCard title="Open POCs" value={openPocs} icon={<TaskAltIcon />} color="#7B1FA2" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 2 }}>
          <SummaryCard title="Avg Citations" value={avgCitations} subtitle="Per facility" icon={<TrendingUpIcon />} color="#F57C00"
            trend={{ value: '+4.1 vs national avg (9.5)', positive: false }} />
        </Grid>
      </Grid>

      {/* Citations by Severity — 12 Months */}
      <Paper sx={{ p: 2.5, mb: 3, borderRadius: 3, border: '1px solid #E2E8F0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">Citations by Severity (12 Months)</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {[
              { label: 'Immediate Jeopardy', color: '#DC2626' },
              { label: 'Actual Harm', color: '#EA580C' },
              { label: 'Potential Harm', color: '#2563EB' },
              { label: 'No Harm', color: '#94A3B8' },
              { label: 'Total', color: '#0F172A' },
            ].map((s) => (
              <Box key={s.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: s.label === 'Total' ? '50%' : 1, bgcolor: s.color }} />
                <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#475569' }}>{s.label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" sx={{ mb: 0.5, color: 'text.secondary', fontSize: '0.75rem' }}>Trend</Typography>
            <MuiLineChart
              height={240}
              xAxis={[{
                data: severityTrends.map((_, i) => i),
                scaleType: 'point',
                valueFormatter: (v: number) => severityTrends[v]?.month ?? '',
                tickLabelStyle: { fontSize: 10 },
              }]}
              yAxis={[{ tickLabelStyle: { fontSize: 10 } }]}
              series={[
                { data: severityTrends.map((d) => d['Immediate Jeopardy']), label: 'IJ', area: true, stack: 'severity', color: '#DC2626', showMark: false },
                { data: severityTrends.map((d) => d['Actual Harm']), label: 'Actual Harm', area: true, stack: 'severity', color: '#EA580C', showMark: false },
                { data: severityTrends.map((d) => d['Potential Harm']), label: 'Potential Harm', area: true, stack: 'severity', color: '#2563EB', showMark: false },
                { data: severityTrends.map((d) => d['No Harm']), label: 'No Harm', area: true, stack: 'severity', color: '#94A3B8', showMark: false },
                { data: severityTrends.map((d) => d.total), label: 'Total', color: '#0F172A', showMark: true },
              ]}
              hideLegend
              margin={{ left: 40, right: 10, top: 10, bottom: 30 }}
              sx={{ '& .MuiAreaElement-root': { opacity: 0.7 } }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" sx={{ mb: 0.5, color: 'text.secondary', fontSize: '0.75rem' }}>By Category</Typography>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={categorySeverity} layout="vertical" margin={{ left: 10 }} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="category" type="category" width={130} tick={{ fontSize: 9 }} />
                <RTooltip />
                <Bar dataKey="ij" stackId="severity" fill="#DC2626" name="IJ" />
                <Bar dataKey="actualHarm" stackId="severity" fill="#EA580C" name="Actual Harm" />
                <Bar dataKey="potentialHarm" stackId="severity" fill="#2563EB" name="Potential Harm" />
                <Bar dataKey="noHarm" stackId="severity" fill="#94A3B8" name="No Harm" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>
      </Paper>

      {/* Upcoming Deadlines Table */}
      <UpcomingDeadlinesTable />

      {/* Upcoming Surveys Table */}
      <UpcomingSurveysTable />

      {/* Recent Surveys */}
      <RecentSurveysTable />

      {/* Missing Documentation */}
      <MissingDocumentationTable />
    </Box>
  );
}
