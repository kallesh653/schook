import React, { useState } from 'react';
import { Box, Grid, TextField, Button, Typography, Paper, IconButton, List, ListItem, ListItemText } from '@mui/material';
import { Save, Add, Delete } from '@mui/icons-material';

const WhyChooseUsSection = ({ data, saveSection, showSnackbar, saving }) => {
  const [formData, setFormData] = useState(data.whyChooseUs || { heading: 'Why Choose Us', description: '', features: [] });

  const handleAddFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, { title: '', description: '', icon: 'star', order: prev.features.length, isActive: true }] }));
  };

  const handleFeatureChange = (index, field, value) => {
    const features = [...formData.features];
    features[index][field] = value;
    setFormData(prev => ({ ...prev, features }));
  };

  const handleDeleteFeature = (index) => {
    setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  };

  const handleSave = async () => {
    await saveSection('/why-choose-us', formData, 'Why Choose Us section saved');
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Why Choose Us Section</Typography>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}><TextField fullWidth label="Heading" value={formData.heading} onChange={(e) => setFormData({ ...formData, heading: e.target.value })} /></Grid>
          <Grid item xs={12}><TextField fullWidth multiline rows={2} label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Features</Typography>
              <Button startIcon={<Add />} onClick={handleAddFeature} size="small">Add Feature</Button>
            </Box>

            {formData.features && formData.features.map((feature, index) => (
              <Paper key={index} sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={5}><TextField fullWidth label="Feature Title" value={feature.title} onChange={(e) => handleFeatureChange(index, 'title', e.target.value)} size="small" /></Grid>
                  <Grid item xs={12} md={6}><TextField fullWidth label="Description" value={feature.description} onChange={(e) => handleFeatureChange(index, 'description', e.target.value)} size="small" /></Grid>
                  <Grid item xs={12} md={1}><IconButton color="error" onClick={() => handleDeleteFeature(index)}><Delete /></IconButton></Grid>
                </Grid>
              </Paper>
            ))}
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" startIcon={<Save />} onClick={handleSave} disabled={saving}>Save</Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default WhyChooseUsSection;
