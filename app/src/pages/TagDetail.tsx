import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Chip, Divider, Drawer, IconButton,
  Table, TableBody, TableCell, TableHead, TableRow,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { BarChart } from '@mui/x-charts';
import { LineChart } from '@mui/x-charts';
import CloseIcon from '@mui/icons-material/Close';
import { citations, facilities, surveys, tagDescriptions } from '../data/avir-data';
import { useCommunityFilter } from '../components/CommunityFilter';
import PageHeader from '../components/PageHeader';
import PageFilters from '../components/PageFilters';
import { fmtDate } from '../utils/formatDate';
import { makeDateFilter } from '../utils/dateFilter';

const typeLabels: Record<string, string> = {
  k: 'K-Tags',
  state: 'N-Tags (State)',
  e: 'E-Tags',
};

export default function TagDetail() {
  const { type, tag } = useParams<{ type: string; tag: string }>();
  const navigate = useNavigate();
  const { passesFilter } = useCommunityFilter();
  const [dateRange, setDateRange] = useState('all');
  const [drawerCitation, setDrawerCitation] = useState<typeof filteredCitations[number] | null>(null);

  const parentLabel = typeLabels[type || ''] || 'K-Tags';
  const description = tagDescriptions.get(tag || '') || '';

  // Build a set of waiver survey IDs so we can exclude citations from waiver surveys
  const waiverFacilityDates = useMemo(() => {
    return new Set(
      surveys.filter((s) => s.isWaiver).map((s) => `${s.facilityId}__${s.date}`)
    );
  }, []);

  // Filter citations for this specific tag, excluding waiver surveys
  const filteredCitations = useMemo(() => {
    const passesDate = makeDateFilter(dateRange);
    return citations
      .filter((c) =>
        c.tag === tag &&
        passesFilter(c.facilityId) &&
        passesDate(c.date) &&
        !waiverFacilityDates.has(`${c.facilityId}__${c.date}`)
      )
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [tag, passesFilter, dateRange, waiverFacilityDates]);

  // Stats
  const totalCount = filteredCitations.length;
  const facilityCount = new Set(filteredCitations.map((c) => c.facilityId)).size;
  const statusCounts = useMemo(() => {
    const map = new Map<string, number>();
    filteredCitations.forEach((c) => {
      const s = c.status || 'Open';
      map.set(s, (map.get(s) || 0) + 1);
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [filteredCitations]);

  const dateRangeLabel = useMemo(() => {
    if (filteredCitations.length === 0) return '—';
    const dates = filteredCitations.map((c) => c.date).sort();
    return `${fmtDate(dates[0])} – ${fmtDate(dates[dates.length - 1])}`;
  }, [filteredCitations]);

  // Trend: citations by month
  const trendData = useMemo(() => {
    const monthMap = new Map<string, { month: string; count: number }>();
    for (const c of filteredCitations) {
      const d = new Date(c.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      if (!monthMap.has(key)) monthMap.set(key, { month: label, count: 0 });
      monthMap.get(key)!.count++;
    }
    return [...monthMap.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v);
  }, [filteredCitations]);

  // By region
  const regionData = useMemo(() => {
    const map = new Map<string, number>();
    filteredCitations.forEach((c) => map.set(c.region, (map.get(c.region) || 0) + 1));
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [filteredCitations]);

  // Table columns
  const columns: GridColDef[] = [
    {
      field: 'date', headerName: 'Date', width: 110,
      renderCell: (p) => <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{fmtDate(p.value as string)}</Typography>,
    },
    {
      field: 'facility', headerName: 'Community', flex: 1, minWidth: 200,
      renderCell: (p) => (
        <Box sx={{ lineHeight: 1.2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#0065BD', fontSize: '0.8rem', lineHeight: 1.3, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            onClick={() => navigate(`/facility/${p.row.facilityId}`)}>
            {p.value}
          </Typography>
          <Typography variant="caption" sx={{ color: '#5c6874', fontSize: '0.65rem', lineHeight: 1 }}>{p.row.region}</Typography>
        </Box>
      ),
    },
    { field: 'surveyor', headerName: 'Surveyor', width: 150 },
    {
      field: 'status', headerName: 'Status', width: 110,
      renderCell: (p) => {
        const s = (p.value as string) || 'Open';
        const bg = s === 'Completed' ? '#DCFCE7' : s === 'Pending' ? '#FEF9C3' : '#FEE2E2';
        const color = s === 'Completed' ? '#166534' : s === 'Pending' ? '#854D0E' : '#991B1B';
        return <Chip label={s} size="small" sx={{ fontWeight: 600, fontSize: '0.65rem', bgcolor: bg, color }} />;
      },
    },
    {
      field: 'observation', headerName: 'Observation', flex: 2, minWidth: 250,
      renderCell: (p) => (
        <Typography variant="caption" sx={{ fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {(p.value as string) || '—'}
        </Typography>
      ),
    },
  ];

  const rows = filteredCitations.map((c) => ({
    id: c.id,
    date: c.date,
    facility: c.facility,
    facilityId: c.facilityId,
    region: c.region,
    surveyor: c.surveyor || '—',
    status: c.status,
    observation: c.observation,
    description: c.description,
  }));

  const statusColor = (s: string) => s === 'Completed' ? '#16A34A' : s === 'Pending' ? '#CA8A04' : '#DC2626';

  return (
    <Box>
      <PageHeader
        title={description ? `${tag} — ${description}` : (tag || '')}
        backLabel={`Back to ${parentLabel}`}
        onBack={() => navigate(`/citations-remix/tags/${type}`)}
      />
      <PageFilters dateRange={dateRange} onDateRangeChange={setDateRange} />

      {/* Tag Overview */}
      <Paper sx={{ p: 2.5, mb: 3, borderRadius: 3, border: '1px solid #E0E4E7' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Chip label={tag} sx={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '1rem' }} />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 3, alignItems: 'start' }}>
          <Box>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block' }}>Total citations</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>{totalCount}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block', mb: 0.75 }}>Status breakdown</Typography>
            <Box sx={{ display: 'flex', height: 10, borderRadius: 5, overflow: 'hidden', bgcolor: '#F1F5F9', mb: 0.75 }}>
              {statusCounts.map(([status, count]) => (
                <Box key={status} sx={{ width: `${(count / totalCount) * 100}%`, bgcolor: statusColor(status), transition: 'width 0.3s' }} />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'nowrap' }}>
              {statusCounts.map(([status, count]) => (
                <Box key={status} sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                  <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: statusColor(status), flexShrink: 0 }} />
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#64748B' }}>{count} {status}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Trends */}
      {(trendData.length > 1 || regionData.length > 0) && (
        <Paper sx={{ p: 2.5, mb: 3, borderRadius: 3, border: '1px solid #E0E4E7' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Trends</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
            {trendData.length > 1 && (
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#64748B', fontSize: '0.75rem', mb: 0.5 }}>Citations over time</Typography>
                <LineChart
                  height={200}
                  xAxis={[{
                    data: trendData.map((_, i) => i),
                    scaleType: 'point',
                    valueFormatter: (v: number) => trendData[v]?.month ?? '',
                    tickLabelStyle: { fontSize: 10 },
                  }]}
                  yAxis={[{ tickLabelStyle: { fontSize: 10 } }]}
                  series={[{ data: trendData.map((d) => d.count), label: 'Citations', color: '#0065BD', showMark: true }]}
                  hideLegend
                  margin={{ left: 40, right: 10, top: 10, bottom: 30 }}
                />
              </Box>
            )}
            {regionData.length > 0 && (
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#64748B', fontSize: '0.75rem', mb: 0.5 }}>By region</Typography>
                <BarChart
                  height={200}
                  layout="horizontal"
                  series={[{ data: regionData.map(([, c]) => c), label: 'Citations', color: '#0065BD' }]}
                  yAxis={[{ data: regionData.map(([r]) => r), scaleType: 'band' }]}
                  hideLegend
                  margin={{ left: 160, right: 10, top: 10, bottom: 30 }}
                />
              </Box>
            )}
          </Box>
        </Paper>
      )}

      {/* Citations Table */}
      <Paper sx={{ px: 2, py: 1, borderRadius: '12px 12px 0 0', border: '1px solid #E0E4E7', borderBottom: 'none', bgcolor: '#FAFBFC' }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {totalCount} citations
          <Typography component="span" variant="body2" sx={{ color: '#5c6874', ml: 1 }}>
            across {facilityCount} communities
          </Typography>
        </Typography>
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
            sorting: { sortModel: [{ field: 'date', sort: 'desc' }] },
          }}
          onRowClick={(params) => {
            const cit = filteredCitations.find((c) => c.id === params.row.id);
            if (cit) setDrawerCitation(cit);
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': { bgcolor: '#e0e4e7', borderBottom: 'none' },
            '& .MuiDataGrid-columnHeader': { bgcolor: '#e0e4e7' },
            '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 400, fontSize: '14px', color: '#293036', letterSpacing: '-0.084px', lineHeight: '16px' },
            '& .MuiDataGrid-columnSeparator': { display: 'none' },
            '& .MuiDataGrid-row': { cursor: 'pointer', '&:hover': { bgcolor: '#F0F7FF' } },
            '& .MuiDataGrid-cell': { fontSize: '0.8rem', display: 'flex', alignItems: 'center' },
          }}
        />
      </Paper>

      {/* Citation Detail Drawer */}
      <Drawer
        anchor="right"
        open={!!drawerCitation}
        onClose={() => setDrawerCitation(null)}
        PaperProps={{ sx: { width: 480, p: 3 } }}
      >
        {drawerCitation && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Citation detail</Typography>
              <IconButton onClick={() => setDrawerCitation(null)} size="small"><CloseIcon /></IconButton>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip label={drawerCitation.tag} sx={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.9rem' }} />
              {drawerCitation.status && (
                <Chip label={drawerCitation.status} size="small" sx={{
                  fontWeight: 600,
                  bgcolor: drawerCitation.status === 'Completed' ? '#DCFCE7' : drawerCitation.status === 'Pending' ? '#FEF9C3' : '#FEE2E2',
                  color: drawerCitation.status === 'Completed' ? '#166534' : drawerCitation.status === 'Pending' ? '#854D0E' : '#991B1B',
                }} />
              )}
            </Box>

            {drawerCitation.description && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block', mb: 0.5 }}>Description</Typography>
                <Typography variant="body2">{drawerCitation.description}</Typography>
              </Box>
            )}

            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block', mb: 0.5 }}>Observation</Typography>
              <Paper sx={{ p: 2, bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ fontSize: '0.85rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {drawerCitation.observation || 'No observation details available.'}
                </Typography>
              </Paper>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block' }}>Community</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#0065BD', cursor: 'pointer' }}
                  onClick={() => { setDrawerCitation(null); navigate(`/facility/${drawerCitation.facilityId}`); }}>
                  {drawerCitation.facility}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block' }}>Region</Typography>
                <Typography variant="body2">{drawerCitation.region}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block' }}>Date</Typography>
                <Typography variant="body2">{fmtDate(drawerCitation.date)}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block' }}>Surveyor</Typography>
                <Typography variant="body2">{drawerCitation.surveyor || '—'}</Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
}
