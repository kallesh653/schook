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
  IconButton,
  Avatar
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as UploadIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const UploadBox = styled(Box)(({ theme }) => ({
  border: '2px dashed #ccc',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: 'rgba(102, 126, 234, 0.1)'
  }
}));

const NewsDialog = ({ open, onClose, onSave, editingNews }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    image: null,
    published: true
  });

  useEffect(() => {
    if (editingNews) {
      setFormData({
        title: editingNews.title || '',
        date: editingNews.date || new Date().toISOString().split('T')[0],
        description: editingNews.description || '',
        image: editingNews.image || null,
        published: editingNews.published !== undefined ? editingNews.published : true
      });
    } else {
      setFormData({
        title: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        image: null,
        published: true
      });
    }
  }, [editingNews, open]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleChange('image', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      return;
    }
    onSave(formData);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      image: null,
      published: true
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {editingNews ? 'Edit News Item' : 'Add New News Item'}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            fullWidth
            label="News Title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
          />

          <TextField
            fullWidth
            type="date"
            label="Date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            required
          />

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              News Image
            </Typography>
            <UploadBox>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                id="news-image-upload"
                onChange={(e) => handleImageUpload(e.target.files[0])}
              />
              <label htmlFor="news-image-upload">
                {formData.image ? (
                  <Box>
                    <Avatar
                      src={formData.image}
                      sx={{ width: 100, height: 100, mx: 'auto', mb: 1 }}
                      variant="rounded"
                    />
                    <Typography variant="body2">Click to change image</Typography>
                  </Box>
                ) : (
                  <Box>
                    <ImageIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                    <Typography>Upload News Image</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Click to browse or drag and drop
                    </Typography>
                  </Box>
                )}
              </label>
            </UploadBox>
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={formData.published}
                onChange={(e) => handleChange('published', e.target.checked)}
              />
            }
            label="Publish immediately"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={!formData.title.trim() || !formData.description.trim()}
        >
          {editingNews ? 'Update' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewsDialog;
