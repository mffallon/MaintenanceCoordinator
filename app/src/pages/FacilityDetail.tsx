import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Chip, Button, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel,
  ToggleButtonGroup, ToggleButton, Drawer, IconButton,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddTaskIcon from '@mui/icons-material/AddTask';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InsightsIcon from '@mui/icons-material/Insights';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LinearProgress from '@mui/material/LinearProgress';
import { facilities, citations, surveys, tagDescriptions } from '../data/avir-data';
import type { AvirCitation, AvirSurvey, AvirFacility } from '../data/avir-data';
import PageHeader from '../components/PageHeader';
import { fmtDate } from '../utils/formatDate';
import { effectiveLastSurveyDate } from '../utils/surveyWindowOverrides';

const TODAY = new Date('2026-04-05');

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}
function toISO(d: Date): string { return d.toISOString().split('T')[0]; }
function daysUntil(dateStr: string): number {
  return Math.round((new Date(dateStr).getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24));
}

// ─── Status helpers ──────────────────────────────────────────────
const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  Completed: { bg: '#BBF7D0', color: '#166534' },
  Open:      { bg: '#FEE2E2', color: '#991B1B' },
  Pending:   { bg: '#FEF3C7', color: '#92400E' },
  NA:        { bg: '#F1F5F9', color: '#64748B' },
};
const statusChip = (status: string) => {
  const s = STATUS_STYLES[status] || { bg: '#F1F5F9', color: '#475569' };
  return <Chip label={status || '—'} size="small" sx={{ bgcolor: s.bg, color: s.color, fontWeight: 600, height: 20, fontSize: '0.7rem' }} />;
};


// ─── Survey Prep Content (shown when window ≤ 90 days) ───────────
function SurveyPrepContent({ facility, facCitations, facSurveys }: {
  facility: AvirFacility; facCitations: AvirCitation[]; facSurveys: AvirSurvey[];
}) {
  const sortedSurveys = [...facSurveys].sort((a, b) => b.date.localeCompare(a.date));
  const lastSurvey = sortedSurveys[0];

  const effDate = effectiveLastSurveyDate(facility.id, facility.lastSurveyDate || TODAY.toISOString());
  const windowStart = toISO(addMonths(new Date(effDate), 9));
  const windowEnd   = toISO(addMonths(new Date(effDate), 15));
  const days = daysUntil(windowEnd);
  const surveyStatus = days < 0 ? 'Overdue' : days <= 30 ? 'Due Soon' : 'Upcoming';
  const ss = {
    Overdue:  { bg: '#FEF2F2', color: '#991B1B', border: '#FECACA' },
    'Due Soon': { bg: '#FFFBEB', color: '#92400E', border: '#FDE68A' },
    Upcoming: { bg: '#EFF6FF', color: '#1E40AF', border: '#BFDBFE' },
  }[surveyStatus];

  // Surveyor history
  const surveyorCounts = new Map<string, number>();
  sortedSurveys.forEach((s) => {
    if (s.surveyor) surveyorCounts.set(s.surveyor, (surveyorCounts.get(s.surveyor) || 0) + 1);
  });
  const surveyors = [...surveyorCounts.entries()].sort((a, b) => b[1] - a[1]);

  // Doc gaps
  const openCits = facCitations.filter((c) => c.status === 'Open' || c.status === 'Pending');
  const seed = facility.id.length % 5;
  const docGaps = {
    tasks: openCits.length,
    logs: facility.totalCitations > 10 ? seed + 2 : facility.totalCitations > 0 ? seed : 0,
    docs: facility.totalCitations > 15 ? 3 : facility.totalCitations > 5 ? 1 : 0,
  };
  const totalGaps = docGaps.tasks + docGaps.logs + docGaps.docs;

  // Citation breakdown
  const kCount = facCitations.filter((c) => c.tagType === 'K').length;
  const nCount = facCitations.filter((c) => c.tagType === 'N').length;
  const eCount = facCitations.filter((c) => c.tagType === 'E').length;
  const statusCounts = facCitations.reduce<Record<string, number>>((acc, c) => {
    acc[c.status || 'Open'] = (acc[c.status || 'Open'] || 0) + 1; return acc;
  }, {});
  const statusColor = (s: string) => s === 'Completed' ? '#16A34A' : s === 'Pending' ? '#F59E0B' : '#DC2626';

  // Top cited tags
  const tagCounts = facCitations.reduce<Record<string, number>>((acc, c) => {
    acc[c.tag] = (acc[c.tag] || 0) + 1; return acc;
  }, {});
  const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Portfolio trending tags (last 3 months)
  const cutoff = toISO(addMonths(TODAY, -3));
  const recentMap = new Map<string, number>();
  citations.forEach((c) => { if (c.date >= cutoff) recentMap.set(c.tag, (recentMap.get(c.tag) || 0) + 1); });
  const facTagSet = new Set(facCitations.map((c) => c.tag));
  const tagTrends = [...recentMap.entries()]
    .map(([tag, recent]) => ({ tag, recent, citedHere: facTagSet.has(tag), desc: tagDescriptions.get(tag) || '' }))
    .sort((a, b) => b.recent - a.recent)
    .slice(0, 8);
  const maxRecent = tagTrends[0]?.recent || 1;

  return (
    <Box>
      {/* Survey Window Banner */}
      <Paper sx={{ p: 2.5, mb: 2.5, borderRadius: 3, border: `1px solid ${ss.border}`, bgcolor: ss.bg }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <CalendarTodayIcon sx={{ color: ss.color }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: ss.color }}>
              Survey Window: {fmtDate(windowStart)} – {fmtDate(windowEnd)}
            </Typography>
            <Typography variant="caption" sx={{ color: ss.color, opacity: 0.85 }}>
              {days < 0 ? `Window closed ${Math.abs(days)} days ago` : `${days} days remaining`}
              {lastSurvey ? ` · Last surveyed ${fmtDate(lastSurvey.date)}` : ''}
            </Typography>
          </Box>
          <Chip label={surveyStatus} sx={{ bgcolor: ss.color, color: '#fff', fontWeight: 700, fontSize: '0.8rem' }} />
        </Box>
      </Paper>

      {/* Readiness Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
        {/* TELS Documentation */}
        <Paper sx={{ p: 2, flex: 1, borderRadius: 3, border: `1px solid ${totalGaps > 0 ? '#FDE68A' : '#BBF7D0'}`, bgcolor: totalGaps > 0 ? '#FFFBEB' : '#F0FDF4' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <AssignmentIcon sx={{ fontSize: 18, color: totalGaps > 0 ? '#92400E' : '#166534' }} />
            <Typography variant="body2" sx={{ fontWeight: 700, color: totalGaps > 0 ? '#92400E' : '#166534' }}>TELS Documentation</Typography>
          </Box>
          {[
            { label: 'Open task items', count: docGaps.tasks },
            { label: 'Incomplete logs', count: docGaps.logs },
            { label: 'Missing documents', count: docGaps.docs },
          ].map(({ label, count }) => (
            <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                {count === 0 ? <CheckCircleIcon sx={{ fontSize: 15, color: '#16A34A' }} /> : <ErrorIcon sx={{ fontSize: 15, color: '#DC2626' }} />}
                <Typography variant="caption" sx={{ fontSize: '0.78rem' }}>{label}</Typography>
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: count > 0 ? '#DC2626' : '#16A34A' }}>{count > 0 ? count : '✓'}</Typography>
            </Box>
          ))}
        </Paper>

        {/* Citation History */}
        <Paper sx={{ p: 2, flex: 1, borderRadius: 3, border: '1px solid #E0E4E7' }}>
          <Typography variant="body2" sx={{ fontWeight: 700, mb: 1.5 }}>Prior Citation History</Typography>
          {[
            { label: 'K-Tags (Life Safety)', count: kCount, color: '#DC2626' },
            { label: 'N-Tags (State)', count: nCount, color: '#2563EB' },
            { label: 'E-Tags (Emergency)', count: eCount, color: '#D97706' },
          ].map(({ label, count, color }) => (
            <Box key={label} sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
                <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>{label}</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color }}>{count}</Typography>
              </Box>
              <LinearProgress variant="determinate"
                value={facility.totalCitations > 0 ? (count / facility.totalCitations) * 100 : 0}
                sx={{ height: 6, borderRadius: 3, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 3 } }} />
            </Box>
          ))}
        </Paper>

        {/* Surveyor History */}
        <Paper sx={{ p: 2, flex: 1, borderRadius: 3, border: '1px solid #E0E4E7' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <PersonOutlineIcon sx={{ fontSize: 18, color: '#5c6874' }} />
            <Typography variant="body2" sx={{ fontWeight: 700 }}>Surveyor History</Typography>
          </Box>
          {surveyors.length === 0 ? (
            <Typography variant="caption" color="text.secondary">No surveyor data</Typography>
          ) : surveyors.slice(0, 4).map(([name, count]) => {
            const lastDate = sortedSurveys.find((s) => s.surveyor === name)?.date;
            return (
              <Box key={name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5, borderBottom: '1px solid #F1F5F9' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{name}</Typography>
                  {lastDate && <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.7rem' }}>Last: {fmtDate(lastDate)}</Typography>}
                </Box>
                <Chip label={`${count} survey${count !== 1 ? 's' : ''}`} size="small" sx={{ fontSize: '0.65rem', height: 20 }} />
              </Box>
            );
          })}
        </Paper>
      </Box>

      {/* Portfolio Trending Tags */}
      <Paper sx={{ p: 2.5, mb: 2.5, borderRadius: 3, border: '1px solid #E0E4E7' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <TrendingUpIcon sx={{ color: '#DC2626', fontSize: 20 }} />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>Surveyor Focus Areas</Typography>
            <Typography variant="caption" sx={{ color: '#64748B' }}>Tags most cited across the portfolio in the past 3 months</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {tagTrends.map((t, i) => (
            <Box key={t.tag}>
              {i > 0 && <Divider />}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.8rem', minWidth: 56 }}>{t.tag}</Typography>
                <Typography variant="caption" sx={{ color: '#64748B', flex: 1, fontSize: '0.73rem' }}>
                  {t.desc.length > 55 ? t.desc.slice(0, 55) + '…' : t.desc}
                </Typography>
                <Box sx={{ width: 80 }}>
                  <Box sx={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', bgcolor: '#F1F5F9' }}>
                    <Box sx={{ width: `${(t.recent / maxRecent) * 100}%`, bgcolor: '#DC2626', borderRadius: 3 }} />
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 24, textAlign: 'right', fontSize: '0.8rem' }}>{t.recent}</Typography>
                <Box sx={{ minWidth: 60 }}>
                  {t.citedHere && <Chip label="At risk" size="small" sx={{ fontSize: '0.6rem', height: 18, fontWeight: 700, bgcolor: '#FEE2E2', color: '#991B1B' }} />}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Most Cited Tags at this community */}
      {topTags.length > 0 && (
        <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E0E4E7' }}>
          <Typography variant="body2" sx={{ fontWeight: 700, mb: 1.5 }}>
            Most Cited Tags
            <Typography component="span" variant="caption" sx={{ color: '#64748B', ml: 1 }}>from prior surveys at this community</Typography>
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            {topTags.map(([tag, count]) => {
              const desc = facCitations.find((c) => c.tag === tag)?.description || '';
              const pct = facility.totalCitations > 0 ? (count / facility.totalCitations) * 100 : 0;
              return (
                <Box key={tag} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.8rem', minWidth: 60 }}>{tag}</Typography>
                  <Typography variant="caption" sx={{ color: '#64748B', flex: 1, fontSize: '0.75rem' }}>
                    {desc.length > 60 ? desc.slice(0, 60) + '…' : desc}
                  </Typography>
                  <Box sx={{ width: 100 }}>
                    <LinearProgress variant="determinate" value={pct}
                      sx={{ height: 6, borderRadius: 3, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { bgcolor: '#0065BD', borderRadius: 3 } }} />
                  </Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, minWidth: 24, textAlign: 'right' }}>{count}</Typography>
                </Box>
              );
            })}
          </Box>
        </Paper>
      )}
    </Box>
  );
}

// ─── Latest Survey Content (shown when no upcoming window) ────────
function LatestSurveyContent({ facility, facCitations, facSurveys }: {
  facility: AvirFacility; facCitations: AvirCitation[]; facSurveys: AvirSurvey[];
}) {
  const latestSurvey = [...facSurveys].sort((a, b) => b.date.localeCompare(a.date))[0];
  const latestCitations = latestSurvey ? facCitations.filter((c) => c.date === latestSurvey.date) : facCitations;

  const kCount = latestCitations.filter((c) => c.tagType === 'K').length;
  const nCount = latestCitations.filter((c) => c.tagType === 'N').length;
  const eCount = latestCitations.filter((c) => c.tagType === 'E').length;

  const statusBreakdown = (tagType: 'K' | 'N' | 'E') =>
    Object.entries(
      latestCitations.filter((c) => c.tagType === tagType)
        .reduce<Record<string, number>>((acc, c) => { acc[c.status || 'Open'] = (acc[c.status || 'Open'] || 0) + 1; return acc; }, {})
    ).sort((a, b) => b[1] - a[1]);

  return (
    <Box>
      {latestSurvey && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#293036' }}>Latest survey results</Typography>
          <Typography variant="caption" sx={{ color: '#64748B' }}>
            {fmtDate(latestSurvey.date)}{latestSurvey.surveyor ? ` · ${latestSurvey.surveyor}` : ''}
          </Typography>
          {latestSurvey.isWaiver && (
            <Chip label="Waiver" size="small" sx={{ bgcolor: '#EDE9FE', color: '#5B21B6', fontWeight: 600, height: 18, fontSize: '0.65rem' }} />
          )}
        </Box>
      )}
      <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
        {([
          { label: 'K-Tags', subtitle: 'Life Safety Code', count: kCount, tagType: 'K' as const, tagColor: '#991B1B', bg: '#FEF2F2', border: '#FECACA' },
          { label: 'N-Tags (State)', subtitle: 'State Regulations', count: nCount, tagType: 'N' as const, tagColor: '#1E40AF', bg: '#EFF6FF', border: '#BFDBFE' },
          { label: 'E-Tags', subtitle: 'Emergency Preparedness', count: eCount, tagType: 'E' as const, tagColor: '#854D0E', bg: '#FFFBEB', border: '#FDE68A' },
        ]).map((t) => (
          <Paper key={t.label} sx={{ p: 2, flex: 1, borderRadius: 3, border: `1px solid ${t.count > 0 ? t.border : '#E0E4E7'}`, bgcolor: t.count > 0 ? t.bg : '#FAFBFC' }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#5c6874' }}>{t.label}</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, my: 0.5, color: t.count > 0 ? t.tagColor : '#64748B' }}>{t.count}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>{t.subtitle}</Typography>
            {statusBreakdown(t.tagType).map(([status, val]) => (
              <Box key={status} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
                <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: STATUS_STYLES[status]?.color || '#64748B', flexShrink: 0 }} />
                <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.7rem' }}>{val}</Typography>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#64748B' }}>{status}</Typography>
              </Box>
            ))}
          </Paper>
        ))}
        {latestCitations.length === 0 && (
          <Paper sx={{ p: 2, flex: 1, borderRadius: 3, border: '1px solid #BBF7D0', bgcolor: '#F0FDF4' }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#166534' }}>Deficiency Free</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, my: 0.5, color: '#16A34A' }}>✓</Typography>
            <Typography variant="caption" sx={{ color: '#15803D' }}>No citations in latest survey</Typography>
          </Paper>
        )}
      </Box>
      <CitationsDetailSection facCitations={latestCitations} label="Latest Survey Citations" />
    </Box>
  );
}

// ─── Summary Tab ──────────────────────────────────────────────────
function SummaryTab({ facility, facCitations, facSurveys }: {
  facility: AvirFacility; facCitations: AvirCitation[]; facSurveys: AvirSurvey[];
}) {
  const effDate = effectiveLastSurveyDate(facility.id, facility.lastSurveyDate);
  const windowEnd = toISO(addMonths(new Date(effDate), 15));
  const hasUpcoming = daysUntil(windowEnd) <= 90;

  return hasUpcoming
    ? <SurveyPrepContent facility={facility} facCitations={facCitations} facSurveys={facSurveys} />
    : <LatestSurveyContent facility={facility} facCitations={facCitations} facSurveys={facSurveys} />;
}

// ─── Survey History Tab ───────────────────────────────────────────
function SurveyHistoryTab({ facSurveys, facCitations, facilityId }: {
  facSurveys: AvirSurvey[]; facCitations: AvirCitation[]; facilityId: string;
}) {
  const [expandedSurvey, setExpandedSurvey] = useState<string | null>(null);
  const sorted = [...facSurveys].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Paper sx={{ borderRadius: 3, border: '1px solid #E0E4E7', overflow: 'hidden' }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: '#E0E4E7' }}>
            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#293036' }}>Survey Date</TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#293036' }}>Surveyor</TableCell>
            <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#293036' }}>K-Tags</TableCell>
            <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#293036' }}>N-Tags</TableCell>
            <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#293036' }}>E-Tags</TableCell>
            <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#293036' }}>Total</TableCell>
            <TableCell sx={{ width: 32 }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.map((s) => {
            const survCits = facCitations.filter((c) => c.date === s.date);
            const isExpanded = expandedSurvey === s.id;
            return (
              <>
                <TableRow key={s.id} hover
                  onClick={() => setExpandedSurvey(isExpanded ? null : s.id)}
                  sx={{ cursor: 'pointer', bgcolor: isExpanded ? '#F0F7FF' : undefined, '&:hover': { bgcolor: '#F0F7FF' } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{fmtDate(s.date)}</Typography>
                      {s.isWaiver && (
                        <Chip label="Waiver" size="small" sx={{ bgcolor: '#EDE9FE', color: '#5B21B6', fontWeight: 600, height: 18, fontSize: '0.65rem' }} />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell><Typography variant="caption">{s.surveyor || '—'}</Typography></TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontWeight: s.kTags > 0 ? 700 : 400, color: s.kTags > 0 ? '#991B1B' : '#64748B' }}>{s.kTags}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontWeight: s.nTags > 0 ? 700 : 400, color: s.nTags > 0 ? '#1E40AF' : '#64748B' }}>{s.nTags}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontWeight: s.eTags > 0 ? 700 : 400, color: s.eTags > 0 ? '#854D0E' : '#64748B' }}>{s.eTags}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{s.total}</Typography>
                  </TableCell>
                  <TableCell>
                    <ChevronRightIcon sx={{ fontSize: 18, color: '#8492a1', transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
                  </TableCell>
                </TableRow>
                {isExpanded && survCits.length > 0 && (
                  <TableRow key={`${s.id}-expanded`}>
                    <TableCell colSpan={7} sx={{ p: 0, bgcolor: '#F8FAFC' }}>
                      <Box sx={{ p: 2 }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 600, fontSize: '0.72rem', color: '#64748B', width: 90 }}>Tag</TableCell>
                              <TableCell sx={{ fontWeight: 600, fontSize: '0.72rem', color: '#64748B' }}>Description</TableCell>
                              <TableCell sx={{ fontWeight: 600, fontSize: '0.72rem', color: '#64748B', width: 100 }}>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {survCits.map((c) => (
                              <TableRow key={c.id}>
                                <TableCell>
                                  <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.78rem',
                                    color: c.tagType === 'K' ? '#991B1B' : c.tagType === 'E' ? '#854D0E' : '#1E40AF' }}>
                                    {c.tag}
                                  </Typography>
                                </TableCell>
                                <TableCell><Typography variant="caption">{c.description}</Typography></TableCell>
                                <TableCell>{statusChip(c.status)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
                {isExpanded && survCits.length === 0 && (
                  <TableRow key={`${s.id}-empty`}>
                    <TableCell colSpan={7} sx={{ bgcolor: '#F8FAFC', py: 1.5, textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">Deficiency-free survey — no citations recorded</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </>
            );
          })}
          {sorted.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">No surveys on record</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}

// ─── Trends Tab ───────────────────────────────────────────────────
function TrendsTab() {
  return (
    <Paper sx={{ p: 6, borderRadius: 3, border: '1px solid #E0E4E7', textAlign: 'center' }}>
      <InsightsIcon sx={{ fontSize: 48, color: '#CBD5E1', mb: 2 }} />
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#64748B', mb: 1 }}>Trends</Typography>
      <Typography variant="body2" color="text.secondary">Coming soon — citation and compliance trends over time for this community.</Typography>
    </Paper>
  );
}

// ─── Main Page ────────────────────────────────────────────────────
export default function FacilityDetail() {
  const { id, facilityId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const facility = facilities.find((f) => f.id === (id ?? facilityId));

  if (!facility) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5">Facility not found</Typography>
        <Button variant="text" color="primary" onClick={() => navigate('/')} sx={{ mt: 2 }}>Back to dashboard</Button>
      </Box>
    );
  }

  const facCitations = citations.filter((c) => c.facilityId === facility.id);
  const facSurveys = surveys.filter((s) => s.facilityId === facility.id);
  const mostRecentSurvey = [...facSurveys].sort((a, b) => b.date.localeCompare(a.date))[0];

  return (
    <Box>
      <PageHeader
        title={facility.name.replace('Avir at ', '')}
        subtitle={
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
            <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.875rem' }}>
              {facility.state} · {facility.region}
            </Typography>
            {mostRecentSurvey && (
              <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.8rem' }}>
                Last survey {fmtDate(mostRecentSurvey.date)}{mostRecentSurvey.surveyor ? ` · ${mostRecentSurvey.surveyor}` : ''}
              </Typography>
            )}
          </Box>
        }
        backLabel={facilityId ? 'Back to Survey Planning' : 'Back to Communities'}
        onBack={() => navigate(-1)}
        tabs={[
          { label: 'Summary', value: 0 },
          { label: 'Survey History', value: 1 },
          { label: 'Trends', value: 2 },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        actions={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" color="primary" size="small" startIcon={<UploadFileIcon />}>Upload Survey</Button>
            <Button variant="contained" color="inherit" size="small" startIcon={<FileDownloadIcon />}>Export</Button>
          </Box>
        }
      />

      {activeTab === 0 && (
        <SummaryTab
          facility={facility}
          facCitations={facCitations}
          facSurveys={facSurveys}
        />
      )}
      {activeTab === 1 && (
        <SurveyHistoryTab
          facSurveys={facSurveys}
          facCitations={facCitations}
          facilityId={facility.id}
        />
      )}
      {activeTab === 2 && <TrendsTab />}
    </Box>
  );
}

// ─── Citations Detail Section ─────────────────────────────────────
const COL_CONFIG: { label: string; field: SortField | null; width: number }[] = [
  { label: 'Tag',         field: 'tag',         width: 90 },
  { label: 'Description', field: 'description', width: 0 },
  { label: 'Status',      field: 'status',      width: 100 },
  { label: 'Surveyor',    field: 'surveyor',    width: 120 },
  { label: 'Date',        field: 'date',        width: 100 },
  { label: 'POC',         field: null,          width: 70 },
  { label: '',            field: null,          width: 40 },
];
const TAGTYPE_COLS = COL_CONFIG.filter((c) => c.label !== 'Surveyor' && c.label !== 'Date');

type SortField = 'tag' | 'description' | 'tagType' | 'status' | 'surveyor' | 'date';
type SortDir = 'asc' | 'desc';

function sortCitations(cits: AvirCitation[], field: SortField, dir: SortDir): AvirCitation[] {
  return [...cits].sort((a, b) => {
    const cmp = String(a[field] ?? '').localeCompare(String(b[field] ?? ''));
    return dir === 'desc' ? -cmp : cmp;
  });
}

function CitationRow({ c, showSurvey = true, onRowClick }: {
  c: AvirCitation; showSurvey?: boolean; onRowClick: () => void;
}) {
  return (
    <TableRow hover onClick={onRowClick} sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#F0F7FF' } }}>
      <TableCell sx={{ width: 90, minWidth: 90 }}>
        <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.8rem' }}>{c.tag}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="caption">{c.description}</Typography>
      </TableCell>
      <TableCell sx={{ width: 100, minWidth: 100 }}>{statusChip(c.status)}</TableCell>
      {showSurvey && <TableCell sx={{ width: 120, minWidth: 120 }}><Typography variant="caption">{c.surveyor || '—'}</Typography></TableCell>}
      {showSurvey && <TableCell sx={{ width: 100, minWidth: 100 }}><Typography variant="caption">{fmtDate(c.date)}</Typography></TableCell>}
      <TableCell sx={{ width: 70, minWidth: 70 }} onClick={(e) => e.stopPropagation()}>
        <Typography variant="caption" sx={{ color: '#0065BD', fontWeight: 600, cursor: 'pointer', fontSize: '0.75rem', '&:hover': { textDecoration: 'underline' } }}>
          POC
        </Typography>
      </TableCell>
      <TableCell sx={{ width: 40, minWidth: 40, textAlign: 'center' }}>
        <ChevronRightIcon sx={{ fontSize: 20, color: '#8492a1' }} />
      </TableCell>
    </TableRow>
  );
}

function CitationsDetailSection({ facCitations, label = 'Citations Detail' }: { facCitations: AvirCitation[]; label?: string }) {
  const [viewBy, setViewBy] = useState<'status' | 'tagType'>('status');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [selectedCitation, setSelectedCitation] = useState<AvirCitation | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };
  const applySortToGroup = (cits: AvirCitation[]) => sortField ? sortCitations(cits, sortField, sortDir) : cits;

  const statusGroups = facCitations.reduce<Record<string, AvirCitation[]>>((acc, c) => {
    const key = c.status || 'Unknown';
    (acc[key] = acc[key] || []).push(c);
    return acc;
  }, {});
  const tagTypeGroups = facCitations.reduce<Record<string, AvirCitation[]>>((acc, c) => {
    (acc[c.tagType] = acc[c.tagType] || []).push(c);
    return acc;
  }, {});

  const statusChipColor = (status: string) => STATUS_STYLES[status] || { bg: '#F1F5F9', color: '#475569' };

  const headerCell = (col: typeof COL_CONFIG[0]) => (
    <TableCell key={col.label} sx={col.width > 0 ? { width: col.width, minWidth: col.width, bgcolor: '#e0e4e7' } : { bgcolor: '#e0e4e7' }}
      sortDirection={sortField === col.field ? sortDir : false}>
      {col.field
        ? <TableSortLabel active={sortField === col.field} direction={sortField === col.field ? sortDir : 'asc'} onClick={() => handleSort(col.field!)}>{col.label}</TableSortLabel>
        : col.label}
    </TableCell>
  );

  return (
    <Paper sx={{ p: 2.5, mt: 1, borderRadius: '8px', border: '1px solid #E2E8F0' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssignmentIcon color="primary" fontSize="small" />
          <Typography variant="h6" sx={{ fontSize: '1rem' }}>{label}</Typography>
        </Box>
        <Button variant="text" color="primary" size="small" startIcon={<FileDownloadIcon />}>Export</Button>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#5c6874', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>Group By</Typography>
        <ToggleButtonGroup value={viewBy} exclusive onChange={(_, v) => v && setViewBy(v)} size="small"
          sx={{ '& .MuiToggleButton-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.8rem', px: 2, py: 0.5, borderColor: '#E0E4E7', '&.Mui-selected': { bgcolor: '#0065BD', color: '#fff' } } }}>
          <ToggleButton value="status">Status</ToggleButton>
          <ToggleButton value="tagType">Tag Type</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {facCitations.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>No citations recorded — Deficiency-Free</Typography>
      ) : viewBy === 'status' ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {['Open', 'Pending', 'Completed', 'NA', 'Unknown'].filter((s) => statusGroups[s]?.length).map((status) => (
            <Box key={status}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip label={status || '—'} size="small" sx={{ ...statusChipColor(status), fontWeight: 700 }} />
                <Typography variant="caption" color="text.secondary">{statusGroups[status].length} citation{statusGroups[status].length !== 1 ? 's' : ''}</Typography>
              </Box>
              <TableContainer>
                <Table size="small" sx={{ tableLayout: 'fixed' }}>
                  <TableHead><TableRow sx={{ bgcolor: '#e0e4e7' }}>{COL_CONFIG.map(headerCell)}</TableRow></TableHead>
                  <TableBody>
                    {applySortToGroup(statusGroups[status]).map((c) => (
                      <CitationRow key={c.id} c={c} showSurvey onRowClick={() => setSelectedCitation(c)} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {['K', 'N', 'E'].filter((t) => tagTypeGroups[t]?.length).map((type) => (
            <Box key={type}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip label={type === 'K' ? 'K-Tags' : type === 'N' ? 'N-Tags' : 'E-Tags'} size="small" sx={{
                  bgcolor: type === 'K' ? '#FEE2E2' : type === 'N' ? '#DBEAFE' : '#FEF9C3',
                  color:   type === 'K' ? '#991B1B' : type === 'N' ? '#1E40AF' : '#854D0E',
                  fontWeight: 700,
                }} />
                <Typography variant="caption" color="text.secondary">{tagTypeGroups[type].length} citation{tagTypeGroups[type].length !== 1 ? 's' : ''}</Typography>
              </Box>
              <TableContainer>
                <Table size="small" sx={{ tableLayout: 'fixed' }}>
                  <TableHead><TableRow sx={{ bgcolor: '#e0e4e7' }}>{TAGTYPE_COLS.map(headerCell)}</TableRow></TableHead>
                  <TableBody>
                    {applySortToGroup(tagTypeGroups[type]).map((c) => (
                      <CitationRow key={c.id} c={c} showSurvey={false} onRowClick={() => setSelectedCitation(c)} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ))}
        </Box>
      )}

      {/* Citation Detail Drawer */}
      <Drawer anchor="right" open={!!selectedCitation} onClose={() => setSelectedCitation(null)}
        sx={{ zIndex: (t) => t.zIndex.drawer + 2 }} PaperProps={{ sx: { width: 420, p: 0 } }}>
        {selectedCitation && (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ p: 2.5, bgcolor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1rem' }}>{selectedCitation.tag}</Typography>
                <IconButton size="small" onClick={() => setSelectedCitation(null)}><CloseIcon fontSize="small" /></IconButton>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#293036', mb: 0.5 }}>{selectedCitation.description}</Typography>
              <Typography variant="caption" color="text.secondary">{selectedCitation.facility}</Typography>
            </Box>
            <Box sx={{ p: 2.5, flexGrow: 1, overflowY: 'auto' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                {([
                  ['Status', selectedCitation.status],
                  ['Tag Type', selectedCitation.tagType === 'K' ? 'K-Tag (Life Safety)' : selectedCitation.tagType === 'N' ? 'N-Tag (State)' : 'E-Tag (Emergency)'],
                  ['Region', selectedCitation.region],
                  ['Surveyor', selectedCitation.surveyor || '—'],
                  ['Survey Date', fmtDate(selectedCitation.date)],
                ] as [string, string][]).map(([label, value]) => (
                  <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">{label}</Typography>
                    {label === 'Status' ? statusChip(value) : <Typography variant="body2" sx={{ fontWeight: 600 }}>{value}</Typography>}
                  </Box>
                ))}
              </Box>
              {selectedCitation.observation && (
                <>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Observation</Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '8px', mb: 3 }}>
                    <Typography variant="body2" sx={{ color: '#293036', lineHeight: 1.6 }}>{selectedCitation.observation}</Typography>
                  </Paper>
                </>
              )}
            </Box>
            <Box sx={{ p: 2, borderTop: '1px solid #E2E8F0', display: 'flex', gap: 1 }}>
              <Button size="small" startIcon={<CloseIcon />} variant="text" color="inherit" onClick={() => setSelectedCitation(null)}>Close</Button>
              <Button size="small" variant="contained" color="primary" startIcon={<AddTaskIcon />} sx={{ flex: 1 }}>Create task</Button>
            </Box>
          </Box>
        )}
      </Drawer>
    </Paper>
  );
}
