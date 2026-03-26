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
import { facilities } from '../data/facilities';
import PageHeader from '../components/PageHeader';
import { useCommunityFilter } from '../components/CommunityFilter';
import { fmtDate } from '../utils/formatDate';

const states = [...new Set(facilities.map((f) => f.state))].sort();
const regions = [...new Set(facilities.map((f) => f.region))].sort();

export default function Facilities() {
  const navigate = useNavigate();
  const { passesFilter } = useCommunityFilter();
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [showCCN, setShowCCN] = useState(false);
  const [showRegion, setShowRegion] = useState(false);
  const [showCityState, setShowCityState] = useState(true);
  const [viewMenuAnchor, setViewMenuAnchor] = useState<null | HTMLElement>(null);

  const filtered = useMemo(() => {
    return [...facilities]
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((f) => {
        if (!passesFilter(f.id)) return false;
        if (search && !f.name.toLowerCase().includes(search.toLowerCase())
          && !f.city.toLowerCase().includes(search.toLowerCase())
          && !f.ccn.includes(search)) return false;
        if (stateFilter && f.state !== stateFilter) return false;
        if (regionFilter && f.region !== regionFilter) return false;
        return true;
      });
  }, [passesFilter, search, stateFilter, regionFilter]);

  const totalCitations = filtered.reduce((s, f) => s + f.totalCitations, 0);
  const totalIJ = filtered.reduce((s, f) => s + f.ijCitations, 0);
  const defFreeCount = filtered.filter((f) => f.deficiencyFree).length;

  // Severity cell renderer — highlight if > 0
  const severityCell = (value: number, color: string, bgColor: string) =>
    value > 0
      ? <Chip label={value} size="small" sx={{ bgcolor: bgColor, color, fontWeight: 700, minWidth: 32 }} />
      : <Typography variant="caption" color="text.secondary">0</Typography>;

  const columns: GridColDef[] = [
    ...(showCCN ? [{
      field: 'ccn', headerName: 'CCN', width: 80,
      renderCell: (p: GridRenderCellParams) => (
        <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#475569' }}>{p.value}</Typography>
      ),
    } as GridColDef] : []),
    {
      field: 'name', headerName: 'Provider Name', flex: 1, minWidth: 160,
      renderCell: (p: GridRenderCellParams) => (
        <Box>
          <Typography variant="body2" sx={{
            fontWeight: 600, color: 'primary.main', cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }} onClick={(e) => { e.stopPropagation(); navigate(`/facility/${p.row.id}`); }}>
            {p.value}
          </Typography>
          {showRegion && <Typography variant="caption" sx={{ color: '#8492a1', fontSize: '0.7rem' }}>{p.row.region}</Typography>}
          {showCityState && (
            <Typography variant="caption" color="text.secondary">
              {p.row.city}, {p.row.state}
            </Typography>
          )}
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
      field: 'ijCitations', headerName: 'IJ (J-L)', width: 55, type: 'number', align: 'center', headerAlign: 'center',
      renderHeader: () => <Box sx={{ textAlign: 'center', lineHeight: 1.3 }}>IJ<br /><Typography component="span" sx={{ fontSize: '11px', color: '#5c6874' }}>(J-L)</Typography></Box>,
      renderCell: (p: GridRenderCellParams) => severityCell(p.value as number, '#991B1B', '#FEE2E2'),
    },
    {
      field: 'actualHarm', headerName: 'Actual Harm (G-I)', width: 80, type: 'number', align: 'center', headerAlign: 'center',
      renderHeader: () => <Box sx={{ textAlign: 'center', lineHeight: 1.3, whiteSpace: 'normal' }}>Actual<br />Harm<br /><Typography component="span" sx={{ fontSize: '11px', color: '#5c6874' }}>(G-I)</Typography></Box>,
      renderCell: (p: GridRenderCellParams) => severityCell(p.value as number, '#9A3412', '#FED7AA'),
    },
    {
      field: 'potentialHarm', headerName: 'Potential Harm (D-F)', width: 85, type: 'number', align: 'center', headerAlign: 'center',
      renderHeader: () => <Box sx={{ textAlign: 'center', lineHeight: 1.3, whiteSpace: 'normal' }}>Potential<br />Harm<br /><Typography component="span" sx={{ fontSize: '11px', color: '#5c6874' }}>(D-F)</Typography></Box>,
      renderCell: (p: GridRenderCellParams) => severityCell(p.value as number, '#854D0E', '#FEF9C3'),
    },
    {
      field: 'noHarm', headerName: 'No Harm (A-C)', width: 70, type: 'number', align: 'center', headerAlign: 'center',
      renderHeader: () => <Box sx={{ textAlign: 'center', lineHeight: 1.3, whiteSpace: 'normal' }}>No<br />Harm<br /><Typography component="span" sx={{ fontSize: '11px', color: '#5c6874' }}>(A-C)</Typography></Box>,
      renderCell: (p: GridRenderCellParams) => {
        const v = p.value as number;
        return v > 0
          ? <Typography variant="body2" sx={{ color: '#475569' }}>{v}</Typography>
          : <Typography variant="caption" color="text.secondary">0</Typography>;
      },
    },
    {
      field: 'corrected', headerName: 'Corrected', width: 80, type: 'number', align: 'center', headerAlign: 'center',
      renderCell: (p: GridRenderCellParams) => {
        const v = p.value as number;
        return v > 0
          ? <Chip label={v} size="small" sx={{ bgcolor: '#BBF7D0', color: '#166534', fontWeight: 600, minWidth: 32 }} />
          : <Typography variant="caption" color="text.secondary">0</Typography>;
      },
    },
    {
      field: 'hasPlan', headerName: 'Has Plan', width: 70, type: 'number', align: 'center', headerAlign: 'center',
      renderHeader: () => <Box sx={{ textAlign: 'center', lineHeight: 1.3, whiteSpace: 'normal' }}>Has<br />Plan</Box>,
      renderCell: (p: GridRenderCellParams) => {
        const v = p.value as number;
        return v > 0
          ? <Chip label={v} size="small" sx={{ bgcolor: '#DBEAFE', color: '#1E40AF', fontWeight: 600, minWidth: 32 }} />
          : <Typography variant="caption" color="text.secondary">0</Typography>;
      },
    },
    {
      field: 'noPlan', headerName: 'No Plan', width: 65, type: 'number', align: 'center', headerAlign: 'center',
      renderHeader: () => <Box sx={{ textAlign: 'center', lineHeight: 1.3, whiteSpace: 'normal' }}>No<br />Plan</Box>,
      renderCell: (p: GridRenderCellParams) => {
        const v = p.value as number;
        return v > 0
          ? <Chip label={v} size="small" sx={{ bgcolor: '#FECACA', color: '#991B1B', fontWeight: 600, minWidth: 32 }} />
          : <Typography variant="caption" color="text.secondary">0</Typography>;
      },
    },
    {
      field: 'pastNonComp', headerName: 'Past Non-Comp', width: 80, type: 'number', align: 'center', headerAlign: 'center',
      renderHeader: () => <Box sx={{ textAlign: 'center', lineHeight: 1.3, whiteSpace: 'normal' }}>Past<br />Non-Comp</Box>,
      renderCell: (p: GridRenderCellParams) => {
        const v = p.value as number;
        return v > 0
          ? <Chip label={v} size="small" sx={{ bgcolor: '#FEF3C7', color: '#92400E', fontWeight: 600, minWidth: 32 }} />
          : <Typography variant="caption" color="text.secondary">0</Typography>;
      },
    },
    { field: 'surveys', headerName: 'Surveys', width: 70, type: 'number', align: 'center', headerAlign: 'center' },
    {
      field: 'surveyWindow', headerName: 'Survey Window', width: 130,
      valueGetter: (_value: unknown, row: any) => `${row.surveyWindowStart} – ${row.surveyWindowEnd}`,
      renderCell: (p: GridRenderCellParams) => (
        <Box sx={{ lineHeight: 1.3 }}>
          <Typography variant="caption" sx={{ display: 'block', fontSize: '0.75rem' }}>{fmtDate(p.row.surveyWindowStart)}</Typography>
          <Typography variant="caption" sx={{ display: 'block', fontSize: '0.7rem', color: '#8492a1' }}>to {fmtDate(p.row.surveyWindowEnd)}</Typography>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader title="Facility Summaries" />

      {/* Table — matches Excel Facility Detail columns */}
      <Paper sx={{ borderRadius: '8px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        {/* Header: summary chips, filters, view options */}
        <Box sx={{ px: 2, pt: 2, pb: 1.5, borderBottom: '1px solid #E2E8F0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterListIcon color="action" fontSize="small" />
              <Typography variant="subtitle2">Filters</Typography>
              <Chip label={`${filtered.length} facilities`} size="small" color="primary" sx={{ ml: 0.5 }} />
              <Chip label={`${totalCitations} total citations`} size="small" sx={{ bgcolor: '#FEF3C7', color: '#92400E', fontWeight: 600 }} />
              {totalIJ > 0 && <Chip label={`${totalIJ} IJ citations`} size="small" sx={{ bgcolor: '#FEE2E2', color: '#991B1B', fontWeight: 600 }} />}
              <Chip label={`${defFreeCount} deficiency-free`} size="small" sx={{ bgcolor: '#BBF7D0', color: '#166534', fontWeight: 600 }} />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                startIcon={<ViewColumnIcon />}
                onClick={(e) => setViewMenuAnchor(e.currentTarget)}
                sx={{ color: '#5c6874', fontWeight: 500 }}
              >
                View Options
              </Button>
              <Button variant="contained" size="small" startIcon={<FileDownloadIcon />}>Export</Button>
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
                  control={<Switch size="small" checked={showCCN} onChange={(e) => setShowCCN(e.target.checked)} />}
                  label={<Typography variant="body2">Show CCN</Typography>}
                />
              </MenuItem>
              <MenuItem sx={{ py: 0.25 }}>
                <FormControlLabel
                  control={<Switch size="small" checked={showRegion} onChange={(e) => setShowRegion(e.target.checked)} />}
                  label={<Typography variant="body2">Show Region</Typography>}
                />
              </MenuItem>
              <MenuItem sx={{ py: 0.25 }}>
                <FormControlLabel
                  control={<Switch size="small" checked={showCityState} onChange={(e) => setShowCityState(e.target.checked)} />}
                  label={<Typography variant="body2">Show City / State</Typography>}
                />
              </MenuItem>
            </Menu>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <TextField size="small" placeholder="Search name, city, or CCN..." value={search}
              onChange={(e) => setSearch(e.target.value)} sx={{ minWidth: 240 }}
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
            <Button variant="text" startIcon={<CloseIcon />} sx={{ height: 44 }}
              onClick={() => { setSearch(''); setStateFilter(''); setRegionFilter(''); }}>
              Reset
            </Button>
          </Box>
        </Box>
        <DataGrid
          rows={filtered}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
            sorting: { sortModel: [{ field: 'name', sort: 'asc' }] },
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          columnHeaderHeight={72}
          disableRowSelectionOnClick
          disableColumnMenu
          onRowClick={(params) => navigate(`/facility/${params.row.id}`)}
          getRowClassName={(params) => {
            if (params.row.ijCitations > 0) return 'ij-row';
            if (params.row.deficiencyFree) return 'def-free-row';
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
            '& .ij-row': { bgcolor: '#FEF2F2', '&:hover': { bgcolor: '#FEE2E2' } },
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
