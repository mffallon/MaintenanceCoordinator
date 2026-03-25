import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Chip, Button, FormControl, InputLabel, Select,
  MenuItem, TextField, InputAdornment, IconButton, Divider,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FilterListIcon from '@mui/icons-material/FilterList';
import { facilities } from '../data/facilities';
import { citations } from '../data/citations';
import PageHeader from '../components/PageHeader';

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
    surveyType: string; facilityRiskScore: number;
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
        facilityRiskScore: fac.riskScore,
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
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');

  const states = [...new Set(allRows.map((r) => r.state))].sort();

  const filtered = useMemo(() => {
    return allRows.filter((r) => {
      if (search && !r.facilityName.toLowerCase().includes(search.toLowerCase())
        && !r.tag.toLowerCase().includes(search.toLowerCase())
        && !r.category.toLowerCase().includes(search.toLowerCase())) return false;
      if (tagFilter && r.tagType !== tagFilter) return false;
      if (severityFilter && r.severity !== severityFilter) return false;
      if (statusFilter && r.status !== statusFilter) return false;
      if (stateFilter && r.state !== stateFilter) return false;
      return true;
    });
  }, [search, tagFilter, severityFilter, statusFilter, stateFilter]);

  const overdueCount = filtered.filter((r) => r.daysRemaining < 0).length;
  const dueWeek = filtered.filter((r) => r.daysRemaining >= 0 && r.daysRemaining <= 7).length;
  const due30 = filtered.filter((r) => r.daysRemaining > 7 && r.daysRemaining <= 30).length;

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
      field: 'deadline', headerName: 'Deadline', width: 110,
      renderCell: (p: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{p.value}</Typography>
      ),
    },
    {
      field: 'daysRemaining', headerName: 'Days Left', width: 120, type: 'number',
      renderCell: (p: GridRenderCellParams) => {
        const d = p.value as number;
        let color = '#16A34A'; let bg = '#DCFCE7'; let label = `${d}d`;
        if (d < 0) { color = '#991B1B'; bg = '#FEE2E2'; label = `${Math.abs(d)}d overdue`; }
        else if (d <= 7) { color = '#991B1B'; bg = '#FEE2E2'; }
        else if (d <= 14) { color = '#9A3412'; bg = '#FED7AA'; }
        else if (d <= 30) { color = '#854D0E'; bg = '#FEF9C3'; }
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box sx={{
              width: 8, height: 8, borderRadius: '50%',
              bgcolor: d < 0 ? '#DC2626' : d <= 7 ? '#DC2626' : d <= 14 ? '#EA580C' : d <= 30 ? '#CA8A04' : '#16A34A',
            }} />
            <Chip label={label} size="small" sx={{ bgcolor: bg, color, fontWeight: 700, fontSize: '0.75rem', height: 24 }} />
          </Box>
        );
      },
    },
    {
      field: 'tag', headerName: 'Tag', width: 90,
      renderCell: (p: GridRenderCellParams) => tagChip(p.value as string, p.row.tagType),
    },
    {
      field: 'tagType', headerName: 'Type', width: 75,
      renderCell: (p: GridRenderCellParams) => (
        <Typography variant="caption" sx={{
          fontWeight: 700,
          color: p.value === 'F' ? '#1E40AF' : p.value === 'K' ? '#991B1B' : '#854D0E',
        }}>
          {p.value}-Tag
        </Typography>
      ),
    },
    { field: 'category', headerName: 'Category', flex: 1, minWidth: 180 },
    {
      field: 'description', headerName: 'Description', flex: 1.5, minWidth: 220,
      renderCell: (p: GridRenderCellParams) => (
        <Typography variant="caption" sx={{ whiteSpace: 'normal', lineHeight: 1.3 }}>{p.value}</Typography>
      ),
    },
    {
      field: 'severity', headerName: 'Severity', width: 130,
      renderCell: (p: GridRenderCellParams) => {
        const map: Record<string, { bg: string; color: string }> = {
          'IJ': { bg: '#FEE2E2', color: '#991B1B' },
          'Actual Harm': { bg: '#FED7AA', color: '#9A3412' },
          'Potential Harm': { bg: '#FEF9C3', color: '#854D0E' },
          'No Harm': { bg: '#E2E8F0', color: '#475569' },
        };
        const s = map[p.value as string] || map['No Harm'];
        return <Chip label={p.value} size="small" sx={{ bgcolor: s.bg, color: s.color, fontWeight: 600 }} />;
      },
    },
    { field: 'scope', headerName: 'Scope', width: 100 },
    {
      field: 'status', headerName: 'Status', width: 110,
      renderCell: (p: GridRenderCellParams) => {
        const map: Record<string, { bg: string; color: string }> = {
          'Open': { bg: '#FEE2E2', color: '#991B1B' },
          'Has Plan': { bg: '#DBEAFE', color: '#1E40AF' },
          'No Plan': { bg: '#FEF3C7', color: '#92400E' },
          'Corrected': { bg: '#BBF7D0', color: '#166534' },
          'Past Non-Compliance': { bg: '#F1F5F9', color: '#475569' },
        };
        const s = map[p.value as string] || { bg: '#F1F5F9', color: '#475569' };
        return <Chip label={p.value} size="small" sx={{ bgcolor: s.bg, color: s.color, fontWeight: 600 }} />;
      },
    },
    {
      field: 'facilityName', headerName: 'Facility', width: 200,
      renderCell: (p: GridRenderCellParams) => (
        <Box>
          <Typography variant="body2" sx={{
            fontWeight: 600, color: 'primary.main', cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }} onClick={(e) => { e.stopPropagation(); navigate(`/facility/${p.row.facilityId}`); }}>
            {p.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">{p.row.city}, {p.row.state}</Typography>
        </Box>
      ),
    },
    { field: 'state', headerName: 'State', width: 60, align: 'center', headerAlign: 'center' },
    { field: 'region', headerName: 'Region', width: 100 },
    {
      field: 'facilityRiskScore', headerName: 'Risk', width: 80, type: 'number', align: 'center', headerAlign: 'center',
      renderCell: (p: GridRenderCellParams) => {
        const v = p.value as number;
        return <Chip label={v} size="small" sx={{
          fontWeight: 700, fontSize: '0.7rem', minWidth: 36,
          bgcolor: v >= 30 ? '#FECACA' : v >= 10 ? '#FED7AA' : '#BBF7D0',
          color: v >= 30 ? '#991B1B' : v >= 10 ? '#9A3412' : '#166534',
        }} />;
      },
    },
    { field: 'surveyDate', headerName: 'Survey Date', width: 105 },
    { field: 'surveyType', headerName: 'Survey Type', width: 140 },
  ];

  return (
    <Box>
      <PageHeader
        title="Citation Deadlines"
        actions={<Button variant="outlined" startIcon={<FileDownloadIcon />} size="small">Export</Button>}
      />

      {/* Summary chips */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <Chip label={`${filtered.length} total`} color="primary" />
        {overdueCount > 0 && <Chip label={`${overdueCount} overdue`} sx={{ bgcolor: '#FEE2E2', color: '#991B1B', fontWeight: 700 }} />}
        {dueWeek > 0 && <Chip label={`${dueWeek} due this week`} sx={{ bgcolor: '#FED7AA', color: '#9A3412', fontWeight: 700 }} />}
        <Chip label={`${due30} due in 30d`} sx={{ bgcolor: '#FEF9C3', color: '#854D0E', fontWeight: 600 }} />
        <Divider orientation="vertical" flexItem />
        <Chip label={`F: ${filtered.filter((r) => r.tagType === 'F').length}`} sx={{ bgcolor: '#DBEAFE', color: '#1E40AF', fontWeight: 700 }} />
        <Chip label={`K: ${filtered.filter((r) => r.tagType === 'K').length}`} sx={{ bgcolor: '#FEE2E2', color: '#991B1B', fontWeight: 700 }} />
        <Chip label={`E: ${filtered.filter((r) => r.tagType === 'E').length}`} sx={{ bgcolor: '#FEF9C3', color: '#854D0E', fontWeight: 700 }} />
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 3, border: '1px solid #E2E8F0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <FilterListIcon color="action" fontSize="small" />
          <Typography variant="subtitle2">Filters</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <TextField size="small" placeholder="Search tag, facility, category..." value={search}
            onChange={(e) => setSearch(e.target.value)} sx={{ minWidth: 250 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} />
          <FormControl size="small" sx={{ minWidth: 110 }}>
            <InputLabel>Tag Type</InputLabel>
            <Select value={tagFilter} label="Tag Type" onChange={(e) => setTagFilter(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="F">F-Tags</MenuItem>
              <MenuItem value="K">K-Tags</MenuItem>
              <MenuItem value="E">E-Tags</MenuItem>
            </Select>
          </FormControl>
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
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="Has Plan">Has Plan</MenuItem>
              <MenuItem value="No Plan">No Plan</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 90 }}>
            <InputLabel>State</InputLabel>
            <Select value={stateFilter} label="State" onChange={(e) => setStateFilter(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              {states.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
          <Button size="small" onClick={() => { setSearch(''); setTagFilter(''); setSeverityFilter(''); setStatusFilter(''); setStateFilter(''); }}>
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
            sorting: { sortModel: [{ field: 'daysRemaining', sort: 'asc' }] },
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          disableRowSelectionOnClick
          onRowClick={(params) => navigate(`/facility/${params.row.facilityId}`)}
          getRowClassName={(params) => {
            if (params.row.daysRemaining < 0) return 'overdue-row';
            if (params.row.daysRemaining <= 7) return 'due-soon-row';
            return '';
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': { bgcolor: '#F8FAFC', borderBottom: '2px solid #E2E8F0' },
            '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 700, fontSize: '0.8rem', color: '#475569' },
            '& .MuiDataGrid-row': { cursor: 'pointer', '&:hover': { bgcolor: '#F0F7FF' } },
            '& .overdue-row': { bgcolor: '#FEF2F2', '&:hover': { bgcolor: '#FEE2E2' } },
            '& .due-soon-row': { bgcolor: '#FFFBEB', '&:hover': { bgcolor: '#FEF3C7' } },
            '& .MuiDataGrid-cell': { py: 1, borderBottom: '1px solid #F1F5F9' },
          }}
          autoHeight
        />
      </Paper>
    </Box>
  );
}
