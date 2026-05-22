import React, { useMemo, useState } from 'react';
import {
  AppBar, Toolbar, Box, Typography, IconButton, Badge, Chip, Card, CardContent,
  Stack, Button, Alert, AlertTitle, LinearProgress, Divider, BottomNavigation,
  BottomNavigationAction, Drawer, Paper, Snackbar, Avatar
} from '@mui/material';
import { community, readiness, aiBanner, weather, tiers, reviews, mdSchedule, team, rescheduleOptions, tasksList, aiActivity, calibration, day30TeamNotes, predictiveWorkOrders, predictiveReviews, forecasts, learnedPatterns, backlog, unitTurns, services, day1Status, learningSignals, day30Status, day90Status, predictiveInsights, operationalPriorities, day1StaffingConflict, day1PmTradeoff, day1LearningHighlight, routineRollup, day30Readiness, day90Health, strategicRisks, teamFocus, day90Coverage, day1MetricDetails } from './data.js';
import { ToggleButton, ToggleButtonGroup, Collapse, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Grow } from '@mui/material';

// Trust Maturity Mode — the relationship evolves over time.
// 'day1' = original prototype, unchanged. 'day30' = calibrated. 'day90' = predictive operations.
const ModeContext = React.createContext('day1');
const useMode = () => React.useContext(ModeContext);
const HEADER_OFFSET = 'calc(100px + env(safe-area-inset-top))';

const Icon = ({ name, size = 20, color, sx }) => (
  <span
    className="material-symbols-rounded"
    style={{ fontSize: size, color, lineHeight: 1, ...sx }}
  >
    {name}
  </span>
);

const TelsLogo = ({ height = 22 }) => (
  <svg
    height={height}
    viewBox="0 0 107 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'block' }}
    aria-label="TELS"
  >
    <g clipPath="url(#tels_clip)">
      <path d="M38.3052 4.19954V0.273926H55.1971V4.20024H49.1375V20.276H44.3754V4.19954H38.3052Z" fill="white"/>
      <path d="M56.8535 20.276V0.273926H70.7883V4.20024H61.6837V8.3027H70.076V12.2381H61.6837V16.3497H70.7883V20.276H56.8535Z" fill="white"/>
      <path d="M73.0991 20.276V0.273926H77.9293V16.3497H86.2437V20.276H73.0991Z" fill="white"/>
      <path d="M98.8296 6.26954C98.7644 5.55304 98.4767 4.99515 97.9665 4.59445C97.4556 4.19445 96.7286 3.99445 95.7854 3.99445C95.1609 3.99445 94.6402 4.07585 94.224 4.23866C93.8079 4.40146 93.4956 4.62462 93.2872 4.90743C93.0788 5.19024 92.9714 5.51445 92.9651 5.87936C92.9517 6.17901 93.0121 6.44287 93.1454 6.67024C93.2788 6.89831 93.4738 7.09831 93.7307 7.27024C93.9875 7.44287 94.2984 7.59445 94.6626 7.72427C95.0268 7.8548 95.4366 7.96848 95.8921 8.06603L97.6093 8.4569C98.5981 8.67164 99.4717 8.95796 100.23 9.31655C100.988 9.67445 101.625 10.1004 102.143 10.5951C102.66 11.0899 103.051 11.6597 103.318 12.3046C103.585 12.9488 103.722 13.6716 103.728 14.4723C103.721 15.7355 103.402 16.8197 102.771 17.7243C102.141 18.6288 101.235 19.3222 100.053 19.8043C98.8724 20.2864 97.45 20.5264 95.7847 20.5264C94.1195 20.5264 92.6556 20.2766 91.4128 19.7748C90.17 19.2737 89.2044 18.5116 88.5145 17.4899C87.8247 16.4681 87.4703 15.1755 87.4507 13.6134H92.0759C92.1152 14.2583 92.2872 14.7951 92.5931 15.2246C92.8991 15.6541 93.3202 15.9797 93.857 16.2015C94.3938 16.4225 95.0163 16.5341 95.7258 16.5341C96.3763 16.5341 96.9307 16.4457 97.3896 16.2702C97.8479 16.0941 98.2009 15.8499 98.4486 15.5376C98.6956 15.2253 98.8226 14.8674 98.8289 14.4639C98.8226 14.0864 98.7054 13.7622 98.478 13.492C98.25 13.2218 97.9005 12.9874 97.4289 12.7888C96.9574 12.5902 96.3567 12.4064 95.6282 12.2373L93.5398 11.7495C91.8093 11.3523 90.4465 10.7095 89.4507 9.82041C88.4556 8.93199 87.9609 7.72989 87.9672 6.21199C87.9609 4.9755 88.2921 3.89129 88.9623 2.96006C89.6324 2.02954 90.5595 1.30392 91.7433 0.782518C92.9272 0.261816 94.2767 0.00146484 95.7931 0.00146484C97.3419 0.00146484 98.6865 0.263219 99.8282 0.78743C100.97 1.31164 101.856 2.04568 102.488 2.98954C103.119 3.9341 103.441 5.02673 103.453 6.27094H98.8282L98.8296 6.26954Z" fill="white"/>
      <path d="M27.327 18.9951V19.1593H26.9361V20.2751H26.7431V19.1593H26.3516V18.9951H27.3263H27.327ZM28.5663 20.2751L28.5144 19.5039C28.5088 19.4035 28.5144 19.2807 28.5123 19.1551H28.5024C28.4688 19.2744 28.4309 19.4098 28.393 19.5228L28.1256 20.2589H27.9789L27.7179 19.5039C27.6842 19.4014 27.6526 19.2744 27.6238 19.1551H27.6133C27.6112 19.2786 27.6133 19.3874 27.6077 19.5039L27.5593 20.2751H27.3719L27.4723 18.9951H27.7263L27.9789 19.6898C28.0105 19.7867 28.0351 19.8926 28.0674 20.0119H28.0744C28.1031 19.8926 28.1326 19.7803 28.1642 19.6863L28.4147 18.9944H28.6674L28.7635 20.2744L28.5663 20.2751Z" fill="white"/>
      <path d="M14.8716 0.273163H5.83158C5.83158 0.273163 5.94877 0.296321 6.13333 0.340531C7.34246 0.629654 7.83649 1.81492 7.23439 3.23316L0 20.276H8.32281C10.4112 20.276 12.8232 18.5826 13.7095 16.4942L18.1656 5.99667C19.5074 2.83527 18.0323 0.273163 14.8716 0.273163Z" fill="white"/>
      <path d="M26.2504 0.273193C24.162 0.273193 21.75 1.96653 20.8637 4.05495L14.896 18.1139C14.456 19.1497 13.3606 20.0156 12.2981 20.2269C12.136 20.2592 12.0356 20.276 12.0356 20.276H22.3009C24.3893 20.276 26.8013 18.5827 27.6876 16.4942L33.6553 2.4353C34.0953 1.39951 35.1907 0.533544 36.2532 0.322316C36.4153 0.290035 36.5156 0.273193 36.5156 0.273193H26.2497H26.2504Z" fill="white"/>
      <path d="M104.924 20.2746C104.204 20.2746 103.623 19.6914 103.623 18.9707C103.623 18.25 104.204 17.6689 104.924 17.6689C105.644 17.6689 106.229 18.2486 106.229 18.9707C106.229 19.6928 105.646 20.2746 104.924 20.2746ZM104.924 17.8851C104.324 17.8851 103.839 18.3707 103.839 18.9721C103.839 19.5735 104.324 20.0612 104.924 20.0612C105.525 20.0612 106.013 19.5728 106.013 18.9721C106.013 18.37 105.525 17.8851 104.924 17.8851ZM104.357 18.2914H104.976C105.322 18.2914 105.439 18.5068 105.439 18.6584C105.439 18.8851 105.276 19.0486 105.039 19.0626V19.0696C105.159 19.1118 105.246 19.2325 105.364 19.4205L105.535 19.6921H105.258L105.133 19.4739C104.958 19.1581 104.89 19.0984 104.717 19.0984H104.581V19.6921H104.356L104.357 18.2914ZM104.905 18.9026C105.08 18.9026 105.197 18.8353 105.197 18.6907C105.197 18.5637 105.094 18.483 104.945 18.483H104.581V18.9026H104.905Z" fill="white"/>
    </g>
    <defs>
      <clipPath id="tels_clip">
        <rect width="106.227" height="20.5235" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

const toneColor = (theme, tone) => {
  const m = {
    success: theme.palette.success.main,
    warning: theme.palette.warning.main,
    error: theme.palette.error.main,
    info: theme.palette.info.main,
    default: theme.palette.text.secondary
  };
  return m[tone] || m.default;
};

function getInitials(name) {
  if (!name) return '';
  const paren = /\(([^)]+)\)/.exec(name);
  const base = paren ? paren[1] : name;
  return base
    .split(/\s+/)
    .map((w) => w.replace(/[^A-Za-z]/g, '')[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function assetInfo(item) {
  const t = (item?.title || '').toLowerCase();
  if (t.includes('boiler')) return { name: 'Boiler #2', desc: 'Gas-fired · Mech Room B · installed 2018' };
  if (t.includes('fire panel')) return { name: 'Fire Alarm Panel 3', desc: 'Addressable · Bldg A West Wing' };
  if (t.includes('generator')) return { name: 'Standby Generator', desc: 'Diesel 150kW · Generator Yard' };
  if (t.includes('hvac') || t.includes('recommission')) return { name: 'Unit 214 HVAC', desc: 'Split system · 3 repeat failures / 90d' };
  if (t.includes('filter')) return { name: 'Floor 3 AHU', desc: 'Air handler · quarterly filter PM' };
  if (t.includes('paint') || t.includes('117')) return { name: 'Unit 117', desc: 'Move-in turn · resident-ready prep' };
  return { name: item?.location || 'Asset', desc: 'General maintenance asset' };
}

function formatDur(d) {
  if (!d) return d;
  const h = /^(\d+(?:\.\d+)?)h$/.exec(d.trim());
  const m = /^(\d+)m$/.exec(d.trim());
  let mins;
  if (h) mins = Math.round(parseFloat(h[1]) * 60);
  else if (m) mins = parseInt(m[1], 10);
  else return d;
  const hh = Math.floor(mins / 60);
  const mm = mins % 60;
  if (hh && mm) return `${hh}h ${mm}m`;
  if (hh) return `${hh}h`;
  return `${mm}m`;
}

function TimeLabel({ value, size = 13, color = '#0F172A', weight = 700 }) {
  const m = /^(\d{1,2}:\d{2})\s*(AM|PM)?$/i.exec((value || '').trim());
  const t = m ? m[1] : value;
  const ap = m && m[2] ? m[2].toUpperCase() : '';
  return (
    <Typography
      component="span"
      sx={{ fontSize: size, fontWeight: weight, color, whiteSpace: 'nowrap', lineHeight: 1.2 }}
    >
      {t}
      {ap && (
        <span style={{ color: '#94A3B8', fontWeight: 600, fontSize: size - 1 }}>{ap}</span>
      )}
    </Typography>
  );
}

const NOW_HOUR = 8;

function parseShift(shift) {
  const m = /^(\d+)([ap])–(\d+)([ap])$/i.exec(shift);
  if (!m) return null;
  const to24 = (h, ap) => {
    h = Number(h);
    if (ap.toLowerCase() === 'p' && h !== 12) h += 12;
    if (ap.toLowerCase() === 'a' && h === 12) h = 0;
    return h;
  };
  return { start: to24(m[1], m[2]), end: to24(m[3], m[4]) };
}

function parseTime(t) {
  const m = /^(\d+):(\d+)\s*(AM|PM)$/i.exec(t);
  if (!m) return null;
  let h = Number(m[1]);
  const min = Number(m[2]);
  const ap = m[3].toUpperCase();
  if (ap === 'PM' && h !== 12) h += 12;
  if (ap === 'AM' && h === 12) h = 0;
  return h + min / 60;
}

function parseDur(d) {
  if (!d) return 0;
  let total = 0;
  const h = /(\d+(?:\.\d+)?)\s*h/.exec(d);
  if (h) total += parseFloat(h[1]);
  const m = /(\d+)\s*m/.exec(d);
  if (m) total += parseInt(m[1], 10) / 60;
  return total;
}

function scheduledHours(tasks) {
  return (tasks || [])
    .filter((t) => t.kind !== 'Break')
    .reduce((sum, t) => sum + parseDur(t.dur), 0);
}

function fmtHours(h) {
  return Number.isInteger(h) ? `${h}` : h.toFixed(1);
}

// Derive the capacity status from the real ordered workload so the chip,
// the bar, and the fit-split always agree.
function loadStatus(loadHrs, capacity) {
  if (!capacity) return { label: 'Out today', tone: 'default' };
  if (loadHrs > capacity + 1e-6) return { label: 'Over capacity', tone: 'error' };
  if (loadHrs >= capacity - 0.75) return { label: 'On track', tone: 'info' };
  return { label: 'Has capacity', tone: 'success' };
}

const TONE_RANK = { error: 0, warning: 1, info: 2, default: 3, success: 4 };

function taskPriority(t) {
  if (t.kind === 'Break') return 1.5;
  return TONE_RANK[t.tone] ?? 3;
}

function orderByPriority(tasks) {
  return (tasks || [])
    .map((t, i) => ({ t, i }))
    .sort((a, b) => taskPriority(a.t) - taskPriority(b.t) || a.i - b.i)
    .map((x) => x.t);
}

// Order by priority, then walk the cumulative work clock to flag what
// realistically fits inside the shift capacity (breaks don't count toward work).
function withFit(tasks, capacity) {
  let acc = 0;
  return orderByPriority(tasks).map((t) => {
    const d = t.kind === 'Break' ? 0 : parseDur(t.dur);
    const startAcc = acc;
    acc += d;
    const fits = !capacity || t.kind === 'Break' || startAcc < capacity - 1e-6;
    return { ...t, _fits: fits, _cum: acc };
  });
}

function DayBar({ tasks, capacity }) {
  const cap = capacity || 8;
  const ordered = withFit(tasks, cap);
  const totalWork = ordered.reduce(
    (s, t) => s + (t.kind === 'Break' ? 0 : parseDur(t.dur)),
    0
  );
  const scale = Math.max(cap, totalWork) || 1;
  const capPct = (cap / scale) * 100;
  const toneMap = {
    error: '#DC2626', warning: '#D97706', info: '#0EA5E9',
    success: '#16A34A', default: '#94A3B8'
  };
  const BAR_H = 10;
  const OVERHANG = 8;
  let offset = 0;
  return (
    <Box sx={{ position: 'relative', height: BAR_H + OVERHANG * 2, py: `${OVERHANG}px` }}>
      <Box
        sx={{
          position: 'relative',
          height: BAR_H,
          bgcolor: '#F1F5F9',
          borderRadius: BAR_H / 2,
          overflow: 'hidden'
        }}
      >
        {ordered.map((t, i) => {
          const dur = t.kind === 'Break' ? 0 : parseDur(t.dur);
          if (!dur) return null;
          const left = (offset / scale) * 100;
          const width = (dur / scale) * 100;
          offset += dur;
          const base = toneMap[t.tone] || toneMap.default;
          return (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                top: 0,
                left: `${left}%`,
                width: `${width}%`,
                height: '100%',
                bgcolor: t._fits ? base : 'transparent',
                opacity: t._fits ? 0.9 : 1,
                border: t._fits ? 'none' : '1.5px dashed #DC2626',
                boxSizing: 'border-box'
              }}
            />
          );
        })}
      </Box>
      {capPct < 100 && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${capPct}%`,
            width: 0,
            borderLeft: '2px dotted #0F172A',
            zIndex: 2
          }}
        />
      )}
    </Box>
  );
}

const toneBg = (tone) => {
  const m = {
    success: '#DCFCE7',
    warning: '#FEF3C7',
    error: '#FEE2E2',
    info: '#E0F2FE',
    default: '#E2E8F0'
  };
  return m[tone] || m.default;
};

const TRUST_MODES = [
  { id: 'day1', n: '1', disabled: false },
  { id: 'day30', n: '30', disabled: false },
  { id: 'day90', n: '90', disabled: false }
];

// Compact day-mode control that sits in the status-bar row,
// in place of the device "activity island".
function TrustModeBar({ mode, onMode }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.5}
      sx={{
        bgcolor: 'rgba(255,255,255,0.16)',
        borderRadius: 999,
        pl: 0.875,
        pr: 0.375,
        py: 0.25
      }}
    >
      <Typography
        sx={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.85)', mr: 0.125 }}
      >
        Day:
      </Typography>
      {TRUST_MODES.map((m) => {
        const active = mode === m.id;
        return (
          <Box
            key={m.id}
            role="button"
            aria-disabled={m.disabled}
            onClick={() => !m.disabled && onMode(m.id)}
            sx={{
              minWidth: 22,
              px: 0.625,
              py: 0.125,
              borderRadius: 999,
              textAlign: 'center',
              cursor: m.disabled ? 'default' : 'pointer',
              opacity: m.disabled ? 0.4 : 1,
              bgcolor: active ? '#fff' : 'transparent',
              transition: 'background-color .15s'
            }}
          >
            <Typography
              sx={{
                fontSize: 11.5,
                fontWeight: 700,
                lineHeight: 1.4,
                color: active ? '#004C9A' : '#fff'
              }}
            >
              {m.n}
            </Typography>
          </Box>
        );
      })}
    </Stack>
  );
}

function TopBar({ onNotif, onMenu, onAdd, menuOpen, mode, onMode }) {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: '#004C9A',
        color: '#fff',
        borderBottom: '1px solid rgba(41,48,54,0.15)',
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 1100
      }}
    >
      <Box
        sx={{
          height: 44,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2.5,
          pt: 'env(safe-area-inset-top)'
        }}
      >
        <Typography
          sx={{ fontSize: 15, fontWeight: 700, letterSpacing: 0.2, width: 54 }}
        >
          8:00
        </Typography>
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: 6,
            transform: 'translateX(-50%)'
          }}
        >
          <TrustModeBar mode={mode} onMode={onMode} />
        </Box>
        <Stack direction="row" alignItems="center" spacing={0.625} sx={{ width: 54, justifyContent: 'flex-end' }}>
          <Icon name="signal_cellular_alt" size={16} color="#fff" />
          <Icon name="wifi" size={16} color="#fff" />
          <Icon name="battery_full" size={18} color="#fff" sx={{ transform: 'rotate(90deg)' }} />
        </Stack>
      </Box>
      <Toolbar sx={{ minHeight: 56, px: 1, gap: 1 }}>
        <Box sx={{ flex: 1, minWidth: 0, pl: 1, display: 'flex', alignItems: 'center' }}>
          <TelsLogo height={22} />
        </Box>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <IconButton onClick={onAdd} sx={{ color: '#fff', p: 1.25 }}>
            <Icon name="add" size={24} />
          </IconButton>
          <IconButton onClick={onNotif} sx={{ color: '#fff', p: 1.25 }}>
            <Icon name="notifications" size={24} />
          </IconButton>
          <Box
            onClick={onMenu}
            role="button"
            sx={{
              display: 'flex', alignItems: 'center', gap: 0.5,
              px: 1.25, py: 1, borderRadius: 1, cursor: 'pointer',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }
            }}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size={24} color="#fff" />
            <Typography sx={{ fontWeight: 600, fontSize: 16, color: '#fff', letterSpacing: '-0.18px' }}>
              Menu
            </Typography>
          </Box>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

function ReadinessStrip() {
  return (
    <Box sx={{ px: 1.5, pt: 1.5 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Today’s Operational Readiness
        </Typography>
        <Typography variant="caption">8 metrics</Typography>
      </Stack>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          overflowX: 'auto',
          pb: 1,
          mx: -1.5,
          px: 1.5,
          scrollSnapType: 'x mandatory',
          '&::-webkit-scrollbar': { display: 'none' }
        }}
      >
        {readiness.map((r) => (
          <Card
            key={r.label}
            variant="outlined"
            sx={{
              minWidth: 132, flex: '0 0 auto', scrollSnapAlign: 'start',
              borderColor: '#E2E8F0'
            }}
          >
            <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
              <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.5 }}>
                <Box
                  sx={{
                    width: 22, height: 22, borderRadius: '6px',
                    bgcolor: toneBg(r.tone), display: 'grid', placeItems: 'center'
                  }}
                >
                  <Icon name={r.icon} size={14} color="#0F172A" />
                </Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#475569' }}>
                  {r.label}
                </Typography>
              </Stack>
              <Typography sx={{ fontSize: 20, fontWeight: 700, lineHeight: 1.1 }}>
                {r.value}
                <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>{r.suffix}</span>
              </Typography>
              {typeof r.value === 'number' && r.suffix === '%' && (
                <LinearProgress
                  variant="determinate"
                  value={r.value}
                  sx={{
                    mt: 0.75, height: 4, borderRadius: 4,
                    bgcolor: '#F1F5F9',
                    '& .MuiLinearProgress-bar': { bgcolor: toneBg(r.tone), borderRadius: 4 }
                  }}
                />
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

function AIBanner({ onReview, onAccept }) {
  return (
    <Box sx={{ px: 1.5, pt: 0.5 }}>
      <Alert
        severity="warning"
        icon={<Icon name="auto_awesome" size={20} color="#B45309" />}
        sx={{
          alignItems: 'flex-start',
          borderRadius: 2,
          bgcolor: '#FFFBEB',
          border: '1px solid #FDE68A',
          '.MuiAlert-message': { width: '100%' }
        }}
      >
        <AlertTitle sx={{ fontSize: 14, fontWeight: 700, mb: 0.25 }}>
          {aiBanner.title}
        </AlertTitle>
        <Typography variant="body2" sx={{ color: '#78350F', mb: 1 }}>
          {aiBanner.body}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="contained"
            color="warning"
            onClick={onAccept}
            sx={{ color: '#fff' }}
          >
            Accept
          </Button>
          <Button size="small" variant="outlined" color="warning" onClick={onReview}>
            Review
          </Button>
          <Box sx={{ flex: 1 }} />
          <Chip
            size="small"
            label={aiBanner.confidence}
            sx={{ bgcolor: '#FEF3C7', color: '#92400E', height: 22 }}
          />
        </Stack>
      </Alert>
    </Box>
  );
}

function WeatherCard({ bare }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  const card = (
      <Card variant="outlined" sx={{ borderColor: '#E2E8F0', bgcolor: '#fff' }}>
        <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <Box
              sx={{
                width: 32, height: 32, borderRadius: '10px',
                bgcolor: '#E0F2FE', display: 'grid', placeItems: 'center', flexShrink: 0
              }}
            >
              <Icon name="ac_unit" size={20} color="#0369A1" />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#075985', lineHeight: 1.25 }}>
                {weather.headline}
              </Typography>
              <Typography variant="caption" sx={{ color: '#0C4A6E', display: 'block', lineHeight: 1.2, mt: 0.25 }}>
                {weather.body}
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => setDismissed(true)} sx={{ color: '#0369A1', m: -0.5 }}>
              <Icon name="close" size={18} />
            </IconButton>
          </Stack>
          <Divider sx={{ my: 1, borderColor: '#E2E8F0' }} />
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              size="small"
              variant="outlined"
              startIcon={<Icon name="undo" size={16} color="#0369A1" />}
              sx={{
                color: '#0369A1', borderColor: '#7DD3FC',
                '&:hover': { borderColor: '#0369A1', bgcolor: 'transparent' }
              }}
            >
              Undo elevation
            </Button>
            <Button
              size="small"
              startIcon={<Icon name="add_comment" size={16} color="#0369A1" />}
              sx={{ color: '#0369A1' }}
            >
              Add context
            </Button>
            <Box sx={{ flex: 1 }} />
            <Button
              size="small"
              variant="contained"
              onClick={() => setDismissed(true)}
              sx={{
                bgcolor: '#0369A1', color: '#fff',
                '&:hover': { bgcolor: '#075985' }
              }}
            >
              OK
            </Button>
          </Stack>
        </CardContent>
      </Card>
  );
  if (bare) return card;
  return <Box sx={{ px: 1.5, pt: 1.25 }}>{card}</Box>;
}

function TaskCard({ task, onReason, onReview }) {
  const mode = useMode();
  const day30 = mode === 'day30' || mode === 'day90'; // calibrated (Day 30+)
  const day90 = mode === 'day90'; // predictive operations
  const statusTone =
    task.status === 'At risk' ? 'error'
    : task.status === 'In progress' ? 'info'
    : task.status === 'On track' ? 'success'
    : 'default';
  const coord = task.needsReview
    ? { label: 'Exception', bg: '#FEE2E2', fg: '#B91C1C' }
    : task.elevated
    ? { label: 'Learned pattern', bg: '#EEF2FF', fg: '#4338CA' }
    : { label: 'Auto-coordinated', bg: '#DCFCE7', fg: '#15803D' };
  // Day 30: surface reasoning only for unusual / high-impact items.
  const showReason = day30 ? (task.needsReview || task.elevated) : true;
  return (
    <Card
      variant="outlined"
      sx={{ borderColor: '#A5B4FC', borderWidth: 1.5, bgcolor: '#FCFCFF' }}
    >
      <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
        <Stack direction="row" spacing={1} alignItems="flex-start">
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ lineHeight: 1.25, mb: 0.25 }}>
              {task.title}
            </Typography>
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ color: '#64748B', mb: 0.75 }}>
              <Icon name="place" size={14} color="#94A3B8" />
              <Typography variant="caption">{task.location}</Typography>
              <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: '#CBD5E1' }} />
              <Icon name="person" size={14} color="#94A3B8" />
              <Typography variant="caption">{task.tech}</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
              <Chip
                size="small"
                label={task.status}
                sx={{
                  height: 22, bgcolor: toneBg(statusTone),
                  color: '#0F172A', '.MuiChip-label': { px: 0.875, fontSize: 11 }
                }}
              />
              <Chip
                size="small"
                icon={<Icon name="schedule" size={12} sx={{ ml: 0.5 }} />}
                label={task.eta}
                variant="outlined"
                sx={{ height: 22, '.MuiChip-label': { px: 0.5, fontSize: 11 } }}
              />
              <Chip
                size="small"
                icon={<Icon name="trending_up" size={12} sx={{ ml: 0.5 }} />}
                label={task.kpi}
                variant="outlined"
                sx={{ height: 22, '.MuiChip-label': { px: 0.5, fontSize: 11 } }}
              />
              {day30 && (
                <Chip
                  size="small"
                  label={coord.label}
                  sx={{
                    height: 22, bgcolor: coord.bg, color: coord.fg, fontWeight: 700,
                    '.MuiChip-label': { px: 0.875, fontSize: 11 }
                  }}
                />
              )}
            </Stack>
            {showReason && (
              <Stack
                direction="row"
                spacing={0.5}
                alignItems="flex-start"
                sx={{ mt: 0.75 }}
              >
                {task.elevated && (
                  <Box
                    sx={{
                      display: 'grid', placeItems: 'center',
                      width: 16, height: 16, borderRadius: '5px',
                      bgcolor: '#FEF3C7', flexShrink: 0, mt: '1px'
                    }}
                  >
                    <Icon name="keyboard_double_arrow_up" size={12} color="#B45309" />
                  </Box>
                )}
                <Typography variant="caption" sx={{ color: '#475569' }}>
                  {task.reason}
                </Typography>
              </Stack>
            )}
          </Box>
          <Stack alignItems="flex-end" spacing={0.5}>
            {(!day30 || task.needsReview || task.elevated) && (
              <IconButton
                size="small"
                onClick={() => onReason(task)}
                sx={{
                  bgcolor: '#EEF2FF', color: '#4338CA',
                  '&:hover': { bgcolor: '#E0E7FF' }, width: 32, height: 32
                }}
              >
                <Icon name="psychology" size={18} />
              </IconButton>
            )}
            {task.needsReview && (
              <Chip
                size="small"
                label="Review"
                onClick={() => onReview(task)}
                sx={{ height: 20, bgcolor: '#FEE2E2', color: '#991B1B', fontSize: 10 }}
              />
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function TierSection({ tier, onReason, onReview }) {
  return (
    <Box sx={{ mb: 1.5 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75, px: 0.25 }}>
        <Box
          sx={{
            width: 22, height: 22, borderRadius: '6px',
            bgcolor: toneBg(tier.tone), display: 'grid', placeItems: 'center'
          }}
        >
          <Icon name={tier.icon} size={14} color="#0F172A" />
        </Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, flex: 1 }}>
          {tier.label}
        </Typography>
        <Typography variant="caption">{tier.tasks.length}</Typography>
      </Stack>
      <Stack spacing={1}>
        {tier.tasks.map((t) => (
          <TaskCard key={t.id} task={t} onReason={onReason} onReview={onReview} />
        ))}
      </Stack>
    </Box>
  );
}

function ReviewCard({ item, onApprove, onOverride }) {
  const mode = useMode();
  const day30 = mode === 'day30' || mode === 'day90'; // calibrated (Day 30+)
  const day90 = mode === 'day90'; // predictive operations
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState('');
  const submit = (kind) => {
    setNoteOpen(false);
    setNote('');
    if (kind === 'approve') onApprove(item);
    else onOverride(item);
  };
  const lineSx = {
    display: 'block', fontSize: 12.5, color: '#475569',
    fontWeight: 400, lineHeight: 1.35, mb: 0.5
  };
  const confidenceRow = item.confidence ? (
    <Stack direction="row" spacing={0.5} alignItems="flex-start" sx={{ mt: 0.5, mb: 0.5 }}>
      <Icon name="verified" size={13} color="#475569" sx={{ mt: '2px', flexShrink: 0 }} />
      <Typography variant="caption" sx={{ ...lineSx, mb: 0 }}>
        Confidence: {item.confidence}
      </Typography>
    </Stack>
  ) : null;
  return (
    <Card variant="outlined" sx={{ borderColor: '#E2E8F0' }}>
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mb: 1 }}>
          <Box
            sx={{
              width: 32, height: 32, borderRadius: '10px',
              bgcolor: item.vendor ? '#EDE9FE' : '#FEE2E2',
              display: 'grid', placeItems: 'center', flexShrink: 0
            }}
          >
            <Icon name={item.icon} size={18} color={item.vendor ? '#6D28D9' : '#991B1B'} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap" useFlexGap>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                {item.kind}
              </Typography>
              {day30 && (
                <Chip
                  size="small"
                  icon={item.predictive
                    ? <Icon name="online_prediction" size={10} color="#B45309" sx={{ ml: 0.5 }} />
                    : undefined}
                  label={item.predictive ? 'Predictive · readiness risk' : 'Exception · MD review needed'}
                  sx={{
                    height: 17, fontSize: 9.5, fontWeight: 700,
                    bgcolor: item.predictive ? '#FEF3C7' : '#FEE2E2',
                    color: item.predictive ? '#B45309' : '#B91C1C',
                    '.MuiChip-label': { px: 0.625 }
                  }}
                />
              )}
            </Stack>
            <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
              {item.summary}
            </Typography>
          </Box>
        </Stack>
        <Box
          sx={{
            bgcolor: '#F8FAFC', borderRadius: 1.5, p: 1,
            border: '1px solid #E2E8F0'
          }}
        >
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.25 }}>
            <Icon name="auto_awesome" size={14} color="#4338CA" />
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#4338CA' }}>
              {item.recommendations ? 'AI Recommendations' : 'AI Recommendation'}
            </Typography>
          </Stack>
          {item.recommendations ? (
            <Stack spacing={1} sx={{ mt: 0.5 }}>
              {item.recommendations.map((rec, i) => (
                <Box
                  key={i}
                  sx={{
                    bgcolor: '#fff',
                    border: '1px solid',
                    borderColor: i === 0 ? '#A5B4FC' : '#E2E8F0',
                    borderRadius: 1.5,
                    p: 1
                  }}
                >
                  <Chip
                    size="small"
                    label={rec.label}
                    sx={{
                      height: 18, fontSize: 10, mb: 0.5,
                      bgcolor: i === 0 ? '#EEF2FF' : '#F1F5F9',
                      color: i === 0 ? '#4338CA' : '#475569',
                      '.MuiChip-label': { px: 0.75 }
                    }}
                  />
                  <Typography variant="caption" sx={lineSx}>
                    {rec.body}
                  </Typography>
                  {rec.why && (
                    <Stack direction="row" spacing={0.5} sx={{ mb: 0.5 }}>
                      <Icon name="psychology" size={13} color="#475569" sx={{ mt: '2px', flexShrink: 0 }} />
                      <Typography variant="caption" sx={{ ...lineSx, mb: 0 }}>
                        Why: {rec.why}
                      </Typography>
                    </Stack>
                  )}
                  <Typography variant="caption" sx={{ ...lineSx, mb: 0.75 }}>
                    Tradeoff: {rec.tradeoff}
                  </Typography>
                  <Button
                    size="small"
                    fullWidth
                    variant={i === 0 ? 'contained' : 'outlined'}
                    onClick={() => onApprove(item)}
                  >
                    {i === 0 ? 'Approve recommended' : 'Approve this instead'}
                  </Button>
                </Box>
              ))}
              {confidenceRow}
              <Stack direction="row" spacing={1} sx={{ pt: 0.25 }}>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => onOverride(item)}
                  fullWidth
                >
                  Override
                </Button>
                <IconButton
                  size="small"
                  onClick={() => setNoteOpen((v) => !v)}
                  sx={{
                    border: '1px solid',
                    borderColor: noteOpen ? '#4338CA' : '#CBD5E1',
                    borderRadius: 1.5,
                    bgcolor: noteOpen ? '#EEF2FF' : '#fff',
                    color: noteOpen ? '#4338CA' : 'inherit'
                  }}
                >
                  <Icon name="add_comment" size={18} />
                </IconButton>
              </Stack>
            </Stack>
          ) : (
            <>
              <Typography variant="caption" sx={lineSx}>
                {item.recommended}
              </Typography>
              {item.why && (
                <Stack direction="row" spacing={0.5} sx={{ mb: 0.5 }}>
                  <Icon name="psychology" size={13} color="#475569" sx={{ mt: '2px', flexShrink: 0 }} />
                  <Typography variant="caption" sx={{ ...lineSx, mb: 0 }}>
                    Why: {item.why}
                  </Typography>
                </Stack>
              )}
              <Typography variant="caption" sx={{ ...lineSx, mb: 0 }}>
                Tradeoff: {item.tradeoff}
              </Typography>
              {confidenceRow}
              <Divider sx={{ my: 1 }} />
              <Stack direction="row" spacing={1}>
                <Button size="small" variant="contained" onClick={() => onApprove(item)} fullWidth>
                  Approve
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => onOverride(item)}
                  fullWidth
                >
                  Override
                </Button>
                <IconButton
                  size="small"
                  onClick={() => setNoteOpen((v) => !v)}
                  sx={{
                    border: '1px solid',
                    borderColor: noteOpen ? '#4338CA' : '#CBD5E1',
                    borderRadius: 1.5,
                    bgcolor: noteOpen ? '#EEF2FF' : '#fff',
                    color: noteOpen ? '#4338CA' : 'inherit'
                  }}
                >
                  <Icon name="add_comment" size={18} />
                </IconButton>
              </Stack>
            </>
          )}
          <Collapse in={noteOpen} unmountOnExit>
            <Box sx={{ mt: 1, pt: 1, borderTop: '1px dashed #CBD5E1' }}>
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.75 }}>
                <Icon name="add_comment" size={14} color="#4338CA" />
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#4338CA' }}>
                  Add context for this decision
                </Typography>
              </Stack>
              <TextField
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Apex is booked today — try in-house first, escalate if not cleared by noon."
                multiline
                minRows={2}
                fullWidth
                size="small"
                sx={{ mb: 1, '.MuiInputBase-root': { fontSize: 13, bgcolor: '#fff' } }}
              />
              <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 0.75 }}>
                Apply this note, then decide:
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="contained"
                  fullWidth
                  disabled={!note.trim()}
                  onClick={() => submit('approve')}
                >
                  Approve with note
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  fullWidth
                  disabled={!note.trim()}
                  onClick={() => submit('override')}
                >
                  Override / decline
                </Button>
              </Stack>
            </Box>
          </Collapse>
        </Box>
      </CardContent>
    </Card>
  );
}

function ContextSheet({ open, task, onClose, onResolve }) {
  const [text, setText] = useState('');
  const [stage, setStage] = useState('input');

  React.useEffect(() => {
    if (open) { setText(''); setStage('input'); }
  }, [open]);

  const submit = () => {
    if (!text.trim()) return;
    setStage('thinking');
    setTimeout(() => setStage('response'), 1100);
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        onClick: (e) => e.stopPropagation(),
        sx: {
          borderTopLeftRadius: 20, borderTopRightRadius: 20,
          height: '94vh', display: 'flex', flexDirection: 'column'
        }
      }}
    >
      <Box sx={{ pt: 1, flexShrink: 0 }}>
        <Box sx={{ width: 36, height: 4, bgcolor: '#CBD5E1', mx: 'auto', borderRadius: 2 }} />
      </Box>
      <Box sx={{ px: 2, pt: 1.5, pb: 1, flexShrink: 0 }}>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Avatar sx={{ bgcolor: '#EEF2FF', color: '#4338CA', width: 36, height: 36 }}>
            <Icon name="add_comment" size={18} color="#4338CA" />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              Add context · {task?.title}
            </Typography>
            <Typography variant="subtitle1" sx={{ lineHeight: 1.2 }}>
              Tell the AI what it’s missing
            </Typography>
          </Box>
          <IconButton size="small" onClick={onClose}>
            <Icon name="close" size={20} />
          </IconButton>
        </Stack>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 1 }}>
        {stage === 'input' && (
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Add details the AI couldn’t see — site conditions, resident needs,
            vendor availability, or a constraint. It will reassess the next step.
          </Typography>
        )}
        {stage === 'thinking' && (
          <Stack alignItems="center" spacing={1.5} sx={{ py: 6 }}>
            <CircularProgress size={28} />
            <Typography variant="body2" sx={{ color: '#64748B' }}>
              Reassessing with your context…
            </Typography>
          </Stack>
        )}
        {stage === 'response' && (
          <Stack spacing={1.5}>
            <Card variant="outlined" sx={{ borderColor: '#E2E8F0', bgcolor: '#F8FAFC' }}>
              <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                  YOUR CONTEXT
                </Typography>
                <Typography variant="body2" sx={{ color: '#334155' }}>
                  “{text}”
                </Typography>
              </CardContent>
            </Card>
            <Box
              sx={{
                p: 1.5, borderRadius: 2,
                bgcolor: '#FFFBEB', border: '1px solid #FDE68A'
              }}
            >
              <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.5 }}>
                <Icon name="auto_awesome" size={16} color="#B45309" />
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#92400E' }}>
                  Updated recommendation
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: '#78350F', mb: 1 }}>
                Given that, I’d <b>hold the in-house assignment</b> and dispatch
                Apex Mechanical for {task?.title || 'this task'}, then re-sequence
                Jacob’s afternoon PM to tomorrow. This protects the move-in window
                without overloading the team.
              </Typography>
              <Typography variant="caption" sx={{ color: '#92400E' }}>
                Confidence: Medium · based on the constraint you added.
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
              Your call — this overrides the original plan.
            </Typography>
          </Stack>
        )}
      </Box>

      <Box
        sx={{
          flexShrink: 0, borderTop: '1px solid #E2E8F0',
          p: 2, pb: 'calc(env(safe-area-inset-bottom) + 16px)'
        }}
      >
        {stage === 'input' && (
          <Stack spacing={1}>
            <TextField
              autoFocus
              multiline
              minRows={2}
              maxRows={4}
              fullWidth
              placeholder="e.g. Apex confirmed a 2-hr response; in-house tech is out sick after lunch…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              size="small"
            />
            <Button
              fullWidth
              variant="contained"
              disabled={!text.trim()}
              onClick={submit}
              startIcon={<Icon name="send" size={16} color="#fff" />}
              sx={{ color: '#fff' }}
            >
              Send to AI
            </Button>
          </Stack>
        )}
        {stage === 'thinking' && (
          <Button fullWidth variant="outlined" disabled>
            Working…
          </Button>
        )}
        {stage === 'response' && (
          <Stack direction="row" spacing={1}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setStage('input')}
            >
              Revise context
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={() => onResolve('accepted')}
              startIcon={<Icon name="check" size={16} color="#fff" />}
              sx={{ color: '#fff' }}
            >
              Accept & apply
            </Button>
          </Stack>
        )}
      </Box>
    </Drawer>
  );
}

function ReasoningSheet({ open, task, onClose, onFeedback }) {
  const [contextOpen, setContextOpen] = useState(false);
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 20, borderTopRightRadius: 20,
          maxHeight: '85vh', pb: 'env(safe-area-inset-bottom)'
        }
      }}
    >
      <Box sx={{ pt: 1 }}>
        <Box sx={{ width: 36, height: 4, bgcolor: '#CBD5E1', mx: 'auto', borderRadius: 2 }} />
      </Box>
      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
          <Avatar sx={{ bgcolor: '#EEF2FF', color: '#4338CA', width: 36, height: 36 }}>
            <Icon name="psychology" size={20} color="#4338CA" />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              AI Reasoning
            </Typography>
            <Typography variant="subtitle1" sx={{ lineHeight: 1.2 }}>
              {task?.title}
            </Typography>
          </Box>
          <IconButton size="small" onClick={onClose}>
            <Icon name="close" size={20} />
          </IconButton>
        </Stack>

        <Stack spacing={1.25}>
          <ReasonRow
            icon="flag"
            label="Why prioritized"
            body={task?.reason}
            tone="warning"
          />
          <ReasonRow
            icon="trending_up"
            label="KPI impact"
            body={`Primary: ${task?.kpi}. Secondary: Resident Satisfaction.`}
            tone="info"
          />
          <ReasonRow
            icon="balance"
            label="Tradeoff made"
            body="Deferred a Low PM by 24 hrs to free Jacob’s afternoon capacity for unit-turn risk."
            tone="default"
          />
          <ReasonRow
            icon="psychology_alt"
            label="Decision type"
            body="Learned pattern · Similar move-in risk last month resolved by HVAC-first sequencing."
            tone="success"
          />
        </Stack>

        <Divider sx={{ my: 1.75 }} />

        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
          Was this the right call?
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 0.75 }}>
          <Button
            fullWidth
            size="small"
            variant="contained"
            color="success"
            startIcon={<Icon name="thumb_up" size={16} color="#fff" />}
            onClick={() => onFeedback('agree')}
            sx={{ color: '#fff' }}
          >
            Agree
          </Button>
          <Button
            fullWidth
            size="small"
            variant="outlined"
            color="error"
            startIcon={<Icon name="thumb_down" size={16} />}
            onClick={() => onFeedback('disagree')}
          >
            Disagree
          </Button>
          <Button
            fullWidth
            size="small"
            variant="outlined"
            startIcon={<Icon name="add_comment" size={16} />}
            onClick={() => setContextOpen(true)}
          >
            Context
          </Button>
        </Stack>
      </Box>
      <ContextSheet
        open={contextOpen}
        task={task}
        onClose={() => setContextOpen(false)}
        onResolve={(result) => {
          setContextOpen(false);
          onFeedback('context');
        }}
      />
    </Drawer>
  );
}

function ReasonRow({ icon, label, body, tone }) {
  return (
    <Stack direction="row" spacing={1.25}>
      <Box
        sx={{
          width: 28, height: 28, borderRadius: '8px',
          bgcolor: toneBg(tone), display: 'grid', placeItems: 'center', flexShrink: 0
        }}
      >
        <Icon name={icon} size={16} color="#0F172A" />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
          {label}
        </Typography>
        <Typography variant="body2">{body}</Typography>
      </Box>
    </Stack>
  );
}

function OverrideSheet({ open, item, onClose, onChoose }) {
  const subject = item?.kind || item?.title || 'this recommendation';
  const rec =
    item?.recommendations ? item.recommendations[0]?.body
    : item?.recommended || item?.reason || null;
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 20, borderTopRightRadius: 20,
          pb: 'env(safe-area-inset-bottom)'
        }
      }}
    >
      <Box sx={{ pt: 1 }}>
        <Box sx={{ width: 36, height: 4, bgcolor: '#CBD5E1', mx: 'auto', borderRadius: 2 }} />
      </Box>
      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <Avatar sx={{ bgcolor: '#FEF3C7', color: '#92400E', width: 36, height: 36 }}>
            <Icon name="model_training" size={20} color="#92400E" />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ lineHeight: 1.2 }}>Override recorded</Typography>
            <Typography variant="caption">{subject}</Typography>
          </Box>
          <IconButton size="small" onClick={onClose} sx={{ color: '#64748B', m: -0.5 }}>
            <Icon name="close" size={20} />
          </IconButton>
        </Stack>
        {rec && (
          <Box
            sx={{
              bgcolor: '#F8FAFC', border: '1px solid #E2E8F0',
              borderRadius: 1.5, p: 1, mb: 1.5
            }}
          >
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block' }}>
              AI had recommended
            </Typography>
            <Typography variant="body2" sx={{ fontSize: 12.5, textDecoration: 'line-through', color: '#94A3B8' }}>
              {rec}
            </Typography>
          </Box>
        )}
        <Typography variant="body2" sx={{ color: '#475569', mb: 1.5 }}>
          You overrode the AI’s call here. Should I treat this as a one-time
          exception or remember it as a rule for similar situations?
        </Typography>
        <Stack spacing={1}>
          <Button
            variant="contained"
            onClick={() => onChoose('remember')}
            startIcon={<Icon name="bookmark_add" size={18} color="#fff" />}
          >
            Remember rule
          </Button>
          <Button variant="outlined" onClick={() => onChoose('once')}>
            One-time only
          </Button>
          <Button
            variant="text"
            onClick={() => onChoose('context')}
            startIcon={<Icon name="add_comment" size={18} />}
          >
            Add context
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
}

function CalibrationButton({ onClick }) {
  return (
    <Card
      variant="outlined"
      onClick={onClick}
      sx={{ borderColor: '#A5B4FC', bgcolor: '#FCFCFF', mb: 1.5, cursor: 'pointer' }}
    >
      <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Box
            sx={{
              width: 32, height: 32, borderRadius: '10px',
              bgcolor: '#EEF2FF', display: 'grid', placeItems: 'center', flexShrink: 0
            }}
          >
            <Icon name="verified_user" size={18} color="#4338CA" />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="caption" sx={{ color: '#4338CA', fontWeight: 700, display: 'block' }}>
              30-Day Calibration Report
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              {calibration.acceptance}% accepted · tuned to Cedar Ridge
            </Typography>
          </Box>
          <Icon name="chevron_right" size={20} color="#94A3B8" />
        </Stack>
      </CardContent>
    </Card>
  );
}

// Day 30 — "Operationally Calibrated" state banner.
function Day30Banner({ onReview }) {
  return (
    <Card variant="outlined" sx={{ borderColor: '#A5B4FC', bgcolor: '#FCFCFF', mb: 1.5 }}>
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Stack direction="row" spacing={1.25} alignItems="flex-start">
          <Box
            sx={{
              width: 34, height: 34, borderRadius: '10px', bgcolor: '#EEF2FF',
              display: 'grid', placeItems: 'center', flexShrink: 0
            }}
          >
            <Icon name="verified_user" size={19} color="#4338CA" />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap" useFlexGap>
              <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {day30Status.headline}
              </Typography>
              <Chip
                size="small"
                label="Day 30 · Calibrated"
                sx={{
                  height: 17, fontSize: 9.5, fontWeight: 700, bgcolor: '#EEF2FF', color: '#4338CA',
                  '.MuiChip-label': { px: 0.625 }
                }}
              />
            </Stack>
            <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 0.25, lineHeight: 1.35 }}>
              {day30Status.sub}
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.75, mt: 1.25 }}>
          {day30Status.metrics.map((m) => (
            <Box key={m.label} sx={{ border: '1px solid #E2E8F0', borderRadius: 1.5, p: 0.875, bgcolor: '#fff' }}>
              <Typography sx={{ fontSize: 17, fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
                {m.value}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', color: '#475569', lineHeight: 1.2, mt: 0.25 }}>
                {m.label}
              </Typography>
            </Box>
          ))}
        </Box>

        <Stack spacing={0.5} sx={{ mt: 1 }}>
          {day30Status.capabilities.map((c) => (
            <Stack key={c} direction="row" spacing={0.625} alignItems="center">
              <Icon name="check_circle" size={14} color="#16A34A" sx={{ flexShrink: 0 }} />
              <Typography variant="caption" sx={{ color: '#334155', fontWeight: 600 }}>
                {c}
              </Typography>
            </Stack>
          ))}
        </Stack>

        <Box
          sx={{
            mt: 1.25, p: 1.25, borderRadius: 1.5,
            bgcolor: '#EEF2FF', border: '1px solid #C7D2FE'
          }}
        >
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.5 }}>
            <Icon name="arrow_circle_up" size={14} color="#4338CA" />
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#4338CA' }}>
              Recommended next step
            </Typography>
          </Stack>
          <Typography variant="caption" sx={{ display: 'block', color: '#0F172A', fontWeight: 600, lineHeight: 1.35 }}>
            {day30Status.nextStep.action}
          </Typography>
          <Stack spacing={0.375} sx={{ mt: 0.625 }}>
            {day30Status.nextStep.because.map((b) => (
              <Stack key={b} direction="row" spacing={0.5} alignItems="flex-start">
                <Icon name="check_circle" size={12} color="#16A34A" sx={{ mt: '2px', flexShrink: 0 }} />
                <Typography variant="caption" sx={{ color: '#475569', lineHeight: 1.3 }}>
                  {b}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>

        <Button
          fullWidth
          variant="outlined"
          onClick={onReview}
          startIcon={<Icon name="tune" size={16} />}
          sx={{ mt: 1.25, borderColor: '#CBD5E1', color: '#334155' }}
        >
          Review Coordination Settings
        </Button>
        <Typography
          variant="caption"
          sx={{ display: 'block', textAlign: 'center', color: '#94A3B8', mt: 0.625, lineHeight: 1.3 }}
        >
          You can adjust or revert coordination settings at any time.
        </Typography>
      </CardContent>
    </Card>
  );
}

// Day 90 — "Predictive Operations Mode" banner.
function Day90Banner({ onReview }) {
  return (
    <Card variant="outlined" sx={{ borderColor: '#A5B4FC', bgcolor: '#FCFCFF', mb: 1.5 }}>
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Stack direction="row" spacing={1.25} alignItems="flex-start">
          <Box
            sx={{
              width: 34, height: 34, borderRadius: '10px', bgcolor: '#EEF2FF',
              display: 'grid', placeItems: 'center', flexShrink: 0
            }}
          >
            <Icon name="online_prediction" size={19} color="#4338CA" />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mb: 0.25 }}>
              <Chip
                size="small"
                label="Day 90 · Insights available"
                sx={{
                  height: 17, fontSize: 9.5, fontWeight: 700, bgcolor: '#EEF2FF', color: '#4338CA',
                  '.MuiChip-label': { px: 0.625 }
                }}
              />
            </Stack>
            <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
              {day90Status.headline}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 0.25, lineHeight: 1.35 }}>
              {day90Status.sub}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="flex-start" sx={{ mt: 0.5 }}>
              <Icon name="info" size={12} color="#94A3B8" sx={{ mt: '2px', flexShrink: 0 }} />
              <Typography variant="caption" sx={{ color: '#94A3B8', fontStyle: 'italic', lineHeight: 1.3 }}>
                {day90Status.context}
              </Typography>
            </Stack>
          </Box>
        </Stack>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.75, mt: 1.25 }}>
          {day90Status.metrics.map((m) => (
            <Box
              key={m.label}
              sx={{
                border: '1px solid #E2E8F0', borderRadius: 1.5, p: 0.875, bgcolor: '#fff',
                gridColumn: m.wide ? '1 / -1' : 'auto'
              }}
            >
              <Typography sx={{ fontSize: 17, fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
                {m.value}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', color: '#475569', lineHeight: 1.2, mt: 0.25 }}>
                {m.label}
              </Typography>
            </Box>
          ))}
        </Box>

        <Stack spacing={0.5} sx={{ mt: 1 }}>
          {day90Status.capabilities.map((c) => (
            <Stack key={c} direction="row" spacing={0.625} alignItems="center">
              <Icon name="check_circle" size={14} color="#16A34A" sx={{ flexShrink: 0 }} />
              <Typography variant="caption" sx={{ color: '#334155', fontWeight: 600 }}>
                {c}
              </Typography>
            </Stack>
          ))}
        </Stack>

        <Box
          sx={{
            mt: 1.25, p: 1.25, borderRadius: 1.5,
            bgcolor: '#EEF2FF', border: '1px solid #C7D2FE'
          }}
        >
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.625 }}>
            <Icon name="online_prediction" size={14} color="#4338CA" />
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#4338CA' }}>
              Emerging operational patterns
            </Typography>
          </Stack>
          <Stack spacing={0.625}>
            {day90Status.outlook.map((o) => (
              <Stack key={o.id} direction="row" spacing={0.625} alignItems="flex-start">
                <Box
                  sx={{
                    width: 20, height: 20, borderRadius: '6px', bgcolor: '#fff',
                    border: '1px solid #C7D2FE', display: 'grid', placeItems: 'center', flexShrink: 0, mt: '1px'
                  }}
                >
                  <Icon name={o.icon} size={12} color="#4338CA" />
                </Box>
                <Typography variant="caption" sx={{ color: '#0F172A', lineHeight: 1.35 }}>
                  {o.body}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>

        <Button
          fullWidth
          variant="outlined"
          onClick={onReview}
          startIcon={<Icon name="insights" size={16} />}
          sx={{ mt: 1.25, borderColor: '#CBD5E1', color: '#334155' }}
        >
          Explore Operational Forecasting
        </Button>
        <Typography
          variant="caption"
          sx={{ display: 'block', textAlign: 'center', color: '#94A3B8', mt: 0.625, lineHeight: 1.3 }}
        >
          Forecasting suggestions can be adjusted or dismissed at any time — Connected Community will continue learning operational rhythms.
        </Typography>
      </CardContent>
    </Card>
  );
}

function Sparkline({ series, height = 64, color = '#4338CA', fill = true }) {
  const width = 280;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;
  const stepX = width / (series.length - 1);
  const pad = 5;
  const pts = series.map((v, i) => [
    i * stepX,
    height - ((v - min) / span) * (height - pad * 2) - pad
  ]);
  const line = pts
    .map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`)
    .join(' ');
  const area = `${line} L${width},${height} L0,${height} Z`;
  const last = pts[pts.length - 1];
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      preserveAspectRatio="none"
      style={{ display: 'block' }}
    >
      {fill && <path d={area} fill={color} opacity={0.1} />}
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={last[0]} cy={last[1]} r={3.5} fill={color} />
    </svg>
  );
}

// GitHub-style day grid — each square is a day; fill = activity that day.
function DayGrid({ days, color = '#16A34A', cols = 15, size = 7, gap = 3, fluid = false }) {
  const op = [0, 0.3, 0.6, 1];
  if (fluid) {
    // Single horizontal row that fills the available width.
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${days.length}, 1fr)`,
          gap: `${gap}px`,
          width: '100%'
        }}
      >
        {days.map((d, i) => (
          <Box
            key={i}
            sx={{
              aspectRatio: '1 / 1',
              borderRadius: '2px',
              bgcolor: d ? color : '#E5E7EB',
              opacity: d ? op[d] : 1
            }}
          />
        ))}
      </Box>
    );
  }
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, ${size}px)`,
        gap: `${gap}px`,
        justifyContent: 'start'
      }}
    >
      {days.map((d, i) => (
        <Box
          key={i}
          sx={{
            width: size,
            height: size,
            borderRadius: '2px',
            bgcolor: d ? color : '#E5E7EB',
            opacity: d ? op[d] : 1
          }}
        />
      ))}
    </Box>
  );
}

function Bars({ series, color = '#16A34A', height = 96 }) {
  const max = Math.max(...series, 1);
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '5px', height }}>
      {series.map((v, i) => (
        <Box
          key={i}
          sx={{
            flex: 1,
            height: `${Math.max(6, (v / max) * height)}px`,
            bgcolor: color,
            opacity: 0.35 + 0.65 * (i / (series.length - 1)),
            borderRadius: '3px 3px 0 0'
          }}
        />
      ))}
    </Box>
  );
}

function StatDetailSheet({ stat, onClose }) {
  const tone = stat
    ? ({ success: '#16A34A', info: '#0EA5E9', warning: '#D97706' }[stat.tone] || '#4338CA')
    : '#4338CA';
  return (
    <Drawer
      anchor="bottom"
      open={Boolean(stat)}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 20, borderTopRightRadius: 20,
          pb: 'env(safe-area-inset-bottom)'
        }
      }}
    >
      <Box sx={{ pt: 1 }}>
        <Box sx={{ width: 36, height: 4, bgcolor: '#CBD5E1', mx: 'auto', borderRadius: 2 }} />
      </Box>
      {stat && (
        <Box sx={{ p: 2 }}>
          <Stack direction="row" spacing={1.25} alignItems="flex-start" sx={{ mb: 1.5 }}>
            <Box
              sx={{
                width: 34, height: 34, borderRadius: '10px',
                bgcolor: '#EEF2FF', display: 'grid', placeItems: 'center', flexShrink: 0
              }}
            >
              <Icon name={stat.icon} size={18} color="#4338CA" />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {stat.label}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>
                30-day trend · {calibration.rangeStart} → {calibration.rangeEnd}
              </Typography>
            </Box>
            <IconButton size="small" onClick={onClose}>
              <Icon name="close" size={20} />
            </IconButton>
          </Stack>

          <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mb: 1 }}>
            <Typography sx={{ fontSize: 30, fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
              {stat.value}
            </Typography>
            <Chip
              size="small"
              icon={<Icon name="trending_up" size={13} sx={{ ml: 0.5 }} />}
              label={`from ${stat.start}${stat.unit} on ${calibration.rangeStart}`}
              sx={{
                height: 22, bgcolor: '#DCFCE7', color: '#15803D', fontWeight: 700,
                '.MuiChip-label': { px: 0.75, fontSize: 11 }
              }}
            />
          </Stack>

          {(() => {
            const isPct = stat.unit === '%';
            const lo = isPct ? Math.min(...stat.series) : 0;
            const hi = Math.max(...stat.series);
            const mid = (lo + hi) / 2;
            const fmt = (v) =>
              `${Number.isInteger(v) ? v : v.toFixed(0)}${stat.unit}`;
            const CHART_H = 96;
            return (
              <Box sx={{ border: '1px solid #E2E8F0', borderRadius: 2, p: 1.5, bgcolor: '#FCFCFF' }}>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block', mb: 1 }}>
                  {isPct ? '30-day trend' : 'Cumulative · last 30 days'}
                </Typography>
                <Stack direction="row" spacing={0.75}>
                  <Stack
                    justifyContent="space-between"
                    sx={{ height: CHART_H, width: 30, flexShrink: 0, textAlign: 'right' }}
                  >
                    {[hi, mid, lo].map((v, i) => (
                      <Typography
                        key={i}
                        variant="caption"
                        sx={{ color: '#94A3B8', fontSize: 10, lineHeight: 1 }}
                      >
                        {fmt(v)}
                      </Typography>
                    ))}
                  </Stack>
                  <Box sx={{ flex: 1, position: 'relative', height: CHART_H }}>
                    {[0, 0.5, 1].map((g) => (
                      <Box
                        key={g}
                        sx={{
                          position: 'absolute', left: 0, right: 0,
                          top: `${g * 100}%`,
                          borderTop: '1px dashed #E2E8F0'
                        }}
                      />
                    ))}
                    <Box sx={{ position: 'absolute', inset: 0 }}>
                      {isPct ? (
                        <Sparkline series={stat.series} color={tone} height={CHART_H} />
                      ) : (
                        <Bars series={stat.series} color={tone} height={CHART_H} />
                      )}
                    </Box>
                  </Box>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ mt: 1, pl: '38px' }}>
                  <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                    {calibration.rangeStart} · 30 days ago
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#0F172A', fontWeight: 700 }}>
                    {calibration.rangeEnd} · today
                  </Typography>
                </Stack>
              </Box>
            );
          })()}

          <Typography variant="caption" sx={{ display: 'block', color: '#475569', lineHeight: 1.4, mt: 1.25 }}>
            {stat.detail}
          </Typography>
        </Box>
      )}
    </Drawer>
  );
}

function CalibrationSheet({ open, onClose }) {
  const [selStat, setSelStat] = useState(null);
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 20, borderTopRightRadius: 20,
          height: 'calc(100dvh - 100px - env(safe-area-inset-top))',
          maxHeight: 'none',
          display: 'flex', flexDirection: 'column',
          pb: 'env(safe-area-inset-bottom)'
        }
      }}
    >
      <Box sx={{ pt: 1 }}>
        <Box sx={{ width: 36, height: 4, bgcolor: '#CBD5E1', mx: 'auto', borderRadius: 2 }} />
      </Box>
      <Box sx={{ p: 2, pb: 1 }}>
        <Stack direction="row" spacing={1.25} alignItems="flex-start">
          <Box
            sx={{
              width: 36, height: 36, borderRadius: '10px',
              bgcolor: '#EEF2FF', display: 'grid', placeItems: 'center', flexShrink: 0
            }}
          >
            <Icon name="verified_user" size={20} color="#4338CA" />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="caption" sx={{ color: '#4338CA', fontWeight: 700 }}>
              30-Day Calibration Report
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {calibration.headline}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              {calibration.sub}
            </Typography>
          </Box>
          <IconButton size="small" onClick={onClose}>
            <Icon name="close" size={20} />
          </IconButton>
        </Stack>
      </Box>
      <Box sx={{ px: 2, pb: 2, overflowY: 'auto', flex: 1, minHeight: 0 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.75 }}>
          {calibration.stats.map((s) => (
            <Box
              key={s.label}
              role="button"
              onClick={() => setSelStat(s)}
              sx={{
                border: '1px solid #E2E8F0', borderRadius: 1.5, p: 1,
                bgcolor: '#FCFCFF', cursor: 'pointer',
                transition: 'border-color .15s',
                '&:hover': { borderColor: '#A5B4FC' }
              }}
            >
              <Stack direction="row" spacing={0.5} alignItems="flex-start" sx={{ mb: 0.5 }}>
                <Icon name={s.icon} size={13} color="#475569" sx={{ mt: '1px' }} />
                <Typography variant="caption" sx={{ color: '#475569', fontWeight: 700, flex: 1, lineHeight: 1.2 }}>
                  {s.label}
                </Typography>
                <Icon name="chevron_right" size={15} color="#94A3B8" />
              </Stack>
              <Typography sx={{ fontSize: 19, fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
                {s.value}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: 10.5 }}>
                {s.trend}
              </Typography>
            </Box>
          ))}
        </Box>
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1.75, mb: 0.75 }}>
          <Icon name="pattern" size={15} color="#4338CA" />
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#4338CA' }}>
            Patterns the AI learned about your building
          </Typography>
        </Stack>
        <Stack spacing={0.75}>
          {calibration.patterns.map((p, i) => (
            <Stack key={i} direction="row" spacing={0.625} alignItems="flex-start">
              <Icon name="check_circle" size={14} color="#16A34A" sx={{ mt: '2px', flexShrink: 0 }} />
              <Typography variant="caption" sx={{ color: '#475569', lineHeight: 1.35 }}>
                {p}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>
      <StatDetailSheet stat={selStat} onClose={() => setSelStat(null)} />
    </Drawer>
  );
}

const FORECAST_TONE = {
  warning: { fg: '#D97706', tint: '#FEF3C7' },
  error: { fg: '#DC2626', tint: '#FEE2E2' },
  info: { fg: '#0EA5E9', tint: '#E0F2FE' },
  success: { fg: '#16A34A', tint: '#DCFCE7' }
};

// Predictive operational-intelligence card (Day 90).
function ForecastCard({ item }) {
  const t = FORECAST_TONE[item.tone] || { fg: '#4338CA', tint: '#EEF2FF' };
  return (
    <Card variant="outlined" sx={{ borderColor: '#E2E8F0', borderLeft: `3px solid ${t.fg}` }}>
      <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
        <Stack direction="row" spacing={1} alignItems="flex-start">
          <Box
            sx={{
              width: 28, height: 28, borderRadius: '8px', bgcolor: t.tint,
              display: 'grid', placeItems: 'center', flexShrink: 0
            }}
          >
            <Icon name={item.icon} size={16} color={t.fg} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mb: 0.25 }}>
              <Chip
                size="small"
                icon={<Icon name="insights" size={10} color={t.fg} sx={{ ml: 0.5 }} />}
                label={item.kind}
                sx={{
                  height: 17, fontSize: 9.5, fontWeight: 700, bgcolor: t.tint, color: t.fg,
                  '.MuiChip-label': { px: 0.5 }
                }}
              />
              <Stack direction="row" spacing={0.375} alignItems="center">
                <Icon name="schedule" size={11} color="#94A3B8" />
                <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600 }}>
                  {item.window}
                </Typography>
              </Stack>
            </Stack>
            <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
              {item.title}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mt: 0.25, color: '#475569', lineHeight: 1.35 }}>
              {item.body}
            </Typography>
            <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mt: 0.625 }}>
              <Chip
                size="small"
                label={item.metric}
                sx={{
                  height: 18, fontSize: 10, fontWeight: 700, bgcolor: '#0F172A', color: '#fff',
                  '.MuiChip-label': { px: 0.625 }
                }}
              />
              <Stack direction="row" spacing={0.375} alignItems="center">
                <Icon name="verified" size={12} color="#16A34A" />
                <Typography variant="caption" sx={{ color: '#475569' }}>
                  Confidence: {item.confidence}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

// Day 90 lead section — predictive operational intelligence.
function OperationalForecast() {
  return (
    <Box sx={{ mb: 1.75 }}>
      <Stack direction="row" spacing={0.625} alignItems="flex-start" sx={{ mb: 1 }}>
        <Icon name="online_prediction" size={16} color="#4338CA" sx={{ mt: '2px' }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Operational Forecast
          </Typography>
          <Typography variant="caption">
            Predictive readiness — {forecasts.length} signals the AI is tracking ahead
          </Typography>
        </Box>
      </Stack>
      <Stack spacing={1}>
        {forecasts.map((f) => (
          <ForecastCard key={f.id} item={f} />
        ))}
      </Stack>

      <Card variant="outlined" sx={{ borderColor: '#A5B4FC', bgcolor: '#FCFCFF', mt: 1 }}>
        <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.875 }}>
            <Icon name="insights" size={14} color="#4338CA" />
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#4338CA' }}>
              Predictive insights
            </Typography>
          </Stack>
          <Stack spacing={1}>
            {predictiveInsights.map((p) => (
              <Stack key={p.id} direction="row" spacing={0.75} alignItems="flex-start">
                <Box
                  sx={{
                    width: 22, height: 22, borderRadius: '6px', bgcolor: '#EEF2FF',
                    display: 'grid', placeItems: 'center', flexShrink: 0, mt: '1px'
                  }}
                >
                  <Icon name={p.icon} size={13} color="#4338CA" />
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Chip
                    size="small"
                    label={p.label}
                    sx={{
                      height: 16, fontSize: 9, fontWeight: 700, bgcolor: '#EEF2FF', color: '#4338CA',
                      '.MuiChip-label': { px: 0.5 }, mb: 0.25
                    }}
                  />
                  <Typography variant="caption" sx={{ display: 'block', color: '#475569', lineHeight: 1.35 }}>
                    {p.body}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ borderColor: '#E2E8F0', mt: 1 }}>
        <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', display: 'block', mb: 0.75 }}>
            AI-generated forecast work · {predictiveWorkOrders.length}
          </Typography>
          <Stack spacing={1} divider={<Divider flexItem sx={{ borderColor: '#F1F5F9' }} />}>
            {predictiveWorkOrders.map((w) => (
              <Box key={w.id}>
                <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mb: 0.25 }}>
                  <Chip
                    size="small"
                    label={w.kind}
                    sx={{
                      height: 17, fontSize: 9.5, fontWeight: 700, bgcolor: '#EEF2FF', color: '#4338CA',
                      '.MuiChip-label': { px: 0.5 }
                    }}
                  />
                  <Chip
                    size="small"
                    label={w.status}
                    sx={{
                      height: 17, fontSize: 9.5, fontWeight: 700, bgcolor: '#F1F5F9', color: '#475569',
                      '.MuiChip-label': { px: 0.5 }
                    }}
                  />
                </Stack>
                <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
                  {w.title}
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.25, color: '#64748B' }}>
                  <Icon name="place" size={12} color="#94A3B8" />
                  <Typography variant="caption">{w.location}</Typography>
                  <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: '#CBD5E1' }} />
                  <Icon name="person" size={12} color="#94A3B8" />
                  <Typography variant="caption">{w.assignee}</Typography>
                  <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: '#CBD5E1' }} />
                  <Icon name="schedule" size={12} color="#94A3B8" />
                  <Typography variant="caption">{w.eta}</Typography>
                </Stack>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

// Day 1 — "Learning your building" status banner.
function Day1Banner({ onMetric }) {
  return (
    <Card variant="outlined" sx={{ borderColor: '#A5B4FC', bgcolor: '#FCFCFF', mb: 1.5 }}>
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Stack direction="row" spacing={1.25} alignItems="flex-start">
          <Box
            sx={{
              width: 34, height: 34, borderRadius: '10px', bgcolor: '#EEF2FF',
              display: 'grid', placeItems: 'center', flexShrink: 0
            }}
          >
            <Icon name="school" size={19} color="#4338CA" />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap" useFlexGap>
              <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {day1Status.headline}
              </Typography>
              <Chip
                size="small"
                label="Day 1 · Learning"
                sx={{
                  height: 17, fontSize: 9.5, fontWeight: 700, bgcolor: '#EEF2FF', color: '#4338CA',
                  '.MuiChip-label': { px: 0.625 }
                }}
              />
            </Stack>
            <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 0.25, lineHeight: 1.35 }}>
              {day1Status.sub}
            </Typography>
          </Box>
        </Stack>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0.75, mt: 1.25 }}>
          {day1Status.metrics.map((m) => (
            <Box
              key={m.label}
              onClick={() => onMetric && onMetric(m.key)}
              sx={{
                border: '1px solid #E2E8F0', borderRadius: 1.5, p: 0.875, bgcolor: '#fff',
                cursor: onMetric ? 'pointer' : 'default',
                transition: 'transform 80ms, border-color 80ms, box-shadow 80ms',
                position: 'relative',
                '&:hover': onMetric ? {
                  borderColor: '#A5B4FC',
                  boxShadow: '0 1px 3px rgba(67,56,202,0.12)'
                } : {},
                '&:active': onMetric ? { transform: 'scale(0.98)' } : {}
              }}
            >
              <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
                  {m.value}
                </Typography>
                {onMetric && (
                  <Icon name="chevron_right" size={14} color="#CBD5E1" />
                )}
              </Stack>
              <Typography variant="caption" sx={{ display: 'block', color: '#475569', lineHeight: 1.2, mt: 0.25 }}>
                {m.label}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: 10 }}>
                {m.sub}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

// Drawer that opens when a Day 1 banner metric tile is tapped. Shows the
// history behind that metric with per-item "respond / add context" actions.
function Day1MetricSheet({ open, metricKey, onClose, onRespond }) {
  const data = metricKey ? day1MetricDetails[metricKey] : null;
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 20, borderTopRightRadius: 20,
          maxHeight: '92vh', pb: 'env(safe-area-inset-bottom)'
        }
      }}
    >
      <Box sx={{ pt: 1 }}>
        <Box sx={{ width: 36, height: 4, bgcolor: '#CBD5E1', mx: 'auto', borderRadius: 2 }} />
      </Box>
      {data && (
        <>
          <Box sx={{ px: 2, pt: 1.5, pb: 1.5, borderBottom: '1px solid #E2E8F0' }}>
            <Stack direction="row" spacing={1.25} alignItems="flex-start">
              <Box
                sx={{
                  width: 36, height: 36, borderRadius: '10px', flexShrink: 0,
                  bgcolor: '#EEF2FF', display: 'grid', placeItems: 'center'
                }}
              >
                <Icon name={data.icon} size={20} color={data.color} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  {data.title}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', display: 'block', lineHeight: 1.35, mt: 0.25 }}>
                  {data.sub}
                </Typography>
              </Box>
              <IconButton size="small" onClick={onClose}>
                <Icon name="close" size={20} color="#64748B" />
              </IconButton>
            </Stack>
          </Box>
          <Box sx={{ p: 1.5, overflowY: 'auto' }}>
            <Stack spacing={1.25}>
              {data.items.map((it) => (
                <Card key={it.id} variant="outlined" sx={{ borderColor: '#E2E8F0' }}>
                  <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
                    <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600, display: 'block', mb: 0.25 }}>
                      {it.when}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
                      {it.title}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', color: '#475569', lineHeight: 1.35, mt: 0.375 }}>
                      {it.body}
                    </Typography>
                    {it.why && (
                      <Stack direction="row" spacing={0.5} alignItems="flex-start" sx={{ mt: 0.625 }}>
                        <Icon name="psychology" size={13} color="#4338CA" sx={{ mt: '1px', flexShrink: 0 }} />
                        <Typography variant="caption" sx={{ color: '#4338CA', lineHeight: 1.3, fontWeight: 600 }}>
                          {it.why}
                        </Typography>
                      </Stack>
                    )}
                    {it.outcome && (
                      <Box sx={{ mt: 0.625, p: 0.875, bgcolor: '#F8FAFC', borderRadius: 1.25, border: '1px solid #E2E8F0' }}>
                        <Stack direction="row" spacing={0.5} alignItems="flex-start">
                          <Icon name="model_training" size={13} color="#64748B" sx={{ mt: '1px', flexShrink: 0 }} />
                          <Typography variant="caption" sx={{ color: '#475569', lineHeight: 1.3 }}>
                            <Box component="span" sx={{ fontWeight: 700 }}>What the AI learned: </Box>
                            {it.outcome}
                          </Typography>
                        </Stack>
                      </Box>
                    )}
                    <Stack direction="row" spacing={0.75} sx={{ mt: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Icon name="add_comment" size={14} />}
                        onClick={() => onRespond && onRespond({ metric: metricKey, item: it, kind: 'context' })}
                        sx={{ flex: 1, textTransform: 'none', fontSize: 12 }}
                      >
                        Add context
                      </Button>
                      {metricKey === 'patterns' ? (
                        <>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => onRespond && onRespond({ metric: metricKey, item: it, kind: 'confirm' })}
                            sx={{ flex: 1, textTransform: 'none', fontSize: 12 }}
                          >
                            Confirm pattern
                          </Button>
                          <Button
                            size="small"
                            color="inherit"
                            onClick={() => onRespond && onRespond({ metric: metricKey, item: it, kind: 'dismiss' })}
                            sx={{ minWidth: 0, textTransform: 'none', fontSize: 12, color: '#64748B' }}
                          >
                            Dismiss
                          </Button>
                        </>
                      ) : metricKey === 'overrides' ? (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => onRespond && onRespond({ metric: metricKey, item: it, kind: 'reinforce' })}
                          sx={{ flex: 1, textTransform: 'none', fontSize: 12 }}
                        >
                          Reinforce rule
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => onRespond && onRespond({ metric: metricKey, item: it, kind: 'revisit' })}
                          sx={{ flex: 1, textTransform: 'none', fontSize: 12 }}
                        >
                          Revisit
                        </Button>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        </>
      )}
    </Drawer>
  );
}

// Day 1 — recommendation-framed work card with visible reasoning + approvals.
function Day1WorkCard({ task, tier, tierNum, onReason, onApprove, onOverride }) {
  const v = WO_STATUS_VISUAL[task.status] || { icon: 'build', fg: '#475569', bg: '#F1F5F9' };
  const isCritical = tierNum === 1;
  const isRoutine = tier.id === 't5';
  const primaryLabel = isCritical ? 'Assign now' : isRoutine ? 'Approve batch' : 'Approve';
  const secondaryLabel = isRoutine ? 'Defer' : 'Override';
  return (
    <Card variant="outlined" sx={{ borderColor: '#E2E8F0' }}>
      <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
        <Stack direction="row" spacing={1.25} alignItems="flex-start">
          <Box
            sx={{
              width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
              bgcolor: v.bg, display: 'grid', placeItems: 'center', mt: 0.25
            }}
          >
            <Icon name={v.icon} size={18} color={v.fg} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ lineHeight: 1.25 }}>{task.title}</Typography>
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.25, color: '#64748B' }}>
              <Icon name="place" size={13} color="#94A3B8" />
              <Typography variant="caption">{task.location}</Typography>
              <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: '#CBD5E1' }} />
              <Icon name="person" size={13} color="#94A3B8" />
              <Typography variant="caption">{task.tech}</Typography>
            </Stack>
          </Box>
        </Stack>
        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 0.75 }}>
          <Chip
            size="small"
            label={`Tier ${tierNum}`}
            sx={{
              height: 22, bgcolor: toneBg(tier.tone), color: '#0F172A', fontWeight: 700,
              '.MuiChip-label': { px: 0.875, fontSize: 11 }
            }}
          />
          <Chip
            size="small"
            label={task.status}
            sx={{ height: 22, bgcolor: v.bg, color: v.fg, fontWeight: 700, '.MuiChip-label': { px: 0.875, fontSize: 11 } }}
          />
          <Chip
            size="small"
            icon={<Icon name="schedule" size={12} sx={{ ml: 0.5 }} />}
            label={task.eta}
            variant="outlined"
            sx={{ height: 22, '.MuiChip-label': { px: 0.5, fontSize: 11 } }}
          />
          <Chip
            size="small"
            icon={<Icon name="trending_up" size={12} sx={{ ml: 0.5 }} />}
            label={task.kpi}
            variant="outlined"
            sx={{ height: 22, '.MuiChip-label': { px: 0.5, fontSize: 11 } }}
          />
        </Stack>

        <Box sx={{ bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 1.5, p: 1, mt: 0.875 }}>
          <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mb: 0.375 }}>
            <Icon name="auto_awesome" size={13} color="#4338CA" />
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#4338CA' }}>
              AI recommends
            </Typography>
            {task.needsReview && (
              <Chip
                size="small"
                label="Needs MD review"
                sx={{
                  height: 16, fontSize: 9, fontWeight: 700, bgcolor: '#FEE2E2', color: '#B91C1C',
                  '.MuiChip-label': { px: 0.5 }
                }}
              />
            )}
          </Stack>
          <Typography variant="caption" sx={{ display: 'block', color: '#475569', lineHeight: 1.35 }}>
            {task.recommend}
          </Typography>
          <Stack direction="row" spacing={0.5} alignItems="flex-start" sx={{ mt: 0.5 }}>
            <Icon name="model_training" size={13} color="#64748B" sx={{ mt: '1px', flexShrink: 0 }} />
            <Typography variant="caption" sx={{ color: '#475569', lineHeight: 1.3 }}>
              <Box component="span" sx={{ fontWeight: 700 }}>Confidence: </Box>
              {task.confidence}
            </Typography>
          </Stack>
          <Button
            size="small"
            onClick={() => onReason(task)}
            startIcon={<Icon name="psychology" size={14} />}
            sx={{ mt: 0.25, ml: -0.5, px: 0.5, fontSize: 11.5, color: '#4338CA' }}
          >
            Why this priority?
          </Button>
        </Box>

        <Stack direction="row" spacing={0.75} sx={{ mt: 0.875 }}>
          <Button size="small" variant="contained" fullWidth onClick={() => onApprove(task)}>
            {primaryLabel}
          </Button>
          <Button size="small" variant="outlined" color="error" fullWidth onClick={() => onOverride(task)}>
            {secondaryLabel}
          </Button>
          <IconButton
            size="small"
            onClick={() => onReason(task)}
            sx={{ border: '1px solid #CBD5E1', borderRadius: 1.5, bgcolor: '#fff' }}
          >
            <Icon name="add_comment" size={18} />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
}

function Day1DispatchPlan({ onReason, onApprove, onOverride }) {
  return (
    <>
      {tiers.map((tier, ti) => (
        <Box key={tier.id} sx={{ mb: 1.5 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75, px: 0.25 }}>
            <Box
              sx={{
                width: 22, height: 22, borderRadius: '6px',
                bgcolor: toneBg(tier.tone), display: 'grid', placeItems: 'center'
              }}
            >
              <Icon name={tier.icon} size={14} color="#0F172A" />
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, flex: 1 }}>
              {tier.label}
            </Typography>
            <Typography variant="caption">{tier.tasks.length}</Typography>
          </Stack>
          <Stack spacing={1}>
            {tier.tasks.map((t) => (
              <Day1WorkCard
                key={t.id}
                task={t}
                tier={tier}
                tierNum={ti + 1}
                onReason={onReason}
                onApprove={onApprove}
                onOverride={onOverride}
              />
            ))}
          </Stack>
        </Box>
      ))}
    </>
  );
}

function LearningSignals() {
  return (
    <Box>
      <Stack direction="row" spacing={0.625} alignItems="flex-start" sx={{ mb: 1 }}>
        <Icon name="model_training" size={16} color="#4338CA" sx={{ mt: '2px' }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Learning signals</Typography>
          <Typography variant="caption">
            Early observations — the AI is still calibrating to your building
          </Typography>
        </Box>
      </Stack>
      <Stack spacing={1}>
        {learningSignals.map((s) => (
          <Card key={s.id} variant="outlined" sx={{ borderColor: '#E2E8F0' }}>
            <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <Box
                  sx={{
                    width: 28, height: 28, borderRadius: '8px', bgcolor: '#EEF2FF',
                    display: 'grid', placeItems: 'center', flexShrink: 0
                  }}
                >
                  <Icon name={s.icon} size={15} color="#4338CA" />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mb: 0.125 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
                      {s.title}
                    </Typography>
                    <Chip
                      size="small"
                      label="Learning"
                      sx={{
                        height: 16, fontSize: 9, fontWeight: 700, bgcolor: '#EEF2FF', color: '#4338CA',
                        '.MuiChip-label': { px: 0.5 }
                      }}
                    />
                  </Stack>
                  <Typography variant="caption" sx={{ color: '#475569', lineHeight: 1.35 }}>
                    {s.body}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Calm-mode sections — operational readiness framing (replaces task lists)
// ─────────────────────────────────────────────────────────────────────

function SectionHeader({ icon, title, sub, color = '#4338CA' }) {
  return (
    <Stack direction="row" spacing={0.625} alignItems="flex-start" sx={{ mb: 1 }}>
      <Icon name={icon} size={16} color={color} sx={{ mt: '2px' }} />
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{title}</Typography>
        {sub && (
          <Typography variant="caption" sx={{ display: 'block', lineHeight: 1.3 }}>
            {sub}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}

function OperationalPriorityCard({ item, onApprove, onOverride, onReason }) {
  const bg = toneBg(item.tone);
  return (
    <Card variant="outlined" sx={{ borderColor: '#E2E8F0' }}>
      <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
        <Stack direction="row" spacing={1.25} alignItems="flex-start">
          <Box
            sx={{
              width: 32, height: 32, borderRadius: '10px', flexShrink: 0,
              bgcolor: bg, display: 'grid', placeItems: 'center'
            }}
          >
            <Icon name={item.icon} size={18} color="#0F172A" />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
              {item.title}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', color: '#475569', lineHeight: 1.35, mt: 0.25 }}>
              {item.body}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mt: 0.625 }}>
              <Chip
                size="small"
                label={item.impact}
                sx={{
                  height: 18, fontSize: 10, fontWeight: 700,
                  bgcolor: '#F1F5F9', color: '#475569',
                  '.MuiChip-label': { px: 0.75 }
                }}
              />
              {item.action && (
                <Chip
                  size="small"
                  icon={<Icon name="auto_awesome" size={11} sx={{ ml: 0.5 }} />}
                  label={`AI: ${item.action}`}
                  sx={{
                    height: 18, fontSize: 10, fontWeight: 700,
                    bgcolor: '#EEF2FF', color: '#4338CA',
                    '.MuiChip-label': { px: 0.625 }
                  }}
                />
              )}
            </Stack>
          </Box>
        </Stack>
        <Stack direction="row" spacing={0.75} sx={{ mt: 1 }}>
          <Button size="small" variant="contained" fullWidth onClick={() => onApprove && onApprove(item)}>
            {item.approveLabel || 'Approve'}
          </Button>
          <Button size="small" variant="outlined" color="inherit" fullWidth onClick={() => onOverride && onOverride(item)}>
            Override
          </Button>
          {onReason && (
            <IconButton
              size="small"
              onClick={() => onReason(item)}
              sx={{ border: '1px solid #CBD5E1', borderRadius: 1.5, bgcolor: '#fff' }}
            >
              <Icon name="psychology" size={18} />
            </IconButton>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

function StaffingConflictCard({ item, onApprove, onOverride }) {
  return (
    <Card variant="outlined" sx={{ borderColor: '#FCD34D', bgcolor: '#FFFBEB' }}>
      <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
        <Stack direction="row" spacing={1.25} alignItems="flex-start">
          <Box
            sx={{
              width: 30, height: 30, borderRadius: '10px', flexShrink: 0,
              bgcolor: '#FEF3C7', display: 'grid', placeItems: 'center'
            }}
          >
            <Icon name={item.icon} size={17} color="#B45309" />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
              {item.title}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', color: '#475569', lineHeight: 1.35, mt: 0.25 }}>
              {item.body}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="flex-start" sx={{ mt: 0.5 }}>
              <Icon name="auto_awesome" size={13} color="#4338CA" sx={{ mt: '1px', flexShrink: 0 }} />
              <Typography variant="caption" sx={{ color: '#4338CA', fontWeight: 600, lineHeight: 1.3 }}>
                {item.hint}
              </Typography>
            </Stack>
          </Box>
        </Stack>
        <Stack direction="row" spacing={0.75} sx={{ mt: 1 }}>
          <Button size="small" variant="contained" fullWidth onClick={() => onApprove && onApprove(item)}>
            Approve reassignment
          </Button>
          <Button size="small" variant="outlined" color="inherit" fullWidth onClick={() => onOverride && onOverride(item)}>
            Keep as-is
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

function PmTradeoffCard({ item, onApprove, onOverride }) {
  return (
    <Card variant="outlined" sx={{ borderColor: '#E2E8F0' }}>
      <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
        <Stack direction="row" spacing={1.25} alignItems="flex-start">
          <Box
            sx={{
              width: 30, height: 30, borderRadius: '10px', flexShrink: 0,
              bgcolor: '#F1F5F9', display: 'grid', placeItems: 'center'
            }}
          >
            <Icon name={item.icon} size={17} color="#475569" />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
              {item.title}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', color: '#475569', lineHeight: 1.35, mt: 0.25 }}>
              {item.body}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="flex-start" sx={{ mt: 0.5 }}>
              <Icon name="auto_awesome" size={13} color="#4338CA" sx={{ mt: '1px', flexShrink: 0 }} />
              <Typography variant="caption" sx={{ color: '#4338CA', fontWeight: 600, lineHeight: 1.3 }}>
                {item.hint}
              </Typography>
            </Stack>
          </Box>
        </Stack>
        <Stack direction="row" spacing={0.75} sx={{ mt: 1 }}>
          <Button size="small" variant="contained" fullWidth onClick={() => onApprove && onApprove(item)}>
            Approve defer
          </Button>
          <Button size="small" variant="outlined" color="inherit" fullWidth onClick={() => onOverride && onOverride(item)}>
            Keep today
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

function LearningHighlightCard({ item }) {
  return (
    <Card variant="outlined" sx={{ borderColor: '#E0E7FF', bgcolor: '#FCFCFF' }}>
      <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
        <Stack direction="row" spacing={1.25} alignItems="flex-start">
          <Box
            sx={{
              width: 30, height: 30, borderRadius: '10px', flexShrink: 0,
              bgcolor: '#EEF2FF', display: 'grid', placeItems: 'center'
            }}
          >
            <Icon name={item.icon} size={17} color="#4338CA" />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap" useFlexGap>
              <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
                {item.title}
              </Typography>
              <Chip
                size="small"
                label="Learning"
                sx={{
                  height: 16, fontSize: 9, fontWeight: 700, bgcolor: '#EEF2FF', color: '#4338CA',
                  '.MuiChip-label': { px: 0.5 }
                }}
              />
            </Stack>
            <Typography variant="caption" sx={{ display: 'block', color: '#475569', lineHeight: 1.35, mt: 0.25 }}>
              {item.body}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function RoutineRollupCard({ data }) {
  const [open, setOpen] = useState(false);
  const total = data.items.reduce((s, x) => s + x.count, 0);
  return (
    <Card variant="outlined" sx={{ borderColor: '#E2E8F0', bgcolor: '#F8FAFC' }}>
      <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ cursor: 'pointer' }}
          onClick={() => setOpen(!open)}
        >
          <Box
            sx={{
              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
              bgcolor: '#DCFCE7', display: 'grid', placeItems: 'center'
            }}
          >
            <Icon name="check_circle" size={16} color="#16A34A" />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, color: '#0F172A', lineHeight: 1.25 }}>
              {data.headline}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              +{total} actions handled automatically · tap for details
            </Typography>
          </Box>
          <Icon name={open ? 'expand_less' : 'expand_more'} size={20} color="#94A3B8" />
        </Stack>
        <Collapse in={open}>
          <Stack spacing={0.5} sx={{ mt: 1, pl: 4.5 }}>
            {data.items.map((it, i) => (
              <Stack key={i} direction="row" spacing={0.75} alignItems="center">
                <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#94A3B8' }} />
                <Typography variant="caption" sx={{ color: '#475569' }}>
                  <Box component="span" sx={{ fontWeight: 700, color: '#0F172A' }}>+{it.count}</Box>{' '}{it.label}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Collapse>
      </CardContent>
    </Card>
  );
}

function ReadinessSummaryRow({ item }) {
  const fg = item.tone === 'success' ? '#16A34A' : item.tone === 'warning' ? '#B45309' : '#0369A1';
  const bg = item.tone === 'success' ? '#DCFCE7' : item.tone === 'warning' ? '#FEF3C7' : '#E0F2FE';
  return (
    <Card variant="outlined" sx={{ borderColor: '#E2E8F0' }}>
      <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
        <Stack direction="row" spacing={1.25} alignItems="flex-start">
          <Box
            sx={{
              width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
              bgcolor: bg, display: 'grid', placeItems: 'center'
            }}
          >
            <Icon name={item.icon} size={17} color={fg} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
              {item.title}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', color: '#475569', lineHeight: 1.35, mt: 0.25 }}>
              {item.body}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function StrategicRiskCard({ item }) {
  return (
    <Card variant="outlined" sx={{ borderColor: '#A5B4FC', bgcolor: '#FCFCFF' }}>
      <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
        <Stack direction="row" spacing={1.25} alignItems="flex-start">
          <Box
            sx={{
              width: 32, height: 32, borderRadius: '10px', flexShrink: 0,
              bgcolor: '#EEF2FF', display: 'grid', placeItems: 'center'
            }}
          >
            <Icon name={item.icon} size={18} color="#4338CA" />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mb: 0.25 }}>
              <Chip
                size="small"
                label={item.label}
                sx={{
                  height: 17, fontSize: 9.5, fontWeight: 700, bgcolor: '#EEF2FF', color: '#4338CA',
                  '.MuiChip-label': { px: 0.625 }
                }}
              />
              <Chip
                size="small"
                label={item.horizon}
                sx={{
                  height: 17, fontSize: 9.5, fontWeight: 700, bgcolor: '#F1F5F9', color: '#475569',
                  '.MuiChip-label': { px: 0.625 }
                }}
              />
            </Stack>
            <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
              {item.title}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', color: '#475569', lineHeight: 1.35, mt: 0.25 }}>
              {item.body}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function TodayTab({ openReason, openOverride, onApprove, onPriorities, onCalibration, onDay1Metric }) {
  const mode = useMode();
  const day1 = mode === 'day1';
  const day30 = mode === 'day30';
  const day90 = mode === 'day90';
  const calibrated = day30 || day90;

  // Reviews shown shrink with maturity. Day 1 shows full set, Day 30 only
  // genuine exceptions (cap 2), Day 90 only true anomalies (cap 1).
  const exceptions = (() => {
    if (day90) {
      const predictive = predictiveReviews.slice(0, 1);
      return predictive.length ? predictive : reviews.filter((r) => r.kind === 'Services Recommendation').slice(0, 1);
    }
    if (day30) {
      const nonStaffing = reviews.filter((r) => r.kind !== 'Staffing overload');
      return [...nonStaffing, ...predictiveReviews].slice(0, 2);
    }
    return reviews;
  })();

  return (
    <>
      <Box sx={{ px: 1.5, pt: 2 }}>
        {/* Maturity banner */}
        {day1 && <Day1Banner onMetric={onDay1Metric} />}
        {day30 && <Day30Banner onReview={onCalibration} />}
        {day90 && <Day90Banner onReview={onCalibration} />}

        {/* ── DAY 1 ───────────────────────────────────────────────── */}
        {day1 && (
          <>
            <SectionHeader
              icon="how_to_reg"
              title="Needs your approval"
              sub="Decisions the AI surfaced for your sign-off — you're supervising"
              color="#B91C1C"
            />
            <Stack spacing={1.25} sx={{ mb: 1.75 }}>
              <WeatherCard bare />
              {reviews.map((r) => (
                <ReviewCard
                  key={r.id}
                  item={r}
                  onApprove={onApprove}
                  onOverride={openOverride}
                />
              ))}
            </Stack>

            <SectionHeader
              icon="priority_high"
              title="Operational priorities"
              sub="Top operational items — review the AI's suggested action, then approve or override"
            />
            <Stack spacing={1} sx={{ mb: 1.75 }}>
              {operationalPriorities.map((p) => (
                <OperationalPriorityCard
                  key={p.id}
                  item={p}
                  onApprove={onApprove}
                  onOverride={openOverride}
                  onReason={openReason}
                />
              ))}
            </Stack>

            <SectionHeader icon="group" title="Staffing" sub="One conflict worth a decision today" />
            <Box sx={{ mb: 1.75 }}>
              <StaffingConflictCard
                item={day1StaffingConflict}
                onApprove={onApprove}
                onOverride={openOverride}
              />
            </Box>

            <SectionHeader icon="event_repeat" title="PM tradeoff" sub="One deferrable item the AI flagged" />
            <Box sx={{ mb: 1.75 }}>
              <PmTradeoffCard
                item={day1PmTradeoff}
                onApprove={onApprove}
                onOverride={openOverride}
              />
            </Box>

            <SectionHeader icon="model_training" title="Learning signal" sub="An early pattern — still calibrating, no action needed yet" />
            <Box sx={{ mb: 1.75 }}>
              <LearningHighlightCard item={day1LearningHighlight} />
            </Box>

            <Box sx={{ mb: 0.5 }}>
              <RoutineRollupCard data={routineRollup.day1} />
            </Box>
          </>
        )}

        {/* ── DAY 30 ──────────────────────────────────────────────── */}
        {day30 && (
          <>
            <SectionHeader
              icon="dashboard"
              title="Today's operational state"
              sub="Grouped readiness summaries — routine work runs in the background"
            />
            <Stack spacing={1} sx={{ mb: 1.75 }}>
              {day30Readiness.map((r) => (
                <ReadinessSummaryRow key={r.id} item={r} />
              ))}
            </Stack>

            <SectionHeader
              icon="report_problem"
              title="Exceptions requiring review"
              sub={`${exceptions.length} item${exceptions.length === 1 ? '' : 's'} the AI escalated — everything else is handled`}
              color="#B91C1C"
            />
            <Stack spacing={1.25} sx={{ mb: 1.5 }}>
              <WeatherCard bare />
              {exceptions.map((r) => (
                <ReviewCard
                  key={r.id}
                  item={r}
                  onApprove={onApprove}
                  onOverride={openOverride}
                />
              ))}
            </Stack>

            <Box sx={{ mb: 0.5 }}>
              <RoutineRollupCard data={routineRollup.day30} />
            </Box>
          </>
        )}

        {/* ── DAY 90 ──────────────────────────────────────────────── */}
        {day90 && (
          <>
            <SectionHeader
              icon="monitor_heart"
              title="Operational health"
              sub="Readiness and risk — what changed, what's trending"
            />
            <Stack spacing={1} sx={{ mb: 1.75 }}>
              {day90Health.map((h) => (
                <ReadinessSummaryRow key={h.id} item={h} />
              ))}
            </Stack>

            {strategicRisks.length > 0 && (
              <>
                <SectionHeader
                  icon="online_prediction"
                  title="Strategic risk"
                  sub="One anomaly the AI thinks you should personally weigh"
                />
                <Stack spacing={1} sx={{ mb: 1.75 }}>
                  {strategicRisks.slice(0, 1).map((s) => (
                    <StrategicRiskCard key={s.id} item={s} />
                  ))}
                </Stack>
              </>
            )}

            {exceptions.length > 0 && (
              <>
                <SectionHeader
                  icon="report_problem"
                  title="Exception"
                  sub="One decision the AI escalated — everything else is handled"
                  color="#B91C1C"
                />
                <Stack spacing={1.25} sx={{ mb: 1.5 }}>
                  {exceptions.map((r) => (
                    <ReviewCard
                      key={r.id}
                      item={r}
                      onApprove={onApprove}
                      onOverride={openOverride}
                    />
                  ))}
                </Stack>
              </>
            )}

            <Box sx={{ mb: 0.5 }}>
              <RoutineRollupCard data={routineRollup.day90} />
            </Box>
          </>
        )}
      </Box>
    </>
  );
}

function ReviewsTab({ openOverride }) {
  return (
    <Box sx={{ px: 1.5, pt: 1.5 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
Needs Your Review
          </Typography>
          <Typography variant="caption">
            Decisions the AI escalated for your sign-off
          </Typography>
        </Box>
        <Chip
          size="small"
          label={`${reviews.length} open`}
          sx={{ bgcolor: '#FEE2E2', color: '#991B1B' }}
        />
      </Stack>
      <Stack spacing={1.25}>
        {reviews.map((r) => (
          <ReviewCard
            key={r.id}
            item={r}
            onApprove={openOverride}
            onOverride={openOverride}
          />
        ))}
      </Stack>
    </Box>
  );
}

function KPIsTab() {
  return (
    <Box sx={{ px: 1.5, pt: 1.5 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
        KPI Trajectory
      </Typography>
      <Stack spacing={1}>
        {readiness.filter((r) => r.suffix === '%').map((r) => (
          <Card key={r.label} variant="outlined">
            <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{
                    width: 28, height: 28, borderRadius: '8px',
                    bgcolor: toneBg(r.tone), display: 'grid', placeItems: 'center'
                  }}
                >
                  <Icon name={r.icon} size={16} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {r.label}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={r.value}
                    sx={{
                      mt: 0.5, height: 6, borderRadius: 4, bgcolor: '#F1F5F9',
                      '& .MuiLinearProgress-bar': { bgcolor: toneBg(r.tone) }
                    }}
                  />
                </Box>
                <Typography sx={{ fontWeight: 700 }}>
                  {r.value}%
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}

function QueueTab({ openReason, openOverride }) {
  const flat = useMemo(
    () => tiers.flatMap((t) => t.tasks.map((task) => ({ ...task, tier: t.label }))),
    []
  );
  return (
    <Box sx={{ px: 1.5, pt: 1.5 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
        Full Queue · {flat.length} items
      </Typography>
      <Stack spacing={1}>
        {flat.map((t) => (
          <TaskCard key={t.id} task={t} onReason={openReason} onReview={openOverride} />
        ))}
      </Stack>
    </Box>
  );
}

function TagChip({ label }) {
  const map = {
    Regulatory: 'verified_user',
    Logs: 'assignment',
    Maintenance: 'build',
    'Requires Doc': 'description'
  };
  return (
    <Chip
      size="small"
      icon={<Icon name={map[label] || 'label'} size={12} sx={{ ml: 0.5 }} />}
      label={label}
      variant="outlined"
      sx={{
        height: 22, borderColor: '#CBD5E1', color: '#475569',
        '.MuiChip-label': { px: 0.625, fontSize: 11 }
      }}
    />
  );
}

function TaskListRow({ task }) {
  const overdue = task.status === 'overdue';
  const completed = task.status === 'completed';
  const skipped = task.status === 'skipped';
  const visual = completed
    ? { icon: 'check_circle', fg: '#16A34A', bg: '#DCFCE7' }
    : skipped
      ? { icon: 'warning', fg: '#B45309', bg: '#FEF3C7' }
      : overdue
        ? { icon: 'error', fg: '#DC2626', bg: '#FEE2E2' }
        : { icon: 'schedule', fg: '#0369A1', bg: '#E0F2FE' };
  return (
    <Card variant="outlined" sx={{ borderColor: '#E2E8F0' }}>
      <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
        <Stack direction="row" spacing={1.25} alignItems="flex-start">
          <Box
            sx={{
              width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
              bgcolor: visual.bg, display: 'grid', placeItems: 'center', mt: 0.25
            }}
          >
            <Icon name={visual.icon} size={18} color={visual.fg} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block' }}>
              {task.category}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600, lineHeight: 1.25,
                color: overdue ? '#DC2626' : (completed || skipped) ? '#94A3B8' : '#0F172A',
                textDecoration: completed ? 'line-through' : 'none',
                textDecorationColor: '#CBD5E1'
              }}
            >
              {task.title}
            </Typography>
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.25 }}>
              <Typography
                variant="caption"
                sx={{ color: overdue ? '#DC2626' : '#64748B', fontWeight: overdue ? 700 : 500 }}
              >
                {task.due}
              </Typography>
              <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: '#CBD5E1' }} />
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>{task.cadence}</Typography>
            </Stack>
            {task.note && (
              <Typography variant="caption" sx={{ display: 'block', color: '#94A3B8', mt: 0.25 }}>
                {task.note}
              </Typography>
            )}
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.75 }}>
              <Icon name="person" size={14} color="#94A3B8" />
              <Typography variant="caption" sx={{ color: task.assignee ? '#475569' : '#94A3B8' }}>
                {task.assignee || 'Unassigned'}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 0.75 }}>
              {task.tags.map((t) => <TagChip key={t} label={t} />)}
            </Stack>
          </Box>
          <Icon name="chevron_right" size={20} color="#94A3B8" />
        </Stack>
      </CardContent>
    </Card>
  );
}

function TasksView() {
  const [showCompleted, setShowCompleted] = useState(false);
  const [showSkipped, setShowSkipped] = useState(false);
  const overdue = tasksList.filter((t) => t.status === 'overdue');
  const upcoming = tasksList.filter((t) => t.status === 'open');
  const skipped = tasksList.filter((t) => t.status === 'skipped');
  const completed = tasksList.filter((t) => t.status === 'completed');
  const open = [...overdue, ...upcoming];
  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Tasks due this month
          </Typography>
          <Typography variant="caption">
            PM & regulatory · {open.length} open
          </Typography>
        </Box>
        <Chip
          size="small"
          label={`${overdue.length} overdue`}
          sx={{ bgcolor: '#FEE2E2', color: '#991B1B' }}
        />
      </Stack>

      <Card variant="outlined" sx={{ borderColor: '#FDE68A', mb: 1, bgcolor: '#FFFBEB' }}>
        <CardContent
          sx={{ p: 1.25, '&:last-child': { pb: 1.25 }, cursor: 'pointer' }}
          onClick={() => setShowSkipped((v) => !v)}
        >
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Box
              sx={{
                width: 28, height: 28, borderRadius: '50%',
                bgcolor: '#FEF3C7', display: 'grid', placeItems: 'center'
              }}
            >
              <Icon name="warning" size={16} color="#B45309" />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                Skipped
              </Typography>
              <Typography variant="caption">
                {skipped.length} skipped — may still be overdue
              </Typography>
            </Box>
            <Icon
              name={showSkipped ? 'expand_less' : 'expand_more'}
              size={22}
              color="#92400E"
            />
          </Stack>
          <Collapse in={showSkipped}>
            <Stack spacing={1} sx={{ mt: 1.25 }}>
              {skipped.map((t) => <TaskListRow key={t.id} task={t} />)}
            </Stack>
          </Collapse>
        </CardContent>
      </Card>

      <Card
        variant="outlined"
        sx={{ borderColor: '#E2E8F0', mb: 1.5, bgcolor: '#F8FAFC' }}
      >
        <CardContent
          sx={{ p: 1.25, '&:last-child': { pb: 1.25 }, cursor: 'pointer' }}
          onClick={() => setShowCompleted((v) => !v)}
        >
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Box
              sx={{
                width: 28, height: 28, borderRadius: '50%',
                bgcolor: '#DCFCE7', display: 'grid', placeItems: 'center'
              }}
            >
              <Icon name="check_circle" size={16} color="#16A34A" />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                Completed
              </Typography>
              <Typography variant="caption">
                {completed.length} done this month
              </Typography>
            </Box>
            <Icon
              name={showCompleted ? 'expand_less' : 'expand_more'}
              size={22}
              color="#64748B"
            />
          </Stack>
          <Collapse in={showCompleted}>
            <Stack spacing={1} sx={{ mt: 1.25 }}>
              {completed.map((t) => <TaskListRow key={t.id} task={t} />)}
            </Stack>
          </Collapse>
        </CardContent>
      </Card>

      {overdue.length > 0 && (
        <>
          <Typography variant="caption" sx={{ color: '#991B1B', fontWeight: 700, display: 'block', mb: 0.75 }}>
            OVERDUE · {overdue.length}
          </Typography>
          <Stack spacing={1} sx={{ mb: 1.5 }}>
            {overdue.map((t) => <TaskListRow key={t.id} task={t} />)}
          </Stack>
        </>
      )}

      <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, display: 'block', mb: 0.75 }}>
        OPEN · {upcoming.length}
      </Typography>
      <Stack spacing={1}>
        {upcoming.map((t) => <TaskListRow key={t.id} task={t} />)}
      </Stack>
    </>
  );
}

// Shared collapsible bucket card (Skipped / Awaiting parts / Ready, etc.)
function BucketCard({ icon, iconFg, iconBg, borderColor, bg, chevronColor, title, sub, open, onToggle, children }) {
  return (
    <Card variant="outlined" sx={{ borderColor, mb: 1, bgcolor: bg }}>
      <CardContent
        sx={{ p: 1.25, '&:last-child': { pb: 1.25 }, cursor: 'pointer' }}
        onClick={onToggle}
      >
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: iconBg, display: 'grid', placeItems: 'center' }}>
            <Icon name={icon} size={16} color={iconFg} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{title}</Typography>
            <Typography variant="caption">{sub}</Typography>
          </Box>
          <Icon name={open ? 'expand_less' : 'expand_more'} size={22} color={chevronColor} />
        </Stack>
        <Collapse in={open}>
          <Stack spacing={1} sx={{ mt: 1.25 }}>{children}</Stack>
        </Collapse>
      </CardContent>
    </Card>
  );
}

const WO_STATUS_VISUAL = {
  'In progress': { icon: 'pending', fg: '#0369A1', bg: '#E0F2FE' },
  Queued: { icon: 'schedule', fg: '#475569', bg: '#F1F5F9' },
  Bundled: { icon: 'bolt', fg: '#15803D', bg: '#DCFCE7' },
  'Auto-coordinated': { icon: 'auto_awesome', fg: '#4338CA', bg: '#EEF2FF' },
  Monitor: { icon: 'monitoring', fg: '#B45309', bg: '#FEF3C7' },
  'At risk': { icon: 'error', fg: '#DC2626', bg: '#FEE2E2' },
  Overdue: { icon: 'error', fg: '#DC2626', bg: '#FEE2E2' },
  'On track': { icon: 'check_circle', fg: '#16A34A', bg: '#DCFCE7' },
  Open: { icon: 'schedule', fg: '#0369A1', bg: '#E0F2FE' },
  Deferrable: { icon: 'schedule', fg: '#475569', bg: '#F1F5F9' },
  Unassigned: { icon: 'person_off', fg: '#64748B', bg: '#F1F5F9' },
  'Awaiting parts': { icon: 'inventory_2', fg: '#B45309', bg: '#FEF3C7' }
};

function WorkOrderRow({ wo }) {
  const v = WO_STATUS_VISUAL[wo.status] || { icon: 'build', fg: '#475569', bg: '#F1F5F9' };
  const topLabel = wo.kind || wo.category || wo.kpi || 'Work order';
  return (
    <Card variant="outlined" sx={{ borderColor: '#E2E8F0' }}>
      <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
        <Stack direction="row" spacing={1.25} alignItems="flex-start">
          <Box
            sx={{
              width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
              bgcolor: v.bg, display: 'grid', placeItems: 'center', mt: 0.25
            }}
          >
            <Icon name={v.icon} size={18} color={v.fg} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={0.625} alignItems="center" sx={{ mb: 0.125 }}>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                {topLabel}
              </Typography>
              <Box sx={{ flex: 1 }} />
              <Chip
                size="small"
                label={wo.status}
                sx={{
                  height: 18, fontSize: 9.5, fontWeight: 700, bgcolor: v.bg, color: v.fg,
                  '.MuiChip-label': { px: 0.625 }
                }}
              />
            </Stack>
            <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.25 }}>
              {wo.title}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.25, color: '#64748B' }}>
              <Icon name="place" size={13} color="#94A3B8" />
              <Typography variant="caption">{wo.location}</Typography>
              <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: '#CBD5E1' }} />
              <Icon name="schedule" size={13} color="#94A3B8" />
              <Typography variant="caption">{wo.eta}</Typography>
            </Stack>
            {wo.reason && (
              <Typography variant="caption" sx={{ display: 'block', color: '#94A3B8', mt: 0.25, lineHeight: 1.3 }}>
                {wo.reason}
              </Typography>
            )}
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.75 }}>
              <Icon name="person" size={14} color="#94A3B8" />
              <Typography variant="caption" sx={{ color: (wo.assignee || wo.tech) && (wo.assignee || wo.tech) !== 'Reassign needed' && (wo.assignee || wo.tech) !== 'Unassigned' ? '#475569' : '#94A3B8' }}>
                {wo.assignee || wo.tech || 'Unassigned'}
              </Typography>
            </Stack>
          </Box>
          <Icon name="chevron_right" size={20} color="#94A3B8" />
        </Stack>
      </CardContent>
    </Card>
  );
}

function WorkOrdersView() {
  const mode = useMode();
  const day90 = mode === 'day90';
  const day30 = mode === 'day30';
  const [showParts, setShowParts] = useState(false);
  const [showUnassigned, setShowUnassigned] = useState(false);
  const [showActive, setShowActive] = useState(!day90);
  const all = [
    ...tiers.flatMap((t) => t.tasks).filter((w) => w.id.startsWith('wo-') || w.id.startsWith('qw-')),
    ...backlog,
    ...predictiveWorkOrders
  ];
  const overdue = all.filter((w) => w.status === 'Overdue');
  const awaitingParts = all.filter((w) => w.status === 'Awaiting parts');
  const unassigned = all.filter((w) => w.status === 'Unassigned');
  const active = all.filter(
    (w) => !['Overdue', 'Awaiting parts', 'Unassigned'].includes(w.status)
  );
  // At Day 30/90, only surface At risk / Critical actives by default.
  const exceptionsOnly = active.filter((w) => ['At risk', 'Critical', 'Monitor'].includes(w.status));
  const visibleActive = day30 || day90 ? exceptionsOnly : active;
  const routineActiveCount = active.length - visibleActive.length;
  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Work orders</Typography>
          <Typography variant="caption">
            Dispatch + backlog · {active.length + overdue.length} active
          </Typography>
        </Box>
        <Chip
          size="small"
          label={`${awaitingParts.length} awaiting parts`}
          sx={{ bgcolor: '#FEF3C7', color: '#92400E' }}
        />
      </Stack>

      <BucketCard
        icon="inventory_2" iconFg="#B45309" iconBg="#FEF3C7"
        borderColor="#FDE68A" bg="#FFFBEB" chevronColor="#92400E"
        title="Awaiting parts" sub={`${awaitingParts.length} blocked on parts or vendor delivery`}
        open={showParts} onToggle={() => setShowParts((v) => !v)}
      >
        {awaitingParts.map((w) => <WorkOrderRow key={w.id} wo={w} />)}
      </BucketCard>

      <BucketCard
        icon="person_off" iconFg="#64748B" iconBg="#F1F5F9"
        borderColor="#E2E8F0" bg="#F8FAFC" chevronColor="#64748B"
        title="Unassigned" sub={`${unassigned.length} lower-priority — awaiting capacity`}
        open={showUnassigned} onToggle={() => setShowUnassigned((v) => !v)}
      >
        {unassigned.map((w) => <WorkOrderRow key={w.id} wo={w} />)}
      </BucketCard>

      {overdue.length > 0 && (
        <>
          <Typography variant="caption" sx={{ color: '#991B1B', fontWeight: 700, display: 'block', mb: 0.75, mt: 0.5 }}>
            OVERDUE · {overdue.length}
          </Typography>
          <Stack spacing={1} sx={{ mb: 1.5 }}>
            {overdue.map((w) => <WorkOrderRow key={w.id} wo={w} />)}
          </Stack>
        </>
      )}

      <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, display: 'block', mb: 0.75, mt: 0.5 }}>
        {(day30 || day90) ? `EXCEPTIONS · ${visibleActive.length}` : `ACTIVE · ${active.length}`}
      </Typography>
      <Stack spacing={1}>
        {visibleActive.map((w) => <WorkOrderRow key={w.id} wo={w} />)}
      </Stack>
      {routineActiveCount > 0 && (
        <Box sx={{ mt: 1 }}>
          <Card variant="outlined" sx={{ borderColor: '#E2E8F0', bgcolor: '#F8FAFC' }}>
            <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                onClick={() => setShowActive((v) => !v)}
                sx={{ cursor: 'pointer' }}
              >
                <Icon name="check_circle" size={16} color="#16A34A" />
                <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600, flex: 1 }}>
                  +{routineActiveCount} routine work order{routineActiveCount === 1 ? '' : 's'} coordinated automatically
                </Typography>
                <Icon name={showActive ? 'expand_less' : 'expand_more'} size={18} color="#94A3B8" />
              </Stack>
              <Collapse in={showActive}>
                <Stack spacing={1} sx={{ mt: 1 }}>
                  {active.filter((w) => !visibleActive.includes(w)).map((w) => <WorkOrderRow key={w.id} wo={w} />)}
                </Stack>
              </Collapse>
            </CardContent>
          </Card>
        </Box>
      )}
    </>
  );
}

const TURN_STATUS_VISUAL = {
  'At risk': { icon: 'error', fg: '#DC2626', bg: '#FEE2E2', bar: '#DC2626' },
  'On track': { icon: 'trending_up', fg: '#16A34A', bg: '#DCFCE7', bar: '#16A34A' },
  'In progress': { icon: 'pending', fg: '#0369A1', bg: '#E0F2FE', bar: '#0EA5E9' },
  Scheduled: { icon: 'event', fg: '#475569', bg: '#F1F5F9', bar: '#94A3B8' },
  Ready: { icon: 'check_circle', fg: '#16A34A', bg: '#DCFCE7', bar: '#16A34A' }
};

function UnitTurnRow({ turn }) {
  const v = TURN_STATUS_VISUAL[turn.status] || TURN_STATUS_VISUAL.Scheduled;
  return (
    <Card variant="outlined" sx={{ borderColor: '#E2E8F0' }}>
      <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
        <Stack direction="row" spacing={1.25} alignItems="flex-start">
          <Box
            sx={{
              width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
              bgcolor: v.bg, display: 'grid', placeItems: 'center', mt: 0.25
            }}
          >
            <Icon name={v.icon} size={18} color={v.fg} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={0.625} alignItems="center">
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{turn.unit}</Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>· {turn.area}</Typography>
              <Box sx={{ flex: 1 }} />
              <Chip
                size="small"
                label={turn.status}
                sx={{
                  height: 18, fontSize: 9.5, fontWeight: 700, bgcolor: v.bg, color: v.fg,
                  '.MuiChip-label': { px: 0.625 }
                }}
              />
            </Stack>
            <Typography
              variant="caption"
              sx={{ display: 'block', mt: 0.125, fontWeight: 600, color: turn.status === 'At risk' ? '#DC2626' : '#64748B' }}
            >
              {turn.moveIn}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.625 }}>
              <LinearProgress
                variant="determinate"
                value={turn.readiness}
                sx={{
                  flex: 1, height: 6, borderRadius: 4, bgcolor: '#F1F5F9',
                  '& .MuiLinearProgress-bar': { bgcolor: v.bar }
                }}
              />
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#0F172A' }}>
                {turn.readiness}%
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ display: 'block', color: '#94A3B8', mt: 0.5, lineHeight: 1.3 }}>
              {turn.note}
            </Typography>
            <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mt: 0.75 }}>
              <Icon name="person" size={14} color="#94A3B8" />
              <Typography variant="caption" sx={{ color: turn.assignee === 'Reassign needed' ? '#94A3B8' : '#475569' }}>
                {turn.assignee}
              </Typography>
              <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: '#CBD5E1' }} />
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>{turn.eta}</Typography>
              {turn.learned && (
                <Chip
                  size="small"
                  icon={<Icon name="model_training" size={10} color="#4338CA" sx={{ ml: 0.5 }} />}
                  label="Learned pattern"
                  sx={{
                    height: 17, fontSize: 9.5, fontWeight: 700, bgcolor: '#EEF2FF', color: '#4338CA',
                    '.MuiChip-label': { px: 0.5 }
                  }}
                />
              )}
            </Stack>
          </Box>
          <Icon name="chevron_right" size={20} color="#94A3B8" />
        </Stack>
      </CardContent>
    </Card>
  );
}

function UnitTurnsView() {
  const [showReady, setShowReady] = useState(false);
  const [showScheduled, setShowScheduled] = useState(false);
  const atRisk = unitTurns.filter((t) => t.status === 'At risk');
  const inProgress = unitTurns.filter((t) => ['On track', 'In progress'].includes(t.status));
  const scheduled = unitTurns.filter((t) => t.status === 'Scheduled');
  const ready = unitTurns.filter((t) => t.status === 'Ready');
  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Unit turns</Typography>
          <Typography variant="caption">
            Move-in readiness · {atRisk.length + inProgress.length} in progress
          </Typography>
        </Box>
        {atRisk.length > 0 && (
          <Chip
            size="small"
            label={`${atRisk.length} at risk`}
            sx={{ bgcolor: '#FEE2E2', color: '#991B1B' }}
          />
        )}
      </Stack>

      {atRisk.length > 0 && (
        <>
          <Typography variant="caption" sx={{ color: '#991B1B', fontWeight: 700, display: 'block', mb: 0.75 }}>
            MOVE-IN AT RISK · {atRisk.length}
          </Typography>
          <Stack spacing={1} sx={{ mb: 1.5 }}>
            {atRisk.map((t) => <UnitTurnRow key={t.id} turn={t} />)}
          </Stack>
        </>
      )}

      <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, display: 'block', mb: 0.75 }}>
        IN PROGRESS · {inProgress.length}
      </Typography>
      <Stack spacing={1} sx={{ mb: 1.5 }}>
        {inProgress.map((t) => <UnitTurnRow key={t.id} turn={t} />)}
      </Stack>

      <BucketCard
        icon="event" iconFg="#475569" iconBg="#F1F5F9"
        borderColor="#E2E8F0" bg="#F8FAFC" chevronColor="#64748B"
        title="Scheduled" sub={`${scheduled.length} staged for an upcoming move-in`}
        open={showScheduled} onToggle={() => setShowScheduled((v) => !v)}
      >
        {scheduled.map((t) => <UnitTurnRow key={t.id} turn={t} />)}
      </BucketCard>

      <BucketCard
        icon="check_circle" iconFg="#16A34A" iconBg="#DCFCE7"
        borderColor="#E2E8F0" bg="#F8FAFC" chevronColor="#64748B"
        title="Ready" sub={`${ready.length} turn${ready.length === 1 ? '' : 's'} complete`}
        open={showReady} onToggle={() => setShowReady((v) => !v)}
      >
        {ready.map((t) => <UnitTurnRow key={t.id} turn={t} />)}
      </BucketCard>
    </>
  );
}

const SV_STATUS_VISUAL = {
  'Pending approval': { icon: 'pending_actions', fg: '#DC2626', bg: '#FEE2E2' },
  Scheduled: { icon: 'event', fg: '#475569', bg: '#F1F5F9' },
  'On site': { icon: 'engineering', fg: '#0369A1', bg: '#E0F2FE' },
  'In progress': { icon: 'pending', fg: '#0369A1', bg: '#E0F2FE' },
  'Awaiting quote': { icon: 'request_quote', fg: '#B45309', bg: '#FEF3C7' },
  Completed: { icon: 'check_circle', fg: '#16A34A', bg: '#DCFCE7' }
};

function ServiceRow({ svc }) {
  const v = SV_STATUS_VISUAL[svc.status] || { icon: 'handshake', fg: '#475569', bg: '#F1F5F9' };
  return (
    <Card variant="outlined" sx={{ borderColor: '#E2E8F0' }}>
      <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
        <Stack direction="row" spacing={1.25} alignItems="flex-start">
          <Box
            sx={{
              width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
              bgcolor: v.bg, display: 'grid', placeItems: 'center', mt: 0.25
            }}
          >
            <Icon name={v.icon} size={18} color={v.fg} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={0.625} alignItems="center">
              <Icon name="storefront" size={13} color="#94A3B8" />
              <Typography variant="caption" sx={{ color: '#0F172A', fontWeight: 700 }}>
                {svc.vendor}
              </Typography>
              <Chip
                size="small"
                label={svc.trade}
                sx={{
                  height: 16, fontSize: 9, fontWeight: 700, bgcolor: '#EEF2FF', color: '#4338CA',
                  '.MuiChip-label': { px: 0.5 }
                }}
              />
              <Box sx={{ flex: 1 }} />
              <Chip
                size="small"
                label={svc.status}
                sx={{
                  height: 18, fontSize: 9.5, fontWeight: 700, bgcolor: v.bg, color: v.fg,
                  '.MuiChip-label': { px: 0.625 }
                }}
              />
            </Stack>
            <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.25, mt: 0.25 }}>
              {svc.title}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.25, color: '#64748B' }}>
              <Icon name="place" size={13} color="#94A3B8" />
              <Typography variant="caption">{svc.location}</Typography>
              <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: '#CBD5E1' }} />
              <Icon name="schedule" size={13} color="#94A3B8" />
              <Typography variant="caption">{svc.window}</Typography>
            </Stack>
            <Typography variant="caption" sx={{ display: 'block', color: '#94A3B8', mt: 0.25, lineHeight: 1.3 }}>
              {svc.note}
            </Typography>
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.75 }}>
              <Chip
                size="small"
                icon={<Icon name="payments" size={11} sx={{ ml: 0.5 }} />}
                label={svc.cost}
                variant="outlined"
                sx={{ height: 20, borderColor: '#CBD5E1', color: '#475569', '.MuiChip-label': { px: 0.5, fontSize: 10.5 } }}
              />
              <Chip
                size="small"
                icon={<Icon name="schedule" size={11} sx={{ ml: 0.5 }} />}
                label={svc.sla}
                variant="outlined"
                sx={{ height: 20, borderColor: '#CBD5E1', color: '#475569', '.MuiChip-label': { px: 0.5, fontSize: 10.5 } }}
              />
            </Stack>
          </Box>
          <Icon name="chevron_right" size={20} color="#94A3B8" />
        </Stack>
      </CardContent>
    </Card>
  );
}

function ServicesView() {
  const [showQuote, setShowQuote] = useState(false);
  const [showDone, setShowDone] = useState(false);
  const approval = services.filter((s) => s.status === 'Pending approval');
  const active = services.filter((s) => ['Scheduled', 'On site', 'In progress'].includes(s.status));
  const quote = services.filter((s) => s.status === 'Awaiting quote');
  const done = services.filter((s) => s.status === 'Completed');
  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Services</Typography>
          <Typography variant="caption">
            Outsourced to service providers · {active.length} scheduled
          </Typography>
        </Box>
        {approval.length > 0 && (
          <Chip
            size="small"
            label={`${approval.length} needs approval`}
            sx={{ bgcolor: '#FEE2E2', color: '#991B1B' }}
          />
        )}
      </Stack>

      {approval.length > 0 && (
        <>
          <Typography variant="caption" sx={{ color: '#991B1B', fontWeight: 700, display: 'block', mb: 0.75 }}>
            NEEDS YOUR APPROVAL · {approval.length}
          </Typography>
          <Stack spacing={1} sx={{ mb: 1.5 }}>
            {approval.map((s) => <ServiceRow key={s.id} svc={s} />)}
          </Stack>
        </>
      )}

      <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, display: 'block', mb: 0.75 }}>
        SCHEDULED · {active.length}
      </Typography>
      <Stack spacing={1} sx={{ mb: 1.5 }}>
        {active.map((s) => <ServiceRow key={s.id} svc={s} />)}
      </Stack>

      <BucketCard
        icon="request_quote" iconFg="#B45309" iconBg="#FEF3C7"
        borderColor="#FDE68A" bg="#FFFBEB" chevronColor="#92400E"
        title="Awaiting quote" sub={`${quote.length} pending a vendor estimate`}
        open={showQuote} onToggle={() => setShowQuote((v) => !v)}
      >
        {quote.map((s) => <ServiceRow key={s.id} svc={s} />)}
      </BucketCard>

      <BucketCard
        icon="check_circle" iconFg="#16A34A" iconBg="#DCFCE7"
        borderColor="#E2E8F0" bg="#F8FAFC" chevronColor="#64748B"
        title="Completed" sub={`${done.length} service${done.length === 1 ? '' : 's'} closed`}
        open={showDone} onToggle={() => setShowDone((v) => !v)}
      >
        {done.map((s) => <ServiceRow key={s.id} svc={s} />)}
      </BucketCard>
    </>
  );
}

const WORK_SEGMENTS = [
  { id: 'orders', label: 'Work orders' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'turns', label: 'Unit turns' },
  { id: 'services', label: 'Services' }
];

function WorkTab() {
  const [seg, setSeg] = useState('orders');
  const mode = useMode();
  const calibrated = mode === 'day30' || mode === 'day90';
  return (
    <Box sx={{ px: 1.5, pt: 1.5 }}>
      {calibrated && (
        <Box sx={{ mb: 1.25 }}>
          <RoutineRollupCard data={mode === 'day90' ? routineRollup.day90 : routineRollup.day30} />
          <Typography variant="caption" sx={{ display: 'block', color: '#64748B', mt: 0.75, lineHeight: 1.35 }}>
            Below: anything the AI couldn't fully coordinate on its own — overdue, at-risk, or unassigned.
          </Typography>
        </Box>
      )}
      <ToggleButtonGroup
        size="small"
        exclusive
        fullWidth
        value={seg}
        onChange={(_, v) => v && setSeg(v)}
        sx={{
          mb: 1.5,
          bgcolor: '#F1F5F9',
          border: '1px solid #CBD5E1',
          borderRadius: 2,
          p: 0.5,
          '.MuiToggleButton-root': {
            flex: 1, minWidth: 0, px: 0.5, py: 0.625, fontSize: 11.5, fontWeight: 600,
            lineHeight: 1.15, whiteSpace: 'nowrap',
            textTransform: 'none', border: 'none', borderRadius: '8px !important',
            color: '#475569'
          },
          '.Mui-selected': {
            bgcolor: '#fff !important', color: '#0F172A !important',
            boxShadow: '0 1px 3px rgba(15,23,42,0.12)'
          }
        }}
      >
        {WORK_SEGMENTS.map((s) => (
          <ToggleButton key={s.id} value={s.id}>{s.label}</ToggleButton>
        ))}
      </ToggleButtonGroup>
      {seg === 'orders' && <WorkOrdersView />}
      {seg === 'tasks' && <TasksView />}
      {seg === 'turns' && <UnitTurnsView />}
      {seg === 'services' && <ServicesView />}
    </Box>
  );
}

function WorkOrderSheet({ open, item, status, onClose, onReschedule }) {
  if (!item) return null;
  const woId = `WO-${String((item.title || '').length * 37 % 9000 + 1000).padStart(4, '0')}`;
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        onClick: (e) => e.stopPropagation(),
        sx: {
          borderTopLeftRadius: 20, borderTopRightRadius: 20,
          maxHeight: '92vh', pb: 'env(safe-area-inset-bottom)'
        }
      }}
    >
      <Box sx={{ pt: 1 }}>
        <Box sx={{ width: 36, height: 4, bgcolor: '#CBD5E1', mx: 'auto', borderRadius: 2 }} />
      </Box>
      <Box sx={{ p: 2, pb: 1 }}>
        <Stack direction="row" spacing={1.25} alignItems="flex-start">
          <Box
            sx={{
              width: 40, height: 40, borderRadius: '12px', flexShrink: 0,
              bgcolor: toneBg(item.tone), display: 'grid', placeItems: 'center'
            }}
          >
            <Icon name={item.icon} size={22} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.25 }}>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                {woId} · {item.kind}
              </Typography>
              {status === 'completed' && (
                <Chip size="small" label="Done" sx={{ height: 16, fontSize: 10, bgcolor: '#DCFCE7', color: '#15803D' }} />
              )}
              {status === 'in-progress' && (
                <Chip size="small" label="In progress" sx={{ height: 16, fontSize: 10, bgcolor: '#0F172A', color: '#fff' }} />
              )}
            </Stack>
            <Typography variant="h6" sx={{ lineHeight: 1.2, fontSize: 17 }}>
              {item.title}
            </Typography>
          </Box>
          <IconButton size="small" onClick={onClose}>
            <Icon name="close" size={20} />
          </IconButton>
        </Stack>
      </Box>
      <Box sx={{ px: 2, pb: 2, overflowY: 'auto' }}>
        <Card variant="outlined" sx={{ borderColor: '#E2E8F0', mb: 1.25 }}>
          <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
            <Stack divider={<Divider />} spacing={1}>
              <DetailRow icon="schedule" label="Est. duration" value={formatDur(item.dur)} />
              <DetailRow icon="place" label="Location" value={item.location} />
              <DetailRow icon="person" label="Assignee" value={item.assignee || 'Jacob B.'} />
            </Stack>
          </CardContent>
        </Card>

        {item.note && (
          <Box sx={{ mb: 1.25 }}>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block', mb: 0.5 }}>
              CONTEXT
            </Typography>
            <Card variant="outlined" sx={{ borderColor: '#E2E8F0' }}>
              <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
                <Typography variant="body2" sx={{ color: '#334155' }}>
                  {item.note}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        )}

        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block', mb: 0.5 }}>
          ASSET HISTORY
        </Typography>
        <Card variant="outlined" sx={{ borderColor: '#E2E8F0', mb: 1.25 }}>
          <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
            <Box sx={{ mb: 0.75 }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {assetInfo(item).name}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>
                {assetInfo(item).desc}
              </Typography>
            </Box>
            <Divider sx={{ mb: 0.75 }} />
            <Stack spacing={0.75}>
              <HistoryRow when="Apr 28" what="Last serviced · cleared in 1.2h" />
              <HistoryRow when="Mar 14" what="HVAC fault — vendor dispatch" tone="warning" />
              <HistoryRow when="Feb 02" what="Quarterly PM completed" />
            </Stack>
          </CardContent>
        </Card>

        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block', mb: 0.5 }}>
          ACTIVITY
        </Typography>
        <Card variant="outlined" sx={{ borderColor: '#E2E8F0', mb: 1.5 }}>
          <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
            <Stack spacing={0.75}>
              <ActivityRow who="AI" when="7:02 AM" body="Sequenced as part of Jacob’s morning route." />
              <ActivityRow who="Jacob B." when="7:30 AM" body="Picked up parts from shop." />
              {status === 'completed' && (
                <ActivityRow who="Jacob B." when="—" body="Marked complete." tone="success" />
              )}
            </Stack>
          </CardContent>
        </Card>

        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <Button
            fullWidth size="small" variant="outlined"
            startIcon={<Icon name="event_repeat" size={16} />}
            onClick={onReschedule}
          >
            Reschedule
          </Button>
          <Button
            fullWidth size="small" variant="outlined"
            startIcon={<Icon name="person_add" size={16} />}
          >
            Reassign
          </Button>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button
            fullWidth size="small" variant="outlined"
            startIcon={<Icon name="add_comment" size={16} />}
          >
            Add note
          </Button>
          {status === 'queued' && (
            <Button
              fullWidth size="small" variant="contained"
              startIcon={<Icon name="play_arrow" size={16} color="#fff" />}
              sx={{ color: '#fff', bgcolor: '#2563EB', '&:hover': { bgcolor: '#1D4ED8' } }}
            >
              Mark as in-progress
            </Button>
          )}
          {status === 'in-progress' && (
            <Button
              fullWidth size="small" variant="contained" color="success"
              startIcon={<Icon name="check" size={16} color="#fff" />}
              sx={{ color: '#fff' }}
            >
              Mark complete
            </Button>
          )}
        </Stack>
      </Box>
    </Drawer>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <Stack direction="row" spacing={1.25} alignItems="center" sx={{ py: 0.25 }}>
      <Icon name={icon} size={16} color="#94A3B8" />
      <Typography variant="caption" sx={{ color: '#64748B', flex: '0 0 70px' }}>{label}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>{value}</Typography>
    </Stack>
  );
}

function HistoryRow({ when, what, tone }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: toneBg(tone || 'default'), border: '1px solid #94A3B8' }} />
      <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, width: 48 }}>{when}</Typography>
      <Typography variant="caption" sx={{ flex: 1 }}>{what}</Typography>
    </Stack>
  );
}

function ActivityRow({ who, when, body, tone }) {
  return (
    <Stack direction="row" spacing={1} alignItems="flex-start">
      <Avatar sx={{ width: 20, height: 20, fontSize: 9, bgcolor: who === 'AI' ? '#EEF2FF' : '#E2E8F0', color: who === 'AI' ? '#4338CA' : '#0F172A' }}>
        {who === 'AI' ? <Icon name="auto_awesome" size={11} color="#4338CA" /> : getInitials(who)}
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Typography variant="caption" sx={{ fontWeight: 700 }}>{who}</Typography>
          <Typography variant="caption" sx={{ color: '#94A3B8' }}>· {when}</Typography>
        </Stack>
        <Typography variant="caption" sx={{ display: 'block', color: tone === 'success' ? '#15803D' : '#475569' }}>
          {body}
        </Typography>
      </Box>
    </Stack>
  );
}

function RescheduleOption({ opt, selected, onPick, hideTech }) {
  return (
    <Card
      variant="outlined"
      onClick={() => onPick(opt.id)}
      sx={{
        cursor: 'pointer',
        borderColor: selected ? '#0F172A' : '#E2E8F0',
        borderWidth: selected ? 1.5 : 1,
        bgcolor: selected ? '#F8FAFC' : '#fff'
      }}
    >
      <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
        <Stack direction="row" spacing={1.25} alignItems="flex-start">
          <Box
            sx={{
              width: 22, height: 22, mt: 0.25, borderRadius: '50%',
              border: `2px solid ${selected ? '#0F172A' : '#CBD5E1'}`,
              display: 'grid', placeItems: 'center', flexShrink: 0
            }}
          >
            {selected && (
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#0F172A' }} />
            )}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.25 }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{opt.when}</Typography>
              <Typography variant="caption">· {formatDur(opt.dur)}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.5 }}>
              <Chip
                size="small"
                label={opt.score}
                sx={{
                  height: 18, fontSize: 10,
                  bgcolor: toneBg(opt.tone), color: '#0F172A',
                  '.MuiChip-label': { px: 0.75 }
                }}
              />
              {!hideTech && (
                <>
                  <Icon name="person" size={12} color="#94A3B8" />
                  <Typography variant="caption">{opt.tech}</Typography>
                </>
              )}
            </Stack>
            <Typography variant="caption" sx={{ color: '#475569' }}>
              {opt.reason}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function RescheduleSheet({ open, item, onClose, onConfirm }) {
  const [pick, setPick] = useState(rescheduleOptions[0]?.id);
  const [mode, setMode] = useState('soonest');
  const grouped = useMemo(() => {
    const m = new Map();
    rescheduleOptions.forEach((o) => {
      if (!m.has(o.tech)) m.set(o.tech, []);
      m.get(o.tech).push(o);
    });
    return [...m.entries()];
  }, []);
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        onClick: (e) => e.stopPropagation(),
        sx: {
          borderTopLeftRadius: 20, borderTopRightRadius: 20,
          maxHeight: '90vh', pb: 'env(safe-area-inset-bottom)'
        }
      }}
    >
      <Box sx={{ pt: 1 }}>
        <Box sx={{ width: 36, height: 4, bgcolor: '#CBD5E1', mx: 'auto', borderRadius: 2 }} />
      </Box>
      <Box sx={{ p: 2, pb: 1 }}>
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1 }}>
          <Avatar sx={{ bgcolor: '#EEF2FF', color: '#4338CA', width: 36, height: 36 }}>
            <Icon name="event_repeat" size={18} color="#4338CA" />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              Reschedule
            </Typography>
            <Typography variant="subtitle1" sx={{ lineHeight: 1.2 }}>
              {item?.title}
            </Typography>
          </Box>
          <IconButton size="small" onClick={onClose}>
            <Icon name="close" size={20} />
          </IconButton>
        </Stack>
        <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 1 }}>
          AI ranked these windows based on team capacity, tier conflicts, and KPI impact.
        </Typography>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={mode}
          onChange={(_, v) => v && setMode(v)}
          fullWidth
          sx={{
            '.MuiToggleButton-root': {
              py: 0.5, fontSize: 12, fontWeight: 600,
              textTransform: 'none', border: '1px solid #E2E8F0',
              color: '#475569'
            },
            '.Mui-selected': { bgcolor: '#0F172A !important', color: '#fff !important' }
          }}
        >
          <ToggleButton value="soonest">
            <Icon name="bolt" size={14} sx={{ mr: 0.5 }} /> Soonest opening
          </ToggleButton>
          <ToggleButton value="by-person">
            <Icon name="group" size={14} sx={{ mr: 0.5 }} /> By person
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ px: 2, pb: 1, overflowY: 'auto' }}>
        {mode === 'soonest' ? (
          <Stack spacing={1}>
            {rescheduleOptions.map((opt) => (
              <RescheduleOption key={opt.id} opt={opt} selected={pick === opt.id} onPick={setPick} />
            ))}
            <Button
              variant="text"
              size="small"
              startIcon={<Icon name="schedule" size={16} />}
              sx={{ alignSelf: 'flex-start', mt: 0.5 }}
            >
              Pick a custom time
            </Button>
          </Stack>
        ) : (
          <Stack spacing={1.5}>
            {grouped.map(([tech, opts]) => (
              <Box key={tech}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75, px: 0.25 }}>
                  <Avatar sx={{ bgcolor: '#E2E8F0', color: '#0F172A', width: 24, height: 24, fontSize: 11 }}>
                    {getInitials(tech)}
                  </Avatar>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{tech}</Typography>
                  <Typography variant="caption">· {opts.length} opening{opts.length > 1 ? 's' : ''}</Typography>
                </Stack>
                <Stack spacing={1}>
                  {opts.map((opt) => (
                    <RescheduleOption key={opt.id} opt={opt} selected={pick === opt.id} onPick={setPick} hideTech />
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
      <Box sx={{ p: 2, pt: 1, borderTop: '1px solid #E2E8F0' }}>
        <Stack direction="row" spacing={1}>
          <Button fullWidth variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={() => onConfirm(rescheduleOptions.find((o) => o.id === pick))}
          >
            Confirm
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
}

function TimelineItem({ item }) {
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const aiTouched = item.aiTouched || !!item.suggestion || (item.note && /\bAI\b/.test(item.note));
  const status = 'queued';
  const stop = (e) => e.stopPropagation();
  const isBreak = item.kind === 'Break';
  const overflow = item._fits === false;
  const toneColor = {
    error: '#DC2626', warning: '#D97706', info: '#0EA5E9',
    success: '#16A34A', default: '#94A3B8'
  }[item.tone] || '#94A3B8';

  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: aiTouched ? '#A5B4FC' : '#E2E8F0',
        borderWidth: aiTouched ? 1.5 : 1,
        bgcolor: aiTouched ? '#FCFCFF' : isBreak ? '#F8FAFC' : '#fff',
        opacity: overflow ? 0.6 : 1,
        cursor: 'pointer'
      }}
      onClick={() => setDetailsOpen(true)}
    >
      <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
        <Stack direction="row" spacing={1.25} alignItems="flex-start">
          <Box sx={{ width: 52, flexShrink: 0, textAlign: 'center' }}>
            <Box
              sx={{
                width: 8, height: 8, borderRadius: '50%', mx: 'auto', mb: 0.5,
                bgcolor: isBreak ? '#CBD5E1' : toneColor
              }}
            />
            <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, color: '#0F172A' }}>
              {formatDur(item.dur)}
            </Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              {aiTouched && (
                <Icon name="auto_awesome" size={13} color="#4338CA" />
              )}
              <Typography
                variant="caption"
                sx={{ color: aiTouched ? '#4338CA' : '#64748B', fontWeight: 600 }}
              >
                {item.kind}
              </Typography>
              {overflow && (
                <Chip
                  size="small"
                  label="Exceeds shift"
                  sx={{
                    height: 16, fontSize: 10, bgcolor: '#FEE2E2', color: '#B91C1C',
                    '.MuiChip-label': { px: 0.625 }
                  }}
                />
              )}
            </Stack>
            <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.25 }}>
              {item.title}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.25 }}>
              <Icon name="place" size={12} color="#94A3B8" />
              <Typography variant="caption">{item.location}</Typography>
            </Stack>
            {item.note && (
              <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: '#475569' }}>
                {item.note}
              </Typography>
            )}
          </Box>
        </Stack>
        {item.suggestion && !confirmation && (
          <Box
            onClick={stop}
            sx={{
              mt: 1, p: 1.25, borderRadius: 1.5,
              bgcolor: '#FFFBEB', border: '1px solid #FDE68A'
            }}
          >
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.5 }}>
              <Icon name="auto_awesome" size={16} color="#B45309" />
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#92400E' }}>
                AI suggestion
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: '#78350F', fontSize: 12.5, mb: 1 }}>
              {item.suggestion.body}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="contained"
                color="warning"
                fullWidth
                sx={{ color: '#fff' }}
                onClick={() => {
                  if (item.suggestion.action === 'reschedule') setRescheduleOpen(true);
                }}
              >
                {item.suggestion.primary}
              </Button>
              <Button size="small" variant="outlined" color="warning" fullWidth>
                {item.suggestion.secondary}
              </Button>
            </Stack>
          </Box>
        )}
        {confirmation && (
          <Box
            onClick={stop}
            sx={{
              mt: 1, p: 1.25, borderRadius: 1.5,
              bgcolor: '#F0FDF4', border: '1px solid #BBF7D0'
            }}
          >
            <Stack direction="row" spacing={0.75} alignItems="flex-start">
              <Icon name="event_available" size={16} color="#16A34A" />
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#15803D' }}>
                  Rescheduled
                </Typography>
                <Typography variant="body2" sx={{ color: '#166534', fontSize: 12.5 }}>
                  Moved to {confirmation.when} · {confirmation.tech}
                </Typography>
              </Box>
              <Button size="small" onClick={() => setConfirmation(null)} sx={{ minWidth: 0 }}>
                Undo
              </Button>
            </Stack>
          </Box>
        )}
      </CardContent>
      <RescheduleSheet
        open={rescheduleOpen}
        item={item}
        onClose={() => setRescheduleOpen(false)}
        onConfirm={(opt) => {
          setConfirmation(opt);
          setRescheduleOpen(false);
        }}
      />
      <WorkOrderSheet
        open={detailsOpen}
        item={item}
        status={status}
        onClose={() => setDetailsOpen(false)}
        onReschedule={() => { setDetailsOpen(false); setRescheduleOpen(true); }}
      />
    </Card>
  );
}

function TeamMemberSheet({ open, member, onClose }) {
  if (!member) return null;
  const loadHrs = scheduledHours(member.tasks);
  const ordered = withFit(member.tasks, member.capacity);
  const fitItems = ordered.filter((t) => t._fits);
  const overItems = ordered.filter((t) => !t._fits);
  const overHrs = overItems.reduce((s, t) => s + parseDur(t.dur), 0);
  const st = loadStatus(loadHrs, member.capacity);
  const tone = st.tone;
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 20, borderTopRightRadius: 20,
          maxHeight: '90vh', pb: 'env(safe-area-inset-bottom)'
        }
      }}
    >
      <Box sx={{ pt: 1 }}>
        <Box sx={{ width: 36, height: 4, bgcolor: '#CBD5E1', mx: 'auto', borderRadius: 2 }} />
      </Box>
      <Box sx={{ p: 2, pb: 1 }}>
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1 }}>
          <Avatar sx={{ bgcolor: '#E2E8F0', color: '#0F172A', width: 40, height: 40, fontSize: 14 }}>
            {getInitials(member.name)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ lineHeight: 1.1, fontWeight: 700 }}>
              {member.name}
            </Typography>
            <Typography variant="caption">
              {member.shift}
            </Typography>
          </Box>
          <IconButton size="small" onClick={onClose}>
            <Icon name="close" size={20} />
          </IconButton>
        </Stack>
        {member.capacity > 0 && (
          <Box sx={{ mb: 1.25 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
              <Chip
                size="small"
                label={st.label}
                sx={{
                  height: 20, fontSize: 11,
                  bgcolor: toneBg(tone), color: '#0F172A',
                  '.MuiChip-label': { px: 0.75 }
                }}
              />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {fmtHours(loadHrs)}h planned / {member.capacity}h shift
              </Typography>
            </Stack>
            <DayBar tasks={member.tasks} capacity={member.capacity} />
            <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 0.5 }}>
              {overHrs > 0
                ? `${fmtHours(overHrs)}h won’t fit in an ${member.capacity}h shift`
                : `Fits within the ${member.capacity}h shift · ordered by priority`}
            </Typography>
          </Box>
        )}
      </Box>
      <Box sx={{ px: 2, pb: 2, overflowY: 'auto' }}>
        {member.tasks.length === 0 ? (
          <Card variant="outlined" sx={{ bgcolor: '#F8FAFC', borderColor: '#E2E8F0' }}>
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Icon name="event_busy" size={18} color="#64748B" />
                <Typography variant="body2" sx={{ color: '#475569' }}>
                  No items scheduled. {member.shift === 'PTO' ? 'Out today.' : ''}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={1}>
            {fitItems.map((t, i) => (
              <TimelineItem key={`f-${i}`} item={t} />
            ))}
            {overItems.length > 0 && (
              <>
                <Stack direction="row" spacing={0.75} alignItems="center" sx={{ pt: 0.5 }}>
                  <Icon name="error" size={15} color="#DC2626" />
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#B91C1C' }}>
                    Won’t fit in an {member.capacity}h shift — reassign or defer
                  </Typography>
                </Stack>
                {overItems.map((t, i) => (
                  <TimelineItem key={`o-${i}`} item={t} />
                ))}
              </>
            )}
          </Stack>
        )}
      </Box>
    </Drawer>
  );
}

function CalendarSheet({ open, value, onClose, onPick }) {
  const [cursor, setCursor] = useState(() => new Date(value.getFullYear(), value.getMonth(), 1));
  const monthName = cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const firstDay = new Date(cursor.getFullYear(), cursor.getMonth(), 1).getDay();
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const isSel = (d) =>
    d &&
    value.getFullYear() === cursor.getFullYear() &&
    value.getMonth() === cursor.getMonth() &&
    value.getDate() === d;
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { borderTopLeftRadius: 20, borderTopRightRadius: 20, pb: 'env(safe-area-inset-bottom)' } }}
    >
      <Box sx={{ pt: 1 }}>
        <Box sx={{ width: 36, height: 4, bgcolor: '#CBD5E1', mx: 'auto', borderRadius: 2 }} />
      </Box>
      <Box sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
          <IconButton
            size="small"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
          >
            <Icon name="chevron_left" size={20} />
          </IconButton>
          <Typography variant="subtitle1">{monthName}</Typography>
          <IconButton
            size="small"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
          >
            <Icon name="chevron_right" size={20} />
          </IconButton>
        </Stack>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((w, i) => (
            <Typography key={i} variant="caption" sx={{ textAlign: 'center', color: '#94A3B8', fontWeight: 700, py: 0.5 }}>
              {w}
            </Typography>
          ))}
          {cells.map((d, i) => (
            <Box
              key={i}
              onClick={() => d && onPick(new Date(cursor.getFullYear(), cursor.getMonth(), d))}
              sx={{
                aspectRatio: '1', display: 'grid', placeItems: 'center',
                borderRadius: '50%', cursor: d ? 'pointer' : 'default',
                bgcolor: isSel(d) ? '#0F172A' : 'transparent',
                color: isSel(d) ? '#fff' : '#0F172A',
                fontWeight: isSel(d) ? 700 : 500,
                '&:hover': d ? { bgcolor: isSel(d) ? '#0F172A' : '#F1F5F9' } : {}
              }}
            >
              {d && <Typography variant="body2" sx={{ color: 'inherit', fontWeight: 'inherit' }}>{d}</Typography>}
            </Box>
          ))}
        </Box>
      </Box>
    </Drawer>
  );
}

function ScheduleTab() {
  const mode = useMode();
  const day30 = mode === 'day30' || mode === 'day90'; // calibrated (Day 30+)
  const day90 = mode === 'day90'; // predictive operations
  const [view, setView] = useState('my');
  const [openMember, setOpenMember] = useState(null);
  const [date, setDate] = useState(new Date(2025, 4, 16));
  const [calOpen, setCalOpen] = useState(false);
  const today = new Date(2025, 4, 16);
  const isToday = date.toDateString() === today.toDateString();
  const shiftDay = (n) => setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + n));
  const longLabel = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const shortLabel = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  return (
    <Box sx={{ px: 1.5, pt: 1.5 }}>
      <Box sx={{ mb: 1.25 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Schedule
        </Typography>
      </Box>

      <Stack
        direction="row"
        alignItems="center"
        sx={{
          mb: 1.5, bgcolor: '#fff', border: '1px solid #E2E8F0',
          borderRadius: 2, px: 0.5, py: 0.5
        }}
      >
        <IconButton size="small" onClick={() => shiftDay(-1)}>
          <Icon name="chevron_left" size={20} color="#475569" />
        </IconButton>
        <Stack
          direction="row"
          spacing={0.75}
          alignItems="center"
          justifyContent="center"
          onClick={() => setCalOpen(true)}
          sx={{ flex: 1, cursor: 'pointer', py: 0.25 }}
        >
          <Icon name="calendar_today" size={16} color="#0F172A" />
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {isToday ? `Today · ${shortLabel}` : longLabel}
          </Typography>
          <Icon name="expand_more" size={16} color="#94A3B8" />
        </Stack>
        <IconButton size="small" onClick={() => shiftDay(1)}>
          <Icon name="chevron_right" size={20} color="#475569" />
        </IconButton>
      </Stack>

      <CalendarSheet
        open={calOpen}
        value={date}
        onClose={() => setCalOpen(false)}
        onPick={(d) => { setDate(d); setCalOpen(false); }}
      />

      <ToggleButtonGroup
        size="small"
        exclusive
        fullWidth
        value={view}
        onChange={(_, v) => v && setView(v)}
        sx={{
          mb: 1.5,
          bgcolor: '#F1F5F9',
          border: '1px solid #CBD5E1',
          borderRadius: 2,
          p: 0.5,
          '.MuiToggleButton-root': {
            flex: 1, py: 0.625, fontSize: 13, fontWeight: 600,
            textTransform: 'none', border: 'none', borderRadius: '8px !important',
            color: '#475569'
          },
          '.Mui-selected': {
            bgcolor: '#fff !important', color: '#0F172A !important',
            boxShadow: '0 1px 3px rgba(15,23,42,0.12)'
          }
        }}
      >
        <ToggleButton value="my">My Day</ToggleButton>
        <ToggleButton value="team">Team</ToggleButton>
      </ToggleButtonGroup>

      {view === 'my' ? (
        <Stack spacing={1}>
          <Card variant="outlined" sx={{ bgcolor: '#F8FAFC', borderColor: '#E2E8F0' }}>
            <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Icon name="auto_awesome" size={16} color="#4338CA" />
                <Typography variant="caption" sx={{ color: '#4338CA', fontWeight: 600 }}>
                  {day90
                    ? 'Your day is reduced to operational oversight only'
                    : day30
                      ? 'Your day is reduced to approvals and exceptions'
                      : 'AI ordered your day by priority — top items first'}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
          {(() => {
            const ordered = orderByPriority(mdSchedule);
            // Day 30: show only Approval / Override review / Sign-off / Walkthrough on warning+
            // Day 90: show only top 2 most strategic items
            const isStrategic = (it) =>
              ['Approval', 'Override review', 'Sign-off'].includes(it.kind) ||
              it.tone === 'error' || it.tone === 'warning';
            const visible = day90
              ? ordered.filter(isStrategic).slice(0, 2)
              : day30
                ? ordered.filter(isStrategic)
                : ordered;
            const hiddenCount = ordered.length - visible.length;
            return (
              <>
                {visible.map((item) => (
                  <TimelineItem key={item.id} item={item} />
                ))}
                {hiddenCount > 0 && (
                  <Card variant="outlined" sx={{ borderColor: '#E2E8F0', bgcolor: '#F8FAFC' }}>
                    <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Icon name="check_circle" size={16} color="#16A34A" />
                        <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600, flex: 1 }}>
                          +{hiddenCount} routine block{hiddenCount === 1 ? '' : 's'} coordinated without your input
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                )}
              </>
            );
          })()}
        </Stack>
      ) : day90 ? (
        // Day 90 — high-level operational coverage. No per-tech task stacks.
        <Stack spacing={1}>
          <Card variant="outlined" sx={{ borderColor: '#A5B4FC', bgcolor: '#FCFCFF' }}>
            <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Icon name="auto_awesome" size={16} color="#4338CA" />
                <Typography variant="caption" sx={{ color: '#4338CA', fontWeight: 600 }}>
                  Operational coverage is balanced — the AI is monitoring drift, not assignments
                </Typography>
              </Stack>
            </CardContent>
          </Card>
          {day90Coverage.map((c) => (
            <Card key={c.id} variant="outlined" sx={{ borderColor: '#E2E8F0' }}>
              <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Box
                    sx={{
                      width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                      bgcolor: '#DCFCE7', display: 'grid', placeItems: 'center'
                    }}
                  >
                    <Icon name={c.icon} size={17} color="#16A34A" />
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, flex: 1 }}>
                    {c.title}
                  </Typography>
                  <Icon name="check_circle" size={18} color="#16A34A" />
                </Stack>
              </CardContent>
            </Card>
          ))}
          <Card variant="outlined" sx={{ borderColor: '#E2E8F0', bgcolor: '#F8FAFC' }}>
            <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
              <Typography variant="caption" sx={{ color: '#64748B', display: 'block', lineHeight: 1.35 }}>
                Per-technician detail is available on demand — tap any name to drill in.
              </Typography>
              <Stack direction="row" flexWrap="wrap" useFlexGap spacing={0.5} sx={{ mt: 0.75 }}>
                {team.map((p) => (
                  <Chip
                    key={p.id}
                    size="small"
                    clickable
                    onClick={() => setOpenMember(p)}
                    label={p.name}
                    sx={{
                      height: 22, bgcolor: '#fff', border: '1px solid #CBD5E1',
                      color: '#334155', fontWeight: 600, '.MuiChip-label': { px: 0.875, fontSize: 11 }
                    }}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      ) : day30 ? (
        // Day 30 — one focus line per technician. No task stacks.
        <Stack spacing={1}>
          <Card variant="outlined" sx={{ borderColor: '#A5B4FC', bgcolor: '#FCFCFF' }}>
            <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Icon name="auto_awesome" size={16} color="#4338CA" />
                <Typography variant="caption" sx={{ color: '#4338CA', fontWeight: 600 }}>
                  AI pre-balanced the team from 30 days of completion patterns
                </Typography>
              </Stack>
            </CardContent>
          </Card>
          {team.map((p) => {
            const f = teamFocus[p.id] || { focus: 'Routine assignments', state: 'Stable', tone: 'success' };
            return (
              <Card key={p.id} variant="outlined" sx={{ borderColor: '#E2E8F0' }}>
                <CardContent
                  sx={{ p: 1.25, '&:last-child': { pb: 1.25 }, cursor: 'pointer' }}
                  onClick={() => setOpenMember(p)}
                >
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" alignItems="center" spacing={0.75}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{p.name}</Typography>
                        <Chip
                          size="small"
                          label={f.state}
                          sx={{
                            height: 18, fontSize: 10, bgcolor: toneBg(f.tone), color: '#0F172A',
                            '.MuiChip-label': { px: 0.75 }
                          }}
                        />
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.25 }}>
                        <Icon name="flag" size={13} color="#94A3B8" />
                        <Typography variant="caption" sx={{ color: '#475569' }}>
                          Focus · {f.focus}
                        </Typography>
                      </Stack>
                    </Box>
                    <Icon name="chevron_right" size={20} color="#94A3B8" />
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      ) : (
        // Day 1 — original detailed view (MD is supervising operations).
        <Stack spacing={1}>
          {team.map((p) => {
            const loadHrs = scheduledHours(p.tasks);
            const st = loadStatus(loadHrs, p.capacity);
            const tone = st.tone;
            return (
              <Card key={p.id} variant="outlined" sx={{ borderColor: '#E2E8F0' }}>
                <CardContent
                  sx={{
                    p: 1.25, '&:last-child': { pb: 1.25 },
                    cursor: 'pointer'
                  }}
                  onClick={() => setOpenMember(p)}
                >
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" alignItems="center" spacing={0.75}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{p.name}</Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.75}>
                        <Typography variant="caption">{p.shift}</Typography>
                        <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: '#CBD5E1' }} />
                        <Chip
                          size="small"
                          label={st.label}
                          sx={{
                            height: 18, fontSize: 10,
                            bgcolor: toneBg(tone), color: '#0F172A',
                            '.MuiChip-label': { px: 0.75 }
                          }}
                        />
                        <Typography variant="caption" sx={{ color: '#64748B' }}>
                          · {p.tasks.length} items
                        </Typography>
                      </Stack>
                      {p.capacity > 0 && (
                        <Box sx={{ mt: 0.75 }}>
                          <DayBar tasks={p.tasks} capacity={p.capacity} />
                          <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 0.25 }}>
                            {loadHrs > p.capacity
                              ? `${fmtHours(loadHrs)}h planned · ${fmtHours(loadHrs - p.capacity)}h over an ${p.capacity}h shift`
                              : `${fmtHours(loadHrs)}h planned · fits in ${p.capacity}h shift`}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    <Icon name="chevron_right" size={20} color="#94A3B8" />
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}
      <TeamMemberSheet
        open={Boolean(openMember)}
        member={openMember}
        onClose={() => setOpenMember(null)}
      />
    </Box>
  );
}

function SettingsTab() {
  const rows = [
    { i: 'manage_accounts', t: 'Account', s: 'Mike F. · Maintenance Director' },
    { i: 'auto_awesome', t: 'AI behavior', s: 'Level 3 Delegator · Exception oversight' },
    { i: 'notifications_active', t: 'Alerts', s: 'Critical push · High digest' },
    { i: 'rule', t: 'Learned rules', s: '7 active · 2 awaiting confirmation' },
    { i: 'support_agent', t: 'Preferred vendors', s: '4 configured' }
  ];
  return (
    <Box sx={{ px: 1.5, pt: 1.5 }}>
      <Stack spacing={1}>
        {rows.map((r) => (
          <Card key={r.t} variant="outlined">
            <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
              <Stack direction="row" spacing={1.25} alignItems="center">
                <Box
                  sx={{
                    width: 32, height: 32, borderRadius: '10px',
                    bgcolor: '#F1F5F9', display: 'grid', placeItems: 'center'
                  }}
                >
                  <Icon name={r.i} size={18} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.t}</Typography>
                  <Typography variant="caption">{r.s}</Typography>
                </Box>
                <Icon name="chevron_right" size={20} color="#94A3B8" />
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}

const AI_ACTION_ICON = {
  Elevated: 'keyboard_double_arrow_up',
  Prioritized: 'low_priority',
  Sequenced: 'sort',
  Assigned: 'person_add',
  Bundled: 'dynamic_feed',
  Rescheduled: 'event_repeat',
  Snoozed: 'snooze',
  Dispatched: 'support_agent',
  Forecasted: 'insights',
  'Auto-closed': 'task_alt'
};

function AiActivityList() {
  const [actioned, setActioned] = useState({});
  const items = aiActivity;
  return (
        <Stack spacing={0}>
          {items.map((a, idx) => {
            const tColor = {
              error: '#DC2626', warning: '#D97706', info: '#0EA5E9',
              success: '#16A34A', default: '#64748B'
            }[a.tone] || '#64748B';
            const done = a.status === 'completed';
            const monitoring = a.status === 'monitoring';
            const last = idx === items.length - 1;
            const act = actioned[a.id];
            return (
              <Stack key={a.id} direction="row" spacing={1.25} alignItems="stretch">
                {/* timeline rail */}
                <Stack alignItems="center" sx={{ width: 22, flexShrink: 0 }}>
                  <Box
                    sx={{
                      width: 22, height: 22, borderRadius: '50%', mt: 0.25,
                      bgcolor: done ? '#DCFCE7' : '#EEF2FF',
                      display: 'grid', placeItems: 'center'
                    }}
                  >
                    <Icon
                      name={done ? 'check' : AI_ACTION_ICON[a.action] || 'auto_awesome'}
                      size={13}
                      color={done ? '#16A34A' : '#4338CA'}
                    />
                  </Box>
                  {!last && (
                    <Box sx={{ flex: 1, width: '2px', bgcolor: '#E2E8F0', my: 0.25 }} />
                  )}
                </Stack>

                <Box sx={{ flex: 1, minWidth: 0, pb: last ? 0 : 1.5 }}>
                  <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.25 }}>
                    <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600 }}>
                      {a.ago}
                    </Typography>
                    <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: '#CBD5E1' }} />
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                      {a.clock}
                    </Typography>
                  </Stack>
                  <Card
                    variant="outlined"
                    sx={{
                      borderColor: '#A5B4FC', borderWidth: 1.5, bgcolor: '#FCFCFF'
                    }}
                  >
                    <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
                      <Stack
                        direction="row"
                        spacing={0.5}
                        alignItems="center"
                        flexWrap="wrap"
                        useFlexGap
                        sx={{ mb: 0.5 }}
                      >
                        <Chip
                          size="small"
                          label={a.action}
                          sx={{
                            height: 18, fontSize: 10, fontWeight: 700,
                            bgcolor: toneBg(a.tone), color: '#0F172A',
                            '.MuiChip-label': { px: 0.75 }
                          }}
                        />
                        <Chip
                          size="small"
                          variant="outlined"
                          icon={<Icon name="person" size={11} color="#475569" sx={{ ml: 0.5 }} />}
                          label={`${a.assignee} · ${a.when}`}
                          sx={{
                            height: 18, fontSize: 10, fontWeight: 600,
                            borderColor: '#CBD5E1', color: '#334155',
                            '.MuiChip-label': { px: 0.5 }
                          }}
                        />
                        {a.status === 'in-progress' && (
                          <Chip
                            size="small"
                            label="In progress"
                            sx={{
                              height: 18, fontSize: 10, bgcolor: '#0F172A', color: '#fff',
                              '.MuiChip-label': { px: 0.625 }
                            }}
                          />
                        )}
                        {monitoring && (
                          <Chip
                            size="small"
                            icon={<Icon name="monitoring" size={11} color="#B45309" sx={{ ml: 0.5 }} />}
                            label="Monitoring"
                            sx={{
                              height: 18, fontSize: 10, fontWeight: 700, bgcolor: '#FEF3C7', color: '#B45309',
                              '.MuiChip-label': { px: 0.5 }
                            }}
                          />
                        )}
                        {done && (
                          <Typography variant="caption" sx={{ color: '#16A34A', fontWeight: 700 }}>
                            Completed
                          </Typography>
                        )}
                      </Stack>
                      <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
                        {a.title}
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', mt: 0.25, color: '#475569' }}>
                        {a.detail}
                      </Typography>
                      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                        <Icon name="place" size={12} color="#94A3B8" />
                        <Typography variant="caption">{a.target}</Typography>
                      </Stack>

                      {!done && !monitoring && (
                        act ? (
                          <Box
                            sx={{
                              mt: 1, p: 0.875, borderRadius: 1.5,
                              bgcolor: '#F0FDF4', border: '1px solid #BBF7D0',
                              display: 'flex', alignItems: 'center', gap: 0.75
                            }}
                          >
                            <Icon name="check_circle" size={15} color="#16A34A" />
                            <Typography variant="caption" sx={{ flex: 1, color: '#166534', fontWeight: 600 }}>
                              {act}
                            </Typography>
                            <Button
                              size="small"
                              onClick={() => setActioned((s) => { const n = { ...s }; delete n[a.id]; return n; })}
                              sx={{ minWidth: 0, px: 0.75, fontSize: 12 }}
                            >
                              Undo
                            </Button>
                          </Box>
                        ) : (
                          <Stack direction="row" spacing={0.75} sx={{ mt: 1 }}>
                            {[
                              { k: 'reschedule', icon: 'event_repeat', label: 'Reschedule', msg: 'Rescheduled to tomorrow AM' },
                              { k: 'reassign', icon: 'swap_horiz', label: 'Reassign', msg: 'Reassignment requested' },
                              { k: 'snooze', icon: 'snooze', label: 'Snooze', msg: 'Snoozed 1 hr' }
                            ].map((b) => (
                              <Button
                                key={b.k}
                                size="small"
                                variant="outlined"
                                startIcon={<Icon name={b.icon} size={14} />}
                                onClick={() => setActioned((s) => ({ ...s, [a.id]: b.msg }))}
                                sx={{
                                  flex: 1, py: 0.375, fontSize: 11.5,
                                  borderColor: '#CBD5E1', color: '#334155',
                                  '.MuiButton-startIcon': { mr: 0.375 }
                                }}
                              >
                                {b.label}
                              </Button>
                            ))}
                          </Stack>
                        )
                      )}
                    </CardContent>
                  </Card>
                </Box>
              </Stack>
            );
          })}
        </Stack>
  );
}

function AiActivitySheet({ open, onClose }) {
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 20, borderTopRightRadius: 20,
          maxHeight: '90vh', pb: 'env(safe-area-inset-bottom)'
        }
      }}
    >
      <Box sx={{ pt: 1 }}>
        <Box sx={{ width: 36, height: 4, bgcolor: '#CBD5E1', mx: 'auto', borderRadius: 2 }} />
      </Box>
      <Box sx={{ p: 2, pb: 1 }}>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Box
            sx={{
              width: 36, height: 36, borderRadius: '10px',
              bgcolor: '#EEF2FF', display: 'grid', placeItems: 'center', flexShrink: 0
            }}
          >
            <Icon name="auto_awesome" size={20} color="#4338CA" />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" sx={{ lineHeight: 1.15, fontWeight: 700 }}>
              AI activity
            </Typography>
            <Typography variant="caption">
              Last 24 hours · {aiActivity.length} actions · newest first
            </Typography>
          </Box>
          <IconButton size="small" onClick={onClose}>
            <Icon name="close" size={20} />
          </IconButton>
        </Stack>
      </Box>
      <Box sx={{ px: 2, pb: 2, overflowY: 'auto' }}>
        <AiActivityList />
      </Box>
    </Drawer>
  );
}

function PriorityQueueSheet({ open, onClose, onReason, onReview }) {
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 20, borderTopRightRadius: 20,
          maxHeight: '90vh', pb: 'env(safe-area-inset-bottom)'
        }
      }}
    >
      <Box sx={{ pt: 1 }}>
        <Box sx={{ width: 36, height: 4, bgcolor: '#CBD5E1', mx: 'auto', borderRadius: 2 }} />
      </Box>
      <Box sx={{ p: 2, pb: 1 }}>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Box
            sx={{
              width: 36, height: 36, borderRadius: '10px',
              bgcolor: '#F1F5F9', display: 'grid', placeItems: 'center', flexShrink: 0
            }}
          >
            <Icon name="low_priority" size={20} color="#0F172A" />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" sx={{ lineHeight: 1.15, fontWeight: 700 }}>
              Priority Queue
            </Typography>
            <Typography variant="caption">
              AI-sequenced — review or reprioritize today’s work
            </Typography>
          </Box>
          <IconButton size="small" onClick={onClose}>
            <Icon name="close" size={20} />
          </IconButton>
        </Stack>
      </Box>
      <Box sx={{ px: 1.5, pb: 2, overflowY: 'auto' }}>
        {tiers.map((tier) => (
          <TierSection
            key={tier.id}
            tier={tier}
            onReason={onReason}
            onReview={onReview}
          />
        ))}
      </Box>
    </Drawer>
  );
}

export default function App() {
  const [tab, setTab] = useState(0);
  const [reasonTask, setReasonTask] = useState(null);
  const [overrideOpen, setOverrideOpen] = useState(false);
  const [overrideItem, setOverrideItem] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mode, setMode] = useState('day1');
  const [aiLogOpen, setAiLogOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const [day1Metric, setDay1Metric] = useState(null);
  const [snack, setSnack] = useState(null);
  const calibrated = mode === 'day30' || mode === 'day90';

  const openReason = (t) => setReasonTask(t);
  const closeReason = () => setReasonTask(null);
  const openOverride = (item) => { setOverrideItem(item || null); setOverrideOpen(true); };
  const closeOverride = () => setOverrideOpen(false);

  const handleApprove = (item) => {
    const what =
      item?.recommendations ? item.recommendations[0]?.body
      : item?.recommended || item?.title || 'recommendation';
    setSnack(`Approved · ${what}`);
  };

  const handleFeedback = (kind) => {
    closeReason();
    setSnack(
      kind === 'agree' ? 'Feedback recorded · pattern reinforced'
      : kind === 'disagree' ? 'Feedback recorded · AI will adjust'
      : 'Context noted'
    );
  };

  const handleOverrideChoice = (kind) => {
    closeOverride();
    setSnack(
      kind === 'remember' ? 'New rule saved · AI will remember'
      : kind === 'once' ? 'Treated as one-time override'
      : 'Context added to this decision'
    );
  };

  const handleDay1Respond = ({ kind }) => {
    setDay1Metric(null);
    setSnack(
      kind === 'context' ? 'Context recorded · AI will weight it on the next pass'
      : kind === 'confirm' ? 'Pattern confirmed · AI will start using it'
      : kind === 'dismiss' ? 'Pattern dismissed · AI will stop tracking it'
      : kind === 'reinforce' ? 'Override reinforced · AI will treat it as a rule'
      : 'Decision queued for revisit'
    );
  };

  return (
   <ModeContext.Provider value={mode}>
    <Box
      sx={{
        width: '100%',
        height: '100%',
        bgcolor: '#F1F5F9',
        position: 'relative',
        pt: HEADER_OFFSET,
        pb: 9,
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
    >
      <TopBar
        onNotif={() => { setTab(0); setSnack('3 items need your review'); }}
        onMenu={() => setMenuOpen((v) => !v)}
        menuOpen={menuOpen}
        mode={mode}
        onMode={setMode}
        onAdd={() => setSnack('New work order request — not in this prototype')}
      />

      {tab === 0 && <TodayTab openReason={openReason} openOverride={openOverride} onApprove={handleApprove} onPriorities={() => setPriorityOpen(true)} onCalibration={() => setCalOpen(true)} onDay1Metric={(k) => setDay1Metric(k)} />}
      {tab === 1 && <ScheduleTab />}
      {tab === 2 && <WorkTab />}
      {tab === 3 && <KPIsTab />}
      {tab === 4 && <SettingsTab />}

      <Paper
        elevation={0}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          bgcolor: '#fff',
          borderTop: '1px solid #E2E8F0',
          pb: 'env(safe-area-inset-bottom)',
          zIndex: 1100
        }}
      >
        <BottomNavigation
          showLabels
          value={tab > 2 ? false : tab}
          onChange={(_, v) => setTab(v)}
          sx={{ height: 60 }}
        >
          <BottomNavigationAction
            label="Dispatch"
            icon={
              <Badge
                color="error"
                badgeContent={reviews.length + 1}
                overlap="circular"
                sx={{ '.MuiBadge-badge': { fontSize: 10, height: 16, minWidth: 16 } }}
              >
                <Icon name="bolt" size={22} />
              </Badge>
            }
          />
          <BottomNavigationAction
            label="Schedule"
            icon={<Icon name="calendar_month" size={22} />}
          />
          <BottomNavigationAction
            label="Work"
            icon={<Icon name="handyman" size={22} />}
          />
        </BottomNavigation>
      </Paper>

      <Drawer
        anchor="top"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        transitionDuration={180}
        sx={{ zIndex: 1090 }}
        slotProps={{
          backdrop: {
            sx: { top: HEADER_OFFSET, bgcolor: 'rgba(15,23,42,0.45)' }
          }
        }}
        PaperProps={{
          sx: {
            width: '100%',
            top: HEADER_OFFSET,
            bgcolor: '#004C9A',
            color: '#fff',
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20
          }
        }}
      >
        <Box sx={{ p: 1.5, pt: 2, pb: 2.5 }}>
          {[
            { label: 'Dispatch', icon: 'bolt', tab: 0 },
            { label: 'Schedule', icon: 'calendar_month', tab: 1 },
            { label: 'Work', icon: 'handyman', tab: 2 },
            { label: 'AI activity', icon: 'auto_awesome', action: 'aiLog' },
            ...(calibrated
              ? [{ label: 'Coordination Settings', icon: 'verified_user', action: 'calibration' }]
              : []),
            { label: 'KPIs', icon: 'monitoring', tab: 3 },
            { label: 'Settings', icon: 'tune', tab: 4 }
          ].map((m, i) => {
            const active = m.tab != null && tab === m.tab;
            return (
              <Grow
                key={m.label}
                in={menuOpen}
                timeout={200}
                style={{ transitionDelay: menuOpen ? `${40 + i * 35}ms` : '0ms', transformOrigin: 'top' }}
              >
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  onClick={() => {
                    if (m.action === 'aiLog') setAiLogOpen(true);
                    else if (m.action === 'calibration') setCalOpen(true);
                    else setTab(m.tab);
                    setMenuOpen(false);
                  }}
                  sx={{
                    px: 1.5, py: 1.5, borderRadius: 2, cursor: 'pointer',
                    bgcolor: active ? 'rgba(255,255,255,0.16)' : 'transparent',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.10)' }
                  }}
                >
                  <Icon name={m.icon} size={22} color="#fff" />
                  <Typography
                    sx={{ fontSize: 16, fontWeight: active ? 700 : 600, color: '#fff', letterSpacing: '-0.18px' }}
                  >
                    {m.label}
                  </Typography>
                </Stack>
              </Grow>
            );
          })}
        </Box>
      </Drawer>

      <ReasoningSheet
        open={Boolean(reasonTask)}
        task={reasonTask}
        onClose={closeReason}
        onFeedback={handleFeedback}
      />
      <OverrideSheet
        open={overrideOpen}
        item={overrideItem}
        onClose={closeOverride}
        onChoose={handleOverrideChoice}
      />
      <AiActivitySheet open={aiLogOpen} onClose={() => setAiLogOpen(false)} />
      <PriorityQueueSheet
        open={priorityOpen}
        onClose={() => setPriorityOpen(false)}
        onReason={openReason}
        onReview={openOverride}
      />
      <CalibrationSheet open={calOpen} onClose={() => setCalOpen(false)} />
      <Day1MetricSheet
        open={Boolean(day1Metric)}
        metricKey={day1Metric}
        onClose={() => setDay1Metric(null)}
        onRespond={handleDay1Respond}
      />

      <Snackbar
        open={Boolean(snack)}
        autoHideDuration={2600}
        onClose={() => setSnack(null)}
        message={snack}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          mb: 10,
          zIndex: 1400,
          '& .MuiSnackbarContent-root': {
            bgcolor: '#0F172A', color: '#fff', fontWeight: 600,
            borderRadius: 2, minWidth: 'auto'
          }
        }}
      />
    </Box>
   </ModeContext.Provider>
  );
}
