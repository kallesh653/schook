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
  Divider
} from '@mui/material';
import {
  Map as MapIcon,
  LocationOn,
  Save as SaveIcon,
  OpenInNew as OpenIcon
} from '@mui/icons-material';

const MapLocationSettings = ({ mapSettings, onSave }) => {
  const [settings, setSettings] = useState({
    showMap: mapSettings?.showMap || false,
    latitude: mapSettings?.latitude || '',
    longitude: mapSettings?.longitude || '',
    zoom: mapSettings?.zoom || 15,
    mapUrl: mapSettings?.mapUrl || '',
    embedUrl: mapSettings?.embedUrl || ''
  });

  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(settings);
  };

  const generateEmbedUrl = () => {
    if (settings.latitude && settings.longitude) {
      const embedUrl = `https://www.google.com/maps?q=${settings.latitude},${settings.longitude}&z=${settings.zoom || 15}&output=embed`;
      setSettings(prev => ({ ...prev, embedUrl }));
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 4, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <MapIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Map Location Settings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configure your school location to display on the public home page
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.showMap}
                  onChange={(e) => handleChange('showMap', e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body1" fontWeight="600">
                    Show Map Location
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Display a clickable map icon on your public home page
                  </Typography>
                </Box>
              }
            />
          </Grid>

          {settings.showMap && (
            <>
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  You can either provide coordinates (latitude/longitude) OR a custom Google Maps embed URL.
                  Coordinates will automatically generate an embed link.
                </Alert>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Latitude"
                  type="number"
                  value={settings.latitude}
                  onChange={(e) => handleChange('latitude', e.target.value)}
                  placeholder="e.g., 28.7041"
                  helperText="Enter your school's latitude coordinate"
                  InputProps={{
                    startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Longitude"
                  type="number"
                  value={settings.longitude}
                  onChange={(e) => handleChange('longitude', e.target.value)}
                  placeholder="e.g., 77.1025"
                  helperText="Enter your school's longitude coordinate"
                  InputProps={{
                    startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Map Zoom Level"
                  type="number"
                  value={settings.zoom}
                  onChange={(e) => handleChange('zoom', parseInt(e.target.value) || 15)}
                  placeholder="15"
                  helperText="Zoom level (1-20, default: 15)"
                  inputProps={{ min: 1, max: 20 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={generateEmbedUrl}
                  disabled={!settings.latitude || !settings.longitude}
                  sx={{ height: '56px' }}
                >
                  Generate Embed URL
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>
                  <Typography variant="body2" color="text.secondary">OR</Typography>
                </Divider>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Google Maps Embed URL"
                  value={settings.embedUrl}
                  onChange={(e) => handleChange('embedUrl', e.target.value)}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  helperText="Paste the embed URL from Google Maps (Share → Embed a map)"
                  multiline
                  rows={2}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Google Maps Link (Optional)"
                  value={settings.mapUrl}
                  onChange={(e) => handleChange('mapUrl', e.target.value)}
                  placeholder="https://goo.gl/maps/..."
                  helperText="Direct Google Maps link for 'Open in Maps' button"
                  InputProps={{
                    endAdornment: settings.mapUrl && (
                      <OpenIcon
                        sx={{ cursor: 'pointer', color: 'primary.main' }}
                        onClick={() => window.open(settings.mapUrl, '_blank')}
                      />
                    )
                  }}
                />
              </Grid>

              {(settings.embedUrl || (settings.latitude && settings.longitude)) && (
                <>
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      onClick={() => setShowPreview(!showPreview)}
                      fullWidth
                    >
                      {showPreview ? 'Hide Preview' : 'Show Preview'}
                    </Button>
                  </Grid>

                  {showPreview && (
                    <Grid item xs={12}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Map Preview
                        </Typography>
                        <Box sx={{ position: 'relative', paddingTop: '56.25%', width: '100%' }}>
                          <iframe
                            src={settings.embedUrl || `https://www.google.com/maps?q=${settings.latitude},${settings.longitude}&z=${settings.zoom}&output=embed`}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              border: 0,
                              borderRadius: '8px'
                            }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Map Preview"
                          />
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
              sx={{
                mt: 2,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                }
              }}
            >
              Save Map Settings
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Alert severity="warning">
              <Typography variant="body2" fontWeight="600" gutterBottom>
                How to get Google Maps Embed URL:
              </Typography>
              <Typography variant="caption" component="div">
                1. Go to Google Maps and search for your school<br />
                2. Click "Share" button<br />
                3. Click "Embed a map" tab<br />
                4. Copy the URL from the iframe src attribute<br />
                5. Paste it in the "Google Maps Embed URL" field above
              </Typography>
            </Alert>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default MapLocationSettings;
