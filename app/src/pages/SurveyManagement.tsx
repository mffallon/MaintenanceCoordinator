import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box, Typography, Paper, Chip, Button, Tabs, Tab, FormControl, InputLabel,
  Select, MenuItem, TextField, InputAdornment, Divider, IconButton,
  Menu, FormControlLabel, Switch,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import CloseIcon from '@mui/icons-material/Close';
import { facilities } from '../data/facilities';
import PageHeader from '../components/PageHeader';
import { useCommunityFilter } from '../components/CommunityFilter';
import { fmtDate } from '../utils/formatDate';

const surveyTypes = ['CMS Life Safety', 'CMS Health', 'State Fire Marshal', 'Joint Commission'];

function buildSurveyRows() {
  const now = new Date();
  return facilities.map((fac) => {
    const windowEnd = new Date(fac.surveyWindowEnd);
    const windowStart = new Date(fac.surveyWindowStart);
    const daysUntilEnd = Math.ceil((windowEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const daysUntilStart = Math.ceil((windowStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    let surveyStatus: string;
    if (daysUntilEnd < 0) surveyStatus = 'Window Passed';
    else if (daysUntilStart <= 0 || daysUntilEnd <= 30) surveyStatus = 'In Window';
    else surveyStatus = 'Upcoming';

    const uploaded = fac.surveys > 2 && fac.totalCitations > 0;

    return {
      id: fac.id,
      name: fac.name,
      city: fac.city,
      state: fac.state,
      region: fac.region,
      surveyType: fac.surveyType,
      windowStart: fac.surveyWindowStart,
      windowEnd: fac.surveyWindowEnd,
      daysUntilEnd,
      surveyStatus,
      lastSurveyDate: fac.lastSurveyDate,
      totalSurveys: fac.surveys,
      totalCitations: fac.totalCitations,
      uploaded,
      nearing90Days: fac.nearing90Days,
      hasDocGaps: fac.documentationGaps.tasks + fac.documentationGaps.logs + fac.documentationGaps.docs > 0,
    };
  }).sort((a, b) => a.daysUntilEnd - b.daysUntilEnd);
}

const allSurveyRows = buildSurveyRows();

export default function SurveyManagement() {
  const navigate = useNavigate();
  const { passesFilter } = useCommunityFilter();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'historical' ? 1 : 0;
  const initialFilter = searchParams.get('filter');
  const initialSort = searchParams.get('sort');
  const initialGapsFilter = initialFilter === 'gaps';
  const initialInWindowFilter = initialFilter === 'inWindow' || initialFilter === 'inwindow' || initialFilter === 'active';
  const [tab, setTab] = useState(initialTab);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialInWindowFilter ? 'In Window' : '');
  const [gapsOnly, setGapsOnly] = useState(initialGapsFilter);
  const [sortModel, setSortModel] = useState(
    initialSort === 'daysLeft'
      ? [{ field: 'daysUntilEnd' as const, sort: 'asc' as const }]
      : initialGapsFilter
        ? [{ field: 'uploaded' as const, sort: 'asc' as const }]
        : [{ field: 'lastSurveyDate' as const, sort: 'desc' as const }]
  );
  const [viewMenuAnchor, setViewMenuAnchor] = useState<null | HTMLElement>(null);
  const [hiddenCols, setHiddenCols] = useState<Set<string>>(new Set(['_showRegion', 'windowStart']));

  const communityRows = useMemo(() => allSurveyRows.filter((r) => passesFilter(r.id)), [passesFilter]);
  const states = [...new Set(communityRows.map((r) => r.state))].sort();
  const regions = [...new Set(communityRows.map((r) => r.region))].sort();

  // Tab 0 = Upcoming (not passed), Tab 1 = Historical (passed)
  const tabFiltered = useMemo(() => {
    const base = tab === 0
      ? communityRows.filter((r) => r.surveyStatus !== 'Window Passed')
      : communityRows.filter((r) => r.surveyStatus === 'Window Passed');

    return base.filter((r) => {
      if (search && !r.name.toLowerCase().includes(search.toLowerCase())
        && !r.city.toLowerCase().includes(search.toLowerCase())) return false;
      if (stateFilter && r.state !== stateFilter) return false;
      if (regionFilter && r.region !== regionFilter) return false;
      if (typeFilter && r.surveyType !== typeFilter) return false;
      if (statusFilter && r.surveyStatus !== statusFilter) return false;
      if (gapsOnly && !r.hasDocGaps) return false;
      return true;
    });
  }, [communityRows, tab, search, stateFilter, regionFilter, typeFilter, statusFilter, gapsOnly]);

  const handleTabChange = (_: React.SyntheticEvent, v: number) => {
    setTab(v);
    setSearchParams({ tab: v === 1 ? 'historical' : 'upcoming' });
  };

  const statusChip = (status: string) => {
    const map: Record<string, { bg: string; color: string }> = {
      'Window Passed': { bg: '#F1F5F9', color: '#64748B' },
      'In Window': { bg: '#FEF3C7', color: '#92400E' },
      'Upcoming': { bg: '#DBEAFE', color: '#1E40AF' },
    };
    const s = map[status] || { bg: '#F1F5F9', color: '#475569' };
    return <Chip label={status} size="small" sx={{ bgcolor: s.bg, color: s.color, fontWeight: 700 }} />;
  };

  const columns: GridColDef[] = [
    {
      field: 'name', headerName: 'Facility', flex: 1, minWidth: 150,
      renderCell: (p: GridRenderCellParams) => (
        <Box>
          <Typography variant="body2" sx={{
            fontWeight: 600, color: 'primary.main', cursor: 'pointer', fontSize: '0.8rem',
            '&:hover': { textDecoration: 'underline' },
          }} onClick={(e) => { e.stopPropagation(); navigate(`/facility/${p.row.id}`); }}>
            {(p.value as string).replace('Life Care Center of ', 'LCC ')}
          </Typography>
          {!hiddenCols.has('_showRegion') && <Typography variant="caption" sx={{ color: '#8492a1', fontSize: '0.7rem' }}>{p.row.region}</Typography>}
          <Typography variant="caption" color="text.secondary">{p.row.city}, {p.row.state}</Typography>
        </Box>
      ),
    },
    { field: 'surveyType', headerName: 'Type', flex: 0.7, minWidth: 100 },
    { field: 'windowStart', headerName: 'Start', flex: 0.6, minWidth: 90,
      renderCell: (p: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{fmtDate(p.value as string)}</Typography>
      ),
    },
    { field: 'windowEnd', headerName: 'Window End', flex: 0.6, minWidth: 90,
      renderCell: (p: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{fmtDate(p.value as string)}</Typography>
      ),
    },
    {
      field: 'daysUntilEnd', headerName: 'Days', flex: 0.4, minWidth: 65,
      renderCell: (p: GridRenderCellParams) => {
        const days = p.value as number;
        let color = '#16A34A'; let bg = '#DCFCE7'; let label = `${days}d`;
        if (days < 0) { color = '#64748B'; bg = '#F1F5F9'; label = 'Passed'; }
        else if (days <= 30) { color = '#991B1B'; bg = '#FEE2E2'; }
        else if (days <= 60) { color = '#9A3412'; bg = '#FED7AA'; }
        else if (days <= 90) { color = '#854D0E'; bg = '#FEF9C3'; }
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%',
              bgcolor: days < 0 ? '#94A3B8' : days <= 30 ? '#DC2626' : days <= 60 ? '#EA580C' : days <= 90 ? '#CA8A04' : '#16A34A',
            }} />
            <Chip label={label} size="small" sx={{ bgcolor: bg, color, fontWeight: 700, fontSize: '0.75rem', height: 24 }} />
          </Box>
        );
      },
    },
    {
      field: 'surveyStatus', headerName: 'Status', flex: 0.6, minWidth: 85,
      renderCell: (p: GridRenderCellParams) => statusChip(p.value as string),
    },
    {
      field: 'uploaded', headerName: 'Uploaded', flex: 0.5, minWidth: 75, align: 'center', headerAlign: 'center',
      renderCell: (p: GridRenderCellParams) => (
        <Chip label={p.value ? 'Yes' : 'No'} size="small" sx={{
          bgcolor: p.value ? '#DCFCE7' : '#FEF3C7',
          color: p.value ? '#166534' : '#92400E',
          fontWeight: 600,
        }} />
      ),
    },
    {
      field: 'lastSurveyDate', headerName: 'Last Survey', flex: 0.6, minWidth: 90,
      renderCell: (p: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{fmtDate(p.value as string)}</Typography>
      ),
    },
  ];

  // Summary counts
  const upcomingCount = communityRows.filter((r) => r.surveyStatus !== 'Window Passed').length;
  const historicalCount = communityRows.filter((r) => r.surveyStatus === 'Window Passed').length;
  const inWindow = tabFiltered.filter((r) => r.surveyStatus === 'In Window').length;

  return (
    <Box>
      <PageHeader
        title="Survey Management"
        tabs={[
          { label: 'Upcoming', value: 0 },
          { label: 'History', value: 1 },
        ]}
        activeTab={tab}
        onTabChange={(v) => { setTab(v); setSearchParams({ tab: v === 1 ? 'historical' : 'upcoming' }); }}
        actions={<></>}
      />

      {/* Table */}
      <Paper sx={{ borderRadius: '8px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        {/* Filters + View Options + Export in section header */}
        <Box sx={{ px: 2, pt: 2, pb: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField size="small" placeholder="Search facility..." value={search}
              onChange={(e) => setSearch(e.target.value)} sx={{ minWidth: 200 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} />
            <FormControl size="small" sx={{ minWidth: 90 }}>
              <InputLabel>State</InputLabel>
              <Select value={stateFilter} label="State" onChange={(e) => setStateFilter(e.target.value)}>
                <MenuItem value="">All</MenuItem>
                {states.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
<FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel>Survey Type</InputLabel>
              <Select value={typeFilter} label="Survey Type" onChange={(e) => setTypeFilter(e.target.value)}>
                <MenuItem value="">All</MenuItem>
                {surveyTypes.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </Select>
            </FormControl>
            {tab === 0 && (
              <FormControl size="small" sx={{ minWidth: 110 }}>
                <InputLabel>Status</InputLabel>
                <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="In Window">In Window</MenuItem>
                  <MenuItem value="Upcoming">Upcoming</MenuItem>
                </Select>
              </FormControl>
            )}
            {gapsOnly && (
              <Chip label="Doc Gaps Only" onDelete={() => setGapsOnly(false)} size="small"
                sx={{ bgcolor: '#FEE2E2', color: '#991B1B', fontWeight: 700 }} />
            )}
            <Button variant="text" startIcon={<CloseIcon />} sx={{ height: 44 }} onClick={() => {
              setSearch(''); setStateFilter(''); setRegionFilter('');
              setTypeFilter(''); setStatusFilter(''); setGapsOnly(false);
            }}>Reset</Button>
            <Box sx={{ flexGrow: 1 }} />
            <Button variant="text" size="small" startIcon={<ViewColumnIcon />}
              onClick={(e) => setViewMenuAnchor(e.currentTarget)}>
              View Options
            </Button>
            <Button size="small" startIcon={<FileDownloadIcon />}>Export</Button>
          </Box>
        </Box>
        <Menu anchorEl={viewMenuAnchor} open={Boolean(viewMenuAnchor)}
          onClose={() => setViewMenuAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <Box sx={{ px: 2, py: 0.5, minWidth: 200 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#5c6874', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Toggle Columns
            </Typography>
          </Box>
          <MenuItem sx={{ py: 0.25 }}>
            <FormControlLabel
              control={<Switch size="small" checked={!hiddenCols.has('_showRegion')}
                onChange={() => {
                  const next = new Set(hiddenCols);
                  next.has('_showRegion') ? next.delete('_showRegion') : next.add('_showRegion');
                  setHiddenCols(next);
                }} />}
              label={<Typography variant="body2" sx={{ fontSize: '0.85rem' }}>Region (in Facility)</Typography>}
            />
          </MenuItem>
          {columns.filter(c => c.field !== 'name').map((col) => (
            <MenuItem key={col.field} sx={{ py: 0.25 }}>
              <FormControlLabel
                control={<Switch size="small" checked={!hiddenCols.has(col.field)}
                  onChange={() => {
                    const next = new Set(hiddenCols);
                    next.has(col.field) ? next.delete(col.field) : next.add(col.field);
                    setHiddenCols(next);
                  }} />}
                label={<Typography variant="body2" sx={{ fontSize: '0.85rem' }}>{col.headerName}</Typography>}
              />
            </MenuItem>
          ))}
        </Menu>
        <DataGrid
          rows={tabFiltered}
          columns={columns.filter((c) => !hiddenCols.has(c.field))}
          getRowHeight={() => 'auto' as const}
          sortModel={sortModel}
          onSortModelChange={(m) => setSortModel(m as typeof sortModel)}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          disableRowSelectionOnClick
          disableColumnMenu
          onRowClick={(params) => navigate(`/facility/${params.row.id}`)}
          getRowClassName={(params) => {
            if (params.row.surveyStatus === 'In Window' && params.row.daysUntilEnd <= 30) return 'due-soon-row';
            if (params.row.surveyStatus === 'In Window') return 'in-window-row';
            return '';
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': { bgcolor: '#e0e4e7', borderBottom: 'none' },
            '& .MuiDataGrid-columnHeader': { bgcolor: '#e0e4e7' },
            '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 400, fontSize: '14px', color: '#293036', letterSpacing: '-0.084px', lineHeight: '16px' },
            '& .MuiDataGrid-columnSeparator': { display: 'none' },
            '& .MuiDataGrid-row': { cursor: 'pointer', '&:hover': { bgcolor: '#F0F7FF' } },
            '& .due-soon-row': { bgcolor: '#FEF2F2', '&:hover': { bgcolor: '#FEE2E2' } },
            '& .in-window-row': { bgcolor: '#FFFBEB', '&:hover': { bgcolor: '#FEF3C7' } },
            '& .MuiDataGrid-cell': { py: 0.5, borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center' },
          }}
          autoHeight
        />
      </Paper>
    </Box>
  );
}
