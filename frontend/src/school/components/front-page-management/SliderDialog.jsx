import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Switch,
  FormControlLabel,
  Typography,
  Avatar,
  ToggleButton,
  ToggleButtonGroup,
  Divider
} from '@mui/material';
import { CloudUpload as UploadIcon, VideoLibrary } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const UploadBox = styled(Box)(({ theme }) => ({
  border: '2px dashed #ccc',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: 'rgba(102, 126, 234, 0.1)'
  }
}));

const SliderDialog = ({ open, onClose, onSave, editingSlider }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    type: 'image', // 'image' or 'video'
    active: true
  });

  useEffect(() => {
    if (editingSlider) {
      setFormData({
        title: editingSlider.title || '',
        description: editingSlider.description || '',
        url: editingSlider.url || '',
        type: editingSlider.type || 'image',
        active: editingSlider.active !== undefined ? editingSlider.active : true
      });
    } else {
      setFormData({
        title: '',
        description: '',
        url: '',
        type: 'image',
        active: true
      });
    }
  }, [editingSlider, open]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (file) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData(prev => ({
        ...prev,
        url: e.target.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    // Only URL is required, title and description are optional
    if (!formData.url) {
      alert('Please upload an image/video or provide a URL');
      return;
    }

    const slideData = {
      ...formData,
      title: formData.title.trim() || 'Untitled Slide',
      description: formData.description.trim() || '',
      id: editingSlider?.id || Date.now().toString()
    };

    onSave(slideData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {editingSlider ? 'Edit Slide' : 'Add New Slide'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
          {/* Type Selector */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Slide Type
            </Typography>
            <ToggleButtonGroup
              value={formData.type}
              exclusive
              onChange={(e, newType) => {
                if (newType) handleChange('type', newType);
              }}
              fullWidth
            >
              <ToggleButton value="image">Image</ToggleButton>
              <ToggleButton value="video">Video</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Image/Video Upload */}
          <Box>
            <Typography variant="h6" gutterBottom>
              {formData.type === 'image' ? 'Slide Image' : 'Video URL'}
            </Typography>
            {formData.type === 'image' ? (
              <UploadBox>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="slider-image-upload"
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                />
                <label htmlFor="slider-image-upload">
                  <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                  <Typography>Upload Slide Image</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Recommended size: 1920x1080px
                  </Typography>
                </label>
                {formData.url && (
                  <Avatar
                    src={formData.url}
                    sx={{ width: 120, height: 80, mx: 'auto', mt: 2 }}
                    variant="rounded"
                  />
                )}
              </UploadBox>
            ) : (
              <Box>
                <TextField
                  fullWidth
                  label="Video URL"
                  value={formData.url}
                  onChange={(e) => handleChange('url', e.target.value)}
                  placeholder="Enter YouTube URL or video file URL"
                  helperText="YouTube, Vimeo, or direct video file URL"
                  sx={{ mb: 2 }}
                />
                <Divider sx={{ my: 2 }}>OR</Divider>
                <UploadBox>
                  <input
                    type="file"
                    accept="video/*"
                    style={{ display: 'none' }}
                    id="slider-video-upload"
                    onChange={(e) => handleImageUpload(e.target.files[0])}
                  />
                  <label htmlFor="slider-video-upload">
                    <VideoLibrary sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                    <Typography>Upload Video File</Typography>
                    <Typography variant="body2" color="text.secondary">
                      MP4, WebM, or MOV (Max 50MB)
                    </Typography>
                  </label>
                  {formData.url && formData.url.startsWith('data:video') && (
                    <Typography variant="caption" color="success.main" sx={{ mt: 2, display: 'block' }}>
                      ✓ Video uploaded successfully
                    </Typography>
                  )}
                </UploadBox>
              </Box>
            )}
          </Box>

          {/* Title - Optional */}
          <TextField
            fullWidth
            label="Slide Title (Optional)"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="e.g., Our Beautiful Campus"
            helperText="Optional - Leave blank if not needed"
          />

          {/* Description - Optional */}
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Slide Description (Optional)"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="e.g., State-of-the-art facilities designed for modern learning"
            helperText="Optional - Leave blank if not needed"
          />

          {/* Active Toggle */}
          <FormControlLabel
            control={
              <Switch
                checked={formData.active}
                onChange={(e) => handleChange('active', e.target.checked)}
              />
            }
            label="Show this slide in the slider"
          />

          {/* Preview */}
          {formData.url && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Preview
              </Typography>
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: 2,
                  overflow: 'hidden',
                  height: 200,
                  backgroundColor: '#f5f5f5'
                }}
              >
                {formData.type === 'image' ? (
                  <img
                    src={formData.url}
                    alt="Preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white'
                    }}
                  >
                    <Typography variant="h5">🎥 Video Slide</Typography>
                  </Box>
                )}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                    color: 'white',
                    p: 2
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    {formData.title || 'Slide Title'}
                  </Typography>
                  <Typography variant="body2">
                    {formData.description || 'Slide description'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={!formData.title.trim() || !formData.description.trim() || !formData.url}
        >
          {editingSlider ? 'Update Slide' : 'Add Slide'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SliderDialog;
