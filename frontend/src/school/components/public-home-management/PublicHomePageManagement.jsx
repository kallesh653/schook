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
  Visibility as VisibilityIcon
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
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await axios.get(`${baseUrl}/front-page/data`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const data = response.data.data;
        setSchoolInfo(data.schoolInfo || {});
        setSliderImages(data.media?.sliderImages || []);
        setLatestNews(data.news || []);
        setHeroSection({
          title: data.schoolInfo?.name || '',
          subtitle: data.schoolInfo?.tagline || '',
          backgroundImage: data.media?.heroImage || null,
          showStatistics: data.theme?.showStatistics !== false
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
      await axios.patch(`${baseUrl}/front-page/school-info`, schoolInfo, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSnackbar({
        open: true,
        message: 'School information updated successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving school info:', error);
      setSnackbar({
        open: true,
        message: 'Error saving school information',
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

      // Update school info
      await axios.patch(`${baseUrl}/front-page/school-info`, {
        name: heroSection.title,
        tagline: heroSection.subtitle
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update hero image
      if (heroSection.backgroundImage) {
        await axios.patch(`${baseUrl}/front-page/media`, {
          heroImage: heroSection.backgroundImage
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      // Update theme settings
      await axios.patch(`${baseUrl}/front-page/theme`, {
        showStatistics: heroSection.showStatistics
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSnackbar({
        open: true,
        message: 'Hero section updated successfully!',
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
      await axios.patch(`${baseUrl}/front-page/media`, {
        sliderImages: updatedSlides
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSnackbar({
        open: true,
        message: 'Slide deleted successfully!',
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
      await axios.patch(`${baseUrl}/front-page/media`, {
        sliderImages: updatedSlides
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSnackbar({
        open: true,
        message: 'Slide saved successfully!',
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

      if (editingNews) {
        await axios.patch(`${baseUrl}/front-page/news/${editingNews._id}`, newsData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLatestNews(prev =>
          prev.map(item => (item._id === editingNews._id ? { ...newsData, _id: editingNews._id } : item))
        );
      } else {
        await axios.post(`${baseUrl}/front-page/news`, newsData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchPublicPageData();
      }

      setSnackbar({
        open: true,
        message: 'News item saved successfully!',
        severity: 'success'
      });
      setOpenNewsDialog(false);
    } catch (error) {
      console.error('Error saving news:', error);
      setSnackbar({
        open: true,
        message: 'Error saving news item',
        severity: 'error'
      });
    }
  };

  const handleDeleteNews = async (newsId) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.delete(`${baseUrl}/front-page/news/${newsId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setLatestNews(prev => prev.filter(item => item._id !== newsId));
      setSnackbar({
        open: true,
        message: 'News item deleted successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting news:', error);
      setSnackbar({
        open: true,
        message: 'Error deleting news item',
        severity: 'error'
      });
    }
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
          <Tab icon={<InfoIcon />} label="Hero Section" />
          <Tab icon={<SchoolIcon />} label="School Information" />
          <Tab icon={<SliderIcon />} label="Image Slider" />
          <Tab icon={<NewsIcon />} label="Latest News" />
        </Tabs>

        {/* Hero Section Tab */}
        <TabPanel value={tabValue} index={0}>
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

        {/* School Information Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                This information will be displayed in the "About Us" section of the public home page.
              </Alert>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Basic Information
                  </Typography>
                  <TextField
                    fullWidth
                    label="School Name"
                    value={schoolInfo.name}
                    onChange={(e) => setSchoolInfo(prev => ({ ...prev, name: e.target.value }))}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Tagline"
                    value={schoolInfo.tagline}
                    onChange={(e) => setSchoolInfo(prev => ({ ...prev, tagline: e.target.value }))}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    value={schoolInfo.description}
                    onChange={(e) => setSchoolInfo(prev => ({ ...prev, description: e.target.value }))}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Statistics
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Established Year"
                        value={schoolInfo.established}
                        onChange={(e) => setSchoolInfo(prev => ({ ...prev, established: e.target.value }))}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Total Students"
                        value={schoolInfo.students}
                        onChange={(e) => setSchoolInfo(prev => ({ ...prev, students: e.target.value }))}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Teachers"
                        value={schoolInfo.teachers}
                        onChange={(e) => setSchoolInfo(prev => ({ ...prev, teachers: e.target.value }))}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Achievements"
                        value={schoolInfo.achievements}
                        onChange={(e) => setSchoolInfo(prev => ({ ...prev, achievements: e.target.value }))}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveSchoolInfo}
                  disabled={saving}
                  sx={{ px: 4 }}
                >
                  {saving ? 'Saving...' : 'Save School Information'}
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

        {/* Latest News Tab */}
        <TabPanel value={tabValue} index={3}>
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
                          onClick={() => handleDeleteNews(newsItem._id)}
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
