import React, { useState } from 'react';
import { Box, Grid, TextField, Button, Typography, Card, CardContent, CardActions, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Rating, Switch, FormControlLabel } from '@mui/material';
import { Add, Edit, Delete, Save, Close, RateReview } from '@mui/icons-material';
import axios from 'axios';
import { baseUrl } from '../../../../environment';

const TestimonialsSection = ({ data, saveSection, showSnackbar, schoolId }) => {
  const [testimonials, setTestimonials] = useState(data.testimonials?.items || []);
  const [heading, setHeading] = useState(data.testimonials?.heading || 'What Parents Say');
  const [description, setDescription] = useState(data.testimonials?.description || '');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ parentName: '', studentName: '', testimonial: '', rating: 5, image: '', designation: '', order: 0, isActive: true });

  const handleAdd = () => { setFormData({ parentName: '', studentName: '', testimonial: '', rating: 5, image: '', designation: '', order: testimonials.length, isActive: true }); setEditing(null); setDialogOpen(true); };
  const handleEdit = (item) => { setFormData(item); setEditing(item); setDialogOpen(true); };
  const handleClose = () => { setDialogOpen(false); setEditing(null); };

  const handleSave = async () => {
    if (!formData.parentName || !formData.testimonial) { showSnackbar('Please provide parent name and testimonial', 'error'); return; }
    const endpoint = editing ? `/testimonials/${editing._id}` : '/testimonials';
    const success = await saveSection(endpoint, formData, editing ? 'Testimonial updated' : 'Testimonial added');
    if (success) handleClose();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${baseUrl.replace('/api', '')}/api/home-page-content/${schoolId}/testimonials/${id}`, { headers: { Authorization: `Bearer ${token}` }});
      showSnackbar('Deleted', 'success');
      setTestimonials(testimonials.filter(t => t._id !== id));
    } catch (error) { showSnackbar('Error', 'error'); }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom><RateReview sx={{ mr: 1, verticalAlign: 'middle' }} />Testimonials</Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}><TextField fullWidth label="Section Heading" value={heading} onChange={(e) => setHeading(e.target.value)} /></Grid>
        <Grid item xs={12} md={6}><TextField fullWidth label="Section Description" value={description} onChange={(e) => setDescription(e.target.value)} /></Grid>
      </Grid>

      <Box sx={{ mb: 2 }}>
        <Button startIcon={<Add />} onClick={handleAdd} variant="contained">Add Testimonial</Button>
      </Box>

      <Grid container spacing={3}>
        {testimonials.map((test) => (
          <Grid item xs={12} md={6} key={test._id}>
            <Card>
              <CardContent>
                <Rating value={test.rating} readOnly size="small" sx={{ mb: 1 }} />
                <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>"{test.testimonial}"</Typography>
                <Typography variant="subtitle2">{test.parentName}</Typography>
                {test.studentName && <Typography variant="caption">Parent of {test.studentName}</Typography>}
              </CardContent>
              <CardActions>
                <Button size="small" startIcon={<Edit />} onClick={() => handleEdit(test)}>Edit</Button>
                <Button size="small" color="error" startIcon={<Delete />} onClick={() => handleDelete(test._id)}>Delete</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Edit' : 'Add'} Testimonial<IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}><Close /></IconButton></DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}><TextField fullWidth label="Parent Name" value={formData.parentName} onChange={(e) => setFormData({ ...formData, parentName: e.target.value })} required /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label="Student Name (Optional)" value={formData.studentName} onChange={(e) => setFormData({ ...formData, studentName: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={4} label="Testimonial" value={formData.testimonial} onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })} required /></Grid>
            <Grid item xs={12} md={4}><Typography>Rating:</Typography><Rating value={formData.rating} onChange={(e, val) => setFormData({ ...formData, rating: val })} /></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth type="number" label="Order" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} /></Grid>
            <Grid item xs={12} md={4}><FormControlLabel control={<Switch checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />} label="Active" /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions><Button onClick={handleClose}>Cancel</Button><Button variant="contained" onClick={handleSave}>Save</Button></DialogActions>
      </Dialog>
    </Box>
  );
};

export default TestimonialsSection;
