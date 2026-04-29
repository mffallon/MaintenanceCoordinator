import { Box, Typography, Paper } from '@mui/material';
import SurveyWindowIndicator from '../components/SurveyWindowIndicator';

const STATES: { label: string; months: number; description: string }[] = [
  { label: 'Default',              months: 3.2,  description: 'Outside 90-day approach — more than 3 months from window start' },
  { label: 'Approach (90 days)',   months: 6.2,  description: '6 ≤ months < 8 — within 90 days of window open' },
  { label: 'Warning (30 days)',    months: 8.2,  description: '8 ≤ months < 9 — within 30 days of window open' },
  { label: 'In window',            months: 9.4,  description: 'months ≥ 9 — inside the 9–15 month survey window' },
  { label: 'Clamped at 15',        months: 16.5, description: 'months > 15 — arrow clamps to end of track' },
];

export default function SurveyIndicatorDemo() {
  return (
    <Box sx={{ p: 4, maxWidth: 720, mx: 'auto' }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>SurveyWindowIndicator — all states</Typography>
      <Typography variant="body2" sx={{ color: '#64748B', mb: 4 }}>
        Visual check: arrow position, band color, and clamping behavior.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {STATES.map(({ label, months, description }) => (
          <Paper key={label} elevation={0} sx={{ border: '1px solid #e0e4e7', borderRadius: 2, p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
              <Box sx={{ minWidth: 200 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#293036', mb: 0.5 }}>
                  {label}
                </Typography>
                <Typography sx={{ fontSize: '12px', color: '#64748B', mb: 0.5 }}>
                  monthsSinceLastSurvey={months}
                </Typography>
                <Typography sx={{ fontSize: '12px', color: '#64748B' }}>
                  {description}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, pt: 0.5 }}>
                <SurveyWindowIndicator monthsSinceLastSurvey={months} />
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
