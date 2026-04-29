import { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Box, List, ListItemButton,
  ListItemText, IconButton, Divider, Menu, MenuItem, Typography,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import LogoutIcon from '@mui/icons-material/Logout';

const SIDENAV_WIDTH = 256;

// ─── Types ───────────────────────────────────────────────
type DropdownItem =
  | { label: string; href?: string }
  | { divider: true; sectionLabel: string };

interface NavItemDef {
  label: string;
  dropdown?: DropdownItem[];
  isConfigurations?: boolean;
}

interface AppLayoutProps {
  onCorpConfig?: () => void;
  corpConfigActive?: boolean;
  onCorpConfigClose?: () => void;
  onAppNavChange?: (app: string | null, item: string | null) => void;
}

// ─── Nav definitions ─────────────────────────────────────
const toolsDropdown: DropdownItem[] = [
  { label: 'Assets - Compliance' },
  { label: 'Assets (Current)' },
  { label: 'Capital' },
  { label: 'Capital Planning' },
  { label: 'Citations Dashboard' },
  { label: 'Facility Service Coverage' },
  { label: 'Interactive Reporting' },
  { label: 'News Message Manager' },
  { label: 'Onboard New Facility' },
  { label: 'Site Visit Checklist' },
  { label: 'Unit Turns (Current)' },
];

const topNavItems: NavItemDef[] = [
  { label: 'Home' },
  { label: 'Reports' },
  { label: 'Tools', dropdown: toolsDropdown },
  { label: 'Configurations', isConfigurations: true },
];

const helpItems: DropdownItem[] = [
  { label: 'Help Center', href: '#' },
  { label: 'Training', href: '#' },
  { label: 'Contact us', href: '#' },
];

const sideNavItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Trends', path: '/trends' },
  { label: 'Pre-survey', path: '/surveys' },
  { label: 'Survey Overviews', path: '/citations-remix' },
  { label: 'K-Tags', path: '/citations-remix/tags/k', indent: true },
  { label: 'E-Tags', path: '/citations-remix/tags/e', indent: true },
  { label: 'Plan of Corrections', path: '/facilities' },
  { label: 'Upload Survey', path: '/upload' },
];

const toolsLabelToPath: Record<string, string> = {
  'Citations Dashboard': '/',
};

// ─── Menu styles ─────────────────────────────────────────
const menuPaperSx = {
  minWidth: 220,
  borderRadius: '8px',
  boxShadow: '0 4px 16px rgba(41,48,54,0.14)',
  border: '1px solid #e0e4e7',
  py: '6px',
  mt: 0.5,
};

const menuItemSx = {
  fontFamily: '"Inter", sans-serif',
  fontSize: '14px',
  color: '#293036',
  py: '10px',
  px: 2,
  '&:hover': { bgcolor: 'rgba(103,119,135,0.08)' },
};

// ─── TELS Logo SVG ───────────────────────────────────────
const TelsLogo = () => (
  <svg width="107" height="21" viewBox="0 0 107 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_tels)">
      <path d="M38.3057 4.19905V0.273438H55.1976V4.19975H49.1379V20.2755H44.3758V4.19905H38.3057Z" fill="#003478"/>
      <path d="M56.8535 20.2755V0.273438H70.7883V4.19975H61.6837V8.30221H70.076V12.2376H61.6837V16.3492H70.7883V20.2755H56.8535Z" fill="#003478"/>
      <path d="M73.0986 20.2755V0.273438H77.9288V16.3492H86.2432V20.2755H73.0986Z" fill="#003478"/>
      <path d="M98.8291 6.26905C98.7639 5.55256 98.4762 4.99466 97.966 4.59396C97.4551 4.19396 96.7281 3.99396 95.7849 3.99396C95.1604 3.99396 94.6397 4.07536 94.2235 4.23817C93.8074 4.40098 93.4951 4.62413 93.2867 4.90694C93.0783 5.18975 92.9709 5.51396 92.9646 5.87887C92.9513 6.17852 93.0116 6.44238 93.1449 6.66975C93.2783 6.89782 93.4734 7.09782 93.7302 7.26975C93.987 7.44238 94.2979 7.59396 94.6621 7.72378C95.0263 7.85431 95.4362 7.96799 95.8916 8.06554L97.6088 8.45642C98.5976 8.67115 99.4712 8.95747 100.229 9.31606C100.987 9.67396 101.624 10.0999 102.142 10.5947C102.659 11.0894 103.051 11.6592 103.318 12.3041C103.584 12.9483 103.721 13.6712 103.727 14.4719C103.72 15.735 103.402 16.8192 102.771 17.7238C102.14 18.6283 101.234 19.3217 100.053 19.8038C98.872 20.2859 97.4495 20.5259 95.7842 20.5259C94.119 20.5259 92.6551 20.2761 91.4123 19.7743C90.1695 19.2733 89.2039 18.5112 88.5141 17.4894C87.8242 16.4676 87.4698 15.175 87.4502 13.6129H92.0755C92.1148 14.2578 92.2867 14.7947 92.5927 15.2241C92.8986 15.6536 93.3197 15.9792 93.8565 16.201C94.3934 16.422 95.0158 16.5336 95.7253 16.5336C96.3758 16.5336 96.9302 16.4452 97.3891 16.2697C97.8474 16.0936 98.2004 15.8494 98.4481 15.5371C98.6951 15.2248 98.8221 14.8669 98.8284 14.4634C98.8221 14.0859 98.7049 13.7617 98.4776 13.4915C98.2495 13.2213 97.9 12.9869 97.4284 12.7883C96.9569 12.5897 96.3562 12.4059 95.6277 12.2368L93.5393 11.749C91.8088 11.3519 90.446 10.709 89.4502 9.81992C88.4551 8.9315 87.9604 7.7294 87.9667 6.2115C87.9604 4.97501 88.2916 3.8908 88.9618 2.95957C89.632 2.02905 90.559 1.30343 91.7428 0.782029C92.9267 0.261327 94.2762 0.000976562 95.7927 0.000976562C97.3414 0.000976562 98.686 0.262731 99.8277 0.786941C100.969 1.31115 101.856 2.04519 102.487 2.98905C103.118 3.93361 103.44 5.02624 103.453 6.27045H98.8277L98.8291 6.26905Z" fill="#003478"/>
      <path d="M27.327 18.9948V19.1591H26.9361V20.2748H26.7431V19.1591H26.3516V18.9948H27.3263H27.327ZM28.5663 20.2748L28.5144 19.5036C28.5088 19.4033 28.5144 19.2805 28.5123 19.1548H28.5024C28.4688 19.2741 28.4309 19.4096 28.393 19.5226L28.1256 20.2587H27.9789L27.7179 19.5036C27.6842 19.4012 27.6526 19.2741 27.6238 19.1548H27.6133C27.6112 19.2784 27.6133 19.3871 27.6077 19.5036L27.5593 20.2748H27.3719L27.4723 18.9948H27.7263L27.9789 19.6896C28.0105 19.7864 28.0351 19.8924 28.0674 20.0117H28.0744C28.1031 19.8924 28.1326 19.7801 28.1642 19.6861L28.4147 18.9941H28.6674L28.7635 20.2741L28.5663 20.2748Z" fill="#003478"/>
      <path d="M14.8716 0.273163H5.83158C5.83158 0.273163 5.94877 0.296321 6.13333 0.340531C7.34246 0.629654 7.83649 1.81492 7.23439 3.23316L0 20.276H8.32281C10.4112 20.276 12.8232 18.5826 13.7095 16.4942L18.1656 5.99667C19.5074 2.83527 18.0323 0.273163 14.8716 0.273163Z" fill="#003478"/>
      <path d="M26.2509 0.273438C24.1625 0.273438 21.7505 1.96677 20.8642 4.05519L14.8965 18.1141C14.4565 19.1499 13.361 20.0159 12.2986 20.2271C12.1365 20.2594 12.0361 20.2762 12.0361 20.2762H22.3014C24.3898 20.2762 26.8017 18.5829 27.6881 16.4945L33.6558 2.43554C34.0958 1.39975 35.1912 0.533788 36.2537 0.32256C36.4158 0.29028 36.5161 0.273438 36.5161 0.273438H26.2502H26.2509Z" fill="#0076DD"/>
      <path d="M104.924 20.2746C104.203 20.2746 103.622 19.6914 103.622 18.9707C103.622 18.25 104.204 17.6689 104.924 17.6689C105.644 17.6689 106.228 18.2486 106.228 18.9707C106.228 19.6928 105.646 20.2746 104.924 20.2746ZM104.924 17.8851C104.323 17.8851 103.839 18.3707 103.839 18.9721C103.839 19.5735 104.323 20.0612 104.924 20.0612C105.525 20.0612 106.013 19.5728 106.013 18.9721C106.013 18.37 105.525 17.8851 104.924 17.8851ZM104.356 18.2914H104.975C105.321 18.2914 105.438 18.5068 105.438 18.6584C105.438 18.8851 105.275 19.0486 105.039 19.0626V19.0696C105.158 19.1118 105.246 19.2325 105.364 19.4205L105.534 19.6921H105.257L105.133 19.4739C104.958 19.1581 104.889 19.0984 104.716 19.0984H104.581V19.6921H104.355L104.356 18.2914ZM104.905 18.9026C105.08 18.9026 105.197 18.8353 105.197 18.6907C105.197 18.5637 105.094 18.483 104.945 18.483H104.581V18.9026H104.905Z" fill="#003478"/>
    </g>
    <defs>
      <clipPath id="clip0_tels">
        <rect width="106.227" height="20.5235" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

// ─── Dropdown Menu renderer ───────────────────────────────
function NavDropdownMenu({
  items,
  anchor,
  onClose,
  onNavigate,
  activeSidePath,
}: {
  items: DropdownItem[];
  anchor: HTMLElement | null;
  onClose: () => void;
  onNavigate: (path: string) => void;
  activeSidePath: string;
}) {
  return (
    <Menu
      anchorEl={anchor}
      open={Boolean(anchor)}
      onClose={onClose}
      autoFocus={false}
      slotProps={{ paper: { sx: menuPaperSx } }}
    >
      {items.map((item, i) => {
        if ('divider' in item) {
          return (
            <Box key={i}>
              {i > 0 && <Divider sx={{ my: '4px' }} />}
              <Typography sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '11px',
                fontWeight: 600,
                color: '#5c6874',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                px: 2,
                pt: i > 0 ? 1 : 0.5,
                pb: 0.5,
              }}>
                {item.sectionLabel}
              </Typography>
            </Box>
          );
        }
        const path = toolsLabelToPath[item.label];
        const isActive = path && activeSidePath === path;
        if (item.href) {
          return (
            <MenuItem
              key={item.label}
              component="a"
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              sx={menuItemSx}
            >
              {item.label}
            </MenuItem>
          );
        }
        return (
          <MenuItem
            key={item.label}
            onClick={() => { if (path) onNavigate(path); onClose(); }}
            sx={{
              ...menuItemSx,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#0065bd' : '#293036',
              bgcolor: isActive ? 'rgba(0,101,189,0.08)' : undefined,
              '&:hover': { bgcolor: isActive ? 'rgba(0,101,189,0.12)' : 'rgba(103,119,135,0.08)' },
            }}
          >
            {item.label}
          </MenuItem>
        );
      })}
    </Menu>
  );
}

// ─── Main Layout ─────────────────────────────────────────
export default function AppLayout({
  onCorpConfig,
  corpConfigActive,
  onCorpConfigClose,
}: AppLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);

  const [clickedItem, setClickedItem] = useState<string | null>(null);
  const [dropdownAnchor, setDropdownAnchor] = useState<{ label: string; el: HTMLElement } | null>(null);
  const [helpAnchor, setHelpAnchor] = useState<null | HTMLElement>(null);
  const [personAnchor, setPersonAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const activeSidePath = sideNavItems.find((item) => {
    if (item.path === '/') return location.pathname === '/';
    if (item.path === '/facilities') return location.pathname.startsWith('/facilities') || location.pathname.startsWith('/facility/');
    if (location.pathname === item.path) return true;
    if (item.path.startsWith('/citations-remix/tags/')) return location.pathname === item.path;
    if (item.path === '/citations-remix') return location.pathname === '/citations-remix';
    if (item.path !== '/citations') return location.pathname.startsWith(item.path);
    return location.pathname === '/citations';
  })?.path || '/';

  const isNavItemActive = (item: NavItemDef): boolean => {
    if (item.label === 'Home' || item.label === 'Tools') return false;
    if (corpConfigActive && item.isConfigurations) return true;
    if (item.isConfigurations) return clickedItem === 'Configurations';
    return clickedItem === item.label && !corpConfigActive;
  };

  const handleNavClick = (item: NavItemDef, el: HTMLElement) => {
    if (item.label === 'Home') {
      setClickedItem(null);
      onCorpConfigClose?.();
      navigate('/');
      return;
    }
    if (item.isConfigurations) {
      setClickedItem('Configurations');
      onCorpConfig?.();
      return;
    }
    if (item.dropdown) {
      setDropdownAnchor({ label: item.label, el });
      setClickedItem(item.label);
      return;
    }
    setClickedItem(item.label);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F7F8F9', overflowX: 'hidden' }}>
      {/* Top NavBar */}
      <AppBar position="fixed" elevation={0} sx={{ bgcolor: '#fff', borderBottom: '1px solid #e0e4e7', zIndex: 1100 }}>
        <Toolbar sx={{ minHeight: '60px !important', px: 1, gap: 1 }}>

          {/* Logo */}
          <Box
            onClick={() => { setClickedItem(null); onCorpConfigClose?.(); navigate('/'); }}
            sx={{ display: 'flex', alignItems: 'center', px: 2, flexShrink: 0, cursor: 'pointer' }}
          >
            <TelsLogo />
          </Box>

          {/* Nav Items */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, height: '100%' }}>
            {topNavItems.map((item) => {
              const isActive = isNavItemActive(item);
              const isOpen = dropdownAnchor?.label === item.label;
              return (
                <Box
                  key={item.label}
                  onClick={(e) => handleNavClick(item, e.currentTarget)}
                  sx={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    height: '60px', justifyContent: 'center', position: 'relative',
                    cursor: 'pointer',
                  }}
                >
                  <Box sx={{
                    display: 'flex', alignItems: 'center',
                    pl: '10px', pr: '12px', height: '44px', borderRadius: '4px',
                    bgcolor: isActive ? 'rgba(0,101,189,0.08)' : 'transparent',
                    '&:hover': { bgcolor: isActive ? 'rgba(0,101,189,0.12)' : 'rgba(103,119,135,0.08)' },
                  }}>
                    <Typography sx={{
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '16px',
                      fontWeight: isActive ? 700 : 500,
                      color: '#293036',
                      letterSpacing: '-0.176px',
                      lineHeight: '20px',
                      userSelect: 'none',
                    }}>
                      {item.label}
                    </Typography>
                    {item.dropdown && (
                      <ArrowDropDownIcon sx={{
                        color: '#293036', fontSize: 20, ml: 0.25,
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.15s',
                      }} />
                    )}
                  </Box>
                  {isActive && (
                    <Box sx={{
                      position: 'absolute', bottom: 0, left: '14px', right: '14px',
                      height: 3, bgcolor: '#0065bd', borderRadius: '1px 1px 0 0',
                    }} />
                  )}
                </Box>
              );
            })}
          </Box>

          {/* Tools dropdown */}
          {dropdownAnchor && (
            <NavDropdownMenu
              items={topNavItems.find(n => n.label === dropdownAnchor.label)?.dropdown ?? []}
              anchor={dropdownAnchor.el}
              onClose={() => setDropdownAnchor(null)}
              onNavigate={(path) => navigate(path)}
              activeSidePath={activeSidePath}
            />
          )}

          <Box sx={{ flexGrow: 1 }} />

          {/* Utility: Help */}
          <IconButton
            onClick={(e) => setHelpAnchor(e.currentTarget)}
            sx={{ color: '#293036', borderRadius: '4px', '&:hover': { bgcolor: 'rgba(103,119,135,0.08)' } }}
          >
            <HelpOutlineIcon />
          </IconButton>
          <Menu
            anchorEl={helpAnchor}
            open={Boolean(helpAnchor)}
            onClose={() => setHelpAnchor(null)}
            slotProps={{ paper: { sx: { ...menuPaperSx, minWidth: 180 } } }}
          >
            {helpItems.map((item) => (
              'divider' in item ? null :
              <MenuItem
                key={item.label}
                component={item.href ? 'a' : 'li'}
                {...(item.href ? { href: item.href, target: '_blank', rel: 'noopener noreferrer' } : {})}
                onClick={() => setHelpAnchor(null)}
                sx={menuItemSx}
              >
                {item.label}
              </MenuItem>
            ))}
          </Menu>

          {/* Utility: Person */}
          <IconButton
            onClick={(e) => setPersonAnchor(e.currentTarget)}
            sx={{ color: '#293036', borderRadius: '4px', '&:hover': { bgcolor: 'rgba(103,119,135,0.08)' } }}
          >
            <PersonOutlineIcon />
          </IconButton>
          <Menu
            anchorEl={personAnchor}
            open={Boolean(personAnchor)}
            onClose={() => setPersonAnchor(null)}
            slotProps={{ paper: { sx: { ...menuPaperSx, minWidth: 180 } } }}
          >
            <MenuItem onClick={() => setPersonAnchor(null)} sx={menuItemSx}>Change password</MenuItem>
            <MenuItem onClick={() => setPersonAnchor(null)} sx={menuItemSx}>Account Settings</MenuItem>
            <Divider sx={{ my: '4px' }} />
            <MenuItem
              onClick={() => setPersonAnchor(null)}
              sx={{ ...menuItemSx, color: '#c60c30', gap: 1 }}
            >
              <LogoutIcon fontSize="small" sx={{ color: '#c60c30' }} />
              Log out
            </MenuItem>
          </Menu>

        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flexGrow: 1, pt: '60px' }}>
        {/* Left Sidenav */}
        <Box
          component="nav"
          sx={{
            width: SIDENAV_WIDTH,
            flexShrink: 0,
            bgcolor: '#FFFFFF',
            borderRight: '1px solid #E0E4E7',
            boxShadow: '0px 1px 3px rgba(0,0,0,0.12), 0px 1px 1px rgba(0,0,0,0.14)',
            position: 'fixed',
            top: 60,
            bottom: 0,
            left: 0,
            overflowY: 'auto',
          }}
        >
          <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '0.7rem', color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
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
                    borderRadius: 0,
                    mb: 0,
                    py: (item as any).indent ? 0.6 : 1.25,
                    px: 1.5,
                    pl: (item as any).indent ? 4 : 1.5,
                    borderLeft: isActive ? '3px solid #0065BD' : '3px solid transparent',
                    '&.Mui-selected': {
                      bgcolor: 'rgba(0,101,189,0.06)',
                      '&:hover': { bgcolor: 'rgba(0,101,189,0.10)' },
                    },
                    '&:hover': { bgcolor: 'rgba(103,119,135,0.06)' },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: isActive ? 600 : 400,
                      fontSize: (item as any).indent ? '0.8rem' : '0.875rem',
                      color: isActive ? '#293036' : (item as any).indent ? '#5c6874' : '#293036',
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
            bgcolor: '#F7F8F9',
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
