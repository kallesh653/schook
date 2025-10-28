import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Tab,
  Tabs,
  Switch,
  FormControlLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  CircularProgress,
  Avatar,
  Chip,
  Paper,
  Divider
} from '@mui/material';
import {
  CloudUpload,
  Save,
  Preview,
  Add,
  Edit,
  Delete,
  Slideshow,
  Info,
  Star,
  EmojiEvents,
  Image as ImageIcon,
  VideoLibrary,
  FormatQuote
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { baseUrl } from '../environment';
import SliderDialog from '../school/components/front-page-management/SliderDialog';

const PageContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '40px 20px'
});

const BuilderCard = styled(Card)({
  borderRadius: '20px',
  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  overflow: 'hidden'
});

const Header = styled(Box)({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: '40px',
  textAlign: 'center'
});

const StyledTabs = styled(Tabs)({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  '& .MuiTab-root': {
    color: 'rgba(255,255,255,0.7)',
    fontWeight: 600,
    fontSize: '1rem',
    minHeight: '70px',
    '&.Mui-selected': {
      color: 'white',
      background: 'rgba(255,255,255,0.15)'
    }
  },
  '& .MuiTabs-indicator': {
    backgroundColor: 'white',
    height: 4
  }
});

const UploadBox = styled(Box)({
  border: '3px dashed #ccc',
  borderRadius: '15px',
  padding: '40px',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: '#667eea',
    background: 'rgba(102, 126, 234, 0.05)',
    transform: 'scale(1.02)'
  }
});

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 4 }}>{children}</Box>}
    </div>
  );
}

const WebsiteBuilder = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // All website data
  const [logo, setLogo] = useState(null);
  const [siteName, setSiteName] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroDescription, setHeroDescription] = useState('');
  const [slides, setSlides] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [features, setFeatures] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  // Dialogs
  const [openSliderDialog, setOpenSliderDialog] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [openStatDialog, setOpenStatDialog] = useState(false);
  const [openFeatureDialog, setOpenFeatureDialog] = useState(false);
  const [openTestimonialDialog, setOpenTestimonialDialog] = useState(false);

  useEffect(() => {
    fetchWebsiteData();
  }, []);

  const fetchWebsiteData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/public-home/data`);
      if (response.data.success) {
        const data = response.data.data;
        setLogo(data.header?.logo || null);
        setSiteName(data.header?.siteName || '');
        setHeroTitle(data.heroSection?.title || '');
        setHeroSubtitle(data.heroSection?.subtitle || '');
        setHeroDescription(data.heroSection?.description || '');
        setSlides(data.slider?.slides || []);
        setStatistics(data.statistics?.stats || []);
        setFeatures(data.features?.items || []);
        setTestimonials(data.testimonials?.items || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setSnackbar({ open: true, message: 'Error loading website data', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (file) => {
    if (!file) return;
    setSaving(true);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Logo = e.target.result;
        setLogo(base64Logo);

        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        await axios.patch(`${baseUrl}/public-home/header`, {
          logo: base64Logo,
          siteName: siteName
        }, { headers: token ? { Authorization: `Bearer ${token}` } : {} });

        setSnackbar({ open: true, message: 'Logo uploaded successfully!', severity: 'success' });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setSnackbar({ open: true, message: 'Error uploading logo', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveHeroSection = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.patch(`${baseUrl}/public-home/hero-section`, {
        title: heroTitle,
        subtitle: heroSubtitle,
        description: heroDescription
      }, { headers: token ? { Authorization: `Bearer ${token}` } : {} });

      await axios.patch(`${baseUrl}/public-home/header`, {
        logo: logo,
        siteName: siteName
      }, { headers: token ? { Authorization: `Bearer ${token}` } : {} });

      setSnackbar({ open: true, message: 'Hero section saved!', severity: 'success' });
      fetchWebsiteData();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error saving hero section', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSlide = async (slideData) => {
    try {
      const updatedSlides = editingSlide
        ? slides.map(s => s.id === editingSlide.id ? slideData : s)
        : [...slides, slideData];

      setSlides(updatedSlides);

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.patch(`${baseUrl}/public-home/slider`, {
        showSlider: true,
        slides: updatedSlides
      }, { headers: token ? { Authorization: `Bearer ${token}` } : {} });

      setSnackbar({ open: true, message: 'Slide saved!', severity: 'success' });
      setOpenSliderDialog(false);
      setEditingSlide(null);
      fetchWebsiteData();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error saving slide', severity: 'error' });
    }
  };

  const handleDeleteSlide = async (slideId) => {
    try {
      const updatedSlides = slides.filter(s => s.id !== slideId);
      setSlides(updatedSlides);

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.patch(`${baseUrl}/public-home/slider`, {
        showSlider: true,
        slides: updatedSlides
      }, { headers: token ? { Authorization: `Bearer ${token}` } : {} });

      setSnackbar({ open: true, message: 'Slide deleted!', severity: 'success' });
      fetchWebsiteData();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error deleting slide', severity: 'error' });
    }
  };

  const handleSaveStatistics = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.patch(`${baseUrl}/public-home/statistics`, {
        showSection: true,
        stats: statistics
      }, { headers: token ? { Authorization: `Bearer ${token}` } : {} });

      setSnackbar({ open: true, message: 'Statistics saved!', severity: 'success' });
      fetchWebsiteData();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error saving statistics', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <PageContainer>
      <Container maxWidth="xl">
        <BuilderCard>
          <Header>
            <Typography variant="h2" gutterBottom sx={{ fontWeight: 900, fontSize: { xs: '2.5rem', md: '4rem' } }}>
              🎨 Website Builder
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9 }}>
              Complete control over your website - Build, customize, and publish
            </Typography>
          </Header>

          <StyledTabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<Info />} label="Site Identity" />
            <Tab icon={<Slideshow />} label="Hero Slider" />
            <Tab icon={<Star />} label="Statistics" />
            <Tab icon={<EmojiEvents />} label="Features" />
            <Tab icon={<FormatQuote />} label="Testimonials" />
            <Tab icon={<Preview />} label="Preview" />
          </StyledTabs>

          {/* Site Identity Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Site Identity Settings
                  </Typography>
                  <Typography variant="body2">
                    Your logo and site name appear in the header navigation and throughout your website.
                    Make sure your logo is clear and your site name is memorable!
                  </Typography>
                </Alert>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    Upload Logo
                  </Typography>
                  <UploadBox>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="logo-upload-builder"
                      onChange={(e) => handleLogoUpload(e.target.files[0])}
                      disabled={saving}
                    />
                    <label htmlFor="logo-upload-builder">
                      {saving ? (
                        <CircularProgress />
                      ) : (
                        <>
                          <CloudUpload sx={{ fontSize: 60, color: '#667eea', mb: 2 }} />
                          <Typography variant="h6">Click to Upload Logo</Typography>
                          <Typography variant="body2" color="text.secondary">
                            PNG, JPG (Recommended: 200x200px)
                          </Typography>
                        </>
                      )}
                    </label>
                    {logo && (
                      <Avatar src={logo} sx={{ width: 80, height: 80, mx: 'auto', mt: 3 }} />
                    )}
                  </UploadBox>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    Site Information
                  </Typography>
                  <TextField
                    fullWidth
                    label="Site Name"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    sx={{ mb: 3 }}
                    helperText="Your school or organization name"
                  />
                  <TextField
                    fullWidth
                    label="Hero Title"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    sx={{ mb: 3 }}
                    helperText="Main heading on home page"
                  />
                  <TextField
                    fullWidth
                    label="Hero Subtitle"
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    sx={{ mb: 3 }}
                    helperText="Tagline or motto"
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Hero Description"
                    value={heroDescription}
                    onChange={(e) => setHeroDescription(e.target.value)}
                    helperText="Brief description of your institution"
                  />
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<Save />}
                  onClick={handleSaveHeroSection}
                  disabled={saving}
                  sx={{
                    py: 2,
                    fontSize: '1.2rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                >
                  {saving ? 'Saving...' : 'Save Site Identity'}
                </Button>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Hero Slider Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h4" fontWeight="bold">
                Manage Hero Slider
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => {
                  setEditingSlide(null);
                  setOpenSliderDialog(true);
                }}
                sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                Add Slide
              </Button>
            </Box>

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                Create stunning full-width slides with images or videos. Text is optional - you can create image-only slides!
                Your slides will auto-advance every 6 seconds with beautiful Ken Burns zoom effects.
              </Typography>
            </Alert>

            <Grid container spacing={3}>
              {slides.map((slide, index) => (
                <Grid item xs={12} md={6} lg={4} key={slide.id}>
                  <Card sx={{ position: 'relative' }}>
                    <Box sx={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                      {slide.type === 'video' ? (
                        <Box sx={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white'
                        }}>
                          <VideoLibrary sx={{ fontSize: 64 }} />
                        </Box>
                      ) : (
                        <img src={slide.url} alt={slide.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )}
                      <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          sx={{ background: 'white' }}
                          onClick={() => {
                            setEditingSlide(slide);
                            setOpenSliderDialog(true);
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ background: 'white' }}
                          onClick={() => handleDeleteSlide(slide.id)}
                        >
                          <Delete fontSize="small" color="error" />
                        </IconButton>
                      </Box>
                      <Chip
                        label={`Slide ${index + 1}`}
                        size="small"
                        sx={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.7)', color: 'white' }}
                      />
                    </Box>
                    <CardContent>
                      <Typography variant="h6" noWrap>
                        {slide.title || `Slide ${index + 1}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {slide.description || 'No description'}
                      </Typography>
                      <Chip
                        label={slide.active ? 'Active' : 'Inactive'}
                        color={slide.active ? 'success' : 'default'}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}

              {slides.length === 0 && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 6, textAlign: 'center', background: '#f5f5f5' }}>
                    <Slideshow sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h5" color="text.secondary" gutterBottom>
                      No slides yet
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                      Add beautiful images to showcase your institution
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => {
                        setEditingSlide(null);
                        setOpenSliderDialog(true);
                      }}
                    >
                      Add Your First Slide
                    </Button>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </TabPanel>

          {/* Statistics Tab */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Statistics Section
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                Show impressive numbers about your institution. These appear as large cards on your home page.
              </Typography>
            </Alert>

            <Grid container spacing={3}>
              {['Students', 'Teachers', 'Programs', 'Success Rate'].map((label, index) => {
                const stat = statistics[index] || { label, value: '', icon: label.toLowerCase() };
                return (
                  <Grid item xs={12} md={6} key={index}>
                    <Card sx={{ p: 3 }}>
                      <TextField
                        fullWidth
                        label={`${label} Count`}
                        value={stat.value}
                        onChange={(e) => {
                          const newStats = [...statistics];
                          newStats[index] = { ...stat, label, value: e.target.value, icon: label.toLowerCase() };
                          setStatistics(newStats);
                        }}
                        placeholder="e.g., 5,000+"
                        helperText={`Number of ${label.toLowerCase()} to display`}
                      />
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<Save />}
              onClick={handleSaveStatistics}
              disabled={saving}
              sx={{
                mt: 4,
                py: 2,
                fontSize: '1.2rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              {saving ? 'Saving...' : 'Save Statistics'}
            </Button>
          </TabPanel>

          {/* Preview Tab */}
          <TabPanel value={tabValue} index={5}>
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Preview sx={{ fontSize: 100, color: '#667eea', mb: 3 }} />
              <Typography variant="h3" gutterBottom fontWeight="bold">
                Preview Your Website
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                See how your website looks to visitors
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<Preview />}
                onClick={() => window.open('/home', '_blank')}
                sx={{
                  px: 6,
                  py: 2,
                  fontSize: '1.3rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                Open Live Preview
              </Button>

              <Divider sx={{ my: 4 }} />

              <Alert severity="success">
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Pro Tip: Clear Browser Cache
                </Typography>
                <Typography variant="body2">
                  After making changes, press <strong>Ctrl + Shift + R</strong> (Windows/Linux) or{' '}
                  <strong>Cmd + Shift + R</strong> (Mac) to see latest changes immediately!
                </Typography>
              </Alert>
            </Box>
          </TabPanel>
        </BuilderCard>
      </Container>

      {/* Slider Dialog */}
      <SliderDialog
        open={openSliderDialog}
        onClose={() => {
          setOpenSliderDialog(false);
          setEditingSlide(null);
        }}
        onSave={handleSaveSlide}
        editingSlider={editingSlide}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default WebsiteBuilder;
