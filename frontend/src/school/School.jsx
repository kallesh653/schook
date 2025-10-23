import * as React from 'react';
import { styled, useTheme, keyframes } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';

import { Outlet, useNavigate } from "react-router-dom";
import { DashboardProvider } from '../context/DashboardContext';

// ICONS
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import TheatersIcon from '@mui/icons-material/Theaters';
import GradingIcon from '@mui/icons-material/Grading';
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import ExplicitIcon from '@mui/icons-material/Explicit';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import LogoutIcon from '@mui/icons-material/Logout';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import WebIcon from '@mui/icons-material/Web';
import PaymentIcon from '@mui/icons-material/Payment';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SchoolIcon from '@mui/icons-material/School';
import SmsIcon from '@mui/icons-material/Sms';
import SettingsIcon from '@mui/icons-material/Settings';

const drawerWidth = 280;

// Animation keyframes
const slideIn = keyframes`
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(102, 126, 234, 0.3); }
  50% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.6); }
  100% { box-shadow: 0 0 5px rgba(102, 126, 234, 0.3); }
`;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    background: 'linear-gradient(135deg, #4a5bb8 0%, #5a4a7a 100%)',
    color: '#ffffff',
    boxShadow: '0 8px 32px rgba(74, 91, 184, 0.4)',
    border: 'none',
    backdropFilter: 'blur(20px)',
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
    // Mobile optimization
    [theme.breakpoints.down('md')]: {
        width: '100vw',
        position: 'fixed',
        height: '100vh',
        zIndex: theme.zIndex.drawer + 2,
    }
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
    [theme.breakpoints.down('md')]: {
        width: 0,
        display: 'none',
    },
    background: 'linear-gradient(135deg, #4a5bb8 0%, #5a4a7a 100%)',
    color: '#ffffff',
    boxShadow: '0 8px 32px rgba(74, 91, 184, 0.4)',
    border: 'none',
    backdropFilter: 'blur(20px)',
    borderRight: '1px solid rgba(255, 255, 255, 0.1)'
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2, 3),
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(15px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    ...theme.mixins.toolbar,
}));

// Professional School Logo/Brand Section
const SchoolBrand = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(3),
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(15px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    animation: `${slideIn} 0.6s ease-out`,
    borderRadius: '0 0 20px 20px',
    margin: theme.spacing(0, 1, 2, 1),
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
}));

// Enhanced List Item Button
const StyledListItemButton = styled(ListItemButton)(({ theme, active }) => ({
    margin: theme.spacing(0.5, 1.5),
    borderRadius: '15px',
    minHeight: '52px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    background: active ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
    backdropFilter: active ? 'blur(10px)' : 'none',
    border: active ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid transparent',
    '&:hover': {
        background: 'rgba(255, 255, 255, 0.15)',
        transform: 'translateX(5px)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    '&:active': {
        transform: 'translateX(3px) scale(0.98)'
    }
}));

// Enhanced List Item Icon
const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
    minWidth: 0,
    marginRight: theme.spacing(2),
    color: 'rgba(255, 255, 255, 0.9)',
    transition: 'all 0.3s ease',
    '& .MuiSvgIcon-root': {
        fontSize: '1.4rem',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
    }
}));

// Enhanced List Item Text
const StyledListItemText = styled(ListItemText)(({ theme }) => ({
    '& .MuiTypography-root': {
        fontWeight: 500,
        fontSize: '0.95rem',
        color: 'rgba(255, 255, 255, 0.95)',
        textShadow: '0 1px 3px rgba(0,0,0,0.3)'
    }
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
    backdropFilter: 'blur(15px)',
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    // Mobile responsiveness
    [theme.breakpoints.down('md')]: {
        marginLeft: 0,
        width: '100%',
    },
    variants: [
        {
            props: ({ open }) => open,
            style: {
                [theme.breakpoints.up('md')]: {
                    marginLeft: drawerWidth,
                    width: `calc(100% - ${drawerWidth}px)`,
                },
                [theme.breakpoints.down('md')]: {
                    marginLeft: 0,
                    width: '100%',
                },
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        variants: [
            {
                props: ({ open }) => open,
                style: {
                    ...openedMixin(theme),
                    '& .MuiDrawer-paper': openedMixin(theme),
                },
            },
            {
                props: ({ open }) => !open,
                style: {
                    ...closedMixin(theme),
                    '& .MuiDrawer-paper': closedMixin(theme),
                },
            },
        ],
    }),
);

export default function School() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(true); // Start open on desktop
    const [activeRoute, setActiveRoute] = React.useState(window.location.pathname);
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 900);

    // Handle window resize for responsive behavior
    React.useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 900; // Match MUI md breakpoint
            setIsMobile(mobile);
            if (mobile) {
                setOpen(false); // Close desktop drawer on mobile
            } else {
                setOpen(true); // Open desktop drawer on desktop
                setMobileOpen(false); // Close mobile drawer on desktop
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Call once on mount

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const navArr = [
        {link:"/", component:"Home", icon:HomeIcon, category: "main"},
        { link: "/school", component: "Dashboard", icon: DashboardIcon, category: "main" },
        { link: "/school/home-page-management", component: "Website Management", icon: SettingsIcon, category: "main" },
        { link: "/school/courses", component: "Courses", icon: SchoolIcon, category: "academic" },
        { link: "/school/class", component: "Classes", icon:FormatListNumberedIcon, category: "academic" },
        { link: "/school/subject", component: "Subjects", icon: MenuBookIcon, category: "academic" },
        { link: "/school/students", component: "Students", icon: GroupIcon, category: "people" },
        { link: "/school/teachers", component: "Teachers", icon: GroupIcon, category: "people" },
        { link: "/school/student-records", component: "Student Records", icon: AssignmentIndIcon, category: "records" },
        { link: "/school/fees", component: "Fees Management", icon: PaymentIcon, category: "financial" },
        { link: "/school/periods", component: "Schedule", icon: CalendarMonthIcon, category: "academic" },
        { link: "/school/attendance", component: "Attendance", icon: RecentActorsIcon, category: "records" },
        { link: "/school/attendance-report", component: "Attendance Reports", icon: AssessmentIcon, category: "records" },
        { link: "/school/examinations", component: "Examinations", icon: ExplicitIcon, category: "academic"},
        { link: "/school/marksheets", component: "Mark Sheet Generator", icon: GradingIcon, category: "academic"},
        {link:"/school/notice", component:"Notices", icon:CircleNotificationsIcon, category: "communication"},
        {link:"/school/sms", component:"SMS Management", icon:SmsIcon, category: "communication"},
        {link:"/logout", component:"Log Out", icon:LogoutIcon, category: "system"}
    ]
    const navigate = useNavigate();
    const handleNavigation = (link) => {
        setActiveRoute(link);
        navigate(link);
    }
    const handleDrawerOpen = () => {
        if (isMobile) {
            setMobileOpen(true);
        } else {
            setOpen(true);
        }
    };

    const handleDrawerClose = () => {
        if (isMobile) {
            setMobileOpen(false);
        } else {
            setOpen(false);
        }
    };

    const handleMobileDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenuClick = () => {
        if (isMobile) {
            handleMobileDrawerToggle();
        } else {
            handleDrawerOpen();
        }
    };

    // Group navigation items by category
    const groupedNavItems = navArr.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {});

    const categoryLabels = {
        main: "Main",
        academic: "Academic",
        people: "People",
        records: "Records", 
        financial: "Financial",
        communication: "Communication",
        system: "System"
    };

    return (
        <DashboardProvider>
          <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar sx={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                    <IconButton
                        color="inherit"
                        aria-label="toggle drawer"
                        onClick={handleMenuClick}
                        edge="start"
                        sx={{
                            marginRight: 2,
                            color: 'rgba(255,255,255,0.95)',
                            borderRadius: '12px',
                            padding: '12px',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                background: 'rgba(255,255,255,0.2)',
                                transform: 'scale(1.1) rotate(90deg)',
                                boxShadow: '0 4px 15px rgba(255,255,255,0.3)'
                            },
                            // Always show on mobile, hide on desktop when drawer is open
                            display: { xs: 'inline-flex', md: open ? 'none' : 'inline-flex' },
                        }}
                    >
                        <MenuIcon sx={{ fontSize: '1.5rem' }} />
                    </IconButton>
                    <Typography 
                        variant="h5" 
                        noWrap 
                        component="div"
                        sx={{
                            fontWeight: 600,
                            background: 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }}
                    >
                        🎓 School Management System
                    </Typography>
                </Toolbar>
            </AppBar>
            
            {/* Desktop Drawer */}
            <Drawer
                variant="permanent"
                open={open}
                sx={{
                    display: { xs: 'none', md: 'block' },
                }}
            >
                {open && (
                    <SchoolBrand>
                        <Avatar 
                            sx={{ 
                                width: 56, 
                                height: 56, 
                                background: 'linear-gradient(45deg, #ffffff 30%, #f8f9fa 90%)',
                                fontSize: '1.8rem',
                                animation: `${pulse} 2s infinite`,
                                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                border: '2px solid rgba(255,255,255,0.3)'
                            }}
                        >
                            🎓
                        </Avatar>
                        <Box>
                            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.95)', fontWeight: 700, fontSize: '1.1rem' }}>
                                EduManage Pro
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                                Excellence in Education
                            </Typography>
                        </Box>
                    </SchoolBrand>
                )}
                
                <DrawerHeader>
                    {open && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Badge badgeContent={3} color="error">
                                <CircleNotificationsIcon sx={{ color: 'rgba(255,255,255,0.8)' }} />
                            </Badge>
                        </Box>
                    )}
                    <Tooltip title={open ? "Collapse Menu" : "Expand Menu"}>
                        <IconButton 
                            onClick={handleDrawerClose}
                            sx={{ 
                                color: 'rgba(255,255,255,0.95)',
                                '&:hover': {
                                    background: 'rgba(255,255,255,0.1)',
                                    transform: 'rotate(180deg)'
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </Tooltip>
                </DrawerHeader>

                <List sx={{ height: "100%", padding: theme.spacing(1, 0) }}>
                    {Object.entries(groupedNavItems).map(([category, items]) => (
                        <React.Fragment key={category}>
                            {open && (
                                <Typography
                                    variant="overline"
                                    sx={{
                                        color: 'rgba(255,255,255,0.7)',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        padding: theme.spacing(2, 3, 1, 3),
                                        letterSpacing: '1px',
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    {categoryLabels[category]}
                                </Typography>
                            )}
                            {items.map((navItem, index) => (
                                <ListItem key={`${category}-${index}`} disablePadding>
                                    <Tooltip title={!open ? navItem.component : ""} placement="right">
                                        <StyledListItemButton
                                            active={activeRoute === navItem.link}
                                            onClick={() => handleNavigation(navItem.link)}
                                            sx={{
                                                justifyContent: open ? 'initial' : 'center',
                                                px: open ? 2.5 : 1.5,
                                            }}
                                        >
                                            <StyledListItemIcon
                                                sx={{
                                                    mr: open ? 2 : 0,
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <navItem.icon />
                                            </StyledListItemIcon>
                                            <StyledListItemText
                                                primary={navItem.component}
                                                sx={{
                                                    opacity: open ? 1 : 0,
                                                    transition: 'opacity 0.3s ease'
                                                }}
                                            />
                                        </StyledListItemButton>
                                    </Tooltip>
                                </ListItem>
                            ))}
                            {category !== 'system' && (
                                <Divider sx={{ 
                                    margin: theme.spacing(1.5, 2), 
                                    borderColor: 'rgba(255,255,255,0.2)',
                                    '&::before, &::after': {
                                        borderColor: 'rgba(255,255,255,0.2)'
                                    }
                                }} />
                            )}
                        </React.Fragment>
                    ))}
                </List>
            </Drawer>

            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleMobileDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        background: 'linear-gradient(135deg, #4a5bb8 0%, #5a4a7a 100%)',
                        color: '#ffffff',
                        boxShadow: '0 8px 32px rgba(74, 91, 184, 0.4)',
                        border: 'none',
                        backdropFilter: 'blur(20px)',
                    },
                }}
            >
                <SchoolBrand>
                    <Avatar
                        sx={{
                            width: 56,
                            height: 56,
                            background: 'linear-gradient(45deg, #ffffff 30%, #f8f9fa 90%)',
                            fontSize: '1.8rem',
                            animation: `${pulse} 2s infinite`,
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                            border: '2px solid rgba(255,255,255,0.3)'
                        }}
                    >
                        🎓
                    </Avatar>
                    <Box>
                        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.95)', fontWeight: 700, fontSize: '1.1rem' }}>
                            EduManage Pro
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                            Excellence in Education
                        </Typography>
                    </Box>
                </SchoolBrand>

                <DrawerHeader>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Badge badgeContent={3} color="error">
                            <CircleNotificationsIcon sx={{ color: 'rgba(255,255,255,0.8)' }} />
                        </Badge>
                    </Box>
                    <Tooltip title="Close Menu">
                        <IconButton
                            onClick={handleMobileDrawerToggle}
                            sx={{
                                color: 'rgba(255,255,255,0.95)',
                                '&:hover': {
                                    background: 'rgba(255,255,255,0.1)',
                                    transform: 'rotate(180deg)'
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <ChevronLeftIcon />
                        </IconButton>
                    </Tooltip>
                </DrawerHeader>

                <List sx={{ height: "100%", padding: theme.spacing(1, 0) }}>
                    {Object.entries(groupedNavItems).map(([category, items]) => (
                        <React.Fragment key={category}>
                            <Typography
                                variant="overline"
                                sx={{
                                    color: 'rgba(255,255,255,0.7)',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    padding: theme.spacing(2, 3, 1, 3),
                                    letterSpacing: '1px',
                                    textTransform: 'uppercase'
                                }}
                            >
                                {categoryLabels[category]}
                            </Typography>
                            {items.map((navItem, index) => (
                                <ListItem key={`mobile-${category}-${index}`} disablePadding>
                                    <StyledListItemButton
                                        active={activeRoute === navItem.link}
                                        onClick={() => {
                                            handleNavigation(navItem.link);
                                            handleMobileDrawerToggle(); // Close drawer after navigation
                                        }}
                                        sx={{ justifyContent: 'initial' }}
                                    >
                                        <StyledListItemIcon>
                                            <navItem.icon />
                                        </StyledListItemIcon>
                                        <StyledListItemText primary={navItem.component} />
                                    </StyledListItemButton>
                                </ListItem>
                            ))}
                            {category !== 'system' && (
                                <Divider sx={{
                                    margin: theme.spacing(1.5, 2),
                                    borderColor: 'rgba(255,255,255,0.2)',
                                    '&::before, &::after': {
                                        borderColor: 'rgba(255,255,255,0.2)'
                                    }
                                }} />
                            )}
                        </React.Fragment>
                    ))}
                </List>
            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                    transition: 'all 0.3s ease',
                    // Mobile responsive padding
                    [theme.breakpoints.down('md')]: {
                        paddingTop: 0,
                        marginLeft: 0,
                    },
                }}
            >
                <DrawerHeader />
                <Box sx={{
                    padding: theme.spacing(3),
                    [theme.breakpoints.down('md')]: {
                        padding: theme.spacing(2, 1),
                    },
                    [theme.breakpoints.down('sm')]: {
                        padding: theme.spacing(1, 0.5),
                    },
                }}>
                    <Outlet />
                </Box>
            </Box>
          </Box>
        </DashboardProvider>
    );
}