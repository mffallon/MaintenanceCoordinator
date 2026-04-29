import { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Chip, Button, Divider, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel,
  ToggleButtonGroup, ToggleButton, Drawer, IconButton,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddTaskIcon from '@mui/icons-material/AddTask';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import EditNoteIcon from '@mui/icons-material/EditNote';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import LinkIcon from '@mui/icons-material/Link';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
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
import type { AvirCitation, AvirSurvey, AvirFacility, PocStage, CitationSeverity, WorkOrder } from '../data/avir-data';
import PageHeader from '../components/PageHeader';
import { fmtDate } from '../utils/formatDate';
import { effectiveLastSurveyDate } from '../utils/surveyWindowOverrides';

const TODAY = new Date('2026-04-02');

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
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{facility.region} Focus Areas</Typography>
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

// ─── POC Stage chip styles ────────────────────────────────────────
const POC_STAGE_STYLES: Record<PocStage, { bg: string; color: string; border: string }> = {
  Open:          { bg: 'transparent', color: '#293036', border: '#c4c9ce' },
  Submitted:     { bg: '#EFF6FF',    color: '#1E40AF',  border: '#BFDBFE' },
  Approved:      { bg: '#D1FAE5',    color: '#065F46',  border: '#6EE7B7' },
  'Work Order':  { bg: '#FFFBEB',    color: '#92400E',  border: '#FDE68A' },
  'Final Review':{ bg: '#F5F3FF',    color: '#5B21B6',  border: '#DDD6FE' },
  Rejected:      { bg: '#FEE2E2',    color: '#991B1B',  border: '#FECACA' },
  Closed:        { bg: '#F1F5F9',    color: '#475569',  border: '#E2E8F0' },
};

function pocChip(stage: PocStage | undefined, dateStr?: string) {
  if (!stage) return null;
  const s = POC_STAGE_STYLES[stage];
  const showDate = !!dateStr && (stage === 'Submitted' || stage === 'Approved' || stage === 'Work Order' || stage === 'Closed');
  const label = showDate
    ? (stage === 'Work Order' ? `WO due: ${fmtDate(dateStr!)}` : `${stage} · ${fmtDate(dateStr!)}`)
    : stage;
  return (
    <Chip
      label={label}
      size="small"
      variant="outlined"
      sx={{
        height: 22, fontSize: '0.7rem', fontWeight: 600,
        bgcolor: s.bg,
        color: s.color,
        borderColor: s.border,
        ...(stage !== 'Open' && { bgcolor: s.bg }),
      }}
    />
  );
}

// ─── Plan of Correction Content ───────────────────────────────────
type PocSortCol = 'dueDate' | 'tag' | 'severity' | 'surveyDate';
const SEVERITY_ORDER: Record<CitationSeverity, number> = { IJ: 0, 'Actual Harm': 1, 'Potential Harm': 2, 'No Harm': 3 };

// Compute suggested correction target date based on severity (days after citation date)
const SEVERITY_CORRECTION_DAYS: Record<CitationSeverity, number> = { IJ: 3, 'Actual Harm': 10, 'Potential Harm': 30, 'No Harm': 30 };
function computedDueDate(citationDate: string, severity: CitationSeverity | undefined): string {
  const days = SEVERITY_CORRECTION_DAYS[severity ?? 'Potential Harm'];
  const d = new Date(citationDate);
  d.setDate(d.getDate() + days);
  return toISO(d);
}
function computedPocSubmitDue(citationDate: string): string {
  const d = new Date(citationDate);
  d.setDate(d.getDate() + 10);
  return toISO(d);
}
// Build a believable Plan of Correction narrative from a citation's tag/observation.
// Used for seeded POC communities so drawer details aren't blank.
function synthesizePocResponse(c: AvirCitation): string {
  const subject = c.description ? c.description.replace(/\.$/, '') : `the deficiency cited under ${c.tag}`;
  const obs = (c.observation || '').trim().replace(/\s+/g, ' ');
  const root = obs.length > 0
    ? `On ${fmtDate(c.date)}, the surveyor observed: "${obs.length > 220 ? obs.slice(0, 217) + '…' : obs}"`
    : `The deficiency cited under ${c.tag} was identified during the ${fmtDate(c.date)} survey.`;
  const sevAction = c.severity === 'IJ'
    ? 'Immediate corrective action was taken to remove the jeopardy condition.'
    : c.severity === 'Actual Harm'
    ? 'Corrective action was initiated immediately following the survey exit conference.'
    : 'Corrective action was scheduled within the standard 30-day window.';
  return [
    root,
    `Corrective action: The facility will address ${subject.toLowerCase()} by repairing/replacing affected equipment, retraining staff on the applicable policy, and updating preventive maintenance schedules. ${sevAction}`,
    `Responsible party: Maintenance Director and Administrator, with oversight from the QAPI committee.`,
    `Monitoring: The Administrator will audit compliance weekly for four weeks, then monthly for three months, with findings reported to the QAPI committee. Any recurrence will trigger immediate re-education and root-cause analysis.`,
    `Date of compliance: target completion within the severity-based correction window.`,
  ].join('\n\n');
}

const SEVERITY_CORRECTION_HINT: Record<CitationSeverity, string> = {
  IJ: 'Immediate action required — correction target within 24–72 hours',
  'Actual Harm': 'Recommended correction target within 7–10 days',
  'Potential Harm': 'Recommended correction target within 30 days',
  'No Harm': 'Recommended correction target within 30 days',
};

function PlanOfCorrectionContent({ facility, facCitations }: {
  facility: AvirFacility; facCitations: AvirCitation[];
}) {
  const navigate = useNavigate();
  const pocDue = facility.pocDueDate || '';
  const daysLeft = pocDue ? daysUntil(pocDue) : 0;
  const isOverdue = daysLeft < 0;

  const [stageFilter, setStageFilter] = useState<PocStage | null>(null);
  const [sortBy, setSortBy] = useState<PocSortCol>('dueDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selectedCitation, setSelectedCitation] = useState<AvirCitation | null>(null);
  const [pocWriteMode, setPocWriteMode] = useState(false);
  const [pocDate, setPocDate] = useState('');
  const [pocResponse, setPocResponse] = useState('');
  const [draftIds, setDraftIds] = useState<Set<string>>(new Set());

  const closeDrawer = () => { setSelectedCitation(null); setPocWriteMode(false); };
  const saveAsDraft = () => {
    if (selectedCitation) setDraftIds((prev) => new Set([...prev, selectedCitation.id]));
    closeDrawer();
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!selectedCitation) return;
    if (e.key === 'Escape') { setSelectedCitation(null); return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedCitation((prev) => {
        if (!prev) return prev;
        const list = facCitations
          .filter((c) => !c.pocStatus || c.pocStatus === 'Open' || c.pocStatus === 'Rejected')
          .sort((a, b) => {
            let cmp = 0;
            if (sortBy === 'tag') cmp = a.tag.localeCompare(b.tag);
            else if (sortBy === 'severity') cmp = (SEVERITY_ORDER[a.severity ?? 'No Harm'] ?? 4) - (SEVERITY_ORDER[b.severity ?? 'No Harm'] ?? 4);
            else if (sortBy === 'surveyDate') cmp = a.date.localeCompare(b.date);
            else cmp = a.tag.localeCompare(b.tag);
            return sortDir === 'asc' ? cmp : -cmp;
          });
        const idx = list.findIndex((c) => c.id === prev.id);
        if (idx === -1) return prev;
        const next = e.key === 'ArrowDown' ? list[idx + 1] : list[idx - 1];
        return next ?? prev;
      });
    }
  }, [selectedCitation, facCitations, sortBy, sortDir]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleSort = (col: PocSortCol) => {
    if (sortBy === col) { setSortDir((d) => d === 'asc' ? 'desc' : 'asc'); }
    else { setSortBy(col); setSortDir('asc'); }
  };

  // Count by POC stage — prefer real citation data; fall back to seeded
  // pocStageCounts when the facility has no citation records yet (seeded POC communities).
  const realStageCounts = facCitations.reduce<Record<string, number>>((acc, c) => {
    const s = c.pocStatus || 'Open';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});
  const seededStageCounts = facility.pocStageCounts || {};
  // Use seeded counts whenever the facility has them (POC_FACILITIES entries) —
  // their existing citation rows don't carry proper pocStatus tracking.
  const useSeeded = Object.keys(seededStageCounts).length > 0;
  const stageCounts: Record<string, number> = useSeeded
    ? (seededStageCounts as Record<string, number>)
    : realStageCounts;
  const countFor = (s: string) => stageCounts[s] || 0;

  // Work order sub-counts
  const woOpen = useSeeded
    ? Math.ceil((stageCounts['Work Order'] || 0) / 2)
    : facCitations.filter((c) => c.pocStatus === 'Work Order' && c.workOrder?.status === 'Open').length;
  const woInProgress = useSeeded
    ? Math.floor((stageCounts['Work Order'] || 0) / 2)
    : facCitations.filter((c) => c.pocStatus === 'Work Order' && c.workOrder?.status === 'In Progress').length;

  // Total POC count (real or seeded)
  const totalPocCount = useSeeded
    ? Object.values(stageCounts).reduce((s, n) => s + (n || 0), 0)
    : facCitations.length;

  // For seeded POC facilities, distribute the real citations across stages
  // according to the seeded counts so table rows match pipeline cards.
  const distributedCitations: AvirCitation[] = useSeeded
    ? (() => {
        const stageOrder: PocStage[] = ['Open', 'Submitted', 'Approved', 'Work Order', 'Final Review', 'Closed'];
        // Severities cycled to add visual variety
        const sevCycle: CitationSeverity[] = ['Potential Harm', 'No Harm', 'Actual Harm', 'Potential Harm', 'No Harm', 'IJ', 'Potential Harm'];
        const sorted = [...facCitations].sort((a, b) => a.tag.localeCompare(b.tag));
        const out: AvirCitation[] = [];
        let i = 0;
        let woIdx = 0;
        for (const stage of stageOrder) {
          const n = stageCounts[stage] || 0;
          for (let k = 0; k < n && i < sorted.length; k++, i++) {
            const base = sorted[i];
            const severity: CitationSeverity = base.severity ?? sevCycle[i % sevCycle.length];
            const completion = computedDueDate(base.date, severity);
            // Pre-Open stages have no committed POC yet
            const isOpen = stage === 'Open';
            const enriched: AvirCitation = {
              ...base,
              pocStatus: stage,
              severity,
              pocResponse: isOpen ? base.pocResponse : (base.pocResponse || synthesizePocResponse({ ...base, severity })),
              pocCompletionDate: isOpen ? base.pocCompletionDate : (base.pocCompletionDate || completion),
            };
            // Synthesize a work order for Work Order / Final Review / Closed stages
            if ((stage === 'Work Order' || stage === 'Final Review' || stage === 'Closed') && !enriched.workOrder) {
              woIdx++;
              const woStatus = stage === 'Closed' ? 'Completed' : stage === 'Final Review' ? 'Completed' : (woIdx % 2 === 0 ? 'In Progress' : 'Open');
              enriched.workOrder = {
                id: `#${5300 + (facility.id.length * 7 % 90) + woIdx}`,
                status: woStatus as WorkOrder['status'],
                title: `Address ${base.tag}: ${base.description?.slice(0, 60) || 'corrective action'}`,
                location: 'Facility-wide',
                assignee: ['Marcus Webb', 'Carlos Vega', 'Sarah Nguyen'][woIdx % 3],
                dueDate: completion,
              };
            }
            out.push(enriched);
          }
        }
        return out;
      })()
    : facCitations;

  const allActiveCitations = distributedCitations.filter((c) => !c.pocStatus || ['Open', 'Rejected', 'Submitted', 'Approved', 'Work Order', 'Final Review'].includes(c.pocStatus));
  const closedCitations = distributedCitations.filter((c) => c.pocStatus === 'Closed');
  const openCitations = (stageFilter === 'Closed'
    ? closedCitations
    : stageFilter
    ? allActiveCitations.filter((c) => c.pocStatus === stageFilter || (!c.pocStatus && stageFilter === 'Open'))
    : allActiveCitations
  ).sort((a, b) => {
    let cmp = 0;
    if (sortBy === 'tag') cmp = a.tag.localeCompare(b.tag);
    else if (sortBy === 'severity') cmp = (SEVERITY_ORDER[a.severity ?? 'No Harm'] ?? 4) - (SEVERITY_ORDER[b.severity ?? 'No Harm'] ?? 4);
    else if (sortBy === 'surveyDate') cmp = a.date.localeCompare(b.date);
    else if (sortBy === 'dueDate') {
      cmp = (a.pocCompletionDate || '').localeCompare(b.pocCompletionDate || '');
      const primaryResult = sortDir === 'asc' ? cmp : -cmp;
      if (primaryResult !== 0) return primaryResult;
      // Secondary: always most severe first
      return (SEVERITY_ORDER[a.severity ?? 'No Harm'] ?? 4) - (SEVERITY_ORDER[b.severity ?? 'No Harm'] ?? 4);
    }
    else cmp = a.tag.localeCompare(b.tag);
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const SEVERITY_STYLES: Record<CitationSeverity, { bg: string; color: string; label: string }> = {
    'IJ':             { bg: '#FEE2E2', color: '#991B1B', label: 'J–Immediate Jeopardy' },
    'Actual Harm':    { bg: '#FFEDD5', color: '#9A3412', label: 'G–Actual Harm' },
    'Potential Harm': { bg: '#FEF9C3', color: '#854D0E', label: 'F–Potential Harm' },
    'No Harm':        { bg: '#F1F5F9', color: '#475569', label: 'C–No Harm' },
  };

  const stages: Array<{
    key: PocStage; label: string; count: number; sub: ReactNode; overdue?: boolean;
  }> = [
    {
      key: 'Open', label: 'Open', count: countFor('Open'),
      sub: <Typography sx={{ fontSize: '12px', color: '#64748B', mt: 0.25 }}>{countFor('Rejected')} rejected POCs</Typography>,
      overdue: isOverdue,
    },
    {
      key: 'Submitted', label: 'Submitted', count: countFor('Submitted'),
      sub: <Typography sx={{ fontSize: '12px', color: '#64748B', mt: 0.25 }}>Awaiting CMS review</Typography>,
    },
    {
      key: 'Approved', label: 'Approved POCs', count: countFor('Approved'),
      sub: <Typography sx={{ fontSize: '12px', color: '#64748B', mt: 0.25 }}>Ready for work orders</Typography>,
    },
    {
      key: 'Work Order', label: 'Work Orders', count: countFor('Work Order'),
      sub: (
        <Typography sx={{ fontSize: '12px', color: '#64748B', mt: 0.25 }}>
          <Box component="span" sx={{ fontWeight: 700, color: '#293036' }}>{woOpen}</Box>{' open · '}
          <Box component="span" sx={{ fontWeight: 700, color: '#293036' }}>{woInProgress}</Box>{' in progress'}
        </Typography>
      ),
      overdue: false,
    },
    {
      key: 'Final Review', label: 'Final review', count: countFor('Final Review'),
      sub: <Typography sx={{ fontSize: '12px', color: '#64748B', mt: 0.25 }}>Ready to review internally</Typography>,
      overdue: false,
    },
  ];

  return (
    <Box sx={{ maxWidth: 1136, mx: 'auto' }}>
      {/* POC Due Date Banner */}
      <Paper sx={{
        px: 2.5, py: 1.5, mb: 2, borderRadius: '8px',
        border: `1px solid ${isOverdue ? '#FECACA' : '#BFDBFE'}`,
        bgcolor: isOverdue ? '#FEF2F2' : '#EFF6FF',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <CalendarTodayIcon sx={{ fontSize: 18, color: isOverdue ? '#991B1B' : '#1E40AF' }} />
          <Box>
            <Typography sx={{ fontSize: '14px', fontWeight: 700, color: isOverdue ? '#991B1B' : '#1E40AF' }}>
              Plan of Correction {isOverdue ? 'overdue' : 'due'} {fmtDate(pocDue)}
            </Typography>
            <Typography sx={{ fontSize: '12px', color: isOverdue ? '#991B1B' : '#1E40AF', opacity: 0.85 }}>
              {isOverdue
                ? `${Math.abs(daysLeft)} days past due · Surveyed ${fmtDate(facility.lastSurveyDate)}`
                : `${daysLeft} days remaining · Surveyed ${fmtDate(facility.lastSurveyDate)}`}
            </Typography>
          </Box>
        </Box>
        <Chip
          label={isOverdue ? 'Overdue' : 'In Progress'}
          sx={{ bgcolor: isOverdue ? '#991B1B' : '#1E40AF', color: '#fff', fontWeight: 700, fontSize: '0.8rem' }}
        />
      </Paper>

      {/* Combined card: pipeline + citations table */}
      <Paper elevation={0} sx={{ border: '1px solid #e0e4e7', borderRadius: '8px', overflow: 'hidden' }}>
        {/* Header */}
        <Box sx={{ px: 2.5, pt: 2.5, pb: 0 }}>
          <Typography variant="h6" sx={{ mb: 0.25 }}>Plan of Corrections</Typography>
          <Button variant="text" size="small" onClick={() => setStageFilter(null)} sx={{ color: '#0065BD', fontWeight: 600, fontSize: '0.875rem', p: 0, minWidth: 0, mb: 1.5 }}>
            View all ({totalPocCount})
          </Button>

          {/* Pipeline cards */}
          <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#293036', fontFamily: 'Inter', lineHeight: '20px', fontStyle: 'normal', fontFeatureSettings: "'liga' off, 'clig' off", mb: 0.75 }}>
            Filter by Status
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, mb: 1 }}>
            {stages.map((stage) => {
              const isSelected = stageFilter === stage.key;
              return (
                <Box key={stage.key} onClick={() => setStageFilter(isSelected ? null : stage.key)} sx={{
                  flex: 1,
                  border: `1px solid ${isSelected ? '#0065BD' : '#e0e4e7'}`,
                  borderRadius: '8px',
                  p: 1.5,
                  bgcolor: isSelected ? '#F0F7FF' : 'white',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s, background 0.15s',
                  '&:hover': { borderColor: isSelected ? '#0065BD' : '#b0b8c1', bgcolor: isSelected ? '#F0F7FF' : '#fafbfc' },
                }}>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#293036', mb: 0.5 }}>
                    {stage.label}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                    <Typography sx={{ fontSize: '24px', fontWeight: 800, color: '#293036', lineHeight: 1 }}>
                      {stage.count}
                    </Typography>
                    {stage.overdue && (
                      <Chip label="overdue" size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: '#FEE2E2', color: '#991B1B' }} />
                    )}
                  </Box>
                  {stage.sub}
                </Box>
              );
            })}
          </Box>

          {/* Closed POCs link */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pb: 1.5 }}>
            <Button
              variant="text"
              size="small"
              onClick={() => setStageFilter(stageFilter === 'Closed' ? null : 'Closed')}
              sx={{ color: stageFilter === 'Closed' ? '#0D47A1' : '#0065BD', fontWeight: stageFilter === 'Closed' ? 700 : 600, fontSize: '0.8rem', p: 0, textDecoration: stageFilter === 'Closed' ? 'underline' : 'none' }}
            >
              Closed POCs ({countFor('Closed')})
            </Button>
          </Box>
        </Box>

        {/* Citations section label */}
        <Box sx={{ px: 2.5, py: 1.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '16px', color: '#293036' }}>
            {stageFilter === null ? 'All POCs' :
             stageFilter === 'Final Review' ? openCitations.length + ' ready for review' :
             stageFilter === 'Closed' ? openCitations.length + ' closed POC' + (openCitations.length !== 1 ? 's' : '') :
             openCitations.length + ' ' + stageFilter.toLowerCase() + ' POC' + (openCitations.length !== 1 ? 's' : '')}
          </Typography>
        </Box>

        <TableContainer sx={{ bgcolor: '#e0e4e7' }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#e0e4e7' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#293036', bgcolor: '#e0e4e7', width: 110, py: '6px', px: 2, whiteSpace: 'nowrap', textAlign: 'right' }}>
                  <TableSortLabel
                    active={sortBy === 'dueDate'}
                    direction={sortBy === 'dueDate' ? sortDir : 'asc'}
                    onClick={() => handleSort('dueDate')}
                    sx={{ '& .MuiTableSortLabel-icon': { fontSize: 14 }, flexDirection: 'row-reverse', gap: 0.25 }}
                  >
                    {stageFilter === 'Open' ? 'Plan due' :
                     stageFilter === 'Closed' ? 'Completed' :
                     stageFilter ? 'Correction due' :
                     'Next due date'}
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#293036', bgcolor: '#e0e4e7', py: '6px', px: 2, whiteSpace: 'nowrap' }}>
                  <TableSortLabel
                    active={sortBy === 'tag'}
                    direction={sortBy === 'tag' ? sortDir : 'asc'}
                    onClick={() => handleSort('tag')}
                    sx={{ '& .MuiTableSortLabel-icon': { fontSize: 14 } }}
                  >
                    Tag / Description
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#293036', bgcolor: '#e0e4e7', width: 160, py: '6px', px: 2, whiteSpace: 'nowrap' }}>
                  <TableSortLabel
                    active={sortBy === 'severity'}
                    direction={sortBy === 'severity' ? sortDir : 'asc'}
                    onClick={() => handleSort('severity')}
                    sx={{ '& .MuiTableSortLabel-icon': { fontSize: 14 } }}
                  >
                    Severity
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#293036', bgcolor: '#e0e4e7', width: 110, py: '6px', px: 2, whiteSpace: 'nowrap', textAlign: 'right' }}>
                  <TableSortLabel
                    active={sortBy === 'surveyDate'}
                    direction={sortBy === 'surveyDate' ? sortDir : 'asc'}
                    onClick={() => handleSort('surveyDate')}
                    sx={{ '& .MuiTableSortLabel-icon': { fontSize: 14 }, flexDirection: 'row-reverse', gap: 0.25 }}
                  >
                    Survey date
                  </TableSortLabel>
                </TableCell>
                {(stageFilter === 'Work Order' || stageFilter === 'Final Review') && (
                  <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#293036', bgcolor: '#e0e4e7', width: 160, py: '6px', px: 2, whiteSpace: 'nowrap' }}>
                    Work Order
                  </TableCell>
                )}
                <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#293036', bgcolor: '#e0e4e7', width: 110, py: '6px', px: 2, whiteSpace: 'nowrap' }}>
                  POC status
                </TableCell>
                <TableCell sx={{ bgcolor: '#e0e4e7', width: 40, px: 0 }} />
              </TableRow>
            </TableHead>
            <TableBody sx={{ bgcolor: 'white' }}>
              {openCitations.map((c, idx) => {
                const isLast = idx === openCitations.length - 1;
                const sev = c.severity ? SEVERITY_STYLES[c.severity] : SEVERITY_STYLES['Potential Harm'];
                const hasSetDate = !!c.pocCompletionDate;
                const dueDateStr = hasSetDate ? c.pocCompletionDate! : computedDueDate(c.date, c.severity);
                const daysRemaining = daysUntil(dueDateStr);
                const isOverdueRow = daysRemaining < 0;
                const isDueSoon = !isOverdueRow && daysRemaining <= 7;
                const dueCellBg = isOverdueRow ? '#FEE2E2' : isDueSoon ? '#FFF7ED' : undefined;
                return (
                  <TableRow key={c.id} hover onClick={() => {
                    setSelectedCitation(c);
                    setPocWriteMode(true);
                    setPocResponse(c.pocResponse || '');
                    setPocDate(c.pocCompletionDate || '');
                  }} sx={{
                    cursor: 'pointer',
                    bgcolor: selectedCitation?.id === c.id ? '#EBF4FF' : 'transparent',
                    '&:hover': { bgcolor: selectedCitation?.id === c.id ? '#EBF4FF' : '#F0F7FF' },
                    ...(isLast && { '& td': { borderBottom: 'none' } }),
                  }}>
                    <TableCell sx={{ px: 2, py: '10px', textAlign: 'right', bgcolor: dueCellBg }}>
                      <Typography sx={{ fontSize: '13px', color: isOverdueRow ? '#991B1B' : isDueSoon ? '#92400E' : '#293036', fontStyle: hasSetDate ? 'normal' : 'italic' }}>
                        {fmtDate(dueDateStr)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ px: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, overflow: 'hidden' }}>
                        <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#293036', fontFamily: 'monospace', flexShrink: 0 }}>{c.tag}</Typography>
                        <Typography sx={{ fontSize: '13px', color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {c.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ px: 2 }}>
                      <Chip label={sev.label} size="small" sx={{ bgcolor: sev.bg, color: sev.color, fontWeight: 600, height: 22, fontSize: '0.7rem', borderRadius: '4px' }} />
                    </TableCell>
                    <TableCell sx={{ px: 2, textAlign: 'right' }}>
                      <Typography sx={{ fontSize: '13px', color: '#293036' }}>{fmtDate(c.date)}</Typography>
                    </TableCell>
                    {(stageFilter === 'Work Order' || stageFilter === 'Final Review') && (
                      <TableCell sx={{ px: 2 }}>
                        {c.workOrder ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Chip
                              label={c.workOrder.status}
                              size="small"
                              variant={c.workOrder.status === 'Open' ? 'outlined' : 'filled'}
                              sx={c.workOrder.status === 'Open'
                                ? { height: 22, fontSize: '0.7rem', color: '#3e4751', borderColor: '#e0e4e7', bgcolor: '#f7f8f9', borderRadius: '12px' }
                                : { height: 22, fontSize: '0.7rem', color: '#293036', bgcolor: '#e0e4e7', borderRadius: '12px' }
                              }
                            />
                            <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#0065BD' }}>{c.workOrder.id}</Typography>
                          </Box>
                        ) : (
                          <Typography sx={{ fontSize: '13px', color: '#b0b8c1' }}>—</Typography>
                        )}
                      </TableCell>
                    )}
                    <TableCell sx={{ px: 2 }}>
                      {draftIds.has(c.id)
                        ? <Chip label="Open: Draft" size="small" variant="outlined" sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600, color: '#1565C0', borderColor: '#BFDBFE', bgcolor: '#EFF6FF' }} />
                        : pocChip(c.pocStatus as PocStage, c.pocCompletionDate)}
                    </TableCell>
                    <TableCell sx={{ px: 1 }}>
                      <ChevronRightIcon sx={{ fontSize: 18, color: '#8492a1' }} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Citation Detail Drawer — expands to two-column POC write mode */}
      <Drawer
        anchor="right"
        open={selectedCitation !== null}
        onClose={closeDrawer}
        PaperProps={{
          sx: {
            width: '50vw',
            maxWidth: 640,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {selectedCitation && (() => {
          const sc = selectedCitation;
          const sev = sc.severity ? SEVERITY_STYLES[sc.severity] : SEVERITY_STYLES['Potential Harm'];
          return (
            <>
              {/* Header */}
              <Box sx={{ px: 3, pt: 2.5, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e0e4e7', flexShrink: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {pocWriteMode && (
                    <IconButton size="small" onClick={() => setPocWriteMode(false)} sx={{ color: '#5c6874', mr: 0.5 }}>
                      <ArrowBackIcon fontSize="small" />
                    </IconButton>
                  )}
                  <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#1A1A1A' }}>
                    {pocWriteMode
                      ? (sc.pocStatus === 'Submitted' || sc.pocStatus === 'Approved' || sc.pocStatus === 'Work Order' || sc.pocStatus === 'Final Review' || sc.pocStatus === 'Closed'
                          ? 'Plan of Correction'
                          : 'Write Plan of Correction')
                      : 'Citation details'}
                  </Typography>
                </Box>
                <IconButton size="small" onClick={closeDrawer} sx={{ color: '#5c6874' }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* Scrollable body — single column, stacked */}
              <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>

                {/* Facility info */}
                <Box>
                  <Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#1A1A1A', lineHeight: 1.2 }}>
                    {facility.name}
                  </Typography>
                  <Typography sx={{ fontSize: '13px', color: '#555', fontStyle: 'italic', mt: 0.5, mb: 1.5 }}>
                    {facility.state} · {facility.region}
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: '#e0e4e7' }} />

                {/* Citation details subheader + meta */}
                <Box>
                  <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#293036', mb: 1.5 }}>
                    Citation Details
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 4 }}>
                    <Box>
                      <Typography sx={{ fontSize: '12px', color: '#757575', fontWeight: 500, mb: 0.25 }}>Survey date</Typography>
                      <Typography sx={{ fontSize: '14px', color: '#1A1A1A' }}>{fmtDate(sc.date)}</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '12px', color: '#757575', fontWeight: 500, mb: 0.25 }}>Surveyor</Typography>
                      <Typography sx={{ fontSize: '14px', color: '#1A1A1A' }}>{sc.surveyor || '—'}</Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Citation card */}
                <Box sx={{ bgcolor: '#F5F5F5', borderRadius: '8px', p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#1A1A1A', fontFamily: 'monospace' }}>
                      {sc.tag}
                    </Typography>
                    <Chip label={sev.label} size="small" sx={{ bgcolor: sev.bg, color: sev.color, fontWeight: 600, fontSize: '0.7rem', height: 22, borderRadius: '12px', border: `1px solid ${sev.color}33` }} />
                  </Box>
                  <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#1A1A1A', mb: 1.5 }}>
                    {sc.description}
                  </Typography>
                  <Typography sx={{ fontSize: '12px', fontWeight: 500, color: '#757575', mb: 0.5 }}>Observation</Typography>
                  <Typography sx={{ fontSize: '13px', color: '#293036', lineHeight: 1.6 }}>
                    {sc.observation || 'No observation text recorded for this citation.'}
                  </Typography>
                </Box>

                {/* Actions — shown in detail mode only */}
                {!pocWriteMode && (
                  <Box>
                    <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#1A1A1A', mb: 1.5 }}>Actions to take</Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<EditNoteIcon />}
                      onClick={() => setPocWriteMode(true)}
                      sx={{ bgcolor: '#1565C0', color: '#fff', '&:hover': { bgcolor: '#0D47A1' }, borderRadius: '6px', py: 1.5, fontWeight: 600, mb: 1, '& .MuiButton-startIcon': { color: '#fff' } }}
                    >
                      Write POC
                    </Button>
                    <Button variant="text" fullWidth sx={{ color: '#1565C0', fontWeight: 500 }}>
                      Request waiver
                    </Button>
                  </Box>
                )}

                {/* POC section — stacked below citation detail */}
                {pocWriteMode && (() => {
                  const isReadOnly = sc.pocStatus === 'Submitted' || sc.pocStatus === 'Approved' || sc.pocStatus === 'Work Order' || sc.pocStatus === 'Final Review' || sc.pocStatus === 'Closed';
                  const isWorkOrder = sc.pocStatus === 'Work Order' || sc.pocStatus === 'Final Review';
                  const wo = sc.workOrder as WorkOrder | undefined;
                  const woIsCompleted = wo?.status === 'Completed';
                  const woStatusColor = woIsCompleted ? '#ffffff' : wo?.status === 'In Progress' ? '#1565C0' : '#374151';
                  const woStatusBg = woIsCompleted ? '#693a77' : wo?.status === 'In Progress' ? '#EFF6FF' : '#F1F5F9';
                  const woStatusBorder = woIsCompleted ? '#693a77' : wo?.status === 'In Progress' ? '#BFDBFE' : '#CBD5E1';
                  const woBorderColor = woIsCompleted ? '#824893' : wo?.status === 'In Progress' ? '#1565C0' : '#8492a1';
                  const woBgColor = woIsCompleted ? '#f8f4fa' : '#f7f8f9';
                  return isReadOnly ? (
                    /* ── Approved / Work Order: static read-only POC view ── */
                    <>
                      <Divider sx={{ borderColor: '#e0e4e7' }} />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#293036' }}>
                          Plan of Correction
                        </Typography>
                        {(() => {
                          const status = sc.pocStatus as PocStage;
                          const stageDate = fmtDate(sc.pocCompletionDate || '4/8/2026');
                          const styles: Record<string, { bg: string; color: string; border: string; label: string }> = {
                            Submitted:     { bg: '#EFF6FF', color: '#1E40AF', border: '#BFDBFE', label: `Submitted · ${stageDate}` },
                            Approved:      { bg: '#D1FAE5', color: '#065F46', border: '#6EE7B7', label: `Approved · ${stageDate}` },
                            'Work Order':  { bg: '#F1F5F9', color: '#374151', border: '#CBD5E1', label: `Work Order · ${stageDate}` },
                            'Final Review':{ bg: '#F5F3FF', color: '#6B21A8', border: '#DDD6FE', label: `Final Review · ${stageDate}` },
                            Closed:        { bg: '#F1F5F9', color: '#374151', border: '#CBD5E1', label: `Closed · ${stageDate}` },
                          };
                          const s = styles[status] || styles.Approved;
                          return <Chip label={s.label} size="small" sx={{ bgcolor: s.bg, color: s.color, border: `1px solid ${s.border}`, fontWeight: 600, fontSize: '0.7rem', height: 22, borderRadius: '12px' }} />;
                        })()}
                      </Box>

                      {/* Due date + Submitted by */}
                      <Box sx={{ display: 'flex', gap: 4 }}>
                        <Box>
                          <Typography sx={{ fontSize: '12px', color: '#757575', fontWeight: 500, mb: 0.25 }}>Due date</Typography>
                          <Typography sx={{ fontSize: '14px', color: '#1A1A1A' }}>{fmtDate(sc.pocCompletionDate || '')}</Typography>
                        </Box>
                        <Box>
                          <Typography sx={{ fontSize: '12px', color: '#757575', fontWeight: 500, mb: 0.25 }}>Submitted by</Typography>
                          <Typography sx={{ fontSize: '14px', color: '#1A1A1A' }}>First Last</Typography>
                        </Box>
                      </Box>

                      {/* Response text */}
                      <Box>
                        <Box sx={{ bgcolor: '#F5F5F5', borderRadius: '8px', p: 2 }}>
                          <Typography sx={{ fontSize: '13px', color: '#293036', lineHeight: 1.7 }}>
                            {sc.pocResponse || '—'}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ borderColor: '#e0e4e7' }} />

                      {/* Work Order section */}
                      <Box>
                        <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#293036', mb: 1.5 }}>
                          Work Order
                        </Typography>

                        {isWorkOrder && wo ? (
                          /* ── Attached work order card ── */
                          <Box sx={{
                            bgcolor: woBgColor, borderLeft: `4px solid ${woBorderColor}`,
                            borderRadius: '4px', p: 2, display: 'flex', flexDirection: 'column', gap: 1,
                          }}>
                            {/* Top row: status chip + WO# + due date */}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip label={wo.status} size="small" sx={{ bgcolor: woStatusBg, color: woStatusColor, border: woIsCompleted ? 'none' : `1px solid ${woStatusBorder}`, fontWeight: 500, fontSize: '0.7rem', height: 22, borderRadius: '12px' }} />
                                <Typography sx={{ fontSize: '12px', color: '#3e4751' }}>{wo.id}</Typography>
                              </Box>
                              <Typography sx={{ fontSize: '14px', color: '#3e4751', letterSpacing: '-0.08px' }}>Due date: {fmtDate(wo.dueDate)}</Typography>
                            </Box>
                            {/* Title */}
                            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#3e4751', lineHeight: 1.4 }}>
                              {wo.title}
                            </Typography>
                            {/* Location + assignee + button */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                              <Typography sx={{ fontSize: '14px', color: '#3e4751' }}>{wo.location}</Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography sx={{ fontSize: '14px', color: '#3e4751' }}>Assigned to: {wo.assignee}</Typography>
                                <Button size="small" variant="contained" endIcon={<ChevronRightIcon sx={{ fontSize: 16 }} />}
                                  sx={{ bgcolor: '#E0E4E7', color: '#293036', '&:hover': { bgcolor: '#CBD5E1' }, boxShadow: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600, textTransform: 'none', px: 1.5, py: 0.5 }}>
                                  View details
                                </Button>
                              </Box>
                            </Box>
                          </Box>
                        ) : (
                          /* ── Approved: no WO yet — action buttons ── */
                          <>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                              <Button startIcon={<AutoAwesomeIcon sx={{ fontSize: 16 }} />} size="small"
                                sx={{ justifyContent: 'flex-start', px: 1, py: 0.75, color: '#1565C0', fontWeight: 500, fontSize: '13px', textTransform: 'none', borderRadius: '6px', '&:hover': { bgcolor: '#EFF6FF' } }}>
                                New work order
                              </Button>
                            </Box>
                            <Divider sx={{ my: 1, borderColor: '#e0e4e7' }} />
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                              <Button startIcon={<AttachFileIcon sx={{ fontSize: 16 }} />} size="small"
                                sx={{ justifyContent: 'flex-start', px: 1, py: 0.75, color: '#293036', fontWeight: 500, fontSize: '13px', textTransform: 'none', borderRadius: '6px', '&:hover': { bgcolor: '#f5f5f5' } }}>
                                Attach work order
                              </Button>
                            </Box>
                            <Divider sx={{ my: 1, borderColor: '#e0e4e7' }} />
                            <Button startIcon={<CheckCircleOutlineIcon sx={{ fontSize: 16 }} />} size="small"
                              sx={{ justifyContent: 'flex-start', px: 1, py: 0.75, color: '#065F46', fontWeight: 600, fontSize: '13px', textTransform: 'none', borderRadius: '6px', '&:hover': { bgcolor: '#D1FAE5' } }}>
                              Mark as complete
                            </Button>
                          </>
                        )}
                      </Box>
                    </>
                  ) : (
                    /* ── Open/Submitted: editable form ── */
                    <>
                      <Divider sx={{ borderColor: '#e0e4e7' }} />

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                        <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#293036' }}>
                          Plan of Correction
                        </Typography>
                        <Chip
                          label={`POC due ${fmtDate(computedPocSubmitDue(sc.date))}`}
                          size="small"
                          sx={{ bgcolor: '#FEF9C3', color: '#854D0E', border: '1px solid #FDE68A', fontWeight: 600, fontSize: '0.7rem', height: 22, borderRadius: '12px' }}
                        />
                      </Box>

                      {/* Correction target */}
                      <Box>
                        <Typography sx={{ fontSize: '13px', color: '#757575', mb: 0.75 }}>Correction target</Typography>
                        <TextField type="date" value={pocDate} onChange={(e) => setPocDate(e.target.value)} size="small" sx={{ width: 170 }} InputLabelProps={{ shrink: true }} />
                        {sc.severity && (
                          <Typography sx={{ fontSize: '11px', color: '#8492a1', mt: 0.75, lineHeight: 1.4 }}>
                            {SEVERITY_CORRECTION_HINT[sc.severity]}
                          </Typography>
                        )}
                      </Box>

                      {/* Facility Response */}
                      <Box>
                        <Typography sx={{ fontSize: '13px', color: '#757575', mb: 0.75 }}>Facility Response</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, px: 1, py: 0.5, border: '1px solid #d1d5db', borderBottom: '1px solid #e0e4e7', borderRadius: '4px 4px 0 0', bgcolor: '#fafafa' }}>
                          {[
                            { icon: <FormatBoldIcon sx={{ fontSize: 16 }} />, label: 'Bold' },
                            { icon: <FormatItalicIcon sx={{ fontSize: 16 }} />, label: 'Italic' },
                            { icon: <FormatUnderlinedIcon sx={{ fontSize: 16 }} />, label: 'Underline' },
                          ].map(({ icon, label }) => (
                            <IconButton key={label} size="small" title={label} sx={{ color: '#4b5563', borderRadius: '4px', '&:hover': { bgcolor: '#e5e7eb' } }}>{icon}</IconButton>
                          ))}
                          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 18, alignSelf: 'center' }} />
                          {[
                            { icon: <FormatListBulletedIcon sx={{ fontSize: 16 }} />, label: 'Bullet list' },
                            { icon: <FormatListNumberedIcon sx={{ fontSize: 16 }} />, label: 'Numbered list' },
                          ].map(({ icon, label }) => (
                            <IconButton key={label} size="small" title={label} sx={{ color: '#4b5563', borderRadius: '4px', '&:hover': { bgcolor: '#e5e7eb' } }}>{icon}</IconButton>
                          ))}
                          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 18, alignSelf: 'center' }} />
                          <IconButton size="small" title="Link" sx={{ color: '#4b5563', borderRadius: '4px', '&:hover': { bgcolor: '#e5e7eb' } }}>
                            <LinkIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                          <Box sx={{ ml: 'auto' }}>
                            <Button
                              size="small"
                              startIcon={<AutoAwesomeIcon sx={{ fontSize: 14 }} />}
                              onClick={() => setPocResponse(synthesizePocResponse({ ...sc, severity: sc.severity ?? 'Potential Harm' }))}
                              sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', bgcolor: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: '6px', px: 1.25, py: 0.25, '&:hover': { bgcolor: '#E2E8F0' }, textTransform: 'none' }}
                            >
                              Generate
                            </Button>
                          </Box>
                        </Box>
                        <TextField multiline minRows={6} fullWidth placeholder="Describe the corrective action the facility will take…" value={pocResponse} onChange={(e) => setPocResponse(e.target.value)}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '0 0 4px 4px', alignItems: 'flex-start', '& fieldset': { borderColor: '#d1d5db', borderTop: 'none' }, '&:hover fieldset': { borderColor: '#9ca3af' }, '&.Mui-focused fieldset': { borderColor: '#1565C0' } } }}
                        />
                        {pocResponse.trim().length > 0 && (
                          <Button
                            fullWidth
                            variant="contained"
                            size="small"
                            startIcon={<ContentCopyIcon sx={{ fontSize: 15 }} />}
                            onClick={() => navigator.clipboard.writeText(pocResponse)}
                            disableElevation
                            sx={{ mt: 1, fontSize: '0.8rem', fontWeight: 600, bgcolor: '#1565C0', color: '#fff', textTransform: 'none', '&:hover': { bgcolor: '#0D47A1' } }}
                          >
                            Copy response
                          </Button>
                        )}
                      </Box>

                    </>
                  );
                })()}
              </Box>

              {/* Footer */}
              {pocWriteMode && (sc.pocStatus === 'Submitted' || sc.pocStatus === 'Approved' || sc.pocStatus === 'Work Order' || sc.pocStatus === 'Final Review' || sc.pocStatus === 'Closed') ? (
                /* ── Approved / Work Order / Final Review footer: Close only ── */
                <Box sx={{ px: 3, py: 2, borderTop: '1px solid #e0e4e7', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  <Button variant="contained" onClick={closeDrawer} sx={{ bgcolor: '#E0E0E0', color: '#212121', '&:hover': { bgcolor: '#BDBDBD' }, boxShadow: 'none', borderRadius: '6px', fontWeight: 500, px: 3 }}>
                    Close
                  </Button>
                </Box>
              ) : pocWriteMode ? (
                /* ── Editable footer: Cancel / Submit plan ── */
                <Box sx={{ px: 3, py: 2, borderTop: '1px solid #e0e4e7', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                  <Button variant="outlined" onClick={closeDrawer} sx={{ borderColor: '#d1d5db', color: '#374151', borderRadius: '6px', fontWeight: 500, px: 3 }}>
                    Cancel
                  </Button>
                  {(() => {
                    const hasResponse = pocResponse.trim().length > 0;
                    const hasDate = pocDate.trim().length > 0;
                    const canSubmit = hasResponse && hasDate;
                    return (
                      <Button
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        disabled={!canSubmit}
                        onClick={closeDrawer}
                        sx={{ bgcolor: '#1565C0', color: '#fff', '&:hover': { bgcolor: '#0D47A1' }, '&.Mui-disabled': { bgcolor: '#e0e4e7', color: '#8492a1' }, borderRadius: '6px', fontWeight: 600, px: 3 }}
                      >
                        Submit plan
                      </Button>
                    );
                  })()}
                </Box>
              ) : (
                /* ── Non-write-mode footer: Close only ── */
                <Box sx={{ px: 3, py: 2, borderTop: '1px solid #e0e4e7', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  <Button variant="contained" onClick={closeDrawer} sx={{ bgcolor: '#E0E0E0', color: '#212121', '&:hover': { bgcolor: '#BDBDBD' }, boxShadow: 'none', borderRadius: '6px', fontWeight: 500, px: 3 }}>
                    Close
                  </Button>
                </Box>
              )}
            </>
          );
        })()}
      </Drawer>
    </Box>
  );
}

// ─── Summary Tab ──────────────────────────────────────────────────
function SummaryTab({ facility, facCitations, facSurveys }: {
  facility: AvirFacility; facCitations: AvirCitation[]; facSurveys: AvirSurvey[];
}) {
  if (facility.pocMode) {
    return <PlanOfCorrectionContent facility={facility} facCitations={facCitations} />;
  }
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
        bordered
        title={facility.name.replace('Avir at ', '')}
        subtitle={
          <Typography sx={{ fontSize: '16px', fontStyle: 'italic', color: '#293036', lineHeight: 1.5, letterSpacing: '-0.176px' }}>
            {facility.state} • {facility.region}
          </Typography>
        }
        backLabel="Back"
        onBack={() => navigate(-1)}
        tabs={[
          { label: 'Summary', value: 0 },
          { label: 'Trends', value: 1 },
          { label: 'Archive', value: 2 },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        actions={
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" color="inherit" disableElevation startIcon={<UploadFileIcon />}>Upload survey</Button>
            <Button variant="contained" color="inherit" disableElevation startIcon={<EditNoteIcon />}>Mock survey</Button>
            <Button variant="contained" color="inherit" disableElevation startIcon={<EventAvailableIcon />} endIcon={<ArrowForwardIcon sx={{ fontSize: '16px !important' }} />}>Site visit</Button>
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
      {activeTab === 1 && <TrendsTab />}
      {activeTab === 2 && (
        <SurveyHistoryTab
          facSurveys={facSurveys}
          facCitations={facCitations}
          facilityId={facility.id}
        />
      )}
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
          {['K', 'E'].filter((t) => tagTypeGroups[t]?.length).map((type) => (
            <Box key={type}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip label={type === 'K' ? 'K-Tags' : 'E-Tags'} size="small" sx={{
                  bgcolor: type === 'K' ? '#FEE2E2' : '#FEF9C3',
                  color:   type === 'K' ? '#991B1B' : '#854D0E',
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
                  ['Tag Type', selectedCitation.tagType === 'K' ? 'K-Tag (Life Safety)' : 'E-Tag (Emergency)'],
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
