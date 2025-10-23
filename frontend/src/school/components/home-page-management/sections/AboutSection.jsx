import React, { useState } from 'react';
import { Box, Grid, TextField, Button, Typography, Paper, Chip, IconButton } from '@mui/material';
import { Save as SaveIcon, CloudUpload, Delete, Add } from '@mui/icons-material';
import axios from 'axios';
import { baseUrl } from '../../../../environment';

const AboutSection = ({ data, saveSection, showSnackbar, schoolId, saving }) => {
  const [formData, setFormData] = useState(data.about || {});
  const [uploading, setUploading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const formDataUpload = new FormData();
    files.forEach(file => formDataUpload.append('file', file));

    try {
      setUploading(true);
      const response = await axios.post(
        `${baseUrl}/home-page-content/${schoolId}/upload`,
        formDataUpload,
        { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );

      if (response.data.success) {
        const urls = response.data.files.map(f => f.url);
        setFormData(prev => ({ ...prev, images: [...(prev.images || []), ...urls] }));
        showSnackbar('Images uploaded', 'success');
      }
    } catch (error) {
      showSnackbar('Upload error', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleAddValue = () => {
    setFormData(prev => ({ ...prev, values: [...(prev.values || []), ''] }));
  };

  const handleValueChange = (index, value) => {
    const values = [...(formData.values || [])];
    values[index] = value;
    setFormData(prev => ({ ...prev, values }));
  };

  const handleRemoveValue = (index) => {
    setFormData(prev => ({ ...prev, values: prev.values.filter((_, i) => i !== index) }));
  };

  const handleSave = async () => {
    await saveSection('/about', formData, 'About section saved');
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>About Our School</Typography>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Heading" value={formData.heading || ''} onChange={(e) => handleChange('heading', e.target.value)} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Subheading" value={formData.subheading || ''} onChange={(e) => handleChange('subheading', e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth multiline rows={4} label="Description" value={formData.description || ''} onChange={(e) => handleChange('description', e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth multiline rows={3} label="Mission" value={formData.mission || ''} onChange={(e) => handleChange('mission', e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth multiline rows={3} label="Vision" value={formData.vision || ''} onChange={(e) => handleChange('vision', e.target.value)} />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>Core Values</Typography>
            {(formData.values || []).map((value, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField fullWidth size="small" value={value} onChange={(e) => handleValueChange(index, e.target.value)} />
                <IconButton color="error" onClick={() => handleRemoveValue(index)}><Delete /></IconButton>
              </Box>
            ))}
            <Button startIcon={<Add />} onClick={handleAddValue} size="small">Add Value</Button>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>Images</Typography>
            <Button variant="outlined" component="label" startIcon={<CloudUpload />} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Images'}
              <input type="file" hidden multiple accept="image/*" onChange={handleImageUpload} />
            </Button>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
              {(formData.images || []).map((img, index) => (
                <Box key={index} sx={{ position: 'relative' }}>
                  <img src={img} alt="" style={{ width: 150, height: 150, objectFit: 'cover', borderRadius: 8 }} />
                  <IconButton size="small" sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'white' }} onClick={() => handleRemoveImage(index)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disabled={saving}>
              Save About Section
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AboutSection;
