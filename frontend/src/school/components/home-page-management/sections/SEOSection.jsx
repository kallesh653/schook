import React, { useState } from 'react';
import { Box, Grid, TextField, Button, Typography, Paper, Chip, IconButton } from '@mui/material';
import { Save, Search, Add, Close } from '@mui/icons-material';

const SEOSection = ({ data, saveSection, showSnackbar, saving }) => {
  const [seo, setSeo] = useState(data.seo || {
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [],
    ogImage: ''
  });
  const [keywordInput, setKeywordInput] = useState('');

  const handleChange = (field, value) => {
    setSeo(prev => ({ ...prev, [field]: value }));
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !seo.metaKeywords.includes(keywordInput.trim())) {
      setSeo(prev => ({
        ...prev,
        metaKeywords: [...prev.metaKeywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const handleDeleteKeyword = (keyword) => {
    setSeo(prev => ({
      ...prev,
      metaKeywords: prev.metaKeywords.filter(k => k !== keyword)
    }));
  };

  const handleSave = async () => {
    await saveSection('/seo', seo, 'SEO settings saved successfully');
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <Search sx={{ mr: 1 }} /> SEO Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Optimize your home page for search engines to improve visibility in Google, Bing, and other search results.
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          {/* Meta Title */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Meta Title"
              value={seo.metaTitle}
              onChange={(e) => handleChange('metaTitle', e.target.value)}
              placeholder="Your School Name - Excellence in Education"
              helperText={`${seo.metaTitle?.length || 0}/60 characters. Appears in search results and browser tabs.`}
              inputProps={{ maxLength: 60 }}
            />
          </Grid>

          {/* Meta Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Meta Description"
              value={seo.metaDescription}
              onChange={(e) => handleChange('metaDescription', e.target.value)}
              placeholder="Discover excellence at our school. We provide quality education with modern facilities, experienced teachers, and holistic development programs."
              helperText={`${seo.metaDescription?.length || 0}/160 characters. Appears below the title in search results.`}
              inputProps={{ maxLength: 160 }}
            />
          </Grid>

          {/* Meta Keywords */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Meta Keywords
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                label="Add Keyword"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddKeyword();
                  }
                }}
                placeholder="e.g., best school, education, elementary school"
              />
              <Button
                variant="outlined"
                onClick={handleAddKeyword}
                startIcon={<Add />}
                disabled={!keywordInput.trim()}
              >
                Add
              </Button>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {seo.metaKeywords && seo.metaKeywords.map((keyword, index) => (
                <Chip
                  key={index}
                  label={keyword}
                  onDelete={() => handleDeleteKeyword(keyword)}
                  color="primary"
                  variant="outlined"
                />
              ))}
              {(!seo.metaKeywords || seo.metaKeywords.length === 0) && (
                <Typography variant="caption" color="text.secondary">
                  No keywords added yet. Add relevant keywords to help with SEO.
                </Typography>
              )}
            </Box>
            <Typography variant="caption" color="text.secondary">
              Add 5-10 relevant keywords that describe your school. Press Enter or click Add button.
            </Typography>
          </Grid>

          {/* OG Image */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="OG Image URL (Open Graph)"
              value={seo.ogImage}
              onChange={(e) => handleChange('ogImage', e.target.value)}
              placeholder="https://yourschool.com/images/og-image.jpg"
              helperText="Image shown when sharing on social media (Facebook, Twitter, LinkedIn). Recommended: 1200x630px"
            />
            {seo.ogImage && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img
                  src={seo.ogImage}
                  alt="OG Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: 300,
                    objectFit: 'contain',
                    border: '1px solid #ddd',
                    borderRadius: 8
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </Box>
            )}
          </Grid>

          {/* Save Button */}
          <Grid item xs={12}>
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
              {saving ? 'Saving...' : 'Save SEO Settings'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* SEO Tips */}
      <Paper sx={{ p: 3, bgcolor: '#e3f2fd' }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#1976d2' }}>
          💡 SEO Best Practices
        </Typography>
        <Typography variant="body2" component="div">
          <strong>Meta Title:</strong>
          <ul>
            <li>Keep it under 60 characters</li>
            <li>Include your school name and main keyword</li>
            <li>Make it unique and descriptive</li>
          </ul>

          <strong>Meta Description:</strong>
          <ul>
            <li>Keep it under 160 characters</li>
            <li>Write a compelling summary that encourages clicks</li>
            <li>Include your main keywords naturally</li>
          </ul>

          <strong>Keywords:</strong>
          <ul>
            <li>Use specific, relevant keywords (e.g., "best elementary school in [city]")</li>
            <li>Include location-based keywords</li>
            <li>Focus on 5-10 high-quality keywords</li>
          </ul>

          <strong>OG Image:</strong>
          <ul>
            <li>Use 1200x630px for best results on all social platforms</li>
            <li>Include school logo or campus photo</li>
            <li>Keep text minimal and readable</li>
          </ul>
        </Typography>
      </Paper>
    </Box>
  );
};

export default SEOSection;
