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
  Avatar
} from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
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
    active: true
  });

  useEffect(() => {
    if (editingSlider) {
      setFormData({
        title: editingSlider.title || '',
        description: editingSlider.description || '',
        url: editingSlider.url || '',
        active: editingSlider.active !== undefined ? editingSlider.active : true
      });
    } else {
      setFormData({
        title: '',
        description: '',
        url: '',
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
    if (!formData.title.trim() || !formData.description.trim() || !formData.url) {
      return;
    }

    const slideData = {
      ...formData,
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
          {/* Image Upload */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Slide Image
            </Typography>
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
                  Recommended size: 800x500px
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
          </Box>

          {/* Title */}
          <TextField
            fullWidth
            label="Slide Title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="e.g., Our Beautiful Campus"
          />

          {/* Description */}
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Slide Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="e.g., State-of-the-art facilities designed for modern learning"
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
                <img
                  src={formData.url}
                  alt="Preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
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
