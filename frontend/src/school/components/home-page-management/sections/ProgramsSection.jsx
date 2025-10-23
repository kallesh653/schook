import React, { useState } from 'react';
import { Box, Grid, TextField, Button, Typography, Card, CardContent, CardActions, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Chip, Switch, FormControlLabel } from '@mui/material';
import { Add, Edit, Delete, Save, Close, School } from '@mui/icons-material';
import axios from 'axios';
import { baseUrl } from '../../../../environment';

const ProgramsSection = ({ data, saveSection, showSnackbar, schoolId }) => {
  const [programs, setPrograms] = useState(data.programs || []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', ageGroup: '', order: 0, isActive: true });

  const handleAdd = () => { setFormData({ title: '', description: '', ageGroup: '', order: programs.length, isActive: true }); setEditing(null); setDialogOpen(true); };
  const handleEdit = (item) => { setFormData(item); setEditing(item); setDialogOpen(true); };
  const handleClose = () => { setDialogOpen(false); setEditing(null); };

  const handleSave = async () => {
    if (!formData.title) { showSnackbar('Please provide title', 'error'); return; }
    const endpoint = editing ? `/programs/${editing._id}` : '/programs';
    const success = await saveSection(endpoint, formData, editing ? 'Program updated' : 'Program added');
    if (success) handleClose();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${baseUrl.replace('/api', '')}/api/home-page-content/${schoolId}/programs/${id}`, { headers: { Authorization: `Bearer ${token}` }});
      showSnackbar('Deleted', 'success');
      setPrograms(programs.filter(p => p._id !== id));
    } catch (error) { showSnackbar('Error', 'error'); }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5"><School sx={{ mr: 1, verticalAlign: 'middle' }} />Programs</Typography>
        <Button startIcon={<Add />} onClick={handleAdd} variant="contained">Add Program</Button>
      </Box>
      <Grid container spacing={3}>
        {programs.map((prog) => (
          <Grid item xs={12} md={6} key={prog._id}>
            <Card><CardContent><Typography variant="h6">{prog.title}</Typography><Typography variant="body2">{prog.description}</Typography></CardContent><CardActions><Button size="small" startIcon={<Edit />} onClick={() => handleEdit(prog)}>Edit</Button><Button size="small" color="error" startIcon={<Delete />} onClick={() => handleDelete(prog._id)}>Delete</Button></CardActions></Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Edit' : 'Add'} Program<IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}><Close /></IconButton></DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}><TextField fullWidth label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={3} label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label="Age Group" value={formData.ageGroup} onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth type="number" label="Order" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} /></Grid>
            <Grid item xs={12}><FormControlLabel control={<Switch checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />} label="Active" /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions><Button onClick={handleClose}>Cancel</Button><Button variant="contained" onClick={handleSave}>Save</Button></DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProgramsSection;
