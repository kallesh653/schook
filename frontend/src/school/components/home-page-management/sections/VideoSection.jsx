import React, { useState } from 'react';
import {
  Box, Grid, TextField, Button, Typography, Card, CardContent, CardActions,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Chip, FormControl,
  InputLabel, Select, MenuItem, Switch, FormControlLabel
} from '@mui/material';
import { Add, Edit, Delete, Save, Close, VideoLibrary, PlayCircle } from '@mui/icons-material';
import axios from 'axios';
import { Environment } from '../../../../environment';

const VideoSection = ({ data, saveSection, showSnackbar, schoolId }) => {
  const [videos, setVideos] = useState(data.videos || []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoType: 'hero',
    videoUrl: '',
    thumbnail: '',
    order: 0,
    isActive: true
  });

  const videoTypes = [
    { value: 'hero', label: 'Hero Video' },
    { value: 'promotional', label: 'Promotional' },
    { value: 'campus', label: 'Campus Tour' },
    { value: 'virtual', label: 'Virtual Tour' }
  ];

  const handleAdd = () => {
    setFormData({
      title: '',
      description: '',
      videoType: 'hero',
      videoUrl: '',
      thumbnail: '',
      order: videos.length,
      isActive: true
    });
    setEditing(null);
    setDialogOpen(true);
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditing(item);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditing(null);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.videoUrl) {
      showSnackbar('Please provide title and video URL', 'error');
      return;
    }

    const endpoint = editing ? `/videos/${editing._id}` : '/videos';
    const success = await saveSection(endpoint, formData, editing ? 'Video updated' : 'Video added');
    if (success) {
      handleClose();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this video?')) return;

    try {
      await axios.delete(`${Environment.BaseURL}/api/home-page-content/${schoolId}/videos/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      showSnackbar('Video deleted', 'success');
      setVideos(videos.filter(v => v._id !== id));
    } catch (error) {
      showSnackbar('Error deleting video', 'error');
    }
  };

  const getYouTubeId = (url) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
          <VideoLibrary sx={{ mr: 1 }} /> Videos Management
        </Typography>
        <Button startIcon={<Add />} onClick={handleAdd} variant="contained" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          Add Video
        </Button>
      </Box>

      {videos.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, bgcolor: '#f5f5f5', borderRadius: 2 }}>
          <VideoLibrary sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" color="textSecondary">No videos added yet</Typography>
          <Typography variant="body2" color="textSecondary">Click "Add Video" to start adding videos</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {videos.map((video) => (
            <Grid item xs={12} md={6} lg={4} key={video._id}>
              <Card elevation={3}>
                <Box sx={{ position: 'relative', paddingTop: '56.25%', bgcolor: '#000' }}>
                  {getYouTubeId(video.videoUrl) ? (
                    <iframe
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                      src={`https://www.youtube.com/embed/${getYouTubeId(video.videoUrl)}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <PlayCircle sx={{ fontSize: 80, color: 'white', opacity: 0.5 }} />
                    </Box>
                  )}
                </Box>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6">{video.title}</Typography>
                    <Chip label={video.isActive ? 'Active' : 'Inactive'} color={video.isActive ? 'success' : 'default'} size="small" />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {video.description?.substring(0, 100)}{video.description?.length > 100 && '...'}
                  </Typography>
                  <Chip label={video.videoType} size="small" color="primary" variant="outlined" />
                </CardContent>
                <CardActions>
                  <Button size="small" startIcon={<Edit />} onClick={() => handleEdit(video)}>Edit</Button>
                  <Button size="small" color="error" startIcon={<Delete />} onClick={() => handleDelete(video._id)}>Delete</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editing ? 'Edit Video' : 'Add Video'}
          <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Video Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="e.g., Welcome to Our School"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the video"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Video Type</InputLabel>
                <Select
                  value={formData.videoType}
                  onChange={(e) => setFormData({ ...formData, videoType: e.target.value })}
                  label="Video Type"
                >
                  {videoTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
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

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Video URL"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                required
                placeholder="YouTube URL or direct video URL"
                helperText="Paste YouTube link (e.g., https://www.youtube.com/watch?v=...) or direct video URL"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Thumbnail URL (Optional)"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                placeholder="Image URL for video thumbnail"
                helperText="Only needed for non-YouTube videos"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                }
                label="Active (Show on homepage)"
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
            disabled={!formData.title || !formData.videoUrl}
          >
            {editing ? 'Update' : 'Add'} Video
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VideoSection;
