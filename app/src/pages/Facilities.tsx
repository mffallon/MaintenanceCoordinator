import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Chip, Button, FormControl, InputLabel, Select,
  MenuItem, TextField, InputAdornment, IconButton, Menu, FormControlLabel, Switch,
} from '@mui/material';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
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
  const [showRegion, setShowRegion] = useState(true);
  const [viewMenuAnchor, setViewMenuAnchor] = useState<null | HTMLElement>(null);

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
  const totalKTags = filtered.reduce((s, f) => s + f.totalKTags, 0);
  const defFreeCount = filtered.filter((f) => f.totalCitations === 0 && f.surveyed).length;

  const columns: GridColDef[] = [
    {
      field: 'name', headerName: 'Community Name', flex: 1, minWidth: 160,
      renderCell: (p: GridRenderCellParams) => (
        <Box>
          <Typography variant="body2" sx={{
            fontWeight: 600, color: 'primary.main', cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }} onClick={(e) => { e.stopPropagation(); navigate(`/facility/${p.row.id}`); }}>
            {p.value}
          </Typography>
          {showRegion && <Typography variant="caption" sx={{ color: '#8492a1', fontSize: '0.7rem' }}>{p.row.region}</Typography>}
          <Typography variant="caption" color="text.secondary">{p.row.state}</Typography>
        </Box>
      ),
    },
    {
      field: 'totalCitations', headerName: 'Total', width: 70, type: 'number', align: 'center', headerAlign: 'center',
      renderCell: (p: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontWeight: 700 }}>{p.value}</Typography>
      ),
    },
    {
      field: 'totalKTags', headerName: 'K Tags', width: 70, type: 'number', align: 'center', headerAlign: 'center',
      renderCell: (p: GridRenderCellParams) => {
        const v = p.value as number;
        return v > 0
          ? <Chip label={v} size="small" sx={{ bgcolor: '#FEE2E2', color: '#991B1B', fontWeight: 700, minWidth: 32 }} />
          : <Typography variant="caption" color="text.secondary">0</Typography>;
      },
    },
    {
      field: 'totalNTags', headerName: 'N Tags', width: 70, type: 'number', align: 'center', headerAlign: 'center',
      renderCell: (p: GridRenderCellParams) => {
        const v = p.value as number;
        return v > 0
          ? <Chip label={v} size="small" sx={{ bgcolor: '#DBEAFE', color: '#1E40AF', fontWeight: 700, minWidth: 32 }} />
          : <Typography variant="caption" color="text.secondary">0</Typography>;
      },
    },
    {
      field: 'totalETags', headerName: 'E Tags', width: 70, type: 'number', align: 'center', headerAlign: 'center',
      renderCell: (p: GridRenderCellParams) => {
        const v = p.value as number;
        return v > 0
          ? <Chip label={v} size="small" sx={{ bgcolor: '#FEF9C3', color: '#854D0E', fontWeight: 700, minWidth: 32 }} />
          : <Typography variant="caption" color="text.secondary">0</Typography>;
      },
    },
    { field: 'surveyCount', headerName: 'Surveys', width: 70, type: 'number', align: 'center', headerAlign: 'center' },
    {
      field: 'lastSurveyDate', headerName: 'Last Survey', width: 110,
      renderCell: (p: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{p.value ? fmtDate(p.value as string) : '—'}</Typography>
      ),
    },
    {
      field: 'surveyWindow', headerName: 'Survey Window', width: 180, sortable: false,
      renderCell: (p: GridRenderCellParams) => {
        const lastDate = p.row.lastSurveyDate as string | undefined;
        if (!lastDate) return <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>—</Typography>;
        const base = new Date(lastDate);
        const start = new Date(base);
        start.setMonth(start.getMonth() + 9);
        const end = new Date(base);
        end.setMonth(end.getMonth() + 15);
        const today = new Date('2026-04-05');
        const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        const isOpen = today >= start && today <= end;
        const isPast = today > end;
        const color = isOpen ? '#166534' : isPast ? '#991B1B' : '#1E40AF';
        const bg = isOpen ? '#DCFCE7' : isPast ? '#FEE2E2' : '#DBEAFE';
        return (
          <Chip
            label={`${fmt(start)} – ${fmt(end)}`}
            size="small"
            sx={{ fontSize: '0.7rem', fontWeight: 600, bgcolor: bg, color, height: 20 }}
          />
        );
      },
    },
  ];

  return (
    <Box>
      <PageHeader title="Community Summaries" />
      <PageFilters dateRange={dateRange} onDateRangeChange={setDateRange} />

      {/* Table */}
      <Paper sx={{ borderRadius: '8px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        {/* Header: summary chips, filters, view options */}
        <Box sx={{ px: 2, pt: 2, pb: 1.5, borderBottom: '1px solid #E2E8F0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterListIcon color="action" fontSize="small" />
              <Typography variant="subtitle2">Filters</Typography>
              <Chip label={`${filtered.length} communities`} size="small" color="primary" sx={{ ml: 0.5 }} />
              <Chip label={`${totalCitations} total citations`} size="small" sx={{ bgcolor: '#FEF3C7', color: '#92400E', fontWeight: 600 }} />
              {totalKTags > 0 && <Chip label={`${totalKTags} K-Tags`} size="small" sx={{ bgcolor: '#FEE2E2', color: '#991B1B', fontWeight: 600 }} />}
              <Chip label={`${defFreeCount} deficiency-free`} size="small" sx={{ bgcolor: '#BBF7D0', color: '#166534', fontWeight: 600 }} />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="text"
                color="primary"
                size="small"
                startIcon={<ViewColumnIcon />}
                onClick={(e) => setViewMenuAnchor(e.currentTarget)}
              >
                View options
              </Button>
              <Button variant="contained" color="inherit" size="small" startIcon={<FileDownloadIcon />}>Export</Button>
            </Box>
            <Menu
              anchorEl={viewMenuAnchor}
              open={Boolean(viewMenuAnchor)}
              onClose={() => setViewMenuAnchor(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <Box sx={{ px: 2, py: 0.5, minWidth: 200 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#5c6874', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Toggle Columns
                </Typography>
              </Box>
              <MenuItem sx={{ py: 0.25 }}>
                <FormControlLabel
                  control={<Switch size="small" checked={showRegion} onChange={(e) => setShowRegion(e.target.checked)} />}
                  label={<Typography variant="body2">Show Region</Typography>}
                />
              </MenuItem>
            </Menu>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <TextField size="small" placeholder="Search name or region..." value={search}
              onChange={(e) => setSearch(e.target.value)} sx={{ minWidth: 240 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Region</InputLabel>
              <Select value={regionFilter} label="Region" onChange={(e) => setRegionFilter(e.target.value)}>
                <MenuItem value="">All</MenuItem>
                {avirRegions.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </Select>
            </FormControl>
            <Button variant="text" startIcon={<CloseIcon />} sx={{ height: 44 }}
              onClick={() => { setSearch(''); setRegionFilter(''); }}>
              Reset
            </Button>
          </Box>
        </Box>
        <DataGrid
          rows={filtered}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
            sorting: { sortModel: [{ field: 'totalCitations', sort: 'desc' }] },
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          disableRowSelectionOnClick
          disableColumnMenu
          onRowClick={(params) => navigate(`/facility/${params.row.id}`)}
          getRowClassName={(params) => {
            if (params.row.totalKTags > 0) return 'ktag-row';
            if (params.row.totalCitations === 0 && params.row.surveyed) return 'def-free-row';
            return '';
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': { bgcolor: '#e0e4e7', borderBottom: 'none' },
            '& .MuiDataGrid-columnHeader': { bgcolor: '#e0e4e7' },
            '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 400, fontSize: '14px', color: '#293036', letterSpacing: '-0.084px', lineHeight: '16px', whiteSpace: 'normal', textOverflow: 'clip', overflow: 'visible' },
            '& .MuiDataGrid-columnHeaderTitleContainerContent': { whiteSpace: 'normal', lineHeight: 1.3, overflow: 'visible' },
            '& .MuiDataGrid-columnSeparator': { display: 'none' },
            '& .MuiDataGrid-row': { cursor: 'pointer', '&:hover': { bgcolor: '#F0F7FF' } },
            '& .ktag-row': { bgcolor: '#FEF2F2', '&:hover': { bgcolor: '#FEE2E2' } },
            '& .def-free-row': { bgcolor: '#F0FDF4', '&:hover': { bgcolor: '#DCFCE7' } },
            '& .MuiDataGrid-cell': { py: 1, borderBottom: '1px solid #F1F5F9', alignItems: 'center' },
            '& .MuiDataGrid-cell--withRenderer': { overflow: 'visible' },
          }}
          getRowHeight={() => 'auto' as const}
          autoHeight
        />
      </Paper>
    </Box>
  );
}
