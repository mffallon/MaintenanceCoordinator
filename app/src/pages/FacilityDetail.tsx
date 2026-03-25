import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Grid, Paper, Chip, Button, Divider, Card, CardContent,
  LinearProgress, IconButton, Tooltip, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow,
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
import { facilities } from '../data/facilities';
import { citations } from '../data/citations';
import PageHeader from '../components/PageHeader';

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
            <Button variant="outlined" size="small" startIcon={<UploadFileIcon />}>Upload Survey</Button>
            <Button variant="outlined" size="small" startIcon={<NotificationsActiveIcon />}>Notify</Button>
            <Button variant="contained" size="small" startIcon={<AddTaskIcon />}>Create Tasks</Button>
            <Button variant="outlined" size="small" startIcon={<FileDownloadIcon />}>Export</Button>
          </Box>
        }
      />

      {/* Insights Panel */}
      <Paper sx={{
        p: 2.5, mb: 3, borderRadius: 3,
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
          <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E2E8F0', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <CalendarTodayIcon color="primary" fontSize="small" />
              <Typography variant="h6">Survey Summary</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                ['Survey Type', facility.surveyType],
                ['Last Survey', facility.lastSurveyDate],
                ['Survey Window', `${facility.surveyWindowStart} — ${facility.surveyWindowEnd}`],
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
                  <Chip label={facility.pocDueDate} size="small"
                    sx={{ bgcolor: facility.pocStatus === 'overdue' ? '#FEE2E2' : '#DBEAFE', fontWeight: 600 }} />
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Citation Severity Breakdown */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E2E8F0', height: '100%' }}>
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
          <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E2E8F0', height: '100%' }}>
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
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{facility.pocDueDate}</Typography>
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


        {/* Citations Table */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E2E8F0' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AssignmentIcon color="primary" fontSize="small" />
                <Typography variant="h6">Citations Detail</Typography>
                <Chip label={facCitations.length} size="small" color="primary" />
              </Box>
              <Button variant="outlined" size="small" startIcon={<FileDownloadIcon />}>Export Citations</Button>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                    {['Tag', 'Category', 'Severity', 'Scope', 'Status', 'Survey Type', 'Survey Date', 'Doc Gaps', 'Resolution Steps'].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {facCitations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        No citations recorded — Deficiency-Free
                      </TableCell>
                    </TableRow>
                  ) : facCitations.map((c) => (
                    <TableRow key={c.id} hover sx={{ '&:hover': { bgcolor: '#F0F7FF' } }}>
                      <TableCell>
                        <Chip label={c.tag} size="small" variant="outlined" sx={{ fontWeight: 700, fontFamily: 'monospace' }} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ maxWidth: 200, display: 'block' }}>{c.category}</Typography>
                      </TableCell>
                      <TableCell>{severityChip(c.severity)}</TableCell>
                      <TableCell><Typography variant="caption">{c.scope}</Typography></TableCell>
                      <TableCell>
                        <Chip label={c.status} size="small"
                          sx={{
                            fontWeight: 600,
                            bgcolor: c.status === 'Corrected' ? '#BBF7D0' : c.status === 'Open' ? '#FEE2E2' : c.status === 'Has Plan' ? '#DBEAFE' : '#F1F5F9',
                            color: c.status === 'Corrected' ? '#166534' : c.status === 'Open' ? '#991B1B' : c.status === 'Has Plan' ? '#1E40AF' : '#475569',
                          }} />
                      </TableCell>
                      <TableCell><Typography variant="caption">{c.surveyType}</Typography></TableCell>
                      <TableCell><Typography variant="caption">{c.surveyDate}</Typography></TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {c.documentationGaps.tasks && <Chip label="T" size="small" sx={{ bgcolor: '#FEE2E2', color: '#991B1B', height: 20, width: 24, fontSize: '0.6rem' }} />}
                          {c.documentationGaps.logs && <Chip label="L" size="small" sx={{ bgcolor: '#FEF9C3', color: '#854D0E', height: 20, width: 24, fontSize: '0.6rem' }} />}
                          {c.documentationGaps.docs && <Chip label="D" size="small" sx={{ bgcolor: '#E0E7FF', color: '#3730A3', height: 20, width: 24, fontSize: '0.6rem' }} />}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={c.resolutionSteps} arrow>
                          <Typography variant="caption" sx={{ maxWidth: 200, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {c.resolutionSteps}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
