import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Chip, Button, FormControl, InputLabel, Select,
  MenuItem, TextField, InputAdornment,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FilterListIcon from '@mui/icons-material/FilterList';
import { facilities } from '../data/facilities';
import PageHeader from '../components/PageHeader';

const states = [...new Set(facilities.map((f) => f.state))].sort();
const regions = [...new Set(facilities.map((f) => f.region))].sort();
const surveyTypes = ['CMS Life Safety', 'CMS Health', 'State Fire Marshal', 'Joint Commission'];

export default function Facilities() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filtered = useMemo(() => {
    return [...facilities]
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((f) => {
        if (search && !f.name.toLowerCase().includes(search.toLowerCase())
          && !f.city.toLowerCase().includes(search.toLowerCase())) return false;
        if (stateFilter && f.state !== stateFilter) return false;
        if (regionFilter && f.region !== regionFilter) return false;
        if (typeFilter && f.surveyType !== typeFilter) return false;
        return true;
      });
  }, [search, stateFilter, regionFilter, typeFilter]);

  const defFreeCount = filtered.filter((f) => f.deficiencyFree).length;
  const withCitations = filtered.filter((f) => f.totalCitations > 0).length;

  const pocChip = (status: string | null) => {
    if (!status) return <Typography variant="caption" color="text.secondary">—</Typography>;
    const map: Record<string, { bg: string; color: string; label: string }> = {
      'on-track': { bg: '#DBEAFE', color: '#1E40AF', label: 'On Track' },
      'overdue': { bg: '#FECACA', color: '#991B1B', label: 'Overdue' },
      'completed': { bg: '#BBF7D0', color: '#166534', label: 'Completed' },
      'not-started': { bg: '#F1F5F9', color: '#64748B', label: 'Not Started' },
    };
    const s = map[status] || map['not-started'];
    return <Chip label={s.label} size="small" sx={{ bgcolor: s.bg, color: s.color, fontWeight: 600 }} />;
  };

  const columns: GridColDef[] = [
    {
      field: 'name', headerName: 'Facility', flex: 2, minWidth: 240,
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
    { field: 'surveyType', headerName: 'Survey Type', width: 145 },
    { field: 'lastSurveyDate', headerName: 'Last Survey', width: 110 },
    { field: 'totalCitations', headerName: 'Citations', width: 90, type: 'number', align: 'center', headerAlign: 'center' },
    {
      field: 'kTags', headerName: 'K Tags', width: 80, align: 'center', headerAlign: 'center',
      renderCell: (p: GridRenderCellParams) => p.value > 0
        ? <Chip label={p.value} size="small" sx={{ bgcolor: '#FEE2E2', color: '#991B1B', fontWeight: 700, minWidth: 30 }} />
        : <Typography variant="caption" color="text.secondary">0</Typography>,
    },
    {
      field: 'eTags', headerName: 'E Tags', width: 80, align: 'center', headerAlign: 'center',
      renderCell: (p: GridRenderCellParams) => p.value > 0
        ? <Chip label={p.value} size="small" sx={{ bgcolor: '#FEF9C3', color: '#854D0E', fontWeight: 700, minWidth: 30 }} />
        : <Typography variant="caption" color="text.secondary">0</Typography>,
    },
    {
      field: 'stateTags', headerName: 'State Tags', width: 90, align: 'center', headerAlign: 'center',
      renderCell: (p: GridRenderCellParams) => p.value > 0
        ? <Chip label={p.value} size="small" sx={{ bgcolor: '#E0E7FF', color: '#3730A3', fontWeight: 700, minWidth: 30 }} />
        : <Typography variant="caption" color="text.secondary">0</Typography>,
    },
    {
      field: 'documentationGaps', headerName: 'Doc Gaps', width: 130, sortable: false,
      renderCell: (p: GridRenderCellParams) => {
        const g = p.value as { tasks: number; logs: number; docs: number };
        const total = g.tasks + g.logs + g.docs;
        if (total === 0) return <Chip label="None" size="small" sx={{ bgcolor: '#BBF7D0', color: '#166534' }} />;
        return (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {g.tasks > 0 && <Chip label={`T:${g.tasks}`} size="small" sx={{ bgcolor: '#FEE2E2', color: '#991B1B', height: 20, fontSize: '0.65rem' }} />}
            {g.logs > 0 && <Chip label={`L:${g.logs}`} size="small" sx={{ bgcolor: '#FEF9C3', color: '#854D0E', height: 20, fontSize: '0.65rem' }} />}
            {g.docs > 0 && <Chip label={`D:${g.docs}`} size="small" sx={{ bgcolor: '#E0E7FF', color: '#3730A3', height: 20, fontSize: '0.65rem' }} />}
          </Box>
        );
      },
    },
    {
      field: 'pocStatus', headerName: 'POC Status', width: 110, align: 'center', headerAlign: 'center',
      renderCell: (p: GridRenderCellParams) => pocChip(p.value as string),
    },
    {
      field: 'deficiencyFree', headerName: 'Def-Free', width: 80, align: 'center', headerAlign: 'center',
      renderCell: (p: GridRenderCellParams) => p.value
        ? <Chip label="★" size="small" sx={{ bgcolor: '#BBF7D0', color: '#166534', fontWeight: 700 }} />
        : <Typography variant="caption" color="text.secondary">—</Typography>,
    },
    {
      field: 'benchmarkVsPeers', headerName: 'vs Peers', width: 90, type: 'number', align: 'center', headerAlign: 'center',
      renderCell: (p: GridRenderCellParams) => {
        const v = p.value as number;
        return (
          <Typography variant="body2" sx={{ fontWeight: 600, color: v > 0 ? 'error.main' : v < 0 ? 'success.main' : 'text.secondary' }}>
            {v > 0 ? '+' : ''}{v}
          </Typography>
        );
      },
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Facilities"
        actions={<Button variant="outlined" startIcon={<FileDownloadIcon />} size="small">Export</Button>}
      />

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 3, border: '1px solid #E2E8F0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <FilterListIcon color="action" fontSize="small" />
          <Typography variant="subtitle2">Filters</Typography>
          <Chip label={`${filtered.length} facilities`} size="small" color="primary" sx={{ ml: 1 }} />
          <Chip label={`${withCitations} with citations`} size="small" sx={{ bgcolor: '#FEF3C7', color: '#92400E', fontWeight: 600 }} />
          <Chip label={`${defFreeCount} deficiency-free`} size="small" sx={{ bgcolor: '#BBF7D0', color: '#166534', fontWeight: 600 }} />
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <TextField size="small" placeholder="Search facility or city..." value={search}
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
          <Button size="small" onClick={() => { setSearch(''); setStateFilter(''); setRegionFilter(''); setTypeFilter(''); }}>
            Reset
          </Button>
        </Box>
      </Paper>

      {/* Table */}
      <Paper sx={{ borderRadius: 3, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <DataGrid
          rows={filtered}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
            sorting: { sortModel: [{ field: 'name', sort: 'asc' }] },
          }}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          onRowClick={(params) => navigate(`/facility/${params.row.id}`)}
          getRowClassName={(params) => {
            if (params.row.deficiencyFree) return 'def-free-row';
            return '';
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': { bgcolor: '#F8FAFC', borderBottom: '2px solid #E2E8F0' },
            '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 700, fontSize: '0.8rem', color: '#475569' },
            '& .MuiDataGrid-row': { cursor: 'pointer', '&:hover': { bgcolor: '#F0F7FF' } },
            '& .def-free-row': { bgcolor: '#F0FDF4', '&:hover': { bgcolor: '#DCFCE7' } },
            '& .MuiDataGrid-cell': { py: 1, borderBottom: '1px solid #F1F5F9' },
          }}
          autoHeight
        />
      </Paper>
    </Box>
  );
}
