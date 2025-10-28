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
  IconButton,
  Chip,
  Avatar,
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
  School as SchoolIcon,
  Palette as ThemeIcon,
  Navigation as NavigationIcon,
  Slideshow as SliderIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { baseUrl } from '../../../environment';
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
  background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%)',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    transform: 'scale(1.02)',
    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.15)'
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

  // Media State (for slider)
  const [sliderImages, setSliderImages] = useState([]);

  // Logo state
  const [logo, setLogo] = useState(null);

  // Header & Navigation State
  const [headerSettings, setHeaderSettings] = useState({
    siteName: '',
    showLoginButton: true,
    showRegisterButton: true,
    backgroundColor: '#ffffff',
    textColor: '#333333'
  });

  // Dialog States
  const [openSliderDialog, setOpenSliderDialog] = useState(false);
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

      console.log('📥 Fetching public home page data...');
      const response = await axios.get(`${baseUrl}/public-home/data`, { headers });

      if (response.data.success) {
        const data = response.data.data;
        console.log('✅ Data received:', data);

        // Map data from public-home API structure
        setSchoolInfo({
          name: data.heroSection?.title || 'GenTime',
          tagline: data.heroSection?.subtitle || 'Modern School Management System',
          description: data.heroSection?.description || '',
          established: data.statistics?.stats?.find(s => s.label === 'Established')?.value || '1995',
          students: data.statistics?.stats?.find(s => s.label === 'Students')?.value || '5,000+',
          teachers: data.statistics?.stats?.find(s => s.label === 'Teachers')?.value || '200+',
          achievements: data.statistics?.stats?.find(s => s.label === 'Success Rate')?.value || '95%'
        });

        setSliderImages(data.slider?.slides || []);
        setLogo(data.header?.logo || null);
        setHeaderSettings({
          siteName: data.header?.siteName || 'GenTime',
          showLoginButton: data.header?.showLoginButton !== false,
          showRegisterButton: data.header?.showRegisterButton !== false,
          backgroundColor: data.header?.backgroundColor || '#ffffff',
          textColor: data.header?.textColor || '#333333'
        });

        console.log('✅ Loaded slider:', data.slider?.slides?.length || 0, 'slides');
        console.log('✅ Loaded logo:', data.header?.logo ? 'Yes' : 'No');
      }
    } catch (error) {
      console.error('❌ Error fetching front page data:', error);
      setSnackbar({
        open: true,
        message: 'Error loading front page data: ' + (error.response?.data?.message || error.message),
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

  const handleSaveSchoolInfo = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      console.log('💾 Saving school info...');

      // Save to hero-section endpoint
      const heroResponse = await axios.patch(`${baseUrl}/public-home/hero-section`, {
        title: schoolInfo.name || 'GenTime',
        subtitle: schoolInfo.tagline || 'Modern School Management System',
        description: schoolInfo.description || 'A comprehensive platform for managing schools.'
      }, { headers });

      // Save statistics
      const statsResponse = await axios.patch(`${baseUrl}/public-home/statistics`, {
        showSection: true,
        stats: [
          { label: 'Students', value: schoolInfo.students || '5,000+', icon: 'students' },
          { label: 'Teachers', value: schoolInfo.teachers || '200+', icon: 'teachers' },
          { label: 'Established', value: schoolInfo.established || '1995', icon: 'calendar' },
          { label: 'Success Rate', value: schoolInfo.achievements || '95%', icon: 'success' }
        ]
      }, { headers });

      if (heroResponse.data.success && statsResponse.data.success) {
        console.log('✅ School info saved successfully');
        setSnackbar({ open: true, message: 'School information updated successfully!', severity: 'success' });
        fetchFrontPageData(); // Refresh data
      }
    } catch (error) {
      console.error('❌ Error saving school info:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error saving school information',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (file) => {
    if (!file) return;

    try {
      setSaving(true);
      console.log('📤 Uploading logo...');

      // Convert to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64Logo = e.target.result;

          const token = localStorage.getItem('token') || sessionStorage.getItem('token');
          const headers = token ? { Authorization: `Bearer ${token}` } : {};

          const response = await axios.patch(`${baseUrl}/public-home/header`, {
            logo: base64Logo,
            siteName: headerSettings.siteName || 'GenTime'
          }, { headers });

          if (response.data.success) {
            console.log('✅ Logo uploaded successfully');
            setLogo(base64Logo);
            setSnackbar({ open: true, message: 'Logo uploaded successfully!', severity: 'success' });
            fetchFrontPageData();
          }
        } catch (error) {
          console.error('❌ Error uploading logo:', error);
          setSnackbar({
            open: true,
            message: error.response?.data?.message || 'Error uploading logo',
            severity: 'error'
          });
        } finally {
          setSaving(false);
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('❌ Error processing logo:', error);
      setSnackbar({ open: true, message: 'Error processing logo file', severity: 'error' });
      setSaving(false);
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
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      console.log('💾 Saving header settings...');

      const response = await axios.patch(`${baseUrl}/public-home/header`, {
        siteName: headerSettings.siteName || 'GenTime',
        logo: logo,
        showLoginButton: headerSettings.showLoginButton,
        showRegisterButton: headerSettings.showRegisterButton,
        backgroundColor: headerSettings.backgroundColor,
        textColor: headerSettings.textColor
      }, { headers });

      if (response.data.success) {
        console.log('✅ Header settings saved successfully');
        setSnackbar({ open: true, message: 'Header settings updated successfully!', severity: 'success' });
        fetchFrontPageData();
      }
    } catch (error) {
      console.error('❌ Error saving header settings:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error saving header settings',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSlide = async (slideId) => {
    try {
      console.log('🗑️ Deleting slide:', slideId);

      const updatedSlides = sliderImages.filter(slide => slide.id !== slideId);
      setSliderImages(updatedSlides);

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.patch(`${baseUrl}/public-home/slider`, {
        showSlider: true,
        slides: updatedSlides
      }, { headers });

      if (response.data.success) {
        console.log('✅ Slide deleted successfully');
        setSnackbar({ open: true, message: 'Slide deleted successfully!', severity: 'success' });
        fetchFrontPageData();
      }
    } catch (error) {
      console.error('❌ Error deleting slide:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error deleting slide',
        severity: 'error'
      });
    }
  };

  const handleSaveSlide = async (slideData) => {
    try {
      console.log('💾 Saving slide:', slideData);

      let updatedSlides;
      if (editingSlider) {
        updatedSlides = sliderImages.map(slide =>
          slide.id === editingSlider.id ? slideData : slide
        );
      } else {
        updatedSlides = [...sliderImages, slideData];
      }

      console.log('📤 Sending', updatedSlides.length, 'slides to API');
      setSliderImages(updatedSlides);

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.patch(`${baseUrl}/public-home/slider`, {
        showSlider: true,
        slides: updatedSlides
      }, { headers });

      if (response.data.success) {
        console.log('✅ Slide saved successfully');
        setSnackbar({ open: true, message: 'Slide saved successfully!', severity: 'success' });
        setOpenSliderDialog(false);
        setEditingSlider(null);
        fetchFrontPageData();
      }
    } catch (error) {
      console.error('❌ Error saving slide:', error);
      console.error('Error details:', error.response?.data);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error saving slide',
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
          🎨 Home Page Management
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Complete control of your website's home page
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
            }
          }}
        >
          <Tab icon={<NavigationIcon />} label="Header & Logo" />
          <Tab icon={<SchoolIcon />} label="School Info" />
          <Tab icon={<SliderIcon />} label="Hero Slider" />
          <Tab icon={<PreviewIcon />} label="Preview" />
        </Tabs>

        {/* Header & Logo Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  ℹ️ Header Settings Control:
                </Typography>
                <Typography variant="body2">
                  • Logo appears in navigation bar<br/>
                  • Site name appears next to logo<br/>
                  • Changes apply immediately to live website
                </Typography>
              </Alert>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Website Logo
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Upload your school logo (appears in header navigation)
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
                    <label htmlFor="logo-upload" style={{ cursor: saving ? 'not-allowed' : 'pointer' }}>
                      {saving ? (
                        <CircularProgress size={48} sx={{ mb: 1 }} />
                      ) : (
                        <>
                          <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                          <Typography variant="h6">Upload Logo</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Recommended: 60x60px (PNG, JPG)
                          </Typography>
                        </>
                      )}
                    </label>
                    {logo && !saving && (
                      <Box sx={{ mt: 2 }}>
                        <Avatar src={logo} sx={{ width: 60, height: 60, mx: 'auto', mb: 1 }} />
                        <Typography variant="caption" color="success.main">
                          ✓ Logo uploaded
                        </Typography>
                      </Box>
                    )}
                  </UploadBox>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Header Settings
                  </Typography>
                  <TextField
                    fullWidth
                    label="Site Name"
                    value={headerSettings.siteName}
                    onChange={(e) => handleHeaderSettingsChange('siteName', e.target.value)}
                    sx={{ mb: 2 }}
                    helperText="Appears in header next to logo"
                  />
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
                    sx={{ mb: 2, display: 'block' }}
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Background Color"
                        type="color"
                        value={headerSettings.backgroundColor}
                        onChange={(e) => handleHeaderSettingsChange('backgroundColor', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Text Color"
                        type="color"
                        value={headerSettings.textColor}
                        onChange={(e) => handleHeaderSettingsChange('textColor', e.target.value)}
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

        {/* School Info Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  ℹ️ School Information Control:
                </Typography>
                <Typography variant="body2">
                  • Name, tagline & description appear in hero section<br/>
                  • Statistics show in stats cards on home page<br/>
                  • All changes sync to live website immediately
                </Typography>
              </Alert>
            </Grid>

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
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Tagline"
                    value={schoolInfo.tagline}
                    onChange={(e) => handleSchoolInfoChange('tagline', e.target.value)}
                    sx={{ mb: 2 }}
                    helperText="Short catchy phrase about your school"
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Description"
                    value={schoolInfo.description}
                    onChange={(e) => handleSchoolInfoChange('description', e.target.value)}
                  />
                </CardContent>
              </StyledCard>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Statistics (Show on Home Page)
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
                        label="Success Rate"
                        value={schoolInfo.achievements}
                        onChange={(e) => handleSchoolInfoChange('achievements', e.target.value)}
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

        {/* Hero Slider Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Hero Slider Management</Typography>
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

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              ℹ️ Hero Slider Features:
            </Typography>
            <Typography variant="body2">
              • Full-width beautiful slider with Ken Burns effect<br/>
              • Title and description are OPTIONAL (can be left blank)<br/>
              • Supports images and videos<br/>
              • Auto-advances every 5 seconds<br/>
              • Navigation arrows and dots for manual control
            </Typography>
          </Alert>

          <Grid container spacing={3}>
            {sliderImages && sliderImages.map((slide, index) => (
              <Grid item xs={12} md={6} lg={4} key={slide.id}>
                <Card sx={{ position: 'relative' }}>
                  <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                    {slide.type === 'video' ? (
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white'
                        }}
                      >
                        <VideoIcon sx={{ fontSize: 64 }} />
                      </Box>
                    ) : (
                      <img
                        src={slide.url}
                        alt={slide.title || `Slide ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=200&fit=crop';
                        }}
                      />
                    )}
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
                      {slide.title || `Slide ${index + 1}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {slide.description || 'No description'}
                    </Typography>
                    <Chip
                      label={slide.active ? 'Active' : 'Inactive'}
                      color={slide.active ? 'success' : 'default'}
                      size="small"
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {(!sliderImages || sliderImages.length === 0) && (
              <Grid item xs={12}>
                <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
                  <SliderIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No slides added yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Add beautiful images to showcase your school
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

        {/* Preview Tab */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h4" gutterBottom>
              Preview Your Home Page
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              See how your home page looks to visitors
            </Typography>

            <Button
              variant="contained"
              size="large"
              startIcon={<PreviewIcon />}
              onClick={() => window.open('/home', '_blank')}
              sx={{ mb: 3 }}
            >
              Open Live Preview
            </Button>

            <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
              <Typography variant="subtitle2" gutterBottom>
                Preview Tips:
              </Typography>
              <Typography variant="body2">
                • Save your changes before previewing<br/>
                • Clear browser cache (Ctrl+Shift+Delete) to see latest changes<br/>
                • Or use Incognito/Private window for fresh view
              </Typography>
            </Alert>
          </Box>
        </TabPanel>
      </Paper>

      {/* Slider Dialog */}
      <SliderDialog
        open={openSliderDialog}
        onClose={() => {
          setOpenSliderDialog(false);
          setEditingSlider(null);
        }}
        onSave={handleSaveSlide}
        editingSlider={editingSlider}
      />

      {/* Snackbar for notifications */}
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
