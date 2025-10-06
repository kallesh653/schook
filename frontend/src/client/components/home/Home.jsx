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
  ArrowForward as ArrowIcon
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import Carousel from './carousel/Carousel';
import ImageSlider from './ImageSlider';
import BeautifulSlider from './BeautifulSlider';
import axios from 'axios';
import { baseUrl } from '../../../environment';

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
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '20px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-10px) scale(1.02)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    background: 'rgba(255, 255, 255, 1)'
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
  const [animatedStats, setAnimatedStats] = useState({
    students: 0,
    teachers: 0,
    achievements: 0
  });

  const [schoolInfo, setSchoolInfo] = useState({
    name: '',
    tagline: '',
    description: '',
    established: '',
    students: '',
    teachers: '',
    achievements: ''
  });

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

  // Function to fetch PUBLIC home page data (NOT school-specific)
  const fetchFrontPageData = async () => {
    try {
      // Fetch PUBLIC home page (shows "SCHOOL MANAGEMENT SYSTEM")
      const publicResponse = await axios.get(`${baseUrl}/public-home/data`);

      if (publicResponse.data.success) {
        const data = publicResponse.data.data;
        console.log('✅ Loaded PUBLIC home page data');

        // Set school info from hero section and statistics
        const stats = data.statistics?.stats || [];
        setSchoolInfo({
          name: data.header?.siteName || 'SCHOOL MANAGEMENT SYSTEM',
          tagline: data.heroSection?.subtitle || 'Manage Your School Efficiently',
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

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>

      {/* Beautiful Full-Width Slider with Images and Videos */}
      <BeautifulSlider slides={combinedSlides} />

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
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" gutterBottom sx={{ mb: 6 }}>
            <GradientText>About Our School</GradientText>
          </Typography>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <img
                src={media.aboutImage || media.heroImage || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop"}
                alt="School Campus"
                style={{
                  width: '100%',
                  borderRadius: '15px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop";
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom color="primary">
                Excellence in Education
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                For over 25 years, we have been committed to providing exceptional education 
                that prepares students for success in an ever-changing world. Our innovative 
                teaching methods and state-of-the-art facilities create an environment where 
                every student can thrive.
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {['STEM Programs', 'Arts & Culture', 'Sports Excellence', 'Global Perspective'].map((feature) => (
                  <Chip 
                    key={feature}
                    label={feature}
                    color="primary"
                    variant="outlined"
                    sx={{ borderRadius: '15px' }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Latest News Section */}
      {theme.showNews && (
        <Box sx={{ py: 8, bgcolor: '#f8f9fa' }}>
          <Container maxWidth="lg">
            <Typography variant="h3" textAlign="center" gutterBottom sx={{ mb: 6 }}>
              <GradientText>Latest News & Events</GradientText>
            </Typography>
            <Grid container spacing={4}>
              {latestNews.map((news, index) => (
                <Grid item xs={12} md={4} key={news._id || news.id}>
                  <Fade in timeout={1000 + index * 300}>
                    <FloatingCard>
                      <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
                        <img
                          src={news.image || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"}
                          alt={news.title}
                          style={{
                            width: '100%',
                            height: '200px',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease'
                          }}
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400";
                          }}
                        />
                        <Box sx={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          bgcolor: 'primary.main',
                          color: 'white',
                          px: 2,
                          py: 0.5,
                          borderRadius: '15px',
                          fontSize: '0.8rem'
                        }}>
                          {new Date(news.date || news.createdAt).toLocaleDateString()}
                        </Box>
                      </Box>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                          {news.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {news.description}
                        </Typography>
                        <Button
                          size="small"
                          endIcon={<ArrowIcon />}
                          sx={{ color: 'primary.main', fontWeight: 'bold' }}
                        >
                          Read More
                        </Button>
                      </CardContent>
                    </FloatingCard>
                  </Fade>
                </Grid>
              ))}
            </Grid>
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
        <Box sx={{ py: 8 }}>
          <Container maxWidth="lg">
            <Typography variant="h3" textAlign="center" gutterBottom sx={{ mb: 6 }}>
              <GradientText>Our Programs</GradientText>
            </Typography>
          <Grid container spacing={4}>
            {[
              {
                title: 'Elementary School',
                description: 'Building strong foundations for lifelong learning',
                icon: '🌱',
                color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              },
              {
                title: 'Middle School',
                description: 'Developing critical thinking and creativity',
                icon: '🚀',
                color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
              },
              {
                title: 'High School',
                description: 'Preparing for college and career success',
                icon: '🎓',
                color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
              }
            ].map((program, index) => (
              <Grid item xs={12} md={4} key={program.title}>
                <Fade in timeout={1200 + index * 200}>
                  <FloatingCard sx={{ height: '100%', textAlign: 'center' }}>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: program.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        mx: 'auto',
                        mb: 3
                      }}>
                        {program.icon}
                      </Box>
                      <Typography variant="h5" gutterBottom fontWeight="bold">
                        {program.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {program.description}
                      </Typography>
                    </CardContent>
                  </FloatingCard>
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

      {/* Call to Action */}
      <Box sx={{
        py: 10,
        background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`,
        textAlign: 'center'
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
