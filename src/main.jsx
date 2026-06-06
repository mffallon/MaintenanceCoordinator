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
          // Lock body scroll so MUI never adds padding-right compensation
          // (which was making the fixed AppBar visually inset).
          body: { margin: 0, overflow: 'hidden' }
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

// DSX brand theme — `#0065bd` primary, orange secondary, Inter, 4px radius,
// 8px spacing unit. Nav surfaces (AppBar, BottomNav) keep their existing
// styling via per-component overrides where needed.
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0065BD', dark: '#004A8A', light: '#3389D0', contrastText: '#FFFFFF' },
    secondary: { main: '#E87722', dark: '#B85A12', light: '#F19A55', contrastText: '#FFFFFF' },
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
    subtitle1: { fontWeight: 700 },
    subtitle2: { fontWeight: 700 },
    body2: { fontSize: 13, lineHeight: 1.25 },
    caption: { fontSize: 11.5, color: '#64748B', lineHeight: 1.2 },
    button: { textTransform: 'none', fontWeight: 600 }
  },
  shape: { borderRadius: 4 },
  spacing: 8,
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
        // No border on outlined surfaces by default. Reach for an explicit
        // `border` in sx when you specifically want one.
        outlined: { border: 'none' }
      }
    },
    MuiCard: { styleOverrides: { root: { borderRadius: 16 } } },
    MuiChip: { styleOverrides: { root: { fontWeight: 600, borderRadius: 4 } } },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 4 } }
    },
    MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 4 } } },
    // Enforce a 36×36 minimum tap target on every IconButton — even the
    // size="small" variants. Anything tappable should hit at least the
    // 36px Material guidance for finger-friendly touch.
    MuiIconButton: {
      styleOverrides: {
        root: { minWidth: 36, minHeight: 36 }
      }
    },
    // AppBar / BottomNavigation are left at their black brand color so the
    // nav surfaces don't pick up the DSX blue — only body content does.
    MuiAppBar: { styleOverrides: { root: { backgroundImage: 'none' } } },
    // Stop MUI from applying scrollbar-compensation padding to body and
    // .mui-fixed elements when overlays open. That padding was making the
    // fixed AppBar look inset from the iPhone-frame edges.
    //
    // `disablePortal` keeps overlays mounted inside the React tree (inside
    // DeviceStage), so their position:fixed children pin to the iPhone
    // frame's `transform: translateZ(0)` containing block instead of the
    // browser viewport. This prevents drawers/menus from extending wider
    // than the phone bounds on desktop.
    MuiDrawer: {
      // disableAutoFocus / disableEnforceFocus / disableRestoreFocus stop
      // MUI's focus trap from focusing the drawer paper on open. That focus
      // call triggers a browser scrollIntoView against the iPhone-frame
      // scroll container, which visibly shifts the underlying view while the
      // drawer slides up. With these off, the originating screen stays static
      // and only the drawer animates — the behavior we want for every drawer.
      defaultProps: {
        disableScrollLock: true,
        disablePortal: true,
        disableAutoFocus: true,
        disableEnforceFocus: true,
        disableRestoreFocus: true
      },
      styleOverrides: {
        // Bottom drawers cap at the device-stage height minus the AppBar
        // (~88 px). vh-based sizing in component PaperProps resolves
        // against the browser viewport, so on tall desktop windows the
        // drawer would otherwise grow larger than the 874 px iPhone frame
        // and cover the AppBar.
        paperAnchorBottom: { maxHeight: 'calc(100% - 88px) !important' }
      }
    },
    MuiDialog: { defaultProps: { disableScrollLock: true, disablePortal: true } },
    MuiModal: { defaultProps: { disableScrollLock: true, disablePortal: true } },
    MuiPopover: { defaultProps: { disableScrollLock: true, disablePortal: true } },
    MuiMenu: { defaultProps: { disableScrollLock: true, disablePortal: true } }
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
