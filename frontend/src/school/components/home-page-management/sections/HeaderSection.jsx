import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
  Divider,
  Avatar
} from '@mui/material';
import {
  Save as SaveIcon,
  CloudUpload as UploadIcon,
  Palette as PaletteIcon,
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  LinkedIn
} from '@mui/icons-material';
import axios from 'axios';
import { baseUrl } from '../../../../environment';

const HeaderSection = ({ data, updateData, saveSection, showSnackbar, schoolId, saving }) => {
  const [formData, setFormData] = useState(data.header || {});
  const [logoPreview, setLogoPreview] = useState(data.header?.logo || '');
  const [uploading, setUploading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialMediaChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showSnackbar('Please upload an image file', 'error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showSnackbar('Image size should be less than 5MB', 'error');
      return;
    }

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      setUploading(true);
      const response = await axios.post(
        `${baseUrl}/home-page-content/${schoolId}/upload`,
        formDataUpload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        const logoUrl = response.data.files[0].url;
        setLogoPreview(logoUrl);
        setFormData(prev => ({
          ...prev,
          logo: logoUrl
        }));
        showSnackbar('Logo uploaded successfully', 'success');
      }
    } catch (error) {
      console.error('Logo upload error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error uploading logo';
      showSnackbar(errorMessage, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    await saveSection('/header', formData, 'Header settings saved successfully');
  };

  return (
    <Box>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <PaletteIcon sx={{ mr: 1 }} />
          Header & Branding
        </Typography>

        <Grid container spacing={3}>
          {/* Logo Upload */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              School Logo
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={logoPreview}
                sx={{ width: 100, height: 100, border: '2px solid #667eea' }}
              >
                {formData.schoolName?.charAt(0) || 'S'}
              </Avatar>
              <Button
                variant="contained"
                component="label"
                startIcon={<UploadIcon />}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload Logo'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
              </Button>
            </Box>
            <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
              Recommended size: 200x200px, Max size: 5MB
            </Typography>
          </Grid>

          {/* School Name */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="School Name"
              value={formData.schoolName || ''}
              onChange={(e) => handleChange('schoolName', e.target.value)}
              required
            />
          </Grid>

          {/* Tagline */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tagline / Slogan"
              value={formData.tagline || ''}
              onChange={(e) => handleChange('tagline', e.target.value)}
              placeholder="Excellence in Education"
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Color Theme
            </Typography>
          </Grid>

          {/* Color Pickers */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Primary Color"
              type="color"
              value={formData.primaryColor || '#667eea'}
              onChange={(e) => handleChange('primaryColor', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: 1,
                        backgroundColor: formData.primaryColor,
                        border: '1px solid #ccc'
                      }}
                    />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Secondary Color"
              type="color"
              value={formData.secondaryColor || '#764ba2'}
              onChange={(e) => handleChange('secondaryColor', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: 1,
                        backgroundColor: formData.secondaryColor,
                        border: '1px solid #ccc'
                      }}
                    />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Accent Color"
              type="color"
              value={formData.accentColor || '#f093fb'}
              onChange={(e) => handleChange('accentColor', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: 1,
                        backgroundColor: formData.accentColor,
                        border: '1px solid #ccc'
                      }}
                    />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {/* Font Family */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Font Family"
              value={formData.fontFamily || 'Roboto, sans-serif'}
              onChange={(e) => handleChange('fontFamily', e.target.value)}
              placeholder="Roboto, sans-serif"
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
          </Grid>

          {/* Contact Email */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Contact Email"
              type="email"
              value={formData.contactEmail || ''}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
            />
          </Grid>

          {/* Contact Phone */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Contact Phone"
              value={formData.contactPhone || ''}
              onChange={(e) => handleChange('contactPhone', e.target.value)}
            />
          </Grid>

          {/* Address */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Address"
              value={formData.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Social Media Links
            </Typography>
          </Grid>

          {/* Facebook */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Facebook URL"
              value={formData.socialMedia?.facebook || ''}
              onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Facebook color="primary" />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {/* Twitter */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Twitter URL"
              value={formData.socialMedia?.twitter || ''}
              onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Twitter color="primary" />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {/* Instagram */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Instagram URL"
              value={formData.socialMedia?.instagram || ''}
              onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Instagram color="secondary" />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {/* YouTube */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="YouTube URL"
              value={formData.socialMedia?.youtube || ''}
              onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <YouTube color="error" />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {/* LinkedIn */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="LinkedIn URL"
              value={formData.socialMedia?.linkedin || ''}
              onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkedIn color="primary" />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {/* Save Button */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={saving}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  px: 4,
                  py: 1.5
                }}
              >
                {saving ? 'Saving...' : 'Save Header Settings'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default HeaderSection;
