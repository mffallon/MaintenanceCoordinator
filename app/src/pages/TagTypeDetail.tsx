import { useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import {
  Box, Typography, Paper, Chip, LinearProgress, Divider, Drawer, IconButton,
  Table, TableBody, TableCell, TableHead, TableRow,
  Autocomplete, TextField, FormControl, InputLabel, Select, MenuItem,
  FormControlLabel, Switch,
} from '@mui/material';
import { DataGridPro } from '@mui/x-data-grid-pro';
import type { GridColDef } from '@mui/x-data-grid-pro';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import CloseIcon from '@mui/icons-material/Close';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { facilities, citations, surveys, kTagHistory, nTagHistory, eTagHistory, tagDescriptions } from '../data/avir-data';
import type { AvirKTagHistory } from '../data/avir-data';
import { useCommunityFilter } from '../components/CommunityFilter';
import PageHeader from '../components/PageHeader';
import PageFilters from '../components/PageFilters';
import { fmtDate } from '../utils/formatDate';
import { makeDateFilter } from '../utils/dateFilter';

const typeLabels: Record<string, { title: string; subtitle: string }> = {
  k: { title: 'K-Tags', subtitle: 'Life Safety Code Citations' },
  state: { title: 'N-Tags (State)', subtitle: 'State Regulation Citations' },
  e: { title: 'E-Tags', subtitle: 'Emergency Preparedness Citations' },
};

export default function TagTypeDetail() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { passesFilter } = useCommunityFilter();
  const info = typeLabels[type || ''] || typeLabels.k;
  const [dateRange, setDateRange] = useState(searchParams.get('dateRange') || 'all');
  const [regionFilter, setRegionFilter] = useState(searchParams.get('region') || '');
  const [latestOnly, setLatestOnly] = useState(searchParams.get('latestOnly') === '1');
  const [drawerCitation, setDrawerCitation] = useState<{ tag: string; facility: string; facilityId: string; date: string; region: string; surveyor: string; description: string; observation: string; status: string } | null>(null);

  // Look up citation detail from citations array
  const openCitationDrawer = (facilityId: string, date: string, tag: string) => {
    const cit = citations.find((c) => c.facilityId === facilityId && c.date === date && c.tag === tag);
    if (cit) {
      setDrawerCitation({ tag: cit.tag, facility: cit.facility, facilityId: cit.facilityId, date: cit.date, region: cit.region, surveyor: cit.surveyor, description: cit.description, observation: cit.observation, status: cit.status });
    } else {
      // No detail available (e.g. 2025 K-tag history without observation data)
      const fac = facilities.find((f) => f.id === facilityId);
      setDrawerCitation({ tag, facility: fac?.name || '', facilityId, date, region: fac?.region || '', surveyor: '', description: '', observation: 'No observation details available for this citation.', status: '' });
    }
  };

  // Get the right history dataset
  const rawHistory = type === 'k' ? kTagHistory : type === 'e' ? eTagHistory : nTagHistory;
  const tagPrefix = type === 'k' ? 'K' : type === 'e' ? 'E' : 'N';

  // Build waiver lookup set
  const waiverFacilityDates = useMemo(() =>
    new Set(surveys.filter((s) => s.isWaiver).map((s) => `${s.facilityId}__${s.date}`)),
  []);

  // Filter by community, date range, and exclude waiver surveys
  const filteredHistory = useMemo(() => {
    const passesDate = makeDateFilter(dateRange);
    return rawHistory.filter((h) =>
      passesFilter(h.facilityId) &&
      passesDate(h.date) &&
      !waiverFacilityDates.has(`${h.facilityId}__${h.date}`)
    );
  }, [rawHistory, passesFilter, dateRange, waiverFacilityDates]);

  const regions = useMemo(() =>
    [...new Set(filteredHistory.map((h) => h.region).filter(Boolean))].sort(),
  [filteredHistory]);

  const displayedHistory = useMemo(() => {
    let rows = regionFilter ? filteredHistory.filter((h) => h.region === regionFilter) : filteredHistory;
    if (latestOnly) {
      const latestByFacility = new Map<string, string>();
      rows.forEach((h) => {
        const current = latestByFacility.get(h.facilityId);
        if (!current || h.date > current) latestByFacility.set(h.facilityId, h.date);
      });
      rows = rows.filter((h) => latestByFacility.get(h.facilityId) === h.date);
    }
    return rows;
  }, [filteredHistory, regionFilter, latestOnly]);

  // Collect all unique tags across filtered rows for dynamic columns
  const allUniqueTags = useMemo(() => {
    const tagSet = new Set<string>();
    displayedHistory.forEach((h) => h.citedTags.forEach((t) => tagSet.add(t)));
    return [...tagSet].sort((a, b) => {
      // Sort by numeric portion
      const numA = parseInt(a.replace(/[^0-9]/g, ''), 10);
      const numB = parseInt(b.replace(/[^0-9]/g, ''), 10);
      return numA - numB;
    });
  }, [displayedHistory]);

  // Build columns: fixed + dynamic tag columns
  const columns: GridColDef[] = useMemo(() => {
    const fixed: GridColDef[] = [
      {
        field: 'date', headerName: 'Date', width: 110,
        renderCell: (p) => (
          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{fmtDate(p.value as string)}</Typography>
        ),
      },
      {
        field: 'facility', headerName: 'Community', width: 220,
        renderCell: (p) => {
          if (p.row._isTotalRow) return <Typography variant="body2" sx={{ fontWeight: 800, fontSize: '0.85rem' }}>Total</Typography>;
          return (
            <Box sx={{ lineHeight: 1.2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#0065BD', fontSize: '0.8rem', lineHeight: 1.3, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                onClick={() => navigate(`/facility/${p.row.facilityId}`)}>
                {p.value}
              </Typography>
              <Typography variant="caption" sx={{ color: '#5c6874', fontSize: '0.65rem', lineHeight: 1 }}>{p.row.region}</Typography>
            </Box>
          );
        },
      },
      { field: 'surveyRegion', headerName: 'Survey region', width: 160,
        renderCell: (p) => (
          <Typography variant="caption">{(p.value as string) || '—'}</Typography>
        ),
      },
      { field: 'surveyor', headerName: 'Surveyor', width: 150 },
      {
        field: 'total', headerName: 'Total', width: 80, align: 'right' as const, headerAlign: 'right' as const, type: 'number' as const,
        renderCell: (p) => (
          <Typography variant="body2" sx={{ fontWeight: p.row._isTotalRow ? 800 : 600 }}>{p.value}</Typography>
        ),
      },
    ];

    const tagCols: GridColDef[] = allUniqueTags.map((tag) => ({
      field: `tag_${tag}`,
      headerName: tag.replace(/^[KNE]-?/, ''),
      width: 70,
      align: 'right' as const,
      headerAlign: 'right' as const,
      sortable: false,
      renderCell: (p) => {
        if (p.row._isTotalRow) {
          const count = p.value as number;
          return count > 0 ? <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>{count}</Typography> : <Typography variant="caption" color="text.disabled">—</Typography>;
        }
        const cited = p.value === 1;
        const waiver = p.row[`waiver_${tag}`] === 1;
        const handleClick = () => openCitationDrawer(p.row.facilityId as string, p.row.date as string, tag);
        if (waiver) return <Chip label="W" size="small" onClick={handleClick} sx={{ fontWeight: 700, fontSize: '0.7rem', bgcolor: '#FEF9C3', color: '#854D0E', minWidth: 28, cursor: 'pointer' }} />;
        if (cited) return <Chip label="X" size="small" onClick={handleClick} sx={{ fontWeight: 700, fontSize: '0.7rem', minWidth: 28, cursor: 'pointer' }} />;
        return <Typography variant="caption" color="text.disabled">—</Typography>;
      },
    }));

    return [...fixed, ...tagCols];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allUniqueTags, navigate]);

  // Build rows with dynamic tag fields
  const rows = useMemo(() => {
    const dataRows = displayedHistory.map((h) => {
      const row: Record<string, unknown> = {
        id: h.id,
        date: h.date,
        region: h.region,
        facility: h.facility,
        facilityId: h.facilityId,
        surveyRegion: h.surveyRegion,
        surveyor: h.surveyor,
        total: h.total,
        _isTotalRow: false,
      };
      for (const tag of allUniqueTags) {
        row[`tag_${tag}`] = h.citedTags.includes(tag) ? 1 : 0;
        row[`waiver_${tag}`] = h.waiverTags.includes(tag) ? 1 : 0;
      }
      return row;
    });

    return dataRows;
  }, [displayedHistory, allUniqueTags]);

  // Pinned totals row
  const pinnedRows = useMemo(() => {
    const totalsRow: Record<string, unknown> = {
      id: '__totals__',
      date: '',
      region: '',
      facility: 'Total',
      facilityId: '',
      surveyRegion: '',
      surveyor: '',
      total: rows.reduce((s, r) => s + (r.total as number), 0),
      _isTotalRow: true,
    };
    for (const tag of allUniqueTags) {
      totalsRow[`tag_${tag}`] = rows.reduce((s, r) => s + (r[`tag_${tag}`] as number), 0);
      totalsRow[`waiver_${tag}`] = 0;
    }
    return { top: [totalsRow] };
  }, [rows, allUniqueTags]);

  // Top 5 most cited tags for summary cards
  const tagBreakdown = useMemo(() => {
    const tagType = type === 'k' ? 'K' : type === 'e' ? 'E' : 'N';
    const passesDate = makeDateFilter(dateRange);
    const tagCitations = citations.filter((c) => c.tagType === tagType && passesFilter(c.facilityId) && passesDate(c.date));
    const counts = new Map<string, {
      tag: string; desc: string; count: number;
      facilities: Set<string>; statuses: Map<string, number>;
    }>();
    tagCitations.forEach((c) => {
      const existing = counts.get(c.tag);
      const status = c.status || 'Open';
      if (existing) {
        existing.count++;
        existing.facilities.add(c.facilityId);
        existing.statuses.set(status, (existing.statuses.get(status) || 0) + 1);
      } else {
        counts.set(c.tag, {
          tag: c.tag, desc: c.description, count: 1,
          facilities: new Set([c.facilityId]),
          statuses: new Map([[status, 1]]),
        });
      }
    });
    return [...counts.values()].sort((a, b) => b.count - a.count).slice(0, 5);
  }, [type, passesFilter, dateRange]);

  // Overall status breakdown for the bar chart
  const overallStatusBreakdown = useMemo(() => {
    const tagType = type === 'k' ? 'K' : type === 'e' ? 'E' : 'N';
    const passesDate = makeDateFilter(dateRange);
    const tagCitations = citations.filter((c) => c.tagType === tagType && passesFilter(c.facilityId) && passesDate(c.date));
    const map = new Map<string, number>();
    tagCitations.forEach((c) => {
      const s = c.status || 'Open';
      map.set(s, (map.get(s) || 0) + 1);
    });
    const order = ['Open', 'Pending', 'Completed', 'NA'];
    const colors: Record<string, string> = { Open: '#DC2626', Pending: '#F59E0B', Completed: '#16A34A', NA: '#94A3B8' };
    const total = [...map.values()].reduce((a, b) => a + b, 0);
    return { entries: order.filter((s) => map.has(s)).map((s) => ({ status: s, count: map.get(s)!, pct: total > 0 ? (map.get(s)! / total) * 100 : 0, color: colors[s] })), total };
  }, [type, passesFilter, dateRange]);

  return (
    <Box>
      <PageHeader
        title={info.title}
        backLabel="Back to Survey Overview"
        onBack={() => navigate('/citations-remix')}
        actions={
          <Autocomplete
            size="small"
            options={allUniqueTags}
            getOptionLabel={(opt) => {
              const desc = tagDescriptions.get(opt);
              return desc ? `${opt} — ${desc}` : opt;
            }}
            onChange={(_, val) => { if (val) navigate(`/citations-remix/tags/${type}/${val}`); }}
            renderInput={(params) => <TextField {...params} label="View by Tag" placeholder="Search tags..." />}
            sx={{ width: 320 }}
          />
        }
      />
      <PageFilters
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        extraFilters={
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel>CMS Region</InputLabel>
            <Select value={regionFilter} label="CMS Region" onChange={(e) => setRegionFilter(e.target.value)}>
              <MenuItem value="">All regions</MenuItem>
              {regions.map((r) => (
                <MenuItem key={r} value={r}>{r}</MenuItem>
              ))}
            </Select>
          </FormControl>
        }
        afterFilters={
          <FormControlLabel
            control={<Switch checked={latestOnly} onChange={(e) => setLatestOnly(e.target.checked)} size="small" />}
            label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: '#293036' }}>Latest survey only</Typography>}
            sx={{ ml: 0.5 }}
          />
        }
      />


      {/* Most Cited Tags — Top 5 */}
      {tagBreakdown.length > 0 && (
        <Paper sx={{ mb: 3, borderRadius: 3, border: '1px solid #E0E4E7', overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2.5, pt: 2.5, pb: 1.5 }}>
            <WhatshotIcon sx={{ color: '#DC2626', fontSize: 20 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Most cited {info.title}</Typography>
          </Box>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 400, color: '#293036', fontSize: '14px', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', lineHeight: '16px', py: '4px', px: 1.5 }}>Tag</TableCell>
                <TableCell sx={{ fontWeight: 400, color: '#293036', fontSize: '14px', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', lineHeight: '16px', py: '4px', px: 1.5 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 400, color: '#293036', fontSize: '14px', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', lineHeight: '16px', py: '4px', px: 1.5, width: 90 }} align="right">Citations</TableCell>
                <TableCell sx={{ fontWeight: 400, color: '#293036', fontSize: '14px', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', lineHeight: '16px', py: '4px', px: 1.5, width: 280 }}>Status</TableCell>
                <TableCell sx={{ bgcolor: '#e0e4e7', width: 32, px: 0 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {tagBreakdown.map((t, i) => (
                <TableRow key={t.tag} sx={{ '&:hover': { bgcolor: '#F0F7FF' }, cursor: 'pointer' }}
                  onClick={() => navigate(`/citations-remix/tags/${type}/${t.tag}`)}>
                  <TableCell sx={{ py: '3px', px: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.8rem', color: '#293036' }}>{t.tag}</Typography>
                  </TableCell>
                  <TableCell sx={{ py: '3px', px: 1.5 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                      {t.desc.length > 80 ? t.desc.slice(0, 80) + '...' : t.desc}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ py: '3px', px: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{t.count}</Typography>
                  </TableCell>
                  <TableCell sx={{ py: '3px', px: 1.5 }}>
                    {(() => {
                      const statusColors: Record<string, string> = { Completed: '#16A34A', Pending: '#F59E0B', Open: '#DC2626', NA: '#94A3B8' };
                      const order = ['Open', 'Pending', 'Completed', 'NA'];
                      const entries = order.filter((s) => t.statuses.has(s)).map((s) => ({ status: s, val: t.statuses.get(s)!, color: statusColors[s] }));
                      const total = [...t.statuses.values()].reduce((a, b) => a + b, 0);
                      return (
                        <Box>
                          <Box sx={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', bgcolor: '#F1F5F9', mb: 0.5 }}>
                            {entries.map(({ status, val, color }) => (
                              <Box key={status} sx={{ width: `${(val / total) * 100}%`, bgcolor: color }} />
                            ))}
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'nowrap' }}>
                            {entries.map(({ status, val, color }) => (
                              <Box key={status} sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
                                <Typography variant="caption" sx={{ fontSize: '0.65rem', color: '#64748B' }}>{val} {status}</Typography>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      );
                    })()}
                  </TableCell>
                  <TableCell sx={{ width: 32, px: 0 }}>
                    <ChevronRightIcon sx={{ fontSize: 18, color: '#94A3B8' }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Summary */}
      <Paper sx={{ px: 2, py: 1, borderRadius: '12px 12px 0 0', border: '1px solid #E0E4E7', borderBottom: 'none', bgcolor: '#FAFBFC' }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {displayedHistory.length} surveys
          <Typography component="span" variant="body2" sx={{ color: '#5c6874', ml: 1 }}>
            across {new Set(displayedHistory.map((h) => h.facilityId)).size} facilities
          </Typography>
          <Typography component="span" variant="body2" sx={{ color: '#5c6874', ml: 1 }}>
            · {allUniqueTags.length} unique tags · {displayedHistory.reduce((s, h) => s + h.total, 0)} total citations
          </Typography>
        </Typography>
      </Paper>

      {/* DataGrid Table */}
      <Paper sx={{ borderRadius: '0 0 12px 12px', border: '1px solid #E0E4E7', overflow: 'hidden' }}>
        <DataGridPro
          rows={rows}
          columns={columns}
          pinnedRows={pinnedRows}
          rowHeight={42}
          disableColumnMenu
          disableRowSelectionOnClick
          pageSizeOptions={[25, 50, 100]}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
            sorting: { sortModel: [{ field: 'date', sort: 'desc' }] },
            pinnedColumns: { left: ['date', 'facility'] },
          }}
          pagination
          getRowClassName={(params) => {
            if (params.row._isTotalRow) return 'totals-row';
            return params.row.total === 0 ? 'def-free-row' : '';
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': { bgcolor: '#e0e4e7', borderBottom: 'none' },
            '& .MuiDataGrid-columnHeader': { bgcolor: '#e0e4e7' },
            '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 400, fontSize: '14px', color: '#293036', letterSpacing: '-0.084px', lineHeight: '16px' },
            '& .MuiDataGrid-columnSeparator': { display: 'none' },
            '& .MuiDataGrid-row:hover': { bgcolor: '#F0F7FF' },
            '& .MuiDataGrid-cell': { fontSize: '0.8rem', display: 'flex', alignItems: 'center' },
            '& .totals-row': { bgcolor: '#F0F2F4', fontWeight: 700, borderBottom: '2px solid #C0C8D0', '&:hover': { bgcolor: '#F0F2F4' } },
            '& .totals-row .MuiDataGrid-cell--pinnedLeft': { bgcolor: '#F0F2F4' },
            '& .def-free-row': { bgcolor: '#F0FDF4', '&:hover': { bgcolor: '#DCFCE7' } },
            '& .def-free-row .MuiDataGrid-cell[data-field="date"]': { borderLeft: '3px solid #16A34A' },
            '& .def-free-row .MuiDataGrid-cell--pinnedLeft': { bgcolor: '#F0FDF4' },
            '& .def-free-row:hover .MuiDataGrid-cell--pinnedLeft': { bgcolor: '#DCFCE7' },
            '& .MuiDataGrid-scrollbarFiller': { display: 'none' },
            // Hide license watermark overlay
            '& .MuiDataGrid-main > div:last-child:not([class*="MuiDataGrid"])': { display: 'none !important' },
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
                  {drawerCitation.observation}
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
