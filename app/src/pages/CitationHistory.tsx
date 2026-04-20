import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box, Typography, Paper, Chip, Button, FormControl, InputLabel, Select,
  MenuItem, TextField, InputAdornment, IconButton, Divider,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { facilities, citations, regions as avirRegions } from '../data/avir-data';
import PageHeader from '../components/PageHeader';
import PageFilters from '../components/PageFilters';
import { useCommunityFilter } from '../components/CommunityFilter';
import { fmtDate } from '../utils/formatDate';
import { makeDateFilter } from '../utils/dateFilter';

// Build rows from Avir citations
function buildAllRows() {
  return citations.map((cit) => {
    const fac = facilities.find((f) => f.id === cit.facilityId);
    return {
      id: cit.id,
      facilityId: cit.facilityId,
      facilityName: cit.facility,
      region: cit.region,
      state: 'TX',
      tag: cit.tag,
      tagType: cit.tagType,
      description: cit.description,
      status: cit.status,
      date: cit.date,
      surveyor: cit.surveyor,
      observation: cit.observation,
      isWaiver: cit.isWaiver,
    };
  });
}

const allRows = buildAllRows();

export default function CitationHistory() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { passesFilter } = useCommunityFilter();
  const initialStatusParam = searchParams.get('status') || '';
  const [dateRange, setDateRange] = useState('all');
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatusParam);
  const [regionFilter, setRegionFilter] = useState('');
  const [quickFilter, setQuickFilter] = useState<string | null>(null);

  const communityRows = useMemo(() => {
    const passesDate = makeDateFilter(dateRange);
    return allRows.filter((r) => passesFilter(r.facilityId) && passesDate(r.date));
  }, [passesFilter, dateRange]);

  const filtered = useMemo(() => {
    return communityRows.filter((r) => {
      if (search && !r.facilityName.toLowerCase().includes(search.toLowerCase())
        && !r.tag.toLowerCase().includes(search.toLowerCase())
        && !r.description.toLowerCase().includes(search.toLowerCase())) return false;
      if (tagFilter && r.tagType !== tagFilter) return false;
      if (statusFilter && r.status !== statusFilter) return false;
      if (regionFilter && r.region !== regionFilter) return false;
      // Quick filter chips
      if (quickFilter === 'K' && r.tagType !== 'K') return false;
      if (quickFilter === 'N' && r.tagType !== 'N') return false;
      if (quickFilter === 'E' && r.tagType !== 'E') return false;
      if (quickFilter === 'waiver' && !r.isWaiver) return false;
      return true;
    });
  }, [communityRows, search, tagFilter, statusFilter, regionFilter, quickFilter]);

  // Counts based on communityRows (before quick filter) but after text/dropdown filters
  const baseFiltered = useMemo(() => {
    return communityRows.filter((r) => {
      if (search && !r.facilityName.toLowerCase().includes(search.toLowerCase())
        && !r.tag.toLowerCase().includes(search.toLowerCase())
        && !r.description.toLowerCase().includes(search.toLowerCase())) return false;
      if (tagFilter && r.tagType !== tagFilter) return false;
      if (statusFilter && r.status !== statusFilter) return false;
      if (regionFilter && r.region !== regionFilter) return false;
      return true;
    });
  }, [communityRows, search, tagFilter, statusFilter, regionFilter]);

  const kCount = baseFiltered.filter((r) => r.tagType === 'K').length;
  const nCount = baseFiltered.filter((r) => r.tagType === 'N').length;
  const eCount = baseFiltered.filter((r) => r.tagType === 'E').length;
  const waiverCount = baseFiltered.filter((r) => r.isWaiver).length;

  const toggleQuick = (key: string) => setQuickFilter((prev) => prev === key ? null : key);

  const tagChip = (tag: string, type: 'K' | 'N' | 'E') => {
    const styles = {
      K: { bgcolor: '#FEE2E2', color: '#991B1B', border: '1.5px solid #FCA5A5' },
      N: { bgcolor: '#DBEAFE', color: '#1E40AF', border: '1.5px solid #93C5FD' },
      E: { bgcolor: '#FEF9C3', color: '#854D0E', border: '1.5px solid #FDE047' },
    };
    return <Chip label={tag} size="small" sx={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.8rem', ...styles[type] }} />;
  };

  const columns: GridColDef[] = [
    {
      field: 'facilityName', headerName: 'Facility', flex: 1, minWidth: 170,
      renderCell: (p: GridRenderCellParams) => (
        <Box>
          <Typography variant="body2" sx={{
            fontWeight: 600, color: 'primary.main', cursor: 'pointer', fontSize: '0.8rem',
            '&:hover': { textDecoration: 'underline' },
          }} onClick={(e) => { e.stopPropagation(); navigate(`/facility/${p.row.facilityId}`); }}>
            {p.value as string}
          </Typography>
          <Typography variant="caption" color="text.secondary">{p.row.region}</Typography>
        </Box>
      ),
    },
    {
      field: 'date', headerName: 'Date', width: 100,
      renderCell: (p: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{fmtDate(p.value as string)}</Typography>
      ),
    },
    {
      field: 'tag', headerName: 'Tag', width: 90,
      renderCell: (p: GridRenderCellParams) => tagChip(p.value as string, p.row.tagType),
    },
    { field: 'description', headerName: 'Description', flex: 0.8, minWidth: 140 },
    {
      field: 'status', headerName: 'Status', width: 100,
      renderCell: (p: GridRenderCellParams) => {
        const map: Record<string, { bg: string; color: string }> = {
          'Completed': { bg: '#BBF7D0', color: '#166534' },
          'Open': { bg: '#FEE2E2', color: '#991B1B' },
          'Pending': { bg: '#FEF3C7', color: '#92400E' },
          'NA': { bg: '#F1F5F9', color: '#64748B' },
        };
        const s = map[p.value as string] || { bg: '#F1F5F9', color: '#475569' };
        return <Chip label={(p.value as string) || '—'} size="small" sx={{ bgcolor: s.bg, color: s.color, fontWeight: 600, fontSize: '0.7rem' }} />;
      },
    },
    {
      field: 'surveyor', headerName: 'Surveyor', width: 120,
      renderCell: (p: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{(p.value as string) || '—'}</Typography>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Citations"
      />
      <PageFilters dateRange={dateRange} onDateRangeChange={setDateRange} />

      {/* Filters + Table in one section */}
      <Paper sx={{ borderRadius: '8px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <FilterListIcon color="action" fontSize="small" />
          <Typography variant="subtitle2">Filters</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button size="small" startIcon={<FileDownloadIcon />}>Export</Button>
        </Box>
        {/* Dropdown filters */}
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 1.5 }}>
          <TextField size="small" placeholder="Search tag, facility, description..." value={search}
            onChange={(e) => setSearch(e.target.value)} sx={{ minWidth: 250 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="NA">NA</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Region</InputLabel>
            <Select value={regionFilter} label="Region" onChange={(e) => setRegionFilter(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              {avirRegions.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
            </Select>
          </FormControl>
          <Button variant="text" startIcon={<CloseIcon />} sx={{ height: 44 }}
            onClick={() => { setSearch(''); setTagFilter(''); setStatusFilter(''); setRegionFilter(''); setQuickFilter(null); }}>
            Reset
          </Button>
        </Box>
        {/* Table title + quick filter chips */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#293036' }}>
            {filtered.length} citations
          </Typography>
          <Chip label={`K-Tags: ${kCount}`} size="small"
            onClick={() => toggleQuick('K')}
            sx={{ cursor: 'pointer', fontWeight: 700,
              bgcolor: quickFilter === 'K' ? '#991B1B' : '#FEE2E2',
              color: quickFilter === 'K' ? '#fff' : '#991B1B',
              border: quickFilter === 'K' ? '2px solid #991B1B' : 'none',
            }} />
          <Chip label={`N-Tags: ${nCount}`} size="small"
            onClick={() => toggleQuick('N')}
            sx={{ cursor: 'pointer', fontWeight: 700,
              bgcolor: quickFilter === 'N' ? '#1E40AF' : '#DBEAFE',
              color: quickFilter === 'N' ? '#fff' : '#1E40AF',
              border: quickFilter === 'N' ? '2px solid #1E40AF' : 'none',
            }} />
          <Chip label={`E-Tags: ${eCount}`} size="small"
            onClick={() => toggleQuick('E')}
            sx={{ cursor: 'pointer', fontWeight: 700,
              bgcolor: quickFilter === 'E' ? '#854D0E' : '#FEF9C3',
              color: quickFilter === 'E' ? '#fff' : '#854D0E',
              border: quickFilter === 'E' ? '2px solid #854D0E' : 'none',
            }} />
          {waiverCount > 0 && (
            <>
              <Divider orientation="vertical" flexItem />
              <Chip label={`Waiver: ${waiverCount}`} size="small"
                onClick={() => toggleQuick('waiver')}
                sx={{ cursor: 'pointer', fontWeight: 700,
                  bgcolor: quickFilter === 'waiver' ? '#92400E' : '#FEF3C7',
                  color: quickFilter === 'waiver' ? '#fff' : '#92400E',
                  border: quickFilter === 'waiver' ? '2px solid #92400E' : 'none',
                }} />
            </>
          )}
        </Box>
        </Box>
        <DataGrid
          rows={filtered}
          columns={columns}
          rowHeight={60}
          initialState={{
            pagination: { paginationModel: { pageSize: 15 } },
            sorting: { sortModel: [{ field: 'date', sort: 'desc' }] },
          }}
          pageSizeOptions={[15, 25, 50, 100]}
          disableRowSelectionOnClick
          disableColumnMenu
          onRowClick={(params) => navigate(`/facility/${params.row.facilityId}`)}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': { bgcolor: '#e0e4e7', borderBottom: 'none' },
            '& .MuiDataGrid-columnHeader': { bgcolor: '#e0e4e7' },
            '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 400, fontSize: '14px', color: '#293036', letterSpacing: '-0.084px', lineHeight: '16px' },
            '& .MuiDataGrid-columnSeparator': { display: 'none' },
            '& .MuiDataGrid-row': { cursor: 'pointer', '&:hover': { bgcolor: '#F0F7FF' } },
            '& .MuiDataGrid-cell': {
              py: 1,
              borderBottom: '1px solid #F1F5F9',
              display: 'flex',
              alignItems: 'center',
              lineHeight: '1.4',
            },
          }}
          autoHeight
        />
      </Paper>
    </Box>
  );
}
