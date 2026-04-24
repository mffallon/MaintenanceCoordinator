import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, FormControl, InputLabel, Select,
  MenuItem, TextField, InputAdornment, IconButton,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { facilities, regions as avirRegions } from '../data/avir-data';
import PageHeader from '../components/PageHeader';
import PageFilters from '../components/PageFilters';
import { useCommunityFilter } from '../components/CommunityFilter';
import { fmtDate } from '../utils/formatDate';

export default function Facilities() {
  const navigate = useNavigate();
  const { passesFilter } = useCommunityFilter();
  const [dateRange, setDateRange] = useState('all');
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('');

  const filtered = useMemo(() => {
    return [...facilities]
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((f) => {
        if (!passesFilter(f.id)) return false;
        if (search && !f.name.toLowerCase().includes(search.toLowerCase())
          && !f.region.toLowerCase().includes(search.toLowerCase())) return false;
        if (regionFilter && f.region !== regionFilter) return false;
        return true;
      });
  }, [passesFilter, search, regionFilter]);

  const totalCitations = filtered.reduce((s, f) => s + f.totalCitations, 0);

  const columns: GridColDef[] = [
    {
      field: 'name', headerName: 'Community Name', flex: 1, minWidth: 200,
      renderCell: (p: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <Typography sx={{ fontWeight: 700, fontSize: '14px', color: '#293036', lineHeight: '16px' }}>
            {(p.value as string).replace('Avir at ', '')}
          </Typography>
          <Typography sx={{ fontWeight: 400, fontSize: '14px', color: '#293036', lineHeight: '16px' }}>{p.row.region}</Typography>
        </Box>
      ),
    },
    {
      field: 'totalCitations', headerName: 'Total', width: 95, type: 'number', align: 'right', headerAlign: 'right',
      renderCell: (p: GridRenderCellParams) => (
        <Typography sx={{ fontWeight: 700, fontSize: '14px', color: '#293036' }}>{p.value}</Typography>
      ),
    },
    {
      field: 'totalKTags', headerName: 'K-Tags', width: 95, type: 'number', align: 'right', headerAlign: 'right',
      renderCell: (p: GridRenderCellParams) => (
        <Typography sx={{ fontSize: '14px', fontWeight: 400, color: (p.value as number) > 0 ? '#293036' : '#94A3B8' }}>
          {(p.value as number) || '—'}
        </Typography>
      ),
    },
    {
      field: 'totalNTags', headerName: 'N-Tags', width: 95, type: 'number', align: 'right', headerAlign: 'right',
      renderCell: (p: GridRenderCellParams) => (
        <Typography sx={{ fontSize: '14px', fontWeight: 400, color: (p.value as number) > 0 ? '#293036' : '#94A3B8' }}>
          {(p.value as number) || '—'}
        </Typography>
      ),
    },
    {
      field: 'totalETags', headerName: 'E-Tags', width: 95, type: 'number', align: 'right', headerAlign: 'right',
      renderCell: (p: GridRenderCellParams) => (
        <Typography sx={{ fontSize: '14px', fontWeight: 400, color: (p.value as number) > 0 ? '#293036' : '#94A3B8' }}>
          {(p.value as number) || '—'}
        </Typography>
      ),
    },
    {
      field: 'surveyCount', headerName: 'Surveys', width: 95, type: 'number', align: 'right', headerAlign: 'right',
      renderCell: (p: GridRenderCellParams) => (
        <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#293036' }}>{p.value}</Typography>
      ),
    },
    {
      field: 'lastSurveyDate', headerName: 'Last Survey', width: 120,
      renderCell: (p: GridRenderCellParams) => (
        <Typography sx={{ fontSize: '14px', fontWeight: 400, color: p.value ? '#293036' : '#94A3B8' }}>
          {p.value ? fmtDate(p.value as string) : '—'}
        </Typography>
      ),
    },
    {
      field: 'surveyWindow', headerName: 'Survey Window', width: 180, sortable: false,
      renderCell: (p: GridRenderCellParams) => {
        const lastDate = p.row.lastSurveyDate as string | undefined;
        if (!lastDate) return <Typography sx={{ fontSize: '14px', color: '#94A3B8' }}>—</Typography>;
        const base = new Date(lastDate);
        const start = new Date(base);
        start.setMonth(start.getMonth() + 9);
        const end = new Date(base);
        end.setMonth(end.getMonth() + 15);
        const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        return (
          <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#293036' }}>
            {fmt(start)} – {fmt(end)}
          </Typography>
        );
      },
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Community Summaries"
        actions={
          <Button variant="contained" color="inherit" size="small" startIcon={<FileDownloadIcon />}>Export</Button>
        }
      />
      <PageFilters
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        extraFilters={
          <FormControl size="small" variant="filled" sx={{ minWidth: 220, '& .MuiFilledInput-root': { bgcolor: '#fff', '&:hover': { bgcolor: '#fff' }, '&.Mui-focused': { bgcolor: '#fff' } } }}>
            <InputLabel>Filter by CMS Region</InputLabel>
            <Select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}>
              <MenuItem value="">All regions</MenuItem>
              {avirRegions.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
            </Select>
          </FormControl>
        }
      />

      {/* Table */}
      <Paper elevation={0} sx={{ mb: 2, borderRadius: '8px', border: '1px solid #e0e4e7', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5 }}>
          <Typography sx={{ fontSize: '16px', color: '#293036', letterSpacing: '-0.176px' }}>
            <Box component="span" sx={{ fontWeight: 700 }}>{filtered.length} communities</Box>
            <Box component="span" sx={{ fontWeight: 400 }}> - {totalCitations} total citations</Box>
          </Typography>
          <TextField size="small" placeholder="Search communities" value={search}
            onChange={(e) => setSearch(e.target.value)} sx={{ width: 220 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} />
        </Box>
        <DataGrid
          rows={filtered}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 15 } },
            sorting: { sortModel: [{ field: 'totalCitations', sort: 'desc' }] },
          }}
          pageSizeOptions={[15, 25, 50, 100]}
          disableRowSelectionOnClick
          disableColumnMenu
          rowHeight={56}
          columnHeaderHeight={36}
          onRowClick={(params) => navigate(`/facility/${params.row.id}`)}
          getRowClassName={(params) => {
            if (params.row.totalCitations === 0 && params.row.surveyed) return 'def-free-row';
            return '';
          }}
          sx={{
            border: 'none',
            borderRadius: '0 !important',
            '& .MuiDataGrid-columnHeaders': { bgcolor: '#e0e4e7', borderBottom: 'none' },
            '& .MuiDataGrid-columnHeader': { bgcolor: '#e0e4e7' },
            '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 600, fontSize: '14px', color: '#293036', letterSpacing: '-0.084px', lineHeight: '16px', overflow: 'visible', textOverflow: 'unset' },
            '& .MuiDataGrid-columnHeaderTitleContainerContent': { overflow: 'visible' },
            '& .MuiDataGrid-columnSeparator': { display: 'none' },
            '& .MuiDataGrid-row': { cursor: 'pointer', '&:hover': { bgcolor: '#F0F7FF' } },
            '& .def-free-row': { bgcolor: '#e3f9ef', '&:hover': { bgcolor: '#c7f2df' } },
            '& .MuiDataGrid-cell': { fontSize: '14px', color: '#293036', display: 'flex', alignItems: 'center', '& .MuiTypography-root': { fontSize: '14px' } },
            '& .MuiDataGrid-sortButton': { color: '#293036' },
            '& .MuiDataGrid-main > *': { borderRadius: '0 !important' },
            '& .MuiDataGrid-main > div:last-child:not([class*="MuiDataGrid"])': { display: 'none !important' },
          }}
          autoHeight
        />
      </Paper>
    </Box>
  );
}
