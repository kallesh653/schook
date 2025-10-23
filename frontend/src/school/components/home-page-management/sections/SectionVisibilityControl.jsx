import React, { useState } from 'react';
import { Box, Grid, Paper, Typography, Switch, FormControlLabel, Button, Divider } from '@mui/material';
import { Save, Visibility, VisibilityOff } from '@mui/icons-material';

const SectionVisibilityControl = ({ data, saveSection, showSnackbar, saving }) => {
  const [visibility, setVisibility] = useState(data.sectionVisibility || {
    showSlider: true,
    showStatistics: true,
    showAbout: true,
    showExploreCampus: true,
    showNews: true,
    showVideos: true,
    showGallery: true,
    showPrograms: true,
    showWhyChooseUs: true,
    showTestimonials: true
  });

  const sections = [
    { key: 'showSlider', label: 'Hero Slider', description: 'Main banner carousel at the top' },
    { key: 'showStatistics', label: 'Statistics Section', description: 'Numbers showcase (students, teachers, etc.)' },
    { key: 'showAbout', label: 'About Section', description: 'School description and mission/vision' },
    { key: 'showExploreCampus', label: 'Explore Campus', description: 'Campus tour and facilities' },
    { key: 'showNews', label: 'News & Events', description: 'Latest announcements and events' },
    { key: 'showVideos', label: 'Videos Section', description: 'School videos showcase' },
    { key: 'showGallery', label: 'Photo Gallery', description: 'Image gallery of school life' },
    { key: 'showPrograms', label: 'Programs Section', description: 'Academic programs offered' },
    { key: 'showWhyChooseUs', label: 'Why Choose Us', description: 'Key features and benefits' },
    { key: 'showTestimonials', label: 'Testimonials', description: 'Parent and student reviews' }
  ];

  const handleToggle = (key) => {
    setVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    await saveSection('/section-visibility', visibility, 'Section visibility updated successfully');
  };

  const allVisible = Object.values(visibility).every(v => v);
  const allHidden = Object.values(visibility).every(v => !v);

  const handleShowAll = () => {
    const newVisibility = {};
    Object.keys(visibility).forEach(key => { newVisibility[key] = true; });
    setVisibility(newVisibility);
  };

  const handleHideAll = () => {
    const newVisibility = {};
    Object.keys(visibility).forEach(key => { newVisibility[key] = false; });
    setVisibility(newVisibility);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <Visibility sx={{ mr: 1 }} /> Section Visibility Control
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Control which sections appear on your public home page. Hidden sections won't be visible to visitors.
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<Visibility />}
            onClick={handleShowAll}
            disabled={allVisible}
            size="small"
          >
            Show All
          </Button>
          <Button
            variant="outlined"
            startIcon={<VisibilityOff />}
            onClick={handleHideAll}
            disabled={allHidden}
            size="small"
            color="warning"
          >
            Hide All
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          {sections.map((section) => (
            <Grid item xs={12} md={6} key={section.key}>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  border: visibility[section.key] ? '2px solid #4caf50' : '2px solid #ccc',
                  bgcolor: visibility[section.key] ? 'rgba(76, 175, 80, 0.05)' : 'rgba(0,0,0,0.02)',
                  transition: 'all 0.3s'
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={visibility[section.key]}
                      onChange={() => handleToggle(section.key)}
                      color="success"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {section.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {section.description}
                      </Typography>
                    </Box>
                  }
                  sx={{ width: '100%', m: 0 }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            disabled={saving}
            size="large"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              px: 4,
              py: 1.5
            }}
          >
            {saving ? 'Saving...' : 'Save Visibility Settings'}
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 2, bgcolor: '#fff3e0' }}>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
          📌 Note:
        </Typography>
        <Typography variant="body2">
          • Hidden sections won't appear on the public home page<br />
          • You can still edit hidden sections - they're just not displayed<br />
          • Changes take effect immediately after saving<br />
          • At least one section should be visible for a complete home page
        </Typography>
      </Paper>
    </Box>
  );
};

export default SectionVisibilityControl;
