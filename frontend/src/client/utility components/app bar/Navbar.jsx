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
    padding: '6px 12px',
    fontSize: '0.75rem',
    gap: '4px'
  }
});

const LoginButton = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 24px',
  borderRadius: '25px',
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  color: 'white',
  fontWeight: 700,
  fontSize: '0.95rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
  '&:hover': {
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.6)'
  },
  '@media (max-width: 600px)': {
    padding: '8px 16px',
    fontSize: '0.8rem',
    gap: '4px',
    '& svg': {
      fontSize: '1rem'
    }
  }
});

const StudentLoginButton = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 24px',
  borderRadius: '25px',
  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
  color: 'white',
  fontWeight: 700,
  fontSize: '0.95rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(2, 132, 199, 0.4)',
  '&:hover': {
    background: 'linear-gradient(135deg, #0369a1 0%, #075985 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(2, 132, 199, 0.6)'
  },
  '@media (max-width: 600px)': {
    padding: '8px 16px',
    fontSize: '0.8rem',
    gap: '4px',
    '& svg': {
      fontSize: '1rem'
    }
  }
});

const RegisterButton = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 24px',
  borderRadius: '25px',
  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  color: 'white',
  fontWeight: 700,
  fontSize: '0.95rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)',
  '&:hover': {
    background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(245, 158, 11, 0.6)'
  },
  '@media (max-width: 600px)': {
    padding: '8px 16px',
    fontSize: '0.8rem',
    gap: '4px',
    '& svg': {
      fontSize: '1rem'
    }
  }
});

const DownloadAppButton = styled(Button)({
  background: 'linear-gradient(135deg, #ff3838 0%, #ff1744 100%)',
  color: 'white',
  fontWeight: 700,
  padding: '12px 24px',
  borderRadius: '12px',
  textTransform: 'none',
  fontSize: '0.95rem',
  boxShadow: '0 4px 20px rgba(255, 23, 68, 0.5)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #ff1744 0%, #d50000 100%)',
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 30px rgba(255, 23, 68, 0.6)',
  },
  '@media (max-width: 600px)': {
    padding: '10px 20px',
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

  // PWA Install Handler
  useEffect(() => {
    console.log('[NAVBAR] PWA install handler initializing');

    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        window.navigator.standalone ||
                        document.referrer.includes('android-app://');

    if (isStandalone) {
      console.log('[NAVBAR] App already installed');
      setShowInstallButton(false);
      return;
    }

    // Show install button (not installed)
    setShowInstallButton(true);

    // Use the global prompt if available
    if (window.deferredPrompt) {
      setDeferredPrompt(window.deferredPrompt);
      console.log('[NAVBAR] Using global deferred prompt');
    }

    // Listen for when prompt becomes available
    const handlePWAInstallable = () => {
      console.log('[NAVBAR] PWA became installable');
      setDeferredPrompt(window.deferredPrompt);
    };

    // Listen for installation complete
    const handlePWAInstalled = () => {
      console.log('[NAVBAR] PWA installed - hiding button');
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('pwa-installable', handlePWAInstallable);
    window.addEventListener('pwa-installed', handlePWAInstalled);

    return () => {
      window.removeEventListener('pwa-installable', handlePWAInstallable);
      window.removeEventListener('pwa-installed', handlePWAInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    console.log('[NAVBAR] 🔘 Download App button clicked');

    const prompt = deferredPrompt || window.deferredPrompt;

    if (!prompt) {
      console.error('[NAVBAR] ❌ NO INSTALL PROMPT AVAILABLE');
      console.error('Possible reasons:');
      console.error('1. App not served over HTTPS');
      console.error('2. Service worker not registered');
      console.error('3. App already installed');
      console.error('4. Browser does not support PWA');

      // Show instructions only if really needed
      setShowInstallDialog(true);
      return;
    }

    try {
      console.log('[NAVBAR] ✅ Prompt available - triggering native install');

      // Trigger the native browser installation dialog
      await prompt.prompt();

      // Wait for user's choice
      const { outcome } = await prompt.userChoice;
      console.log(`[NAVBAR] 📊 User ${outcome} the installation`);

      if (outcome === 'accepted') {
        console.log('[NAVBAR] 🎉 Installation accepted!');
        setShowInstallButton(false);
        window.deferredPrompt = null;
        setDeferredPrompt(null);
      } else {
        console.log('[NAVBAR] ❌ User declined installation');
      }
    } catch (error) {
      console.error('[NAVBAR] ❌ Installation error:', error.message);
      console.error('Full error:', error);
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
                  <StudentLoginButton>
                    <PersonIcon />
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Student Login</Box>
                  </StudentLoginButton>
                </Link>

                {headerSettings.showLoginButton && (
                  <Link to="/login" style={{ textDecoration: 'none' }}>
                    <LoginButton>
                      <LoginIcon />
                      <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Admin Login</Box>
                    </LoginButton>
                  </Link>
                )}

                {headerSettings.showRegisterButton && (
                  <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Link to="/register" style={{ textDecoration: 'none' }}>
                      <RegisterButton>
                        <PersonAddIcon />
                        Register
                      </RegisterButton>
                    </Link>
                  </Box>
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
