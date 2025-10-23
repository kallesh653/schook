import React, { useState } from 'react';
import { Box, Grid, TextField, Button, Typography, Paper, IconButton } from '@mui/material';
import { Save, CloudUpload, Delete } from '@mui/icons-material';
import axios from 'axios';
import { baseUrl } from '../../../../environment';

const ExploreCampusSection = ({ data, saveSection, showSnackbar, schoolId, saving }) => {
  const [formData, setFormData] = useState(data.exploreCampus || {});
  const [uploading, setUploading] = useState(false);

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const fd = new FormData();
    files.forEach(file => fd.append('file', file));
    try {
      setUploading(true);
      const response = await axios.post(`${baseUrl.replace('/api', '')}/api/home-page-content/${schoolId}/upload`, fd, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
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

  const handleSave = async () => {
    await saveSection('/explore-campus', formData, 'Explore Campus section saved');
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Explore Our Campus</Typography>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}><TextField fullWidth label="Heading" value={formData.heading || ''} onChange={(e) => handleChange('heading', e.target.value)} /></Grid>
          <Grid item xs={12}><TextField fullWidth multiline rows={3} label="Description" value={formData.description || ''} onChange={(e) => handleChange('description', e.target.value)} /></Grid>
          <Grid item xs={12} md={6}><TextField fullWidth label="Virtual Tour Link" value={formData.virtualTourLink || ''} onChange={(e) => handleChange('virtualTourLink', e.target.value)} /></Grid>
          <Grid item xs={12} md={6}><TextField fullWidth label="Brochure Link" value={formData.brochureLink || ''} onChange={(e) => handleChange('brochureLink', e.target.value)} /></Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>Campus Images</Typography>
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
            <Button variant="contained" startIcon={<Save />} onClick={handleSave} disabled={saving}>Save</Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ExploreCampusSection;
