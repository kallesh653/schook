import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Grid,
  Alert,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Chip
} from '@mui/material';
import {
  Notifications as NotificationIcon,
  Save as SaveIcon,
  Visibility as PreviewIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Warning as WarningIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

const AlertBannerSettings = ({ alertSettings, onSave }) => {
  const [settings, setSettings] = useState({
    show: alertSettings?.show || false,
    message: alertSettings?.message || '',
    type: alertSettings?.type || 'info',
    dismissible: alertSettings?.dismissible !== false,
    autoHide: alertSettings?.autoHide || false,
    autoHideDelay: alertSettings?.autoHideDelay || 5000,
    link: alertSettings?.link || '',
    linkText: alertSettings?.linkText || 'Learn More'
  });

  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(settings);
  };

  const getTypeColor = (type) => {
    const colors = {
      info: '#2196f3',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336'
    };
    return colors[type] || colors.info;
  };

  const getTypeIcon = (type) => {
    const icons = {
      info: <InfoIcon />,
      success: <SuccessIcon />,
      warning: <WarningIcon />,
      error: <ErrorIcon />
    };
    return icons[type] || icons.info;
  };

  return (
    <Box>
      <Paper sx={{ p: 4, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <NotificationIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Alert Banner Settings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create beautiful announcement banners for your public home page
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.show}
                  onChange={(e) => handleChange('show', e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body1" fontWeight="600">
                    Show Alert Banner
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Display an announcement banner at the top of your public home page
                  </Typography>
                </Box>
              }
            />
          </Grid>

          {settings.show && (
            <>
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  The alert banner will appear at the very top of your home page, above the header.
                  Use it for important announcements, events, or urgent notices.
                </Alert>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Alert Type</InputLabel>
                  <Select
                    value={settings.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    label="Alert Type"
                  >
                    <MenuItem value="info">
                      <Box display="flex" alignItems="center" gap={1}>
                        <InfoIcon sx={{ color: '#2196f3' }} />
                        <Typography>Info (Blue)</Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem value="success">
                      <Box display="flex" alignItems="center" gap={1}>
                        <SuccessIcon sx={{ color: '#4caf50' }} />
                        <Typography>Success (Green)</Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem value="warning">
                      <Box display="flex" alignItems="center" gap={1}>
                        <WarningIcon sx={{ color: '#ff9800' }} />
                        <Typography>Warning (Orange)</Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem value="error">
                      <Box display="flex" alignItems="center" gap={1}>
                        <ErrorIcon sx={{ color: '#f44336' }} />
                        <Typography>Error (Red)</Typography>
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Preview Color
                  </Typography>
                  <Box
                    sx={{
                      height: '56px',
                      borderRadius: '8px',
                      background: `linear-gradient(135deg, ${getTypeColor(settings.type)} 0%, ${getTypeColor(settings.type)}dd 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      boxShadow: `0 4px 12px ${getTypeColor(settings.type)}40`
                    }}
                  >
                    {getTypeIcon(settings.type)}
                    <Typography variant="body1" fontWeight="600" sx={{ ml: 1 }}>
                      {settings.type.toUpperCase()}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Alert Message *"
                  value={settings.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  placeholder="Enter your announcement message here..."
                  multiline
                  rows={3}
                  helperText={`${settings.message.length} characters - Keep it concise and impactful`}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.dismissible}
                      onChange={(e) => handleChange('dismissible', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Allow users to dismiss"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoHide}
                      onChange={(e) => handleChange('autoHide', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Auto-hide after delay"
                />
              </Grid>

              {settings.autoHide && (
                <Grid item xs={12}>
                  <Typography variant="body2" gutterBottom>
                    Auto-hide delay: {settings.autoHideDelay / 1000} seconds
                  </Typography>
                  <Slider
                    value={settings.autoHideDelay}
                    onChange={(e, value) => handleChange('autoHideDelay', value)}
                    min={1000}
                    max={30000}
                    step={1000}
                    marks={[
                      { value: 1000, label: '1s' },
                      { value: 5000, label: '5s' },
                      { value: 10000, label: '10s' },
                      { value: 30000, label: '30s' }
                    ]}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value / 1000}s`}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>
                  <Chip label="Optional Action Button" size="small" />
                </Divider>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Action Link (Optional)"
                  value={settings.link}
                  onChange={(e) => handleChange('link', e.target.value)}
                  placeholder="https://example.com"
                  helperText="Add a link for users to learn more or take action"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Link Button Text"
                  value={settings.linkText}
                  onChange={(e) => handleChange('linkText', e.target.value)}
                  placeholder="Learn More"
                  disabled={!settings.link}
                  helperText="Text for the action button"
                />
              </Grid>

              {settings.message && (
                <>
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      startIcon={<PreviewIcon />}
                      onClick={() => setShowPreview(!showPreview)}
                      fullWidth
                    >
                      {showPreview ? 'Hide Preview' : 'Show Preview'}
                    </Button>
                  </Grid>

                  {showPreview && (
                    <Grid item xs={12}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 0,
                          overflow: 'hidden',
                          borderRadius: '12px'
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ p: 2, pb: 1, fontWeight: 600 }}
                        >
                          Live Preview
                        </Typography>
                        <Box
                          sx={{
                            background: `linear-gradient(135deg, ${getTypeColor(settings.type)} 0%, ${getTypeColor(settings.type)}dd 100%)`,
                            color: 'white',
                            p: 3,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                          }}
                        >
                          <Box
                            sx={{
                              width: 50,
                              height: 50,
                              borderRadius: '50%',
                              background: 'rgba(255, 255, 255, 0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {getTypeIcon(settings.type)}
                          </Box>
                          <Typography variant="h6" flex={1}>
                            {settings.message}
                          </Typography>
                          {settings.link && (
                            <Chip
                              label={settings.linkText}
                              sx={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                fontWeight: 'bold'
                              }}
                            />
                          )}
                        </Box>
                      </Paper>
                    </Grid>
                  )}
                </>
              )}
            </>
          )}

          <Grid item xs={12}>
            <Button
              variant="contained"
              size="large"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              fullWidth
              disabled={settings.show && !settings.message}
              sx={{
                mt: 2,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                }
              }}
            >
              Save Alert Banner Settings
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Alert severity="success">
              <Typography variant="body2" fontWeight="600" gutterBottom>
                Examples of effective alert messages:
              </Typography>
              <Typography variant="caption" component="div">
                • "Registration for 2024-25 Academic Year is now open! Limited seats available."<br />
                • "School will remain closed on Monday, November 6th for maintenance."<br />
                • "Join us for our Annual Sports Day on December 15th. Register now!"<br />
                • "Important: Parent-Teacher meeting scheduled for next Friday."
              </Typography>
            </Alert>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AlertBannerSettings;
