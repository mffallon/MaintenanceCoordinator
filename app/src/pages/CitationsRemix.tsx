import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper,
  Button, IconButton, FormControlLabel, Switch,
  Drawer, Divider, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  LinearProgress, FormControl, InputLabel, Select, MenuItem, ButtonBase,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PageHeader from '../components/PageHeader';
import PageFilters from '../components/PageFilters';
import { surveys as avirSurveys, citations as avirCitations, facilities as avirFacilities } from '../data/avir-data';
import { useCommunityFilter } from '../components/CommunityFilter';
import { fmtDate } from '../utils/formatDate';
import { makeDateFilter } from '../utils/dateFilter';

interface SurveyRow {
  id: string;
  facilityId: string;
  facilityName: string;
  state: string;
  region: string;
  surveyDate: string;
  surveyor: string;
  kTags: number;
  stateTags: number;
  eTags: number;
  totalCitations: number;
  isWaiver: boolean;
  isPending: boolean;
}

export default function CitationsRemix() {
  const navigate = useNavigate();
  const { passesFilter } = useCommunityFilter();

  const [dateRange, setDateRange] = useState('ytd');
  const [selectedSurveyor, setSelectedSurveyor] = useState<string | null>(null);
  const [regionFilter, setRegionFilter] = useState('');
  const [latestOnly, setLatestOnly] = useState(true);
  const [tagDrawer, setTagDrawer] = useState<{ row: SurveyRow; tagType: 'K' | 'State' | 'E' | 'All' } | null>(null);
  const [tagFilter, setTagFilter] = useState<'All' | 'K' | 'N' | 'E'>('All');
  const [sortField, setSortField] = useState<string>('surveyDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir(field === 'surveyDate' ? 'desc' : 'asc');
    }
  };

  const allRows = useMemo<SurveyRow[]>(() => {
    const passesDate = makeDateFilter(dateRange);
    return avirSurveys
      .filter((s) => passesFilter(s.facilityId) && passesDate(s.date))
      .map((s) => ({
        id: s.id,
        facilityId: s.facilityId,
        facilityName: s.facility,
        state: 'TX',
        region: s.region,
        surveyDate: s.date,
        surveyor: s.surveyor || '—',
        kTags: s.kTags,
        stateTags: s.nTags,
        eTags: s.eTags,
        totalCitations: s.total,
        isWaiver: s.isWaiver,
        isPending: s.isPending,
      }));
  }, [passesFilter, dateRange]);

  const regions = useMemo(() =>
    [...new Set(allRows.map((r) => r.region).filter(Boolean))].sort(),
  [allRows]);

  const filteredRows = useMemo(() => {
    let rows = regionFilter ? allRows.filter((r) => r.region === regionFilter) : allRows;
    if (latestOnly) {
      const latestByFacility = new Map<string, string>();
      rows.forEach((r) => {
        const current = latestByFacility.get(r.facilityId);
        if (!current || r.surveyDate > current) latestByFacility.set(r.facilityId, r.surveyDate);
      });
      rows = rows.filter((r) => latestByFacility.get(r.facilityId) === r.surveyDate);
    }
    return rows;
  }, [allRows, regionFilter, latestOnly]);

  const tagTypeTotals = useMemo(() => {
    const kTotal = filteredRows.reduce((s, r) => s + r.kTags, 0);
    const stateTotal = filteredRows.reduce((s, r) => s + r.stateTags, 0);
    const eTotal = filteredRows.reduce((s, r) => s + r.eTags, 0);
    return [
      { type: 'K' as const, label: 'K-Tags', subtitle: 'Life Safety Code', count: kTotal, path: '/citations-remix/tags/k' },
      { type: 'State' as const, label: 'N-Tags (State)', subtitle: 'State Regulations', count: stateTotal, path: '/citations-remix/tags/state' },
      { type: 'E' as const, label: 'E-Tags', subtitle: 'Emergency Preparedness', count: eTotal, path: '/citations-remix/tags/e' },
    ];
  }, [filteredRows]);

  const deficiencyFreeCount = useMemo(() => filteredRows.filter((r) => r.totalCitations === 0 && !r.isPending).length, [filteredRows]);

  const prevPeriodFilter = useMemo((): ((dateStr: string) => boolean) | null => {
    const REF = new Date('2026-04-05');
    const y = REF.getFullYear(); const m = REF.getMonth(); const d = REF.getDate();
    if (dateRange === 'all') return null;
    if (dateRange === '30d') {
      const s = new Date(y, m, d - 60); const e = new Date(y, m, d - 30);
      return (ds) => { const dt = new Date(ds); return dt >= s && dt < e; };
    }
    if (dateRange === '60d') {
      const s = new Date(y, m, d - 120); const e = new Date(y, m, d - 60);
      return (ds) => { const dt = new Date(ds); return dt >= s && dt < e; };
    }
    if (dateRange === '90d') {
      const s = new Date(y, m, d - 180); const e = new Date(y, m, d - 90);
      return (ds) => { const dt = new Date(ds); return dt >= s && dt < e; };
    }
    if (dateRange === 'ytd') {
      const s = new Date(y - 1, 0, 1); const e = new Date(y - 1, m, d);
      return (ds) => { const dt = new Date(ds); return dt >= s && dt <= e; };
    }
    if (dateRange.match(/^\d{4}-\d{2}$/)) {
      const [yr, mo] = dateRange.split('-').map(Number);
      const prev = new Date(yr, mo - 2, 1);
      const prevStr = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`;
      return (ds) => !!(ds && ds.startsWith(prevStr));
    }
    return null;
  }, [dateRange]);

  const topTags = useMemo(() => {
    const passesDate = makeDateFilter(dateRange);
    const filtered = avirCitations.filter((c) =>
      passesFilter(c.facilityId) &&
      passesDate(c.date) &&
      (!regionFilter || filteredRows.some((r) => r.facilityId === c.facilityId && r.surveyDate === c.date))
    );
    const map = new Map<string, { count: number; description: string; type: string }>();
    filtered.forEach((c) => {
      const existing = map.get(c.tag);
      const prefix = c.tag.split('-')[0];
      const type = prefix === 'K' ? 'K' : prefix === 'E' ? 'E' : 'N';
      if (existing) { existing.count++; }
      else { map.set(c.tag, { count: 1, description: c.description || '', type }); }
    });

    const prevMap = new Map<string, number>();
    if (prevPeriodFilter) {
      avirCitations
        .filter((c) => passesFilter(c.facilityId) && prevPeriodFilter(c.date))
        .forEach((c) => prevMap.set(c.tag, (prevMap.get(c.tag) || 0) + 1));
    }

    let entries = [...map.entries()];
    if (tagFilter !== 'All') {
      entries = entries.filter(([, v]) => v.type === tagFilter);
    }
    const sorted = entries.sort((a, b) => b[1].count - a[1].count).slice(0, 5);
    return sorted.map(([tag, v]) => ({
      tag, ...v,
      prevCount: prevPeriodFilter ? (prevMap.get(tag) ?? null) : null,
    }));
  }, [filteredRows, passesFilter, dateRange, regionFilter, prevPeriodFilter, tagFilter]);

  const sortedSurveys = useMemo(() => {
    const mul = sortDir === 'asc' ? 1 : -1;
    return [...filteredRows].sort((a, b) => {
      const av = (a as Record<string, unknown>)[sortField];
      const bv = (b as Record<string, unknown>)[sortField];
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * mul;
      return String(av ?? '').localeCompare(String(bv ?? '')) * mul;
    });
  }, [filteredRows, sortField, sortDir]);

  const totalCitations = filteredRows.reduce((s, r) => s + r.totalCitations, 0);

  // Card styles
  const cardOuterSx = {
    flex: 1, borderRadius: '8px', border: '1px solid #e0e4e7',
    bgcolor: '#eceef0',
    display: 'flex', flexDirection: 'column', alignItems: 'stretch', textAlign: 'left',
    cursor: 'pointer', '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  };
  const cardHeaderSx = { px: 2, py: 1, height: 44, display: 'flex', alignItems: 'center' };
  const cardBodySx = {
    bgcolor: 'white', borderRadius: '8px', borderTop: '1px solid #e0e4e7',
    p: 2, position: 'relative', flexGrow: 1,
    display: 'flex', flexDirection: 'column',
  };

  return (
    <Box>
      <PageHeader title="Survey Overview" />
      <PageFilters
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        extraFilters={
          <FormControl size="small" variant="filled" sx={{ minWidth: 220 }}>
            <InputLabel>Filter by CMS Region</InputLabel>
            <Select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}>
              <MenuItem value="">All regions</MenuItem>
              {regions.map((r) => (
                <MenuItem key={r} value={r}>{r}</MenuItem>
              ))}
            </Select>
          </FormControl>
        }
        afterFilters={
          <FormControlLabel
            control={<Switch checked={latestOnly} onChange={(e) => setLatestOnly(e.target.checked)} size="small" />}
            label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: '#293036' }}>Latest survey only</Typography>}
            sx={{ ml: 0.5 }}
          />
        }
        actions={
          <Button size="small" variant="contained" color="inherit" disableElevation startIcon={<FileDownloadIcon />}>
            Export
          </Button>
        }
      />

      {/* Summary Cards - 4 cards */}
      <Box sx={{ display: 'flex', gap: 2, my: 3 }}>
        {tagTypeTotals.map((t) => (
          <ButtonBase key={t.type} onClick={() => navigate(t.path)} sx={{ ...cardOuterSx }}>
            <Box sx={{ ...cardHeaderSx }}>
              <Typography sx={{ fontWeight: 600, fontSize: '16px', color: '#293036', letterSpacing: '-0.176px' }}>
                {t.label}
              </Typography>
            </Box>
            <Box sx={{ ...cardBodySx }}>
              <Typography sx={{ fontWeight: 600, fontSize: '36px', color: '#293036', lineHeight: '44px', letterSpacing: '-0.684px' }}>
                {t.count}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mt: '4px' }}>
                <Typography sx={{ fontWeight: 400, fontSize: '14px', color: '#293036', lineHeight: '16px', letterSpacing: '-0.084px' }}>
                  {t.subtitle}
                </Typography>
                <ArrowForwardIcon sx={{ fontSize: 16, color: '#0065BD' }} />
              </Box>
            </Box>
          </ButtonBase>
        ))}

        {/* Deficiency-Free */}
        <Box sx={{ ...cardOuterSx, bgcolor: '#c7f2df', border: '1px solid #abeccf', cursor: 'default' }}>
          <Box sx={{ ...cardHeaderSx }}>
            <Typography sx={{ fontWeight: 600, fontSize: '16px', color: '#0b2f1f', letterSpacing: '-0.176px' }}>
              Deficiency-Free Surveys
            </Typography>
          </Box>
          <Box sx={{ ...cardBodySx, borderTop: '1px solid #abeccf' }}>
            <Typography sx={{ fontWeight: 600, fontSize: '36px', color: '#196c46', lineHeight: '44px', letterSpacing: '-0.684px' }}>
              {deficiencyFreeCount}
            </Typography>
            <Typography sx={{ fontWeight: 400, fontSize: '14px', color: '#293036', lineHeight: '16px', letterSpacing: '-0.084px', mt: '4px' }}>
              Out of {filteredRows.length} Surveys this year
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Top 5 Tags */}
      <Paper elevation={0} sx={{ mb: 2, borderRadius: '8px', border: '1px solid #e0e4e7', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2, py: 2.5 }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#293036', letterSpacing: '-0.176px', whiteSpace: 'nowrap' }}>
            Top 5 Tags
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {(['All', 'K', 'N', 'E'] as const).map((f) => (
              <Chip
                key={f}
                label={f === 'All' ? 'All' : `${f}-Tags`}
                size="small"
                color="default"
                variant={tagFilter === f ? 'filled' : 'outlined'}
                icon={tagFilter === f ? <CheckCircleIcon sx={{ fontSize: '16px !important' }} /> : undefined}
                onClick={() => setTagFilter(f)}
              />
            ))}
          </Box>
        </Box>
        <TableContainer sx={{ bgcolor: '#e0e4e7' }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#e0e4e7' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#293036', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2, width: 95 }}>Tag</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#293036', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#293036', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2, width: 100 }} align="right">Count</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#293036', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2, whiteSpace: 'nowrap' }} align="right">vs Previous Period</TableCell>
                <TableCell sx={{ bgcolor: '#e0e4e7', width: 48, px: 0 }} />
              </TableRow>
            </TableHead>
            <TableBody sx={{ bgcolor: 'white' }}>
              {topTags.map((t, idx) => {
                const diff = t.prevCount !== null ? t.count - t.prevCount : null;
                const pctChange = t.prevCount && t.prevCount > 0 ? Math.round(Math.abs(diff!) / t.prevCount * 100) : null;
                const isLast = idx === topTags.length - 1;
                return (
                  <TableRow key={t.tag} hover sx={{
                    cursor: 'pointer', '&:hover': { bgcolor: '#F0F7FF' },
                    ...(isLast && { '& td': { borderBottom: 'none' } }),
                  }}
                    onClick={() => navigate(`/citations-remix/tags/${t.type.toLowerCase()}/${t.tag}`)}>
                    <TableCell sx={{ py: 1 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '14px', color: '#293036' }}>
                        {t.tag}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      <Typography sx={{ fontSize: '14px', color: '#293036' }}>
                        {t.description || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ py: 1 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '14px', color: '#293036' }}>{t.count}</Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ py: 1 }}>
                      {diff === null ? (
                        <Typography sx={{ color: '#94A3B8', fontSize: '14px' }}>—</Typography>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, color: diff > 0 ? '#DC2626' : diff < 0 ? '#16A34A' : '#64748B' }}>
                          <CancelIcon sx={{ fontSize: 16, color: diff > 0 ? '#DC2626' : '#16A34A' }} />
                          <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>
                            {pctChange !== null ? `${pctChange}%` : diff > 0 ? `+${diff}` : diff === 0 ? 'same' : `${diff}`}
                          </Typography>
                        </Box>
                      )}
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

      {/* Surveys Table */}
      <Paper elevation={0} sx={{ mb: 2, borderRadius: '8px', border: '1px solid #e0e4e7', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5 }}>
          <Typography sx={{ fontSize: '16px', color: '#293036', letterSpacing: '-0.176px' }}>
            <Box component="span" sx={{ fontWeight: 700 }}>{filteredRows.length} surveys</Box>
            <Box component="span" sx={{ fontWeight: 400 }}> - {totalCitations} total citations</Box>
          </Typography>
          <Button variant="contained" color="inherit" startIcon={<UploadFileIcon />} size="medium">
            Upload survey
          </Button>
        </Box>
        <TableContainer sx={{ bgcolor: '#e0e4e7' }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#e0e4e7' }}>
              <TableRow>
                {([
                  { field: 'surveyDate', label: 'Survey date', width: 160, align: 'center' as const },
                  { field: 'facilityName', label: 'Community', align: 'left' as const },
                  { field: 'surveyor', label: 'Surveyor', width: 160, align: 'left' as const },
                  { field: 'kTags', label: 'K-Tags', align: 'right' as const, nowrap: true },
                  { field: 'stateTags', label: 'N-Tags', align: 'right' as const, nowrap: true },
                  { field: 'eTags', label: 'E-Tags', align: 'right' as const, nowrap: true },
                  { field: 'totalCitations', label: 'Total', align: 'right' as const, nowrap: true },
                ] as const).map((col) => (
                  <TableCell
                    key={col.field}
                    align={col.align}
                    sx={{
                      fontWeight: 600, fontSize: '14px', color: '#293036', bgcolor: '#e0e4e7',
                      letterSpacing: '-0.084px', py: '6px', px: 2, cursor: 'pointer', userSelect: 'none',
                      whiteSpace: 'nowrap' in col && col.nowrap ? 'nowrap' : undefined,
                      width: 'width' in col ? col.width : undefined,
                      '&:hover': { color: '#0065BD' },
                    }}
                    onClick={() => handleSort(col.field)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, justifyContent: col.align === 'right' ? 'flex-end' : col.align === 'center' ? 'center' : 'flex-start' }}>
                      {col.label}
                      {sortField === col.field && (
                        sortDir === 'desc'
                          ? <ArrowDownwardIcon sx={{ fontSize: 16 }} />
                          : <ArrowUpwardIcon sx={{ fontSize: 16 }} />
                      )}
                    </Box>
                  </TableCell>
                ))}
                <TableCell sx={{ bgcolor: '#e0e4e7', width: 48, px: 0 }} />
              </TableRow>
            </TableHead>
            <TableBody sx={{ bgcolor: 'white' }}>
              {sortedSurveys.map((srv, idx) => {
                const isLast = idx === sortedSurveys.length - 1;
                return (
                  <TableRow key={srv.id} hover
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { bgcolor: srv.totalCitations === 0 ? '#c7f2df' : '#F0F7FF' },
                      bgcolor: srv.totalCitations === 0 ? '#e3f9ef' : 'inherit',
                      ...(isLast && { '& td': { borderBottom: 'none' } }),
                    }}
                    onClick={() => navigate(`/facility/${srv.facilityId}`)}>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#293036' }}>{fmtDate(srv.surveyDate)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#293036' }}>{srv.facilityName.replace('Avir at ', '')}</Typography>
                      <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#293036' }}>{srv.region}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#293036' }}>{srv.surveyor}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontSize: '14px', fontWeight: 400, color: srv.kTags ? '#293036' : '#94A3B8' }}>{srv.kTags || '—'}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontSize: '14px', fontWeight: 400, color: srv.stateTags ? '#293036' : '#94A3B8' }}>{srv.stateTags || '—'}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontSize: '14px', fontWeight: 400, color: srv.eTags ? '#293036' : '#94A3B8' }}>{srv.eTags || '—'}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#293036' }}>{srv.totalCitations}</Typography>
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

      {/* Tag Detail Drawer */}
      {tagDrawer && (() => {
        const { row, tagType } = tagDrawer;
        const facCits = avirCitations.filter((c) => c.facilityId === row.facilityId && c.date === row.surveyDate);
        const filtered = tagType === 'All' ? facCits : facCits.filter((c) => {
          const prefix = c.tag.split('-')[0];
          if (tagType === 'K') return prefix === 'K';
          if (tagType === 'E') return prefix === 'E';
          return prefix !== 'K' && prefix !== 'E';
        });
        const title = tagType === 'All' ? 'All Citations' : tagType === 'State' ? 'State Tags' : `${tagType}-Tags`;

        return (
          <Drawer anchor="right" open={true} onClose={() => setTagDrawer(null)}
            sx={{ zIndex: 1400, '& .MuiDrawer-paper': { width: 440, boxShadow: '-4px 0 24px rgba(0,0,0,0.12)' } }}>
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {row.facilityName.replace('Avir at ', '')} — {fmtDate(row.surveyDate)}
                  </Typography>
                </Box>
                <IconButton onClick={() => setTagDrawer(null)} size="small"><CloseIcon /></IconButton>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>{filtered.length} citation{filtered.length !== 1 ? 's' : ''}</Typography>
              {filtered.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No citations found.</Typography>
              ) : (
                filtered.map((c) => (
                  <Box key={c.id} sx={{ mb: 2, p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E0E4E7' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Chip label={c.tag} size="small" variant="outlined" sx={{ fontWeight: 700, fontFamily: 'monospace' }} />
                      <Chip label={c.status || 'Open'} size="small" sx={{
                        height: 20, fontSize: '0.65rem', fontWeight: 600,
                        bgcolor: c.status === 'Completed' ? '#DCFCE7' : c.status === 'Pending' ? '#FEF9C3' : c.status === 'NA' ? '#F1F5F9' : '#FEE2E2',
                        color: c.status === 'Completed' ? '#166534' : c.status === 'Pending' ? '#854D0E' : c.status === 'NA' ? '#475569' : '#991B1B',
                      }} />
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>{c.description}</Typography>
                    {c.observation && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, lineHeight: 1.4 }}>
                        {c.observation}
                      </Typography>
                    )}
                  </Box>
                ))
              )}
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" color="inherit" disableElevation onClick={() => setTagDrawer(null)}>Close</Button>
              </Box>
            </Box>
          </Drawer>
        );
      })()}

      {/* Surveyor Detail Drawer */}
      {(() => {
        if (!selectedSurveyor) return null;
        const surveyorRows = allRows.filter((r) => r.surveyor === selectedSurveyor);
        const totalSurveys = surveyorRows.length;
        const totalK = surveyorRows.reduce((s, r) => s + r.kTags, 0);
        const totalState = surveyorRows.reduce((s, r) => s + r.stateTags, 0);
        const totalE = surveyorRows.reduce((s, r) => s + r.eTags, 0);
        const totalCit = surveyorRows.reduce((s, r) => s + r.totalCitations, 0);
        const avgPerSurvey = totalSurveys > 0 ? (totalCit / totalSurveys).toFixed(1) : '0';
        const regionsServed = [...new Set(surveyorRows.map((r) => r.region))];
        const tagTotal = totalK + totalState + totalE;
        const kPct = tagTotal > 0 ? Math.round((totalK / tagTotal) * 100) : 0;
        const statePct = tagTotal > 0 ? Math.round((totalState / tagTotal) * 100) : 0;
        const ePct = tagTotal > 0 ? Math.round((totalE / tagTotal) * 100) : 0;
        const catCounts = new Map<string, number>();
        surveyorRows.forEach((sr) => {
          const facCits = avirCitations.filter((c) => c.facilityId === sr.facilityId && c.date === sr.surveyDate);
          facCits.forEach((c) => catCounts.set(c.description || c.tag, (catCounts.get(c.description || c.tag) || 0) + 1));
        });
        const topCats = [...catCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

        return (
          <Drawer anchor="right" open={true} onClose={() => setSelectedSurveyor(null)}
            sx={{ zIndex: 1400, '& .MuiDrawer-paper': { width: 420, boxShadow: '-4px 0 24px rgba(0,0,0,0.12)' } }}>
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PersonIcon sx={{ color: '#0065BD' }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{selectedSurveyor}</Typography>
                    <Typography variant="caption" color="text.secondary">Surveyor Profile</Typography>
                  </Box>
                </Box>
                <IconButton onClick={() => setSelectedSurveyor(null)} size="small"><CloseIcon /></IconButton>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 3 }}>
                <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary">Surveys</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{totalSurveys}</Typography>
                </Box>
                <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary">Avg Citations/Survey</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{avgPerSurvey}</Typography>
                </Box>
                <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary">Total Citations</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{totalCit}</Typography>
                </Box>
                <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary">Regions</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{regionsServed.join(', ')}</Typography>
                </Box>
              </Box>
              <Divider sx={{ mb: 2.5 }} />
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TrendingUpIcon sx={{ fontSize: 18, color: '#5c6874' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Tag Distribution</Typography>
                </Box>
                {[
                  { label: 'K-Tags (Life Safety)', count: totalK, pct: kPct, color: '#DC2626' },
                  { label: 'State Tags', count: totalState, pct: statePct, color: '#2563EB' },
                  { label: 'E-Tags (Emergency Prep)', count: totalE, pct: ePct, color: '#CA8A04' },
                ].map((tag) => (
                  <Box key={tag.label} sx={{ mb: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>{tag.label}</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>{tag.count} ({tag.pct}%)</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={tag.pct}
                      sx={{ height: 8, borderRadius: 4, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { bgcolor: tag.color, borderRadius: 4 } }} />
                  </Box>
                ))}
              </Box>
              <Divider sx={{ mb: 2.5 }} />
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>Top Citation Categories</Typography>
                {topCats.map(([cat, count]) => (
                  <Box key={cat} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75, borderBottom: '1px solid #F1F5F9' }}>
                    <Typography variant="caption" sx={{ maxWidth: 280 }}>{cat}</Typography>
                    <Chip label={count} size="small" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700 }} />
                  </Box>
                ))}
              </Box>
              <Divider sx={{ mb: 2.5 }} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>Survey History</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#F0F2F4' }}>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', py: 0.75 }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', py: 0.75 }}>Community</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', py: 0.75 }}>K</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', py: 0.75 }}>State</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', py: 0.75 }}>E</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', py: 0.75 }}>Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {surveyorRows.sort((a, b) => b.surveyDate.localeCompare(a.surveyDate)).map((sr) => (
                        <TableRow key={sr.id} hover sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#F0F7FF' } }}
                          onClick={() => { setSelectedSurveyor(null); navigate(`/facility/${sr.facilityId}`); }}>
                          <TableCell sx={{ fontSize: '0.75rem', py: 0.75 }}>{fmtDate(sr.surveyDate)}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem', py: 0.75 }}>{sr.facilityName.replace('Avir at ', '')}</TableCell>
                          <TableCell align="right" sx={{ fontSize: '0.75rem', py: 0.75 }}>{sr.kTags}</TableCell>
                          <TableCell align="right" sx={{ fontSize: '0.75rem', py: 0.75 }}>{sr.stateTags}</TableCell>
                          <TableCell align="right" sx={{ fontSize: '0.75rem', py: 0.75 }}>{sr.eTags}</TableCell>
                          <TableCell align="right" sx={{ fontSize: '0.75rem', py: 0.75, fontWeight: 700 }}>{sr.totalCitations}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" color="inherit" disableElevation onClick={() => setSelectedSurveyor(null)}>Close</Button>
              </Box>
            </Box>
          </Drawer>
        );
      })()}
    </Box>
  );
}
