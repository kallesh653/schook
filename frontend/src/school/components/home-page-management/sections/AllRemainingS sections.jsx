// NewsSection.jsx
import React, { useState } from 'react';
import { Box, Grid, TextField, Button, Typography, Paper, Card, CardContent, CardActions, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { Add, Edit, Delete, Save, CloudUpload, Close } from '@mui/icons-material';
import axios from 'axios';
import { Environment } from '../../../../environment';

export const NewsSection = ({ data, saveSection, showSnackbar, schoolId, saving }) => {
  const [news, setNews] = useState(data.news || []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', image: '', date: new Date().toISOString().split('T')[0], link: '', order: 0, isActive: true });

  const handleAdd = () => { setFormData({ title: '', description: '', image: '', date: new Date().toISOString().split('T')[0], link: '', order: news.length, isActive: true }); setEditing(null); setDialogOpen(true); };
  const handleEdit = (item) => { setFormData(item); setEditing(item); setDialogOpen(true); };
  const handleClose = () => { setDialogOpen(false); setEditing(null); };

  const handleSave = async () => {
    const endpoint = editing ? `/news/${editing._id}` : '/news';
    await saveSection(endpoint, formData, editing ? 'News updated' : 'News added');
    handleClose();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this news?')) {
      try {
        await axios.delete(`${Environment.BaseURL}/api/home-page-content/${schoolId}/news/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        showSnackbar('Deleted', 'success');
        setNews(news.filter(n => n._id !== id));
      } catch (error) {
        showSnackbar('Error', 'error');
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">News & Events</Typography>
        <Button startIcon={<Add />} onClick={handleAdd} variant="contained">Add News</Button>
      </Box>
      <Grid container spacing={2}>
        {news.map((item, index) => (
          <Grid item xs={12} md={6} key={item._id || index}>
            <Card>
              <CardContent>
                <Typography variant="h6">{item.title}</Typography>
                <Typography variant="body2" color="text.secondary">{item.description?.substring(0, 100)}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" startIcon={<Edit />} onClick={() => handleEdit(item)}>Edit</Button>
                <Button size="small" color="error" startIcon={<Delete />} onClick={() => handleDelete(item._id)}>Delete</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit' : 'Add'} News <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}><Close /></IconButton></DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}><TextField fullWidth label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={3} label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Image URL" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth type="date" label="Date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label="Link" value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// VideoSection.jsx
export const VideoSection = ({ data, saveSection, showSnackbar, schoolId }) => {
  const [videos, setVideos] = useState(data.videos || []);
  // Similar structure to NewsSection but for videos
  return <Box><Typography variant="h5">Videos Section</Typography><Typography color="textSecondary">Video management component (similar to News)</Typography></Box>;
};

// GallerySection.jsx
export const GallerySection = ({ data, saveSection, showSnackbar, schoolId }) => {
  const [gallery, setGallery] = useState(data.gallery || []);
  return <Box><Typography variant="h5">Gallery Section</Typography><Typography color="textSecondary">Gallery management component</Typography></Box>;
};

// ProgramsSection.jsx
export const ProgramsSection = ({ data, saveSection, showSnackbar, schoolId }) => {
  const [programs, setPrograms] = useState(data.programs || []);
  return <Box><Typography variant="h5">Programs Section</Typography><Typography color="textSecondary">Programs management component</Typography></Box>;
};

// WhyChooseUsSection.jsx
export const WhyChooseUsSection = ({ data, saveSection, showSnackbar, schoolId }) => {
  const [whyChooseUs, setWhyChooseUs] = useState(data.whyChooseUs || {});
  return <Box><Typography variant="h5">Why Choose Us</Typography><Typography color="textSecondary">Why Choose Us management component</Typography></Box>;
};

// TestimonialsSection.jsx
export const TestimonialsSection = ({ data, saveSection, showSnackbar, schoolId }) => {
  const [testimonials, setTestimonials] = useState(data.testimonials || {});
  return <Box><Typography variant="h5">Testimonials</Typography><Typography color="textSecondary">Testimonials management component</Typography></Box>;
};

// SectionVisibilityControl.jsx
export const SectionVisibilityControl = ({ data, saveSection, showSnackbar }) => {
  const [visibility, setVisibility] = useState(data.sectionVisibility || {});
  return <Box><Typography variant="h5">Section Visibility</Typography><Typography color="textSecondary">Toggle section visibility</Typography></Box>;
};

// SEOSection.jsx
export const SEOSection = ({ data, saveSection, showSnackbar }) => {
  const [seo, setSeo] = useState(data.seo || {});
  return <Box><Typography variant="h5">SEO Settings</Typography><Typography color="textSecondary">SEO configuration</Typography></Box>;
};
