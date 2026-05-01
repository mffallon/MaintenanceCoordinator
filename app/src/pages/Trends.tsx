import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, Chip, FormControl, InputLabel, Select, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, FormControlLabel, Switch,
  Tabs, Tab, Tooltip,
} from '@mui/material';
import {
  ChartsContainer, BarPlot,
  ChartsXAxis, ChartsYAxis, ChartsGrid, ChartsTooltip,
  BAR_CHART_PLUGINS,
  useXScale, useYScale,
} from '@mui/x-charts';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { surveys, citations, facilities, regions as avirRegions, surveyors as avirSurveyors } from '../data/avir-data';
import PageHeader from '../components/PageHeader';
import PageFilters from '../components/PageFilters';
import { AiGeneratedIcon } from '../components/AppLayout';
import { useCommunityFilter } from '../components/CommunityFilter';
import { makeDateFilter } from '../utils/dateFilter';

// ─── Mock peer / nation benchmarks ──────────────────────────────────────────
// Higher citations per survey = worse. Story: portfolio worse than peers on
// K & E-Tags, but better on N-Tags. All categories trending up nationally.
const BENCHMARKS = {
  K: { peers: 2.8, peerTrend:  5, nation: 3.6, nationTrend: 15, myTrend: 10 },
  N: { peers: 3.4, peerTrend: -3, nation: 2.9, nationTrend:  8, myTrend: -5 },
  E: { peers: 3.0, peerTrend: 12, nation: 4.2, nationTrend: 20, myTrend:  8 },
} as const;

const TAG_COLORS = { K: '#F68E5B', N: '#25A36A', E: '#009FDB' } as const;
const TAG_LABELS = { K: 'K-Tags', N: 'State', E: 'E-Tags' } as const;

type TagType = 'K' | 'N' | 'E';
type ChartMode = 'per-survey' | 'total';
type TrendFilter = 'all' | TagType;
type TrendSort = 'highest-cited' | 'greatest-increase' | 'highest-reduction';

// ─── Horizontal bar with comparison marker ───────────────────────────────────
function TrendBar({
  mainRate, compareRate, compareLabel, tagType, isLast, sectionMax, periodDelta,
}: {
  mainRate: number; compareRate: number;
  mainLabel: string; compareLabel: string;
  tagType: TagType; isLast: boolean; sectionMax: number;
  periodDelta?: number; // override: period-over-period change in pp (e.g. +5 or -3)
}) {
  const max = sectionMax;
  const mainPct  = Math.round(mainRate * 100);
  const cmpPct   = Math.round(compareRate * 100);
  // Use period-over-period delta when provided (increase/reduction modes), else peer-vs-portfolio
  const delta    = periodDelta !== undefined ? periodDelta : mainPct - cmpPct;
  const deltaStr = delta > 0 ? `+${delta}%` : `${delta}%`;
  const barColor = TAG_COLORS[tagType] ?? '#6366F1';
  // Visual treatment based on period trend direction
  const isIncrease  = periodDelta !== undefined && periodDelta > 0;
  const isReduction = periodDelta !== undefined && periodDelta < 0;

  // Bar widths as % of track
  const barWidthPct = (mainRate / max) * 100;
  // Increase: darker overlay covers the rightmost `delta` pp of the bar
  const overlayWidthPct = isIncrease && periodDelta !== undefined
    ? Math.min((periodDelta / 100 / max) * 100, barWidthPct)
    : 0;

  // Reduction: hatched extension starts at current bar end, extends right to show previous (higher) rate
  const reductionExtLeft  = `${barWidthPct}%`;
  const reductionExtWidth = isReduction && periodDelta !== undefined
    ? `${(Math.abs(periodDelta) / 100 / max) * 100}%`
    : '0%';
  const markerLeft = `${Math.min((compareRate / max) * 100, 98)}%`;

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, pb: isLast ? 0 : 0.5 }}>
      {/* Bar track + dashed marker + comparison label below */}
      <Box sx={{ flex: 1, position: 'relative' }}>
        <Box sx={{ position: 'relative', height: 10, bgcolor: '#E2E8F0', borderRadius: 5 }}>
          {/* Solid bar — current rate, normal color */}
          <Box sx={{
            position: 'absolute', top: 0, bottom: 0, left: 0,
            width: `${(mainRate / max) * 100}%`,
            bgcolor: barColor,
            borderRadius: isReduction ? '5px 0 0 5px' : 5,
          }} />
          {/* Increase: darker overlay on the right edge of the bar */}
          {isIncrease && overlayWidthPct > 0 && (
            <Box sx={{
              position: 'absolute', top: 0, bottom: 0,
              left: `${barWidthPct - overlayWidthPct}%`,
              width: `${overlayWidthPct}%`,
              bgcolor: barColor,
              filter: 'brightness(0.68)',
              borderRadius: '0 5px 5px 0',
            }} />
          )}
          {/* Reduction: hatched extension showing the previous (higher) rate */}
          {isReduction && (
            <Box sx={{
              position: 'absolute', top: 0, bottom: 0,
              left: reductionExtLeft, width: reductionExtWidth,
              background: `repeating-linear-gradient(45deg, ${barColor}66, ${barColor}66 3px, transparent 3px, transparent 7px)`,
              borderRadius: '0 5px 5px 0',
            }} />
          )}
        </Box>
        <Box sx={{ position: 'absolute', top: -4, height: 18, left: markerLeft, width: 0, borderLeft: '2px dashed #1E3A8A' }} />
        <Typography sx={{ fontSize: '11px', color: '#64748B', mt: 0.5 }}>
          {compareLabel}: {cmpPct}%
        </Typography>
      </Box>
      {/* Main % — shifted up so its vertical center aligns with the bar's center (bar=10px, text≈20px → offset -5px) */}
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.4, flexShrink: 0, mt: '-5px', minWidth: 84 }}>
        <Typography sx={{ fontSize: '15px', fontWeight: 700, color: '#293036' }}>
          {mainPct}%
        </Typography>
        <Typography sx={{ fontSize: '11px', fontWeight: 600, color: delta > 0 ? '#EF4444' : '#94A3B8', whiteSpace: 'nowrap' }}>
          ({deltaStr})
        </Typography>
      </Box>
    </Box>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
const TAG_ROUTES: Record<TagType, string> = {
  K: '/citations-remix/tags/k',
  E: '/citations-remix/tags/e',
  N: '/citations-remix/tags/state',
};

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const REF = new Date('2026-04-02');

function dateRangeCaption(dateRange: string): string {
  const fmt = (d: Date) => `${MONTHS[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
  const end = fmt(REF);
  if (dateRange === 'all') return 'All time';
  if (dateRange === '12m') return `${fmt(new Date(REF.getFullYear() - 1, REF.getMonth(), REF.getDate()))} – ${end}`;
  if (dateRange === 'ytd') return `${fmt(new Date(REF.getFullYear(), 0, 1))} – ${end}`;
  if (dateRange === '30d') return `${fmt(new Date(REF.getFullYear(), REF.getMonth(), REF.getDate() - 30))} – ${end}`;
  if (dateRange === '60d') return `${fmt(new Date(REF.getFullYear(), REF.getMonth(), REF.getDate() - 60))} – ${end}`;
  if (dateRange === '90d') return `${fmt(new Date(REF.getFullYear(), REF.getMonth(), REF.getDate() - 90))} – ${end}`;
  return end;
}

// ─── Custom peer benchmark tick marks drawn inside the chart SVG ─────────────
// Draws a short horizontal dashed line at the peer value level for each bar.
// MUI grouped bars start each bar exactly at xScale(label) for the first series.
// Inner gap between bars ≈ 4.75% of bandwidth (empirically derived from MUI BarPlot internals).
const BAR_INNER_PAD = 0.0475;
function PeerTicks({
  labels, peerK, peerE, showK, showE,
}: { labels: string[]; peerK: number[]; peerE: number[]; showK: boolean; showE: boolean }) {
  const xScale = useXScale() as { bandwidth(): number; (v: string): number | undefined };
  const yScale = useYScale() as (v: number) => number | undefined;
  const numSeries = (showK ? 1 : 0) + (showE ? 1 : 0);
  if (numSeries === 0) return null;

  const bw = xScale.bandwidth();
  const barW = bw * (1 - BAR_INNER_PAD) / numSeries;
  const gapW = bw * BAR_INNER_PAD;

  return (
    <g>
      {labels.map((label, i) => {
        const bandX = xScale(label);
        if (bandX == null) return null;
        // K bar starts exactly at bandX; E bar follows after K bar + inner gap
        const kX = bandX;
        const eX = bandX + (showK ? barW + gapW : 0);
        const kY = yScale(peerK[i]) ?? 0;
        const eY = yScale(peerE[i]) ?? 0;
        return (
          <g key={label}>
            {showK && (
              <line x1={kX} x2={kX + barW} y1={kY} y2={kY}
                stroke="#B8541A" strokeWidth={1.5} strokeDasharray="4 2.5" strokeLinecap="round" />
            )}
            {showE && (
              <line x1={eX} x2={eX + barW} y1={eY} y2={eY}
                stroke="#0058A3" strokeWidth={1.5} strokeDasharray="4 2.5" strokeLinecap="round" />
            )}
          </g>
        );
      })}
    </g>
  );
}

export default function Trends() {
  const navigate = useNavigate();
  const { passesFilter } = useCommunityFilter();
  const [dateRange, setDateRange]   = useState('12m');
  const [latestOnly, setLatestOnly] = useState(true);
  const [chartMode, setChartMode]     = useState<ChartMode>('per-survey');
  const [chartTagFilter, setChartTagFilter] = useState<TrendFilter>('all');

  // Bottom section local filters
  // Combined region/surveyor filter encoded as "" | "region:X" | "surveyor:X"
  const [trendWho, setTrendWho] = useState('');
  const [trendTagType, setTrendTagType] = useState<TrendFilter>('all');

  const trendRegion   = trendWho.startsWith('region:')   ? trendWho.slice(7)   : '';
  const trendSurveyor = trendWho.startsWith('surveyor:') ? trendWho.slice(9)   : '';
  const [trendSort, setTrendSort] = useState<TrendSort>('highest-cited');

  const passesDate = useMemo(() => makeDateFilter(dateRange), [dateRange]);

  // Latest survey date per facility (global — latestOnly toggle)
  const latestByFacility = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of surveys) {
      const cur = map.get(s.facilityId);
      if (!cur || s.date > cur) map.set(s.facilityId, s.date);
    }
    return map;
  }, []);

  const isLatest = (facilityId: string, date: string) => latestByFacility.get(facilityId) === date;

  // ─── Portfolio surveys ────────────────────────────────────────────────────
  const portfolioSurveys = useMemo(() => surveys.filter((s) =>
    passesFilter(s.facilityId) &&
    passesDate(s.date) &&
    (!latestOnly || isLatest(s.facilityId, s.date)),
  ), [passesFilter, passesDate, latestOnly, latestByFacility]);

  // ─── Monthly bar chart data (always 12 months; synthetic fill for missing) ──
  const monthlyData = useMemo(() => {
    // Aggregate real survey data by month
    const map = new Map<string, { count: number; K: number; N: number; E: number }>();
    for (const s of portfolioSurveys) {
      const month = s.date.slice(0, 7);
      if (!map.has(month)) map.set(month, { count: 0, K: 0, N: 0, E: 0 });
      const m = map.get(month)!;
      m.count++; m.K += s.kTags; m.N += s.nTags; m.E += s.eTags;
    }

    // Build a fixed 12-month window ending at the ref date
    const ref = new Date('2026-04-02');
    const months: string[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(ref.getFullYear(), ref.getMonth() - i, 1);
      months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    }

    // Deterministic synthetic filler — hash on month string for stable values
    const synthVal = (month: string, offset: number): number => {
      const h = month.split('').reduce((acc, c, i) => acc + c.charCodeAt(0) * (i + 1), 0);
      return +((h % 100 + offset) / 30).toFixed(2);
    };

    return months.map((month, idx) => {
      const label = new Date(month + '-15').toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      // Slight upward drift in synthetic data toward present to look natural
      const drift = idx / 11;
      if (map.has(month)) {
        const d = map.get(month)!;
        const div = chartMode === 'per-survey' ? (d.count || 1) : 1;
        return { label, K: +(d.K / div).toFixed(2), N: +(d.N / div).toFixed(2), E: +(d.E / div).toFixed(2), synthetic: false };
      }
      // Synthetic: plausible values that trend upward slightly
      return {
        label,
        K: +(synthVal(month, 60) + drift * 1.2).toFixed(2),
        N: +(synthVal(month, 80) + drift * 1.5).toFixed(2),
        E: +(synthVal(month, 10) + drift * 0.3).toFixed(2),
        synthetic: true,
      };
    });
  }, [portfolioSurveys, chartMode]);

  // ─── Peer benchmark lines — per-month variation around fixed averages ─────
  const peerLineData = useMemo(() => monthlyData.map((_, i) => ({
    K: +(BENCHMARKS.K.peers + Math.sin(i * 1.1) * 0.35 + Math.sin(i * 0.4) * 0.15).toFixed(2),
    E: +(BENCHMARKS.E.peers + Math.sin(i * 0.9 + 1) * 0.25 + Math.sin(i * 0.5) * 0.10).toFixed(2),
  })), [monthlyData]);

  // ─── Metric card stats ────────────────────────────────────────────────────
  const cardStats = useMemo(() => {
    const n = portfolioSurveys.length || 1;
    return {
      K: +(portfolioSurveys.reduce((s, sv) => s + sv.kTags, 0) / n).toFixed(1),
      N: +(portfolioSurveys.reduce((s, sv) => s + sv.nTags, 0) / n).toFixed(1),
      E: +(portfolioSurveys.reduce((s, sv) => s + sv.eTags, 0) / n).toFixed(1),
      count: portfolioSurveys.length,
    };
  }, [portfolioSurveys]);

  // ─── Regional Peers vs Portfolio (bottom section) ─────────────────────────
  const portfolioRegions = useMemo(
    () => new Set(facilities.filter((f) => passesFilter(f.id)).map((f) => f.region)),
    [passesFilter],
  );

  const trendSurveyorList = useMemo(
    () => avirSurveyors,
    [],
  );

  const trendData = useMemo(() => {
    // Portfolio survey keys already date+latestOnly filtered
    const portKeys = new Set(portfolioSurveys.map((s) => `${s.facilityId}__${s.date}`));

    // Denominators must respect trendRegion so rates stay realistic when filtering
    const portTotal = Math.max(
      portfolioSurveys.filter((s) => !trendRegion || s.region === trendRegion).length,
      1,
    );
    const peerTotal = Math.max(
      surveys.filter((s) =>
        portfolioRegions.has(s.region) &&
        passesDate(s.date) &&
        (!latestOnly || isLatest(s.facilityId, s.date)) &&
        (!trendRegion || s.region === trendRegion),
      ).length,
      1,
    );

    // Deterministic per-tag modifier that simulates regional peer variation.
    const peerMod = (tag: string): number => {
      const h = tag.split('').reduce((acc, c, i) => acc + c.charCodeAt(0) * (i + 1), 0);
      return 0.75 + (h % 40) / 100; // 0.75 – 1.15  (tighter band keeps rates plausible)
    };

    const buildTagMap = (filterByType: boolean) => {
      const relevant = citations.filter((c) =>
        portfolioRegions.has(c.region) &&
        passesDate(c.date) &&
        (!latestOnly || isLatest(c.facilityId, c.date)) &&
        (!trendRegion   || c.region === trendRegion) &&
        (!trendSurveyor || c.surveyor === trendSurveyor) &&
        c.tagType !== 'N' &&
        (!filterByType || trendTagType === 'all' || c.tagType === trendTagType),
      );

      const tagMap = new Map<string, {
        tag: string; desc: string; type: TagType;
        portSurveys: Set<string>; peerSurveys: Set<string>;
      }>();
      for (const c of relevant) {
        if (!tagMap.has(c.tag)) {
          tagMap.set(c.tag, { tag: c.tag, desc: c.description, type: c.tagType as TagType, portSurveys: new Set(), peerSurveys: new Set() });
        }
        const entry = tagMap.get(c.tag)!;
        const key = `${c.facilityId}__${c.date}`;
        entry.peerSurveys.add(key);
        if (portKeys.has(key)) entry.portSurveys.add(key);
      }
      return [...tagMap.values()].map((d) => {
        const portfolioRate = d.portSurveys.size / portTotal;
        const peerRate = Math.min((d.peerSurveys.size / peerTotal) * peerMod(d.tag), 1);
        return { tag: d.tag, desc: d.desc, type: d.type, portfolioRate, peerRate };
      });
    };

    // Filtered rows (for display) — respects trendTagType
    const filteredRows = buildTagMap(true);
    // All-tag rows (for global max) — ignores trendTagType so scale stays stable
    const allRows = buildTagMap(false);

    // Previous-period trend: deterministic hash modifier simulating prior period rates
    // Positive trend = rate went up (worse), negative = rate went down (better)
    const prevMod = (tag: string, salt: string): number => {
      const h = (tag + salt).split('').reduce((acc, c, i) => acc + c.charCodeAt(0) * (i + 3), 0);
      return 0.55 + (h % 90) / 100; // 0.55 – 1.44 multiplier vs current
    };

    // Global max must include previous rates so reduction extensions always fit in track
    const globalBarMax = Math.max(
      ...allRows.flatMap((r) => {
        const prevPeer = r.peerRate * prevMod(r.tag, 'peer');
        const prevPort = r.portfolioRate * prevMod(r.tag, 'port');
        return [r.peerRate, r.portfolioRate, prevPeer, prevPort];
      }),
      0.01,
    );

    const withTrend = filteredRows.map((r) => ({
      ...r,
      portfolioTrend: r.portfolioRate - r.portfolioRate * prevMod(r.tag, 'port'),
      peerTrend:      r.peerRate      - r.peerRate      * prevMod(r.tag, 'peer'),
    }));

    const sortPeer = (rows: typeof withTrend) => {
      if (trendSort === 'greatest-increase')
        return [...rows].filter((r) => r.peerTrend > 0).sort((a, b) => b.peerTrend - a.peerTrend);
      if (trendSort === 'highest-reduction')
        return [...rows].filter((r) => r.peerTrend < 0).sort((a, b) => a.peerTrend - b.peerTrend);
      return [...rows].sort((a, b) => b.peerRate - a.peerRate);
    };
    const sortPortfolio = (rows: typeof withTrend) => {
      if (trendSort === 'greatest-increase')
        return [...rows].filter((r) => r.portfolioTrend > 0).sort((a, b) => b.portfolioTrend - a.portfolioTrend);
      if (trendSort === 'highest-reduction')
        return [...rows].filter((r) => r.portfolioTrend < 0).sort((a, b) => a.portfolioTrend - b.portfolioTrend);
      return [...rows].sort((a, b) => b.portfolioRate - a.portfolioRate);
    };

    return {
      top5Peer:      sortPeer(withTrend).slice(0, 5),
      top5Portfolio: sortPortfolio(withTrend).slice(0, 5),
      globalBarMax,
    };
  }, [portfolioSurveys, portfolioRegions, passesDate, latestOnly, latestByFacility, trendWho, trendTagType, trendSort]);

  // ─── Chip style helper ────────────────────────────────────────────────────
  const chipSx = (active: boolean) => ({
    cursor: 'pointer', fontWeight: 600, fontSize: '12px', height: 28,
    bgcolor: active ? '#293036' : 'transparent',
    color:   active ? '#fff'    : '#5c6874',
    border:  active ? '1.5px solid #293036' : '1.5px solid #e0e4e7',
    '& .MuiChip-label': { px: 1.5 },
    '&:hover': { bgcolor: active ? '#1a2025' : '#f0f2f4' },
  });

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <Box>
      <PageHeader
        title={
          <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
            Trends
            <Tooltip title="Generated by TELS AI Insights engine." placement="right" arrow>
              <Box component="span" sx={{ display: 'inline-flex', cursor: 'default' }}>
                <AiGeneratedIcon size={24} color="#293036" />
              </Box>
            </Tooltip>
          </Box>
        }
        actions={
          <Button variant="contained" color="inherit" size="small" startIcon={<FileDownloadIcon />}>
            Export
          </Button>
        }
      />
      <PageFilters
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        afterFilters={
          <FormControlLabel
            control={<Switch checked={latestOnly} onChange={(e) => setLatestOnly(e.target.checked)} size="small" />}
            label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: '#293036' }}>Latest survey only</Typography>}
            sx={{ ml: 0.5 }}
          />
        }
      />

      {/* ── Row 1: Monthly Citations + Category Intensity ─────────────────── */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>

        {/* K-Tags + E-Tags cards stacked */}
        <Box sx={{ width: 340, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px', order: 2 }}>
          {(['K', 'E'] as TagType[]).map((type) => {
            const bench = BENCHMARKS[type];
            const myVal = cardStats[type];
            const myTrend = bench.myTrend;
            const MyTrendIcon = myTrend >= 0 ? TrendingUpIcon : TrendingDownIcon;
            const myColor = myTrend >= 0 ? '#EF4444' : '#25A36A';

            return (
              <Paper key={type} elevation={0} sx={{
                flex: 1, border: '1px solid #e0e4e7', borderRadius: '8px',
                display: 'flex', flexDirection: 'column', gap: 1,
                pt: '13px', pb: 2, px: 3,
              }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: TAG_COLORS[type], flexShrink: 0, alignSelf: 'center' }} />
                    <Typography sx={{ fontWeight: 700, fontSize: '18px', color: '#293036' }}>{TAG_LABELS[type]}</Typography>
                    <Typography sx={{ fontSize: '12px', fontWeight: 400, color: '#94A3B8' }}>{dateRangeCaption(dateRange)}</Typography>
                  </Box>
                  <Button size="small" variant="text" endIcon={<ArrowForwardIcon sx={{ fontSize: '16px !important' }} />}
                    onClick={() => navigate(TAG_ROUTES[type])}
                    sx={{ color: '#0065BD', fontWeight: 600, fontSize: '0.875rem', px: 1, py: 0.5 }}>
                    View all
                  </Button>
                </Box>

                {/* Portfolio value */}
                <Box sx={{ px: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#293036', letterSpacing: '-0.176px' }}>Per Survey</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ fontSize: '24px', fontWeight: 800, color: '#293036', lineHeight: '32px', letterSpacing: '-0.408px' }}>{myVal}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px', alignSelf: 'flex-end', pb: '4px' }}>
                      <MyTrendIcon sx={{ fontSize: 14, color: myColor }} />
                      <Typography sx={{ fontSize: '12px', fontWeight: 700, color: myColor }}>
                        {myTrend >= 0 ? '+' : ''}{myTrend}%
                      </Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ fontSize: '12px', fontWeight: 400, color: '#525f6c', lineHeight: '16px' }}>{cardStats.count} total surveys</Typography>
                </Box>

                {/* Peers + Nation sub-stats */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {([
                    { label: 'Peers',  val: bench.peers,  trend: bench.peerTrend,   bgWhenAbove: '#fef1f3' },
                    { label: 'Nation', val: bench.nation, trend: bench.nationTrend, bgWhenAbove: 'white'   },
                  ] as const).map(({ label, val, trend, bgWhenAbove }) => {
                    const BenchIcon = trend >= 0 ? TrendingUpIcon : TrendingDownIcon;
                    return (
                      <Box key={label} sx={{
                        flex: 1, p: 1, borderRadius: '4px',
                        bgcolor: myVal > val ? bgWhenAbove : 'white',
                        display: 'flex', flexDirection: 'column', gap: '2px',
                      }}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#293036', letterSpacing: '-0.084px', lineHeight: '20px' }}>{label}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography sx={{ fontSize: '20px', fontWeight: 800, color: '#293036', lineHeight: '28px', letterSpacing: '-0.28px' }}>{val}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <BenchIcon sx={{ fontSize: 16, color: '#293036' }} />
                            <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#293036', lineHeight: '16px' }}>
                              {trend >= 0 ? '+' : ''}{trend}%
                            </Typography>
                          </Box>
                        </Box>
                        <Typography sx={{ fontSize: '12px', fontWeight: 400, color: '#525f6c', lineHeight: '16px' }}>Per survey</Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Paper>
            );
          })}
        </Box>

        {/* Monthly Citations bar chart */}
        <Paper elevation={0} sx={{ flex: 1, border: '1px solid #e0e4e7', borderRadius: '8px', pt: '13px', px: 3, pb: 2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '18px', color: '#293036', mb: 1 }}>Monthly Citations</Typography>

          {/* Tag filter chips */}
          <Box sx={{ display: 'flex', gap: 0.75, mb: 1 }}>
            {([['all', 'All citations'], ['K', 'K-Tags'], ['E', 'E-Tags']] as [TrendFilter, string][]).map(([val, label]) => (
              <Chip key={val} label={label} size="small"
                onClick={() => setChartTagFilter(val)}
                sx={chipSx(chartTagFilter === val)} />
            ))}
          </Box>

          {/* Per survey / Total tabs */}
          <Tabs
            value={chartMode}
            onChange={(_, v) => setChartMode(v)}
            sx={{
              minHeight: 40,
              borderBottom: '1px solid #e0e4e7',
              mb: 2,
              '& .MuiTabs-indicator': { backgroundColor: '#0065BD', height: 2 },
              '& .MuiTab-root': {
                minHeight: 40, py: 0, px: 1.5,
                fontSize: '0.875rem', fontWeight: 600, textTransform: 'none',
                letterSpacing: '-0.011em', color: '#5c6874',
                '&.Mui-selected': { color: '#0065BD' },
              },
            }}
          >
            <Tab value="per-survey" label="Per survey" />
            <Tab value="total"      label="Total" />
          </Tabs>

          {monthlyData.length > 0 ? (
            <Box sx={{ mt: 1 }}>
              <ChartsContainer
                plugins={BAR_CHART_PLUGINS as any}
                series={[
                  ...(chartTagFilter === 'all' || chartTagFilter === 'K'
                    ? [{ type: 'bar' as const, data: monthlyData.map((m) => m.K), label: 'K-Tags', color: TAG_COLORS.K, id: 'k-bar' }] : []),
                  ...(chartTagFilter === 'all' || chartTagFilter === 'E'
                    ? [{ type: 'bar' as const, data: monthlyData.map((m) => m.E), label: 'E-Tags', color: TAG_COLORS.E, id: 'e-bar' }] : []),
                ]}
                xAxis={[{ data: monthlyData.map((m) => m.label), scaleType: 'band', categoryGapRatio: 0.2 }]}
                yAxis={[{ label: chartMode === 'per-survey' ? 'Citations per survey' : 'Total citations' }]}
                height={320}
                margin={{ left: 38, right: 4, top: 8, bottom: 28 }}
                sx={{
                  '& .MuiChartsAxis-tickLabel': { fontSize: '11px', fill: '#5c6874' },
                  '& .MuiChartsAxis-label':     { fontSize: '12px', fill: '#5c6874' },
                  '& .MuiBarElement-root': { stroke: '#fff', strokeWidth: 1 },
                  '& .MuiChartsGrid-line': { stroke: '#cbd5e1', strokeDasharray: '4 4', strokeWidth: 1 },
                }}
              >
                <ChartsGrid horizontal />
                <BarPlot />
                <ChartsXAxis />
                <ChartsYAxis />
                <PeerTicks
                  labels={monthlyData.map((m) => m.label)}
                  peerK={peerLineData.map((p) => p.K)}
                  peerE={peerLineData.map((p) => p.E)}
                  showK={chartTagFilter === 'all' || chartTagFilter === 'K'}
                  showE={chartTagFilter === 'all' || chartTagFilter === 'E'}
                />
                <ChartsTooltip />
              </ChartsContainer>
              {/* Custom legend */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2.5, mt: 0.5 }}>
                {(chartTagFilter === 'all' || chartTagFilter === 'K') && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: TAG_COLORS.K, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: '12px', color: '#293036' }}>K-Tags</Typography>
                  </Box>
                )}
                {(chartTagFilter === 'all' || chartTagFilter === 'E') && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: TAG_COLORS.E, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: '12px', color: '#293036' }}>E-Tags</Typography>
                  </Box>
                )}
                {(chartTagFilter === 'all' || chartTagFilter === 'K') && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Box component="svg" width={24} height={12} sx={{ flexShrink: 0 }}>
                      <line x1="0" y1="6" x2="24" y2="6" stroke="#B8541A" strokeWidth="1.5" strokeDasharray="4 2.5" strokeLinecap="round" />
                    </Box>
                    <Typography sx={{ fontSize: '12px', color: '#293036' }}>K-Tag Peers</Typography>
                  </Box>
                )}
                {(chartTagFilter === 'all' || chartTagFilter === 'E') && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Box component="svg" width={24} height={12} sx={{ flexShrink: 0 }}>
                      <line x1="0" y1="6" x2="24" y2="6" stroke="#0058A3" strokeWidth="1.5" strokeDasharray="4 2.5" strokeLinecap="round" />
                    </Box>
                    <Typography sx={{ fontSize: '12px', color: '#293036' }}>E-Tag Peers</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          ) : (
            <Box sx={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ color: '#94A3B8', fontSize: '14px' }}>No survey data for selected filters</Typography>
            </Box>
          )}
        </Paper>
      </Box>

      {/* ── Row 3: Portfolio vs Regional Citations ──────────────────── */}
      <Paper elevation={0} sx={{ border: '1px solid #e0e4e7', borderRadius: '8px', pt: '13px', px: 3, pb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '18px', color: '#293036' }}>
            Portfolio vs Regional Citations
          </Typography>
          <Typography sx={{ fontSize: '12px', fontWeight: 400, color: '#94A3B8' }}>{dateRangeCaption(dateRange)}</Typography>
        </Box>

        {/* Section-level filters + segment control */}
        <Box sx={{ display: 'flex', gap: 1.5, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl size="small" variant="outlined" sx={{
            minWidth: 220,
            '& .MuiInputLabel-root': {
              fontSize: '0.875rem', fontWeight: 600, color: '#5c6874',
              '&.Mui-focused': { color: '#0065BD' },
            },
            '& .MuiSelect-select': { fontSize: '1rem', letterSpacing: '-0.011em', color: '#293036' },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e4e7', borderRadius: '8px' },
            '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#b0b8c1' },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0065BD' },
          }}>
            <InputLabel shrink>By region or surveyor</InputLabel>
            <Select
              value={trendWho}
              onChange={(e) => setTrendWho(e.target.value)}
              label="By region or surveyor"
              displayEmpty
              notched
              renderValue={(v) => v ? (v as string).replace(/^(region|surveyor):/, '') : 'All'}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem disabled sx={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', py: 0.25, letterSpacing: '0.08em' }}>REGIONS</MenuItem>
              {avirRegions.map((r) => <MenuItem key={`region:${r}`} value={`region:${r}`}>{r}</MenuItem>)}
              <MenuItem disabled sx={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', py: 0.25, letterSpacing: '0.08em' }}>SURVEYORS</MenuItem>
              {trendSurveyorList.map((s) => <MenuItem key={`surveyor:${s}`} value={`surveyor:${s}`}>{s}</MenuItem>)}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 0.75 }}>
            {([['all', 'All citations'], ['K', 'K-Tags'], ['E', 'E-Tags']] as [TrendFilter, string][]).map(([val, label]) => (
              <Chip key={val} label={label} size="small"
                onClick={() => setTrendTagType(val)}
                sx={chipSx(trendTagType === val)} />
            ))}
          </Box>

        </Box>

        {/* Sort tabs */}
        <Tabs
          value={trendSort}
          onChange={(_, v) => setTrendSort(v)}
          sx={{
            mb: 3,
            minHeight: 40,
            borderBottom: '1px solid #e0e4e7',
            '& .MuiTabs-indicator': { backgroundColor: '#0065BD', height: 2 },
            '& .MuiTab-root': {
              minHeight: 40, py: 0, px: 1.5,
              fontSize: '0.875rem', fontWeight: 600, textTransform: 'none',
              letterSpacing: '-0.011em',
              color: '#5c6874',
              '&.Mui-selected': { color: '#0065BD' },
            },
          }}
        >
          <Tab value="highest-cited"     label="Highest rate" />
          <Tab value="greatest-increase" label="Trending up" />
          <Tab value="highest-reduction" label="Trending down" />
        </Tabs>

        {(() => {
          const globalBarMax = trendData.globalBarMax;
          const tabSuffix = trendSort === 'greatest-increase' ? 'Trending Up'
            : trendSort === 'highest-reduction' ? 'Trending Down'
            : 'Top Citations';
          // Tags that appear in BOTH top-5 lists get a blue left border
          const sharedTags = new Set(
            trendData.top5Portfolio
              .filter((p) => trendData.top5Peer.some((r) => r.tag === p.tag))
              .map((p) => p.tag),
          );

          const renderTable = (
            rows: typeof trendData.top5Portfolio,
            title: string,
            isPortfolio: boolean,
          ) => (
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '14px', color: '#293036', mb: 1.5 }}>
                {title}
              </Typography>
              <TableContainer sx={{ border: '1px solid #e0e4e7', borderRadius: '6px', overflow: 'hidden', bgcolor: '#e0e4e7' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#293036', py: '6px', px: 2, width: 52, bgcolor: '#e0e4e7', borderBottom: '1px solid #d0d5da' }}>Rank</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#293036', py: '6px', px: 2, bgcolor: '#e0e4e7', borderBottom: '1px solid #d0d5da' }}>Citation</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{ bgcolor: 'white' }}>
                    {rows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} sx={{ py: 4, textAlign: 'center', color: '#94A3B8', fontSize: '13px', borderBottom: 'none' }}>
                          No data for selected filters
                        </TableCell>
                      </TableRow>
                    ) : rows.map((row, idx) => {
                      const isLast = idx === rows.length - 1;
                      const isShared = sharedTags.has(row.tag);
                      return (
                        <TableRow key={row.tag} sx={{
                          bgcolor: 'white',
                          '& td': isLast ? { borderBottom: 'none' } : {},
                          ...(isShared ? { borderLeft: '4px solid #0065BD' } : {}),
                        }}>
                          <TableCell sx={{ width: 52, px: 2, py: 2, verticalAlign: 'top' }}>
                            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#293036' }}>{idx + 1}</Typography>
                          </TableCell>
                          <TableCell sx={{ px: 2, py: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, mb: 1, overflow: 'hidden' }}>
                              <Typography component="span" sx={{ fontSize: '13px', fontWeight: 700, fontFamily: 'monospace', color: '#293036', whiteSpace: 'nowrap' }}>
                                {row.tag}
                              </Typography>
                              <Typography component="span" sx={{ fontSize: '13px', color: '#293036', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {row.desc}
                              </Typography>
                            </Box>
                            <TrendBar
                              mainRate={isPortfolio ? row.portfolioRate : row.peerRate}
                              compareRate={isPortfolio ? row.peerRate : row.portfolioRate}
                              mainLabel={isPortfolio ? 'Portfolio' : 'Peers'}
                              compareLabel={isPortfolio ? 'Peers' : 'Portfolio'}
                              tagType={row.type}
                              isLast={isLast}
                              sectionMax={globalBarMax}
                              periodDelta={Math.round((isPortfolio ? row.portfolioTrend : row.peerTrend) * 100)}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          );

          return (
            <Box sx={{ display: 'flex', gap: 3, minWidth: 0 }}>
              {renderTable(trendData.top5Portfolio, `Portfolio — ${tabSuffix}`, true)}
              {renderTable(trendData.top5Peer, `Regional Peers — ${tabSuffix}`, false)}
            </Box>
          );
        })()}
      </Paper>
    </Box>
  );
}
