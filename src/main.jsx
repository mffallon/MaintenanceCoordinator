import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme, Box, GlobalStyles } from '@mui/material';
import App from './App.jsx';

// Lock the prototype to an iPhone 17 (402 × 874) frame on screens wide enough,
// so the GitHub Pages deploy looks the same as the in-tool preview.
function DeviceStage({ children }) {
  return (
    <>
      <GlobalStyles
        styles={{
          'html, body, #root': { height: '100%' },
          body: { margin: 0 }
        }}
      />
      <Box
        sx={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'center',
          bgcolor: { xs: '#F1F5F9', sm: '#0F172A' },
          p: { xs: 0, sm: 2 }
        }}
      >
        <Box
          sx={{
            width: { xs: '100%', sm: 402 },
            height: { xs: '100dvh', sm: 874 },
            position: 'relative',
            // Creates a containing block so position:fixed children pin to
            // the frame (not the viewport) on desktop.
            transform: 'translateZ(0)',
            overflow: 'hidden',
            bgcolor: '#F1F5F9',
            borderRadius: { xs: 0, sm: '32px' },
            boxShadow: { xs: 'none', sm: '0 30px 80px rgba(2,6,23,0.45)' }
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
}

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
      <DeviceStage>
        <App />
      </DeviceStage>
    </ThemeProvider>
  </React.StrictMode>
);
