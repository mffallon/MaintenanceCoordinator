import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper,
  Button, IconButton, Menu, FormControlLabel, Switch,
  Drawer, Divider, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  LinearProgress, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
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
  const [viewMenuAnchor, setViewMenuAnchor] = useState<null | HTMLElement>(null);
  const [hiddenCols, setHiddenCols] = useState<Set<string>>(new Set());
  const [selectedSurveyor, setSelectedSurveyor] = useState<string | null>(null);
  const [regionFilter, setRegionFilter] = useState('');
  const [latestOnly, setLatestOnly] = useState(true);
  const [tagDrawer, setTagDrawer] = useState<{ row: SurveyRow; tagType: 'K' | 'State' | 'E' | 'All' } | null>(null);

  // Build survey-level rows directly from Avir survey data
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

  const toggleCol = (col: string) => {
    setHiddenCols((prev) => {
      const next = new Set(prev);
      if (next.has(col)) next.delete(col); else next.add(col);
      return next;
    });
  };

  const columns: GridColDef[] = [
    {
      field: 'surveyDate', headerName: 'Survey Date', flex: 0.7, minWidth: 100,
      renderCell: (p: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{fmtDate(p.value as string)}</Typography>
      ),
    },
    {
      field: 'facilityName', headerName: 'Community', flex: 1.2, minWidth: 180,
      renderCell: (p: GridRenderCellParams) => (
        <Box sx={{ lineHeight: 1.3 }}>
          <Typography variant="body2" sx={{
            fontWeight: 600, color: '#293036', fontSize: '0.8rem',
            lineHeight: 1.3, mb: 0,
          }}>
            {(p.value as string).replace('Avir at ', '')}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2, display: 'block' }}>{p.row.region}</Typography>
        </Box>
      ),
    },
    {
      field: 'surveyor', headerName: 'Surveyor', flex: 0.7, minWidth: 110,
      renderCell: (p: GridRenderCellParams) => (
        <Typography variant="body2" sx={{
          fontWeight: 500, color: '#0065BD', cursor: 'pointer', fontSize: '0.85rem',
          '&:hover': { textDecoration: 'underline' },
        }} onClick={(e) => { e.stopPropagation(); setSelectedSurveyor(p.value as string); }}>
          {p.value as string}
        </Typography>
      ),
    },
    {
      field: 'totalCitations', headerName: 'Total Citations', flex: 0.5, minWidth: 80, align: 'center' as const, headerAlign: 'center' as const, type: 'number' as const,
      renderCell: (p: GridRenderCellParams) => {
        const v = p.value as number;
        return v > 0 ? (
          <Typography variant="body2" sx={{ cursor: 'pointer', color: '#0065BD', fontWeight: 700, '&:hover': { textDecoration: 'underline' } }}
            onClick={(e) => { e.stopPropagation(); setTagDrawer({ row: p.row as SurveyRow, tagType: 'All' }); }}>{v}</Typography>
        ) : <Typography variant="body2" color="text.secondary">0</Typography>;
      },
    },
    {
      field: 'kTags', headerName: 'K-Tags', flex: 0.4, minWidth: 70, align: 'center' as const, headerAlign: 'center' as const, type: 'number' as const,
      renderCell: (p: GridRenderCellParams) => {
        const v = p.value as number;
        return v > 0 ? (
          <Typography variant="body2" sx={{ cursor: 'pointer', color: '#0065BD', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
            onClick={(e) => { e.stopPropagation(); setTagDrawer({ row: p.row as SurveyRow, tagType: 'K' }); }}>{v}</Typography>
        ) : <Typography variant="body2" color="text.secondary">0</Typography>;
      },
    },
    {
      field: 'stateTags', headerName: 'State Tags', flex: 0.5, minWidth: 80, align: 'center' as const, headerAlign: 'center' as const, type: 'number' as const,
      renderCell: (p: GridRenderCellParams) => {
        const v = p.value as number;
        return v > 0 ? (
          <Typography variant="body2" sx={{ cursor: 'pointer', color: '#0065BD', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
            onClick={(e) => { e.stopPropagation(); setTagDrawer({ row: p.row as SurveyRow, tagType: 'State' }); }}>{v}</Typography>
        ) : <Typography variant="body2" color="text.secondary">0</Typography>;
      },
    },
    {
      field: 'eTags', headerName: 'E-Tags', flex: 0.4, minWidth: 70, align: 'center' as const, headerAlign: 'center' as const, type: 'number' as const,
      renderCell: (p: GridRenderCellParams) => {
        const v = p.value as number;
        return v > 0 ? (
          <Typography variant="body2" sx={{ cursor: 'pointer', color: '#0065BD', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
            onClick={(e) => { e.stopPropagation(); setTagDrawer({ row: p.row as SurveyRow, tagType: 'E' }); }}>{v}</Typography>
        ) : <Typography variant="body2" color="text.secondary">0</Typography>;
      },
    },
    {
      field: '_nav', headerName: '', width: 40, sortable: false, disableColumnMenu: true,
      renderCell: () => <ChevronRightIcon sx={{ fontSize: 20, color: '#8492a1' }} />,
    },
  ].filter((c) => !hiddenCols.has(c.field));

  const toggleableCols = [
    { field: 'surveyDate', label: 'Survey Date' },
    { field: 'surveyor', label: 'Surveyor' },
    { field: 'kTags', label: 'K-Tags' },
    { field: 'stateTags', label: 'State Tags' },
    { field: 'eTags', label: 'E-Tags' },
  ];

  // Compute tag type totals across filtered rows (respects surveyor + date + community filters)
  const tagTypeTotals = useMemo(() => {
    const kTotal = filteredRows.reduce((s, r) => s + r.kTags, 0);
    const stateTotal = filteredRows.reduce((s, r) => s + r.stateTags, 0);
    const eTotal = filteredRows.reduce((s, r) => s + r.eTags, 0);
    return [
      { type: 'K' as const, label: 'K-Tags', subtitle: 'Life Safety Code', count: kTotal },
      { type: 'State' as const, label: 'N-Tags (State)', subtitle: 'State Regulations', count: stateTotal },
      { type: 'E' as const, label: 'E-Tags', subtitle: 'Emergency Preparedness', count: eTotal },
    ];
  }, [filteredRows]);

  const deficiencyFreeCount = useMemo(() => filteredRows.filter((r) => r.totalCitations === 0 && !r.isPending).length, [filteredRows]);

  // Build a filter for the previous equivalent period
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

  // Top 5 most common tags across filtered citations, with prev-period trend
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

    // Previous period counts for trend
    const prevMap = new Map<string, number>();
    if (prevPeriodFilter) {
      avirCitations
        .filter((c) => passesFilter(c.facilityId) && prevPeriodFilter(c.date))
        .forEach((c) => prevMap.set(c.tag, (prevMap.get(c.tag) || 0) + 1));
    }

    const sorted = [...map.entries()].sort((a, b) => b[1].count - a[1].count).slice(0, 5);
    return sorted.map(([tag, v]) => ({
      tag, ...v,
      prevCount: prevPeriodFilter ? (prevMap.get(tag) ?? null) : null,
    }));
  }, [filteredRows, passesFilter, dateRange, regionFilter, prevPeriodFilter]);

  return (
    <Box>
      <PageHeader title="Survey Overview" />
      <PageFilters
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        extraFilters={
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel>CMS Region</InputLabel>
            <Select value={regionFilter} label="CMS Region" onChange={(e) => setRegionFilter(e.target.value)}>
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

      {/* Tag Type Callouts */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Paper sx={{
          p: 2, flex: 1, borderRadius: 3, border: '1px solid #BBF7D0',
          bgcolor: '#F0FDF4', transition: 'box-shadow 0.15s',
        }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#166534' }}>Deficiency Free</Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, my: 0.5, color: '#16A34A' }}>{deficiencyFreeCount}</Typography>
          <Typography variant="caption" sx={{ color: '#15803D' }}>Of {filteredRows.length} surveys completed</Typography>
        </Paper>
        {tagTypeTotals.map((t) => (
          <Paper key={t.type} sx={{
            p: 2, flex: 1, borderRadius: 3, border: '1px solid #E0E4E7',
            cursor: 'pointer', transition: 'box-shadow 0.15s',
            '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
          }} onClick={() => navigate(`/citations-remix/tags/${t.type.toLowerCase()}`)}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#5c6874' }}>{t.label}</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, my: 0.5 }}>{t.count}</Typography>
            <Typography variant="caption" color="text.secondary">{t.subtitle}</Typography>
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#0065BD', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                View all <Box component="span" sx={{ fontSize: '1rem' }}>&rarr;</Box>
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>


      {/* Top 5 Tags */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 3, border: '1px solid #E0E4E7' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>Top 5 Tags</Typography>
        </Box>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#F8FAFC' }}>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.72rem', color: '#64748B', py: 0.75, width: 90 }}>Tag</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.72rem', color: '#64748B', py: 0.75 }}>Description</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.72rem', color: '#64748B', py: 0.75, width: 60 }}>Count</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.72rem', color: '#64748B', py: 0.75, width: 120 }}>vs Prior Period</TableCell>
              <TableCell sx={{ width: 32 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {topTags.map((t) => {
              const tagColor = t.type === 'K' ? '#991B1B' : t.type === 'E' ? '#854D0E' : '#1E40AF';
              const diff = t.prevCount !== null ? t.count - t.prevCount : null;
              const trendIcon = diff === null ? null
                : diff > 0 ? <TrendingUpIcon sx={{ fontSize: 16 }} />
                : diff < 0 ? <TrendingDownIcon sx={{ fontSize: 16 }} />
                : <TrendingFlatIcon sx={{ fontSize: 16 }} />;
              const trendColor = diff === null ? '#94A3B8'
                : diff > 0 ? '#DC2626'
                : diff < 0 ? '#16A34A'
                : '#64748B';
              return (
                <TableRow key={t.tag} hover sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#F0F7FF' } }}
                  onClick={() => navigate(`/citations-remix/tags/${t.type.toLowerCase()}/${t.tag}`)}>
                  <TableCell sx={{ py: 1 }}>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 700, color: tagColor, fontSize: '0.8rem' }}>
                      {t.tag}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Typography variant="caption" sx={{ color: '#293036', fontSize: '0.78rem' }}>
                      {t.description || '—'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ py: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>{t.count}</Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    {diff === null ? (
                      <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.75rem' }}>—</Typography>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: trendColor }}>
                        {trendIcon}
                        <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.78rem', color: trendColor }}>
                          {diff > 0 ? `+${diff}` : diff === 0 ? 'same' : diff}
                        </Typography>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell sx={{ py: 1, pl: 0, pr: 0.5 }}>
                    <ChevronRightIcon sx={{ fontSize: 18, color: '#8492a1', display: 'block' }} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>

      {/* Summary line */}
      <Paper sx={{ px: 2, py: 1, borderRadius: 0, border: '1px solid #E0E4E7', borderBottom: 'none', bgcolor: '#FAFBFC' }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#293036' }}>
          {filteredRows.length} surveys
          <Typography component="span" variant="body2" sx={{ color: '#5c6874', ml: 1 }}>
            {filteredRows.reduce((s, r) => s + r.totalCitations, 0)} total citations
          </Typography>
        </Typography>
      </Paper>

      {/* Table */}
      <Paper sx={{ borderRadius: '0 0 12px 12px', border: '1px solid #E0E4E7', overflow: 'hidden' }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
            sorting: { sortModel: [{ field: 'surveyDate', sort: 'desc' }] },
          }}
          pageSizeOptions={[10, 25, 50]}
          disableColumnMenu
          disableRowSelectionOnClick
          rowHeight={52}
          getRowClassName={(params) => params.row.totalCitations === 0 ? 'def-free-row' : ''}
          onRowClick={(params) => navigate(`/facility/${params.row.facilityId}`)}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': { bgcolor: '#e0e4e7', borderBottom: 'none' },
            '& .MuiDataGrid-columnHeader': { bgcolor: '#e0e4e7' },
            '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 400, fontSize: '14px', color: '#293036', letterSpacing: '-0.084px', lineHeight: '16px' },
            '& .MuiDataGrid-columnSeparator': { display: 'none' },
            '& .MuiDataGrid-row': { cursor: 'pointer', '&:hover': { bgcolor: '#F0F7FF' } },
            '& .MuiDataGrid-row.def-free-row': { bgcolor: '#F0FDF4', '&:hover': { bgcolor: '#DCFCE7' } },
            '& .MuiDataGrid-cell': { borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center' },
          }}
          autoHeight
        />
      </Paper>

      {/* Tag Detail Drawer */}
      {tagDrawer && (() => {
        const { row, tagType } = tagDrawer;
        const facCits = avirCitations.filter((c) => c.facilityId === row.facilityId && c.date === row.surveyDate);
        const filtered = tagType === 'All' ? facCits : facCits.filter((c) => {
          const prefix = c.tag.split('-')[0];
          if (tagType === 'K') return prefix === 'K';
          if (tagType === 'E') return prefix === 'E';
          return prefix !== 'K' && prefix !== 'E'; // State
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
                    {c.isWaiver && (
                      <Chip label="Waiver" size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600, bgcolor: '#EDE9FE', color: '#5B21B6' }} />
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
        const statesServed = [...new Set(surveyorRows.map((r) => r.state))];

        // Tag distribution percentages
        const tagTotal = totalK + totalState + totalE;
        const kPct = tagTotal > 0 ? Math.round((totalK / tagTotal) * 100) : 0;
        const statePct = tagTotal > 0 ? Math.round((totalState / tagTotal) * 100) : 0;
        const ePct = tagTotal > 0 ? Math.round((totalE / tagTotal) * 100) : 0;

        // Top tag descriptions from this surveyor's citations
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
              {/* Header */}
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

              {/* Summary Stats */}
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

              {/* Tag Distribution */}
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

              {/* Top Citation Categories */}
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

              {/* Survey History */}
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
                          <TableCell sx={{ fontSize: '0.75rem', py: 0.75 }}>
                            {sr.facilityName.replace('Avir at ', '')}
                          </TableCell>
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

              {/* Close button */}
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" color="inherit" disableElevation onClick={() => setSelectedSurveyor(null)}>
                  Close
                </Button>
              </Box>
            </Box>
          </Drawer>
        );
      })()}

    </Box>
  );
}
