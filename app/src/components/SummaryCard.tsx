import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { ReactNode } from 'react';

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  color?: string;
  trend?: { value: string; positive: boolean };
  chip?: { label: string; color: 'error' | 'warning' | 'success' | 'info' };
}

export default function SummaryCard({ title, value, subtitle, icon, color = '#1565C0', trend, chip }: Props) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', fontSize: '0.8rem' }}>
            {title}
          </Typography>
          <Box
            sx={{
              width: 38, height: 38, borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              bgcolor: `${color}14`, color,
            }}
          >
            {icon}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.1 }}>
            {value}
          </Typography>
          {chip && (
            <Chip label={chip.label} color={chip.color} size="small" sx={{ height: 22, fontSize: '0.7rem' }} />
          )}
        </Box>
        {subtitle && (
          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
            {subtitle}
          </Typography>
        )}
        {trend && (
          <Typography
            variant="caption"
            sx={{ mt: 1, display: 'block', color: trend.positive ? 'success.main' : 'error.main', fontWeight: 600 }}
          >
            {trend.positive ? '↑' : '↓'} {trend.value}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
