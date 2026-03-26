import { ReactNode } from 'react';
import { Box, Typography, Tabs, Tab, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CommunityFilter } from './CommunityFilter';

interface PageHeaderTab {
  label: string;
  value: number;
}

interface Props {
  title: string;
  tabs?: PageHeaderTab[];
  activeTab?: number;
  onTabChange?: (value: number) => void;
  actions?: ReactNode;
  subtitle?: string;
  hideCommunity?: boolean;
  backLabel?: string;
  onBack?: () => void;
}

export default function PageHeader({
  title,
  tabs,
  activeTab = 0,
  onTabChange,
  actions,
  subtitle,
  hideCommunity = false,
  backLabel,
  onBack,
}: Props) {
  return (
    <Box
      sx={{
        bgcolor: '#F7F8F9',
        mx: -3,
        mt: -3,
        mb: 2,
        borderBottom: '1px solid #E0E4E7',
      }}
    >
      <Box sx={{ px: 3, pt: 2, pb: tabs ? 0 : 2 }}>
        {/* Back link */}
        {backLabel && onBack && (
          <Button
            variant="text"
            size="small"
            startIcon={<ArrowBackIcon sx={{ fontSize: '14px !important' }} />}
            onClick={onBack}
            sx={{ mb: 0.5, ml: -1, p: 0, minWidth: 'unset', color: '#8492a1', fontWeight: 400, fontSize: '0.8rem', bgcolor: 'transparent', '&:hover': { bgcolor: 'transparent', color: '#293036' } }}
          >
            {backLabel}
          </Button>
        )}
        {/* Title row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: '24px',
                color: '#000000',
                letterSpacing: '-0.46px',
                lineHeight: 1.333,
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.8rem',
                color: '#8492a1',
                fontWeight: 400,
                whiteSpace: 'nowrap',
              }}
            >
              Jan 2024 – Mar 2026
            </Typography>
          </Box>
          {actions}
        </Box>
        {subtitle && (
          <Typography sx={{ color: '#64748B', fontSize: '0.875rem', mt: -1, mb: 0.5 }}>
            {subtitle}
          </Typography>
        )}

        {/* Communities filter — hierarchical tree picker */}
        {!hideCommunity && (
          <Box sx={{ mb: tabs ? 1.5 : 0 }}>
            <CommunityFilter />
          </Box>
        )}
      </Box>

      {/* Sub-tabs (Level 3) — only if tabs provided */}
      {tabs && (
        <Box sx={{ px: 3, borderTop: 'none' }}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => onTabChange?.(v)}
            sx={{
              minHeight: 36,
              '& .MuiTab-root': {
                minHeight: 36,
                py: 1,
                px: 1.5,
                fontSize: '14px',
                fontWeight: 500,
                color: '#293036',
                letterSpacing: '-0.06px',
                textTransform: 'none',
                '&.Mui-selected': { fontWeight: 700, color: '#293036' },
              },
              '& .MuiTabs-indicator': {
                bgcolor: '#0065BD',
                height: 2,
                borderRadius: '1px 1px 0 0',
              },
            }}
          >
            {tabs.map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
        </Box>
      )}
    </Box>
  );
}
