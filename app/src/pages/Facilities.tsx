import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { facilities, citations } from '../data/avir-data';
import type { PocStage } from '../data/avir-data';
import PageHeader from '../components/PageHeader';
import { fmtDate } from '../utils/formatDate';

const TODAY = new Date('2026-04-26');

function daysUntil(dateStr: string): number {
  return Math.round((new Date(dateStr).getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24));
}

const STAGES: { key: PocStage; label: string; color: string; bg: string }[] = [
  { key: 'Open',         label: 'Open',         color: '#374151', bg: '#F1F5F9' },
  { key: 'Submitted',    label: 'Submitted',    color: '#1565C0', bg: '#EFF6FF' },
  { key: 'Approved',     label: 'Approved',     color: '#065F46', bg: '#D1FAE5' },
  { key: 'Work Order',   label: 'Work Orders',  color: '#374151', bg: '#F1F5F9' },
  { key: 'Final Review', label: 'Final Review', color: '#6B21A8', bg: '#F5F3FF' },
  { key: 'Closed',       label: 'Closed',       color: '#374151', bg: '#F1F5F9' },
];

// Compute real POC stage counts from citation data for The Meadow
const meadowCitations = citations.filter((c) => c.facilityId === 'fac-avir-at-the-meadow');
const meadowStageCounts: Partial<Record<PocStage, number>> = meadowCitations.reduce<Partial<Record<PocStage, number>>>((acc, c) => {
  const stage = (c.pocStatus || 'Open') as PocStage;
  acc[stage] = (acc[stage] || 0) + 1;
  return acc;
}, {});

export default function Facilities() {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<'name' | 'pocDueDate' | 'surveyDate' | 'total'>('pocDueDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const pocFacilities = useMemo(() => {
    return facilities
      .filter((f) => f.pocMode)
      .map((f) => {
        const counts = f.id === 'fac-avir-at-the-meadow' ? meadowStageCounts : (f.pocStageCounts || {});
        const total = Object.values(counts).reduce((s, n) => s + (n || 0), 0);
        const open = counts['Open'] || 0;
        const pctComplete = total > 0 ? Math.round(((total - open) / total) * 100) : 0;
        return { ...f, counts, total, pctComplete };
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortField === 'name') cmp = a.name.localeCompare(b.name);
        else if (sortField === 'pocDueDate') cmp = (a.pocDueDate || '').localeCompare(b.pocDueDate || '');
        else if (sortField === 'surveyDate') cmp = (a.pocSurveyDate || '').localeCompare(b.pocSurveyDate || '');
        else if (sortField === 'total') cmp = a.total - b.total;
        return sortDir === 'asc' ? cmp : -cmp;
      });
  }, [sortField, sortDir]);

  const headerCell = (label: string, field?: typeof sortField, align: 'left' | 'right' | 'center' = 'left') => {
    const active = field && sortField === field;
    return (
      <TableCell
        key={label}
        onClick={field ? () => handleSort(field) : undefined}
        sx={{
          fontWeight: 600, fontSize: '13px', color: '#293036',
          bgcolor: '#e0e4e7', py: '8px', px: 2, whiteSpace: 'nowrap',
          textAlign: align,
          cursor: field ? 'pointer' : 'default',
          userSelect: 'none',
          '&:hover': field ? { bgcolor: '#d4d8dc' } : {},
        }}
      >
        {label}{active ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}
      </TableCell>
    );
  };

  return (
    <Box>
      <PageHeader
        title="Plan of Corrections"
        actions={
          <Button variant="contained" color="inherit" size="small" disableElevation startIcon={<FileDownloadIcon />}>Export</Button>
        }
      />

      {/* Summary strip */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        {STAGES.map((s) => {
          const total = pocFacilities.reduce((sum, f) => sum + (f.counts[s.key] || 0), 0);
          return (
            <Paper key={s.key} elevation={0} sx={{ flex: 1, p: 1.5, border: '1px solid #e0e4e7', borderRadius: '8px', textAlign: 'center' }}>
              <Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#8492a1', mb: 0.5 }}>{s.label}</Typography>
              <Typography sx={{ fontSize: '22px', fontWeight: 700, color: total > 0 ? '#293036' : '#b0b8c1', lineHeight: 1.1 }}>{total}</Typography>
              <Typography sx={{ fontSize: '11px', color: '#8492a1', mt: 0.25 }}>across {pocFacilities.length} communities</Typography>
            </Paper>
          );
        })}
      </Box>

      {/* Table */}
      <Paper elevation={0} sx={{ border: '1px solid #e0e4e7', borderRadius: '8px', overflow: 'hidden' }}>
        <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontWeight: 700, fontSize: '16px', color: '#293036' }}>
            {pocFacilities.length} communities in active POC
          </Typography>
        </Box>
        <TableContainer sx={{ bgcolor: '#e0e4e7' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {headerCell('Community', 'name')}
                {headerCell('Survey date', 'surveyDate', 'right')}
                {headerCell('POC due', 'pocDueDate', 'right')}
                {headerCell('Total', 'total', 'right')}
                {STAGES.map((s) => (
                  <TableCell key={s.key} sx={{ fontWeight: 600, fontSize: '13px', color: '#293036', bgcolor: '#e0e4e7', py: '8px', px: 2, whiteSpace: 'nowrap', textAlign: 'right' }}>
                    {s.label}
                  </TableCell>
                ))}
                <TableCell sx={{ bgcolor: '#e0e4e7', width: 40, px: 0 }} />
              </TableRow>
            </TableHead>
            <TableBody sx={{ bgcolor: 'white' }}>
              {pocFacilities.map((f, idx) => {
                const isLast = idx === pocFacilities.length - 1;
                const days = f.pocDueDate ? daysUntil(f.pocDueDate) : null;
                const isOverdue = days !== null && days < 0;
                const isDueSoon = days !== null && !isOverdue && days <= 7;
                const dueDateColor = isOverdue ? '#991B1B' : isDueSoon ? '#92400E' : '#293036';
                const dueDateBg = isOverdue ? '#FEE2E2' : isDueSoon ? '#FFF7ED' : undefined;

                return (
                  <TableRow
                    key={f.id}
                    hover
                    onClick={() => navigate(`/facility/${f.id}`)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { bgcolor: '#F0F7FF' },
                      ...(isLast && { '& td': { borderBottom: 'none' } }),
                    }}
                  >
                    {/* Community */}
                    <TableCell sx={{ px: 2, py: '12px' }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '14px', color: '#293036', lineHeight: 1.2 }}>
                        {f.name.replace('Avir at ', '')}
                      </Typography>
                      <Typography sx={{ fontSize: '12px', color: '#64748B', mt: 0.25 }}>
                        {f.state} · {f.region}
                      </Typography>
                    </TableCell>

                    {/* Survey date */}
                    <TableCell sx={{ px: 2, textAlign: 'right' }}>
                      <Typography sx={{ fontSize: '13px', color: '#293036' }}>{fmtDate(f.pocSurveyDate || '')}</Typography>
                    </TableCell>

                    {/* POC due */}
                    <TableCell sx={{ px: 2, textAlign: 'right', bgcolor: dueDateBg }}>
                      <Typography sx={{ fontSize: '13px', fontWeight: 600, color: dueDateColor }}>
                        {fmtDate(f.pocDueDate || '')}
                      </Typography>
                      {isOverdue && <Typography sx={{ fontSize: '11px', color: '#991B1B' }}>Overdue</Typography>}
                      {isDueSoon && <Typography sx={{ fontSize: '11px', color: '#92400E' }}>Due soon</Typography>}
                    </TableCell>

                    {/* Total */}
                    <TableCell sx={{ px: 2, textAlign: 'right' }}>
                      <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#293036' }}>{f.total}</Typography>
                    </TableCell>

                    {/* Stage counts */}
                    {STAGES.map((s) => {
                      const count = f.counts[s.key] || 0;
                      // Closed items aren't actionable, so don't flag them as overdue
                      const cellOverdue = isOverdue && count > 0 && s.key !== 'Closed';
                      return (
                        <TableCell
                          key={s.key}
                          sx={{
                            px: 2,
                            textAlign: 'right',
                            bgcolor: cellOverdue ? '#FEE2E2' : undefined,
                          }}
                        >
                          {count > 0 ? (
                            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: cellOverdue ? '#991B1B' : '#293036' }}>
                              {count}
                            </Typography>
                          ) : (
                            <Typography sx={{ fontSize: '13px', color: '#b0b8c1' }}>—</Typography>
                          )}
                        </TableCell>
                      );
                    })}

                    {/* Arrow */}
                    <TableCell sx={{ px: 1 }}>
                      <ChevronRightIcon sx={{ fontSize: 18, color: '#8492a1' }} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
