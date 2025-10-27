import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { Link } from 'react-router-dom';
import { styled, keyframes } from '@mui/material/styles';
import axios from 'axios';
import { baseUrl } from '../../../environment';

// ICONS
import LoginIcon from '@mui/icons-material/Login';
import SchoolIcon from '@mui/icons-material/School';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DownloadIcon from '@mui/icons-material/Download';
import { useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';
import { AuthContext } from '../../../context/AuthContext';


import("./Navbar.css")

// Animations
const fadeInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const glow = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(102, 126, 234, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.6);
  }
  100% {
    box-shadow: 0 0 5px rgba(102, 126, 234, 0.3);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

// Styled Components
const StyledAppBar = styled(AppBar)(({ theme, headerBgColor }) => ({
  background: headerBgColor || '#fefefe',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  animation: `${fadeInDown} 0.8s ease-out`,
  position: 'sticky',
  top: 0,
  zIndex: 1100,
  borderBottom: '1px solid #e0e0e0'
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  '& img': {
    borderRadius: '50%',
    border: '2px solid #e0e0e0',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
      border: '2px solid #333'
    }
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  padding: '8px 20px',
  margin: '0 4px',
  background: '#f8f9fa',
  border: '1px solid #dee2e6',
  color: '#333',
  fontWeight: 500,
  textTransform: 'none',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: '#e9ecef',
    transform: 'translateY(-1px)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1),
    fontSize: '1.1rem'
  }
}));

const DashboardButton = styled(StyledButton)(({ theme }) => ({
  background: '#495057',
  color: '#fff',
  border: '1px solid #495057',
  '&:hover': {
    background: '#343a40',
    border: '1px solid #343a40'
  }
}));

const LogoutButton = styled(StyledButton)(({ theme }) => ({
  background: '#6c757d',
  color: '#fff',
  border: '1px solid #6c757d',
  '&:hover': {
    background: '#5a6268',
    border: '1px solid #5a6268'
  }
}));

const BrandText = styled(Typography)(({ theme, textColor }) => ({
  color: textColor || '#333',
  fontWeight: 700,
  letterSpacing: '0.05rem',
  textDecoration: 'none',
  '&:hover': {
    color: textColor ? `${textColor}dd` : '#495057'
  }
}));

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [schoolName, setSchoolName] = React.useState('GenTime');
  const [schoolLogo, setSchoolLogo] = React.useState(null);
  const [headerSettings, setHeaderSettings] = React.useState({
    showLogo: true,
    showLoginButton: true,
    showRegisterButton: true,
    showDashboardButton: true,
    backgroundColor: '#fefefe',
    textColor: '#333'
  });
  const { authenticated, user } = React.useContext(AuthContext);
  const  [dashboardLink, setDashboardLink] = React.useState('/');
  const [deferredPrompt, setDeferredPrompt] = React.useState(null);
  const [showInstallButton, setShowInstallButton] = React.useState(false)
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Function to fetch school info for header from PUBLIC HOME PAGE
  const fetchSchoolInfo = React.useCallback(async () => {
    try {
      // Fetch from PUBLIC HOME PAGE endpoint
      const response = await axios.get(`${baseUrl}/public-home/data`);

      if (response.data.success && response.data.data) {
        const data = response.data.data;

        // Update header from public home page data
        if (data.header) {
          setSchoolName(data.header.siteName || 'GenTime');
          setSchoolLogo(data.header.logo || null);
          setHeaderSettings(prev => ({
            ...prev,
            showLoginButton: data.header.showLoginButton !== false,
            showRegisterButton: data.header.showRegisterButton !== false,
            backgroundColor: data.header.backgroundColor || '#fefefe',
            textColor: data.header.textColor || '#333'
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching public home page header:', error);
    }
  }, []);

  // Function to update header from API data
  const updateHeaderFromData = (data) => {
    // Update header settings
    if (data.headerSettings) {
      setHeaderSettings(prev => ({ ...prev, ...data.headerSettings }));
    }

    // Update school name
    if (data.headerSettings?.schoolName) {
      setSchoolName(data.headerSettings.schoolName);
    } else if (data.schoolInfo?.name) {
      setSchoolName(data.schoolInfo.name.toUpperCase());
    }

    // Update school logo
    if (data.media?.logo) {
      setSchoolLogo(data.media.logo);
    }
  };

  // Fetch school info for header on mount and set up refresh
  React.useEffect(() => {
    fetchSchoolInfo();

    // Listen for custom refresh event from admin panel
    const handleRefresh = () => {
      fetchSchoolInfo();
    };

    window.addEventListener('frontpage-refresh', handleRefresh);

    return () => {
      window.removeEventListener('frontpage-refresh', handleRefresh);
    };
  }, [fetchSchoolInfo]);

  // PWA Install Handler
  React.useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('To install GenTime:\n\niOS: Tap Share button → Add to Home Screen\n\nAndroid: This app is already installed or your browser does not support installation');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  const theme = useTheme();

  return (
    <StyledAppBar position="static" headerBgColor={headerSettings.backgroundColor}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ py: 1 }}>
          <Link className="nav-list" style={{textDecoration:"none"}} to={'/'}>
            <LogoContainer sx={{ display: { xs: 'none', md: 'flex' } }}>
              {headerSettings.showLogo && schoolLogo ? (
                <img
                  src={schoolLogo}
                  alt="School Logo"
                  height={"60px"}
                  width={'60px'}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <SchoolIcon sx={{ fontSize: 40, color: headerSettings.textColor || '#333', mr: 1 }} />
              )}
              <BrandText variant="h5" textColor={headerSettings.textColor}>
                {schoolName}
              </BrandText>
            </LogoContainer>
          </Link>


          {/* Mobile - Login Button on LEFT */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            {!authenticated && headerSettings.showLoginButton && (
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <StyledButton size="small" sx={{
                  minWidth: 'auto',
                  px: 2,
                  py: 1,
                  fontSize: '0.875rem'
                }}>
                  <LoginIcon sx={{ fontSize: '1rem' }} />
                  Login
                </StyledButton>
              </Link>
            )}
          </Box>

          {/* Mobile - Logo and Name on RIGHT */}
          <Link className="nav-list" to={'/'} style={{textDecoration:"none"}}>
            <LogoContainer sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 1, justifyContent: 'flex-end' }}>
              {headerSettings.showLogo && schoolLogo ? (
                <img
                  src={schoolLogo}
                  alt="School Logo"
                  height={"40px"}
                  width={'40px'}
                  style={{ marginRight: '8px' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <SchoolIcon sx={{ fontSize: 30, color: headerSettings.textColor || '#333', mr: 1 }} />
              )}
              <BrandText variant="h6" textColor={headerSettings.textColor}>
                {schoolName.length > 20 ? 'SMS' : schoolName}
              </BrandText>
            </LogoContainer>
          </Link>


      
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: "flex-end", gap: 1 }}>
            {!authenticated && (
              <>
                {headerSettings.showLoginButton && (
                  <Link to="/login" style={{ textDecoration: 'none' }}>
                    <StyledButton>
                      <LoginIcon />
                      Login
                    </StyledButton>
                  </Link>
                )}

                {headerSettings.showRegisterButton && (
                  <Link to="/register" style={{ textDecoration: 'none' }}>
                    <StyledButton>
                      <PersonAddIcon />
                      Register
                    </StyledButton>
                  </Link>
                )}
              </>
            )}

            {authenticated && (
              <>
                {headerSettings.showDashboardButton && (
                  <Link to={`/${user?.role?.toLowerCase()}`} style={{ textDecoration: 'none' }}>
                    <DashboardButton>
                      <DashboardIcon />
                      Dashboard
                    </DashboardButton>
                  </Link>
                )}

                <Link to="/logout" style={{ textDecoration: 'none' }}>
                  <LogoutButton>
                    <LogoutIcon />
                    Logout
                  </LogoutButton>
                </Link>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Floating Action Buttons - Below Header */}
      {!authenticated && (
        <Box sx={{
          display: { xs: 'flex', md: 'none' },
          gap: 1,
          px: 2,
          py: 1,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {headerSettings.showLoginButton && (
            <Link to="/login" style={{ textDecoration: 'none', flex: 1 }}>
              <Button
                variant="contained"
                fullWidth
                size="small"
                sx={{
                  background: '#fff',
                  color: '#667eea',
                  fontWeight: 600,
                  py: 1,
                  '&:hover': {
                    background: '#f0f0f0',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  },
                  transition: 'all 0.2s ease'
                }}
                startIcon={<LoginIcon />}
              >
                Login
              </Button>
            </Link>
          )}
          {showInstallButton && (
            <Button
              variant="contained"
              size="small"
              onClick={handleInstallClick}
              sx={{
                background: '#FFD700',
                color: '#333',
                fontWeight: 600,
                py: 1,
                flex: 1,
                '&:hover': {
                  background: '#FFC700',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                },
                transition: 'all 0.2s ease'
              }}
              startIcon={<DownloadIcon />}
            >
              Download App
            </Button>
          )}
        </Box>
      )}
    </StyledAppBar>
  );
}
export default Navbar;
