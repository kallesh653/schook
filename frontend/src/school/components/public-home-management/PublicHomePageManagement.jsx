import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  IconButton,
  Chip,
  Avatar,
  Alert,
  Snackbar,
  CircularProgress,
  Tab,
  Tabs
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CloudUpload as UploadIcon,
  Preview as PreviewIcon,
  Save as SaveIcon,
  Image as ImageIcon,
  VideoLibrary as VideoIcon,
  Announcement as NewsIcon,
  School as SchoolIcon,
  Slideshow as SliderIcon,
  Info as InfoIcon,
  Visibility as VisibilityIcon,
  Language as HeaderIcon,
  Code as ProgramsIcon,
  Villa as CampusIcon,
  CheckCircle as WhyChooseUsIcon,
  FormatQuote as TestimonialsIcon,
  Article as AboutIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { baseUrl } from '../../../environment';
import SliderDialog from '../front-page-management/SliderDialog';
import NewsDialog from '../front-page-management/NewsDialog';

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
  color: 'white',
  boxShadow: '0 8px 32px rgba(30, 60, 114, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(30, 60, 114, 0.4)'
  }
}));

const UploadBox = styled(Box)(({ theme }) => ({
  border: '2px dashed #ccc',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: 'rgba(30, 60, 114, 0.05)'
  }
}));

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const PublicHomePageManagement = () => {
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // School Information for Public Page
  const [schoolInfo, setSchoolInfo] = useState({
    name: '',
    tagline: '',
    description: '',
    established: '',
    students: '',
    teachers: '',
    achievements: ''
  });

  // Slider Images/Videos
  const [sliderImages, setSliderImages] = useState([]);

  // Latest News
  const [latestNews, setLatestNews] = useState([]);

  // Hero Section
  const [heroSection, setHeroSection] = useState({
    title: '',
    subtitle: '',
    backgroundImage: null,
    showStatistics: true
  });

  // Header & Logo
  const [header, setHeader] = useState({
    logo: null,
    siteName: 'SCHOOL MANAGEMENT SYSTEM',
    showLoginButton: true,
    showRegisterButton: true
  });

  // Programs
  const [programs, setPrograms] = useState([]);

  // Campus
  const [campus, setCampus] = useState({
    sectionTitle: 'Explore Our Campus',
    description: '',
    images: [],
    videoUrl: ''
  });

  // Why Choose Us (Features)
  const [whyChooseUs, setWhyChooseUs] = useState([]);

  // Testimonials
  const [testimonials, setTestimonials] = useState([]);

  // About Section
  const [about, setAbout] = useState({
    title: 'About Our School',
    description: '',
    image: null
  });

  // Dialogs
  const [openSliderDialog, setOpenSliderDialog] = useState(false);
  const [openNewsDialog, setOpenNewsDialog] = useState(false);
  const [editingSlider, setEditingSlider] = useState(null);
  const [editingNews, setEditingNews] = useState(null);

  useEffect(() => {
    fetchPublicPageData();
  }, []);

  const fetchPublicPageData = async () => {
    try {
      setLoading(true);
      // Fetch PUBLIC home page data (not school-specific)
      const response = await axios.get(`${baseUrl}/public-home/data`);

      if (response.data.success) {
        const data = response.data.data;

        // Set hero section
        setHeroSection({
          title: data.heroSection?.title || 'SCHOOL MANAGEMENT SYSTEM',
          subtitle: data.heroSection?.subtitle || 'Manage Your School Efficiently',
          backgroundImage: data.heroSection?.backgroundImage || null,
          showStatistics: data.statistics?.showSection !== false
        });

        // Set school info from statistics
        const stats = data.statistics?.stats || [];
        setSchoolInfo({
          name: data.header?.siteName || 'SCHOOL MANAGEMENT SYSTEM',
          tagline: data.heroSection?.subtitle || '',
          description: data.heroSection?.description || '',
          established: stats.find(s => s.label === 'Schools')?.value || '100+',
          students: stats.find(s => s.label === 'Students')?.value || '10,000+',
          teachers: stats.find(s => s.label === 'Teachers')?.value || '1,000+',
          achievements: stats.find(s => s.label === 'Success Rate')?.value || '95%'
        });

        // Set slider from public page
        setSliderImages(data.slider?.slides || []);

        // Set announcements from public page
        setLatestNews(data.announcements?.items?.filter(item => item.published) || []);

        // Set header & logo
        setHeader({
          logo: data.header?.logo || null,
          siteName: data.header?.siteName || 'SCHOOL MANAGEMENT SYSTEM',
          showLoginButton: data.header?.showLoginButton !== false,
          showRegisterButton: data.header?.showRegisterButton !== false
        });

        // Set programs
        setPrograms(data.programs?.items || []);

        // Set campus
        setCampus({
          sectionTitle: data.campus?.sectionTitle || 'Explore Our Campus',
          description: data.campus?.description || '',
          images: data.campus?.images || [],
          videoUrl: data.campus?.videoUrl || ''
        });

        // Set why choose us
        setWhyChooseUs(data.features?.items || []);

        // Set testimonials
        setTestimonials(data.testimonials?.items || []);

        // Set about
        setAbout({
          title: data.aboutSection?.title || 'About Our School',
          description: data.aboutSection?.description || '',
          image: data.aboutSection?.image || null
        });
      }
    } catch (error) {
      console.error('Error fetching public page data:', error);
      setSnackbar({
        open: true,
        message: 'Error loading public page data',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSchoolInfo = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      // Update PUBLIC home page statistics
      await axios.patch(`${baseUrl}/public-home/statistics`, {
        stats: [
          { label: 'Schools', value: schoolInfo.established, icon: 'school' },
          { label: 'Students', value: schoolInfo.students, icon: 'students' },
          { label: 'Teachers', value: schoolInfo.teachers, icon: 'teachers' },
          { label: 'Success Rate', value: schoolInfo.achievements, icon: 'success' }
        ]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update header site name
      await axios.patch(`${baseUrl}/public-home/header`, {
        siteName: schoolInfo.name
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSnackbar({
        open: true,
        message: 'Public home page information updated successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving school info:', error);
      setSnackbar({
        open: true,
        message: 'Error saving public page information',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveHeroSection = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      // Update PUBLIC home page hero section
      await axios.patch(`${baseUrl}/public-home/hero-section`, {
        title: heroSection.title,
        subtitle: heroSection.subtitle,
        backgroundImage: heroSection.backgroundImage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update statistics visibility
      await axios.patch(`${baseUrl}/public-home/statistics`, {
        showSection: heroSection.showStatistics
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSnackbar({
        open: true,
        message: 'Public home page hero section updated successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving hero section:', error);
      setSnackbar({
        open: true,
        message: 'Error saving hero section',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = (file, field) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setHeroSection(prev => ({
        ...prev,
        [field]: e.target.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteSlide = async (slideId) => {
    try {
      const updatedSlides = sliderImages.filter(slide => slide.id !== slideId);
      setSliderImages(updatedSlides);

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.patch(`${baseUrl}/public-home/slider`, {
        slides: updatedSlides
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSnackbar({
        open: true,
        message: 'Public page slide deleted successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting slide:', error);
      setSnackbar({
        open: true,
        message: 'Error deleting slide',
        severity: 'error'
      });
    }
  };

  const handleSaveSlide = async (slideData) => {
    try {
      let updatedSlides;
      if (editingSlider) {
        updatedSlides = sliderImages.map(slide =>
          slide.id === editingSlider.id ? slideData : slide
        );
      } else {
        updatedSlides = [...sliderImages, slideData];
      }

      setSliderImages(updatedSlides);

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.patch(`${baseUrl}/public-home/slider`, {
        slides: updatedSlides
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSnackbar({
        open: true,
        message: 'Public page slide saved successfully!',
        severity: 'success'
      });
      setOpenSliderDialog(false);
    } catch (error) {
      console.error('Error saving slide:', error);
      setSnackbar({
        open: true,
        message: 'Error saving slide',
        severity: 'error'
      });
    }
  };

  const handleSaveNews = async (newsData) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      let updatedNews;
      if (editingNews) {
        // Find index and update
        const index = latestNews.findIndex(item => item.title === editingNews.title);
        updatedNews = [...latestNews];
        updatedNews[index] = newsData;
      } else {
        updatedNews = [...latestNews, newsData];
      }

      // Save to public home page
      await axios.patch(`${baseUrl}/public-home/announcements`, {
        items: updatedNews
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setLatestNews(updatedNews);
      setSnackbar({
        open: true,
        message: 'Public page announcement saved successfully!',
        severity: 'success'
      });
      setOpenNewsDialog(false);
    } catch (error) {
      console.error('Error saving news:', error);
      setSnackbar({
        open: true,
        message: 'Error saving announcement',
        severity: 'error'
      });
    }
  };

  const handleDeleteNews = async (newsTitle) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const updatedNews = latestNews.filter(item => item.title !== newsTitle);

      await axios.patch(`${baseUrl}/public-home/announcements`, {
        items: updatedNews
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setLatestNews(updatedNews);
      setSnackbar({
        open: true,
        message: 'Public page announcement deleted successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting news:', error);
      setSnackbar({
        open: true,
        message: 'Error deleting announcement',
        severity: 'error'
      });
    }
  };

  // Save Header & Logo
  const handleSaveHeader = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.patch(`${baseUrl}/public-home/header`, header, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSnackbar({
        open: true,
        message: 'Header and logo updated successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving header:', error);
      setSnackbar({
        open: true,
        message: 'Error saving header',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  // Save Programs
  const handleSavePrograms = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.patch(`${baseUrl}/public-home/programs`, {
        items: programs
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSnackbar({
        open: true,
        message: 'Programs updated successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving programs:', error);
      setSnackbar({
        open: true,
        message: 'Error saving programs',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  // Save Campus
  const handleSaveCampus = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.patch(`${baseUrl}/public-home/campus`, campus, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSnackbar({
        open: true,
        message: 'Campus section updated successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving campus:', error);
      setSnackbar({
        open: true,
        message: 'Error saving campus section',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  // Save Why Choose Us
  const handleSaveWhyChooseUs = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.patch(`${baseUrl}/public-home/features`, {
        items: whyChooseUs
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSnackbar({
        open: true,
        message: 'Why Choose Us section updated successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving why choose us:', error);
      setSnackbar({
        open: true,
        message: 'Error saving Why Choose Us section',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  // Save Testimonials
  const handleSaveTestimonials = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.patch(`${baseUrl}/public-home/testimonials`, {
        items: testimonials
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSnackbar({
        open: true,
        message: 'Testimonials updated successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving testimonials:', error);
      setSnackbar({
        open: true,
        message: 'Error saving testimonials',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  // Save About
  const handleSaveAbout = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.patch(`${baseUrl}/public-home/about`, about, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSnackbar({
        open: true,
        message: 'About section updated successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving about:', error);
      setSnackbar({
        open: true,
        message: 'Error saving about section',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = (file, field, section = 'hero') => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (section === 'hero') {
        setHeroSection(prev => ({
          ...prev,
          [field]: e.target.result
        }));
      } else if (section === 'header') {
        setHeader(prev => ({
          ...prev,
          [field]: e.target.result
        }));
      } else if (section === 'about') {
        setAbout(prev => ({
          ...prev,
          [field]: e.target.result
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: '1400px', mx: 'auto' }}>
      {/* Header */}
      <Box sx={{
        textAlign: 'center',
        mb: 4,
        p: 4,
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        borderRadius: 3,
        color: 'white',
        boxShadow: '0 8px 32px rgba(30, 60, 114, 0.3)'
      }}>
        <VisibilityIcon sx={{ fontSize: 48, mb: 2 }} />
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          Public Home Page Management
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Complete control over your public-facing home page
        </Typography>
      </Box>

      {/* Quick Preview Button */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<PreviewIcon />}
          onClick={() => window.open('/', '_blank')}
          sx={{
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            px: 4,
            py: 1.5
          }}
        >
          Preview Public Home Page
        </Button>
      </Box>

      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            '& .MuiTab-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              fontWeight: 600,
              '&.Mui-selected': {
                color: 'white'
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'white',
              height: 3
            }
          }}
        >
          <Tab icon={<HeaderIcon />} label="Header & Logo" />
          <Tab icon={<InfoIcon />} label="Hero Section" />
          <Tab icon={<SliderIcon />} label="Image Slider" />
          <Tab icon={<ProgramsIcon />} label="Our Programs" />
          <Tab icon={<CampusIcon />} label="Explore Campus" />
          <Tab icon={<WhyChooseUsIcon />} label="Why Choose Us" />
          <Tab icon={<TestimonialsIcon />} label="What Parents Say" />
          <Tab icon={<AboutIcon />} label="About School" />
          <Tab icon={<NewsIcon />} label="Latest News" />
        </Tabs>

        {/* Header & Logo Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                Control your website's header, logo, and site name. This appears at the top of every page.
              </Alert>
            </Grid>

            <Grid item xs={12} md={6}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                    Site Name
                  </Typography>
                  <TextField
                    fullWidth
                    label="Site Name"
                    value={header.siteName}
                    onChange={(e) => setHeader(prev => ({ ...prev, siteName: e.target.value }))}
                    placeholder="SCHOOL MANAGEMENT SYSTEM"
                    sx={{
                      '& .MuiInputBase-root': { color: 'white' },
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.8)' },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' }
                    }}
                  />
                </CardContent>
              </StyledCard>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Logo Upload
                  </Typography>
                  <UploadBox>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="logo-upload"
                      onChange={(e) => handleFileUpload(e.target.files[0], 'logo', 'header')}
                    />
                    <label htmlFor="logo-upload">
                      <ImageIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                      <Typography>Upload Logo</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Recommended: 200x80px, PNG with transparent background
                      </Typography>
                    </label>
                    {header.logo && (
                      <Box sx={{ mt: 2 }}>
                        <img
                          src={header.logo}
                          alt="Logo"
                          style={{
                            maxWidth: '200px',
                            maxHeight: '80px',
                            objectFit: 'contain'
                          }}
                        />
                      </Box>
                    )}
                  </UploadBox>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveHeader}
                  disabled={saving}
                  sx={{ px: 4 }}
                >
                  {saving ? 'Saving...' : 'Save Header & Logo'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Hero Section Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                The Hero Section is the first thing visitors see on your public home page. Make it count!
              </Alert>
            </Grid>

            <Grid item xs={12} md={6}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Hero Title & Subtitle
                  </Typography>
                  <TextField
                    fullWidth
                    label="Main Title"
                    value={heroSection.title}
                    onChange={(e) => setHeroSection(prev => ({ ...prev, title: e.target.value }))}
                    sx={{
                      mb: 2,
                      '& .MuiInputBase-root': { color: 'white' },
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.8)' },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' }
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Subtitle/Tagline"
                    value={heroSection.subtitle}
                    onChange={(e) => setHeroSection(prev => ({ ...prev, subtitle: e.target.value }))}
                    sx={{
                      '& .MuiInputBase-root': { color: 'white' },
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.8)' },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' }
                    }}
                  />
                </CardContent>
              </StyledCard>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Hero Background Image
                  </Typography>
                  <UploadBox>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="hero-bg-upload"
                      onChange={(e) => handleFileUpload(e.target.files[0], 'backgroundImage')}
                    />
                    <label htmlFor="hero-bg-upload">
                      <ImageIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                      <Typography>Upload Hero Background</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Recommended: 1920x1080px
                      </Typography>
                    </label>
                    {heroSection.backgroundImage && (
                      <Box sx={{ mt: 2 }}>
                        <img
                          src={heroSection.backgroundImage}
                          alt="Hero background"
                          style={{
                            width: '100%',
                            maxHeight: '150px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />
                      </Box>
                    )}
                  </UploadBox>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={heroSection.showStatistics}
                        onChange={(e) => setHeroSection(prev => ({ ...prev, showStatistics: e.target.checked }))}
                      />
                    }
                    label="Show Statistics (Students, Teachers, Achievements)"
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveHeroSection}
                  disabled={saving}
                  sx={{ px: 4 }}
                >
                  {saving ? 'Saving...' : 'Save Hero Section'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Image Slider Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Manage Public Page Slider</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingSlider(null);
                setOpenSliderDialog(true);
              }}
            >
              Add Slide
            </Button>
          </Box>

          <Grid container spacing={3}>
            {sliderImages.map((slide, index) => (
              <Grid item xs={12} md={6} lg={4} key={slide.id}>
                <Card>
                  <Box sx={{ position: 'relative', height: 200 }}>
                    {slide.type === 'video' ? (
                      <Box sx={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <VideoIcon sx={{ fontSize: 64, color: 'white' }} />
                      </Box>
                    ) : (
                      <img
                        src={slide.url}
                        alt={slide.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    )}
                    <Box sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      display: 'flex',
                      gap: 1
                    }}>
                      <IconButton
                        size="small"
                        sx={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                        onClick={() => {
                          setEditingSlider(slide);
                          setOpenSliderDialog(true);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                        onClick={() => handleDeleteSlide(slide.id)}
                      >
                        <DeleteIcon fontSize="small" color="error" />
                      </IconButton>
                    </Box>
                    <Chip
                      label={slide.type === 'video' ? 'Video' : 'Image'}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: 'white'
                      }}
                    />
                  </Box>
                  <CardContent>
                    <Typography variant="h6" gutterBottom noWrap>
                      {slide.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {slide.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {sliderImages.length === 0 && (
              <Grid item xs={12}>
                <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
                  <SliderIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No slides added yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Add beautiful images or videos to showcase your school
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setEditingSlider(null);
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

        {/* Our Programs Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                Showcase the programs and courses your institution offers.
              </Alert>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Programs List</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Add program items with title, description, icon, and color. Example: "Pre-K Program", "Elementary Education", etc.
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setPrograms([...programs, { title: '', description: '', icon: '🎓', color: '#667eea' }])}
                  >
                    Add Program
                  </Button>
                  {programs.map((prog, index) => (
                    <Box key={index} sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Program Title"
                            value={prog.title}
                            onChange={(e) => {
                              const updated = [...programs];
                              updated[index].title = e.target.value;
                              setPrograms(updated);
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            multiline
                            label="Description"
                            value={prog.description}
                            onChange={(e) => {
                              const updated = [...programs];
                              updated[index].description = e.target.value;
                              setPrograms(updated);
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <IconButton
                            color="error"
                            onClick={() => setPrograms(programs.filter((_, i) => i !== index))}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<SaveIcon />}
                  onClick={handleSavePrograms}
                  disabled={saving}
                  sx={{ px: 4 }}
                >
                  {saving ? 'Saving...' : 'Save Programs'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Explore Campus Tab */}
        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                Add campus photos and video to give visitors a virtual tour.
              </Alert>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Campus Video URL</Typography>
                  <TextField
                    fullWidth
                    label="Video URL (YouTube, Vimeo, etc.)"
                    value={campus.videoUrl}
                    onChange={(e) => setCampus(prev => ({ ...prev, videoUrl: e.target.value }))}
                    placeholder="https://www.youtube.com/watch?v=..."
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Campus Description</Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Description"
                    value={campus.description}
                    onChange={(e) => setCampus(prev => ({ ...prev, description: e.target.value }))}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveCampus}
                  disabled={saving}
                  sx={{ px: 4 }}
                >
                  {saving ? 'Saving...' : 'Save Campus Section'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Why Choose Us Tab */}
        <TabPanel value={tabValue} index={5}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                Highlight the key reasons why families should choose your institution.
              </Alert>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setWhyChooseUs([...whyChooseUs, { title: '', description: '', icon: '✓', color: '#667eea' }])}
                  >
                    Add Feature
                  </Button>
                  {whyChooseUs.map((feature, index) => (
                    <Box key={index} sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Feature Title"
                            value={feature.title}
                            onChange={(e) => {
                              const updated = [...whyChooseUs];
                              updated[index].title = e.target.value;
                              setWhyChooseUs(updated);
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            multiline
                            label="Description"
                            value={feature.description}
                            onChange={(e) => {
                              const updated = [...whyChooseUs];
                              updated[index].description = e.target.value;
                              setWhyChooseUs(updated);
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <IconButton
                            color="error"
                            onClick={() => setWhyChooseUs(whyChooseUs.filter((_, i) => i !== index))}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveWhyChooseUs}
                  disabled={saving}
                  sx={{ px: 4 }}
                >
                  {saving ? 'Saving...' : 'Save Why Choose Us'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* What Parents Say Tab */}
        <TabPanel value={tabValue} index={6}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                Share testimonials from parents and families.
              </Alert>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setTestimonials([...testimonials, { name: '', role: 'Parent', text: '', rating: 5 }])}
                  >
                    Add Testimonial
                  </Button>
                  {testimonials.map((test, index) => (
                    <Box key={index} sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Parent Name"
                            value={test.name}
                            onChange={(e) => {
                              const updated = [...testimonials];
                              updated[index].name = e.target.value;
                              setTestimonials(updated);
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={8}>
                          <TextField
                            fullWidth
                            multiline
                            rows={2}
                            label="Testimonial Text"
                            value={test.text}
                            onChange={(e) => {
                              const updated = [...testimonials];
                              updated[index].text = e.target.value;
                              setTestimonials(updated);
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <IconButton
                            color="error"
                            onClick={() => setTestimonials(testimonials.filter((_, i) => i !== index))}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveTestimonials}
                  disabled={saving}
                  sx={{ px: 4 }}
                >
                  {saving ? 'Saving...' : 'Save Testimonials'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* About School Tab */}
        <TabPanel value={tabValue} index={7}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                Provide detailed information about your school's mission, vision, and values.
              </Alert>
            </Grid>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <TextField
                    fullWidth
                    label="About Title"
                    value={about.title}
                    onChange={(e) => setAbout(prev => ({ ...prev, title: e.target.value }))}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    label="About Description"
                    value={about.description}
                    onChange={(e) => setAbout(prev => ({ ...prev, description: e.target.value }))}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>About Image</Typography>
                  <UploadBox>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="about-image-upload"
                      onChange={(e) => handleFileUpload(e.target.files[0], 'image', 'about')}
                    />
                    <label htmlFor="about-image-upload">
                      <ImageIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                      <Typography>Upload Image</Typography>
                    </label>
                    {about.image && (
                      <Box sx={{ mt: 2 }}>
                        <img
                          src={about.image}
                          alt="About"
                          style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      </Box>
                    )}
                  </UploadBox>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveAbout}
                  disabled={saving}
                  sx={{ px: 4 }}
                >
                  {saving ? 'Saving...' : 'Save About Section'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Latest News Tab */}
        <TabPanel value={tabValue} index={8}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Latest News & Announcements</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingNews(null);
                setOpenNewsDialog(true);
              }}
            >
              Add News
            </Button>
          </Box>

          <Grid container spacing={3}>
            {latestNews.map((newsItem) => (
              <Grid item xs={12} md={6} key={newsItem._id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6">{newsItem.title}</Typography>
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEditingNews(newsItem);
                            setOpenNewsDialog(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteNews(newsItem.title)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {new Date(newsItem.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {newsItem.description}
                    </Typography>
                    <Chip
                      label={newsItem.published ? 'Published' : 'Draft'}
                      color={newsItem.published ? 'success' : 'default'}
                      size="small"
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {latestNews.length === 0 && (
              <Grid item xs={12}>
                <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
                  <NewsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No news items yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Keep your visitors informed with latest news and announcements
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setEditingNews(null);
                      setOpenNewsDialog(true);
                    }}
                  >
                    Add First News Item
                  </Button>
                </Paper>
              </Grid>
            )}
          </Grid>
        </TabPanel>
      </Paper>

      {/* Dialogs */}
      <SliderDialog
        open={openSliderDialog}
        onClose={() => setOpenSliderDialog(false)}
        onSave={handleSaveSlide}
        editingSlider={editingSlider}
      />

      <NewsDialog
        open={openNewsDialog}
        onClose={() => setOpenNewsDialog(false)}
        onSave={handleSaveNews}
        editingNews={editingNews}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PublicHomePageManagement;
