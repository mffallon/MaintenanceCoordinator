import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Chip, Drawer, Divider, IconButton, Button,
  Table, TableBody, TableCell, TableHead, TableRow,
  FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import IosShareIcon from '@mui/icons-material/IosShare';
import PageHeader from '../components/PageHeader';
import { CommunityFilter, useCommunityFilter } from '../components/CommunityFilter';
import { citations } from '../data/avir-data';
import { fmtDate } from '../utils/formatDate';

const TODAY = new Date('2026-04-05');

function daysOpen(dateStr: string): number {
  return Math.round((TODAY.getTime() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

const statusChip = (status: string) => {
  const map: Record<string, { bg: string; color: string }> = {
    Open:    { bg: '#FEE2E2', color: '#991B1B' },
    Pending: { bg: '#FEF3C7', color: '#92400E' },
    Overdue: { bg: '#881337', color: '#FFFFFF' },
  };
  const s = map[status] || map.Open;
  return <Chip label={status} size="small" sx={{ bgcolor: s.bg, color: s.color, fontWeight: 600, fontSize: '0.7rem' }} />;
};

export default function POCManagement() {
  const navigate = useNavigate();
  const { passesFilter } = useCommunityFilter();
  const [drawerCitation, setDrawerCitation] = useState<typeof citations[number] | null>(null);
  const [activeFilter, setActiveFilter] = useState<'Open' | 'Pending' | 'Overdue' | null>(null);
  const [surveyorFilter, setSurveyorFilter] = useState('');

  const allRows = useMemo(() => {
    return citations
      .filter((c) =>
        (c.status === 'Open' || c.status === 'Pending') &&
        passesFilter(c.facilityId),
      )
      .map((c) => ({ ...c, daysOpen: daysOpen(c.date) }));
  }, [passesFilter]);

  const surveyors = useMemo(() =>
    [...new Set(allRows.map((r) => r.surveyor).filter(Boolean))].sort(),
  [allRows]);

  const filteredRows = useMemo(() => {
    let rows = allRows;
    if (activeFilter === 'Overdue') rows = rows.filter((r) => r.status === 'Open' && r.daysOpen > 60);
    else if (activeFilter) rows = rows.filter((r) => r.status === activeFilter);
    if (surveyorFilter) rows = rows.filter((r) => r.surveyor === surveyorFilter);
    return rows;
  }, [allRows, activeFilter, surveyorFilter]);

  // Group by facility, sorted by most open POCs first
  const groups = useMemo(() => {
    const map = new Map<string, { facilityId: string; facility: string; region: string; items: typeof allRows }>();
    for (const c of filteredRows) {
      if (!map.has(c.facilityId)) {
        map.set(c.facilityId, { facilityId: c.facilityId, facility: c.facility, region: c.region, items: [] });
      }
      map.get(c.facilityId)!.items.push(c);
    }
    return [...map.values()]
      .map((g) => ({ ...g, items: g.items.sort((a, b) => b.daysOpen - a.daysOpen) }))
      .sort((a, b) => b.items.length - a.items.length);
  }, [filteredRows]);

  const openCount    = allRows.filter((r) => r.status === 'Open').length;
  const pendingCount = allRows.filter((r) => r.status === 'Pending').length;
  const overdueCount = allRows.filter((r) => r.daysOpen > 60).length;

  const hCell = (label: string, width?: number, align?: 'right') => (
    <TableCell key={label} align={align} sx={{ fontWeight: 400, color: '#293036', fontSize: '14px', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '4px', px: 1.5, ...(width ? { width, minWidth: width } : {}) }}>
      {label}
    </TableCell>
  );

  return (
    <Box>
      <PageHeader title="Plans of Correction" />
      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-end' }}>
        <Box sx={{ minWidth: 280 }}>
          <CommunityFilter />
        </Box>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Surveyor</InputLabel>
          <Select value={surveyorFilter} label="Surveyor" onChange={(e) => setSurveyorFilter(e.target.value)}>
            <MenuItem value="">All surveyors</MenuItem>
            {surveyors.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Summary callouts */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        {([
          { key: 'Open'    as const, label: 'Open',    count: openCount,    bg: '#FEE2E2', color: '#991B1B', border: '#FECACA', activeBorder: '#991B1B', sub: 'Awaiting correction' },
          { key: 'Pending' as const, label: 'Pending', count: pendingCount, bg: '#FEF3C7', color: '#92400E', border: '#FDE68A', activeBorder: '#92400E', sub: 'In progress' },
          { key: 'Overdue' as const, label: 'Overdue', count: overdueCount, bg: '#FFF1F2', color: '#881337', border: '#FDA4AF', activeBorder: '#881337', sub: 'Open > 60 days' },
        ]).map((t) => {
          const isActive = activeFilter === t.key;
          return (
            <Paper
              key={t.label}
              onClick={() => setActiveFilter(isActive ? null : t.key)}
              sx={{
                p: 2, flex: 1, borderRadius: 3, cursor: 'pointer',
                border: `${isActive ? 2 : 1}px solid ${isActive ? t.activeBorder : t.border}`,
                bgcolor: t.bg,
                boxShadow: isActive ? `0 0 0 3px ${t.border}` : 'none',
                transition: 'box-shadow 0.15s, border 0.15s',
                '&:hover': { boxShadow: `0 0 0 3px ${t.border}` },
                position: 'relative',
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 600, color: t.color }}>{t.label}</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: t.color, my: 0.5 }}>{t.count}</Typography>
              <Typography variant="caption" sx={{ color: t.color, opacity: 0.75 }}>{t.sub}</Typography>
              {isActive && (
                <Chip
                  label="Active filter — click to clear"
                  size="small"
                  onDelete={() => setActiveFilter(null)}
                  sx={{ position: 'absolute', top: 8, right: 8, fontSize: '0.6rem', height: 18, bgcolor: t.activeBorder, color: '#fff', '& .MuiChip-deleteIcon': { color: 'rgba(255,255,255,0.7)', fontSize: 12 } }}
                />
              )}
            </Paper>
          );
        })}
      </Box>

      {/* Grouped by community */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <AssignmentLateIcon sx={{ fontSize: 18, color: '#DC2626' }} />
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {filteredRows.length} {activeFilter ? `${activeFilter.toLowerCase()} ` : ''}POCs across {groups.length} {groups.length === 1 ? 'community' : 'communities'}
          {activeFilter && (
            <Typography component="span" variant="caption" sx={{ ml: 1, color: '#64748B', fontWeight: 400 }}>
              (filtered · <Typography component="span" sx={{ color: '#0065BD', cursor: 'pointer', fontWeight: 600, fontSize: 'inherit', '&:hover': { textDecoration: 'underline' } }} onClick={() => setActiveFilter(null)}>clear</Typography>)
            </Typography>
          )}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {groups.map((g) => (
          <Paper key={g.facilityId} sx={{ borderRadius: 3, border: '1px solid #E0E4E7', overflow: 'hidden' }}>
            {/* Community header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2, py: 1.25, bgcolor: '#F8FAFC', borderBottom: '1px solid #E0E4E7' }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, fontSize: '0.875rem', color: '#0065BD', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                  onClick={() => navigate(`/facility/${g.facilityId}`)}
                >
                  {g.facility.replace('Avir at ', '')}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.7rem' }}>{g.region}</Typography>
              </Box>
              {/* Survey meta */}
              <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center', flexShrink: 0 }}>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.65rem', display: 'block', lineHeight: 1.2 }}>Surveyor</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#293036' }}>
                    {(() => { const names = [...new Set(g.items.map((i) => i.surveyor).filter(Boolean))]; return names.length === 1 ? names[0] : names.length > 1 ? 'Multiple' : '—'; })()}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.65rem', display: 'block', lineHeight: 1.2 }}>Survey Date</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#293036' }}>
                    {(() => { const dates = [...new Set(g.items.map((i) => i.date))].sort().reverse(); return dates.length === 1 ? fmtDate(dates[0]) : `${fmtDate(dates[0])} +${dates.length - 1}`; })()}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.65rem', display: 'block', lineHeight: 1.2 }}>Max Days Open</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.75rem', color: g.items[0]?.daysOpen > 60 ? '#991B1B' : g.items[0]?.daysOpen > 30 ? '#92400E' : '#293036' }}>
                    {g.items[0]?.daysOpen ?? '—'}
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={`${g.items.length} POC${g.items.length !== 1 ? 's' : ''}`}
                size="small"
                sx={{ fontWeight: 700, fontSize: '0.7rem', bgcolor: '#FEE2E2', color: '#991B1B', flexShrink: 0 }}
              />
              {/* Actions */}
              <Box sx={{ display: 'flex', gap: 0.5, ml: 0.5, flexShrink: 0 }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: '14px !important' }} />}
                  onClick={(e) => e.stopPropagation()}
                  sx={{ fontSize: '0.7rem', py: 0.4, px: 1, minWidth: 0, borderColor: '#CBD5E1', color: '#475569', textTransform: 'none', '&:hover': { borderColor: '#94A3B8', bgcolor: '#F1F5F9' } }}
                >
                  Export
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<IosShareIcon sx={{ fontSize: '14px !important' }} />}
                  onClick={(e) => e.stopPropagation()}
                  sx={{ fontSize: '0.7rem', py: 0.4, px: 1, minWidth: 0, borderColor: '#CBD5E1', color: '#475569', textTransform: 'none', '&:hover': { borderColor: '#94A3B8', bgcolor: '#F1F5F9' } }}
                >
                  Share
                </Button>
              </Box>
            </Box>

            {/* Citations table */}
            <Table size="small">
              <TableHead>
                <TableRow>
                  {hCell('Tag', 90)}
                  {hCell('Description')}
                  {hCell('Status', 100)}
                  {hCell('Days Open', 95, 'right')}
                  <TableCell sx={{ bgcolor: '#e0e4e7', width: 32, px: 0 }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {g.items.map((c) => (
                  <TableRow
                    key={c.id}
                    hover
                    onClick={() => setDrawerCitation(citations.find((x) => x.id === c.id) ?? null)}
                    sx={{
                      cursor: 'pointer',
                      bgcolor: c.daysOpen > 60 ? '#FFF5F5' : 'inherit',
                      '&:hover': { bgcolor: c.daysOpen > 60 ? '#FEE2E2' : '#F0F7FF' },
                    }}
                  >
                    <TableCell sx={{ width: 90, minWidth: 90 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.8rem' }}>{c.tag}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">{c.description.length > 75 ? c.description.slice(0, 75) + '…' : c.description}</Typography>
                    </TableCell>
                    <TableCell sx={{ width: 100, minWidth: 100 }}>{statusChip(c.status === 'Open' && c.daysOpen > 60 ? 'Overdue' : c.status)}</TableCell>
                    <TableCell align="right" sx={{ width: 95, minWidth: 95 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.85rem', color: c.daysOpen > 60 ? '#991B1B' : c.daysOpen > 30 ? '#92400E' : '#293036' }}>
                        {c.daysOpen}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: 32, px: 0 }}>
                      <ChevronRightIcon sx={{ fontSize: 18, color: '#94A3B8' }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        ))}
      </Box>

      {/* Citation Detail Drawer */}
      <Drawer anchor="right" open={!!drawerCitation} onClose={() => setDrawerCitation(null)} sx={{ zIndex: 1400 }} PaperProps={{ sx: { width: 480, p: 3 } }}>
        {drawerCitation && (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Citation Detail</Typography>
              <IconButton onClick={() => setDrawerCitation(null)} size="small"><CloseIcon /></IconButton>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {/* Tag + description on one line */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
              <Chip label={drawerCitation.tag} sx={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.85rem', flexShrink: 0 }} />
              <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.5, pt: 0.25 }}>
                {drawerCitation.description || '—'}
              </Typography>
            </Box>

            {/* Status + days open inline */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
              {statusChip(drawerCitation.status === 'Open' && daysOpen(drawerCitation.date) > 60 ? 'Overdue' : drawerCitation.status)}
              <Typography variant="caption" sx={{ color: '#64748B' }}>
                Open <strong style={{ color: daysOpen(drawerCitation.date) > 60 ? '#991B1B' : daysOpen(drawerCitation.date) > 30 ? '#92400E' : '#293036' }}>{daysOpen(drawerCitation.date)} days</strong>
              </Typography>
            </Box>

            {/* Metadata grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 2.5 }}>
              {([
                ['Community',    drawerCitation.facility],
                ['Region',      drawerCitation.region],
                ['Survey Date', fmtDate(drawerCitation.date)],
                ['Surveyor',    drawerCitation.surveyor || '—'],
              ] as [string, string][]).map(([label, value]) => (
                <Box key={label}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block' }}>{label}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{value}</Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Observation */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block', mb: 0.5 }}>Observation</Typography>
              <Paper sx={{ p: 2, bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ fontSize: '0.85rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {drawerCitation.observation || 'No observation details available.'}
                </Typography>
              </Paper>
            </Box>

            <Button variant="contained" color="primary" fullWidth>Mark as Resolved</Button>
          </Box>
        )}
      </Drawer>
    </Box>
  );
}
