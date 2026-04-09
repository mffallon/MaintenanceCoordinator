import { Box, FormControl, InputLabel, Select, MenuItem, Divider } from '@mui/material';
import type { ReactNode } from 'react';
import { CommunityFilter } from './CommunityFilter';

interface Props {
  dateRange?: string;
  onDateRangeChange?: (value: string) => void;
  extraFilters?: ReactNode;
  afterFilters?: ReactNode;
  actions?: ReactNode;
}

export default function PageFilters({ dateRange, onDateRangeChange, extraFilters, afterFilters, actions }: Props) {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
      <Box sx={{ minWidth: 280 }}>
        <CommunityFilter />
      </Box>
      {extraFilters}
      {dateRange !== undefined && onDateRangeChange && (
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Date range</InputLabel>
          <Select value={dateRange} label="Date range" onChange={(e) => onDateRangeChange(e.target.value)}>
            <MenuItem value="all">All time</MenuItem>
            <MenuItem value="ytd">Year to date</MenuItem>
            <MenuItem value="30d">Last 30 days</MenuItem>
            <MenuItem value="60d">Last 60 days</MenuItem>
            <MenuItem value="90d">Last 90 days</MenuItem>
            <Divider />
            <MenuItem value="2026-04">April 2026</MenuItem>
            <MenuItem value="2026-03">March 2026</MenuItem>
            <MenuItem value="2026-02">February 2026</MenuItem>
            <MenuItem value="2026-01">January 2026</MenuItem>
          </Select>
        </FormControl>
      )}
      {afterFilters}
      {actions && (
        <>
          <Box sx={{ flexGrow: 1 }} />
          {actions}
        </>
      )}
    </Box>
  );
}
