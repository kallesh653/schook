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
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
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
  FormatQuote,
  MenuBook,
  School as SchoolIcon,
  TrendingUp,
  Newspaper,
  CalendarToday,
  Photo as PhotoIcon,
  Phone,
  WhatsApp
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
    fontSize: '0.95rem',
    minHeight: '64px',
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

const CompleteWebsiteBuilder = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // All website data states
  const [logo, setLogo] = useState(null);
  const [siteName, setSiteName] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroDescription, setHeroDescription] = useState('');
  const [slides, setSlides] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [features, setFeatures] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [campusImages, setCampusImages] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [newsEvents, setNewsEvents] = useState([]);
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');

  // Dialogs
  const [openSliderDialog, setOpenSliderDialog] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [openFeatureDialog, setOpenFeatureDialog] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);
  const [openTestimonialDialog, setOpenTestimonialDialog] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [openProgramDialog, setOpenProgramDialog] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);

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
        setPrograms(data.programs?.items || []);
        setCampusImages(data.campus?.images || []);
        setAchievements(data.achievements?.items || []);
        setNewsEvents(data.announcements?.items || []);
        setContactPhone(data.contact?.phone || '');
        setContactEmail(data.contact?.email || '');
        setContactAddress(data.contact?.address || '');
        setWhatsappNumber(data.socialMedia?.whatsapp || '');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setSnackbar({ open: true, message: 'Error loading website data', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getToken = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      setSnackbar({ open: true, message: 'Please login first to save changes', severity: 'error' });
      return null;
    }
    return token;
  };

  // ===== SITE IDENTITY =====
  const handleLogoUpload = async (file) => {
    if (!file) return;
    const token = getToken();
    if (!token) return;

    setSaving(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64Logo = e.target.result;
          setLogo(base64Logo);

          await axios.patch(`${baseUrl}/public-home/header`, {
            logo: base64Logo,
            siteName: siteName
          }, { headers: { Authorization: `Bearer ${token}` } });

          setSnackbar({ open: true, message: 'Logo uploaded successfully!', severity: 'success' });
        } catch (error) {
          console.error('Logo upload error:', error);
          const errorMsg = error.response?.data?.message || error.message || 'Error uploading logo';
          setSnackbar({ open: true, message: errorMsg, severity: 'error' });
        } finally {
          setSaving(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('File read error:', error);
      setSnackbar({ open: true, message: 'Error reading file', severity: 'error' });
      setSaving(false);
    }
  };

  const handleSaveIdentity = async () => {
    const token = getToken();
    if (!token) return;

    setSaving(true);
    try {
      await axios.patch(`${baseUrl}/public-home/hero-section`, {
        title: heroTitle,
        subtitle: heroSubtitle,
        description: heroDescription
      }, { headers: { Authorization: `Bearer ${token}` } });

      await axios.patch(`${baseUrl}/public-home/header`, {
        logo: logo,
        siteName: siteName
      }, { headers: { Authorization: `Bearer ${token}` } });

      setSnackbar({ open: true, message: 'Site identity saved successfully!', severity: 'success' });
      fetchWebsiteData();
    } catch (error) {
      console.error('Save error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Error saving';
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // ===== SLIDER =====
  const handleSaveSlide = async (slideData) => {
    const token = getToken();
    if (!token) return;

    try {
      const updatedSlides = editingSlide
        ? slides.map(s => s.id === editingSlide.id ? slideData : s)
        : [...slides, slideData];

      setSlides(updatedSlides);

      await axios.patch(`${baseUrl}/public-home/slider`, {
        showSlider: true,
        slides: updatedSlides
      }, { headers: { Authorization: `Bearer ${token}` } });

      setSnackbar({ open: true, message: 'Slide saved successfully!', severity: 'success' });
      setOpenSliderDialog(false);
      setEditingSlide(null);
      fetchWebsiteData();
    } catch (error) {
      console.error('Save slide error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Error saving slide';
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
    }
  };

  const handleDeleteSlide = async (slideId) => {
    const token = getToken();
    if (!token) return;

    try {
      const updatedSlides = slides.filter(s => s.id !== slideId);
      setSlides(updatedSlides);

      await axios.patch(`${baseUrl}/public-home/slider`, {
        showSlider: true,
        slides: updatedSlides
      }, { headers: { Authorization: `Bearer ${token}` } });

      setSnackbar({ open: true, message: 'Slide deleted!', severity: 'success' });
      fetchWebsiteData();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error deleting slide', severity: 'error' });
    }
  };

  // ===== STATISTICS =====
  const handleSaveStatistics = async () => {
    const token = getToken();
    if (!token) return;

    setSaving(true);
    try {
      await axios.patch(`${baseUrl}/public-home/statistics`, {
        showSection: true,
        stats: statistics
      }, { headers: { Authorization: `Bearer ${token}` } });

      setSnackbar({ open: true, message: 'Statistics saved successfully!', severity: 'success' });
      fetchWebsiteData();
    } catch (error) {
      console.error('Save statistics error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Error saving statistics';
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // ===== FEATURES =====
  const handleSaveFeatures = async () => {
    const token = getToken();
    if (!token) return;

    setSaving(true);
    try {
      await axios.patch(`${baseUrl}/public-home/features`, {
        showSection: true,
        items: features
      }, { headers: { Authorization: `Bearer ${token}` } });

      setSnackbar({ open: true, message: 'Features saved successfully!', severity: 'success' });
      fetchWebsiteData();
    } catch (error) {
      console.error('Save features error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Error saving features';
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddFeature = () => {
    setFeatures([...features, { title: '', description: '', icon: 'star' }]);
  };

  const handleUpdateFeature = (index, field, value) => {
    const updated = [...features];
    updated[index] = { ...updated[index], [field]: value };
    setFeatures(updated);
  };

  const handleDeleteFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  // ===== TESTIMONIALS =====
  const handleSaveTestimonials = async () => {
    const token = getToken();
    if (!token) return;

    setSaving(true);
    try {
      await axios.patch(`${baseUrl}/public-home/testimonials`, {
        showSection: true,
        items: testimonials
      }, { headers: { Authorization: `Bearer ${token}` } });

      setSnackbar({ open: true, message: 'Testimonials saved successfully!', severity: 'success' });
      fetchWebsiteData();
    } catch (error) {
      console.error('Save testimonials error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Error saving testimonials';
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddTestimonial = () => {
    setTestimonials([...testimonials, { name: '', role: '', text: '', image: '' }]);
  };

  const handleUpdateTestimonial = (index, field, value) => {
    const updated = [...testimonials];
    updated[index] = { ...updated[index], [field]: value };
    setTestimonials(updated);
  };

  const handleDeleteTestimonial = (index) => {
    setTestimonials(testimonials.filter((_, i) => i !== index));
  };

  // ===== PROGRAMS =====
  const handleSavePrograms = async () => {
    const token = getToken();
    if (!token) return;

    setSaving(true);
    try {
      await axios.patch(`${baseUrl}/public-home/programs`, {
        showSection: true,
        items: programs
      }, { headers: { Authorization: `Bearer ${token}` } });

      setSnackbar({ open: true, message: 'Programs saved successfully!', severity: 'success' });
      fetchWebsiteData();
    } catch (error) {
      console.error('Save programs error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Error saving programs';
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddProgram = () => {
    setPrograms([...programs, { title: '', description: '', grade: '' }]);
  };

  const handleUpdateProgram = (index, field, value) => {
    const updated = [...programs];
    updated[index] = { ...updated[index], [field]: value };
    setPrograms(updated);
  };

  const handleDeleteProgram = (index) => {
    setPrograms(programs.filter((_, i) => i !== index));
  };

  // ===== CAMPUS IMAGES =====
  const handleSaveCampus = async () => {
    const token = getToken();
    if (!token) return;

    setSaving(true);
    try {
      await axios.patch(`${baseUrl}/public-home/campus`, {
        showSection: true,
        images: campusImages
      }, { headers: { Authorization: `Bearer ${token}` } });

      setSnackbar({ open: true, message: 'Campus gallery saved successfully!', severity: 'success' });
      fetchWebsiteData();
    } catch (error) {
      console.error('Save campus error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Error saving campus';
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // ===== ACHIEVEMENTS =====
  const handleSaveAchievements = async () => {
    const token = getToken();
    if (!token) return;

    setSaving(true);
    try {
      await axios.patch(`${baseUrl}/public-home/achievements`, {
        showSection: true,
        items: achievements
      }, { headers: { Authorization: `Bearer ${token}` } });

      setSnackbar({ open: true, message: 'Achievements saved successfully!', severity: 'success' });
      fetchWebsiteData();
    } catch (error) {
      console.error('Save achievements error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Error saving achievements';
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddAchievement = () => {
    setAchievements([...achievements, { title: '', year: '', description: '', icon: 'trophy' }]);
  };

  const handleUpdateAchievement = (index, field, value) => {
    const updated = [...achievements];
    updated[index] = { ...updated[index], [field]: value };
    setAchievements(updated);
  };

  const handleDeleteAchievement = (index) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  // ===== NEWS & EVENTS =====
  const handleSaveNewsEvents = async () => {
    const token = getToken();
    if (!token) return;

    setSaving(true);
    try {
      await axios.patch(`${baseUrl}/public-home/announcements`, {
        showSection: true,
        items: newsEvents
      }, { headers: { Authorization: `Bearer ${token}` } });

      setSnackbar({ open: true, message: 'News & Events saved successfully!', severity: 'success' });
      fetchWebsiteData();
    } catch (error) {
      console.error('Save news error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Error saving news';
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddNewsEvent = () => {
    setNewsEvents([...newsEvents, { title: '', date: new Date().toISOString().split('T')[0], description: '' }]);
  };

  const handleUpdateNewsEvent = (index, field, value) => {
    const updated = [...newsEvents];
    updated[index] = { ...updated[index], [field]: value };
    setNewsEvents(updated);
  };

  const handleDeleteNewsEvent = (index) => {
    setNewsEvents(newsEvents.filter((_, i) => i !== index));
  };

  // ===== CONTACT & WHATSAPP =====
  const handleSaveContact = async () => {
    const token = getToken();
    if (!token) return;

    setSaving(true);
    try {
      await axios.patch(`${baseUrl}/public-home/contact`, {
        showSection: true,
        phone: contactPhone,
        email: contactEmail,
        address: contactAddress
      }, { headers: { Authorization: `Bearer ${token}` } });

      await axios.patch(`${baseUrl}/public-home/social-media`, {
        whatsapp: whatsappNumber
      }, { headers: { Authorization: `Bearer ${token}` } });

      setSnackbar({ open: true, message: 'Contact info & WhatsApp saved successfully!', severity: 'success' });
      fetchWebsiteData();
    } catch (error) {
      console.error('Save contact error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Error saving contact';
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
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
            <Typography variant="h2" gutterBottom sx={{ fontWeight: 900, fontSize: { xs: '2rem', md: '3.5rem' } }}>
              🎨 Complete Website Builder
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9 }}>
              Full control over every section of your website
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
            <Tab icon={<MenuBook />} label="Programs" />
            <Tab icon={<PhotoIcon />} label="Campus Gallery" />
            <Tab icon={<EmojiEvents />} label="Achievements" />
            <Tab icon={<Newspaper />} label="News & Events" />
            <Tab icon={<Phone />} label="Contact & WhatsApp" />
            <Tab icon={<Preview />} label="Preview" />
          </StyledTabs>

          {/* TAB 0: Site Identity */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Site Identity Settings
                  </Typography>
                  <Typography variant="body2">
                    Configure your school logo, name, and hero section text that appears on the homepage.
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
                      id="logo-upload"
                      onChange={(e) => handleLogoUpload(e.target.files[0])}
                      disabled={saving}
                    />
                    <label htmlFor="logo-upload">
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
                    label="School Name"
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
                  onClick={handleSaveIdentity}
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

          {/* TAB 1: Hero Slider */}
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
                Create stunning full-width slides with images or videos. Recommended size: 1920x650px
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

          {/* TAB 2: Statistics */}
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

          {/* TAB 3: Features */}
          <TabPanel value={tabValue} index={3}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h4" fontWeight="bold">
                Why Choose Us Features
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddFeature}
                sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                Add Feature
              </Button>
            </Box>

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                Highlight what makes your school special. Recommended: 6 features for best display.
              </Typography>
            </Alert>

            <Grid container spacing={3}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card sx={{ p: 3, position: 'relative' }}>
                    <IconButton
                      size="small"
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                      onClick={() => handleDeleteFeature(index)}
                    >
                      <Delete color="error" />
                    </IconButton>
                    <TextField
                      fullWidth
                      label="Feature Title"
                      value={feature.title}
                      onChange={(e) => handleUpdateFeature(index, 'title', e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Feature Description"
                      value={feature.description}
                      onChange={(e) => handleUpdateFeature(index, 'description', e.target.value)}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<Save />}
              onClick={handleSaveFeatures}
              disabled={saving}
              sx={{
                mt: 4,
                py: 2,
                fontSize: '1.2rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              {saving ? 'Saving...' : 'Save Features'}
            </Button>
          </TabPanel>

          {/* TAB 4: Testimonials */}
          <TabPanel value={tabValue} index={4}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h4" fontWeight="bold">
                Testimonials
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddTestimonial}
                sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                Add Testimonial
              </Button>
            </Box>

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                Show what parents and students say about your school. Recommended: 3-6 testimonials.
              </Typography>
            </Alert>

            <Grid container spacing={3}>
              {testimonials.map((testimonial, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card sx={{ p: 3, position: 'relative' }}>
                    <IconButton
                      size="small"
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                      onClick={() => handleDeleteTestimonial(index)}
                    >
                      <Delete color="error" />
                    </IconButton>
                    <TextField
                      fullWidth
                      label="Name"
                      value={testimonial.name}
                      onChange={(e) => handleUpdateTestimonial(index, 'name', e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Role (e.g., Parent, Student)"
                      value={testimonial.role}
                      onChange={(e) => handleUpdateTestimonial(index, 'role', e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Testimonial Text"
                      value={testimonial.text}
                      onChange={(e) => handleUpdateTestimonial(index, 'text', e.target.value)}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<Save />}
              onClick={handleSaveTestimonials}
              disabled={saving}
              sx={{
                mt: 4,
                py: 2,
                fontSize: '1.2rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              {saving ? 'Saving...' : 'Save Testimonials'}
            </Button>
          </TabPanel>

          {/* TAB 5: Programs */}
          <TabPanel value={tabValue} index={5}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h4" fontWeight="bold">
                Academic Programs
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddProgram}
                sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                Add Program
              </Button>
            </Box>

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                Showcase your educational programs and grade levels. Recommended: 6 programs.
              </Typography>
            </Alert>

            <Grid container spacing={3}>
              {programs.map((program, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card sx={{ p: 3, position: 'relative' }}>
                    <IconButton
                      size="small"
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                      onClick={() => handleDeleteProgram(index)}
                    >
                      <Delete color="error" />
                    </IconButton>
                    <TextField
                      fullWidth
                      label="Program Title"
                      value={program.title}
                      onChange={(e) => handleUpdateProgram(index, 'title', e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Grade Level (e.g., Grades 1-5)"
                      value={program.grade}
                      onChange={(e) => handleUpdateProgram(index, 'grade', e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Program Description"
                      value={program.description}
                      onChange={(e) => handleUpdateProgram(index, 'description', e.target.value)}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<Save />}
              onClick={handleSavePrograms}
              disabled={saving}
              sx={{
                mt: 4,
                py: 2,
                fontSize: '1.2rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              {saving ? 'Saving...' : 'Save Programs'}
            </Button>
          </TabPanel>

          {/* TAB 6: Campus Gallery */}
          <TabPanel value={tabValue} index={6}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Campus Gallery
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                Add URLs of campus photos. Recommended: 6 images showing different areas of your campus.
              </Typography>
            </Alert>

            <Grid container spacing={3}>
              {[0, 1, 2, 3, 4, 5].map((index) => {
                const img = campusImages[index] || { url: '', caption: '' };
                return (
                  <Grid item xs={12} md={4} key={index}>
                    <Card sx={{ p: 3 }}>
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                        Image {index + 1}
                      </Typography>
                      <TextField
                        fullWidth
                        label="Image URL"
                        value={img.url}
                        onChange={(e) => {
                          const updated = [...campusImages];
                          updated[index] = { ...img, url: e.target.value };
                          setCampusImages(updated);
                        }}
                        sx={{ mb: 2 }}
                        placeholder="https://example.com/image.jpg"
                      />
                      <TextField
                        fullWidth
                        label="Caption"
                        value={img.caption}
                        onChange={(e) => {
                          const updated = [...campusImages];
                          updated[index] = { ...img, caption: e.target.value };
                          setCampusImages(updated);
                        }}
                        placeholder="e.g., School Library"
                      />
                      {img.url && (
                        <Box sx={{ mt: 2, width: '100%', height: 150, overflow: 'hidden', borderRadius: 2 }}>
                          <img src={img.url} alt={img.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Box>
                      )}
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
              onClick={handleSaveCampus}
              disabled={saving}
              sx={{
                mt: 4,
                py: 2,
                fontSize: '1.2rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              {saving ? 'Saving...' : 'Save Campus Gallery'}
            </Button>
          </TabPanel>

          {/* TAB 7: Achievements */}
          <TabPanel value={tabValue} index={7}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h4" fontWeight="bold">
                Achievements & Awards
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddAchievement}
                sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                Add Achievement
              </Button>
            </Box>

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                Showcase your schools awards and achievements. Recommended: 4 achievements.
              </Typography>
            </Alert>

            <Grid container spacing={3}>
              {achievements.map((achievement, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card sx={{ p: 3, position: 'relative' }}>
                    <IconButton
                      size="small"
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                      onClick={() => handleDeleteAchievement(index)}
                    >
                      <Delete color="error" />
                    </IconButton>
                    <TextField
                      fullWidth
                      label="Achievement Title"
                      value={achievement.title}
                      onChange={(e) => handleUpdateAchievement(index, 'title', e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Year"
                      value={achievement.year}
                      onChange={(e) => handleUpdateAchievement(index, 'year', e.target.value)}
                      sx={{ mb: 2 }}
                      placeholder="e.g., 2024"
                    />
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Description"
                      value={achievement.description}
                      onChange={(e) => handleUpdateAchievement(index, 'description', e.target.value)}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<Save />}
              onClick={handleSaveAchievements}
              disabled={saving}
              sx={{
                mt: 4,
                py: 2,
                fontSize: '1.2rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              {saving ? 'Saving...' : 'Save Achievements'}
            </Button>
          </TabPanel>

          {/* TAB 8: News & Events */}
          <TabPanel value={tabValue} index={8}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h4" fontWeight="bold">
                Latest News & Events
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddNewsEvent}
                sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                Add News/Event
              </Button>
            </Box>

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                Keep your community updated with news and upcoming events. Recommended: 3 events.
              </Typography>
            </Alert>

            <Grid container spacing={3}>
              {newsEvents.map((event, index) => (
                <Grid item xs={12} key={index}>
                  <Card sx={{ p: 3, position: 'relative' }}>
                    <IconButton
                      size="small"
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                      onClick={() => handleDeleteNewsEvent(index)}
                    >
                      <Delete color="error" />
                    </IconButton>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={8}>
                        <TextField
                          fullWidth
                          label="Event Title"
                          value={event.title}
                          onChange={(e) => handleUpdateNewsEvent(index, 'title', e.target.value)}
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Date"
                          type="date"
                          value={event.date}
                          onChange={(e) => handleUpdateNewsEvent(index, 'date', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          label="Description"
                          value={event.description}
                          onChange={(e) => handleUpdateNewsEvent(index, 'description', e.target.value)}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<Save />}
              onClick={handleSaveNewsEvents}
              disabled={saving}
              sx={{
                mt: 4,
                py: 2,
                fontSize: '1.2rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              {saving ? 'Saving...' : 'Save News & Events'}
            </Button>
          </TabPanel>

          {/* TAB 9: Contact & WhatsApp */}
          <TabPanel value={tabValue} index={9}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Contact Information & WhatsApp
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                Set your contact details and WhatsApp number for easy communication.
              </Typography>
            </Alert>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Contact Details
                  </Typography>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    sx={{ mb: 3 }}
                    placeholder="+1 (555) 123-4567"
                  />
                  <TextField
                    fullWidth
                    label="Email Address"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    sx={{ mb: 3 }}
                    placeholder="info@school.com"
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Physical Address"
                    value={contactAddress}
                    onChange={(e) => setContactAddress(e.target.value)}
                    placeholder="123 School St, City, State"
                  />
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <WhatsApp sx={{ fontSize: 40, color: '#25D366', mr: 2 }} />
                    <Typography variant="h6" fontWeight="bold">
                      WhatsApp Integration
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    label="WhatsApp Number"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    helperText="Include country code (e.g., +919876543210)"
                    placeholder="+919876543210"
                  />
                  <Alert severity="success" sx={{ mt: 3 }}>
                    <Typography variant="body2">
                      A floating WhatsApp button will appear on your homepage for easy contact!
                    </Typography>
                  </Alert>
                </Card>
              </Grid>
            </Grid>

            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<Save />}
              onClick={handleSaveContact}
              disabled={saving}
              sx={{
                mt: 4,
                py: 2,
                fontSize: '1.2rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              {saving ? 'Saving...' : 'Save Contact & WhatsApp'}
            </Button>
          </TabPanel>

          {/* TAB 10: Preview */}
          <TabPanel value={tabValue} index={10}>
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

              <Divider sx={{ my: 4 }} />

              <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
                Sections You Control
              </Typography>
              <List sx={{ maxWidth: 600, mx: 'auto', mt: 3 }}>
                {[
                  'Site Identity (Logo & Hero Text)',
                  'Hero Slider (Images/Videos)',
                  'Statistics (4 Numbers)',
                  'Features (Why Choose Us)',
                  'Testimonials (Reviews)',
                  'Programs (Academic Offerings)',
                  'Campus Gallery (6 Photos)',
                  'Achievements (Auto-displayed)',
                  'News & Events (Auto-displayed)',
                  'Contact Information',
                  'Call-to-Action Button'
                ].map((section, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={section}
                      primaryTypographyProps={{ fontWeight: 'bold' }}
                    />
                    <ListItemSecondaryAction>
                      <Chip label="✓" color="success" size="small" />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
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

export default CompleteWebsiteBuilder;
