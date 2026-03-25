import { createTheme } from '@mui/material/styles';

// Aligned with DSX MUI Figma design system
// primary/main: #0065bd, text/primary: #293036, fontFamily: Inter, fontWeightSemiBold: 600
export const theme = createTheme({
  palette: {
    primary: { main: '#0065BD', light: '#3D8FD4', dark: '#004A8C' },
    secondary: { main: '#7B1FA2', light: '#BA68C8', dark: '#4A148C' },
    error: { main: '#D32F2F', light: '#EF5350' },
    warning: { main: '#ED6C02', light: '#FF9800' },
    success: { main: '#2E7D32', light: '#66BB6A' },
    info: { main: '#0288D1' },
    background: { default: '#ECEEF0', paper: '#FFFFFF' },
    text: { primary: '#293036', secondary: '#64748B' },
    action: { active: '#293036' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700, fontSize: '1.75rem' },
    h5: { fontWeight: 600, fontSize: '1.25rem' },
    h6: { fontWeight: 600, fontSize: '1.1rem' },
    subtitle1: { fontWeight: 500, color: '#64748B' },
    subtitle2: { fontWeight: 600, fontSize: '0.875rem' },
    body2: { color: '#64748B' },
    button: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
          border: '1px solid #E2E8F0',
          '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, fontSize: '0.75rem' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 8 },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, fontSize: '0.875rem' },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 600, fontSize: '0.875rem', color: '#293036' },
      },
    },
  },
});
