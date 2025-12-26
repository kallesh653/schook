import * as React from 'react';
import { styled, useTheme, keyframes } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import Fab from '@mui/material/Fab';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

// ICONS
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GradingIcon from '@mui/icons-material/Grading';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import ExplicitIcon from '@mui/icons-material/Explicit';
import LogoutIcon from '@mui/icons-material/Logout';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SchoolIcon from '@mui/icons-material/School';

// Animation keyframes
const slideUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// Mobile App Bar
const AppBar = styled(MuiAppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
  backdropFilter: 'blur(20px)',
  [theme.breakpoints.up('md')]: {
    marginLeft: 280,
    width: 'calc(100% - 280px)',
  },
}));

// Mobile Bottom Navigation
const MobileBottomNav = styled(BottomNavigation)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1200,
  height: 70,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  boxShadow: '0 -4px 20px rgba(102, 126, 234, 0.3)',
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  '& .MuiBottomNavigationAction-root': {
    color: 'rgba(255, 255, 255, 0.6)',
    minWidth: 'auto',
    padding: '6px 12px',
    '&.Mui-selected': {
      color: '#ffffff',
      transform: 'translateY(-4px)',
      '& .MuiSvgIcon-root': {
        fontSize: '1.8rem',
      }
    },
    '& .MuiSvgIcon-root': {
      fontSize: '1.5rem',
      transition: 'all 0.3s ease',
    },
    '& .MuiBottomNavigationAction-label': {
      fontSize: '0.7rem',
      fontWeight: 600,
      marginTop: '4px',
      opacity: 0.9,
      '&.Mui-selected': {
        fontSize: '0.75rem',
        opacity: 1,
      }
    }
  },
  animation: `${slideUp} 0.5s ease-out`,
}));

// Desktop Sidebar
const DesktopDrawer = styled(Drawer)(({ theme }) => ({
  width: 280,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: 280,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    boxShadow: '4px 0 20px rgba(102, 126, 234, 0.3)',
    border: 'none',
  },
}));

// Profile Header
const ProfileHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  background: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(15px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
  animation: `${fadeIn} 0.6s ease-out`,
  textAlign: 'center',
}));

// Styled List Item Button
const StyledListItemButton = styled(ListItemButton)(({ theme, active }) => ({
  margin: theme.spacing(0.5, 1.5),
  borderRadius: '15px',
  minHeight: '52px',
  transition: 'all 0.3s ease',
  background: active ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
  border: active ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid transparent',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.15)',
    transform: 'translateX(5px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
  }
}));

export default function Student() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);
  const [bottomNavValue, setBottomNavValue] = React.useState(0);

  const navItems = [
    { link: "/student/student-details", label: "Dashboard", icon: <DashboardIcon />, index: 0 },
    { link: "/student/periods", label: "Schedule", icon: <CalendarMonthIcon />, index: 1 },
    { link: "/student/attendance", label: "Attendance", icon: <GradingIcon />, index: 2 },
    { link: "/student/examinations", label: "Exams", icon: <ExplicitIcon />, index: 3 },
    { link: "/student/results", label: "Results", icon: <AssessmentIcon />, index: 4 },
  ];

  const extraItems = [
    { link: "/student/notice", label: "Notices", icon: <CircleNotificationsIcon /> },
    { link: "/logout", label: "Logout", icon: <LogoutIcon /> },
  ];

  // Update bottom nav value based on current route
  React.useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = navItems.find(item => item.link === currentPath);
    if (currentItem) {
      setBottomNavValue(currentItem.index);
    }
  }, [location.pathname]);

  const handleNavigation = (link) => {
    navigate(link);
    if (isMobile) {
      setMobileDrawerOpen(false);
    }
  };

  const handleBottomNavChange = (event, newValue) => {
    setBottomNavValue(newValue);
    const item = navItems.find(item => item.index === newValue);
    if (item) {
      navigate(item.link);
    }
  };

  // Drawer content for mobile menu
  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ProfileHeader>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            margin: '0 auto',
            mb: 2,
            background: 'linear-gradient(45deg, #FFD700 30%, #FFA500 90%)',
            fontSize: '2rem',
            animation: `${pulse} 2s infinite`,
            border: '3px solid rgba(255,255,255,0.3)'
          }}
        >
          🎓
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
          Student Portal
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          Shrigannada School
        </Typography>
      </ProfileHeader>

      <List sx={{ flexGrow: 1, padding: 2 }}>
        {navItems.map((item) => (
          <ListItem key={item.link} disablePadding>
            <StyledListItemButton
              active={location.pathname === item.link}
              onClick={() => handleNavigation(item.link)}
            >
              <ListItemIcon sx={{ color: 'rgba(255,255,255,0.9)', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: 600,
                  fontSize: '0.95rem',
                }}
              />
            </StyledListItemButton>
          </ListItem>
        ))}

        <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />

        {extraItems.map((item) => (
          <ListItem key={item.link} disablePadding>
            <StyledListItemButton
              active={location.pathname === item.link}
              onClick={() => handleNavigation(item.link)}
            >
              <ListItemIcon sx={{ color: 'rgba(255,255,255,0.9)', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: 600,
                  fontSize: '0.95rem',
                }}
              />
            </StyledListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar position="fixed">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={() => setMobileDrawerOpen(true)}
                sx={{
                  borderRadius: '12px',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.2)',
                    transform: 'scale(1.1)',
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <SchoolIcon sx={{ fontSize: { xs: 28, md: 32 } }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1rem', md: '1.3rem' },
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Student Portal
            </Typography>
          </Box>

          <IconButton
            color="inherit"
            sx={{
              borderRadius: '12px',
              '&:hover': {
                background: 'rgba(255,255,255,0.2)',
              }
            }}
          >
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Desktop Sidebar */}
      {!isMobile && (
        <DesktopDrawer variant="permanent">
          {drawerContent}
        </DesktopDrawer>
      )}

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 280,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#ffffff',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton
            onClick={() => setMobileDrawerOpen(false)}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          pt: { xs: 8, md: 9 },
          pb: { xs: 10, md: 3 },
          px: { xs: 0, md: 3 },
          transition: 'all 0.3s ease',
        }}
      >
        <Outlet />
      </Box>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <Paper
          sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1200 }}
          elevation={3}
        >
          <MobileBottomNav
            value={bottomNavValue}
            onChange={handleBottomNavChange}
            showLabels
          >
            {navItems.map((item) => (
              <BottomNavigationAction
                key={item.index}
                label={item.label}
                icon={item.icon}
                value={item.index}
              />
            ))}
          </MobileBottomNav>
        </Paper>
      )}

      {/* Floating Notification Button (Mobile Only) */}
      {isMobile && (
        <Fab
          color="secondary"
          sx={{
            position: 'fixed',
            bottom: 85,
            right: 20,
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            boxShadow: '0 8px 25px rgba(240, 147, 251, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s ease',
          }}
          onClick={() => navigate('/student/notice')}
        >
          <Badge badgeContent={3} color="error">
            <NotificationsIcon />
          </Badge>
        </Fab>
      )}
    </Box>
  );
}
