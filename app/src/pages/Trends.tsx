import { useMemo, useState } from 'react';
import {
  Box, Typography, Paper, FormControl, InputLabel, Select, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, LinearProgress, Divider,
} from '@mui/material';
import { BarChart } from '@mui/x-charts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonIcon from '@mui/icons-material/Person';
import MapIcon from '@mui/icons-material/Map';
import PageHeader from '../components/PageHeader';
import PageFilters from '../components/PageFilters';
import { surveys, citations, regions as avirRegions, surveyors as avirSurveyors } from '../data/avir-data';
import { useCommunityFilter } from '../components/CommunityFilter';
import { makeDateFilter } from '../utils/dateFilter';

export default function Trends() {
  const { passesFilter } = useCommunityFilter();
  const [dateRange, setDateRange] = useState('all');
  const [selectedSurveyor, setSelectedSurveyor] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const passesDate = useMemo(() => makeDateFilter(dateRange), [dateRange]);

  // --- Surveyor Trends ---
  const surveyorData = useMemo(() => {
    const filtered = surveys.filter((s) => passesFilter(s.facilityId) && passesDate(s.date) && s.surveyor);
    const map = new Map<string, { name: string; surveys: number; kTags: number; nTags: number; eTags: number; total: number; facilities: Set<string> }>();

    for (const s of filtered) {
      if (!map.has(s.surveyor)) {
        map.set(s.surveyor, { name: s.surveyor, surveys: 0, kTags: 0, nTags: 0, eTags: 0, total: 0, facilities: new Set() });
      }
      const d = map.get(s.surveyor)!;
      d.surveys++;
      d.kTags += s.kTags;
      d.nTags += s.nTags;
      d.eTags += s.eTags;
      d.total += s.total;
      d.facilities.add(s.facility);
    }

    return [...map.values()].sort((a, b) => b.total - a.total);
  }, [passesFilter, passesDate]);

  // Top tags per surveyor
  const surveyorTopTags = useMemo(() => {
    const target = selectedSurveyor || (surveyorData[0]?.name ?? '');
    if (!target) return [];
    const cits = citations.filter((c) => c.surveyor === target && passesFilter(c.facilityId) && passesDate(c.date));
    const tagMap = new Map<string, { tag: string; desc: string; type: string; count: number }>();
    for (const c of cits) {
      if (!tagMap.has(c.tag)) tagMap.set(c.tag, { tag: c.tag, desc: c.description, type: c.tagType, count: 0 });
      tagMap.get(c.tag)!.count++;
    }
    return [...tagMap.values()].sort((a, b) => b.count - a.count).slice(0, 10);
  }, [selectedSurveyor, surveyorData, passesFilter, passesDate]);

  const activeSurveyor = selectedSurveyor || (surveyorData[0]?.name ?? '');

  // Surveyor bar chart data
  const surveyorChartData = useMemo(() => {
    return surveyorData.slice(0, 12).map((s) => ({
      name: s.name.length > 15 ? s.name.slice(0, 14) + '...' : s.name,
      'K-Tags': s.kTags,
      'N-Tags': s.nTags,
      'E-Tags': s.eTags,
    }));
  }, [surveyorData]);

  // --- Region Tag Trends ---
  const regionTagData = useMemo(() => {
    const filtered = citations.filter((c) => passesFilter(c.facilityId) && passesDate(c.date));
    const map = new Map<string, Map<string, number>>();

    for (const c of filtered) {
      const region = selectedRegion || c.region;
      if (selectedRegion && c.region !== selectedRegion) continue;
      if (!map.has(c.tag)) map.set(c.tag, new Map());
      const regionMap = map.get(c.tag)!;
      regionMap.set(c.region, (regionMap.get(c.region) || 0) + 1);
    }

    // Flatten: top tags across all regions (or selected region)
    const tagTotals = new Map<string, { tag: string; desc: string; type: string; total: number; regions: Map<string, number> }>();
    for (const c of filtered) {
      if (selectedRegion && c.region !== selectedRegion) continue;
      if (!tagTotals.has(c.tag)) {
        tagTotals.set(c.tag, { tag: c.tag, desc: c.description, type: c.tagType, total: 0, regions: new Map() });
      }
      const t = tagTotals.get(c.tag)!;
      t.total++;
      t.regions.set(c.region, (t.regions.get(c.region) || 0) + 1);
    }

    return [...tagTotals.values()].sort((a, b) => b.total - a.total).slice(0, 15);
  }, [passesFilter, passesDate, selectedRegion]);

  // Region chart data: top 8 regions by total citations, stacked by tag type
  const regionChartData = useMemo(() => {
    const filtered = surveys.filter((s) => passesFilter(s.facilityId) && passesDate(s.date));
    const map = new Map<string, { region: string; K: number; N: number; E: number }>();
    for (const s of filtered) {
      if (!map.has(s.region)) map.set(s.region, { region: s.region, K: 0, N: 0, E: 0 });
      const r = map.get(s.region)!;
      r.K += s.kTags;
      r.N += s.nTags;
      r.E += s.eTags;
    }
    return [...map.values()]
      .sort((a, b) => (b.K + b.N + b.E) - (a.K + a.N + a.E))
      .slice(0, 8)
      .map((r) => ({
        ...r,
        region: r.region.replace('Region ', 'R').replace(/ - /g, ': '),
      }));
  }, [passesFilter, passesDate]);

  const tagTypeChip = (type: string) => {
    const styles: Record<string, { bg: string; color: string }> = {
      K: { bg: '#FEE2E2', color: '#991B1B' },
      N: { bg: '#DBEAFE', color: '#1E40AF' },
      E: { bg: '#FEF9C3', color: '#854D0E' },
    };
    const s = styles[type] || styles.K;
    return <Chip label={`${type}-Tag`} size="small" sx={{ bgcolor: s.bg, color: s.color, fontWeight: 600, fontSize: '0.65rem', height: 20 }} />;
  };

  return (
    <Box>
      <PageHeader title="Trends" />
      <PageFilters dateRange={dateRange} onDateRangeChange={setDateRange} />

      {/* --- Surveyor Section --- */}
      <Paper sx={{ p: 2.5, mb: 3, borderRadius: 3, border: '1px solid #E0E4E7' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <PersonIcon sx={{ color: '#0065BD' }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Surveyor Focus Areas</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>What has each surveyor been citing most?</Typography>
        </Box>

        {/* Surveyor chart */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: '#5c6874' }}>Citations by Surveyor</Typography>
          <BarChart
            height={280}
            layout="horizontal"
            series={[
              { data: surveyorChartData.map((s) => s['K-Tags']), label: 'K-Tags', color: '#DC2626', stack: 'a' },
              { data: surveyorChartData.map((s) => s['N-Tags']), label: 'N-Tags', color: '#2563EB', stack: 'a' },
              { data: surveyorChartData.map((s) => s['E-Tags']), label: 'E-Tags', color: '#CA8A04', stack: 'a' },
            ]}
            yAxis={[{ data: surveyorChartData.map((s) => s.name), scaleType: 'band' }]}
            margin={{ left: 120, right: 10, top: 10, bottom: 30 }}
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Surveyor detail */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Select Surveyor</InputLabel>
            <Select value={activeSurveyor} label="Select Surveyor" onChange={(e) => setSelectedSurveyor(e.target.value)}>
              {surveyorData.map((s) => (
                <MenuItem key={s.name} value={s.name}>{s.name} ({s.total} citations)</MenuItem>
              ))}
            </Select>
          </FormControl>

          {activeSurveyor && (() => {
            const s = surveyorData.find((d) => d.name === activeSurveyor);
            if (!s) return null;
            return (
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Box sx={{ textAlign: 'center', p: 1, bgcolor: '#F8FAFC', borderRadius: 2, minWidth: 70 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>{s.surveys}</Typography>
                  <Typography variant="caption" color="text.secondary">Surveys</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', p: 1, bgcolor: '#F8FAFC', borderRadius: 2, minWidth: 70 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>{s.total}</Typography>
                  <Typography variant="caption" color="text.secondary">Citations</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', p: 1, bgcolor: '#F8FAFC', borderRadius: 2, minWidth: 70 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>{s.facilities.size}</Typography>
                  <Typography variant="caption" color="text.secondary">Communities</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', p: 1, bgcolor: '#F8FAFC', borderRadius: 2, minWidth: 70 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>{(s.total / s.surveys).toFixed(1)}</Typography>
                  <Typography variant="caption" color="text.secondary">Avg/Survey</Typography>
                </Box>
              </Box>
            );
          })()}
        </Box>

        {/* Top tags for selected surveyor */}
        {surveyorTopTags.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#5c6874' }}>
              Top Tags for {activeSurveyor}
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#F0F2F4' }}>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', py: 0.75 }}>Tag</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', py: 0.75 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', py: 0.75 }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', py: 0.75, width: 100 }} align="right">Count</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', py: 0.75, width: 200 }}>Distribution</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {surveyorTopTags.map((t) => (
                    <TableRow key={t.tag} hover>
                      <TableCell>
                        <Chip label={t.tag} size="small" variant="outlined" sx={{ fontWeight: 700, fontFamily: 'monospace' }} />
                      </TableCell>
                      <TableCell>{tagTypeChip(t.type)}</TableCell>
                      <TableCell><Typography variant="caption">{t.desc}</Typography></TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{t.count}</Typography>
                      </TableCell>
                      <TableCell>
                        <LinearProgress variant="determinate"
                          value={(t.count / (surveyorTopTags[0]?.count || 1)) * 100}
                          sx={{ height: 6, borderRadius: 3, bgcolor: '#F1F5F9',
                            '& .MuiLinearProgress-bar': { bgcolor: t.type === 'K' ? '#DC2626' : t.type === 'E' ? '#CA8A04' : '#2563EB', borderRadius: 3 },
                          }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Paper>

      {/* --- Region Tag Trends --- */}
      <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E0E4E7' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <MapIcon sx={{ color: '#0065BD' }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Tag Trends by Region</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>Which tags are trending highest in each region?</Typography>
        </Box>

        {/* Region chart */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: '#5c6874' }}>Citations by Region</Typography>
          <BarChart
            height={250}
            layout="horizontal"
            series={[
              { data: regionChartData.map((r) => r.K), label: 'K-Tags', color: '#DC2626', stack: 'a' },
              { data: regionChartData.map((r) => r.N), label: 'N-Tags', color: '#2563EB', stack: 'a' },
              { data: regionChartData.map((r) => r.E), label: 'E-Tags', color: '#CA8A04', stack: 'a' },
            ]}
            yAxis={[{ data: regionChartData.map((r) => r.region), scaleType: 'band' }]}
            margin={{ left: 200, right: 10, top: 10, bottom: 30 }}
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Region filter + top tags table */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Region</InputLabel>
            <Select value={selectedRegion} label="Filter by Region" onChange={(e) => setSelectedRegion(e.target.value)}>
              <MenuItem value="">All Regions</MenuItem>
              {avirRegions.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
            </Select>
          </FormControl>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {regionTagData.reduce((s, t) => s + t.total, 0)} citations
            <Typography component="span" variant="body2" sx={{ color: '#5c6874', ml: 0.5 }}>
              across {regionTagData.length} unique tags
            </Typography>
          </Typography>
        </Box>

        <Typography variant="subtitle2" sx={{ mb: 1, color: '#5c6874' }}>
          Top Tags {selectedRegion ? `in ${selectedRegion}` : 'Across All Regions'}
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#F0F2F4' }}>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', py: 0.75 }}>Rank</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', py: 0.75 }}>Tag</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', py: 0.75 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', py: 0.75 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', py: 0.75, width: 80 }} align="right">Total</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', py: 0.75, width: 200 }}>Distribution</TableCell>
                {!selectedRegion && (
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', py: 0.75 }}>Top Region</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {regionTagData.map((t, i) => {
                const topRegion = [...t.regions.entries()].sort((a, b) => b[1] - a[1])[0];
                return (
                  <TableRow key={t.tag} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: i < 3 ? '#DC2626' : '#293036' }}>
                        #{i + 1}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={t.tag} size="small" variant="outlined" sx={{ fontWeight: 700, fontFamily: 'monospace' }} />
                    </TableCell>
                    <TableCell>{tagTypeChip(t.type)}</TableCell>
                    <TableCell><Typography variant="caption">{t.desc}</Typography></TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{t.total}</Typography>
                    </TableCell>
                    <TableCell>
                      <LinearProgress variant="determinate"
                        value={(t.total / (regionTagData[0]?.total || 1)) * 100}
                        sx={{ height: 6, borderRadius: 3, bgcolor: '#F1F5F9',
                          '& .MuiLinearProgress-bar': { bgcolor: t.type === 'K' ? '#DC2626' : t.type === 'E' ? '#CA8A04' : '#2563EB', borderRadius: 3 },
                        }} />
                    </TableCell>
                    {!selectedRegion && topRegion && (
                      <TableCell>
                        <Typography variant="caption" sx={{ fontWeight: 500 }}>
                          {topRegion[0].replace('Region ', 'R').replace(/ - /g, ': ')} ({topRegion[1]})
                        </Typography>
                      </TableCell>
                    )}
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
