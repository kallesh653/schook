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
  Divider,
  CircularProgress
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
  const [uploading, setUploading] = useState(false);

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

  // Compress image before upload
  const compressImage = (file, maxWidth = 1920, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Scale down if image is too large
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with compression
          canvas.toBlob(
            (blob) => {
              const compressedReader = new FileReader();
              compressedReader.onload = (event) => {
                resolve(event.target.result);
              };
              compressedReader.onerror = reject;
              compressedReader.readAsDataURL(blob);
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    setUploading(true);

    try {
      console.log(`📁 Original file size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);

      let fileData;

      // For images, compress them
      if (file.type.startsWith('image/')) {
        // Check if image is too large before compression
        const maxImageSize = 10 * 1024 * 1024; // 10MB before compression
        if (file.size > maxImageSize) {
          alert(`Image is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Please use an image smaller than 10MB.`);
          setUploading(false);
          return;
        }

        console.log('🔄 Compressing image...');
        try {
          fileData = await compressImage(file);
          console.log(`✅ Compressed image successfully`);

          // Check compressed size
          const compressedSizeMB = (fileData.length * 0.75) / (1024 * 1024); // Approximate size in MB
          if (compressedSizeMB > 5) {
            console.warn('⚠️ Compressed image is still large, applying additional compression...');
            fileData = await compressImage(file, 1920, 0.6); // More aggressive compression
          }
        } catch (compressionError) {
          console.error('❌ Compression failed:', compressionError);
          alert('Failed to compress image. Please try a different image or reduce its size before uploading.');
          setUploading(false);
          return;
        }
      }
      // For videos, check size and convert directly
      else if (file.type.startsWith('video/')) {
        const maxSize = 50 * 1024 * 1024; // Reduced to 50MB
        if (file.size > maxSize) {
          alert(`Video is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum size is 50MB.\n\nTips:\n• Compress the video using online tools\n• Use YouTube/Vimeo and enter the URL instead\n• Reduce video resolution or duration`);
          setUploading(false);
          return;
        }

        console.log('🔄 Converting video to base64...');
        fileData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        console.log(`✅ Video converted successfully`);
      }
      else {
        alert('Unsupported file type. Please upload an image (JPG, PNG) or video (MP4, WebM, MOV).');
        setUploading(false);
        return;
      }

      setFormData(prev => ({
        ...prev,
        url: fileData
      }));

      // Show success message
      console.log('✅ File uploaded successfully!');
    } catch (error) {
      console.error('❌ Error processing file:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      alert(`Error uploading media: ${errorMessage}\n\nPlease try:\n• Using a smaller file\n• A different file format\n• Compressing the file before upload`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    // Only URL is required, title and description are optional
    if (!formData.url || formData.url.trim() === '') {
      alert('Please upload an image/video or provide a URL');
      return;
    }

    const slideData = {
      id: editingSlider?.id || Date.now().toString(),
      type: formData.type || 'image',
      url: formData.url,
      title: (formData.title || '').trim() || '',
      description: (formData.description || '').trim() || '',
      active: formData.active !== undefined ? formData.active : true
    };

    console.log('SliderDialog - Submitting slide data:', slideData);
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
                  {uploading ? (
                    <>
                      <CircularProgress size={48} sx={{ mb: 1 }} />
                      <Typography>Processing image...</Typography>
                    </>
                  ) : (
                    <>
                      <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                      <Typography variant="h6" fontWeight="600" gutterBottom>
                        Upload Slide Image
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Recommended: 1920x1080px
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                        JPG or PNG • Max 10MB • Auto-compressed
                      </Typography>
                    </>
                  )}
                </label>
                {formData.url && !uploading && (
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
                    {uploading ? (
                      <>
                        <CircularProgress size={48} sx={{ mb: 1 }} />
                        <Typography>Processing video...</Typography>
                        <Typography variant="body2" color="text.secondary">
                          This may take a moment for large files
                        </Typography>
                      </>
                    ) : (
                      <>
                        <VideoLibrary sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                          Upload Video File
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          MP4, WebM, or MOV
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                          Max 50MB • For larger videos, use YouTube/Vimeo
                        </Typography>
                      </>
                    )}
                  </label>
                  {formData.url && formData.url.startsWith('data:video') && !uploading && (
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
        <Button onClick={onClose} disabled={uploading}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.url || uploading}
          startIcon={uploading ? <CircularProgress size={20} /> : null}
        >
          {uploading ? 'Processing...' : (editingSlider ? 'Update Slide' : 'Add Slide')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SliderDialog;
