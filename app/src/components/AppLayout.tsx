import { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Box, List, ListItemButton,
  ListItemIcon, ListItemText, IconButton, Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import BusinessIcon from '@mui/icons-material/Business';
import ScienceIcon from '@mui/icons-material/Science';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import InsightsIcon from '@mui/icons-material/Insights';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const SIDENAV_WIDTH = 256;

// Top nav tabs (Level 1)
const topTabs = [
  { label: 'Home', path: null, dropdown: false },
  { label: 'Reports', path: null, dropdown: false },
  { label: 'Tools', path: '/', dropdown: true },
  { label: 'Configurations', path: null, dropdown: false },
];

// Side nav items (Level 2) — flat list
const sideNavItems = [
  { label: 'Dashboard', icon: <DashboardIcon fontSize="small" />, path: '/' },
  { label: 'Survey Planning', icon: <ContentPasteSearchIcon fontSize="small" />, path: '/surveys' },
  { label: 'Community Summaries', icon: <BusinessIcon fontSize="small" />, path: '/facilities' },
  { label: 'Survey Overview', icon: <ScienceIcon fontSize="small" />, path: '/citations-remix' },
  { label: 'K-Tags', icon: <LocalFireDepartmentIcon fontSize="small" />, path: '/citations-remix/tags/k', indent: true },
  { label: 'N-Tags (State)', icon: <AccountBalanceIcon fontSize="small" />, path: '/citations-remix/tags/state', indent: true },
  { label: 'E-Tags', icon: <HealthAndSafetyIcon fontSize="small" />, path: '/citations-remix/tags/e', indent: true },
  { label: 'Plans of Correction', icon: <AssignmentLateIcon fontSize="small" />, path: '/poc' },
  { label: 'Trends (Future)', icon: <InsightsIcon fontSize="small" />, path: '/trends' },
];

// TELS logo as text (matches Figma: bold, dark)
const telsLogoUrl = 'https://www.figma.com/api/mcp/asset/d2f14079-d1af-4545-8155-5b8d58bf47c7';

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);

  // Scroll to top on route change
  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Determine active top tab
  const isOnCitations = true; // prototype only covers Citations

  // Determine active side nav
  const activeSidePath = sideNavItems.find((item) => {
    if (item.path === '/') return location.pathname === '/';
    if (item.path === '/facilities') return location.pathname.startsWith('/facilities') || location.pathname.startsWith('/facility/');
    // Exact match first to avoid /citations matching /citations-remix
    if (location.pathname === item.path) return true;
    // Only startsWith if the path isn't a prefix of another nav item
    if (item.path.startsWith('/citations-remix/tags/')) return location.pathname === item.path;
    if (item.path === '/citations-remix') return location.pathname === '/citations-remix';
    if (item.path !== '/citations') return location.pathname.startsWith(item.path);
    return location.pathname === '/citations';
  })?.path || '/';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#ECEEF0', overflowX: 'hidden' }}>
      {/* Level 1: Top NavBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: '#FFFFFF',
          borderBottom: '1px solid #E0E4E7',
          zIndex: (t) => t.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ minHeight: '60px !important', px: 1, gap: 1 }}>
          {/* TELS Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', px: 2, mr: 1, flexShrink: 0 }}>
            <svg width="107" height="21" viewBox="0 0 107 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="21" height="21" rx="3" fill="#0065BD"/>
              <path d="M6 6h9M10.5 6v9" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
              <text x="27" y="16" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="15" fill="#293036" letterSpacing="-0.5">TELS</text>
            </svg>
          </Box>

          {/* Main Nav Tabs */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, height: '100%' }}>
            {topTabs.map((tab) => {
              const isActive = tab.label === 'Tools' && isOnCitations;
              return (
                <Box
                  key={tab.label}
                  onClick={() => tab.path && navigate(tab.path)}
                  sx={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    height: '100%', justifyContent: 'center', position: 'relative',
                    cursor: tab.path ? 'pointer' : 'default',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 0.25,
                      px: 1.25, py: 1.25, borderRadius: '4px',
                      '&:hover': { bgcolor: 'rgba(103,119,135,0.08)' },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '16px',
                        fontWeight: isActive ? 700 : 500,
                        color: '#293036',
                        letterSpacing: '-0.11px',
                        lineHeight: '20px',
                        px: 0.5,
                      }}
                    >
                      {tab.label}
                    </Typography>
                    {tab.dropdown && <KeyboardArrowDownIcon sx={{ color: '#293036', fontSize: 20, ml: -0.25 }} />}
                  </Box>
                  {/* Selection indicator */}
                  {isActive && (
                    <Box sx={{
                      position: 'absolute', bottom: 0, left: 14, right: 14,
                      height: 3, bgcolor: '#0065BD', borderRadius: '1px 1px 0 0',
                    }} />
                  )}
                </Box>
              );
            })}
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Utility icons */}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton sx={{ color: '#293036' }}><HelpOutlineIcon /></IconButton>
            <IconButton sx={{ color: '#293036' }}><PersonOutlineIcon /></IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flexGrow: 1, pt: '60px' }}>
        {/* Level 2: Left Sidenav */}
        <Box
          component="nav"
          sx={{
            width: SIDENAV_WIDTH,
            flexShrink: 0,
            bgcolor: '#FFFFFF',
            borderRight: '1px solid #E0E4E7',
            boxShadow: '0px 1px 3px rgba(0,0,0,0.12), 0px 1px 1px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.2)',
            position: 'fixed',
            top: 60,
            bottom: 0,
            left: 0,
            overflowY: 'auto',
          }}
        >
          <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Citations
            </Typography>
          </Box>
          <List sx={{ p: 1 }}>
            {sideNavItems.map((item) => {
              const isActive = item.path === activeSidePath;
              return (
                <ListItemButton
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  selected={isActive}
                  sx={{
                    borderRadius: '4px',
                    mb: 0.25,
                    py: (item as any).indent ? 0.6 : 1,
                    px: 1.5,
                    pl: (item as any).indent ? 4 : 1.5,
                    '&.Mui-selected': {
                      bgcolor: 'rgba(0, 101, 189, 0.08)',
                      '&:hover': { bgcolor: 'rgba(0, 101, 189, 0.12)' },
                    },
                    '&:hover': { bgcolor: 'rgba(103,119,135,0.08)' },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: (item as any).indent ? 28 : 36, color: isActive ? '#0065BD' : '#5c6874' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 400,
                      fontSize: (item as any).indent ? '0.8rem' : '0.875rem',
                      color: isActive ? '#0065BD' : (item as any).indent ? '#5c6874' : '#293036',
                      sx: { textDecoration: (item as any).strikethrough ? 'line-through' : undefined },
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Box>

        {/* Main Content */}
        <Box
          ref={mainRef}
          component="main"
          sx={{
            flexGrow: 1,
            ml: `${SIDENAV_WIDTH}px`,
            minHeight: `calc(100vh - 60px)`,
            bgcolor: '#ECEEF0',
            width: `calc(100vw - ${SIDENAV_WIDTH}px)`,
            maxWidth: `calc(100vw - ${SIDENAV_WIDTH}px)`,
          }}
        >
          <Box sx={{ p: 3, maxWidth: 1280 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
