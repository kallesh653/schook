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
    const getBrowserInstructions = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.includes('chrome') && !userAgent.includes('edge')) {
        return {
          browser: 'Chrome',
          steps: [
            'Click the lock icon (🔒) or info icon (ⓘ) in the address bar',
            'Find "Notifications" in the permissions list',
            'Change it from "Block" to "Allow"',
            'Refresh the page'
          ]
        };
      } else if (userAgent.includes('firefox')) {
        return {
          browser: 'Firefox',
          steps: [
            'Click the lock icon (🔒) in the address bar',
            'Click "Connection secure" or "Permissions"',
            'Find "Receive Notifications"',
            'Remove the block and refresh the page'
          ]
        };
      } else if (userAgent.includes('safari')) {
        return {
          browser: 'Safari',
          steps: [
            'Go to Safari → Settings → Websites → Notifications',
            'Find this website in the list',
            'Change to "Allow"',
            'Refresh the page'
          ]
        };
      } else if (userAgent.includes('edge')) {
        return {
          browser: 'Edge',
          steps: [
            'Click the lock icon (🔒) in the address bar',
            'Click "Permissions for this site"',
            'Find "Notifications" and change to "Allow"',
            'Refresh the page'
          ]
        };
      }
      return {
        browser: 'your browser',
        steps: [
          'Click the lock or info icon in the address bar',
          'Look for notification permissions',
          'Change from "Block" to "Allow"',
          'Refresh the page'
        ]
      };
    };

    const instructions = getBrowserInstructions();

    return (
      <Card sx={{ mb: 2, background: 'linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%)', border: '2px solid #ff9800' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <NotificationsIcon sx={{ fontSize: 40, color: '#ff9800', mt: 0.5 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#d84315', mb: 1 }}>
                Notifications Blocked
              </Typography>
              <Typography variant="body2" sx={{ color: '#5d4037', mb: 2 }}>
                You previously blocked notifications. To receive important updates about attendance, marks, and notices, please enable them:
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#d84315', mb: 1 }}>
                📱 How to enable in {instructions.browser}:
              </Typography>
              <Box component="ol" sx={{ pl: 2, m: 0 }}>
                {instructions.steps.map((step, index) => (
                  <Typography component="li" key={index} variant="body2" sx={{ color: '#5d4037', mb: 0.5 }}>
                    {step}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
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
                <Box sx={{ transform: 'scale(0.9)' }}>
                  <NotificationsActiveIcon sx={{ fontSize: 48, color: 'white' }} />
                </Box>

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
