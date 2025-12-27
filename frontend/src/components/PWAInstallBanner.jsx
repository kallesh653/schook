import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  Snackbar,
  Slide,
  Paper,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  CloudDownload,
  Close as CloseIcon,
  GetApp,
  PhoneAndroid
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import AnimatedEducationLogo from './AnimatedEducationLogo';

// Animations
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

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

// Styled components
const InstallBanner = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: 80,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 9999,
  width: '90%',
  maxWidth: '500px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '20px',
  padding: theme.spacing(2, 3),
  boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
  animation: `${slideUp} 0.5s ease-out`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    bottom: 70,
    padding: theme.spacing(1.5, 2),
    width: '85%',
  }
}));

const InstallButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ff3838 0%, #ff1744 100%)',
  color: 'white',
  fontWeight: 700,
  padding: theme.spacing(1, 3),
  borderRadius: '12px',
  textTransform: 'none',
  fontSize: '0.95rem',
  boxShadow: '0 4px 15px rgba(255, 23, 68, 0.4)',
  animation: `${pulse} 2s infinite`,
  '&:hover': {
    background: 'linear-gradient(135deg, #ff1744 0%, #d50000 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(255, 23, 68, 0.6)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.8, 2),
    fontSize: '0.85rem',
  }
}));

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        window.navigator.standalone ||
                        document.referrer.includes('android-app://');

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Check if user dismissed the banner before
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    const dismissedTime = localStorage.getItem('pwa-install-dismissed-time');
    const now = Date.now();
    const oneDayInMs = 24 * 60 * 60 * 1000;

    // Show again after 1 day
    if (dismissed && dismissedTime && (now - parseInt(dismissedTime)) < oneDayInMs) {
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Show banner after 3 seconds
      setTimeout(() => {
        setShowBanner(true);
      }, 3000);
    };

    const handleAppInstalled = () => {
      console.log('✅ PWA installed successfully');
      setShowBanner(false);
      setIsInstalled(true);
      setDeferredPrompt(null);
      localStorage.removeItem('pwa-install-dismissed');
      localStorage.removeItem('pwa-install-dismissed-time');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log('No install prompt available');
      return;
    }

    try {
      console.log('🚀 Triggering native install prompt...');

      // Show the native install prompt
      const promptResult = await deferredPrompt.prompt();
      console.log('Prompt shown:', promptResult);

      // Wait for the user's response
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);

      if (outcome === 'accepted') {
        console.log('✅ User accepted - App will install');
        setShowBanner(false);
        localStorage.removeItem('pwa-install-dismissed');
        localStorage.removeItem('pwa-install-dismissed-time');
      } else {
        console.log('❌ User dismissed the install');
        handleDismiss();
      }

      setDeferredPrompt(null);
    } catch (error) {
      console.error('❌ Error during installation:', error);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
    localStorage.setItem('pwa-install-dismissed-time', Date.now().toString());
  };

  if (isInstalled || !showBanner || !deferredPrompt) {
    return null;
  }

  return (
    <InstallBanner elevation={8}>
      {/* Animated Education Logo */}
      <AnimatedEducationLogo />

      <Box sx={{ flex: 1 }}>
        <Typography
          variant="body1"
          sx={{
            color: 'white',
            fontWeight: 700,
            fontSize: { xs: '0.95rem', sm: '1.1rem' },
            mb: 0.3
          }}
        >
          School Management System
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255, 255, 255, 0.95)',
            fontSize: { xs: '0.75rem', sm: '0.85rem' },
            display: 'block'
          }}
        >
          📱 Install app for faster access
        </Typography>
      </Box>

      <InstallButton
        onClick={handleInstallClick}
        startIcon={<CloudDownload />}
      >
        Install
      </InstallButton>

      <IconButton
        size="small"
        onClick={handleDismiss}
        sx={{
          color: 'rgba(255, 255, 255, 0.9)',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.2)',
          }
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </InstallBanner>
  );
}
