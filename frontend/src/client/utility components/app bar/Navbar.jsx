import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Container, Box, IconButton, Avatar, Menu, MenuItem, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  GetApp as DownloadIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { baseUrl } from '../../../environment';
import axios from 'axios';

// Styled Components
const StyledAppBar = styled(AppBar)(({ headerBgColor }) => ({
  background: headerBgColor || 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
  position: 'sticky',
  top: 0,
  zIndex: 1100
}));

const LogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)'
  }
});

const Logo = styled('img')({
  height: '50px',
  width: '50px',
  objectFit: 'contain',
  borderRadius: '8px'
});

const BrandText = styled(Typography)(({ textColor }) => ({
  fontWeight: 700,
  fontSize: '1.5rem',
  color: textColor || '#333',
  letterSpacing: '0.5px',
  '@media (max-width: 600px)': {
    fontSize: '1.2rem'
  }
}));

const StyledButton = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 20px',
  borderRadius: '25px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  fontWeight: 600,
  fontSize: '0.95rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)'
  },
  '@media (max-width: 600px)': {
    padding: '8px 16px',
    fontSize: '0.85rem'
  }
});

const DashboardButton = styled(StyledButton)({
  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  boxShadow: '0 4px 15px rgba(67, 233, 123, 0.4)',
  '&:hover': {
    boxShadow: '0 6px 20px rgba(67, 233, 123, 0.6)'
  }
});

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Header settings
  const [headerSettings, setHeaderSettings] = useState({
    showLogo: true,
    showLoginButton: true,
    showRegisterButton: true,
    showDashboardButton: true,
    showDownloadButton: true,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    textColor: '#333'
  });

  const [schoolLogo, setSchoolLogo] = useState('');
  const [schoolName, setSchoolName] = useState('GenTime School');

  // Fetch public home page data
  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/public-home/data`);
        if (response.data.success) {
          const data = response.data.data;
          if (data.header) {
            setSchoolName(data.header.siteName || 'GenTime School');
            setSchoolLogo(data.header.logo || '');
          }
        }
      } catch (error) {
        console.error('Error fetching public data:', error);
      }
    };

    fetchPublicData();
  }, []);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get(`${baseUrl}/auth/check`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data.success) {
            setUser(response.data.user);
            setAuthenticated(true);
          }
        } catch (error) {
          setAuthenticated(false);
        }
      }
    };

    checkAuth();
  }, []);

  // PWA Install Handler
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallButton(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setAuthenticated(false);
    handleMenuClose();
    navigate('/');
  };

  return (
    <StyledAppBar headerBgColor={headerSettings.backgroundColor}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ py: 1, minHeight: '70px' }}>

          {/* Logo and Brand - Always visible */}
          <Link to="/" style={{ textDecoration: 'none', flexGrow: { xs: 1, md: 0 } }}>
            <LogoContainer>
              {schoolLogo ? (
                <Logo src={schoolLogo} alt={schoolName} />
              ) : (
                <SchoolIcon sx={{ fontSize: 50, color: headerSettings.textColor || '#667eea' }} />
              )}
              <BrandText textColor={headerSettings.textColor}>
                {schoolName}
              </BrandText>
            </LogoContainer>
          </Link>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Right Side Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

            {/* Download App Button */}
            {showInstallButton && headerSettings.showDownloadButton && (
              <StyledButton onClick={handleInstallClick} sx={{ display: { xs: 'none', sm: 'flex' } }}>
                <DownloadIcon />
                Download App
              </StyledButton>
            )}

            {/* Not Authenticated */}
            {!authenticated && (
              <>
                {headerSettings.showLoginButton && (
                  <Link to="/login" style={{ textDecoration: 'none' }}>
                    <StyledButton>
                      <LoginIcon />
                      <span style={{ display: { xs: 'none', sm: 'inline' } }}>Login</span>
                    </StyledButton>
                  </Link>
                )}

                {headerSettings.showRegisterButton && (
                  <Link to="/register" style={{ textDecoration: 'none', display: { xs: 'none', md: 'block' } }}>
                    <StyledButton>
                      <PersonAddIcon />
                      Register
                    </StyledButton>
                  </Link>
                )}
              </>
            )}

            {/* Authenticated */}
            {authenticated && (
              <>
                {headerSettings.showDashboardButton && (
                  <Link to={`/${user?.role?.toLowerCase()}`} style={{ textDecoration: 'none' }}>
                    <DashboardButton>
                      <DashboardIcon />
                      <span style={{ display: { xs: 'none', sm: 'inline' } }}>Dashboard</span>
                    </DashboardButton>
                  </Link>
                )}

                {/* User Avatar Menu */}
                <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                  <Avatar
                    src={user?.profilePicture}
                    alt={user?.name}
                    sx={{
                      width: 45,
                      height: 45,
                      border: '2px solid #667eea',
                      cursor: 'pointer'
                    }}
                  >
                    {user?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      minWidth: 200,
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <MenuItem disabled>
                    <Typography variant="body2" fontWeight="bold">
                      {user?.name}
                    </Typography>
                  </MenuItem>
                  <MenuItem disabled>
                    <Typography variant="caption" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ color: '#f44336', mt: 1 }}>
                    <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Navbar;
