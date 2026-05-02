import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Grid, Typography, Button, Chip, IconButton, Paper, ButtonBase,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import PageHeader from '../components/PageHeader';
import PageFilters from '../components/PageFilters';
import { useCommunityFilter } from '../components/CommunityFilter';
import { facilities, citations, surveys } from '../data/avir-data';
import { effectiveLastSurveyDate } from '../utils/surveyWindowOverrides';
import type { AvirSurvey } from '../data/avir-data';
import { fmtDate } from '../utils/formatDate';
import SurveyWindowIndicator from '../components/SurveyWindowIndicator';
import { makeDateFilter } from '../utils/dateFilter';

function fmtSurveyor(name: string): string {
  if (!name || name === '—') return name;
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return name;
  return `${parts[0][0]}. ${parts.slice(1).join(' ')}`;
}

// Upcoming survey window data (mirrors SurveyManagement overrides)
const TODAY_DASH = new Date('2026-04-02');
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

const allUpcomingSurveyRows = facilities
  .filter((f) => f.lastSurveyDate)
  .map((f) => {
    const last = new Date(effectiveLastSurveyDate(f.id, f.lastSurveyDate));
    const windowStart = new Date(last);
    windowStart.setMonth(windowStart.getMonth() + 9);
    const windowEnd = new Date(last);
    windowEnd.setMonth(windowEnd.getMonth() + 15);
    const windowStartISO = windowStart.toISOString().split('T')[0];
    const windowEndISO = windowEnd.toISOString().split('T')[0];
    const days = Math.round((windowStart.getTime() - TODAY_DASH.getTime()) / (1000 * 60 * 60 * 24));
    const status = days < 0 ? 'In Window' : days <= 30 ? 'Due Soon' : days <= 90 ? 'Upcoming' : 'On Track';
    const alerts = deriveUpcomingAlerts(f.id);
    const prevCitations = citations.filter((c) => c.facilityId === f.id).length;
    const lastSurvey = surveys.filter((s) => s.facilityId === f.id).sort((a, b) => b.date.localeCompare(a.date))[0];
    const lastSurveyor = lastSurvey?.surveyor || '—';
    const surveyType = lastSurvey && lastSurvey.kTags > 0 ? 'Life Safety' : 'Emergency Preparedness';
    return { id: f.id, name: f.name, region: f.region, windowStart: windowStartISO, windowEnd: windowEndISO, daysUntilDue: days, status, alerts, prevCitations, lastSurveyor, surveyType, lastSurveyDate: effectiveLastSurveyDate(f.id, f.lastSurveyDate) };
  })
  .filter((r) => r.daysUntilDue <= 90)
  .sort((a, b) => a.daysUntilDue - b.daysUntilDue);

// Table only shows "Now" (in window) + due within 30 days
const upcomingSurveyRows = allUpcomingSurveyRows.filter((r) => r.daysUntilDue <= 30);

function UpcomingSurveysPanel() {
  const navigate = useNavigate();
  const { passesFilter } = useCommunityFilter();
  const rows = upcomingSurveyRows.filter((r) => passesFilter(r.id));
  if (rows.length === 0) return null;

  return (
    <Paper elevation={0} sx={{ mb: 2, borderRadius: '8px', border: '1px solid #e0e4e7', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5 }}>
        <Typography sx={{ fontSize: '16px', color: '#293036', letterSpacing: '-0.176px' }}>
          <Box component="span" sx={{ fontWeight: 700 }}>Upcoming surveys</Box>
          <Box component="span" sx={{ fontWeight: 400 }}> - Now &amp; next 30 days</Box>
        </Typography>
        <Button variant="text" size="medium" onClick={() => navigate('/surveys')}
          endIcon={<ArrowForwardIcon sx={{ fontSize: '16px !important' }} />}
          sx={{ fontWeight: 600, fontSize: '16px', color: '#0065BD', letterSpacing: '-0.176px' }}>
          Pre-surveys
        </Button>
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
            </TableRow>
            {/* Sub-header row */}
            <TableRow>
              <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#293036', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2, whiteSpace: 'nowrap', width: 150 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                  Days until open
                  <ArrowDownwardIcon sx={{ fontSize: 16, color: '#293036' }} />
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#293036', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2, whiteSpace: 'nowrap', textAlign: 'center', width: '1px' }}>Timeline (Months since survey)</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#293036', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2 }}>Community</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#293036', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2, width: 150 }}>Surveyor</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#293036', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2, width: 130 }} align="right">Prev. Citations</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#293036', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2, width: 80 }} align="right">Alerts</TableCell>
              <TableCell sx={{ bgcolor: '#e0e4e7', width: 48, px: 0 }} />
            </TableRow>
          </TableHead>
          <TableBody sx={{ bgcolor: 'white' }}>
            {rows.map((r, idx) => {
              const isInWindow = r.status === 'In Window';
              const isDueSoon = r.status === 'Due Soon';
              const borderColor = isInWindow ? '#DC2626' : isDueSoon ? '#ED6C02' : 'transparent';
              const isLast = idx === rows.length - 1;
              return (
                <TableRow key={r.id} hover sx={{
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#F0F7FF' },
                  ...(isLast && { '& td': { borderBottom: 'none' } }),
                }}
                  onClick={() => navigate(`/surveys/${r.id}`)}>
                  <TableCell align="center" sx={borderColor !== 'transparent' ? { boxShadow: `inset 4px 0 0 0 ${borderColor}` } : {}}>
                    {isInWindow ? (
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
                      monthsSinceLastSurvey={9 - r.daysUntilDue / 30.4375}
                      lastSurveyDate={r.lastSurveyDate}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#293036' }}>
                      {r.name.replace('Avir at ', '')}
                    </Typography>
                    <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#293036' }}>{r.region}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#293036' }}>{fmtSurveyor(r.lastSurveyor)}</Typography>
                    <Chip label={r.surveyType} size="small" sx={{ fontSize: '11px', height: 18, fontWeight: 500, mt: '3px',
                      bgcolor: r.surveyType === 'Life Safety' ? '#FEE0C8' : '#C8E9F7',
                      color: r.surveyType === 'Life Safety' ? '#7C2D06' : '#0A5276',
                    }} />
                  </TableCell>
                  <TableCell align="right">
                    <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#293036' }}>{r.prevCitations}</Typography>
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
  );
}

const DASH_TODAY = '2026-04-02';
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
    <Paper elevation={0} sx={{ mb: 2, borderRadius: '8px', border: '1px solid #e0e4e7', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1.5 }}>
        <Typography sx={{ fontSize: '16px', color: '#293036', letterSpacing: '-0.176px' }}>
          <Box component="span" sx={{ fontWeight: 700 }}>Completed surveys</Box>
          <Box component="span" sx={{ fontWeight: 400 }}> - Last 30 days</Box>
        </Typography>
        <Button variant="text" size="medium" onClick={() => navigate('/citations-remix')}
          endIcon={<ArrowForwardIcon sx={{ fontSize: '16px !important' }} />}
          sx={{ fontWeight: 600, fontSize: '16px', color: '#0065BD', letterSpacing: '-0.176px' }}>
          All surveys
        </Button>
      </Box>

      {recentSurveys.length === 0 ? (
        <Typography sx={{ py: 3, textAlign: 'center', fontSize: '14px', color: '#64748B' }}>
          No surveys completed in the last 30 days
        </Typography>
      ) : (
        <TableContainer sx={{ bgcolor: '#e0e4e7' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#293036', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2, width: 160 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.25 }}>
                    Survey date
                    <ArrowDownwardIcon sx={{ fontSize: 16, color: '#293036' }} />
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#293036', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2 }}>Community</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#293036', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2, width: 160 }}>Surveyor</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#293036', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2, width: 80 }} align="right">K-Tags</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#293036', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2, width: 80 }} align="right">E-Tags</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#293036', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2, width: 80 }} align="right">Total</TableCell>
                <TableCell sx={{ bgcolor: '#e0e4e7', width: 48, px: 0 }} />
              </TableRow>
            </TableHead>
            <TableBody sx={{ bgcolor: 'white' }}>
              {recentSurveys.map((srv, idx) => (
                <TableRow key={srv.id} hover
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { bgcolor: srv.total === 0 ? '#c7f2df' : '#F0F7FF' },
                    ...(idx === recentSurveys.length - 1 && { '& td': { borderBottom: 'none' } }),
                    bgcolor: srv.total === 0 ? '#e3f9ef' : 'inherit',
                  }}
                  onClick={() => navigate(`/facility/${srv.facilityId}`)}>
                  <TableCell align="center">
                    <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#293036' }}>{fmtDate(srv.date)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#293036' }}>{srv.facility.replace('Avir at ', '')}</Typography>
                    <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#293036' }}>{srv.region}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#293036' }}>{srv.surveyor || '—'}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography sx={{ fontSize: '14px', fontWeight: 400, color: srv.kTags ? '#293036' : '#94A3B8' }}>{srv.kTags || '—'}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography sx={{ fontSize: '14px', fontWeight: 400, color: srv.eTags ? '#293036' : '#94A3B8' }}>{srv.eTags || '—'}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#293036' }}>{srv.total}</Typography>
                  </TableCell>
                  <TableCell sx={{ px: 1 }}>
                    <IconButton size="small">
                      <ArrowForwardIcon sx={{ fontSize: 18, color: '#293036' }} />
                    </IconButton>
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

  // Community filtered base datasets
  const communityFacilities = useMemo(() => facilities.filter((f) => passesFilter(f.id)), [passesFilter]);
  const communitySurveys = useMemo(() => surveys.filter((s) => passesFilter(s.facilityId)), [passesFilter]);
  const ytdFilter = useMemo(() => makeDateFilter('ytd'), []);
  const communitySurveysYTD = useMemo(() => communitySurveys.filter((s) => ytdFilter(s.date)), [communitySurveys, ytdFilter]);

  // Summary stats
  const filteredStats = useMemo(() => ({
    totalSurveys: communitySurveysYTD.length,
    deficiencyFree: communitySurveysYTD.filter((s) => s.total === 0 && !s.isPending).length,
  }), [communitySurveysYTD]);

  const avgCitationsNum = communityFacilities.length > 0 ? communityFacilities.reduce((s, f) => s + f.totalCitations, 0) / communityFacilities.length : 0;
  const avgCitations = avgCitationsNum.toFixed(1);

  const filteredUpcoming = allUpcomingSurveyRows.filter((r) => passesFilter(r.id));
  const upcomingCount = filteredUpcoming.length;
  const overdueCount = filteredUpcoming.filter((r) => r.status === 'Overdue').length;
  const upcomingAlerts = filteredUpcoming.reduce((s, r) => s + r.alerts, 0);

  // Card styles matching Figma node 2824:127663
  // Outer: gray75 bg with gray100 border, rounded 8px
  // Header: just px/py inside gray bg, no separate border
  // White body: white bg, gray100 border, full 8px radius, p:16
  const cardOuterSx = {
    flex: 1, borderRadius: '8px', border: '1px solid #e0e4e7',
    bgcolor: '#eceef0',
    display: 'flex', flexDirection: 'column', alignItems: 'stretch', textAlign: 'left',
    cursor: 'pointer', '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  };
  const cardHeaderSx = {
    px: 2, py: 1, height: 44, display: 'flex', alignItems: 'center',
  };
  const cardBodySx = {
    bgcolor: 'white', borderRadius: '8px', borderTop: '1px solid #e0e4e7',
    p: 2, position: 'relative', flexGrow: 1,
    display: 'flex', flexDirection: 'column',
  };

  return (
    <Box>
      <PageHeader
        title="Citations Dashboard"
        actions={
          <Typography sx={{ fontWeight: 300, fontSize: '16px', color: '#293036', letterSpacing: '-0.176px' }}>
            Test Corporation
          </Typography>
        }
      />
      <PageFilters />

      {/* Summary Cards - 3 cards per Figma */}
      <Box sx={{ display: 'flex', gap: 2, my: 3 }}>
        {/* Survey Windows Approaching — yellow theme */}
        <ButtonBase onClick={() => navigate('/surveys')} sx={{ ...cardOuterSx, bgcolor: '#fff2d1', border: '1px solid #fee08d' }}>
          <Box sx={{ ...cardHeaderSx }}>
            <Typography sx={{ fontWeight: 600, fontSize: '16px', color: '#613b01', letterSpacing: '-0.176px' }}>
              Upcoming Surveys
            </Typography>
          </Box>
          <Box sx={{ ...cardBodySx, borderTop: '1px solid #fee08d' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ fontWeight: 600, fontSize: '36px', color: '#835701', lineHeight: '44px', letterSpacing: '-0.684px' }}>
                {upcomingCount}
              </Typography>
              {upcomingAlerts > 0 && (
                <Chip label={`${upcomingAlerts} alert${upcomingAlerts !== 1 ? 's' : ''}`} color="error" size="small" />
              )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mt: '4px' }}>
              <Typography sx={{ fontWeight: 400, fontSize: '14px', color: '#613b01', lineHeight: '16px', letterSpacing: '-0.084px' }}>
                Open within 90 days
              </Typography>
              <Button variant="text" size="small" component="span" tabIndex={-1}
                endIcon={<ArrowForwardIcon sx={{ fontSize: '16px !important' }} />}
                sx={{ fontWeight: 600, fontSize: '14px', color: '#835701', p: 0, minWidth: 'unset', lineHeight: '16px', height: 'auto', minHeight: 'unset' }}>
                View
              </Button>
            </Box>
          </Box>
        </ButtonBase>

        {/* Average Citations per Survey */}
        <ButtonBase onClick={() => navigate('/facilities')} sx={{ ...cardOuterSx }}>
          <Box sx={{ ...cardHeaderSx }}>
            <Typography sx={{ fontWeight: 600, fontSize: '16px', color: '#293036', letterSpacing: '-0.176px' }}>
              Average citations per Survey
            </Typography>
          </Box>
          <Box sx={{ ...cardBodySx }}>
            <Typography sx={{ fontWeight: 600, fontSize: '36px', color: '#293036', lineHeight: '44px', letterSpacing: '-0.684px' }}>
              {avgCitations}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mt: '4px' }}>
              <Typography sx={{ fontWeight: 400, fontSize: '14px', color: '#293036', lineHeight: '16px', letterSpacing: '-0.084px' }}>
                Across {communityFacilities.length} communities
              </Typography>
              <Button variant="text" size="small" component="span" tabIndex={-1}
                endIcon={<ArrowForwardIcon sx={{ fontSize: '16px !important' }} />}
                sx={{ fontWeight: 600, fontSize: '14px', color: '#0065BD', p: 0, minWidth: 'unset', lineHeight: '16px', height: 'auto', minHeight: 'unset' }}>
                View
              </Button>
            </Box>
          </Box>
        </ButtonBase>

        {/* Deficiency-Free Surveys */}
        <ButtonBase onClick={() => navigate('/citations-remix')} sx={{ ...cardOuterSx, bgcolor: '#c7f2df' }}>
          <Box sx={{ ...cardHeaderSx }}>
            <Typography sx={{ fontWeight: 600, fontSize: '16px', color: '#0b2f1f', letterSpacing: '-0.176px' }}>
              Deficiency-Free Surveys
            </Typography>
          </Box>
          <Box sx={{ ...cardBodySx, borderTop: '1px solid #abeccf' }}>
            <Typography sx={{ fontWeight: 600, fontSize: '36px', color: '#196c46', lineHeight: '44px', letterSpacing: '-0.684px' }}>
              {filteredStats.deficiencyFree}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mt: '4px' }}>
              <Typography sx={{ fontWeight: 400, fontSize: '14px', color: '#293036', lineHeight: '16px', letterSpacing: '-0.084px' }}>
                Out of {filteredStats.totalSurveys} Surveys this year
              </Typography>
              <Button variant="text" size="small" component="span" tabIndex={-1}
                endIcon={<ArrowForwardIcon sx={{ fontSize: '16px !important' }} />}
                sx={{ fontWeight: 600, fontSize: '14px', color: '#0065BD', p: 0, minWidth: 'unset', lineHeight: '16px', height: 'auto', minHeight: 'unset' }}>
                View
              </Button>
            </Box>
          </Box>
        </ButtonBase>
      </Box>

      {/* Upcoming Surveys */}
      <UpcomingSurveysPanel />

      {/* Completed Surveys */}
      <RecentlyCompletedSurveys />
    </Box>
  );
}
