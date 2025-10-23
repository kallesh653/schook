import React, { useState } from 'react';
import { Box, Grid, TextField, Button, Typography, Paper, IconButton } from '@mui/material';
import { Save as SaveIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

const StatisticsSection = ({ data, saveSection, showSnackbar, saving }) => {
  const [statistics, setStatistics] = useState(data.statistics || []);

  const handleAdd = () => {
    setStatistics([...statistics, { icon: 'trending_up', value: 0, label: 'New Stat', suffix: '', order: statistics.length }]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...statistics];
    updated[index][field] = field === 'value' || field === 'order' ? parseInt(value) || 0 : value;
    setStatistics(updated);
  };

  const handleDelete = (index) => {
    setStatistics(statistics.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    await saveSection('/statistics', { statistics }, 'Statistics saved successfully');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Statistics Section</Typography>
        <Button startIcon={<AddIcon />} onClick={handleAdd} variant="outlined">
          Add Statistic
        </Button>
      </Box>

      <Grid container spacing={3}>
        {statistics.map((stat, index) => (
          <Grid item xs={12} key={index}>
            <Paper sx={{ p: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={2}>
                  <TextField fullWidth label="Icon" value={stat.icon} onChange={(e) => handleChange(index, 'icon', e.target.value)} size="small" />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField fullWidth label="Value" type="number" value={stat.value} onChange={(e) => handleChange(index, 'value', e.target.value)} size="small" />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField fullWidth label="Label" value={stat.label} onChange={(e) => handleChange(index, 'label', e.target.value)} size="small" />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <TextField fullWidth label="Suffix" value={stat.suffix} onChange={(e) => handleChange(index, 'suffix', e.target.value)} size="small" />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField fullWidth label="Order" type="number" value={stat.order} onChange={(e) => handleChange(index, 'order', e.target.value)} size="small" />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <IconButton color="error" onClick={() => handleDelete(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disabled={saving}>
          Save Statistics
        </Button>
      </Box>
    </Box>
  );
};

export default StatisticsSection;
