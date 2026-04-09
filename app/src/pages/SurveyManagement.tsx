import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Chip, TextField, InputAdornment,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import PageHeader from '../components/PageHeader';
import PageFilters from '../components/PageFilters';
import { useCommunityFilter } from '../components/CommunityFilter';
import { facilities, citations } from '../data/avir-data';
import { effectiveLastSurveyDate } from '../utils/surveyWindowOverrides';
import { fmtDate } from '../utils/formatDate';
import { makeDateFilter } from '../utils/dateFilter';

const TODAY = new Date('2026-04-05');

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function toISO(d: Date): string {
  return d.toISOString().split('T')[0];
}

function daysUntil(dateStr: string): number {
  return Math.round((new Date(dateStr).getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24));
}


// Derive documentation gaps from citation data (mirrors SurveyPrepDetail logic)
function deriveAlerts(totalCitations: number, facilityId: string): number {
  const facCitations = citations.filter((c) => c.facilityId === facilityId);
  const openCits = facCitations.filter((c) => c.status === 'Open' || c.status === 'Pending');
  const tasks = openCits.length;
  const seed = facilityId.length % 5;
  const logs = totalCitations > 10 ? seed + 2 : totalCitations > 0 ? seed : 0;
  const docs = totalCitations > 15 ? 3 : totalCitations > 5 ? 1 : 0;
  return tasks + logs + docs;
}

// Build upcoming survey rows from facility last survey dates
// Standard SNF survey cycle: window opens ~9 months after last survey, closes ~15 months after
function buildUpcomingRows() {
  return facilities
    .filter((f) => f.lastSurveyDate)
    .map((f) => {
      const lastSurveyDate = effectiveLastSurveyDate(f.id, f.lastSurveyDate);
      const last = new Date(lastSurveyDate);
      const windowStart = toISO(addMonths(last, 9));
      const windowEnd = toISO(addMonths(last, 15));
      const days = daysUntil(windowEnd);
      const status =
        days < 0 ? 'Overdue' :
        days <= 30 ? 'Due Soon' :
        days <= 90 ? 'Upcoming' : 'On Track';
      return {
        id: f.id,
        facilityId: f.id,
        name: f.name,
        region: f.region,
        lastSurveyDate,
        windowStart,
        windowEnd,
        daysUntilDue: days,
        status,
        totalCitations: f.totalCitations,
        alerts: deriveAlerts(f.totalCitations, f.id),
      };
    })
    .sort((a, b) => a.daysUntilDue - b.daysUntilDue);
}

const allUpcomingRows = buildUpcomingRows();

const statusChip = (status: string) => {
  const styles: Record<string, { bg: string; color: string }> = {
    'Overdue':  { bg: '#FEE2E2', color: '#991B1B' },
    'Due Soon': { bg: '#FEF3C7', color: '#92400E' },
    'Upcoming': { bg: '#DBEAFE', color: '#1E40AF' },
    'On Track': { bg: '#F0FDF4', color: '#166534' },
  };
  const s = styles[status] || styles['On Track'];
  return <Chip label={status} size="small" sx={{ bgcolor: s.bg, color: s.color, fontWeight: 600, fontSize: '0.7rem' }} />;
};

export default function SurveyManagement() {
  const navigate = useNavigate();
  const { passesFilter } = useCommunityFilter();
  const [search, setSearch] = useState('');
  const rows = useMemo(() => {
    return allUpcomingRows.filter((r) => {
      if (!passesFilter(r.facilityId)) return false;
      if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [passesFilter, search]);

  const overdueCount  = rows.filter((r) => r.status === 'Overdue').length;
  const dueSoonCount  = rows.filter((r) => r.status === 'Due Soon').length;
  const upcomingCount = rows.filter((r) => r.status === 'Upcoming').length;

  const columns: GridColDef[] = [
    {
      field: 'windowStart', headerName: 'Window Opens', width: 130,
      renderCell: (p: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{fmtDate(p.value as string)}</Typography>
      ),
    },
    {
      field: 'windowEnd', headerName: 'Window Closes', width: 130,
      renderCell: (p: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{fmtDate(p.value as string)}</Typography>
      ),
    },
    {
      field: 'name', headerName: 'Community', flex: 1, minWidth: 200,
      renderCell: (p: GridRenderCellParams) => (
        <Box sx={{ lineHeight: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem', lineHeight: 1.2 }}>
            {(p.value as string).replace('Avir at ', '')}
          </Typography>
          <Typography variant="caption" sx={{ color: '#5c6874', fontSize: '0.68rem', lineHeight: 1 }}>{p.row.region}</Typography>
        </Box>
      ),
    },
    {
      field: 'daysUntilDue', headerName: 'Days Until Due', width: 130, type: 'number' as const, align: 'right' as const, headerAlign: 'right' as const,
      renderCell: (p: GridRenderCellParams) => {
        const d = p.value as number;
        const color = d < 0 ? '#991B1B' : d <= 30 ? '#92400E' : d <= 90 ? '#1E40AF' : '#166534';
        return (
          <Typography variant="body2" sx={{ fontWeight: 700, color, fontSize: '0.85rem' }}>
            {d < 0 ? `${Math.abs(d)} overdue` : `${d} days`}
          </Typography>
        );
      },
    },
    {
      field: 'totalCitations', headerName: 'Prior Citations', width: 120, type: 'number' as const, align: 'right' as const, headerAlign: 'right' as const,
      renderCell: (p: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>{p.value as number}</Typography>
      ),
    },
    {
      field: 'alerts', headerName: 'Alerts', width: 90, type: 'number' as const, align: 'right' as const, headerAlign: 'right' as const,
      renderCell: (p: GridRenderCellParams) => {
        if (p.row.daysUntilDue > 90) return <Typography variant="body2" sx={{ color: '#94A3B8' }}>—</Typography>;
        const count = p.value as number;
        if (count === 0) return <Typography variant="body2" sx={{ color: '#16A34A', fontWeight: 600 }}>—</Typography>;
        return (
          <Typography variant="body2" sx={{ fontWeight: 700, color: '#DC2626' }}>{count}</Typography>
        );
      },
    },
  ];

  return (
    <Box>
      <PageHeader title="Survey Planning" />
      <PageFilters />

      {/* Summary callouts */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        {[
          { label: 'Overdue',  count: overdueCount,  bg: '#FEE2E2', color: '#991B1B', border: '#FECACA' },
          { label: 'Due Soon', count: dueSoonCount,  bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
          { label: 'Upcoming', count: upcomingCount, bg: '#DBEAFE', color: '#1E40AF', border: '#BFDBFE' },
        ].map((t) => (
          <Paper key={t.label} sx={{ p: 2, flex: 1, borderRadius: 3, border: `1px solid ${t.border}`, bgcolor: t.bg }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: t.color }}>{t.label}</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: t.color, my: 0.5 }}>{t.count}</Typography>
            <Typography variant="caption" sx={{ color: t.color, opacity: 0.75 }}>
              {t.label === 'Overdue' ? 'Window has passed' :
               t.label === 'Due Soon' ? 'Due within 30 days' :
               t.label === 'Upcoming' ? 'Due within 90 days' : 'More than 90 days out'}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Table */}
      <Paper sx={{ px: 2, py: 1.5, borderRadius: '12px 12px 0 0', border: '1px solid #E0E4E7', borderBottom: 'none', bgcolor: '#FAFBFC' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {rows.length} communities
          </Typography>
          <TextField
            size="small" placeholder="Search community..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            sx={{ ml: 'auto', width: 220 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
          />
        </Box>
      </Paper>
      <Paper sx={{ borderRadius: '0 0 12px 12px', border: '1px solid #E0E4E7', overflow: 'hidden' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={48}
          disableColumnMenu
          disableRowSelectionOnClick
          pageSizeOptions={[25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
            sorting: { sortModel: [{ field: 'daysUntilDue', sort: 'asc' }] },
          }}
          onRowClick={(params) => navigate(`/surveys/${params.row.facilityId}`)}
          getRowClassName={(params) => {
            const s = params.row.status;
            if (s === 'Overdue') return 'row-overdue';
            if (s === 'Due Soon') return 'row-due-soon';
            return '';
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': { bgcolor: '#e0e4e7', borderBottom: 'none' },
            '& .MuiDataGrid-columnHeader': { bgcolor: '#e0e4e7' },
            '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 400, fontSize: '14px', color: '#293036', letterSpacing: '-0.084px' },
            '& .MuiDataGrid-columnSeparator': { display: 'none' },
            '& .MuiDataGrid-row': { cursor: 'pointer', '&:hover': { bgcolor: '#F0F7FF' } },
            '& .MuiDataGrid-cell': { borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center' },
            '& .row-overdue': { bgcolor: '#FFF5F5', '&:hover': { bgcolor: '#FEE2E2' } },
            '& .row-due-soon': { bgcolor: '#FFFBEB', '&:hover': { bgcolor: '#FEF3C7' } },
          }}
          autoHeight
        />
      </Paper>
    </Box>
  );
}
