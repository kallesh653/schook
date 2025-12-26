import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Avatar,
  Alert,
  Snackbar,
  IconButton,
  Collapse
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  Close as CloseIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import notificationService from '../../../services/notificationService';

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

const NotificationBanner = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: '16px',
  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
  marginBottom: theme.spacing(2)
}));

const NotificationPermission = () => {
  const [permissionStatus, setPermissionStatus] = useState('default');
  const [isEnabled, setIsEnabled] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    checkPermissionStatus();

    // Initialize notifications if already granted
    if (Notification.permission === 'granted') {
      notificationService.initializeNotifications();
    }
  }, []);

  const checkPermissionStatus = () => {
    const status = notificationService.getPermissionStatus();
    setPermissionStatus(status);
    setIsEnabled(status === 'granted');

    // Hide banner if already granted or denied
    if (status !== 'default') {
      setShowBanner(false);
    }
  };

  const handleEnableNotifications = async () => {
    setLoading(true);

    try {
      const token = await notificationService.requestPermission();

      if (token) {
        const saved = await notificationService.saveTokenToBackend(token);

        if (saved) {
          setPermissionStatus('granted');
          setIsEnabled(true);
          setShowBanner(false);
          setSnackbar({
            open: true,
            message: 'Notifications enabled successfully!',
            severity: 'success'
          });

          // Setup listener
          notificationService.setupForegroundListener();
        } else {
          setSnackbar({
            open: true,
            message: 'Failed to save notification token',
            severity: 'error'
          });
        }
      } else {
        setPermissionStatus('denied');
        setSnackbar({
          open: true,
          message: 'Notification permission denied',
          severity: 'warning'
        });
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
      setSnackbar({
        open: true,
        message: 'Failed to enable notifications',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  if (permissionStatus === 'unsupported') {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        Push notifications are not supported in your browser
      </Alert>
    );
  }

  if (permissionStatus === 'denied') {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        Notifications are blocked. Please enable them in your browser settings to receive updates.
      </Alert>
    );
  }

  if (!showBanner && isEnabled) {
    return null;
  }

  return (
    <>
      <Collapse in={showBanner}>
        <NotificationBanner>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                <Avatar
                  sx={{
                    width: { xs: 50, md: 60 },
                    height: { xs: 50, md: 60 },
                    bgcolor: 'rgba(255,255,255,0.2)',
                    animation: `${pulse} 2s infinite`
                  }}
                >
                  <NotificationsActiveIcon sx={{ fontSize: { xs: 28, md: 32 } }} />
                </Avatar>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                    Enable Notifications
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                    Get instant updates about attendance, marks, notices and more!
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Button
                  variant="contained"
                  startIcon={loading ? null : <CheckIcon />}
                  onClick={handleEnableNotifications}
                  disabled={loading}
                  sx={{
                    bgcolor: 'white',
                    color: '#667eea',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)'
                    }
                  }}
                >
                  {loading ? 'Enabling...' : 'Enable'}
                </Button>

                <IconButton
                  onClick={() => setShowBanner(false)}
                  sx={{ color: 'white' }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </NotificationBanner>
      </Collapse>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default NotificationPermission;
