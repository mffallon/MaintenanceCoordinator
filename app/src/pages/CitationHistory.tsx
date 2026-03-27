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
import { facilities } from '../data/facilities';
import { citations } from '../data/citations';
import PageHeader from '../components/PageHeader';
import { useCommunityFilter } from '../components/CommunityFilter';
import { fmtDate } from '../utils/formatDate';

// Build the same deadline-enriched rows used on the dashboard
function buildAllDeadlineRows() {
  const now = new Date();
  const spreadDays = [
    -14, -10, -7, -5, -3, -1, 0, 1, 2, 3, 4, 5,
    7, 9, 11, 14, 18, 21, 25, 30, 35, 40, 45, 50, 55, 60,
    70, 80, 90, 100, 110, 120,
  ];

  const rows: Array<{
    id: string; facilityId: string; facilityName: string; city: string;
    state: string; region: string; tag: string; tagType: 'F' | 'K' | 'E';
    category: string; severity: string; scope: string; status: string;
    deadline: string; daysRemaining: number; surveyDate: string;
    surveyType: string;
    description: string; resolutionSteps: string; preventionStrategies: string;
  }> = [];

  let citIdx = 0;
  for (const fac of facilities) {
    if (fac.totalCitations === 0) continue;
    const facCitations = citations.filter((c) => c.facilityId === fac.id);

    for (const cit of facCitations) {
      const dayOffset = spreadDays[citIdx % spreadDays.length]
        + Math.floor(citIdx / spreadDays.length) * 5;
      const deadline = new Date(now.getTime() + dayOffset * 24 * 60 * 60 * 1000);
      const tagType: 'F' | 'K' | 'E' = cit.tag.startsWith('K') ? 'K' : cit.tag.startsWith('E') ? 'E' : 'F';

      rows.push({
        id: cit.id,
        facilityId: fac.id,
        facilityName: fac.name,
        city: fac.city,
        state: fac.state,
        region: fac.region,
        tag: cit.tag,
        tagType,
        category: cit.category,
        severity: cit.severity,
        scope: cit.scope,
        status: cit.status,
        deadline: deadline.toISOString().split('T')[0],
        daysRemaining: dayOffset,
        surveyDate: cit.surveyDate,
        surveyType: cit.surveyType,
        description: cit.description,
        resolutionSteps: cit.resolutionSteps,
        preventionStrategies: cit.preventionStrategies,
      });
      citIdx++;
    }
  }

  rows.sort((a, b) => a.daysRemaining - b.daysRemaining);
  return rows;
}

const allRows = buildAllDeadlineRows();

export default function CitationHistory() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { passesFilter } = useCommunityFilter();
  const initialStatusParam = searchParams.get('status') || '';
  const initialStatus = initialStatusParam === 'open' ? 'open' : initialStatusParam;
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [stateFilter, setStateFilter] = useState('');
  const [quickFilter, setQuickFilter] = useState<string | null>(null);

  const communityRows = useMemo(() => allRows.filter((r) => passesFilter(r.facilityId)), [passesFilter]);
  const states = [...new Set(communityRows.map((r) => r.state))].sort();

  const filtered = useMemo(() => {
    return communityRows.filter((r) => {
      if (search && !r.facilityName.toLowerCase().includes(search.toLowerCase())
        && !r.tag.toLowerCase().includes(search.toLowerCase())
        && !r.category.toLowerCase().includes(search.toLowerCase())) return false;
      if (tagFilter && r.tagType !== tagFilter) return false;
      if (severityFilter && r.severity !== severityFilter) return false;
      if (statusFilter) {
        if (statusFilter === 'open') { if (r.status !== 'Open' && r.status !== 'No Plan') return false; }
        else if (r.status !== statusFilter) return false;
      }
      if (stateFilter && r.state !== stateFilter) return false;
      // Quick filter chips
      if (quickFilter === 'overdue' && r.daysRemaining >= 0) return false;
      if (quickFilter === 'week' && (r.daysRemaining < 0 || r.daysRemaining > 7)) return false;
      if (quickFilter === '30d' && (r.daysRemaining < 0 || r.daysRemaining > 30)) return false;
      if (quickFilter === 'F' && r.tagType !== 'F') return false;
      if (quickFilter === 'K' && r.tagType !== 'K') return false;
      if (quickFilter === 'E' && r.tagType !== 'E') return false;
      return true;
    });
  }, [communityRows, search, tagFilter, severityFilter, statusFilter, stateFilter, quickFilter]);

  // Counts based on communityRows (before quick filter) but after text/dropdown filters
  const baseFiltered = useMemo(() => {
    return communityRows.filter((r) => {
      if (search && !r.facilityName.toLowerCase().includes(search.toLowerCase())
        && !r.tag.toLowerCase().includes(search.toLowerCase())
        && !r.category.toLowerCase().includes(search.toLowerCase())) return false;
      if (tagFilter && r.tagType !== tagFilter) return false;
      if (severityFilter && r.severity !== severityFilter) return false;
      if (statusFilter) {
        if (statusFilter === 'open') { if (r.status !== 'Open' && r.status !== 'No Plan') return false; }
        else if (r.status !== statusFilter) return false;
      }
      if (stateFilter && r.state !== stateFilter) return false;
      return true;
    });
  }, [communityRows, search, tagFilter, severityFilter, statusFilter, stateFilter]);

  const overdueCount = baseFiltered.filter((r) => r.daysRemaining < 0).length;
  const dueWeek = baseFiltered.filter((r) => r.daysRemaining >= 0 && r.daysRemaining <= 7).length;
  const due30 = baseFiltered.filter((r) => r.daysRemaining >= 0 && r.daysRemaining <= 30).length;
  const fCount = baseFiltered.filter((r) => r.tagType === 'F').length;
  const kCount = baseFiltered.filter((r) => r.tagType === 'K').length;
  const eCount = baseFiltered.filter((r) => r.tagType === 'E').length;

  const toggleQuick = (key: string) => setQuickFilter((prev) => prev === key ? null : key);

  const tagChip = (tag: string, type: 'F' | 'K' | 'E') => {
    const styles = {
      F: { bgcolor: '#DBEAFE', color: '#1E40AF', border: '1.5px solid #93C5FD' },
      K: { bgcolor: '#FEE2E2', color: '#991B1B', border: '1.5px solid #FCA5A5' },
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
            {(p.value as string).replace('Life Care Center of ', 'LCC ')}
          </Typography>
          <Typography variant="caption" color="text.secondary">{p.row.city}, {p.row.state}</Typography>
        </Box>
      ),
    },
    {
      field: 'deadline', headerName: 'Due', width: 130,
      sortComparator: (_a: string, _b: string, paramA: any, paramB: any) => {
        return (paramA.api.getRow(paramA.id)?.daysRemaining ?? 0) - (paramB.api.getRow(paramB.id)?.daysRemaining ?? 0);
      },
      renderCell: (p: GridRenderCellParams) => {
        const d = p.row.daysRemaining as number;
        let color = '#16A34A'; let bg = '#DCFCE7'; let label = `${d}d`;
        if (d < 0) { color = '#991B1B'; bg = '#FEE2E2'; label = `${Math.abs(d)}d overdue`; }
        else if (d <= 7) { color = '#991B1B'; bg = '#FEE2E2'; }
        else if (d <= 14) { color = '#9A3412'; bg = '#FED7AA'; }
        else if (d <= 30) { color = '#854D0E'; bg = '#FEF9C3'; }
        return (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
              <Box sx={{
                width: 6, height: 6, borderRadius: '50%',
                bgcolor: d < 0 ? '#DC2626' : d <= 7 ? '#DC2626' : d <= 14 ? '#EA580C' : d <= 30 ? '#CA8A04' : '#16A34A',
              }} />
              <Chip label={label} size="small" sx={{ bgcolor: bg, color, fontWeight: 700, fontSize: '0.65rem', height: 20 }} />
            </Box>
            <Typography variant="caption" sx={{ color: '#5c6874', fontSize: '0.75rem' }}>{fmtDate(p.value as string)}</Typography>
          </Box>
        );
      },
    },
    {
      field: 'tag', headerName: 'Tag', width: 90,
      renderCell: (p: GridRenderCellParams) => tagChip(p.value as string, p.row.tagType),
    },
    { field: 'category', headerName: 'Category', flex: 0.8, minWidth: 140 },
    {
      field: 'severity', headerName: 'Severity', width: 120,
      renderCell: (p: GridRenderCellParams) => {
        const map: Record<string, { bg: string; color: string }> = {
          'IJ': { bg: '#FEE2E2', color: '#991B1B' },
          'Actual Harm': { bg: '#FED7AA', color: '#9A3412' },
          'Potential Harm': { bg: '#FEF9C3', color: '#854D0E' },
          'No Harm': { bg: '#E2E8F0', color: '#475569' },
        };
        const s = map[p.value as string] || map['No Harm'];
        return <Chip label={p.value} size="small" sx={{ bgcolor: s.bg, color: s.color, fontWeight: 600, fontSize: '0.7rem' }} />;
      },
    },
    {
      field: 'status', headerName: 'Status', width: 100,
      renderCell: (p: GridRenderCellParams) => {
        const map: Record<string, { bg: string; color: string }> = {
          'Open': { bg: '#FEE2E2', color: '#991B1B' },
          'Has Plan': { bg: '#DBEAFE', color: '#1E40AF' },
          'No Plan': { bg: '#FEF3C7', color: '#92400E' },
          'Corrected': { bg: '#BBF7D0', color: '#166534' },
          'Past Non-Compliance': { bg: '#F1F5F9', color: '#475569' },
        };
        const s = map[p.value as string] || { bg: '#F1F5F9', color: '#475569' };
        return <Chip label={p.value} size="small" sx={{ bgcolor: s.bg, color: s.color, fontWeight: 600, fontSize: '0.7rem' }} />;
      },
    },
    { field: 'surveyDate', headerName: 'Survey Date', width: 100,
      renderCell: (p: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{fmtDate(p.value as string)}</Typography>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Citations"
      />

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
          <TextField size="small" placeholder="Search tag, facility, category..." value={search}
            onChange={(e) => setSearch(e.target.value)} sx={{ minWidth: 250 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Severity</InputLabel>
            <Select value={severityFilter} label="Severity" onChange={(e) => setSeverityFilter(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="IJ">Immediate Jeopardy</MenuItem>
              <MenuItem value="Actual Harm">Actual Harm</MenuItem>
              <MenuItem value="Potential Harm">Potential Harm</MenuItem>
              <MenuItem value="No Harm">No Harm</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="open">Open & No Plan</MenuItem>
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="Has Plan">Has Plan</MenuItem>
              <MenuItem value="No Plan">No Plan</MenuItem>
              <MenuItem value="Corrected">Corrected</MenuItem>
              <MenuItem value="Past Non-Compliance">Past Non-Compliance</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 90 }}>
            <InputLabel>State</InputLabel>
            <Select value={stateFilter} label="State" onChange={(e) => setStateFilter(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              {states.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
          <Button variant="text" startIcon={<CloseIcon />} sx={{ height: 44 }}
            onClick={() => { setSearch(''); setTagFilter(''); setSeverityFilter(''); setStatusFilter(''); setStateFilter(''); setQuickFilter(null); }}>
            Reset
          </Button>
        </Box>
        {/* Table title + quick filter chips */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#293036' }}>
            {filtered.length} citations
          </Typography>
          <Chip label={`${overdueCount} overdue`} size="small"
            onClick={() => toggleQuick('overdue')}
            sx={{ cursor: 'pointer', fontWeight: 700,
              bgcolor: quickFilter === 'overdue' ? '#991B1B' : '#FEE2E2',
              color: quickFilter === 'overdue' ? '#fff' : '#991B1B',
              border: quickFilter === 'overdue' ? '2px solid #991B1B' : 'none',
            }} />
          <Chip label={`${dueWeek} due this week`} size="small"
            onClick={() => toggleQuick('week')}
            sx={{ cursor: 'pointer', fontWeight: 700,
              bgcolor: quickFilter === 'week' ? '#9A3412' : '#FED7AA',
              color: quickFilter === 'week' ? '#fff' : '#9A3412',
              border: quickFilter === 'week' ? '2px solid #9A3412' : 'none',
            }} />
          <Chip label={`${due30} due in 30d`} size="small"
            onClick={() => toggleQuick('30d')}
            sx={{ cursor: 'pointer', fontWeight: 700,
              bgcolor: quickFilter === '30d' ? '#854D0E' : '#FEF9C3',
              color: quickFilter === '30d' ? '#fff' : '#854D0E',
              border: quickFilter === '30d' ? '2px solid #854D0E' : 'none',
            }} />
          <Divider orientation="vertical" flexItem />
          <Chip label={`F-Tags: ${fCount}`} size="small"
            onClick={() => toggleQuick('F')}
            sx={{ cursor: 'pointer', fontWeight: 700,
              bgcolor: quickFilter === 'F' ? '#1E40AF' : '#DBEAFE',
              color: quickFilter === 'F' ? '#fff' : '#1E40AF',
              border: quickFilter === 'F' ? '2px solid #1E40AF' : 'none',
            }} />
          <Chip label={`K-Tags: ${kCount}`} size="small"
            onClick={() => toggleQuick('K')}
            sx={{ cursor: 'pointer', fontWeight: 700,
              bgcolor: quickFilter === 'K' ? '#991B1B' : '#FEE2E2',
              color: quickFilter === 'K' ? '#fff' : '#991B1B',
              border: quickFilter === 'K' ? '2px solid #991B1B' : 'none',
            }} />
          <Chip label={`E-Tags: ${eCount}`} size="small"
            onClick={() => toggleQuick('E')}
            sx={{ cursor: 'pointer', fontWeight: 700,
              bgcolor: quickFilter === 'E' ? '#854D0E' : '#FEF9C3',
              color: quickFilter === 'E' ? '#fff' : '#854D0E',
              border: quickFilter === 'E' ? '2px solid #854D0E' : 'none',
            }} />
        </Box>
        </Box>
        <DataGrid
          rows={filtered}
          columns={columns}
          rowHeight={60}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
            sorting: { sortModel: [{ field: 'deadline', sort: 'asc' }] },
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          disableRowSelectionOnClick
          disableColumnMenu
          onRowClick={(params) => navigate(`/facility/${params.row.facilityId}`)}
          getRowClassName={(params) => {
            if (params.row.daysRemaining < 0) return 'overdue-row';
            if (params.row.daysRemaining <= 7) return 'due-soon-row';
            return '';
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': { bgcolor: '#e0e4e7', borderBottom: 'none' },
            '& .MuiDataGrid-columnHeader': { bgcolor: '#e0e4e7' },
            '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 400, fontSize: '14px', color: '#293036', letterSpacing: '-0.084px', lineHeight: '16px' },
            '& .MuiDataGrid-columnSeparator': { display: 'none' },
            '& .MuiDataGrid-row': { cursor: 'pointer', '&:hover': { bgcolor: '#F0F7FF' } },
            '& .overdue-row': { bgcolor: '#FEF2F2', '&:hover': { bgcolor: '#FEE2E2' } },
            '& .due-soon-row': { bgcolor: '#FFFBEB', '&:hover': { bgcolor: '#FEF3C7' } },
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
