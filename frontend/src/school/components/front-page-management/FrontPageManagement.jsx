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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tab,
  Tabs,
  Alert,
  Snackbar,
  CircularProgress
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
  Palette as ThemeIcon,
  Navigation as NavigationIcon,
  Slideshow as SliderIcon,
  DragIndicator as DragIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { baseUrl } from '../../../environment';
import NewsDialog from './NewsDialog';
import SliderDialog from './SliderDialog';

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.3)'
  },
  '& .MuiCardContent-root': {
    padding: theme.spacing(3)
  },
  '& .MuiInputBase-root': {
    color: 'white',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255, 255, 255, 0.3)'
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255, 255, 255, 0.5)'
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white'
    }
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.8)'
  }
}));

const UploadBox = styled(Box)(({ theme }) => ({
  border: '2px dashed #ccc',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%)',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    transform: 'scale(1.02)',
    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.15)'
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'linear-gradient(45deg, transparent, rgba(102, 126, 234, 0.03), transparent)',
    transform: 'rotate(45deg)',
    transition: 'all 0.6s ease',
    opacity: 0
  },
  '&:hover::before': {
    opacity: 1,
    animation: 'shimmer 2s infinite'
  },
  '@keyframes shimmer': {
    '0%': {
      transform: 'translateX(-100%) translateY(-100%) rotate(45deg)'
    },
    '100%': {
      transform: 'translateX(100%) translateY(100%) rotate(45deg)'
    }
  }
}));

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: { xs: 2, sm: 3 }, minHeight: '400px' }}>{children}</Box>}
    </div>
  );
}

const FrontPageManagement = () => {
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // School Information State
  const [schoolInfo, setSchoolInfo] = useState({
    name: '',
    tagline: '',
    description: '',
    established: '',
    students: '',
    teachers: '',
    achievements: ''
  });
  
  // Media State
  const [media, setMedia] = useState({
    logo: null,
    heroImage: null,
    aboutImage: null,
    heroVideo: null,
    promoVideo: null,
    campusVideo: null,
    virtualTour: null,
    galleryImages: [],
    sliderImages: []
  });

  // Header & Navigation State
  const [headerSettings, setHeaderSettings] = useState({
    schoolName: '',
    showLogo: true,
    logoPosition: 'left',
    navigationStyle: 'modern',
    backgroundColor: '#fefefe',
    textColor: '#333',
    showLoginButton: true,
    showRegisterButton: true,
    showDashboardButton: true
  });

  // News and Events State
  const [news, setNews] = useState([]);

  // Programs State
  const [programs, setPrograms] = useState([
    {
      id: 1,
      title: 'Elementary School',
      description: 'Building strong foundations for lifelong learning',
      icon: '🌱',
      color: '#667eea'
    },
    {
      id: 2,
      title: 'Middle School',
      description: 'Developing critical thinking and creativity',
      icon: '🚀',
      color: '#f093fb'
    },
    {
      id: 3,
      title: 'High School',
      description: 'Preparing for college and career success',
      icon: '🎓',
      color: '#4facfe'
    }
  ]);

  // Theme State
  const [theme, setTheme] = useState({
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    showStatistics: true,
    showNews: true,
    showPrograms: true
  });

  // Dialog States
  const [openNewsDialog, setOpenNewsDialog] = useState(false);
  const [openProgramDialog, setOpenProgramDialog] = useState(false);
  const [openSliderDialog, setOpenSliderDialog] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [editingProgram, setEditingProgram] = useState(null);
  const [editingSlider, setEditingSlider] = useState(null);

  // Fetch front page data on component mount
  useEffect(() => {
    fetchFrontPageData();
  }, []);

  const fetchFrontPageData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      console.log('Fetching front page data with headers:', headers);
      const response = await axios.get(`${baseUrl}/front-page/data`, { headers });
      
      if (response.data.success) {
        const data = response.data.data;
        setSchoolInfo(data.schoolInfo || {});
        setMedia(data.media || {});
        setNews(data.news || []);
        setPrograms(data.programs || []);
        setTheme(data.theme || {});
        setHeaderSettings(data.headerSettings || {});
      }
    } catch (error) {
      console.error('Error fetching front page data:', error);
      setSnackbar({ 
        open: true, 
        message: 'Error loading front page data', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSchoolInfoChange = (field, value) => {
    setSchoolInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const triggerFrontPageRefresh = () => {
    // Trigger a custom event to refresh the front page
    window.dispatchEvent(new CustomEvent('frontpage-refresh'));
  };

  const handleSaveSchoolInfo = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.patch(`${baseUrl}/front-page/school-info`, schoolInfo, { headers });

      if (response.data.success) {
        setSnackbar({ open: true, message: 'School information updated successfully!', severity: 'success' });
        triggerFrontPageRefresh();
      }
    } catch (error) {
      console.error('Error saving school info:', error);
      setSnackbar({ open: true, message: 'Error saving school information', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (field, file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const newMedia = { ...media, [field]: e.target.result };
        setMedia(newMedia);

        // Save to backend
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        await axios.patch(`${baseUrl}/front-page/media`, { [field]: e.target.result }, { headers });

        const fileType = file.type.startsWith('video/') ? 'Video' : 'Image';
        setSnackbar({ open: true, message: `${fileType} uploaded successfully!`, severity: 'success' });
        triggerFrontPageRefresh();
      } catch (error) {
        console.error('Error uploading file:', error);
        setSnackbar({ open: true, message: 'Error uploading file', severity: 'error' });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleVideoUrlSave = async (field, url) => {
    try {
      const newMedia = { ...media, [field]: url };
      setMedia(newMedia);

      // Save to backend
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.patch(`${baseUrl}/front-page/media`, { [field]: url }, { headers });

      setSnackbar({ open: true, message: 'Video URL saved successfully!', severity: 'success' });
      triggerFrontPageRefresh();
    } catch (error) {
      console.error('Error saving video URL:', error);
      setSnackbar({ open: true, message: 'Error saving video URL', severity: 'error' });
    }
  };

  const handleGalleryUpload = async (files) => {
    if (!files || files.length === 0) return;

    try {
      const fileReaders = Array.from(files).map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
      });

      const imageUrls = await Promise.all(fileReaders);
      const newGalleryImages = [...(media.galleryImages || []), ...imageUrls];
      const newMedia = { ...media, galleryImages: newGalleryImages };
      setMedia(newMedia);

      // Save to backend
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.patch(`${baseUrl}/front-page/media`, { galleryImages: newGalleryImages }, { headers });

      setSnackbar({ open: true, message: `${files.length} images uploaded successfully!`, severity: 'success' });
      triggerFrontPageRefresh();
    } catch (error) {
      console.error('Error uploading gallery images:', error);
      setSnackbar({ open: true, message: 'Error uploading gallery images', severity: 'error' });
    }
  };

  const handleAddNews = () => {
    setEditingNews(null);
    setOpenNewsDialog(true);
  };

  const handleEditNews = (newsItem) => {
    setEditingNews(newsItem);
    setOpenNewsDialog(true);
  };

  const handleDeleteNews = async (id) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await axios.delete(`${baseUrl}/front-page/news/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      if (response.data.success) {
        setNews(prev => prev.filter(item => item._id !== id));
        setSnackbar({ open: true, message: 'News item deleted successfully!', severity: 'success' });
      }
    } catch (error) {
      console.error('Error deleting news:', error);
      setSnackbar({ open: true, message: 'Error deleting news item', severity: 'error' });
    }
  };

  const handleSaveNews = async (newsData) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (editingNews) {
        // Update existing news
        const response = await axios.patch(`${baseUrl}/front-page/news/${editingNews._id}`, newsData, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        
        if (response.data.success) {
          setNews(prev => prev.map(item => 
            item._id === editingNews._id ? { ...newsData, _id: editingNews._id } : item
          ));
        }
      } else {
        // Add new news
        const response = await axios.post(`${baseUrl}/front-page/news`, newsData, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        
        if (response.data.success) {
          fetchFrontPageData(); // Refresh data
        }
      }
      
      setOpenNewsDialog(false);
      setSnackbar({ open: true, message: 'News item saved successfully!', severity: 'success' });
      triggerFrontPageRefresh();
    } catch (error) {
      console.error('Error saving news:', error);
      setSnackbar({ open: true, message: 'Error saving news item', severity: 'error' });
    }
  };

  const handleHeaderSettingsChange = (field, value) => {
    setHeaderSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveHeaderSettings = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await axios.patch(`${baseUrl}/front-page/header-settings`, headerSettings, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      if (response.data.success) {
        setSnackbar({ open: true, message: 'Header settings updated successfully!', severity: 'success' });
        triggerFrontPageRefresh();
      }
    } catch (error) {
      console.error('Error saving header settings:', error);
      setSnackbar({ open: true, message: 'Error saving header settings', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSlide = async (slideId) => {
    try {
      const updatedSlides = media.sliderImages.filter(slide => slide.id !== slideId);
      setMedia(prev => ({ ...prev, sliderImages: updatedSlides }));
      
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.patch(`${baseUrl}/front-page/media`, { sliderImages: updatedSlides }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      setSnackbar({ open: true, message: 'Slide deleted successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error deleting slide:', error);
      setSnackbar({ open: true, message: 'Error deleting slide', severity: 'error' });
    }
  };

  const handleSaveSlide = async (slideData) => {
    try {
      let updatedSlides;
      if (editingSlider) {
        updatedSlides = media.sliderImages.map(slide => 
          slide.id === editingSlider.id ? slideData : slide
        );
      } else {
        updatedSlides = [...(media.sliderImages || []), slideData];
      }
      
      setMedia(prev => ({ ...prev, sliderImages: updatedSlides }));
      
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.patch(`${baseUrl}/front-page/media`, { sliderImages: updatedSlides }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      setSnackbar({ open: true, message: 'Slide saved successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error saving slide:', error);
      setSnackbar({ open: true, message: 'Error saving slide', severity: 'error' });
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
    <Box sx={{
      p: { xs: 2, sm: 3 },
      maxWidth: '1200px',
      mx: 'auto',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      borderRadius: 3
    }}>
      <Box sx={{
        textAlign: 'center',
        mb: 4,
        p: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 3,
        color: 'white',
        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
      }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
          🎨 Front Page Studio
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Create a beautiful and engaging front page for your school
        </Typography>
      </Box>

      <Paper sx={{
        width: '100%',
        borderRadius: 3,
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        background: 'white'
      }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              minWidth: 140,
              color: 'rgba(255, 255, 255, 0.7)',
              transition: 'all 0.3s ease',
              '&.Mui-selected': {
                color: 'white',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px 8px 0 0'
              },
              '&:hover': {
                color: 'white',
                background: 'rgba(255, 255, 255, 0.05)'
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'white',
              height: 3,
              borderRadius: '3px 3px 0 0'
            },
            '& .MuiTabs-scrollButtons': {
              color: 'white'
            }
          }}
        >
          <Tab icon={<NavigationIcon />} label="Header & Navigation" />
          <Tab icon={<SchoolIcon />} label="School Info" />
          <Tab icon={<SliderIcon />} label="Image Slider" />
          <Tab icon={<NewsIcon />} label="News & Events" />
          <Tab icon={<ImageIcon />} label="Media & Images" />
          <Tab icon={<VideoIcon />} label="Videos" />
          <Tab icon={<ThemeIcon />} label="Theme & Layout" />
          <Tab icon={<PreviewIcon />} label="Preview" />
        </Tabs>

        {/* Header & Navigation Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Header Configuration
                  </Typography>
                  <TextField
                    fullWidth
                    label="School Name in Header"
                    value={headerSettings.schoolName}
                    onChange={(e) => handleHeaderSettingsChange('schoolName', e.target.value)}
                    sx={{ mb: 2, '& .MuiInputBase-root': { color: 'white' } }}
                  />
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={headerSettings.showLogo}
                        onChange={(e) => handleHeaderSettingsChange('showLogo', e.target.checked)}
                      />
                    }
                    label="Show School Logo"
                    sx={{ mb: 2, display: 'block' }}
                  />
                  <TextField
                    fullWidth
                    select
                    label="Logo Position"
                    value={headerSettings.logoPosition}
                    onChange={(e) => handleHeaderSettingsChange('logoPosition', e.target.value)}
                    SelectProps={{ native: true }}
                    sx={{ mb: 2, '& .MuiInputBase-root': { color: 'white' } }}
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </TextField>
                </CardContent>
              </StyledCard>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Navigation Buttons
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={headerSettings.showLoginButton}
                        onChange={(e) => handleHeaderSettingsChange('showLoginButton', e.target.checked)}
                      />
                    }
                    label="Show Login Button"
                    sx={{ mb: 1, display: 'block' }}
                  />
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={headerSettings.showRegisterButton}
                        onChange={(e) => handleHeaderSettingsChange('showRegisterButton', e.target.checked)}
                      />
                    }
                    label="Show Register Button"
                    sx={{ mb: 1, display: 'block' }}
                  />
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={headerSettings.showDashboardButton}
                        onChange={(e) => handleHeaderSettingsChange('showDashboardButton', e.target.checked)}
                      />
                    }
                    label="Show Dashboard Button"
                    sx={{ mb: 1, display: 'block' }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Header Styling
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Background Color"
                        type="color"
                        value={headerSettings.backgroundColor}
                        onChange={(e) => handleHeaderSettingsChange('backgroundColor', e.target.value)}
                        InputProps={{
                          style: { height: '56px' }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Text Color"
                        type="color"
                        value={headerSettings.textColor}
                        onChange={(e) => handleHeaderSettingsChange('textColor', e.target.value)}
                        InputProps={{
                          style: { height: '56px' }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        select
                        label="Navigation Style"
                        value={headerSettings.navigationStyle}
                        onChange={(e) => handleHeaderSettingsChange('navigationStyle', e.target.value)}
                        SelectProps={{ native: true }}
                      >
                        <option value="modern">Modern</option>
                        <option value="classic">Classic</option>
                        <option value="minimal">Minimal</option>
                      </TextField>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Website Header Logo & Branding
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Upload your school logo and set the name that will appear in the website header
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                          School Logo for Header
                        </Typography>
                        <UploadBox>
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="header-logo-upload"
                            onChange={(e) => handleFileUpload('logo', e.target.files[0])}
                          />
                          <label htmlFor="header-logo-upload">
                            <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                            <Typography variant="h6">Upload School Logo</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Recommended size: 60x60px (PNG, JPG)
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                              This logo will appear in the website header navigation
                            </Typography>
                          </label>
                          {media.logo && (
                            <Box sx={{ mt: 2 }}>
                              <Avatar src={media.logo} sx={{ width: 60, height: 60, mx: 'auto', mb: 1 }} />
                              <Typography variant="caption" color="success.main">
                                ✓ Logo uploaded successfully
                              </Typography>
                            </Box>
                          )}
                        </UploadBox>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                          Live Header Preview
                        </Typography>
                        <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, backgroundColor: '#f9f9f9' }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            This is how your header will look on the website:
                          </Typography>
                          <Box
                            sx={{
                              p: 2,
                              backgroundColor: headerSettings.backgroundColor || '#fefefe',
                              color: headerSettings.textColor || '#333',
                              borderRadius: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              minHeight: '60px',
                              border: '1px solid #e0e0e0'
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {headerSettings.showLogo && media.logo ? (
                                <Avatar src={media.logo} sx={{ width: 40, height: 40 }} />
                              ) : (
                                <SchoolIcon sx={{ fontSize: 40, color: headerSettings.textColor || '#333' }} />
                              )}
                              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                {headerSettings.schoolName || schoolInfo.name || 'SCHOOL MANAGEMENT SYSTEM'}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              {headerSettings.showLoginButton && (
                                <Button size="small" variant="outlined" sx={{
                                  color: headerSettings.textColor || '#333',
                                  borderColor: headerSettings.textColor || '#333',
                                  fontSize: '0.7rem'
                                }}>
                                  Login
                                </Button>
                              )}
                              {headerSettings.showRegisterButton && (
                                <Button size="small" variant="outlined" sx={{
                                  color: headerSettings.textColor || '#333',
                                  borderColor: headerSettings.textColor || '#333',
                                  fontSize: '0.7rem'
                                }}>
                                  Register
                                </Button>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </Box>
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
                  onClick={handleSaveHeaderSettings}
                  disabled={saving}
                  sx={{ px: 4 }}
                >
                  {saving ? 'Saving...' : 'Save Header Settings'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Image Slider Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Image Slider Management</Typography>
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
            {media.sliderImages && media.sliderImages.map((slide, index) => (
              <Grid item xs={12} md={6} lg={4} key={slide.id}>
                <Card sx={{ position: 'relative' }}>
                  <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                    <img 
                      src={slide.url} 
                      alt={slide.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=200&fit=crop';
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        display: 'flex',
                        gap: 1
                      }}
                    >
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
                      label={`#${index + 1}`}
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
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {slide.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip 
                        label={slide.active ? 'Active' : 'Inactive'} 
                        color={slide.active ? 'success' : 'default'}
                        size="small"
                      />
                      <IconButton size="small">
                        <DragIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            
            {(!media.sliderImages || media.sliderImages.length === 0) && (
              <Grid item xs={12}>
                <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
                  <SliderIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No slides added yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Add beautiful images to showcase your school campus and activities
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

        {/* School Information Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Basic Information
                  </Typography>
                  <TextField
                    fullWidth
                    label="School Name"
                    value={schoolInfo.name}
                    onChange={(e) => handleSchoolInfoChange('name', e.target.value)}
                    sx={{ mb: 2, '& .MuiInputBase-root': { color: 'white' } }}
                  />
                  <TextField
                    fullWidth
                    label="Tagline"
                    value={schoolInfo.tagline}
                    onChange={(e) => handleSchoolInfoChange('tagline', e.target.value)}
                    sx={{ mb: 2, '& .MuiInputBase-root': { color: 'white' } }}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Description"
                    value={schoolInfo.description}
                    onChange={(e) => handleSchoolInfoChange('description', e.target.value)}
                    sx={{ mb: 2, '& .MuiInputBase-root': { color: 'white' } }}
                  />
                </CardContent>
              </StyledCard>
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
                        onChange={(e) => handleSchoolInfoChange('established', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Total Students"
                        value={schoolInfo.students}
                        onChange={(e) => handleSchoolInfoChange('students', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Teachers"
                        value={schoolInfo.teachers}
                        onChange={(e) => handleSchoolInfoChange('teachers', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Achievements"
                        value={schoolInfo.achievements}
                        onChange={(e) => handleSchoolInfoChange('achievements', e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Front Page Images
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Note: To change the header logo, use the "Header & Navigation" tab above
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                          Hero Section Background
                        </Typography>
                        <UploadBox>
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="hero-upload"
                            onChange={(e) => handleFileUpload('heroImage', e.target.files[0])}
                          />
                          <label htmlFor="hero-upload">
                            <ImageIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                            <Typography>Hero Background Image</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Large background image for the hero section
                            </Typography>
                          </label>
                          {media.heroImage && (
                            <Avatar src={media.heroImage} sx={{ width: 60, height: 60, mx: 'auto', mt: 2 }} variant="rounded" />
                          )}
                        </UploadBox>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                          About Section Image
                        </Typography>
                        <UploadBox>
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="about-upload"
                            onChange={(e) => handleFileUpload('aboutImage', e.target.files[0])}
                          />
                          <label htmlFor="about-upload">
                            <ImageIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                            <Typography>About Section Image</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Image shown in the about school section
                            </Typography>
                          </label>
                          {media.aboutImage && (
                            <Avatar src={media.aboutImage} sx={{ width: 60, height: 60, mx: 'auto', mt: 2 }} variant="rounded" />
                          )}
                        </UploadBox>
                      </Box>
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

        {/* News & Events Tab */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">News & Events Management</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddNews}
            >
              Add News
            </Button>
          </Box>

          <Grid container spacing={3}>
            {news.map((item) => (
              <Grid item xs={12} md={6} key={item._id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        {item.title}
                      </Typography>
                      <Box>
                        <IconButton onClick={() => handleEditNews(item)} size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteNews(item._id)} size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {new Date(item.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {item.description}
                    </Typography>
                    <Chip 
                      label={item.published ? 'Published' : 'Draft'} 
                      color={item.published ? 'success' : 'default'}
                      size="small"
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Media & Images Tab */}
        <TabPanel value={tabValue} index={4}>
          <Typography variant="h6" gutterBottom>
            Gallery Management
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    School Gallery
                  </Typography>
                  <UploadBox sx={{ minHeight: 200, mb: 3 }}>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                      id="gallery-upload"
                      onChange={(e) => handleGalleryUpload(e.target.files)}
                    />
                    <label htmlFor="gallery-upload">
                      <ImageIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h6">Upload Gallery Images</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Select multiple images to showcase your school
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        Supported formats: JPG, PNG, GIF | Max 5MB per image
                      </Typography>
                    </label>
                  </UploadBox>

                  {media.galleryImages && media.galleryImages.length > 0 && (
                    <Box>
                      <Typography variant="subtitle1" gutterBottom>
                        Gallery Images ({media.galleryImages.length})
                      </Typography>
                      <Grid container spacing={2}>
                        {media.galleryImages.map((image, index) => (
                          <Grid item xs={6} sm={4} md={3} key={index}>
                            <Box sx={{ position: 'relative' }}>
                              <img
                                src={image}
                                alt={`Gallery ${index + 1}`}
                                style={{
                                  width: '100%',
                                  height: '120px',
                                  objectFit: 'cover',
                                  borderRadius: '8px'
                                }}
                              />
                              <IconButton
                                size="small"
                                sx={{
                                  position: 'absolute',
                                  top: 4,
                                  right: 4,
                                  backgroundColor: 'rgba(255,255,255,0.9)',
                                  '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
                                }}
                                onClick={async () => {
                                  const newImages = media.galleryImages.filter((_, i) => i !== index);
                                  setMedia(prev => ({ ...prev, galleryImages: newImages }));

                                  try {
                                    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                                    await axios.patch(`${baseUrl}/front-page/media`, { galleryImages: newImages }, {
                                      headers: token ? { Authorization: `Bearer ${token}` } : {}
                                    });
                                    setSnackbar({ open: true, message: 'Image deleted successfully!', severity: 'success' });
                                    triggerFrontPageRefresh();
                                  } catch (error) {
                                    console.error('Error deleting image:', error);
                                    setSnackbar({ open: true, message: 'Error deleting image', severity: 'error' });
                                  }
                                }}
                              >
                                <DeleteIcon fontSize="small" color="error" />
                              </IconButton>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}

                  {(!media.galleryImages || media.galleryImages.length === 0) && (
                    <Alert severity="info">
                      No gallery images uploaded yet. Add some beautiful images to showcase your school!
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Videos Tab */}
        <TabPanel value={tabValue} index={5}>
          <Typography variant="h6" gutterBottom>
            Video Management
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Hero Video
                  </Typography>
                  <UploadBox sx={{ mb: 2 }}>
                    <input
                      type="file"
                      accept="video/*"
                      style={{ display: 'none' }}
                      id="hero-video-upload"
                      onChange={(e) => handleFileUpload('heroVideo', e.target.files[0])}
                    />
                    <label htmlFor="hero-video-upload">
                      <VideoIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                      <Typography>Upload Hero Video</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Max size: 50MB | MP4, WebM, MOV
                      </Typography>
                    </label>
                  </UploadBox>
                  {media.heroVideo && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                      <Typography variant="body2" color="success.main">
                        ✓ Hero video uploaded successfully
                      </Typography>
                      <video
                        src={media.heroVideo}
                        style={{ width: '100%', maxHeight: '200px', marginTop: '8px' }}
                        controls
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Virtual Tour
                  </Typography>
                  <TextField
                    fullWidth
                    label="YouTube/Vimeo URL"
                    placeholder="https://youtube.com/watch?v=..."
                    value={media.virtualTour || ''}
                    onChange={(e) => setMedia(prev => ({ ...prev, virtualTour: e.target.value }))}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => handleVideoUrlSave('virtualTour', media.virtualTour)}
                    disabled={!media.virtualTour}
                  >
                    Save Virtual Tour URL
                  </Button>
                  {media.virtualTour && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                      <Typography variant="body2" color="success.main">
                        ✓ Virtual tour URL saved
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {media.virtualTour}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Additional Video Content
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle1" gutterBottom>
                          School Promotional Video
                        </Typography>
                        <UploadBox>
                          <input
                            type="file"
                            accept="video/*"
                            style={{ display: 'none' }}
                            id="promo-video-upload"
                            onChange={(e) => handleFileUpload('promoVideo', e.target.files[0])}
                          />
                          <label htmlFor="promo-video-upload">
                            <VideoIcon sx={{ fontSize: 36, color: 'primary.main', mb: 1 }} />
                            <Typography variant="body2">Upload Promotional Video</Typography>
                          </label>
                        </UploadBox>
                        {media.promoVideo && (
                          <Box sx={{ mt: 1, p: 1, bgcolor: 'success.light', borderRadius: 1 }}>
                            <Typography variant="caption" color="success.dark">
                              ✓ Promotional video uploaded
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle1" gutterBottom>
                          Campus Tour Video
                        </Typography>
                        <UploadBox>
                          <input
                            type="file"
                            accept="video/*"
                            style={{ display: 'none' }}
                            id="campus-video-upload"
                            onChange={(e) => handleFileUpload('campusVideo', e.target.files[0])}
                          />
                          <label htmlFor="campus-video-upload">
                            <VideoIcon sx={{ fontSize: 36, color: 'primary.main', mb: 1 }} />
                            <Typography variant="body2">Upload Campus Tour</Typography>
                          </label>
                        </UploadBox>
                        {media.campusVideo && (
                          <Box sx={{ mt: 1, p: 1, bgcolor: 'success.light', borderRadius: 1 }}>
                            <Typography variant="caption" color="success.dark">
                              ✓ Campus tour video uploaded
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Theme & Layout Tab */}
        <TabPanel value={tabValue} index={6}>
          <Typography variant="h6" gutterBottom>
            Theme Customization
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Color Scheme
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Choose your school's primary color theme
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    {[
                      { color: '#667eea', name: 'Royal Blue' },
                      { color: '#f093fb', name: 'Pink Gradient' },
                      { color: '#4facfe', name: 'Sky Blue' },
                      { color: '#43e97b', name: 'Green Fresh' },
                      { color: '#fa709a', name: 'Coral Pink' },
                      { color: '#ffecd2', name: 'Warm Orange' }
                    ].map((colorItem) => (
                      <Box
                        key={colorItem.color}
                        onClick={() => setTheme(prev => ({ ...prev, primaryColor: colorItem.color }))}
                        sx={{
                          width: 60,
                          height: 60,
                          backgroundColor: colorItem.color,
                          borderRadius: 2,
                          cursor: 'pointer',
                          border: theme.primaryColor === colorItem.color ? '3px solid #333' : '2px solid transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            border: '3px solid #333',
                            transform: 'scale(1.05)'
                          }
                        }}
                      >
                        {theme.primaryColor === colorItem.color && (
                          <Typography variant="caption" color="white" sx={{ fontWeight: 'bold' }}>
                            ✓
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                  <TextField
                    fullWidth
                    label="Custom Primary Color"
                    type="color"
                    value={theme.primaryColor}
                    onChange={(e) => setTheme(prev => ({ ...prev, primaryColor: e.target.value }))}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Secondary Color"
                    type="color"
                    value={theme.secondaryColor}
                    onChange={(e) => setTheme(prev => ({ ...prev, secondaryColor: e.target.value }))}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Layout Options
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Control which sections appear on your front page
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={theme.showStatistics}
                        onChange={(e) => setTheme(prev => ({ ...prev, showStatistics: e.target.checked }))}
                      />
                    }
                    label="Show Statistics Section"
                    sx={{ display: 'block', mb: 1 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={theme.showNews}
                        onChange={(e) => setTheme(prev => ({ ...prev, showNews: e.target.checked }))}
                      />
                    }
                    label="Show News & Events Section"
                    sx={{ display: 'block', mb: 1 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={theme.showPrograms}
                        onChange={(e) => setTheme(prev => ({ ...prev, showPrograms: e.target.checked }))}
                      />
                    }
                    label="Show Programs Section"
                    sx={{ display: 'block', mb: 1 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={theme.showGallery || false}
                        onChange={(e) => setTheme(prev => ({ ...prev, showGallery: e.target.checked }))}
                      />
                    }
                    label="Show Gallery Section"
                    sx={{ display: 'block', mb: 1 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={theme.showVideos || false}
                        onChange={(e) => setTheme(prev => ({ ...prev, showVideos: e.target.checked }))}
                      />
                    }
                    label="Show Video Section"
                    sx={{ display: 'block', mb: 3 }}
                  />
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<SaveIcon />}
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                        await axios.patch(`${baseUrl}/front-page/theme`, theme, {
                          headers: token ? { Authorization: `Bearer ${token}` } : {}
                        });
                        setSnackbar({ open: true, message: 'Theme settings saved successfully!', severity: 'success' });
                        triggerFrontPageRefresh();
                      } catch (error) {
                        console.error('Error saving theme:', error);
                        setSnackbar({ open: true, message: 'Error saving theme settings', severity: 'error' });
                      }
                    }}
                  >
                    Save Theme Settings
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Theme Preview
                  </Typography>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`,
                      color: 'white',
                      textAlign: 'center'
                    }}
                  >
                    <Typography variant="h4" gutterBottom>
                      {schoolInfo.name || 'Your School Name'}
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                      {schoolInfo.tagline || 'Nurturing Tomorrow\'s Leaders'}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 3 }}>
                      {theme.showStatistics && (
                        <Box>
                          <Typography variant="h5" fontWeight="bold">
                            {schoolInfo.students || '2,500+'}
                          </Typography>
                          <Typography variant="body2">Students</Typography>
                        </Box>
                      )}
                      <Box>
                        <Typography variant="h5" fontWeight="bold">
                          {schoolInfo.teachers || '150+'}
                        </Typography>
                        <Typography variant="body2">Teachers</Typography>
                      </Box>
                      <Box>
                        <Typography variant="h5" fontWeight="bold">
                          {schoolInfo.established || '1995'}
                        </Typography>
                        <Typography variant="body2">Established</Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Preview Tab */}
        <TabPanel value={tabValue} index={7}>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h4" gutterBottom>
              Front Page Preview
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              See how your front page will look to visitors
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Desktop Preview
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<PreviewIcon />}
                      onClick={() => window.open('/', '_blank')}
                      fullWidth
                      sx={{ mb: 2 }}
                    >
                      Open Live Preview
                    </Button>
                    <Typography variant="body2" color="text.secondary">
                      View your front page as it appears on desktop computers
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Mobile Preview
                    </Typography>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<PreviewIcon />}
                      onClick={() => {
                        const url = window.location.origin;
                        const mobileUrl = `${url}?mobile=true`;
                        window.open(mobileUrl, '_blank');
                      }}
                      fullWidth
                      sx={{ mb: 2 }}
                    >
                      Preview Mobile View
                    </Button>
                    <Typography variant="body2" color="text.secondary">
                      See how your front page looks on mobile devices
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
              <Typography variant="subtitle2" gutterBottom>
                Preview Tips:
              </Typography>
              <Typography variant="body2">
                • Make sure to save your changes before previewing<br/>
                • The preview shows the public view without admin controls<br/>
                • Test on different devices and screen sizes for best results
              </Typography>
            </Alert>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<SaveIcon />}
                onClick={() => {
                  // Save all current settings
                  handleSaveSchoolInfo();
                }}
              >
                Save All Changes
              </Button>
              <Button
                variant="outlined"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
            </Box>
          </Box>
        </TabPanel>
      </Paper>

      {/* News Dialog */}
      <NewsDialog
        open={openNewsDialog}
        onClose={() => setOpenNewsDialog(false)}
        onSave={handleSaveNews}
        editingNews={editingNews}
      />

      {/* Slider Dialog */}
      <SliderDialog
        open={openSliderDialog}
        onClose={() => setOpenSliderDialog(false)}
        onSave={handleSaveSlide}
        editingSlider={editingSlider}
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

export default FrontPageManagement;
