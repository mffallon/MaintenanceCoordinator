import { Card, CardContent, CardActionArea, Typography, Box, Chip, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { ReactNode } from 'react';

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  color?: string;
  trend?: { value: string; positive: boolean };
  chip?: { label: string; color: 'error' | 'warning' | 'success' | 'info' };
  action?: { label: string; onClick: () => void };
}

export default function SummaryCard({ title, value, subtitle, icon, color = '#0065BD', trend, chip, action }: Props) {
  const content = (
    <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
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
      {action && (
        <Box sx={{ mt: 'auto', pt: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#0065BD', fontSize: '0.75rem' }}>
            {action.label}
          </Typography>
          <ArrowForwardIcon sx={{ fontSize: '0.85rem', color: '#0065BD' }} />
        </Box>
      )}
    </CardContent>
  );

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {action ? (
        <CardActionArea
          onClick={action.onClick}
          sx={{
            flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch',
            '& .MuiCardActionArea-focusHighlight': { background: 'transparent' },
          }}
        >
          {content}
        </CardActionArea>
      ) : (
        content
      )}
    </Card>
  );
}
