import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Box, List, ListItemButton,
  ListItemIcon, ListItemText, IconButton, Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import BusinessIcon from '@mui/icons-material/Business';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const SIDENAV_WIDTH = 256;

// Top nav tabs (Level 1)
const topTabs = [
  { label: 'Home', path: null },
  { label: 'Citations', path: '/' },
  { label: 'Reports', path: null },
  { label: 'Configurations', path: null },
];

// Side nav items (Level 2) — flat list
const sideNavItems = [
  { label: 'Dashboard', icon: <DashboardIcon fontSize="small" />, path: '/' },
  { label: 'Citations', icon: <AssignmentLateIcon fontSize="small" />, path: '/citations' },
  { label: 'Survey Management', icon: <ContentPasteSearchIcon fontSize="small" />, path: '/surveys' },
  { label: 'Facility Summaries', icon: <BusinessIcon fontSize="small" />, path: '/facilities' },
];

// TELS logo as text (matches Figma: bold, dark)
const telsLogoUrl = 'https://www.figma.com/api/mcp/asset/cd89a197-1238-4380-988f-7bc6c50570fa';

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active top tab
  const isOnCitations = true; // prototype only covers Citations

  // Determine active side nav
  const activeSidePath = sideNavItems.find((item) => {
    if (item.path === '/') return location.pathname === '/';
    if (item.path === '/facilities') return location.pathname.startsWith('/facilities') || location.pathname.startsWith('/facility/');
    return location.pathname.startsWith(item.path);
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
          {/* TELS Logo + Command Center */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mr: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, flexShrink: 0 }}>
              <img
                src={telsLogoUrl}
                alt="TELS"
                style={{ height: 20, width: 106, objectFit: 'contain' }}
                onError={(e) => {
                  // Fallback if Figma asset expires
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).parentElement!.querySelector('.tels-fallback')?.removeAttribute('style');
                }}
              />
              <Typography
                className="tels-fallback"
                style={{ display: 'none' }}
                sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#293036', letterSpacing: '-0.5px' }}
              >
                TELS
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer',
                px: 1.25, py: 1.25, borderRadius: '4px',
                '&:hover': { bgcolor: 'rgba(103,119,135,0.08)' },
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: '18px', color: '#293036', letterSpacing: '-0.25px' }}>
                Command Center
              </Typography>
              <KeyboardArrowDownIcon sx={{ color: '#293036', fontSize: 24 }} />
            </Box>
          </Box>

          {/* Main Nav Tabs */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, height: '100%' }}>
            {topTabs.map((tab) => {
              const isActive = tab.label === 'Citations' && isOnCitations;
              const hasDrop = false; // no dropdowns in prototype
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
                    {hasDrop && <KeyboardArrowDownIcon sx={{ color: '#293036', fontSize: 24, ml: -0.25 }} />}
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
                    py: 1,
                    px: 1.5,
                    '&.Mui-selected': {
                      bgcolor: 'rgba(0, 101, 189, 0.08)',
                      '&:hover': { bgcolor: 'rgba(0, 101, 189, 0.12)' },
                    },
                    '&:hover': { bgcolor: 'rgba(103,119,135,0.08)' },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: isActive ? '#0065BD' : '#293036' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 400,
                      fontSize: '0.875rem',
                      color: isActive ? '#0065BD' : '#293036',
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Box>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            ml: `${SIDENAV_WIDTH}px`,
            minHeight: `calc(100vh - 60px)`,
            bgcolor: '#ECEEF0',
            width: `calc(100vw - ${SIDENAV_WIDTH}px)`,
            maxWidth: `calc(100vw - ${SIDENAV_WIDTH}px)`,
            overflowX: 'hidden',
          }}
        >
          <Box sx={{ p: 3 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
