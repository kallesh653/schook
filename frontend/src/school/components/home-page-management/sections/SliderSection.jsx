import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  PlayArrow as PlayIcon
} from '@mui/icons-material';
import axios from 'axios';
import { baseUrl } from '../../../../environment';

const SliderSection = ({ data, saveSection, showSnackbar, schoolId, saving }) => {
  const [sliders, setSliders] = useState(data.sliders || []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mediaType: 'image',
    mediaUrl: '',
    buttonText: '',
    buttonLink: '',
    order: 0,
    isActive: true
  });
  const [mediaPreview, setMediaPreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleOpenDialog = (slider = null) => {
    if (slider) {
      setEditingSlider(slider);
      setFormData(slider);
      setMediaPreview(slider.mediaUrl);
    } else {
      setEditingSlider(null);
      setFormData({
        title: '',
        description: '',
        mediaType: 'image',
        mediaUrl: '',
        buttonText: '',
        buttonLink: '',
        order: sliders.length,
        isActive: true
      });
      setMediaPreview('');
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingSlider(null);
    setFormData({
      title: '',
      description: '',
      mediaType: 'image',
      mediaUrl: '',
      buttonText: '',
      buttonLink: '',
      order: 0,
      isActive: true
    });
    setMediaPreview('');
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMediaUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      showSnackbar('Please upload an image or video file', 'error');
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      showSnackbar('File size should be less than 50MB', 'error');
      return;
    }

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      setUploading(true);
      const response = await axios.post(
        `${baseUrl.replace('/api', '')}/api/home-page-content/${schoolId}/upload`,
        formDataUpload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        const mediaUrl = response.data.files[0].url;
        setMediaPreview(mediaUrl);
        setFormData(prev => ({
          ...prev,
          mediaUrl,
          mediaType: isImage ? 'image' : 'video'
        }));
        showSnackbar('Media uploaded successfully', 'success');
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Error uploading media';
      showSnackbar(errorMsg, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveSlider = async () => {
    if (!formData.title || !formData.mediaUrl) {
      showSnackbar('Please provide title and media', 'error');
      return;
    }

    try {
      if (editingSlider) {
        // Update existing slider
        const success = await saveSection(
          `/sliders/${editingSlider._id}`,
          formData,
          'Slider updated successfully'
        );
        if (success) {
          handleCloseDialog();
        }
      } else {
        // Add new slider
        const success = await saveSection('/sliders', formData, 'Slider added successfully');
        if (success) {
          handleCloseDialog();
        }
      }
    } catch (error) {
      showSnackbar('Error saving slider', 'error');
    }
  };

  const handleDeleteSlider = async (sliderId) => {
    if (!window.confirm('Are you sure you want to delete this slider?')) {
      return;
    }

    try {
      const response = await axios.delete(
        `${baseUrl.replace('/api', '')}/api/home-page-content/${schoolId}/sliders/${sliderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        showSnackbar('Slider deleted successfully', 'success');
        setSliders(sliders.filter(s => s._id !== sliderId));
      }
    } catch (error) {
      showSnackbar('Error deleting slider', 'error');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Hero Slider Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        >
          Add New Slide
        </Button>
      </Box>

      <Grid container spacing={3}>
        {sliders.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="textSecondary">
                No slides added yet
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Click "Add New Slide" to create your first slider
              </Typography>
            </Paper>
          </Grid>
        ) : (
          sliders.map((slider, index) => (
            <Grid item xs={12} md={6} lg={4} key={slider._id || index}>
              <Card elevation={3}>
                {slider.mediaType === 'image' ? (
                  <CardMedia
                    component="img"
                    height="200"
                    image={slider.mediaUrl}
                    alt={slider.title}
                    sx={{ objectFit: 'cover' }}
                  />
                ) : (
                  <Box
                    sx={{
                      position: 'relative',
                      height: 200,
                      backgroundColor: '#000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <video
                      src={slider.mediaUrl}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <PlayIcon
                      sx={{
                        position: 'absolute',
                        fontSize: 60,
                        color: 'white',
                        opacity: 0.8
                      }}
                    />
                  </Box>
                )}
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="div">
                      {slider.title}
                    </Typography>
                    <Chip
                      label={slider.isActive ? 'Active' : 'Inactive'}
                      color={slider.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {slider.description?.substring(0, 100)}
                    {slider.description?.length > 100 && '...'}
                  </Typography>
                  <Chip
                    label={slider.mediaType.toUpperCase()}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={`Order: ${slider.order}`}
                    size="small"
                    variant="outlined"
                  />
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenDialog(slider)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteSlider(slider._id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingSlider ? 'Edit Slide' : 'Add New Slide'}
          <IconButton
            onClick={handleCloseDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Media Upload */}
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadIcon />}
                  disabled={uploading}
                  fullWidth
                >
                  {uploading ? 'Uploading...' : 'Upload Image or Video'}
                  <input
                    type="file"
                    hidden
                    accept="image/*,video/*"
                    onChange={handleMediaUpload}
                  />
                </Button>
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                  Recommended: Images (1920x1080px), Videos (Max 50MB)
                </Typography>
              </Box>

              {/* Media Preview */}
              {mediaPreview && (
                <Box sx={{ mt: 2 }}>
                  {formData.mediaType === 'image' ? (
                    <img
                      src={mediaPreview}
                      alt="Preview"
                      style={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 8 }}
                    />
                  ) : (
                    <video
                      src={mediaPreview}
                      controls
                      style={{ width: '100%', maxHeight: 300, borderRadius: 8 }}
                    />
                  )}
                </Box>
              )}
            </Grid>

            {/* Title */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                multiline
                rows={3}
              />
            </Grid>

            {/* Button Text */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Button Text (Optional)"
                value={formData.buttonText}
                onChange={(e) => handleChange('buttonText', e.target.value)}
                placeholder="Learn More"
              />
            </Grid>

            {/* Button Link */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Button Link (Optional)"
                value={formData.buttonLink}
                onChange={(e) => handleChange('buttonLink', e.target.value)}
                placeholder="/about"
              />
            </Grid>

            {/* Order */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Display Order"
                type="number"
                value={formData.order}
                onChange={(e) => handleChange('order', parseInt(e.target.value))}
              />
            </Grid>

            {/* Active Status */}
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => handleChange('isActive', e.target.checked)}
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveSlider}
            disabled={uploading || !formData.title || !formData.mediaUrl}
          >
            {editingSlider ? 'Update' : 'Add'} Slide
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SliderSection;
