import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ViewCarousel as SliderIcon,
  BarChart as StatsIcon,
  Info as InfoIcon,
  VideoLibrary as VideoIcon,
  PhotoLibrary as GalleryIcon,
  School as ProgramIcon,
  Star as StarIcon,
  RateReview as TestimonialIcon,
  Palette as ThemeIcon,
  Visibility as VisibilityIcon,
  Search as SeoIcon
} from '@mui/icons-material';
import axios from 'axios';
import { Environment } from '../../../environment';

// Import section components
import HeaderSection from './sections/HeaderSection';
import SliderSection from './sections/SliderSection';
import StatisticsSection from './sections/StatisticsSection';
import AboutSection from './sections/AboutSection';
import ExploreCampusSection from './sections/ExploreCampusSection';
import NewsSection from './sections/NewsSection';
import VideoSection from './sections/VideoSection';
import GallerySection from './sections/GallerySection';
import ProgramsSection from './sections/ProgramsSection';
import WhyChooseUsSection from './sections/WhyChooseUsSection';
import TestimonialsSection from './sections/TestimonialsSection';
import SectionVisibilityControl from './sections/SectionVisibilityControl';
import SEOSection from './sections/SEOSection';

const HomePageManagement = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [homePageData, setHomePageData] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const schoolId = JSON.parse(localStorage.getItem('loginData'))?.school_id;

  useEffect(() => {
    fetchHomePageContent();
  }, []);

  const fetchHomePageContent = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${Environment.BaseURL}/api/home-page-content/${schoolId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setHomePageData(response.data.data);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        // Initialize with default data if not found
        initializeDefaultData();
      } else {
        showSnackbar('Error loading home page content', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaultData = async () => {
    const defaultData = {
      header: {
        schoolName: 'Your School Name',
        tagline: 'Excellence in Education',
        primaryColor: '#667eea',
        secondaryColor: '#764ba2',
        accentColor: '#f093fb',
        fontFamily: 'Roboto, sans-serif',
        contactEmail: 'info@school.com',
        contactPhone: '+1234567890',
        address: 'School Address',
        socialMedia: {
          facebook: '',
          twitter: '',
          instagram: '',
          youtube: '',
          linkedin: ''
        }
      },
      sliders: [],
      statistics: [
        { icon: 'school', value: 1, label: 'Schools', suffix: '+', order: 1 },
        { icon: 'people', value: 0, label: 'Students', suffix: '+', order: 2 },
        { icon: 'person', value: 0, label: 'Teachers', suffix: '+', order: 3 },
        { icon: 'emoji_events', value: 100, label: 'Success Rate', suffix: '%', order: 4 }
      ],
      about: {
        heading: 'About Our School',
        subheading: 'Nurturing Excellence Since Year',
        description: 'Write your school description here...',
        images: [],
        mission: 'Our mission statement',
        vision: 'Our vision statement',
        values: []
      },
      exploreCampus: {
        heading: 'Explore Our Campus',
        description: 'Discover our world-class facilities',
        images: [],
        virtualTourLink: '',
        brochureLink: ''
      },
      news: [],
      videos: [],
      gallery: [],
      programs: [],
      whyChooseUs: {
        heading: 'Why Choose Us',
        description: 'Discover what makes us special',
        features: []
      },
      testimonials: {
        heading: 'What Parents Say',
        description: 'Hear from our parent community',
        items: []
      },
      sectionVisibility: {
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
      },
      seo: {
        metaTitle: 'Your School Name',
        metaDescription: 'Welcome to our school',
        metaKeywords: [],
        ogImage: ''
      },
      isPublished: true
    };

    try {
      const response = await axios.post(
        `${Environment.BaseURL}/api/home-page-content/${schoolId}`,
        defaultData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setHomePageData(response.data.data);
        showSnackbar('Default home page content initialized', 'success');
      }
    } catch (error) {
      showSnackbar('Error initializing home page content', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const updateHomePageData = (section, data) => {
    setHomePageData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const saveSection = async (endpoint, data, successMessage) => {
    try {
      setSaving(true);
      const response = await axios.put(
        `${Environment.BaseURL}/api/home-page-content/${schoolId}${endpoint}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        showSnackbar(successMessage, 'success');
        await fetchHomePageContent(); // Refresh data
        return true;
      }
    } catch (error) {
      showSnackbar('Error saving data: ' + (error.response?.data?.message || error.message), 'error');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { label: 'Header & Theme', icon: <ThemeIcon />, component: HeaderSection },
    { label: 'Hero Slider', icon: <SliderIcon />, component: SliderSection },
    { label: 'Statistics', icon: <StatsIcon />, component: StatisticsSection },
    { label: 'About Us', icon: <InfoIcon />, component: AboutSection },
    { label: 'Explore Campus', icon: <DashboardIcon />, component: ExploreCampusSection },
    { label: 'News & Events', icon: <InfoIcon />, component: NewsSection },
    { label: 'Videos', icon: <VideoIcon />, component: VideoSection },
    { label: 'Gallery', icon: <GalleryIcon />, component: GallerySection },
    { label: 'Programs', icon: <ProgramIcon />, component: ProgramsSection },
    { label: 'Why Choose Us', icon: <StarIcon />, component: WhyChooseUsSection },
    { label: 'Testimonials', icon: <TestimonialIcon />, component: TestimonialsSection },
    { label: 'Section Visibility', icon: <VisibilityIcon />, component: SectionVisibilityControl },
    { label: 'SEO Settings', icon: <SeoIcon />, component: SEOSection }
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const CurrentSectionComponent = tabs[currentTab].component;

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Typography variant="h4" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
          Home Page Management
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
          Complete control over your school's public home page
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ mt: 3 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 72,
              textTransform: 'none',
              fontWeight: 600
            }
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>

        <Box sx={{ p: 3 }}>
          {homePageData && (
            <CurrentSectionComponent
              data={homePageData}
              updateData={updateHomePageData}
              saveSection={saveSection}
              showSnackbar={showSnackbar}
              schoolId={schoolId}
              saving={saving}
            />
          )}
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default HomePageManagement;
