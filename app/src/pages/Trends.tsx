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
  LineChart,
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

// Five visually distinct colors for up to 5 sparkline series
const SPARKLINE_COLORS = ['#2563EB', '#D97706', '#16A34A', '#9333EA', '#DC2626'] as const;

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

// ─── Sparkline data builder ───────────────────────────────────────────────────
// Produces a synthetic-but-deterministic monthly citation-rate series per tag.
// It interpolates from an estimated prior-period rate to the current rate (based
// on the computed trend), then adds per-month hash-noise to look organic.
function buildTagMonthlyRates(
  rows: { tag: string; portfolioRate: number; peerRate: number; portfolioTrend: number; peerTrend: number }[],
  isPortfolio: boolean,
  monthCount: number,
): { tag: string; data: number[] }[] {
  return rows.map((row) => {
    const avgRate  = isPortfolio ? row.portfolioRate  : row.peerRate;
    const trend    = isPortfolio ? row.portfolioTrend : row.peerTrend;
    const prevRate = Math.max(0, avgRate - trend);
    const data = Array.from({ length: monthCount }, (_, i) => {
      const t      = monthCount <= 1 ? 1 : i / (monthCount - 1);
      const linear = prevRate + (avgRate - prevRate) * t;
      // Deterministic noise ± ~10 % of avgRate
      const seed   = row.tag + String(i) + (isPortfolio ? 'p' : 'r');
      const h      = seed.split('').reduce((a, c, j) => a + c.charCodeAt(0) * (j + 3), 0);
      const noise  = ((h % 41) / 100 - 0.20) * avgRate * 0.5;
      return Math.max(0, Math.min(1, +(linear + noise).toFixed(3)));
    });
    return { tag: row.tag, data };
  });
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
  const [regionSort, setRegionSort] = useState<TrendSort>('highest-cited');

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

  // ─── Citation rate by region (with national + peer averages mixed in) ───
  // Stores K + E rates and prior-period rates so the bar can show period trend.
  const regionRateRows = useMemo(() => {
    // Deterministic per-region prior-period multiplier (mirrors top-5 table logic)
    const regionPrevMod = (key: string, salt: string): number => {
      const h = (key + salt).split('').reduce((a, c, i) => a + c.charCodeAt(0) * (i + 3), 0);
      return 0.55 + (h % 90) / 100; // 0.55 – 1.44
    };
    const map = new Map<string, { surveys: number; kCit: number; eCit: number }>();
    for (const s of portfolioSurveys) {
      if (!map.has(s.region)) map.set(s.region, { surveys: 0, kCit: 0, eCit: 0 });
      const m = map.get(s.region)!;
      m.surveys += 1;
      m.kCit   += s.kTags;
      m.eCit   += s.eTags;
    }
    const regionRows = [...map.entries()].map(([region, v]) => {
      const kRate = v.surveys > 0 ? v.kCit / v.surveys : 0;
      const eRate = v.surveys > 0 ? v.eCit / v.surveys : 0;
      return {
        label:   region,
        surveys: v.surveys as number | null,
        kRate, eRate,
        kPrev:   kRate * regionPrevMod(region, 'K'),
        ePrev:   eRate * regionPrevMod(region, 'E'),
        isAvg:   false as boolean,
      };
    });
    // Use BENCHMARKS trends to back into prev rate for averages
    const prevFromTrend = (current: number, trendPct: number) => current / (1 + trendPct / 100);
    return [
      ...regionRows,
      { label: 'National Average', surveys: null,
        kRate: BENCHMARKS.K.nation, eRate: BENCHMARKS.E.nation,
        kPrev: prevFromTrend(BENCHMARKS.K.nation, BENCHMARKS.K.nationTrend),
        ePrev: prevFromTrend(BENCHMARKS.E.nation, BENCHMARKS.E.nationTrend),
        isAvg: true },
      { label: 'Regional Peers Average', surveys: null,
        kRate: BENCHMARKS.K.peers, eRate: BENCHMARKS.E.peers,
        kPrev: prevFromTrend(BENCHMARKS.K.peers, BENCHMARKS.K.peerTrend),
        ePrev: prevFromTrend(BENCHMARKS.E.peers, BENCHMARKS.E.peerTrend),
        isAvg: true },
    ];
  }, [portfolioSurveys]);

  // ─── Sparkline series for each top-5 table ───────────────────────────────
  const portfolioSparklines = useMemo(
    () => buildTagMonthlyRates(trendData.top5Portfolio, true,  monthlyData.length),
    [trendData.top5Portfolio, monthlyData.length],
  );
  const peerSparklines = useMemo(
    () => buildTagMonthlyRates(trendData.top5Peer, false, monthlyData.length),
    [trendData.top5Peer, monthlyData.length],
  );

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
              </Box>
            </Box>
          ) : (
            <Box sx={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ color: '#94A3B8', fontSize: '14px' }}>No survey data for selected filters</Typography>
            </Box>
          )}
        </Paper>
      </Box>

      {/* ── Row 2: Citation Rate by Region (K-Tags + E-Tags side by side) ── */}
      <Paper elevation={0} sx={{ border: '1px solid #e0e4e7', borderRadius: '8px', pt: '13px', px: 3, pb: 3, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '18px', color: '#293036' }}>
            Citation Rate by Region
          </Typography>
          <Typography sx={{ fontSize: '12px', fontWeight: 400, color: '#94A3B8' }}>{dateRangeCaption(dateRange)}</Typography>
        </Box>

        {/* Sort tabs */}
        <Tabs
          value={regionSort}
          onChange={(_, v) => setRegionSort(v)}
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
          <Tab value="highest-cited"     label="Citations per Survey" />
          <Tab value="greatest-increase" label="Trending up" />
          <Tab value="highest-reduction" label="Trending down" />
        </Tabs>

        {(() => {
          const renderRegionTable = (
            tagKey: 'K' | 'E',
            title: string,
          ) => {
            const rateOf = (r: typeof regionRateRows[number]) => tagKey === 'K' ? r.kRate : r.eRate;
            const prevOf = (r: typeof regionRateRows[number]) => tagKey === 'K' ? r.kPrev : r.ePrev;
            const trendOf = (r: typeof regionRateRows[number]) => rateOf(r) - prevOf(r);
            const sorted = (() => {
              const all = [...regionRateRows];
              if (regionSort === 'greatest-increase') {
                return all.filter((r) => trendOf(r) > 0).sort((a, b) => trendOf(b) - trendOf(a));
              }
              if (regionSort === 'highest-reduction') {
                return all.filter((r) => trendOf(r) < 0).sort((a, b) => trendOf(a) - trendOf(b));
              }
              return all.sort((a, b) => rateOf(b) - rateOf(a));
            })();
            // Include prev rates in the max so reduction extensions never overflow the track
            const regionMax = Math.max(...sorted.flatMap((r) => [rateOf(r), prevOf(r)]), 0.01);
            const barColor = TAG_COLORS[tagKey];
            return (
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '14px', color: '#293036', mb: 1.5 }}>
                  {title}
                </Typography>
                <TableContainer sx={{ border: '1px solid #e0e4e7', borderRadius: '6px', overflow: 'hidden', bgcolor: '#e0e4e7' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#293036', py: '6px', px: 2, width: 52, bgcolor: '#e0e4e7', borderBottom: '1px solid #d0d5da' }}>Rank</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#293036', py: '6px', px: 2, bgcolor: '#e0e4e7', borderBottom: '1px solid #d0d5da' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ flex: 1 }}>Region</Box>
                            <Box sx={{ minWidth: 100, flexShrink: 0 }}>Citations / Survey</Box>
                          </Box>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody sx={{ bgcolor: 'white' }}>
                      {sorted.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={2} sx={{ py: 4, textAlign: 'center', color: '#94A3B8', fontSize: '13px', borderBottom: 'none' }}>
                            No regional data for selected filters
                          </TableCell>
                        </TableRow>
                      ) : sorted.map((row, idx) => {
                        const isLast = idx === sorted.length - 1;
                        const value = rateOf(row);
                        const prev  = prevOf(row);
                        const trendAbs = value - prev;
                        const trendPct = prev > 0 ? Math.round((trendAbs / prev) * 100) : 0;
                        const isIncrease  = trendAbs > 0;
                        const isReduction = trendAbs < 0;
                        const barWidth         = (value / regionMax) * 100;
                        const overlayWidthPct  = isIncrease  ? Math.min((trendAbs / regionMax) * 100, barWidth) : 0;
                        const reductionExtPct  = isReduction ? (Math.abs(trendAbs) / regionMax) * 100 : 0;
                        return (
                          <TableRow key={row.label} sx={{
                            bgcolor: row.isAvg ? '#F2F4F7' : 'white',
                            '& td': isLast ? { borderBottom: 'none' } : {},
                          }}>
                            <TableCell sx={{ width: 52, px: 2, py: 1.5, verticalAlign: 'middle' }}>
                              <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#293036' }}>{idx + 1}</Typography>
                            </TableCell>
                            <TableCell sx={{ px: 2, py: 1.5 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <Typography sx={{
                                    fontSize: '13px',
                                    fontWeight: row.isAvg ? 600 : 700,
                                    fontStyle: row.isAvg ? 'italic' : 'normal',
                                    color: '#293036',
                                    mb: 0.75,
                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                  }}>
                                    {row.label}
                                  </Typography>
                                  <Box sx={{ position: 'relative', height: 10, bgcolor: '#E2E8F0', borderRadius: 5 }}>
                                    {/* Solid bar: current rate */}
                                    <Box sx={{
                                      position: 'absolute', top: 0, bottom: 0, left: 0,
                                      width: `${barWidth}%`,
                                      bgcolor: barColor,
                                      borderRadius: isReduction ? '5px 0 0 5px' : 5,
                                    }} />
                                    {/* Increase: darker overlay on right edge */}
                                    {isIncrease && overlayWidthPct > 0 && (
                                      <Box sx={{
                                        position: 'absolute', top: 0, bottom: 0,
                                        left: `${barWidth - overlayWidthPct}%`,
                                        width: `${overlayWidthPct}%`,
                                        bgcolor: barColor,
                                        filter: 'brightness(0.68)',
                                        borderRadius: '0 5px 5px 0',
                                      }} />
                                    )}
                                    {/* Reduction: hatched extension showing previous (higher) rate */}
                                    {isReduction && reductionExtPct > 0 && (
                                      <Box sx={{
                                        position: 'absolute', top: 0, bottom: 0,
                                        left: `${barWidth}%`,
                                        width: `${reductionExtPct}%`,
                                        background: `repeating-linear-gradient(45deg, ${barColor}66, ${barColor}66 3px, transparent 3px, transparent 7px)`,
                                        borderRadius: '0 5px 5px 0',
                                      }} />
                                    )}
                                  </Box>
                                </Box>
                                <Box sx={{ minWidth: 120, flexShrink: 0, textAlign: 'left', pl: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.4 }}>
                                    <Typography sx={{ fontSize: '15px', fontWeight: 700, color: '#293036' }}>
                                      {value.toFixed(1)}
                                    </Typography>
                                    <Typography sx={{
                                      fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap',
                                      color: trendPct > 0 ? '#EF4444' : '#94A3B8',
                                    }}>
                                      ({trendPct > 0 ? '+' : ''}{trendPct}%)
                                    </Typography>
                                  </Box>
                                  {row.surveys != null && (
                                    <Typography sx={{ fontSize: '11px', color: '#64748B' }}>
                                      {row.surveys} surveys
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            );
          };
          return (
            <Box sx={{ display: 'flex', gap: 3, minWidth: 0 }}>
              {renderRegionTable('K', 'K-Tags')}
              {renderRegionTable('E', 'E-Tags')}
            </Box>
          );
        })()}
      </Paper>

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
          <Tab value="highest-cited"     label="Top Citations" />
          <Tab value="greatest-increase" label="Trending up" />
          <Tab value="highest-reduction" label="Trending down" />
        </Tabs>

        {(() => {
          const globalBarMax = trendData.globalBarMax;
          // Shared sparkline y-axis max so both charts use the same vertical scale
          const sparklineMax = Math.max(
            ...portfolioSparklines.flatMap((s) => s.data),
            ...peerSparklines.flatMap((s) => s.data),
            0.05,
          );
          const tabSuffix = trendSort === 'greatest-increase' ? 'Trending Up'
            : trendSort === 'highest-reduction' ? 'Trending Down'
            : 'Top Citation %';
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
            sparklines: { tag: string; data: number[] }[],
          ) => (
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '14px', color: '#293036', mb: 1.5 }}>
                {title}
              </Typography>

              {/* ── Sparkline chart ─────────────────────────────────────── */}
              {sparklines.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <LineChart
                    series={sparklines.map((s, i) => ({
                      data: s.data,
                      label: s.tag,
                      color: SPARKLINE_COLORS[i % SPARKLINE_COLORS.length],
                      showMark: false,
                      curve: 'linear' as const,
                      valueFormatter: (v: number | null) =>
                        v == null ? '' : `${(v * 100).toFixed(1)}%`,
                    }))}
                    xAxis={[{ data: monthlyData.map((m) => m.label), scaleType: 'point' }]}
                    yAxis={[{
                      min: 0,
                      max: sparklineMax,
                      valueFormatter: (v: number) => `${Math.round(v * 100)}%`,
                    }]}
                    grid={{ horizontal: true }}
                    height={213}
                    margin={{ left: 36, right: 8, top: 8, bottom: 28 }}
                    hideLegend
                    sx={{
                      '& .MuiChartsLegend-root': { display: 'none' },
                      '& .MuiChartsAxis-tickLabel': { fontSize: '10px', fill: '#94A3B8' },
                      '& .MuiChartsGrid-line': { stroke: '#e8ecef', strokeWidth: 1 },
                    }}
                  />
                  {/* Mini legend */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center', mt: 0 }}>
                    {sparklines.map((s, i) => (
                      <Box key={s.tag} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{
                          width: 12, height: 12, borderRadius: '2px',
                          bgcolor: SPARKLINE_COLORS[i % SPARKLINE_COLORS.length],
                          flexShrink: 0,
                        }} />
                        <Typography sx={{ fontSize: '11px', color: '#525f6c', fontFamily: 'monospace' }}>
                          {s.tag}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* ── Table ──────────────────────────────────────────────── */}
              <TableContainer sx={{ border: '1px solid #e0e4e7', borderRadius: '6px', overflow: 'hidden', bgcolor: '#e0e4e7' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#293036', py: '6px', px: 2, width: 52, bgcolor: '#e0e4e7', borderBottom: '1px solid #d0d5da' }}>Rank</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#293036', py: '6px', px: 2, bgcolor: '#e0e4e7', borderBottom: '1px solid #d0d5da' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ flex: 1, display: 'flex', alignItems: 'baseline', gap: 1.5, minWidth: 0 }}>
                            <Box sx={{ flex: 1 }}>Citation</Box>
                            <Box sx={{ minWidth: 84, flexShrink: 0 }}>Citation Rate (Trend)</Box>
                          </Box>
                          <Box sx={{ width: 16, flexShrink: 0 }} />
                        </Box>
                      </TableCell>
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
                        <TableRow key={row.tag}
                          onClick={() => navigate(`${TAG_ROUTES[row.type as TagType]}/${row.tag}`)}
                          sx={{
                            cursor: 'pointer',
                            bgcolor: 'white',
                            '& td': isLast ? { borderBottom: 'none' } : {},
                            ...(isShared ? { borderLeft: '4px solid #0065BD' } : {}),
                            '&:hover': { bgcolor: '#f5f7fa' },
                            '&:hover .row-arrow': { color: '#0065BD' },
                          }}>
                          <TableCell sx={{ width: 52, px: 2, py: 2, verticalAlign: 'top' }}>
                            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#293036' }}>{idx + 1}</Typography>
                          </TableCell>
                          <TableCell sx={{ px: 2, py: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
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
                              </Box>
                              <ArrowForwardIcon
                                className="row-arrow"
                                sx={{ fontSize: 16, color: '#b0b8c1', flexShrink: 0, mt: '3px', transition: 'color 0.15s ease' }}
                              />
                            </Box>
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
              {renderTable(trendData.top5Portfolio, `${tabSuffix} - Portfolio`,      true,  portfolioSparklines)}
              {renderTable(trendData.top5Peer,      `${tabSuffix} - Regional Peers`, false, peerSparklines)}
            </Box>
          );
        })()}
      </Paper>
    </Box>
  );
}
