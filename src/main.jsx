import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App.jsx';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0F172A' },
    secondary: { main: '#2563EB' },
    success: { main: '#16A34A' },
    warning: { main: '#D97706' },
    error: { main: '#DC2626' },
    info: { main: '#0EA5E9' },
    background: { default: '#F1F5F9', paper: '#FFFFFF' },
    text: { primary: '#0F172A', secondary: '#475569' }
  },
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    h6: { fontWeight: 700, letterSpacing: -0.2 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    body2: { fontSize: 13, lineHeight: 1.25 },
    caption: { fontSize: 11.5, color: '#64748B', lineHeight: 1.2 },
    button: { textTransform: 'none', fontWeight: 600 }
  },
  shape: { borderRadius: 12 },
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 14 } } },
    MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiAppBar: { styleOverrides: { root: { backgroundImage: 'none' } } }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
