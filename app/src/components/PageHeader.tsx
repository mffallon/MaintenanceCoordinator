import { ReactNode } from 'react';
import {
  Box, Typography, FormControl, InputLabel, Select, MenuItem,
  Tabs, Tab, IconButton,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

interface PageHeaderTab {
  label: string;
  value: number;
}

interface Props {
  title: string;
  community?: string;
  onCommunityChange?: (value: string) => void;
  tabs?: PageHeaderTab[];
  activeTab?: number;
  onTabChange?: (value: number) => void;
  actions?: ReactNode;
}

const communities = [
  'All Communities',
  'Northeast Region',
  'Southeast Region',
  'Midwest Region',
  'West Region',
  'Central Region',
  'Southwest Region',
];

export default function PageHeader({
  title,
  community = 'All Communities',
  onCommunityChange,
  tabs,
  activeTab = 0,
  onTabChange,
  actions,
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
      {/* Title row */}
      <Box sx={{ px: 3, pt: 2, pb: tabs ? 0 : 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
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
          {actions}
        </Box>

        {/* Communities filter */}
        <FormControl variant="outlined" size="small" sx={{ minWidth: 260, mb: tabs ? 1.5 : 0 }}>
          <InputLabel shrink sx={{ fontSize: '0.75rem' }}>Communities</InputLabel>
          <Select
            value={community}
            label="Communities"
            onChange={(e) => onCommunityChange?.(e.target.value)}
            notched
            endAdornment={
              community !== 'All Communities' ? (
                <IconButton
                  size="small"
                  onClick={(e) => { e.stopPropagation(); onCommunityChange?.('All Communities'); }}
                  sx={{ mr: 2 }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              ) : undefined
            }
            sx={{
              bgcolor: '#FFFFFF',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E0E4E7' },
              fontSize: '0.875rem',
            }}
          >
            {communities.map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </Select>
        </FormControl>
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
