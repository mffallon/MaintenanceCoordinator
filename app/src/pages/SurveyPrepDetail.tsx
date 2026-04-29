import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Chip, Divider, LinearProgress,
  ToggleButtonGroup, ToggleButton,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EventNoteIcon from '@mui/icons-material/EventNote';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PageHeader from '../components/PageHeader';
import { facilities, surveys, citations, tagDescriptions } from '../data/avir-data';
import { fmtDate } from '../utils/formatDate';
import { effectiveLastSurveyDate } from '../utils/surveyWindowOverrides';

const TODAY = new Date('2026-04-02');

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

// Derive documentation gaps from citation data
function deriveDocGaps(totalCitations: number, facilityId: string, facCitations: typeof citations) {
  // Tasks: open/pending citations without resolution
  const openCits = facCitations.filter((c) => c.status === 'Open' || c.status === 'Pending');
  const tasks = openCits.length;

  // Logs: simulate based on citation count
  const seed = facilityId.length % 5;
  const logs = totalCitations > 10 ? seed + 2 : totalCitations > 0 ? seed : 0;

  // Docs: missing plan of correction docs
  const docs = totalCitations > 15 ? 3 : totalCitations > 5 ? 1 : 0;

  return { tasks, logs, docs };
}

export default function SurveyPrepDetail() {
  const { facilityId } = useParams<{ facilityId: string }>();
  const navigate = useNavigate();
  const [trendPeriod, setTrendPeriod] = useState<3 | 6 | 12>(12);

  const facility = facilities.find((f) => f.id === facilityId);
  if (!facility) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5">Community not found</Typography>
      </Box>
    );
  }

  const facSurveys = surveys
    .filter((s) => s.facilityId === facility.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  const facCitations = citations.filter((c) => c.facilityId === facility.id);
  const lastSurvey = facSurveys[0];

  // Survey window — use same overrides as Survey Planning page for consistency
  const last = new Date(effectiveLastSurveyDate(facility.id, facility.lastSurveyDate || TODAY.toISOString()));
  const windowStart = toISO(addMonths(last, 9));
  const windowEnd   = toISO(addMonths(last, 15));
  const days = daysUntil(windowEnd);
  const surveyStatus =
    days < 0    ? 'Overdue' :
    days <= 30  ? 'Due Soon' :
    days <= 90  ? 'Upcoming' : 'On Track';

  const statusStyles: Record<string, { bg: string; color: string; border: string }> = {
    'Overdue':  { bg: '#FEE2E2', color: '#991B1B', border: '#FECACA' },
    'Due Soon': { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
    'Upcoming': { bg: '#DBEAFE', color: '#1E40AF', border: '#BFDBFE' },
    'On Track': { bg: '#F0FDF4', color: '#166534', border: '#BBF7D0' },
  };
  const ss = statusStyles[surveyStatus];

  // Surveyor history
  const surveyorCounts = new Map<string, number>();
  facSurveys.forEach((s) => {
    if (s.surveyor) surveyorCounts.set(s.surveyor, (surveyorCounts.get(s.surveyor) || 0) + 1);
  });
  const surveyors = [...surveyorCounts.entries()].sort((a, b) => b[1] - a[1]);

  // Documentation gaps
  const docGaps = deriveDocGaps(facility.totalCitations, facility.id, facCitations);
  const totalGaps = docGaps.tasks + docGaps.logs + docGaps.docs;

  // Citation status breakdown
  const statusCounts = new Map<string, number>();
  facCitations.forEach((c) => {
    const s = c.status || 'Open';
    statusCounts.set(s, (statusCounts.get(s) || 0) + 1);
  });

  // Top cited tags
  const tagCounts = new Map<string, number>();
  facCitations.forEach((c) => tagCounts.set(c.tag, (tagCounts.get(c.tag) || 0) + 1));
  const topTags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Citation type breakdown
  const kCount = facCitations.filter((c) => c.tagType === 'K').length;
  const eCount = facCitations.filter((c) => c.tagType === 'E').length;

  // Tags trending up system-wide — what surveyors are currently targeting
  const tagTrends = (() => {
    const cutoff = toISO(addMonths(TODAY, -trendPeriod));
    const priorCutoff = toISO(addMonths(TODAY, -trendPeriod * 2));

    const recentMap = new Map<string, number>();
    const priorMap = new Map<string, number>();
    citations.forEach((c) => {
      if (c.date >= cutoff) recentMap.set(c.tag, (recentMap.get(c.tag) || 0) + 1);
      else if (c.date >= priorCutoff) priorMap.set(c.tag, (priorMap.get(c.tag) || 0) + 1);
    });

    const facTagSet = new Set(facCitations.map((c) => c.tag));

    return [...recentMap.entries()]
      .map(([tag, recent]) => {
        const prior = priorMap.get(tag) || 0;
        const delta = recent - prior;
        return {
          tag,
          recent,
          prior,
          delta,
          citedHere: facTagSet.has(tag),
          desc: tagDescriptions.get(tag) || '',
        };
      })
      .sort((a, b) => b.delta - a.delta || b.recent - a.recent)
      .slice(0, 8);
  })();
  const maxRecent = tagTrends.length > 0 ? Math.max(...tagTrends.map((t) => t.recent)) : 1;

  const statusColor = (s: string) =>
    s === 'Completed' ? '#16A34A' : s === 'Pending' ? '#F59E0B' : '#DC2626';

  return (
    <Box>
      <PageHeader
        title={facility.name.replace('Avir at ', '')}
        subtitle={`${facility.state} · ${facility.region}`}
        backLabel="Back to Survey Planning"
        onBack={() => navigate('/surveys')}
      />

      {/* Survey Window Banner */}
      <Paper sx={{ p: 2.5, mb: 2, borderRadius: 3, border: `1px solid ${ss.border}`, bgcolor: ss.bg }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <EventNoteIcon sx={{ color: ss.color }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: ss.color }}>
              Survey Window: {fmtDate(windowStart)} – {fmtDate(windowEnd)}
            </Typography>
            <Typography variant="caption" sx={{ color: ss.color, opacity: 0.85 }}>
              {days < 0
                ? `Window closed ${Math.abs(days)} days ago`
                : `${days} days remaining in window`}
              {lastSurvey ? ` · Last surveyed ${fmtDate(lastSurvey.date)}` : ''}
            </Typography>
          </Box>
          <Chip
            label={surveyStatus}
            sx={{ bgcolor: ss.color, color: '#fff', fontWeight: 700, fontSize: '0.8rem' }}
          />
        </Box>
      </Paper>

      {/* Readiness Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>

        {/* TELS Documentation */}
        <Paper sx={{ p: 2, flex: 1, borderRadius: 3, border: `1px solid ${totalGaps > 0 ? '#FDE68A' : '#BBF7D0'}`, bgcolor: totalGaps > 0 ? '#FFFBEB' : '#F0FDF4' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <AssignmentIcon sx={{ fontSize: 18, color: totalGaps > 0 ? '#92400E' : '#166534' }} />
            <Typography variant="body2" sx={{ fontWeight: 700, color: totalGaps > 0 ? '#92400E' : '#166534' }}>
              TELS Documentation
            </Typography>
          </Box>
          {[
            { label: 'Open task items', count: docGaps.tasks },
            { label: 'Incomplete logs', count: docGaps.logs },
            { label: 'Missing documents', count: docGaps.docs },
          ].map(({ label, count }) => (
            <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                {count === 0
                  ? <CheckCircleIcon sx={{ fontSize: 15, color: '#16A34A' }} />
                  : <ErrorIcon sx={{ fontSize: 15, color: '#DC2626' }} />
                }
                <Typography variant="caption" sx={{ fontSize: '0.78rem' }}>{label}</Typography>
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: count > 0 ? '#DC2626' : '#16A34A' }}>
                {count > 0 ? count : '✓'}
              </Typography>
            </Box>
          ))}
        </Paper>

        {/* Citation Summary */}
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
              <LinearProgress
                variant="determinate"
                value={facility.totalCitations > 0 ? (count / facility.totalCitations) * 100 : 0}
                sx={{ height: 6, borderRadius: 3, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 3 } }}
              />
            </Box>
          ))}
          <Divider sx={{ my: 1 }} />
          {/* Status bar */}
          {facCitations.length > 0 && (
            <>
              <Box sx={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', bgcolor: '#F1F5F9', mb: 0.5 }}>
                {['Open', 'Pending', 'Completed'].filter(s => statusCounts.has(s)).map((s) => (
                  <Box key={s} sx={{ width: `${((statusCounts.get(s) || 0) / facCitations.length) * 100}%`, bgcolor: statusColor(s) }} />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                {['Open', 'Pending', 'Completed'].filter(s => statusCounts.has(s)).map((s) => (
                  <Box key={s} sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: statusColor(s) }} />
                    <Typography variant="caption" sx={{ fontSize: '0.65rem', color: '#64748B' }}>{statusCounts.get(s)} {s}</Typography>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Paper>

        {/* Surveyor Info */}
        <Paper sx={{ p: 2, flex: 1, borderRadius: 3, border: '1px solid #E0E4E7' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <PersonOutlineIcon sx={{ fontSize: 18, color: '#5c6874' }} />
            <Typography variant="body2" sx={{ fontWeight: 700 }}>Surveyor History</Typography>
          </Box>
          {surveyors.length === 0 ? (
            <Typography variant="caption" color="text.secondary">No surveyor data</Typography>
          ) : (
            surveyors.slice(0, 4).map(([name, count]) => {
              const lastDate = facSurveys.find((s) => s.surveyor === name)?.date;
              return (
                <Box key={name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5, borderBottom: '1px solid #F1F5F9' }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{name}</Typography>
                    {lastDate && <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.7rem' }}>Last: {fmtDate(lastDate)}</Typography>}
                  </Box>
                  <Chip label={`${count} survey${count !== 1 ? 's' : ''}`} size="small" sx={{ fontSize: '0.65rem', height: 20 }} />
                </Box>
              );
            })
          )}
        </Paper>
      </Box>

      {/* Surveyor Focus Areas — trending citations */}
      <Paper sx={{ p: 2.5, mb: 2, borderRadius: 3, border: '1px solid #E0E4E7' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUpIcon sx={{ color: '#DC2626', fontSize: 20 }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{facility.region} Focus Areas</Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>Tags increasing most across the portfolio in the past {trendPeriod} months</Typography>
            </Box>
          </Box>
          <ToggleButtonGroup
            value={trendPeriod}
            exclusive
            size="small"
            onChange={(_, v) => { if (v !== null) setTrendPeriod(v); }}
            sx={{ '& .MuiToggleButton-root': { px: 1.5, py: 0.4, fontSize: '0.75rem', fontWeight: 600, textTransform: 'none', borderColor: '#E0E4E7' } }}
          >
            <ToggleButton value={3}>3M</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {tagTrends.map((t, i) => (
            <Box key={t.tag}>
              {i > 0 && <Divider />}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
                {/* Tag + description */}
                <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.8rem', minWidth: 56 }}>{t.tag}</Typography>
                <Typography variant="caption" sx={{ color: '#64748B', flex: 1, fontSize: '0.73rem' }}>
                  {t.desc.length > 55 ? t.desc.slice(0, 55) + '…' : t.desc}
                </Typography>
                {/* Bar */}
                <Box sx={{ width: 80 }}>
                  <Box sx={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', bgcolor: '#F1F5F9' }}>
                    <Box sx={{ width: `${(t.recent / maxRecent) * 100}%`, bgcolor: t.delta > 0 ? '#DC2626' : '#94A3B8', borderRadius: 3, transition: 'width 0.3s' }} />
                  </Box>
                </Box>
                {/* Citation count */}
                <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 24, textAlign: 'right', fontSize: '0.8rem' }}>{t.recent}</Typography>
                {/* At-risk badge if this facility has been cited for this tag */}
                <Box sx={{ minWidth: 60 }}>
                  {t.citedHere && (
                    <Chip label="At risk" size="small" sx={{ fontSize: '0.6rem', height: 18, fontWeight: 700, bgcolor: '#FEE2E2', color: '#991B1B' }} />
                  )}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Top Cited Tags */}
      {topTags.length > 0 && (
        <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E0E4E7' }}>
          <Typography variant="body2" sx={{ fontWeight: 700, mb: 1.5 }}>
            Most Cited Tags
            <Typography component="span" variant="caption" sx={{ color: '#64748B', ml: 1 }}>from prior surveys</Typography>
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
