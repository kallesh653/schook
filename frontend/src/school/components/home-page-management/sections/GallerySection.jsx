import React, { useState } from 'react';
import {
  Box, Grid, TextField, Button, Typography, Card, CardMedia, CardContent, CardActions,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Chip, FormControl,
  InputLabel, Select, MenuItem, Switch, FormControlLabel, ImageList, ImageListItem,
  ImageListItemBar
} from '@mui/material';
import { Add, Edit, Delete, Save, CloudUpload, Close, Collections } from '@mui/icons-material';
import axios from 'axios';
import { baseUrl } from '../../../../environment';

const GallerySection = ({ data, saveSection, showSnackbar, schoolId, saving }) => {
  const [gallery, setGallery] = useState(data.gallery || []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: 'general',
    order: 0,
    isActive: true
  });
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const categories = ['general', 'sports', 'events', 'infrastructure', 'academic', 'cultural', 'laboratory', 'campus'];

  const handleAdd = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      category: 'general',
      order: gallery.length,
      isActive: true
    });
    setEditing(null);
    setImagePreview('');
    setDialogOpen(true);
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditing(item);
    setImagePreview(item.imageUrl);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditing(null);
    setImagePreview('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showSnackbar('Please upload an image file', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showSnackbar('Image size should be less than 10MB', 'error');
      return;
    }

    const fd = new FormData();
    fd.append('file', file);

    try {
      setUploading(true);
      const response = await axios.post(
        `${baseUrl.replace('/api', '')}/api/home-page-content/${schoolId}/upload`,
        fd,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        const imageUrl = response.data.files[0].url;
        setImagePreview(imageUrl);
        setFormData(prev => ({ ...prev, imageUrl }));
        showSnackbar('Image uploaded successfully', 'success');
      }
    } catch (error) {
      showSnackbar('Error uploading image', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.imageUrl) {
      showSnackbar('Please provide title and image', 'error');
      return;
    }

    const endpoint = editing ? `/gallery/${editing._id}` : '/gallery';
    const success = await saveSection(endpoint, formData, editing ? 'Gallery image updated' : 'Gallery image added');
    if (success) {
      handleClose();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image from gallery?')) return;

    try {
      await axios.delete(`${baseUrl.replace('/api', '')}/api/home-page-content/${schoolId}/gallery/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      showSnackbar('Gallery image deleted', 'success');
      setGallery(gallery.filter(g => g._id !== id));
    } catch (error) {
      showSnackbar('Error deleting image', 'error');
    }
  };

  const getImagesByCategory = (category) => {
    return gallery.filter(img => img.category === category && img.isActive);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
          <Collections sx={{ mr: 1 }} /> Photo Gallery Management
        </Typography>
        <Button startIcon={<Add />} onClick={handleAdd} variant="contained" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          Add Image
        </Button>
      </Box>

      {/* Category Filter Chips */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>Filter by Category:</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label={`All (${gallery.length})`} color="primary" variant="outlined" />
          {categories.map(cat => (
            <Chip
              key={cat}
              label={`${cat.charAt(0).toUpperCase() + cat.slice(1)} (${getImagesByCategory(cat).length})`}
              variant="outlined"
            />
          ))}
        </Box>
      </Box>

      {/* Gallery Grid */}
      {gallery.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, bgcolor: '#f5f5f5', borderRadius: 2 }}>
          <Collections sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" color="textSecondary">No images in gallery yet</Typography>
          <Typography variant="body2" color="textSecondary">Click "Add Image" to start building your gallery</Typography>
        </Box>
      ) : (
        <ImageList cols={4} gap={16} sx={{ maxHeight: 600 }}>
          {gallery.map((item) => (
            <ImageListItem key={item._id}>
              <img
                src={item.imageUrl}
                alt={item.title}
                loading="lazy"
                style={{ height: 250, objectFit: 'cover', borderRadius: 8 }}
              />
              <ImageListItemBar
                title={item.title}
                subtitle={item.category}
                actionIcon={
                  <Box>
                    <IconButton sx={{ color: 'white' }} onClick={() => handleEdit(item)}>
                      <Edit />
                    </IconButton>
                    <IconButton sx={{ color: 'white' }} onClick={() => handleDelete(item._id)}>
                      <Delete />
                    </IconButton>
                  </Box>
                }
                sx={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8
                }}
              />
              {!item.isActive && (
                <Chip
                  label="Inactive"
                  size="small"
                  sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.6)', color: 'white' }}
                />
              )}
            </ImageListItem>
          ))}
        </ImageList>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editing ? 'Edit Gallery Image' : 'Add Gallery Image'}
          <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Image Upload */}
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
                disabled={uploading}
                fullWidth
                sx={{ mb: 2 }}
              >
                {uploading ? 'Uploading...' : 'Upload Image'}
                <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
              </Button>
              <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 2 }}>
                Recommended: High-resolution images (1200x800px or larger), Max 10MB
              </Typography>
              {imagePreview && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: '100%', maxHeight: 400, objectFit: 'contain', borderRadius: 8, border: '1px solid #ddd' }}
                  />
                </Box>
              )}
            </Grid>

            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Image Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="e.g., Science Laboratory, Annual Sports Day"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  label="Category"
                >
                  {categories.map(cat => (
                    <MenuItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Description (Optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the image"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Display Order"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                }
                label="Active (Show in gallery)"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            disabled={uploading || !formData.title || !formData.imageUrl}
          >
            {editing ? 'Update' : 'Add'} Image
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GallerySection;
