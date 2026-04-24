import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Chip, Divider, Drawer, IconButton, Button, Menu,
  MenuItem as MuiMenuItem, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
import SellIcon from '@mui/icons-material/Sell';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import { citations, surveys, tagDescriptions } from '../data/avir-data';
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
  const [dateRange, setDateRange] = useState('ytd');
  const [regionFilter, setRegionFilter] = useState('');
  const [latestOnly, setLatestOnly] = useState(true);
  const [drawerCitation, setDrawerCitation] = useState<typeof filteredCitations[number] | null>(null);
  const [jumpMenuAnchor, setJumpMenuAnchor] = useState<null | HTMLElement>(null);
  const [jumpSearch, setJumpSearch] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const parentLabel = typeLabels[type || ''] || 'K-Tags';
  const tagPrefix = type === 'k' ? 'K' : type === 'e' ? 'E' : 'N';
  const description = tagDescriptions.get(tag || '') || '';

  // All tags of this type for the jump menu
  const allTagsOfType = useMemo(() => {
    const tagType = type === 'k' ? 'K' : type === 'e' ? 'E' : 'N';
    const tagSet = new Set<string>();
    citations.filter((c) => c.tagType === tagType).forEach((c) => tagSet.add(c.tag));
    return [...tagSet].sort();
  }, [type]);

  const waiverFacilityDates = useMemo(() =>
    new Set(surveys.filter((s) => s.isWaiver).map((s) => `${s.facilityId}__${s.date}`)),
  []);

  const filteredCitations = useMemo(() => {
    const passesDate = makeDateFilter(dateRange);
    let result = citations
      .filter((c) =>
        c.tag === tag &&
        passesFilter(c.facilityId) &&
        passesDate(c.date) &&
        !waiverFacilityDates.has(`${c.facilityId}__${c.date}`)
      );
    if (regionFilter) result = result.filter((c) => c.region === regionFilter);
    if (latestOnly) {
      const latestByFacility = new Map<string, string>();
      result.forEach((c) => {
        const current = latestByFacility.get(c.facilityId);
        if (!current || c.date > current) latestByFacility.set(c.facilityId, c.date);
      });
      result = result.filter((c) => latestByFacility.get(c.facilityId) === c.date);
    }
    const mul = sortDir === 'asc' ? 1 : -1;
    return result.sort((a, b) => a.date.localeCompare(b.date) * mul);
  }, [tag, passesFilter, dateRange, waiverFacilityDates, regionFilter, latestOnly, sortDir]);

  const regions = useMemo(() =>
    [...new Set(citations.filter((c) => c.tag === tag).map((c) => c.region).filter(Boolean))].sort(),
  [tag]);

  const totalCount = filteredCitations.length;

  return (
    <Box>
      <PageHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <span>{description ? `${tag} ${description}` : (tag || '')}</span>
            <Button
              variant="contained" color="inherit" size="small"
              startIcon={<SellIcon sx={{ fontSize: '16px !important' }} />}
              endIcon={<KeyboardArrowDownIcon />}
              onClick={(e) => { setJumpMenuAnchor(e.currentTarget); setJumpSearch(''); }}
              sx={{ fontWeight: 600, fontSize: '0.875rem' }}
            >
              Jump to {tagPrefix}-Tag
            </Button>
            <Menu
              anchorEl={jumpMenuAnchor}
              open={Boolean(jumpMenuAnchor)}
              onClose={() => setJumpMenuAnchor(null)}
              PaperProps={{ sx: { maxHeight: 320, width: 300 } }}
            >
              <Box sx={{ px: 1.5, py: 1, position: 'sticky', top: 0, bgcolor: 'white', zIndex: 1 }}>
                <TextField
                  size="small" fullWidth placeholder="Search tags..."
                  value={jumpSearch} onChange={(e) => setJumpSearch(e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
                  autoFocus onKeyDown={(e) => e.stopPropagation()}
                />
              </Box>
              {allTagsOfType
                .filter((t) => !jumpSearch || t.toLowerCase().includes(jumpSearch.toLowerCase()) || (tagDescriptions.get(t) || '').toLowerCase().includes(jumpSearch.toLowerCase()))
                .map((t) => (
                  <MuiMenuItem key={t} onClick={() => { setJumpMenuAnchor(null); navigate(`/citations-remix/tags/${type}/${t}`); }}
                    sx={{ fontSize: '14px' }}>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>{t}</Typography>
                      {tagDescriptions.get(t) && (
                        <Typography sx={{ fontSize: '12px', color: '#64748B' }}>{tagDescriptions.get(t)}</Typography>
                      )}
                    </Box>
                  </MuiMenuItem>
                ))}
            </Menu>
          </Box>
        }
        backLabel={`Back to ${parentLabel}`}
        onBack={() => navigate(`/citations-remix/tags/${type}`)}
      />
      <PageFilters
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        extraFilters={
          <FormControl size="small" variant="filled" sx={{ minWidth: 220, '& .MuiFilledInput-root': { bgcolor: '#fff', '&:hover': { bgcolor: '#fff' }, '&.Mui-focused': { bgcolor: '#fff' } } }}>
            <InputLabel>Filter by CMS Region</InputLabel>
            <Select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}>
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
        actions={
          <Button size="small" variant="contained" color="inherit" disableElevation startIcon={<FileDownloadIcon />}>
            Export
          </Button>
        }
      />

      {/* Citations Table */}
      <Paper elevation={0} sx={{ mb: 2, borderRadius: '8px', border: '1px solid #e0e4e7', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5 }}>
          <Typography sx={{ fontSize: '16px', color: '#293036', fontWeight: 700, letterSpacing: '-0.176px' }}>
            {totalCount} citation{totalCount !== 1 ? 's' : ''}
          </Typography>
        </Box>
        <TableContainer sx={{ bgcolor: '#e0e4e7' }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#e0e4e7' }}>
              <TableRow>
                <TableCell
                  sx={{ fontWeight: 600, fontSize: '14px', color: '#293036', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2, width: 130, cursor: 'pointer', '&:hover': { color: '#0065BD' } }}
                  onClick={() => setSortDir((d) => d === 'asc' ? 'desc' : 'asc')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                    Survey date
                    {sortDir === 'desc' ? <ArrowDownwardIcon sx={{ fontSize: 16 }} /> : <ArrowUpwardIcon sx={{ fontSize: 16 }} />}
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#293036', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2 }}>Community</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#293036', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2, width: 160 }}>CMS Region</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#293036', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2, width: 150 }}>Surveyor</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#293036', bgcolor: '#e0e4e7', letterSpacing: '-0.084px', py: '6px', px: 2 }}>Observation</TableCell>
                <TableCell sx={{ bgcolor: '#e0e4e7', width: 48, px: 0 }} />
              </TableRow>
            </TableHead>
            <TableBody sx={{ bgcolor: 'white' }}>
              {filteredCitations.map((c, idx) => {
                const isLast = idx === filteredCitations.length - 1;
                return (
                  <TableRow key={c.id} hover sx={{
                    cursor: 'pointer', '&:hover': { bgcolor: '#F0F7FF' },
                    ...(isLast && { '& td': { borderBottom: 'none' } }),
                  }}
                    onClick={() => setDrawerCitation(c)}>
                    <TableCell>
                      <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#293036' }}>{fmtDate(c.date)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#293036' }}>{c.facility.replace('Avir at ', '')}</Typography>
                      <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#293036' }}>{c.region}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#293036' }}>{c.region || '—'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#293036' }}>{c.surveyor || '—'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#293036', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 300 }}>
                        {c.observation || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ px: 1 }}>
                      <IconButton size="small">
                        <ArrowForwardIcon sx={{ fontSize: 18, color: '#293036' }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Citation Detail Drawer */}
      <Drawer
        anchor="right"
        open={!!drawerCitation}
        onClose={() => setDrawerCitation(null)}
        PaperProps={{ sx: { width: 480, display: 'flex', flexDirection: 'column' } }}
      >
        {drawerCitation && (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, pb: 2 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '16px', color: '#293036' }}>Citation details</Typography>
              <IconButton onClick={() => setDrawerCitation(null)} size="small"><CloseIcon /></IconButton>
            </Box>

            {/* Content */}
            <Box sx={{ px: 3, flexGrow: 1 }}>
              {/* Community */}
              <Typography sx={{ fontWeight: 700, fontSize: '16px', color: '#293036' }}>
                {drawerCitation.facility.replace('Avir at ', '')}
              </Typography>
              <Typography sx={{ fontSize: '14px', fontStyle: 'italic', color: '#5c6874', mb: 2 }}>
                TX - {drawerCitation.region}
              </Typography>

              {/* Survey date + Surveyor */}
              <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                <Box>
                  <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#293036' }}>Survey date</Typography>
                  <Typography sx={{ fontSize: '14px', color: '#293036' }}>{drawerCitation.surveyor || '—'}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#293036' }}>Surveyor</Typography>
                  <Typography sx={{ fontSize: '14px', color: '#293036' }}>{fmtDate(drawerCitation.date)}</Typography>
                </Box>
              </Box>

              {/* Citation card */}
              <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#F7F8F9', border: '1px solid #e0e4e7', borderRadius: '8px' }}>
                <Typography sx={{ fontWeight: 700, fontSize: '16px', color: '#293036', mb: 0.5 }}>
                  {drawerCitation.tag}
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '14px', color: '#293036', mb: 1.5 }}>
                  {drawerCitation.description || '—'}
                </Typography>
                <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#5c6874', mb: 0.5 }}>
                  Observation
                </Typography>
                <Typography sx={{ fontSize: '14px', color: '#293036', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {drawerCitation.observation || 'No observation details available.'}
                </Typography>
              </Paper>
            </Box>

            {/* Close button — bottom */}
            <Box sx={{ p: 3, pt: 2 }}>
              <Button variant="contained" color="inherit" disableElevation fullWidth onClick={() => setDrawerCitation(null)}>
                Close
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
}
