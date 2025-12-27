import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  GetApp as DownloadIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { baseUrl } from '../../../environment';
import axios from 'axios';
import AnimatedEducationLogo from '../../../components/AnimatedEducationLogo';

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

const DownloadAppButton = styled(StyledButton)({
  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  boxShadow: '0 4px 15px rgba(245, 87, 108, 0.4)',
  '&:hover': {
    boxShadow: '0 6px 20px rgba(245, 87, 108, 0.6)'
  }
});

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallDialog, setShowInstallDialog] = useState(false);

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

  const [schoolLogo, setSchoolLogo] = useState('/school-logo.png');
  const [schoolName, setSchoolName] = useState('School Management');

  // Fetch public home page data
  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/public-home/data`);
        if (response.data.success) {
          const data = response.data.data;
          if (data.header) {
            setSchoolName(data.header.siteName || 'School Management');
            setSchoolLogo(data.header.logo || '/school-logo.png');
          }
        }
      } catch (error) {
        console.error('Error fetching public data:', error);
        // Use default logo if API fails
        setSchoolLogo('/school-logo.png');
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

  // PWA Install Handler - Enhanced
  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        window.navigator.standalone ||
                        document.referrer.includes('android-app://');

    if (isStandalone) {
      console.log('✅ App is already installed - hiding install button');
      setShowInstallButton(false);
      return;
    }

    // Show install button immediately for all users (not installed)
    console.log('📱 Showing Download App button');
    setShowInstallButton(true);

    const handleBeforeInstallPrompt = (e) => {
      console.log('✅ beforeinstallprompt event fired - Native prompt available');
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    const handleAppInstalled = () => {
      console.log('✅ PWA installed successfully');
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    console.log('📱 Download App button clicked');
    console.log('Deferred prompt available:', !!deferredPrompt);

    if (!deferredPrompt) {
      // No native prompt available - show browser-specific instructions
      console.log('ℹ️ Showing manual installation instructions');
      setShowInstallDialog(true);
      return;
    }

    try {
      console.log('🚀 Triggering native PWA install prompt...');

      // Show the native install prompt
      const promptResult = await deferredPrompt.prompt();
      console.log('✅ Native prompt shown:', promptResult);

      // Wait for user's response
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`📊 User response: ${outcome}`);

      if (outcome === 'accepted') {
        console.log('✅ User accepted installation - App will install shortly');
        setShowInstallButton(false);
      } else {
        console.log('❌ User dismissed installation');
        // Still show manual instructions as fallback
        setShowInstallDialog(true);
      }

      // Clear the deferred prompt
      setDeferredPrompt(null);
    } catch (error) {
      console.error('❌ Error during PWA installation:', error);
      // Fallback to manual instructions
      setShowInstallDialog(true);
    }
  };

  const getBrowserInstructions = () => {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.includes('chrome') && !userAgent.includes('edge')) {
      if (/android/i.test(userAgent)) {
        return {
          browser: 'Chrome (Android)',
          icon: '📱',
          steps: [
            'Tap the menu button (⋮) in the top right corner',
            'Select "Add to Home screen" or "Install app"',
            'Tap "Add" to confirm installation',
            'The app icon will appear on your home screen'
          ]
        };
      }
      return {
        browser: 'Chrome (Desktop)',
        icon: '💻',
        steps: [
          'Look for the install icon (⊕) in the address bar',
          'Or click the menu (⋮) → "Install School Management System"',
          'Click "Install" to confirm',
          'The app will open in a new window'
        ]
      };
    } else if (userAgent.includes('safari') && /iphone|ipad/i.test(userAgent)) {
      return {
        browser: 'Safari (iOS)',
        icon: '🍎',
        steps: [
          'Tap the Share button (⎙) at the bottom',
          'Scroll down and tap "Add to Home Screen"',
          'Tap "Add" in the top right',
          'The app icon will appear on your home screen'
        ]
      };
    } else if (userAgent.includes('edge')) {
      return {
        browser: 'Microsoft Edge',
        icon: '🌐',
        steps: [
          'Click the menu (...) in the top right',
          'Go to Apps → "Install this site as an app"',
          'Click "Install" to confirm',
          'The app will open in a new window'
        ]
      };
    }

    return {
      browser: 'Your Browser',
      icon: '🌐',
      steps: [
        'Chrome (Desktop): Click install icon in address bar',
        'Chrome (Mobile): Menu → "Add to Home screen"',
        'Safari (iOS): Share → "Add to Home Screen"',
        'Edge: Menu → Apps → "Install app"'
      ]
    };
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
              <Logo
                src={schoolLogo}
                alt={schoolName}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/school-logo.png';
                }}
              />
              <BrandText textColor={headerSettings.textColor}>
                {schoolName}
              </BrandText>
            </LogoContainer>
          </Link>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Right Side Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

            {/* Download App Button - Always visible when not installed */}
            {showInstallButton && headerSettings.showDownloadButton && (
              <DownloadAppButton
                onClick={handleInstallClick}
                sx={{ display: { xs: 'none', sm: 'flex' } }}
                title="Install app to your device"
              >
                <DownloadIcon />
                Download App
              </DownloadAppButton>
            )}

            {/* Not Authenticated */}
            {!authenticated && (
              <>
                {/* Student Login Button */}
                <Link to="/student-login" style={{ textDecoration: 'none' }}>
                  <StyledButton sx={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}>
                    <PersonIcon />
                    <span style={{ display: { xs: 'none', sm: 'inline' } }}>Student Login</span>
                  </StyledButton>
                </Link>

                {headerSettings.showLoginButton && (
                  <Link to="/login" style={{ textDecoration: 'none' }}>
                    <StyledButton>
                      <LoginIcon />
                      <span style={{ display: { xs: 'none', sm: 'inline' } }}>Admin Login</span>
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

      {/* Professional Install Instructions Dialog */}
      <Dialog
        open={showInstallDialog}
        onClose={() => setShowInstallDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }
        }}
      >
        <DialogContent sx={{ pt: 4, pb: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            {/* Animated Logo */}
            <AnimatedEducationLogo />

            {/* Title */}
            <Typography variant="h5" fontWeight="700" textAlign="center">
              Install School Management App
            </Typography>

            {/* Browser-specific instructions */}
            {(() => {
              const instructions = getBrowserInstructions();
              return (
                <>
                  <Typography variant="h6" fontWeight="600" textAlign="center">
                    {instructions.icon} {instructions.browser}
                  </Typography>

                  <List sx={{ width: '100%', bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '12px', p: 2 }}>
                    {instructions.steps.map((step, index) => (
                      <ListItem key={index} sx={{ py: 1 }}>
                        <Box
                          sx={{
                            minWidth: 32,
                            height: 32,
                            borderRadius: '50%',
                            bgcolor: 'rgba(255,255,255,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2,
                            fontWeight: 700
                          }}
                        >
                          {index + 1}
                        </Box>
                        <ListItemText
                          primary={step}
                          primaryTypographyProps={{
                            sx: { color: 'white', fontSize: '0.95rem' }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Typography variant="body2" textAlign="center" sx={{ opacity: 0.9, mt: 1 }}>
                    💡 Installed apps load faster and work offline!
                  </Typography>
                </>
              );
            })()}
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            onClick={() => setShowInstallDialog(false)}
            variant="contained"
            sx={{
              bgcolor: 'white',
              color: '#667eea',
              fontWeight: 700,
              px: 4,
              py: 1.5,
              borderRadius: '12px',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)'
              }
            }}
          >
            Got it!
          </Button>
        </DialogActions>
      </Dialog>
    </StyledAppBar>
  );
};

export default Navbar;
