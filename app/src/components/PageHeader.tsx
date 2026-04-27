import { ReactNode } from 'react';
import React from 'react';
import { Box, Typography, Tabs, Tab, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface PageHeaderTab {
  label: string;
  value: number;
}

interface Props {
  title: React.ReactNode;
  tabs?: PageHeaderTab[];
  activeTab?: number;
  onTabChange?: (value: number) => void;
  actions?: ReactNode;
  subtitle?: React.ReactNode;
  backLabel?: string;
  onBack?: () => void;
  /** Renders with gray bg + bottom border (used on facility/community detail pages) */
  bordered?: boolean;
}

export default function PageHeader({
  title,
  tabs,
  activeTab = 0,
  onTabChange,
  actions,
  subtitle,
  backLabel,
  onBack,
  bordered = false,
}: Props) {
  return (
    <Box
      sx={{
        ml: -3,
        mt: -3,
        mb: 2,
        width: 'calc(100vw - 256px)',
        ...(bordered && {
          bgcolor: '#f7f8f9',
          borderBottom: '1px solid #e0e4e7',
        }),
      }}
    >
      <Box sx={{ px: '22px', pt: '17px', pb: tabs ? 0 : '17px' }}>
        {/* Back link — breadcrumb style per Figma */}
        {backLabel && onBack && (
          <Box
            onClick={onBack}
            sx={{
              display: 'flex', alignItems: 'center', gap: 0.75, mb: '8px', cursor: 'pointer',
              color: '#5c6874', '&:hover': { color: '#293036' },
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 16 }} />
            <Typography sx={{ fontSize: '14px', fontWeight: 400, lineHeight: 1.5, letterSpacing: '-0.07px' }}>
              {backLabel}
            </Typography>
          </Box>
        )}
        {/* Title row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: subtitle ? 0 : 0 }}>
          <Typography
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: '24px',
              color: '#293036',
              letterSpacing: '-0.456px',
              lineHeight: '32px',
            }}
          >
            {title}
          </Typography>
          {actions}
        </Box>
        {subtitle && (
          <Box sx={{ mt: '4px', mb: 0 }}>{subtitle}</Box>
        )}
      </Box>

      {/* Tabs */}
      {tabs && (
        <Box sx={{ px: '22px' }}>
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
