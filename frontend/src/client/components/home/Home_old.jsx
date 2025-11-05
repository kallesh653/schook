import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Card, CardContent, Box, Paper,
  Button, Chip, Avatar, IconButton, Fade, Zoom
} from '@mui/material';
import {
  School as SchoolIcon,
  EmojiEvents as AwardIcon,
  Groups as StudentsIcon,
  MenuBook as BookIcon,
  Star as StarIcon,
  PlayArrow as PlayIcon,
  ArrowForward as ArrowIcon,
  GetApp as DownloadIcon,
  Login as LoginIcon,
  WhatsApp as WhatsAppIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  KeyboardArrowUp as ArrowUpIcon
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import Carousel from './carousel/Carousel';
import ImageSlider from './ImageSlider';
import BeautifulSlider from './BeautifulSlider';
import axios from 'axios';
import { baseUrl } from '../../../environment';
import { useNavigate } from 'react-router-dom';

// Advanced CSS animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const slideInLeft = keyframes`
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const slideInRight = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const bounceIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
`;

const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(60px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Styled components with advanced CSS
const StyledContainer = styled(Container)(({ theme }) => ({
  background: '#fefefe',
  minHeight: '100vh',
  padding: 0,
  maxWidth: 'none !important',
  width: '100%'
}));

const HeroSection = styled(Box)(({ theme, primaryColor, secondaryColor }) => ({
  background: primaryColor && secondaryColor
    ? `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  color: 'white'
}));

const FloatingCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '24px',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
    transition: 'left 0.5s'
  },
  '&:hover': {
    transform: 'translateY(-12px) scale(1.03)',
    boxShadow: '0 24px 48px rgba(0,0,0,0.12)',
    background: 'rgba(255, 255, 255, 1)',
    '&::before': {
      left: '100%'
    }
  }
}));

const GradientText = styled(Typography)(({ theme, isHero }) => ({
  color: isHero ? 'white' : '#333',
  fontWeight: 700
}));

const AnimatedSection = styled(Box)(({ theme }) => ({
  animation: `${slideInLeft} 1s ease-out`
}));

const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  background: '#fff',
  color: '#333',
  borderRadius: '15px',
  border: '1px solid #e0e0e0',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
  }
}));

const Home = () => {
  const navigate = useNavigate();

  const [animatedStats, setAnimatedStats] = useState({
    students: 0,
    teachers: 0,
    achievements: 0
  });

  const [showBackToTop, setShowBackToTop] = useState(false);

  const [schoolInfo, setSchoolInfo] = useState({
    name: '',
    tagline: '',
    description: '',
    established: '',
    students: '',
    teachers: '',
    achievements: ''
  });

  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

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

  const [theme, setTheme] = useState({
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    showStatistics: true,
    showNews: true,
    showPrograms: true,
    showGallery: false,
    showVideos: false
  });

  const [latestNews, setLatestNews] = useState([]);

  const [sliderImages, setSliderImages] = useState([]);
  const [combinedSlides, setCombinedSlides] = useState([]);
  const [socialMedia, setSocialMedia] = useState({
    whatsapp: '',
    instagram: '',
    twitter: ''
  });

  // Function to fetch PUBLIC home page data (NOT school-specific)
  const fetchFrontPageData = async () => {
    try {
      // Fetch PUBLIC home page (shows "GenTime")
      const publicResponse = await axios.get(`${baseUrl}/public-home/data`);

      if (publicResponse.data.success) {
        const data = publicResponse.data.data;
        console.log('✅ Loaded PUBLIC home page data');

        // Set school info from hero section and statistics
        const stats = data.statistics?.stats || [];
        setSchoolInfo({
          name: data.header?.siteName || 'GenTime',
          tagline: data.heroSection?.subtitle || 'Modern School Management Platform',
          description: data.heroSection?.description || 'A comprehensive platform for managing students, teachers, classes, and more.',
          established: stats.find(s => s.label === 'Schools')?.value || '100+',
          students: stats.find(s => s.label === 'Students')?.value || '10,000+',
          teachers: stats.find(s => s.label === 'Teachers')?.value || '1,000+',
          achievements: stats.find(s => s.label === 'Success Rate')?.value || '95%'
        });

        // Set news from announcements
        if (data.announcements?.items) {
          setLatestNews(data.announcements.items.filter(item => item.published));
        }

        // Set media
        setMedia(prev => ({
          ...prev,
          heroImage: data.heroSection?.backgroundImage,
          logo: data.header?.logo
        }));

        // Set slider
        if (data.slider?.slides) {
          const activeSlides = data.slider.slides.filter(s => s.active);
          setSliderImages(activeSlides);

          // Prepare combined slides
          const slides = activeSlides.map(slide => ({
            id: slide.id,
            type: slide.type || 'image',
            url: slide.url,
            title: slide.title,
            description: slide.description
          }));

          setCombinedSlides(slides);
        }

        // Set theme
        if (data.theme) {
          setTheme(prev => ({
            ...prev,
            primaryColor: data.theme.primaryColor,
            secondaryColor: data.theme.secondaryColor,
            showStatistics: data.statistics?.showSection !== false
          }));
        }

        // Set social media links
        if (data.socialMedia) {
          setSocialMedia({
            whatsapp: data.socialMedia.whatsapp || '',
            instagram: data.socialMedia.instagram || '',
            twitter: data.socialMedia.twitter || ''
          });
        }
      }
    } catch (error) {
      console.error('❌ Error fetching public home page data:', error);
    }
  };

  // Fetch front page data on mount and set up polling for updates
  useEffect(() => {
    fetchFrontPageData();

    // Set up polling to check for updates every 30 seconds
    const pollInterval = setInterval(() => {
      fetchFrontPageData();
    }, 30000);

    // Listen for focus events to refresh when user returns to tab
    const handleFocus = () => {
      fetchFrontPageData();
    };

    window.addEventListener('focus', handleFocus);

    // Listen for custom refresh event (can be triggered from admin panel)
    const handleRefresh = () => {
      fetchFrontPageData();
    };

    window.addEventListener('frontpage-refresh', handleRefresh);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('frontpage-refresh', handleRefresh);
    };
  }, []);

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // PWA Install Handler
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show install button
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Handle PWA Install
  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback for iOS or already installed
      alert('To install GenTime:\n\niOS: Tap Share button → Add to Home Screen\n\nAndroid: This app is already installed or your browser does not support installation');
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }

    // Clear the deferred prompt
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>

      {/* Beautiful Full-Width Slider with Images and Videos */}
      <BeautifulSlider slides={combinedSlides} />

      {/* Student Login Button - Floating (always visible on mobile and desktop) */}
      <Zoom in timeout={1000}>
        <Box
          sx={{
            position: 'fixed',
            bottom: { xs: 20, md: 40 },
            left: { xs: 20, md: 40 },
            zIndex: 1000,
          }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/student-login')}
            startIcon={<LoginIcon />}
            sx={{
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              borderRadius: '50px',
              px: { xs: 3, md: 4 },
              py: 1.5,
              fontSize: { xs: '0.9rem', md: '1.1rem' },
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 8px 25px rgba(67, 233, 123, 0.5)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-3px) scale(1.05)',
                boxShadow: '0 12px 35px rgba(67, 233, 123, 0.6)',
                background: 'linear-gradient(135deg, #38f9d7 0%, #43e97b 100%)',
              },
              animation: `${pulse} 2s infinite`,
            }}
          >
            Student Login
          </Button>
        </Box>
      </Zoom>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Zoom in timeout={300}>
          <IconButton
            onClick={scrollToTop}
            sx={{
              position: 'fixed',
              bottom: { xs: 90, md: 120 },
              right: { xs: 20, md: 40 },
              zIndex: 1000,
              background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`,
              color: 'white',
              width: { xs: 50, md: 60 },
              height: { xs: 50, md: 60 },
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.5)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px) scale(1.1)',
                boxShadow: '0 12px 35px rgba(102, 126, 234, 0.6)',
              },
            }}
          >
            <ArrowUpIcon sx={{ fontSize: { xs: 28, md: 32 } }} />
          </IconButton>
        </Zoom>
      )}

      {/* Download App Button - Floating */}
      {showInstallButton && (
        <Zoom in timeout={1000}>
          <Box
            sx={{
              position: 'fixed',
              bottom: { xs: 20, md: 40 },
              right: { xs: 20, md: 40 },
              zIndex: 1000,
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={handleInstallClick}
              startIcon={<DownloadIcon />}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50px',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.5)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-3px) scale(1.05)',
                  boxShadow: '0 12px 35px rgba(102, 126, 234, 0.6)',
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                },
                animation: `${pulse} 2s infinite`,
              }}
            >
              Download App
            </Button>
          </Box>
        </Zoom>
      )}

      {/* Social Media Icons - Floating on right side */}
      {(socialMedia.whatsapp || socialMedia.instagram || socialMedia.twitter) && (
        <Zoom in timeout={1200}>
          <Box
            sx={{
              position: 'fixed',
              right: { xs: 15, md: 30 },
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              zIndex: 999,
            }}
          >
            {socialMedia.whatsapp && (
              <IconButton
                component="a"
                href={socialMedia.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  bgcolor: '#25D366',
                  color: 'white',
                  width: { xs: 48, md: 56 },
                  height: { xs: 48, md: 56 },
                  boxShadow: '0 4px 15px rgba(37, 211, 102, 0.4)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: '#128C7E',
                    transform: 'translateX(-5px) scale(1.1)',
                    boxShadow: '0 6px 20px rgba(37, 211, 102, 0.6)',
                  },
                }}
              >
                <WhatsAppIcon sx={{ fontSize: { xs: 24, md: 28 } }} />
              </IconButton>
            )}
            {socialMedia.instagram && (
              <IconButton
                component="a"
                href={socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  background: 'linear-gradient(135deg, #E4405F 0%, #C13584 100%)',
                  color: 'white',
                  width: { xs: 48, md: 56 },
                  height: { xs: 48, md: 56 },
                  boxShadow: '0 4px 15px rgba(228, 64, 95, 0.4)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #C13584 0%, #833AB4 100%)',
                    transform: 'translateX(-5px) scale(1.1)',
                    boxShadow: '0 6px 20px rgba(228, 64, 95, 0.6)',
                  },
                }}
              >
                <InstagramIcon sx={{ fontSize: { xs: 24, md: 28 } }} />
              </IconButton>
            )}
            {socialMedia.twitter && (
              <IconButton
                component="a"
                href={socialMedia.twitter}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  bgcolor: '#000000',
                  color: 'white',
                  width: { xs: 48, md: 56 },
                  height: { xs: 48, md: 56 },
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: '#333333',
                    transform: 'translateX(-5px) scale(1.1)',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.5)',
                  },
                }}
              >
                <TwitterIcon sx={{ fontSize: { xs: 24, md: 28 } }} />
              </IconButton>
            )}
          </Box>
        </Zoom>
      )}

      {/* Stats Section */}
      {theme.showStatistics && (
        <Box sx={{ py: 8, background: '#f8f9fa' }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              {[
                { icon: <SchoolIcon />, value: schoolInfo.established, label: 'Established' },
                { icon: <StudentsIcon />, value: schoolInfo.students, label: 'Students' },
                { icon: <BookIcon />, value: schoolInfo.teachers, label: 'Teachers' },
                { icon: <AwardIcon />, value: schoolInfo.achievements, label: 'Achievements' }
              ].map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Fade in timeout={1000 + index * 200}>
                    <StatsCard elevation={3}>
                      <Avatar sx={{
                        bgcolor: '#f8f9fa',
                        color: '#495057',
                        mb: 2,
                        mx: 'auto',
                        width: 60,
                        height: 60
                      }}>
                        {stat.icon}
                      </Avatar>
                      <Typography variant="h4" fontWeight="bold">
                        {stat.value}
                      </Typography>
                      <Typography variant="body1">
                        {stat.label}
                      </Typography>
                    </StatsCard>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {/* School Information Section */}
      <Box sx={{ py: 10, position: 'relative', overflow: 'hidden' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 800, color: '#333' }}>
              About Our School
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Nurturing minds, building futures
            </Typography>
          </Box>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box sx={{ position: 'relative' }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -20,
                      left: -20,
                      width: '100%',
                      height: '100%',
                      background: `linear-gradient(135deg, ${theme.primaryColor}22 0%, ${theme.secondaryColor}22 100%)`,
                      borderRadius: '24px',
                      zIndex: 0
                    }}
                  />
                  <img
                    src={media.aboutImage || media.heroImage || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=600&fit=crop"}
                    alt="School Campus"
                    style={{
                      width: '100%',
                      borderRadius: '24px',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                      position: 'relative',
                      zIndex: 1,
                      transition: 'transform 0.4s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=600&fit=crop";
                    }}
                  />
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              <Fade in timeout={1200}>
                <Box>
                  <Typography
                    variant="h3"
                    gutterBottom
                    sx={{
                      fontWeight: 800,
                      background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 3
                    }}
                  >
                    Excellence in Education
                  </Typography>
                  <Typography variant="h6" paragraph sx={{ lineHeight: 1.9, color: '#555', mb: 3 }}>
                    For over 25 years, we have been committed to providing exceptional education
                    that prepares students for success in an ever-changing world.
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', mb: 4 }}>
                    Our innovative teaching methods and state-of-the-art facilities create an
                    environment where every student can thrive. We believe in holistic development,
                    combining academic excellence with character building.
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                    {[
                      { label: 'STEM Programs', icon: '🔬', color: '#667eea' },
                      { label: 'Arts & Culture', icon: '🎨', color: '#f093fb' },
                      { label: 'Sports Excellence', icon: '⚽', color: '#43e97b' },
                      { label: 'Global Perspective', icon: '🌍', color: '#4facfe' }
                    ].map((feature) => (
                      <Chip
                        key={feature.label}
                        icon={<Typography sx={{ fontSize: '1.2rem' }}>{feature.icon}</Typography>}
                        label={feature.label}
                        sx={{
                          borderRadius: '20px',
                          px: 2,
                          py: 2.5,
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          background: 'white',
                          border: `2px solid ${feature.color}30`,
                          color: feature.color,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: feature.color,
                            color: 'white',
                            transform: 'translateY(-4px)',
                            boxShadow: `0 8px 20px ${feature.color}40`
                          }
                        }}
                      />
                    ))}
                  </Box>

                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowIcon />}
                    sx={{
                      background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`,
                      borderRadius: '30px',
                      px: 5,
                      py: 1.8,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 12px 35px rgba(102, 126, 234, 0.5)'
                      }
                    }}
                  >
                    Learn More About Us
                  </Button>
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Latest News Section */}
      {theme.showNews && latestNews.length > 0 && (
        <Box sx={{ py: 10 }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 7 }}>
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 800, color: '#333' }}>
                Latest News & Events
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Stay updated with our latest activities and achievements
              </Typography>
            </Box>
            <Grid container spacing={4}>
              {latestNews.slice(0, 3).map((news, index) => (
                <Grid item xs={12} md={4} key={news._id || news.id}>
                  <Fade in timeout={1000 + index * 300}>
                    <Box
                      sx={{
                        height: '100%',
                        background: 'white',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        transition: 'all 0.4s ease',
                        cursor: 'pointer',
                        position: 'relative',
                        '&:hover': {
                          transform: 'translateY(-12px)',
                          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                          '& .news-image': {
                            transform: 'scale(1.08)'
                          },
                          '& .news-overlay': {
                            opacity: 0.3
                          }
                        }
                      }}
                    >
                      <Box sx={{ position: 'relative', overflow: 'hidden', height: '240px' }}>
                        <img
                          className="news-image"
                          src={news.image || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop"}
                          alt={news.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease'
                          }}
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop";
                          }}
                        />
                        <Box
                          className="news-overlay"
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `linear-gradient(135deg, ${theme.primaryColor}00 0%, ${theme.secondaryColor}00 100%)`,
                            opacity: 0,
                            transition: 'opacity 0.4s ease'
                          }}
                        />
                        <Chip
                          label={new Date(news.date || news.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                          sx={{
                            position: 'absolute',
                            top: 15,
                            right: 15,
                            bgcolor: 'white',
                            color: theme.primaryColor,
                            fontWeight: 'bold',
                            fontSize: '0.85rem',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                          }}
                        />
                      </Box>
                      <CardContent sx={{ p: 3.5 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold" sx={{
                          mb: 2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {news.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{
                          mb: 3,
                          lineHeight: 1.7,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {news.description}
                        </Typography>
                        <Button
                          fullWidth
                          variant="outlined"
                          endIcon={<ArrowIcon />}
                          sx={{
                            borderRadius: '20px',
                            py: 1.2,
                            fontWeight: 600,
                            textTransform: 'none',
                            borderWidth: '2px',
                            borderColor: theme.primaryColor,
                            color: theme.primaryColor,
                            '&:hover': {
                              borderWidth: '2px',
                              background: theme.primaryColor,
                              color: 'white',
                              transform: 'scale(1.02)'
                            }
                          }}
                        >
                          Read Full Story
                        </Button>
                      </CardContent>
                    </Box>
                  </Fade>
                </Grid>
              ))}
            </Grid>

            {latestNews.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  📰 No news available yet
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Check back soon for updates and announcements!
                </Typography>
              </Box>
            )}
          </Container>
        </Box>
      )}

      {/* Video Section */}
      {theme.showVideos && (media.heroVideo || media.promoVideo || media.campusVideo || media.virtualTour) && (
        <Box sx={{ py: 8 }}>
          <Container maxWidth="lg">
            <Typography variant="h3" textAlign="center" gutterBottom sx={{ mb: 6 }}>
              <GradientText>School Videos</GradientText>
            </Typography>
            <Grid container spacing={4}>
              {media.heroVideo && (
                <Grid item xs={12} md={6}>
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h5" gutterBottom>Hero Video</Typography>
                    <video
                      controls
                      style={{
                        width: '100%',
                        maxHeight: '300px',
                        borderRadius: '15px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                      }}
                    >
                      <source src={media.heroVideo} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </Box>
                </Grid>
              )}
              {media.promoVideo && (
                <Grid item xs={12} md={6}>
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h5" gutterBottom>Promotional Video</Typography>
                    <video
                      controls
                      style={{
                        width: '100%',
                        maxHeight: '300px',
                        borderRadius: '15px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                      }}
                    >
                      <source src={media.promoVideo} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </Box>
                </Grid>
              )}
              {media.campusVideo && (
                <Grid item xs={12} md={6}>
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h5" gutterBottom>Campus Tour</Typography>
                    <video
                      controls
                      style={{
                        width: '100%',
                        maxHeight: '300px',
                        borderRadius: '15px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                      }}
                    >
                      <source src={media.campusVideo} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </Box>
                </Grid>
              )}
              {media.virtualTour && (
                <Grid item xs={12} md={6}>
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h5" gutterBottom>Virtual Tour</Typography>
                    <iframe
                      width="100%"
                      height="300"
                      src={media.virtualTour.replace('watch?v=', 'embed/')}
                      frameBorder="0"
                      allowFullScreen
                      style={{
                        borderRadius: '15px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                      }}
                    ></iframe>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Container>
        </Box>
      )}

      {/* Enhanced Gallery Section with HD Images */}
      <Box sx={{ py: 10, bgcolor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 800, color: '#333' }}>
              Explore Our Campus
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
              Take a visual journey through our world-class facilities and vibrant campus life
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Default HD school images when gallery is empty */}
            {(!media.galleryImages || media.galleryImages.length === 0) && (
              <>
                {[
                  {
                    url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&h=800&fit=crop',
                    title: 'Modern Campus',
                    description: 'State-of-the-art educational facilities'
                  },
                  {
                    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=800&fit=crop',
                    title: 'Smart Classrooms',
                    description: 'Technology-enabled learning spaces'
                  },
                  {
                    url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=800&fit=crop',
                    title: 'Library Resources',
                    description: 'Extensive collection of books'
                  },
                  {
                    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&h=800&fit=crop',
                    title: 'Sports Facilities',
                    description: 'World-class athletic infrastructure'
                  },
                  {
                    url: 'https://images.unsplash.com/photo-1577896851905-dc177a03b2e0?w=1200&h=800&fit=crop',
                    title: 'Science Labs',
                    description: 'Advanced laboratories'
                  },
                  {
                    url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=1200&h=800&fit=crop',
                    title: 'Arts & Culture',
                    description: 'Creative spaces'
                  }
                ].map((image, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Fade in timeout={800 + index * 150}>
                      <Box
                        sx={{
                          position: 'relative',
                          overflow: 'hidden',
                          borderRadius: '20px',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                          cursor: 'pointer',
                          height: '320px',
                          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            transform: 'translateY(-12px)',
                            boxShadow: '0 16px 40px rgba(0,0,0,0.18)',
                            '& img': {
                              transform: 'scale(1.15)'
                            },
                            '& .gallery-overlay': {
                              opacity: 1
                            }
                          }
                        }}
                      >
                        <img
                          src={image.url}
                          alt={image.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease'
                          }}
                        />
                        <Box
                          className="gallery-overlay"
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
                            padding: '30px 20px 20px',
                            opacity: 0,
                            transition: 'opacity 0.4s ease',
                            color: 'white'
                          }}
                        >
                          <Typography variant="h5" fontWeight="bold" gutterBottom>
                            {image.title}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.95 }}>
                            {image.description}
                          </Typography>
                        </Box>
                        {/* HD Badge */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 15,
                            right: 15,
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            backdropFilter: 'blur(10px)',
                            color: 'white',
                            padding: '8px 14px',
                            borderRadius: '25px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            border: '1px solid rgba(255,255,255,0.3)'
                          }}
                        >
                          HD
                        </Box>
                      </Box>
                    </Fade>
                  </Grid>
                ))}
              </>
            )}

            {/* User uploaded gallery images */}
            {media.galleryImages && media.galleryImages.length > 0 && media.galleryImages.slice(0, 12).map((image, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Fade in timeout={800 + index * 100}>
                  <Box
                    sx={{
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '20px',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                      height: '250px',
                      transition: 'all 0.4s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                        '& img': {
                          transform: 'scale(1.1)'
                        }
                      }
                    }}
                  >
                    <img
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease'
                      }}
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop";
                      }}
                    />
                  </Box>
                </Fade>
              </Grid>
            ))}
          </Grid>

          {/* View More Button */}
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowIcon />}
              sx={{
                background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`,
                borderRadius: '30px',
                px: 6,
                py: 1.8,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 28px rgba(102, 126, 234, 0.5)'
                }
              }}
            >
              View Complete Gallery
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Programs Section */}
      {theme.showPrograms && (
        <Box sx={{ py: 10, bgcolor: '#f8f9fa' }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 7 }}>
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 800, color: '#333' }}>
                Our Academic Programs
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Comprehensive education for every stage of learning
              </Typography>
            </Box>
            <Grid container spacing={4}>
              {[
                {
                  title: 'Elementary School',
                  grades: 'Grades 1-5',
                  description: 'Building strong foundations for lifelong learning through play-based and experiential education',
                  icon: '🌱',
                  color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  features: ['Interactive Learning', 'Creative Arts', 'Sports & Games']
                },
                {
                  title: 'Middle School',
                  grades: 'Grades 6-8',
                  description: 'Developing critical thinking and creativity while fostering independence and responsibility',
                  icon: '🚀',
                  color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  features: ['STEM Focus', 'Leadership Skills', 'Team Projects']
                },
                {
                  title: 'High School',
                  grades: 'Grades 9-12',
                  description: 'Preparing for college and career success with advanced academics and career guidance',
                  icon: '🎓',
                  color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  features: ['AP Courses', 'Career Counseling', 'College Prep']
                }
              ].map((program, index) => (
                <Grid item xs={12} md={4} key={program.title}>
                  <Fade in timeout={1200 + index * 200}>
                    <Box
                      sx={{
                        height: '100%',
                        background: 'white',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        '&:hover': {
                          transform: 'translateY(-12px)',
                          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                          '& .program-icon': {
                            transform: 'scale(1.1) rotate(5deg)'
                          },
                          '& .program-gradient': {
                            opacity: 1
                          }
                        }
                      }}
                    >
                      {/* Gradient Header */}
                      <Box
                        className="program-gradient"
                        sx={{
                          background: program.color,
                          height: '180px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          opacity: 0.95,
                          transition: 'opacity 0.3s ease',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.15) 0%, transparent 70%)'
                          }
                        }}
                      >
                        <Typography
                          className="program-icon"
                          sx={{
                            fontSize: '5rem',
                            transition: 'transform 0.4s ease',
                            position: 'relative',
                            zIndex: 1,
                            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                          }}
                        >
                          {program.icon}
                        </Typography>
                      </Box>

                      {/* Content */}
                      <CardContent sx={{ p: 4 }}>
                        <Chip
                          label={program.grades}
                          size="small"
                          sx={{
                            mb: 2,
                            fontWeight: 'bold',
                            background: program.color,
                            color: 'white'
                          }}
                        />
                        <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
                          {program.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                          {program.description}
                        </Typography>

                        {/* Features List */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          {program.features.map((feature, idx) => (
                            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  background: program.color
                                }}
                              />
                              <Typography variant="body2" fontWeight="600" color="text.secondary">
                                {feature}
                              </Typography>
                            </Box>
                          ))}
                        </Box>

                        <Button
                          fullWidth
                          variant="outlined"
                          sx={{
                            mt: 3,
                            borderRadius: '20px',
                            py: 1.5,
                            fontWeight: 600,
                            textTransform: 'none',
                            borderWidth: '2px',
                            borderColor: 'transparent',
                            background: program.color,
                            color: 'white',
                            '&:hover': {
                              borderWidth: '2px',
                              transform: 'scale(1.02)',
                              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                            }
                          }}
                        >
                          Learn More
                        </Button>
                      </CardContent>
                    </Box>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {/* Features/Facilities Section */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 800, color: '#333' }}>
              Why Choose Us
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Exceptional facilities and programs for holistic development
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                icon: '🏫',
                title: 'Modern Infrastructure',
                description: 'State-of-the-art classrooms equipped with smart boards',
                color: '#667eea'
              },
              {
                icon: '👨‍🏫',
                title: 'Expert Faculty',
                description: 'Highly qualified teachers dedicated to student success',
                color: '#764ba2'
              },
              {
                icon: '🏆',
                title: 'Sports Excellence',
                description: 'World-class sports facilities with professional coaching',
                color: '#f093fb'
              },
              {
                icon: '🔬',
                title: 'Advanced Labs',
                description: 'Well-equipped labs for hands-on learning',
                color: '#4facfe'
              },
              {
                icon: '📚',
                title: 'Rich Library',
                description: 'Extensive digital and physical resources',
                color: '#43e97b'
              },
              {
                icon: '🎭',
                title: 'Arts & Culture',
                description: 'Programs in music, dance, drama, and arts',
                color: '#fa709a'
              }
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Fade in timeout={1000 + index * 200}>
                  <FloatingCard sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 4,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: feature.color
                    }
                  }}>
                    <Box sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${feature.color}22 0%, ${feature.color}44 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2.5rem',
                      mx: 'auto',
                      mb: 3
                    }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </FloatingCard>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 10, bgcolor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 800, color: '#333' }}>
              What Parents Say
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Hear from our satisfied parents
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                name: 'Rajesh Kumar',
                role: 'Parent of Grade 10 Student',
                avatar: '👨',
                text: 'The quality of education and personal attention my child receives is outstanding.',
                rating: 5
              },
              {
                name: 'Priya Sharma',
                role: 'Parent of Grade 8 Student',
                avatar: '👩',
                text: 'Excellent infrastructure and perfect blend of academics and activities!',
                rating: 5
              },
              {
                name: 'Amit Patel',
                role: 'Parent of Grade 6 Student',
                avatar: '👨',
                text: 'My daughter has grown tremendously. The holistic approach is remarkable.',
                rating: 5
              }
            ].map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Fade in timeout={1200 + index * 200}>
                  <FloatingCard sx={{ height: '100%', p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar sx={{
                        width: 60,
                        height: 60,
                        bgcolor: theme.primaryColor,
                        fontSize: '2rem',
                        mr: 2
                      }}>
                        {testimonial.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic', color: '#555' }}>
                      "{testimonial.text}"
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon key={i} sx={{ color: '#FFD700', fontSize: '1.2rem' }} />
                      ))}
                    </Box>
                  </FloatingCard>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Achievements & Awards Section */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 800, color: '#333' }}>
              Awards & Recognition
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Celebrating excellence and achievements
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                icon: '🏆',
                title: 'Best School Award',
                year: '2024',
                description: 'Recognized for academic excellence',
                color: '#FFD700'
              },
              {
                icon: '⭐',
                title: 'Excellence in Education',
                year: '2023',
                description: 'Outstanding teaching methodology',
                color: '#667eea'
              },
              {
                icon: '🎖️',
                title: 'Innovation in Learning',
                year: '2024',
                description: 'Digital transformation pioneer',
                color: '#43e97b'
              },
              {
                icon: '🌟',
                title: 'Student Success Rate',
                year: '2024',
                description: '98% college placement',
                color: '#fa709a'
              }
            ].map((award, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Fade in timeout={1000 + index * 200}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 4,
                      background: 'white',
                      borderRadius: '24px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      transition: 'all 0.4s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-12px)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                        '&::before': {
                          transform: 'scale(1.5)',
                          opacity: 0.1
                        }
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -50,
                        right: -50,
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        background: award.color,
                        opacity: 0.05,
                        transition: 'all 0.4s ease'
                      }
                    }}
                  >
                    <Typography sx={{ fontSize: '4rem', mb: 2 }}>
                      {award.icon}
                    </Typography>
                    <Chip
                      label={award.year}
                      size="small"
                      sx={{
                        bgcolor: award.color,
                        color: 'white',
                        fontWeight: 'bold',
                        mb: 2
                      }}
                    />
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {award.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {award.description}
                    </Typography>
                  </Box>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Quick Facts Section */}
      <Box sx={{ py: 10, bgcolor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 800, color: '#333' }}>
              Quick Facts
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Numbers that speak for themselves
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {[
              { number: '25+', label: 'Years of Excellence', icon: '📅', color: '#667eea' },
              { number: '50+', label: 'Expert Teachers', icon: '👨‍🏫', color: '#f093fb' },
              { number: '1500+', label: 'Happy Students', icon: '🎓', color: '#4facfe' },
              { number: '98%', label: 'Success Rate', icon: '📊', color: '#43e97b' },
              { number: '30+', label: 'Countries Represented', icon: '🌍', color: '#fa709a' },
              { number: '100%', label: 'Placement Record', icon: '💼', color: '#764ba2' }
            ].map((fact, index) => (
              <Grid item xs={6} md={4} lg={2} key={index}>
                <Zoom in timeout={800 + index * 100}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 3,
                      background: 'white',
                      borderRadius: '20px',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.05)',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                        background: fact.color,
                        color: 'white',
                        '& .fact-icon': {
                          transform: 'scale(1.2) rotate(10deg)'
                        },
                        '& .fact-label': {
                          color: 'white'
                        }
                      }
                    }}
                  >
                    <Typography
                      className="fact-icon"
                      sx={{
                        fontSize: '2.5rem',
                        mb: 1,
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      {fact.icon}
                    </Typography>
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      sx={{ mb: 1, color: fact.color }}
                    >
                      {fact.number}
                    </Typography>
                    <Typography
                      className="fact-label"
                      variant="body2"
                      fontWeight="600"
                      color="text.secondary"
                      sx={{ transition: 'color 0.3s ease' }}
                    >
                      {fact.label}
                    </Typography>
                  </Box>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{
        py: 10,
        background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`,
        backgroundSize: '200% 200%',
        animation: `${gradientShift} 8s ease infinite`,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }
      }}>
        <Container maxWidth="md">
          <Typography variant="h2" color="white" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
            Ready to Join Our Community?
          </Typography>
          <Typography variant="h5" color="rgba(255,255,255,0.95)" sx={{ mb: 5 }}>
            Discover the difference quality education makes
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowIcon />}
              sx={{
                background: 'white',
                color: theme.primaryColor,
                borderRadius: '30px',
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                '&:hover': {
                  background: '#f8f9fa',
                  transform: 'translateY(-3px)'
                }
              }}
            >
              Apply Now
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<PlayIcon />}
              sx={{
                borderColor: 'white',
                color: 'white',
                borderRadius: '30px',
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderWidth: '2px',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderWidth: '2px'
                }
              }}
            >
              Schedule a Visit
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
// Build: 2025-10-06-08-40
