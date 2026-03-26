import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Grid, Paper, Chip, Button, Divider, Card, CardContent,
  LinearProgress, IconButton, Tooltip, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TableSortLabel, ToggleButtonGroup, ToggleButton,
  Drawer,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AssignmentIcon from '@mui/icons-material/Assignment';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AddTaskIcon from '@mui/icons-material/AddTask';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { facilities } from '../data/facilities';
import { citations } from '../data/citations';
import PageHeader from '../components/PageHeader';
import { fmtDate } from '../utils/formatDate';

export default function FacilityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const facility = facilities.find((f) => f.id === id);

  if (!facility) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5">Facility not found</Typography>
        <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>Back to Dashboard</Button>
      </Box>
    );
  }

  const facCitations = citations.filter((c) => c.facilityId === facility.id);
  const ijCount = facCitations.filter((c) => c.severity === 'IJ').length;
  const ahCount = facCitations.filter((c) => c.severity === 'Actual Harm').length;
  const phCount = facCitations.filter((c) => c.severity === 'Potential Harm').length;
  const nhCount = facCitations.filter((c) => c.severity === 'No Harm').length;

  const severityBar = (label: string, count: number, total: number, color: string) => (
    <Box sx={{ mb: 1.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="caption" sx={{ fontWeight: 600 }}>{label}</Typography>
        <Typography variant="caption" sx={{ fontWeight: 700, color }}>{count}</Typography>
      </Box>
      <LinearProgress variant="determinate" value={total > 0 ? (count / total) * 100 : 0}
        sx={{ height: 8, borderRadius: 4, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 4 } }} />
    </Box>
  );

  const gapChip = (has: boolean, label: string) => (
    <Chip
      size="small"
      icon={has ? <ErrorIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
      label={label}
      sx={{
        bgcolor: has ? '#FEE2E2' : '#DCFCE7',
        color: has ? '#991B1B' : '#166534',
        fontWeight: 600,
        '& .MuiChip-icon': { color: has ? '#DC2626' : '#16A34A' },
      }}
    />
  );

  const severityChip = (severity: string) => {
    const map: Record<string, { bg: string; color: string }> = {
      'IJ': { bg: '#FEE2E2', color: '#991B1B' },
      'Actual Harm': { bg: '#FED7AA', color: '#9A3412' },
      'Potential Harm': { bg: '#FEF9C3', color: '#854D0E' },
      'No Harm': { bg: '#E2E8F0', color: '#475569' },
    };
    const s = map[severity] || map['No Harm'];
    return <Chip label={severity} size="small" sx={{ bgcolor: s.bg, color: s.color, fontWeight: 600 }} />;
  };

  return (
    <Box>
      <PageHeader
        title={facility.name}
        subtitle={`${facility.city}, ${facility.state} · ${facility.region} · CCN: ${facility.ccn}`}
        hideCommunity
        backLabel="Back to Facilities"
        onBack={() => navigate(-1)}
        actions={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" size="small" startIcon={<UploadFileIcon />}>Upload Survey</Button>
            <Button variant="contained" size="small" startIcon={<NotificationsActiveIcon />}>Notify</Button>
            <Button variant="contained" size="small" startIcon={<AddTaskIcon />}>Create Tasks</Button>
            <Button variant="contained" size="small" startIcon={<FileDownloadIcon />}>Export</Button>
          </Box>
        }
      />

      {/* Insights Panel */}
      <Paper sx={{
        p: 2.5, mb: 3, borderRadius: '8px',
        border: '1px solid #C084FC',
        background: 'linear-gradient(135deg, #FAF5FF 0%, #F5F3FF 100%)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <AutoAwesomeIcon sx={{ color: '#7C3AED' }} />
          <Typography variant="h6" sx={{ color: '#5B21B6' }}>Insights</Typography>
          <Chip label="Beta" size="small" sx={{ bgcolor: '#EDE9FE', color: '#7C3AED', fontWeight: 600 }} />
        </Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ bgcolor: 'rgba(255,255,255,0.7)', border: '1px solid #E9D5FF' }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ color: '#7C3AED', fontWeight: 600, mb: 1 }}>Compliance Analysis</Typography>
                <Typography variant="body2">
                  {facility.totalCitations === 0
                    ? `${facility.deficiencyFree ? 'Deficiency-free status is a notable achievement.' : 'No citations recorded. Continue current compliance practices.'}`
                    : ijCount > 0
                      ? `This facility has ${facility.totalCitations} citations including ${ijCount} Immediate Jeopardy citations that require urgent attention. Consider scheduling an immediate compliance review.`
                      : `This facility has ${facility.totalCitations} citations across ${facility.surveys} surveys. ${facility.documentationGaps.tasks} task gaps need resolution.`
                  }
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ bgcolor: 'rgba(255,255,255,0.7)', border: '1px solid #E9D5FF' }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ color: '#7C3AED', fontWeight: 600, mb: 1 }}>Key Patterns</Typography>
                <Typography variant="body2">
                  {facCitations.length > 0
                    ? `Most citations fall under ${[...new Set(facCitations.map(c => c.category))].slice(0, 2).join(' and ')}. ${facility.state === 'WA' ? 'Washington state facilities average 36.3 citations/facility — significantly above the 9.5 national average.' : `${facility.state} facilities show a ${facility.benchmarkVsPeers > 0 ? 'higher' : 'lower'} citation rate than national average.`}`
                    : 'No citation patterns to analyze. This facility has maintained a clean survey record.'
                  }
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ bgcolor: 'rgba(255,255,255,0.7)', border: '1px solid #E9D5FF' }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ color: '#7C3AED', fontWeight: 600, mb: 1 }}>Recommended Actions</Typography>
                <Typography variant="body2">
                  {facility.documentationGaps.tasks > 0 && `Close ${facility.documentationGaps.tasks} open task gaps. `}
                  {facility.documentationGaps.logs > 0 && `Update ${facility.documentationGaps.logs} missing logs. `}
                  {facility.nearing90Days && 'Survey window closing soon — ensure all documentation is current. '}
                  {facility.pocStatus === 'overdue' && 'POC is overdue — escalate to regional director immediately. '}
                  {!facility.nearing90Days && facility.documentationGaps.tasks === 0 && 'Continue routine compliance monitoring.'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Survey Summary */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2.5, borderRadius: '8px', border: '1px solid #E2E8F0', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <CalendarTodayIcon color="primary" fontSize="small" />
              <Typography variant="h6">Survey Summary</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                ['Survey Type', facility.surveyType],
                ['Last Survey', fmtDate(facility.lastSurveyDate)],
                ['Survey Window', `${fmtDate(facility.surveyWindowStart)} to ${fmtDate(facility.surveyWindowEnd)}`],
                ['Total Surveys', facility.surveys.toString()],
                ['Surveyor Region', facility.region],
              ].map(([label, value]) => (
                <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">{label}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{value}</Typography>
                </Box>
              ))}
              {facility.pocDueDate && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">POC Due Date</Typography>
                  <Chip label={fmtDate(facility.pocDueDate)} size="small"
                    sx={{ bgcolor: facility.pocStatus === 'overdue' ? '#FEE2E2' : '#DBEAFE', fontWeight: 600 }} />
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Citation Severity Breakdown */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2.5, borderRadius: '8px', border: '1px solid #E2E8F0', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <WarningAmberIcon color="warning" fontSize="small" />
              <Typography variant="h6">Citation Summary</Typography>
              <Chip label={facility.totalCitations} size="small" color="primary" sx={{ ml: 'auto' }} />
            </Box>
            {severityBar('Immediate Jeopardy (J-L)', ijCount, facility.totalCitations, '#D32F2F')}
            {severityBar('Actual Harm (G-I)', ahCount, facility.totalCitations, '#ED6C02')}
            {severityBar('Potential Harm (D-F)', phCount, facility.totalCitations, '#F59E0B')}
            {severityBar('No Harm (A-C)', nhCount, facility.totalCitations, '#94A3B8')}
            <Divider sx={{ my: 1.5 }} />
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label={`K Tags: ${facility.kTags}`} size="small" sx={{ bgcolor: '#FEE2E2', color: '#991B1B', fontWeight: 600 }} />
              <Chip label={`E Tags: ${facility.eTags}`} size="small" sx={{ bgcolor: '#FEF9C3', color: '#854D0E', fontWeight: 600 }} />
              <Chip label={`State: ${facility.stateTags}`} size="small" sx={{ bgcolor: '#E0E7FF', color: '#3730A3', fontWeight: 600 }} />
            </Box>
            <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">vs Peers (Nat'l Avg 9.5)</Typography>
              <Typography variant="body2" sx={{
                fontWeight: 700,
                color: facility.benchmarkVsPeers > 0 ? 'error.main' : 'success.main',
              }}>
                {facility.benchmarkVsPeers > 0 ? '+' : ''}{facility.benchmarkVsPeers} citations/survey
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* TELS Gaps + POC */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2.5, borderRadius: '8px', border: '1px solid #E2E8F0', height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>TELS Documentation Gaps</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {gapChip(facility.documentationGaps.tasks > 0, `Tasks: ${facility.documentationGaps.tasks}`)}
              {gapChip(facility.documentationGaps.logs > 0, `Logs: ${facility.documentationGaps.logs}`)}
              {gapChip(facility.documentationGaps.docs > 0, `Docs: ${facility.documentationGaps.docs}`)}
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>POC Tracking</Typography>
            {facility.pocCount > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Active POCs</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{facility.pocCount}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Due Date</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{fmtDate(facility.pocDueDate)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                  <Chip size="small" label={facility.pocStatus}
                    sx={{
                      fontWeight: 600,
                      bgcolor: facility.pocStatus === 'overdue' ? '#FEE2E2' : facility.pocStatus === 'on-track' ? '#DBEAFE' : '#BBF7D0',
                      color: facility.pocStatus === 'overdue' ? '#991B1B' : facility.pocStatus === 'on-track' ? '#1E40AF' : '#166534',
                    }} />
                </Box>
                <LinearProgress variant="determinate"
                  value={facility.pocStatus === 'completed' ? 100 : facility.pocStatus === 'on-track' ? 65 : 30}
                  sx={{ height: 8, borderRadius: 4, mt: 1 }} />
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">No active Plans of Correction</Typography>
            )}
          </Paper>
        </Grid>


        {/* Citations Detail with View-by toggle */}
        <CitationsDetailSection facCitations={facCitations} severityChip={severityChip} />
      </Grid>
    </Box>
  );
}

/* ── Citations Detail sub-component with Status / Survey toggle ── */
import type { Citation } from '../types';
import type { ReactNode } from 'react';

const COL_CONFIG: { label: string; field: SortField | null; width: number }[] = [
  { label: 'Tag', field: 'tag', width: 90 },
  { label: 'Category', field: 'category', width: 0 }, // flex
  { label: 'Severity', field: 'severity', width: 145 },
  { label: 'Scope', field: 'scope', width: 100 },
  { label: 'Survey Type', field: 'surveyType', width: 130 },
  { label: 'Survey Date', field: 'surveyDate', width: 110 },
  { label: 'Doc Gaps', field: null, width: 160 },
  { label: '', field: null, width: 40 }, // arrow column
];

const STATUS_COLS = COL_CONFIG;
const SURVEY_COLS = COL_CONFIG.filter((c) => c.label !== 'Survey Type' && c.label !== 'Survey Date');

function CitationRow({ c, severityChip, showSurvey = true, onClick }: { c: Citation; severityChip: (s: string) => ReactNode; showSurvey?: boolean; onClick?: () => void }) {
  const cols = showSurvey ? STATUS_COLS : SURVEY_COLS;
  const w = (label: string) => { const col = cols.find((x) => x.label === label); return col && col.width > 0 ? { width: col.width, minWidth: col.width } : {}; };
  return (
    <TableRow hover onClick={onClick} sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#F0F7FF' } }}>
      <TableCell sx={w('Tag')}>
        <Chip label={c.tag} size="small" variant="outlined" sx={{ fontWeight: 700, fontFamily: 'monospace' }} />
      </TableCell>
      <TableCell sx={w('Category')}>
        <Typography variant="caption" sx={{ display: 'block' }}>{c.category}</Typography>
      </TableCell>
      <TableCell sx={w('Severity')}>{severityChip(c.severity)}</TableCell>
      <TableCell sx={w('Scope')}><Typography variant="caption">{c.scope}</Typography></TableCell>
      {showSurvey && <TableCell sx={w('Survey Type')}><Typography variant="caption">{c.surveyType}</Typography></TableCell>}
      {showSurvey && <TableCell sx={w('Survey Date')}><Typography variant="caption">{fmtDate(c.surveyDate)}</Typography></TableCell>}
      <TableCell sx={w('Doc Gaps')}>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {c.documentationGaps.tasks && <Chip label="Tasks" size="small" sx={{ bgcolor: '#FEE2E2', color: '#991B1B', height: 22, fontSize: '0.65rem' }} />}
          {c.documentationGaps.logs && <Chip label="Logs" size="small" sx={{ bgcolor: '#FEF9C3', color: '#854D0E', height: 22, fontSize: '0.65rem' }} />}
          {c.documentationGaps.docs && <Chip label="Docs" size="small" sx={{ bgcolor: '#E0E7FF', color: '#3730A3', height: 22, fontSize: '0.65rem' }} />}
        </Box>
      </TableCell>
      <TableCell sx={{ width: 40, minWidth: 40, textAlign: 'center' }}>
        <ChevronRightIcon sx={{ fontSize: 20, color: '#8492a1' }} />
      </TableCell>
    </TableRow>
  );
}

type SortField = 'tag' | 'category' | 'severity' | 'scope' | 'surveyType' | 'surveyDate' | 'status';
type SortDir = 'asc' | 'desc';

const SEVERITY_ORDER: Record<string, number> = { 'IJ': 0, 'Actual Harm': 1, 'Potential Harm': 2, 'No Harm': 3 };

function sortCitations(cits: Citation[], field: SortField, dir: SortDir): Citation[] {
  return [...cits].sort((a, b) => {
    let cmp = 0;
    if (field === 'severity') {
      cmp = (SEVERITY_ORDER[a.severity] ?? 9) - (SEVERITY_ORDER[b.severity] ?? 9);
    } else {
      const av = a[field] ?? '';
      const bv = b[field] ?? '';
      cmp = String(av).localeCompare(String(bv));
    }
    return dir === 'desc' ? -cmp : cmp;
  });
}

function CitationsDetailSection({ facCitations, severityChip }: { facCitations: Citation[]; severityChip: (s: string) => ReactNode }) {
  const [viewBy, setViewBy] = useState<'status' | 'survey' | 'none'>('status');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const applySortToGroup = (cits: Citation[]) => sortField ? sortCitations(cits, sortField, sortDir) : cits;

  // Group by status
  const statusGroups = facCitations.reduce<Record<string, Citation[]>>((acc, c) => {
    (acc[c.status] = acc[c.status] || []).push(c);
    return acc;
  }, {});
  const statusOrder = ['Open', 'No Plan', 'Has Plan', 'Corrected', 'Past Non-Compliance'];

  // Group by survey date + type
  const surveyGroups = facCitations.reduce<Record<string, Citation[]>>((acc, c) => {
    const key = `${c.surveyDate}|${c.surveyType}`;
    (acc[key] = acc[key] || []).push(c);
    return acc;
  }, {});
  const surveyKeys = Object.keys(surveyGroups).sort((a, b) => b.localeCompare(a)); // newest first

  // Group by category
  const categoryGroups = facCitations.reduce<Record<string, Citation[]>>((acc, c) => {
    (acc[c.category] = acc[c.category] || []).push(c);
    return acc;
  }, {});
  const categoryKeys = Object.keys(categoryGroups).sort((a, b) => categoryGroups[b].length - categoryGroups[a].length);

  const statusChipColor = (status: string) => {
    const m: Record<string, { bg: string; color: string }> = {
      'Open': { bg: '#FEE2E2', color: '#991B1B' },
      'No Plan': { bg: '#FEF3C7', color: '#92400E' },
      'Has Plan': { bg: '#DBEAFE', color: '#1E40AF' },
      'Corrected': { bg: '#BBF7D0', color: '#166534' },
      'Past Non-Compliance': { bg: '#F1F5F9', color: '#475569' },
    };
    return m[status] || m['Corrected'];
  };

  return (
    <Grid size={{ xs: 12 }}>
      <Paper sx={{ p: 2.5, borderRadius: '8px', border: '1px solid #E2E8F0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssignmentIcon color="primary" fontSize="small" />
            <Typography variant="h6">Citations Detail</Typography>
            <Chip label={facCitations.length} size="small" color="primary" />
          </Box>
          <Button size="small" startIcon={<FileDownloadIcon />}>Export Citations</Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#5c6874', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
            Group By
          </Typography>
          <ToggleButtonGroup
            value={viewBy}
            exclusive
            onChange={(_, v) => v && setViewBy(v)}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                textTransform: 'none', fontWeight: 600, fontSize: '0.8rem',
                px: 2, py: 0.5, borderColor: '#E0E4E7',
                '&.Mui-selected': { bgcolor: '#0065BD', color: '#fff', '&:hover': { bgcolor: '#004A8C' } },
              },
            }}
          >
            <ToggleButton value="status">Status</ToggleButton>
            <ToggleButton value="survey">Survey</ToggleButton>
            <ToggleButton value="none">None</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {facCitations.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
            No citations recorded — Deficiency-Free
          </Typography>
        ) : viewBy === 'none' ? (
          /* ── Flat table (no grouping) ── */
          <TableContainer>
            <Table size="small" sx={{ tableLayout: 'fixed' }}>
              <TableHead>
                <TableRow sx={{ bgcolor: '#e0e4e7' }}>
                  {STATUS_COLS.map((col) => (
                        <TableCell key={col.label} sortDirection={sortField === col.field ? sortDir : false}
                          sx={col.width > 0 ? { width: col.width, minWidth: col.width } : {}}>
                          {col.field ? (
                            <TableSortLabel active={sortField === col.field} direction={sortField === col.field ? sortDir : 'asc'}
                              onClick={() => handleSort(col.field!)}>
                              {col.label}
                            </TableSortLabel>
                          ) : col.label}
                        </TableCell>
                      ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {applySortToGroup(facCitations).map((c) => (
                  <CitationRow key={c.id} c={c} severityChip={severityChip} showSurvey onClick={() => setSelectedCitation(c)} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : viewBy === 'status' ? (
          /* ── View by Status ── */
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {statusOrder.filter((s) => statusGroups[s]?.length).map((status) => (
              <Box key={status}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Chip
                    label={status}
                    size="small"
                    sx={{ ...statusChipColor(status), fontWeight: 700 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {statusGroups[status].length} citation{statusGroups[status].length !== 1 ? 's' : ''}
                  </Typography>
                </Box>
                <TableContainer>
                  <Table size="small" sx={{ tableLayout: 'fixed' }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#e0e4e7' }}>
                        {STATUS_COLS.map((col) => (
                        <TableCell key={col.label} sortDirection={sortField === col.field ? sortDir : false}
                          sx={col.width > 0 ? { width: col.width, minWidth: col.width } : {}}>
                          {col.field ? (
                            <TableSortLabel active={sortField === col.field} direction={sortField === col.field ? sortDir : 'asc'}
                              onClick={() => handleSort(col.field!)}>
                              {col.label}
                            </TableSortLabel>
                          ) : col.label}
                        </TableCell>
                      ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {applySortToGroup(statusGroups[status]).map((c) => (
                        <CitationRow key={c.id} c={c} severityChip={severityChip} showSurvey onClick={() => setSelectedCitation(c)} />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ))}
          </Box>
        ) : (
          /* ── View by Survey ── */
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {surveyKeys.map((key) => {
              const [date, type] = key.split('|');
              const cits = surveyGroups[key];
              return (
                <Box key={key}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CalendarTodayIcon sx={{ fontSize: 16, color: '#5c6874' }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {fmtDate(date)}
                    </Typography>
                    <Chip label={type} size="small" sx={{ bgcolor: '#EEF2FF', color: '#3730A3', fontWeight: 600 }} />
                    <Typography variant="caption" color="text.secondary">
                      {cits.length} citation{cits.length !== 1 ? 's' : ''}
                    </Typography>
                  </Box>
                  <TableContainer>
                    <Table size="small" sx={{ tableLayout: 'fixed' }}>
                      <TableHead>
                        <TableRow sx={{ bgcolor: '#e0e4e7' }}>
                          {SURVEY_COLS.map((col) => (
                            <TableCell key={col.label} sortDirection={sortField === col.field ? sortDir : false}
                              sx={col.width > 0 ? { width: col.width, minWidth: col.width } : {}}>
                              {col.field ? (
                                <TableSortLabel active={sortField === col.field} direction={sortField === col.field ? sortDir : 'asc'}
                                  onClick={() => handleSort(col.field!)}>
                                  {col.label}
                                </TableSortLabel>
                              ) : col.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {applySortToGroup(cits).map((c) => (
                          <CitationRow key={c.id} c={c} severityChip={severityChip} showSurvey={false} onClick={() => setSelectedCitation(c)} />
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              );
            })}
          </Box>
        )}
      </Paper>

      {/* Citation Detail Drawer */}
      <Drawer
        anchor="right"
        open={!!selectedCitation}
        onClose={() => setSelectedCitation(null)}
        sx={{ zIndex: (t) => t.zIndex.drawer + 2 }}
        PaperProps={{ sx: { width: 420, p: 0 } }}
      >
        {selectedCitation && (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header */}
            <Box sx={{ p: 2.5, bgcolor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Chip label={selectedCitation.tag} variant="outlined" sx={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '1rem' }} />
                <IconButton size="small" onClick={() => setSelectedCitation(null)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#293036', mb: 0.5 }}>
                {selectedCitation.description}
              </Typography>
              <Typography variant="caption" color="text.secondary">{selectedCitation.category}</Typography>
            </Box>

            {/* Body */}
            <Box sx={{ p: 2.5, flexGrow: 1, overflowY: 'auto' }}>
              {/* Key fields */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                {[
                  ['Severity', selectedCitation.severity],
                  ['Scope', selectedCitation.scope],
                  ['Status', selectedCitation.status],
                  ['Survey Type', selectedCitation.surveyType],
                  ['Survey Date', fmtDate(selectedCitation.surveyDate)],
                ].map(([label, value]) => (
                  <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">{label}</Typography>
                    {label === 'Severity' ? severityChip(value) :
                     label === 'Status' ? (
                      <Chip label={value} size="small" sx={{
                        fontWeight: 600,
                        bgcolor: value === 'Corrected' ? '#BBF7D0' : value === 'Open' ? '#FEE2E2' : value === 'Has Plan' ? '#DBEAFE' : '#F1F5F9',
                        color: value === 'Corrected' ? '#166534' : value === 'Open' ? '#991B1B' : value === 'Has Plan' ? '#1E40AF' : '#475569',
                      }} />
                     ) : (
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{value}</Typography>
                     )}
                  </Box>
                ))}
              </Box>

              {/* Documentation Gaps */}
              <Divider sx={{ mb: 2 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Documentation Gaps</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <Chip label={selectedCitation.documentationGaps.tasks ? 'Tasks — Missing' : 'Tasks — OK'}
                  size="small" sx={{
                    bgcolor: selectedCitation.documentationGaps.tasks ? '#FEE2E2' : '#DCFCE7',
                    color: selectedCitation.documentationGaps.tasks ? '#991B1B' : '#166534',
                    fontWeight: 600,
                  }} />
                <Chip label={selectedCitation.documentationGaps.logs ? 'Logs — Missing' : 'Logs — OK'}
                  size="small" sx={{
                    bgcolor: selectedCitation.documentationGaps.logs ? '#FEF9C3' : '#DCFCE7',
                    color: selectedCitation.documentationGaps.logs ? '#854D0E' : '#166534',
                    fontWeight: 600,
                  }} />
                <Chip label={selectedCitation.documentationGaps.docs ? 'Docs — Missing' : 'Docs — OK'}
                  size="small" sx={{
                    bgcolor: selectedCitation.documentationGaps.docs ? '#E0E7FF' : '#DCFCE7',
                    color: selectedCitation.documentationGaps.docs ? '#3730A3' : '#166534',
                    fontWeight: 600,
                  }} />
              </Box>

              {/* Resolution Steps */}
              <Divider sx={{ mb: 2 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Resolution Steps</Typography>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '8px', mb: 3 }}>
                <Typography variant="body2" sx={{ color: '#293036', lineHeight: 1.6 }}>
                  {selectedCitation.resolutionSteps}
                </Typography>
              </Paper>

              {/* Prevention Strategies */}
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Prevention Strategies</Typography>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '8px' }}>
                <Typography variant="body2" sx={{ color: '#293036', lineHeight: 1.6 }}>
                  {selectedCitation.preventionStrategies}
                </Typography>
              </Paper>
            </Box>

            {/* Footer actions */}
            <Box sx={{ p: 2, borderTop: '1px solid #E2E8F0', display: 'flex', gap: 1 }}>
              <Button size="small" startIcon={<CloseIcon />} variant="text" color="inherit" onClick={() => setSelectedCitation(null)}>Close</Button>
              <Button size="small" startIcon={<AddTaskIcon />} sx={{ flex: 1 }}>Create Task</Button>
            </Box>
          </Box>
        )}
      </Drawer>
    </Grid>
  );
}
