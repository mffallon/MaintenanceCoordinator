import { useMemo, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box, Typography, Paper, Chip, LinearProgress, Divider, Drawer, IconButton, Button, Menu, MenuItem as MuiMenuItem, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  FormControl, InputLabel, Select, MenuItem,
  FormControlLabel, Switch,
} from '@mui/material';
import { DataGridPro } from '@mui/x-data-grid-pro';
import type { GridColDef } from '@mui/x-data-grid-pro';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import CloseIcon from '@mui/icons-material/Close';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon2 from '@mui/icons-material/ChevronRight';
import SellIcon from '@mui/icons-material/Sell';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import { facilities, citations, surveys, kTagHistory, nTagHistory, eTagHistory, tagDescriptions } from '../data/avir-data';
import type { AvirKTagHistory } from '../data/avir-data';
import { useCommunityFilter } from '../components/CommunityFilter';
import PageHeader from '../components/PageHeader';
import PageFilters from '../components/PageFilters';
import { fmtDate } from '../utils/formatDate';
import { makeDateFilter } from '../utils/dateFilter';

const typeLabels: Record<string, { title: string; subtitle: string }> = {
  k: { title: 'K-Tags', subtitle: 'Life Safety Code Citations' },
  state: { title: 'N-Tags (State)', subtitle: 'State Regulation Citations' },
  e: { title: 'E-Tags', subtitle: 'Emergency Preparedness Citations' },
};

export default function TagTypeDetail() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { passesFilter } = useCommunityFilter();
  const info = typeLabels[type || ''] || typeLabels.k;
  const [dateRange, setDateRange] = useState(searchParams.get('dateRange') || 'all');
  const [regionFilter, setRegionFilter] = useState(searchParams.get('region') || '');
  const [latestOnly, setLatestOnly] = useState(searchParams.get('latestOnly') === '1');
  const gridPaperRef = useRef<HTMLDivElement>(null);
  const [jumpMenuAnchor, setJumpMenuAnchor] = useState<null | HTMLElement>(null);
  const [jumpSearch, setJumpSearch] = useState('');
  const [scrolledRight, setScrolledRight] = useState(false);
  const scrollTableRight = () => {
    const scroller = gridPaperRef.current?.querySelector('.MuiDataGrid-virtualScroller') as HTMLDivElement | null;
    if (scroller) {
      scroller.scrollBy({ left: 400, behavior: 'smooth' });
      setTimeout(() => setScrolledRight(scroller.scrollLeft > 10), 500);
    }
  };
  const scrollTableLeft = () => {
    const scroller = gridPaperRef.current?.querySelector('.MuiDataGrid-virtualScroller') as HTMLDivElement | null;
    if (scroller) {
      scroller.scrollBy({ left: -400, behavior: 'smooth' });
      setTimeout(() => setScrolledRight(scroller.scrollLeft > 10), 500);
    }
  };

  const [drawerCitation, setDrawerCitation] = useState<{ tag: string; facility: string; facilityId: string; date: string; region: string; surveyor: string; description: string; observation: string; status: string } | null>(null);


  // Look up citation detail from citations array
  const openCitationDrawer = (facilityId: string, date: string, tag: string) => {
    const cit = citations.find((c) => c.facilityId === facilityId && c.date === date && c.tag === tag);
    if (cit) {
      setDrawerCitation({ tag: cit.tag, facility: cit.facility, facilityId: cit.facilityId, date: cit.date, region: cit.region, surveyor: cit.surveyor, description: cit.description, observation: cit.observation, status: cit.status });
    } else {
      // No detail available (e.g. 2025 K-tag history without observation data)
      const fac = facilities.find((f) => f.id === facilityId);
      setDrawerCitation({ tag, facility: fac?.name || '', facilityId, date, region: fac?.region || '', surveyor: '', description: '', observation: 'No observation details available for this citation.', status: '' });
    }
  };

  // Get the right history dataset
  const rawHistory = type === 'k' ? kTagHistory : type === 'e' ? eTagHistory : nTagHistory;
  const tagPrefix = type === 'k' ? 'K' : type === 'e' ? 'E' : 'N';

  // Build waiver lookup set
  const waiverFacilityDates = useMemo(() =>
    new Set(surveys.filter((s) => s.isWaiver).map((s) => `${s.facilityId}__${s.date}`)),
  []);

  // Filter by community, date range, and exclude waiver surveys
  const filteredHistory = useMemo(() => {
    const passesDate = makeDateFilter(dateRange);
    return rawHistory.filter((h) =>
      passesFilter(h.facilityId) &&
      passesDate(h.date) &&
      !waiverFacilityDates.has(`${h.facilityId}__${h.date}`)
    );
  }, [rawHistory, passesFilter, dateRange, waiverFacilityDates]);

  const regions = useMemo(() =>
    [...new Set(filteredHistory.map((h) => h.region).filter(Boolean))].sort(),
  [filteredHistory]);

  const displayedHistory = useMemo(() => {
    let rows = regionFilter ? filteredHistory.filter((h) => h.region === regionFilter) : filteredHistory;
    if (latestOnly) {
      const latestByFacility = new Map<string, string>();
      rows.forEach((h) => {
        const current = latestByFacility.get(h.facilityId);
        if (!current || h.date > current) latestByFacility.set(h.facilityId, h.date);
      });
      rows = rows.filter((h) => latestByFacility.get(h.facilityId) === h.date);
    }
    return rows;
  }, [filteredHistory, regionFilter, latestOnly]);

  // Collect all unique tags across filtered rows for dynamic columns
  const allUniqueTags = useMemo(() => {
    const tagSet = new Set<string>();
    displayedHistory.forEach((h) => h.citedTags.forEach((t) => tagSet.add(t)));
    return [...tagSet].sort((a, b) => {
      // Sort by numeric portion
      const numA = parseInt(a.replace(/[^0-9]/g, ''), 10);
      const numB = parseInt(b.replace(/[^0-9]/g, ''), 10);
      return numA - numB;
    });
  }, [displayedHistory]);

  // Build columns: fixed + dynamic tag columns
  const columns: GridColDef[] = useMemo(() => {
    const fixed: GridColDef[] = [
      {
        field: 'date', headerName: 'Survey date', width: 145, align: 'right' as const, headerAlign: 'right' as const,
        renderCell: (p) => (
          <Typography sx={{ fontWeight: 400, fontSize: '14px', color: '#293036' }}>{fmtDate(p.value as string)}</Typography>
        ),
      },
      {
        field: 'facility', headerName: 'Community', width: 280,
        renderCell: (p) => {
          if (p.row._isTotalRow) return <Typography sx={{ fontWeight: 700, fontSize: '14px', color: '#293036' }}>Total</Typography>;
          return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '14px', color: '#293036', lineHeight: '16px' }}>
                {(p.value as string).replace('Avir at ', '')}
              </Typography>
              <Typography sx={{ fontWeight: 400, fontSize: '14px', color: '#293036', lineHeight: '16px' }}>{p.row.region}</Typography>
            </Box>
          );
        },
      },
      { field: 'surveyRegion', headerName: 'CMS Region', width: 160,
        renderCell: (p) => (
          <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#293036' }}>{(p.value as string) || '—'}</Typography>
        ),
      },
      { field: 'surveyor', headerName: 'Surveyor', width: 155,
        renderCell: (p) => (
          <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#293036' }}>{(p.value as string) || '—'}</Typography>
        ),
      },
      {
        field: 'total', headerName: 'Total', width: 100, align: 'right' as const, headerAlign: 'right' as const, type: 'number' as const,
        renderCell: (p) => (
          <Typography sx={{ fontWeight: 700, fontSize: '14px', color: '#293036' }}>{p.value}</Typography>
        ),
      },
    ];

    const tagCols: GridColDef[] = allUniqueTags.map((tag) => ({
      field: `tag_${tag}`,
      headerName: tag.replace(/^[KNE]-?/, ''),
      width: 85,
      align: 'right' as const,
      headerAlign: 'right' as const,
      sortable: false,
      renderCell: (p) => {
        if (p.row._isTotalRow) {
          const count = p.value as number;
          return count > 0 ? <Typography sx={{ fontWeight: 700, fontSize: '14px', color: '#293036' }}>{count}</Typography> : <Typography sx={{ fontSize: '14px', color: '#94A3B8' }}>—</Typography>;
        }
        const cited = p.value === 1;
        const waiver = p.row[`waiver_${tag}`] === 1;
        const handleClick = () => openCitationDrawer(p.row.facilityId as string, p.row.date as string, tag);
        if (waiver) return <Chip label="W" size="small" onClick={handleClick} sx={{ fontWeight: 700, fontSize: '13px', bgcolor: '#FEF9C3', color: '#854D0E', minWidth: 28, cursor: 'pointer' }} />;
        if (cited) return <Chip label="X" size="small" onClick={handleClick} sx={{ fontWeight: 700, fontSize: '13px', minWidth: 28, cursor: 'pointer' }} />;
        return <Typography sx={{ fontSize: '14px', color: '#94A3B8' }}>—</Typography>;
      },
    }));

    return [...fixed, ...tagCols];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allUniqueTags, navigate]);

  // Build rows with dynamic tag fields
  const rows = useMemo(() => {
    const dataRows = displayedHistory.map((h) => {
      const row: Record<string, unknown> = {
        id: h.id,
        date: h.date,
        region: h.region,
        facility: h.facility,
        facilityId: h.facilityId,
        surveyRegion: h.surveyRegion,
        surveyor: h.surveyor,
        total: h.total,
        _isTotalRow: false,
      };
      for (const tag of allUniqueTags) {
        row[`tag_${tag}`] = h.citedTags.includes(tag) ? 1 : 0;
        row[`waiver_${tag}`] = h.waiverTags.includes(tag) ? 1 : 0;
      }
      return row;
    });

    return dataRows;
  }, [displayedHistory, allUniqueTags]);

  // Pinned totals row
  const pinnedRows = useMemo(() => {
    const totalsRow: Record<string, unknown> = {
      id: '__totals__',
      date: '',
      region: '',
      facility: 'Total',
      facilityId: '',
      surveyRegion: '',
      surveyor: '',
      total: rows.reduce((s, r) => s + (r.total as number), 0),
      _isTotalRow: true,
    };
    for (const tag of allUniqueTags) {
      totalsRow[`tag_${tag}`] = rows.reduce((s, r) => s + (r[`tag_${tag}`] as number), 0);
      totalsRow[`waiver_${tag}`] = 0;
    }
    return { top: [totalsRow] };
  }, [rows, allUniqueTags]);

  // Top 5 most cited tags for summary cards
  const tagBreakdown = useMemo(() => {
    const tagType = type === 'k' ? 'K' : type === 'e' ? 'E' : 'N';
    const passesDate = makeDateFilter(dateRange);
    const tagCitations = citations.filter((c) => c.tagType === tagType && passesFilter(c.facilityId) && passesDate(c.date));
    const counts = new Map<string, {
      tag: string; desc: string; count: number;
      facilities: Set<string>; statuses: Map<string, number>;
    }>();
    tagCitations.forEach((c) => {
      const existing = counts.get(c.tag);
      const status = c.status || 'Open';
      if (existing) {
        existing.count++;
        existing.facilities.add(c.facilityId);
        existing.statuses.set(status, (existing.statuses.get(status) || 0) + 1);
      } else {
        counts.set(c.tag, {
          tag: c.tag, desc: c.description, count: 1,
          facilities: new Set([c.facilityId]),
          statuses: new Map([[status, 1]]),
        });
      }
    });
    return [...counts.values()].sort((a, b) => b.count - a.count).slice(0, 5);
  }, [type, passesFilter, dateRange]);

  // Overall status breakdown for the bar chart
  const overallStatusBreakdown = useMemo(() => {
    const tagType = type === 'k' ? 'K' : type === 'e' ? 'E' : 'N';
    const passesDate = makeDateFilter(dateRange);
    const tagCitations = citations.filter((c) => c.tagType === tagType && passesFilter(c.facilityId) && passesDate(c.date));
    const map = new Map<string, number>();
    tagCitations.forEach((c) => {
      const s = c.status || 'Open';
      map.set(s, (map.get(s) || 0) + 1);
    });
    const order = ['Open', 'Pending', 'Completed', 'NA'];
    const colors: Record<string, string> = { Open: '#DC2626', Pending: '#F59E0B', Completed: '#16A34A', NA: '#94A3B8' };
    const total = [...map.values()].reduce((a, b) => a + b, 0);
    return { entries: order.filter((s) => map.has(s)).map((s) => ({ status: s, count: map.get(s)!, pct: total > 0 ? (map.get(s)! / total) * 100 : 0, color: colors[s] })), total };
  }, [type, passesFilter, dateRange]);

  return (
    <Box>
      <PageHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <span>{info.title}</span>
            <Button
              variant="contained" color="inherit" size="small"
              startIcon={<SellIcon sx={{ fontSize: '16px !important' }} />}
              endIcon={<KeyboardArrowDownIcon />}
              onClick={(e) => { setJumpMenuAnchor(e.currentTarget); setJumpSearch(''); }}
              sx={{ fontWeight: 600, fontSize: '0.875rem' }}
            >
              Jump to {tagPrefix}-Tag
            </Button>
            <Menu
              anchorEl={jumpMenuAnchor}
              open={Boolean(jumpMenuAnchor)}
              onClose={() => setJumpMenuAnchor(null)}
              PaperProps={{ sx: { maxHeight: 320, width: 300 } }}
            >
              <Box sx={{ px: 1.5, py: 1, position: 'sticky', top: 0, bgcolor: 'white', zIndex: 1 }}>
                <TextField
                  size="small" fullWidth placeholder="Search tags..."
                  value={jumpSearch} onChange={(e) => setJumpSearch(e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
                  autoFocus
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </Box>
              {allUniqueTags
                .filter((t) => !jumpSearch || t.toLowerCase().includes(jumpSearch.toLowerCase()) || (tagDescriptions.get(t) || '').toLowerCase().includes(jumpSearch.toLowerCase()))
                .map((tag) => (
                  <MuiMenuItem key={tag} onClick={() => { setJumpMenuAnchor(null); navigate(`/citations-remix/tags/${type}/${tag}`); }}
                    sx={{ fontSize: '14px' }}>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>{tag}</Typography>
                      {tagDescriptions.get(tag) && (
                        <Typography sx={{ fontSize: '12px', color: '#64748B' }}>{tagDescriptions.get(tag)}</Typography>
                      )}
                    </Box>
                  </MuiMenuItem>
                ))}
            </Menu>
          </Box>
        }
        backLabel="Back to surveys"
        onBack={() => navigate('/citations-remix')}
      />
      <PageFilters
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        extraFilters={
          <FormControl size="small" variant="filled" sx={{ minWidth: 220, '& .MuiFilledInput-root': { bgcolor: '#fff', '&:hover': { bgcolor: '#fff' }, '&.Mui-focused': { bgcolor: '#fff' } } }}>
            <InputLabel shrink>CMS Region</InputLabel>
            <Select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              displayEmpty
              renderValue={(v) => v ? (v as string) : 'All regions'}
            >
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
      />


      {/* Top 5 Tags */}
      {tagBreakdown.length > 0 && (
        <Paper elevation={0} sx={{ mb: 2, borderRadius: '8px', border: '1px solid #e0e4e7', overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 2.5 }}>
            <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#293036', letterSpacing: '-0.176px' }}>
              Top 5 {info.title}
            </Typography>
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
              {tagBreakdown.map((t, idx) => {
                const isLast = idx === tagBreakdown.length - 1;
                return (
                  <TableRow key={t.tag} sx={{
                    '&:hover': { bgcolor: '#F0F7FF' }, cursor: 'pointer',
                    ...(isLast && { '& td': { borderBottom: 'none' } }),
                  }}
                    onClick={() => navigate(`/citations-remix/tags/${type}/${t.tag}`)}>
                    <TableCell sx={{ py: 1, px: 2 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '14px', color: '#293036' }}>{t.tag}</Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1, px: 2 }}>
                      <Typography sx={{ fontSize: '14px', color: '#293036' }}>
                        {t.desc.length > 80 ? t.desc.slice(0, 80) + '...' : t.desc}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ py: 1, px: 2 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '14px', color: '#293036' }}>{t.count}</Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ py: 1, px: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, color: '#DC2626' }}>
                        <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: '#DC2626', flexShrink: 0 }} />
                        <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#DC2626' }}>80%</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ px: 1 }}>
                      <IconButton size="small">
                        <ChevronRightIcon sx={{ fontSize: 18, color: '#293036' }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          </TableContainer>
        </Paper>
      )}

      {/* DataGrid Table */}
      <Paper ref={gridPaperRef} elevation={0} sx={{ mb: 2, borderRadius: '8px', border: '1px solid #e0e4e7', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5 }}>
          <Typography sx={{ fontSize: '16px', color: '#293036', letterSpacing: '-0.176px' }}>
            <Box component="span" sx={{ fontWeight: 700 }}>{allUniqueTags.length} unique tags</Box>
            <Box component="span" sx={{ fontWeight: 400 }}> - {displayedHistory.reduce((s, h) => s + h.total, 0)} total citations</Box>
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {scrolledRight && (
              <IconButton size="small" onClick={scrollTableLeft} sx={{ color: '#0065BD' }}>
                <ChevronLeftIcon />
              </IconButton>
            )}
            <IconButton size="small" onClick={scrollTableRight} sx={{ color: '#0065BD' }}>
              <ChevronRightIcon2 />
            </IconButton>
          </Box>
        </Box>
        <DataGridPro
          rows={rows}
          columns={columns}
          pinnedRows={pinnedRows}
          rowHeight={56}
          columnHeaderHeight={36}
          disableColumnMenu
          disableRowSelectionOnClick
          pageSizeOptions={[15, 25, 50, 100]}
          initialState={{
            pagination: { paginationModel: { pageSize: 15 } },
            sorting: { sortModel: [{ field: 'date', sort: 'desc' }] },
            pinnedColumns: { left: ['date', 'facility'] },
          }}
          pagination
          getRowClassName={(params) => {
            if (params.row._isTotalRow) return 'totals-row';
            return params.row.total === 0 ? 'def-free-row' : '';
          }}
          sx={{
            border: 'none',
            borderRadius: '0 !important',
            '& .MuiDataGrid-columnHeaders': { bgcolor: '#e0e4e7', borderBottom: 'none' },
            '& .MuiDataGrid-columnHeader': { bgcolor: '#e0e4e7', py: '6px', px: 2 },
            '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 600, fontSize: '14px', color: '#293036', letterSpacing: '-0.084px', lineHeight: '16px' },
            '& .MuiDataGrid-columnSeparator': { display: 'none' },
            '& .MuiDataGrid-row': { cursor: 'pointer' },
            '& .MuiDataGrid-row:hover': { bgcolor: '#F0F7FF' },
            '& .MuiDataGrid-cell': { fontSize: '14px', color: '#293036', display: 'flex', alignItems: 'center', fontFeatureSettings: "'lnum' 1, 'tnum' 1", letterSpacing: '-0.084px', '& .MuiTypography-root': { fontSize: '14px' } },
            '& .totals-row': { bgcolor: '#F0F2F4', fontWeight: 700, borderBottom: '2px solid #C0C8D0', '&:hover': { bgcolor: '#F0F2F4' } },
            '& .totals-row .MuiDataGrid-cell': { bgcolor: '#F0F2F4', borderBottom: '2px solid #C0C8D0' },
            '& .totals-row .MuiDataGrid-cell--pinnedLeft': { bgcolor: '#F0F2F4', borderBottom: '2px solid #C0C8D0' },
            '& .def-free-row': { bgcolor: '#e3f9ef', '&:hover': { bgcolor: '#c7f2df' } },
            '& .def-free-row .MuiDataGrid-cell--pinnedLeft': { bgcolor: '#e3f9ef' },
            '& .def-free-row:hover .MuiDataGrid-cell--pinnedLeft': { bgcolor: '#c7f2df' },
            '& .MuiDataGrid-scrollbarFiller': { display: 'none' },
            '& .MuiDataGrid-main': { pb: '14px' },
            '& .MuiDataGrid-sortButton': { color: '#293036' },
            // Hide license watermark overlay
            '& .MuiDataGrid-main > div:last-child:not([class*="MuiDataGrid"])': { display: 'none !important' },
          }}
        />
      </Paper>

      {/* Citation Detail Drawer */}
      {/* Citation Detail Drawer — Figma style */}
      <Drawer
        anchor="right"
        open={!!drawerCitation}
        onClose={() => setDrawerCitation(null)}
        PaperProps={{ sx: { width: 480, display: 'flex', flexDirection: 'column' } }}
      >
        {drawerCitation && (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, pb: 2 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '16px', color: '#293036' }}>Citation details</Typography>
              <IconButton onClick={() => setDrawerCitation(null)} size="small"><CloseIcon /></IconButton>
            </Box>
            <Box sx={{ px: 3, flexGrow: 1 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '16px', color: '#293036' }}>
                {(drawerCitation.facility || '').replace('Avir at ', '')}
              </Typography>
              <Typography sx={{ fontSize: '14px', fontStyle: 'italic', color: '#5c6874', mb: 2 }}>
                TX - {drawerCitation.region}
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                <Box>
                  <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#293036' }}>Survey date</Typography>
                  <Typography sx={{ fontSize: '14px', color: '#293036' }}>{drawerCitation.surveyor || '—'}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#293036' }}>Surveyor</Typography>
                  <Typography sx={{ fontSize: '14px', color: '#293036' }}>{fmtDate(drawerCitation.date)}</Typography>
                </Box>
              </Box>
              <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#F7F8F9', border: '1px solid #e0e4e7', borderRadius: '8px' }}>
                <Typography sx={{ fontWeight: 700, fontSize: '16px', color: '#293036', mb: 0.5 }}>
                  {drawerCitation.tag}
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '14px', color: '#293036', mb: 1.5 }}>
                  {drawerCitation.description || '—'}
                </Typography>
                <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#5c6874', mb: 0.5 }}>
                  Observation
                </Typography>
                <Typography sx={{ fontSize: '14px', color: '#293036', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {drawerCitation.observation || 'No observation details available.'}
                </Typography>
              </Paper>
            </Box>
            <Box sx={{ p: 3, pt: 2 }}>
              <Button variant="contained" color="inherit" disableElevation fullWidth onClick={() => setDrawerCitation(null)}>
                Close
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
}
