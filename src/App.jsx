import React, { useMemo, useState } from 'react';
import {
  AppBar, Toolbar, Box, Typography, IconButton, Badge, Chip, Card, CardContent,
  Stack, Button, Alert, AlertTitle, LinearProgress, Divider, BottomNavigation,
  BottomNavigationAction, Drawer, Paper, Snackbar, Avatar
} from '@mui/material';
import { community, readiness, aiBanner, weather, tiers, reviews, mdSchedule, team, rescheduleOptions } from './data.js';
import { ToggleButton, ToggleButtonGroup, Collapse, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress } from '@mui/material';

const Icon = ({ name, size = 20, color, sx }) => (
  <span
    className="material-symbols-rounded"
    style={{ fontSize: size, color, lineHeight: 1, ...sx }}
  >
    {name}
  </span>
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

const NOW_HOUR = 9.5;

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
  const h = /^(\d+(?:\.\d+)?)h$/.exec(d);
  if (h) return Number(h[1]);
  const m = /^(\d+)m$/.exec(d);
  if (m) return Number(m[1]) / 60;
  return 0;
}

function DayBar({ shift, tasks }) {
  const s = parseShift(shift);
  if (!s) return null;
  const span = s.end - s.start;
  const nowPct = Math.max(0, Math.min(100, ((NOW_HOUR - s.start) / span) * 100));
  const BAR_H = 10;
  const OVERHANG = 8;
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
        {tasks.map((t, i) => {
          const start = parseTime(t.time);
          const dur = parseDur(t.dur);
          if (start == null || !dur) return null;
          const left = ((start - s.start) / span) * 100;
          const width = (dur / span) * 100;
          if (left + width < 0 || left > 100) return null;
          const completed = start + dur <= NOW_HOUR;
          const inProgress = start < NOW_HOUR && start + dur > NOW_HOUR;
          const toneMap = {
            error: '#DC2626', warning: '#D97706', info: '#0EA5E9',
            success: '#16A34A', default: '#94A3B8'
          };
          const base = toneMap[t.tone] || toneMap.default;
          const fill = completed ? '#CBD5E1' : inProgress ? '#2563EB' : 'transparent';
          const stroke = completed ? '#CBD5E1' : inProgress ? '#2563EB' : base;
          return (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                top: 0,
                left: `${Math.max(0, left)}%`,
                width: `${Math.min(100 - Math.max(0, left), width)}%`,
                height: '100%',
                bgcolor: fill,
                border: completed || inProgress ? 'none' : `1.5px solid ${stroke}`,
                borderRadius: 3
              }}
            />
          );
        })}
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${nowPct}%`,
          width: 0,
          borderLeft: '2px dotted #0F172A',
          zIndex: 2
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: `calc(${nowPct}% - 4px)`,
          width: 8, height: 4, bgcolor: '#0F172A', borderRadius: 1, zIndex: 3
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: `calc(${nowPct}% - 4px)`,
          width: 8, height: 4, bgcolor: '#0F172A', borderRadius: 1, zIndex: 3
        }}
      />
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

function TopBar({ onNotif }) {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: '#0F172A',
        color: '#fff',
        borderBottom: '1px solid #1E293B',
        left: '50%',
        transform: 'translateX(-50%)',
        width: { xs: '100vw', sm: 390 },
        maxWidth: '100%',
        zIndex: 1100
      }}
    >
      <Toolbar sx={{ minHeight: 56, px: 1.5, gap: 1 }}>
        <Box
          sx={{
            width: 32, height: 32, borderRadius: '8px',
            bgcolor: '#1E293B', display: 'grid', placeItems: 'center'
          }}
        >
          <Icon name="hub" size={20} color="#60A5FA" />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ lineHeight: 1.1, fontWeight: 700 }}>
            Connected Community
          </Typography>
          <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', lineHeight: 1.2 }}>
            {community.name} · {community.shift}
          </Typography>
        </Box>
        <Chip
          size="small"
          icon={<Icon name="auto_awesome" size={14} color="#34D399" sx={{ ml: 0.5 }} />}
          label={community.aiStatus}
          sx={{
            bgcolor: 'rgba(52,211,153,0.12)',
            color: '#34D399',
            border: '1px solid rgba(52,211,153,0.3)',
            height: 24,
            '.MuiChip-label': { px: 0.75, fontSize: 11 }
          }}
        />
        <IconButton onClick={onNotif} sx={{ color: '#E2E8F0', ml: 0.5 }} size="small">
          <Badge color="error" badgeContent={3} overlap="circular">
            <Icon name="notifications" size={22} />
          </Badge>
        </IconButton>
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

function WeatherCard() {
  return (
    <Box sx={{ px: 1.5, pt: 1.25 }}>
      <Card variant="outlined" sx={{ borderColor: '#BAE6FD', bgcolor: '#F0F9FF' }}>
        <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 32, height: 32, borderRadius: '10px',
                bgcolor: '#E0F2FE', display: 'grid', placeItems: 'center'
              }}
            >
              <Icon name="ac_unit" size={20} color="#0369A1" />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#075985' }}>
                {weather.headline}
              </Typography>
              <Typography variant="caption" sx={{ color: '#0C4A6E' }}>
                {weather.body}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

function TaskCard({ task, onReason, onReview }) {
  const statusTone =
    task.status === 'At risk' ? 'error'
    : task.status === 'In progress' ? 'info'
    : task.status === 'On track' ? 'success'
    : 'default';
  return (
    <Card variant="outlined" sx={{ borderColor: '#E2E8F0' }}>
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
            </Stack>
            <Typography variant="caption" sx={{ display: 'block', mt: 0.75, color: '#475569' }}>
              {task.reason}
            </Typography>
          </Box>
          <Stack alignItems="flex-end" spacing={0.5}>
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
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
              {item.kind}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
              {item.summary}
            </Typography>
          </Box>
        </Stack>
        <Box
          sx={{
            bgcolor: '#F8FAFC', borderRadius: 1.5, p: 1, mb: 1,
            border: '1px solid #E2E8F0'
          }}
        >
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.25 }}>
            <Icon name="auto_awesome" size={14} color="#4338CA" />
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#4338CA' }}>
              AI Recommendation
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ fontSize: 12.5, mb: 0.5 }}>
            {item.recommended}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B' }}>
            Tradeoff: {item.tradeoff}
          </Typography>
        </Box>
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
          <IconButton size="small" sx={{ border: '1px solid #E2E8F0', borderRadius: 1.5 }}>
            <Icon name="add_comment" size={18} />
          </IconButton>
        </Stack>
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
                Jake’s afternoon PM to tomorrow. This protects the move-in window
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
            body="Deferred a Tier-4 PM by 24 hrs to free Jake’s afternoon capacity for unit-turn risk."
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

function OverrideSheet({ open, onClose, onChoose }) {
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
          <Typography variant="subtitle1">Override recorded</Typography>
        </Stack>
        <Typography variant="body2" sx={{ color: '#475569', mb: 1.5 }}>
          You reassigned <b>Jake to Unit 214</b> and moved <b>PM filter replacement</b> to
          tomorrow. Should I treat this as one-time or remember the rule?
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

function TodayTab({ openReason, openOverride }) {
  return (
    <>
      <Box sx={{ mt: 1.5 }}>
        <AIBanner onAccept={openOverride} onReview={() => {}} />
      </Box>
      <WeatherCard />

      <Box sx={{ px: 1.5, pt: 1.75 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Priority Queue
          </Typography>
          <Chip
            size="small"
            icon={<Icon name="auto_awesome" size={12} color="#4338CA" sx={{ ml: 0.5 }} />}
            label="AI sequenced"
            sx={{ height: 22, bgcolor: '#EEF2FF', color: '#4338CA' }}
          />
        </Stack>
        {tiers.map((tier) => (
          <TierSection
            key={tier.id}
            tier={tier}
            onReason={openReason}
            onReview={openOverride}
          />
        ))}
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
            Needs MD Review
          </Typography>
          <Typography variant="caption">
            Exceptions the AI flagged for your call
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
              <DetailRow icon="schedule" label="Scheduled" value={`${item.time} · ${item.dur}`} />
              <DetailRow icon="place" label="Location" value={item.location} />
              <DetailRow icon="person" label="Assignee" value={item.assignee || 'Jake R.'} />
              <DetailRow icon="trending_up" label="KPI" value={item.kpi || 'PM Comp. · Resident Sat.'} />
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
              <ActivityRow who="AI" when="7:02 AM" body="Sequenced as part of Jake’s morning route." />
              <ActivityRow who="Jake R." when="7:30 AM" body="Picked up parts from shop." />
              {status === 'completed' && (
                <ActivityRow who="Jake R." when="—" body="Marked complete." tone="success" />
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
        {who === 'AI' ? <Icon name="auto_awesome" size={11} color="#4338CA" /> : who.split(' ').map((n) => n[0]).join('')}
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
              <Typography variant="caption">· {opt.dur}</Typography>
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
                    {tech.split(' ').map((n) => n[0]).join('')}
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
  const start = parseTime(item.time);
  const dur = parseDur(item.dur);
  const completed = start != null && dur > 0 && start + dur <= NOW_HOUR;
  const inProgress = start != null && dur > 0 && start < NOW_HOUR && start + dur > NOW_HOUR;
  const status = completed ? 'completed' : inProgress ? 'in-progress' : 'queued';
  const stop = (e) => e.stopPropagation();

  if (completed) {
    return (
      <>
      <Card
        variant="outlined"
        sx={{ borderColor: '#E2E8F0', bgcolor: '#F8FAFC', cursor: 'pointer' }}
        onClick={() => setDetailsOpen(true)}
      >
        <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ width: 56, flexShrink: 0 }}>
              <Typography sx={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>
                {item.time}
              </Typography>
            </Box>
            <Box
              sx={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                bgcolor: '#DCFCE7', display: 'grid', placeItems: 'center'
              }}
            >
              <Icon name="check" size={14} color="#16A34A" />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                noWrap
                sx={{
                  color: '#94A3B8',
                  textDecoration: 'line-through',
                  textDecorationColor: '#CBD5E1',
                  fontSize: 12.5
                }}
              >
                {item.title}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: '#16A34A', fontWeight: 700, flexShrink: 0 }}>
              Done
            </Typography>
          </Stack>
        </CardContent>
      </Card>
      <WorkOrderSheet
        open={detailsOpen}
        item={item}
        status={status}
        onClose={() => setDetailsOpen(false)}
        onReschedule={() => { setDetailsOpen(false); setRescheduleOpen(true); }}
      />
      <RescheduleSheet
        open={rescheduleOpen}
        item={item}
        onClose={() => setRescheduleOpen(false)}
        onConfirm={(opt) => { setConfirmation(opt); setRescheduleOpen(false); }}
      />
      </>
    );
  }

  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: inProgress ? '#0F172A' : '#E2E8F0',
        borderWidth: inProgress ? 1.5 : 1,
        cursor: 'pointer'
      }}
      onClick={() => setDetailsOpen(true)}
    >
      <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
        <Stack direction="row" spacing={1.25} alignItems="flex-start">
          <Box sx={{ width: 56, flexShrink: 0 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 13 }}>{item.time}</Typography>
            <Typography variant="caption">{item.dur}</Typography>
          </Box>
          <Box
            sx={{
              width: 32, height: 32, borderRadius: '10px', flexShrink: 0,
              bgcolor: toneBg(item.tone), display: 'grid', placeItems: 'center'
            }}
          >
            <Icon name={item.icon} size={18} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                {item.kind}
              </Typography>
              {inProgress && (
                <Chip
                  size="small"
                  label="In progress"
                  sx={{
                    height: 16, fontSize: 10, bgcolor: '#0F172A', color: '#fff',
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
  const pct = member.capacity ? Math.min(120, (member.load / member.capacity) * 100) : 0;
  const tone =
    member.status === 'Over capacity' ? 'error'
    : member.status === 'Has capacity' ? 'success'
    : member.status === 'Out today' ? 'default'
    : 'info';
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
            {member.name.split(' ').map((n) => n[0]).join('')}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ lineHeight: 1.1, fontWeight: 700 }}>
              {member.name}
            </Typography>
            <Typography variant="caption">
              {member.role} · {member.shift}
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
                label={member.status}
                sx={{
                  height: 20, fontSize: 11,
                  bgcolor: toneBg(tone), color: '#0F172A',
                  '.MuiChip-label': { px: 0.75 }
                }}
              />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {member.load} / {member.capacity} hrs
              </Typography>
            </Stack>
            <DayBar shift={member.shift} tasks={member.tasks} />
            <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
              <Typography variant="caption" sx={{ color: '#64748B' }}>
                {member.shift}
              </Typography>
              <Typography variant="caption" sx={{ color: '#0F172A', fontWeight: 600 }}>
                Now · 9:30 AM
              </Typography>
            </Stack>
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
            {member.tasks.map((t, i) => (
              <TimelineItem key={i} item={t} />
            ))}
          </Stack>
        )}
      </Box>
    </Drawer>
  );
}

function ScheduleTab() {
  const [view, setView] = useState('my');
  const [openMember, setOpenMember] = useState(null);
  return (
    <Box sx={{ px: 1.5, pt: 1.5 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Schedule
          </Typography>
          <Typography variant="caption">
            {view === 'my' ? 'Your day · Fri, May 16' : 'Team coverage · Day shift'}
          </Typography>
        </Box>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={view}
          onChange={(_, v) => v && setView(v)}
          sx={{
            '.MuiToggleButton-root': {
              px: 1.25, py: 0.25, fontSize: 12, fontWeight: 600,
              textTransform: 'none', border: '1px solid #E2E8F0'
            },
            '.Mui-selected': { bgcolor: '#0F172A !important', color: '#fff !important' }
          }}
        >
          <ToggleButton value="my">My Day</ToggleButton>
          <ToggleButton value="team">Team</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {view === 'my' ? (
        <Stack spacing={1}>
          <Card variant="outlined" sx={{ bgcolor: '#F8FAFC', borderColor: '#E2E8F0' }}>
            <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Icon name="auto_awesome" size={16} color="#4338CA" />
                <Typography variant="caption" sx={{ color: '#4338CA', fontWeight: 600 }}>
                  AI sequenced your day around 2 approvals and 1 walkthrough
                </Typography>
              </Stack>
            </CardContent>
          </Card>
          {mdSchedule.map((item) => (
            <TimelineItem key={item.id} item={item} />
          ))}
        </Stack>
      ) : (
        <Stack spacing={1}>
          {team.map((p) => {
            const pct = p.capacity ? Math.min(120, (p.load / p.capacity) * 100) : 0;
            const tone =
              p.status === 'Over capacity' ? 'error'
              : p.status === 'Has capacity' ? 'success'
              : p.status === 'Out today' ? 'default'
              : 'info';
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
                    <Avatar sx={{ bgcolor: '#E2E8F0', color: '#0F172A', width: 36, height: 36, fontSize: 13 }}>
                      {p.name.split(' ').map((n) => n[0]).join('')}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" alignItems="center" spacing={0.75}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{p.name}</Typography>
                        <Typography variant="caption">· {p.role}</Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.75}>
                        <Typography variant="caption">{p.shift}</Typography>
                        <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: '#CBD5E1' }} />
                        <Chip
                          size="small"
                          label={p.status}
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
                          <DayBar shift={p.shift} tasks={p.tasks} />
                          <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.25 }}>
                            <Typography variant="caption" sx={{ color: '#64748B' }}>
                              {p.load} / {p.capacity} hrs scheduled
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#0F172A', fontWeight: 600 }}>
                              Now · 9:30 AM
                            </Typography>
                          </Stack>
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
    { i: 'manage_accounts', t: 'Account', s: 'Maintenance Director · Cedar Ridge' },
    { i: 'auto_awesome', t: 'AI behavior', s: 'Level 3 Delegator · Exception oversight' },
    { i: 'notifications_active', t: 'Alerts', s: 'Tier 1 push · Tier 2 digest' },
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

export default function App() {
  const [tab, setTab] = useState(0);
  const [reasonTask, setReasonTask] = useState(null);
  const [overrideOpen, setOverrideOpen] = useState(false);
  const [snack, setSnack] = useState(null);

  const openReason = (t) => setReasonTask(t);
  const closeReason = () => setReasonTask(null);
  const openOverride = () => setOverrideOpen(true);
  const closeOverride = () => setOverrideOpen(false);

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

  return (
    <Box
      sx={{
        width: { xs: '100vw', sm: 390 },
        maxWidth: '100%',
        minHeight: { xs: '100vh', sm: '100dvh' },
        bgcolor: '#F1F5F9',
        position: 'relative',
        pt: 7,
        pb: 9,
        boxShadow: { sm: '0 0 60px rgba(15,23,42,0.12)' },
        overflowX: 'hidden'
      }}
    >
      <TopBar onNotif={() => setSnack('3 new alerts')} />

      {tab === 0 && <TodayTab openReason={openReason} openOverride={openOverride} />}
      {tab === 1 && <QueueTab openReason={openReason} openOverride={openOverride} />}
      {tab === 2 && <ScheduleTab />}
      {tab === 3 && <ReviewsTab openOverride={openOverride} />}
      {tab === 4 && <KPIsTab />}

      <Paper
        elevation={0}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: { xs: '100vw', sm: 390 },
          maxWidth: '100%',
          borderTop: '1px solid #E2E8F0',
          pb: 'env(safe-area-inset-bottom)',
          zIndex: 1100
        }}
      >
        <BottomNavigation
          showLabels
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ height: 60 }}
        >
          <BottomNavigationAction
            label="Today"
            icon={<Icon name="today" size={22} />}
          />
          <BottomNavigationAction
            label="Queue"
            icon={<Icon name="list_alt" size={22} />}
          />
          <BottomNavigationAction
            label="Schedule"
            icon={<Icon name="calendar_month" size={22} />}
          />
          <BottomNavigationAction
            label="Risks"
            icon={<Icon name="report" size={22} />}
          />
          <BottomNavigationAction
            label="KPIs"
            icon={<Icon name="monitoring" size={22} />}
          />
        </BottomNavigation>
      </Paper>

      <ReasoningSheet
        open={Boolean(reasonTask)}
        task={reasonTask}
        onClose={closeReason}
        onFeedback={handleFeedback}
      />
      <OverrideSheet
        open={overrideOpen}
        onClose={closeOverride}
        onChoose={handleOverrideChoice}
      />

      <Snackbar
        open={Boolean(snack)}
        autoHideDuration={2400}
        onClose={() => setSnack(null)}
        message={snack}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ mb: 9 }}
      />
    </Box>
  );
}
