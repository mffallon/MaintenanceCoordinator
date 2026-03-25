import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box, Typography, Paper, Chip, Button, Tabs, Tab, FormControl, InputLabel,
  Select, MenuItem, TextField, InputAdornment, Divider, IconButton,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { facilities } from '../data/facilities';
import PageHeader from '../components/PageHeader';

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
    else if (daysUntilEnd <= 30) surveyStatus = 'Due Soon';
    else if (daysUntilStart <= 0) surveyStatus = 'In Window';
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
    };
  }).sort((a, b) => a.daysUntilEnd - b.daysUntilEnd);
}

const allSurveyRows = buildSurveyRows();

export default function SurveyManagement() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'historical' ? 1 : 0;
  const [tab, setTab] = useState(initialTab);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const states = [...new Set(allSurveyRows.map((r) => r.state))].sort();
  const regions = [...new Set(allSurveyRows.map((r) => r.region))].sort();

  // Tab 0 = Upcoming (not passed), Tab 1 = Historical (passed)
  const tabFiltered = useMemo(() => {
    const base = tab === 0
      ? allSurveyRows.filter((r) => r.surveyStatus !== 'Window Passed')
      : allSurveyRows.filter((r) => r.surveyStatus === 'Window Passed');

    return base.filter((r) => {
      if (search && !r.name.toLowerCase().includes(search.toLowerCase())
        && !r.city.toLowerCase().includes(search.toLowerCase())) return false;
      if (stateFilter && r.state !== stateFilter) return false;
      if (regionFilter && r.region !== regionFilter) return false;
      if (typeFilter && r.surveyType !== typeFilter) return false;
      if (statusFilter && r.surveyStatus !== statusFilter) return false;
      return true;
    });
  }, [tab, search, stateFilter, regionFilter, typeFilter, statusFilter]);

  const handleTabChange = (_: React.SyntheticEvent, v: number) => {
    setTab(v);
    setSearchParams({ tab: v === 1 ? 'historical' : 'upcoming' });
  };

  const statusChip = (status: string) => {
    const map: Record<string, { bg: string; color: string }> = {
      'Window Passed': { bg: '#F1F5F9', color: '#64748B' },
      'Due Soon': { bg: '#FEE2E2', color: '#991B1B' },
      'In Window': { bg: '#FEF3C7', color: '#92400E' },
      'Upcoming': { bg: '#DBEAFE', color: '#1E40AF' },
    };
    const s = map[status] || { bg: '#F1F5F9', color: '#475569' };
    return <Chip label={status} size="small" sx={{ bgcolor: s.bg, color: s.color, fontWeight: 700 }} />;
  };

  const columns: GridColDef[] = [
    {
      field: 'name', headerName: 'Facility', flex: 1.5, minWidth: 220,
      renderCell: (p: GridRenderCellParams) => (
        <Box>
          <Typography variant="body2" sx={{
            fontWeight: 600, color: 'primary.main', cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }} onClick={(e) => { e.stopPropagation(); navigate(`/facility/${p.row.id}`); }}>
            {p.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">{p.row.city}, {p.row.state}</Typography>
        </Box>
      ),
    },
    { field: 'state', headerName: 'State', width: 65, align: 'center', headerAlign: 'center' },
    { field: 'region', headerName: 'Region', width: 110 },
    { field: 'surveyType', headerName: 'Survey Type', width: 150 },
    { field: 'windowStart', headerName: 'Window Start', width: 120 },
    {
      field: 'windowEnd', headerName: 'Window End', width: 120,
      renderCell: (p: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{p.value}</Typography>
      ),
    },
    {
      field: 'daysUntilEnd', headerName: 'Days Left', width: 120, type: 'number',
      renderCell: (p: GridRenderCellParams) => {
        const d = p.value as number;
        let color = '#16A34A'; let bg = '#DCFCE7'; let label = `${d}d`;
        if (d < 0) { color = '#64748B'; bg = '#F1F5F9'; label = 'Passed'; }
        else if (d <= 30) { color = '#991B1B'; bg = '#FEE2E2'; }
        else if (d <= 60) { color = '#9A3412'; bg = '#FED7AA'; }
        else if (d <= 90) { color = '#854D0E'; bg = '#FEF9C3'; }
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box sx={{
              width: 8, height: 8, borderRadius: '50%',
              bgcolor: d < 0 ? '#94A3B8' : d <= 30 ? '#DC2626' : d <= 60 ? '#EA580C' : d <= 90 ? '#CA8A04' : '#16A34A',
            }} />
            <Chip label={label} size="small" sx={{ bgcolor: bg, color, fontWeight: 700, fontSize: '0.75rem', height: 24 }} />
          </Box>
        );
      },
    },
    {
      field: 'surveyStatus', headerName: 'Status', width: 130,
      renderCell: (p: GridRenderCellParams) => statusChip(p.value as string),
    },
    {
      field: 'uploaded', headerName: 'Uploaded', width: 90, align: 'center', headerAlign: 'center',
      renderCell: (p: GridRenderCellParams) => (
        <Chip label={p.value ? 'Yes' : 'No'} size="small" sx={{
          bgcolor: p.value ? '#DCFCE7' : '#FEF3C7',
          color: p.value ? '#166534' : '#92400E',
          fontWeight: 600,
        }} />
      ),
    },
    { field: 'totalSurveys', headerName: 'Surveys', width: 80, type: 'number', align: 'center', headerAlign: 'center' },
    { field: 'totalCitations', headerName: 'Citations', width: 90, type: 'number', align: 'center', headerAlign: 'center' },
    { field: 'lastSurveyDate', headerName: 'Last Survey', width: 110 },
  ];

  // Summary counts
  const upcomingCount = allSurveyRows.filter((r) => r.surveyStatus !== 'Window Passed').length;
  const historicalCount = allSurveyRows.filter((r) => r.surveyStatus === 'Window Passed').length;
  const dueSoon = tabFiltered.filter((r) => r.surveyStatus === 'Due Soon').length;
  const inWindow = tabFiltered.filter((r) => r.surveyStatus === 'In Window').length;

  return (
    <Box>
      <PageHeader
        title="Survey Management"
        tabs={[
          { label: 'Upcoming', value: 0 },
          { label: 'History', value: 1 },
          { label: 'Analytics', value: 2 },
        ]}
        activeTab={tab}
        onTabChange={(v) => { setTab(v); setSearchParams({ tab: v === 1 ? 'historical' : 'upcoming' }); }}
        actions={<Button variant="outlined" startIcon={<FileDownloadIcon />} size="small">Export</Button>}
      />

      {/* Summary chips */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <Chip label={`${tabFiltered.length} facilities`} color="primary" />
        {tab === 0 && dueSoon > 0 && (
          <Chip label={`${dueSoon} due soon`} sx={{ bgcolor: '#FEE2E2', color: '#991B1B', fontWeight: 700 }} />
        )}
        {tab === 0 && inWindow > 0 && (
          <Chip label={`${inWindow} in window`} sx={{ bgcolor: '#FEF3C7', color: '#92400E', fontWeight: 700 }} />
        )}
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 3, border: '1px solid #E2E8F0' }}>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField size="small" placeholder="Search facility..." value={search}
            onChange={(e) => setSearch(e.target.value)} sx={{ minWidth: 220 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} />
          <FormControl size="small" sx={{ minWidth: 90 }}>
            <InputLabel>State</InputLabel>
            <Select value={stateFilter} label="State" onChange={(e) => setStateFilter(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              {states.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Region</InputLabel>
            <Select value={regionFilter} label="Region" onChange={(e) => setRegionFilter(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              {regions.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Survey Type</InputLabel>
            <Select value={typeFilter} label="Survey Type" onChange={(e) => setTypeFilter(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              {surveyTypes.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
          </FormControl>
          {tab === 0 && (
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Due Soon">Due Soon</MenuItem>
                <MenuItem value="In Window">In Window</MenuItem>
                <MenuItem value="Upcoming">Upcoming</MenuItem>
              </Select>
            </FormControl>
          )}
          <Button size="small" onClick={() => {
            setSearch(''); setStateFilter(''); setRegionFilter('');
            setTypeFilter(''); setStatusFilter('');
          }}>Reset</Button>
        </Box>
      </Paper>

      {/* Table */}
      <Paper sx={{ borderRadius: 3, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <DataGrid
          rows={tabFiltered}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
            sorting: { sortModel: [{ field: 'daysUntilEnd', sort: tab === 0 ? 'asc' : 'desc' }] },
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          disableRowSelectionOnClick
          onRowClick={(params) => navigate(`/facility/${params.row.id}`)}
          getRowClassName={(params) => {
            if (params.row.surveyStatus === 'Due Soon') return 'due-soon-row';
            if (params.row.surveyStatus === 'In Window') return 'in-window-row';
            return '';
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': { bgcolor: '#F8FAFC', borderBottom: '2px solid #E2E8F0' },
            '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 700, fontSize: '0.8rem', color: '#475569' },
            '& .MuiDataGrid-row': { cursor: 'pointer', '&:hover': { bgcolor: '#F0F7FF' } },
            '& .due-soon-row': { bgcolor: '#FEF2F2', '&:hover': { bgcolor: '#FEE2E2' } },
            '& .in-window-row': { bgcolor: '#FFFBEB', '&:hover': { bgcolor: '#FEF3C7' } },
            '& .MuiDataGrid-cell': { py: 1, borderBottom: '1px solid #F1F5F9' },
          }}
          autoHeight
        />
      </Paper>
    </Box>
  );
}
