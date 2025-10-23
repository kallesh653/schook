import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Avatar,
  Paper,
  Divider,
  AppBar,
  Toolbar,
  Rating,
} from '@mui/material';
import {
  School,
  EmojiEvents,
  Groups,
  LocalLibrary,
  ArrowForward,
  ArrowBack,
  Phone,
  Email,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  YouTube,
  PlayCircleOutline,
  FormatQuote,
  LocationOn,
  Business,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import axios from 'axios';
import { baseUrl } from '../../../environment';

// Helper function to get image URL
const getImageUrl = (path) => {
  if (!path) return '';
  const apiBaseUrl = baseUrl.replace('/api', '');
  return `${apiBaseUrl}${path}`;
};

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
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

// Styled Components
const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '100vh',
  width: '100%',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const HeroSlide = styled(Box)(({ active }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  opacity: active ? 1 : 0,
  transition: 'opacity 1.5s ease-in-out',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(102,126,234,0.8) 0%, rgba(118,75,162,0.6) 100%)',
    zIndex: 1,
  },
}));

const DefaultHeroBackground = styled(Box)(({ primaryColor, secondaryColor }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: `linear-gradient(135deg, ${primaryColor || '#667eea'} 0%, ${secondaryColor || '#764ba2'} 100%)`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)
    `,
    animation: `${pulse} 8s ease-in-out infinite`,
  },
}));

const HeroMedia = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const HeroVideo = styled('video')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const HeroContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  textAlign: 'center',
  color: '#fff',
  padding: theme.spacing(4),
  animation: `${fadeInUp} 1.2s ease-out`,
}));

const NavigationArrow = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 3,
  color: '#fff',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  width: '60px',
  height: '60px',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: 'translateY(-50%) scale(1.1)',
  },
  transition: 'all 0.3s ease',
  [theme.breakpoints.down('sm')]: {
    width: '45px',
    height: '45px',
  },
}));

const SliderDots = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: '30px',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 3,
  display: 'flex',
  gap: '12px',
}));

const Dot = styled(Box)(({ active }) => ({
  width: active ? '40px' : '12px',
  height: '12px',
  borderRadius: '6px',
  backgroundColor: active ? '#fff' : 'rgba(255, 255, 255, 0.5)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#fff',
  },
}));

const TopContactBar = styled(Box)(({ theme, bgcolor }) => ({
  backgroundColor: bgcolor || '#1a237e',
  color: '#fff',
  padding: theme.spacing(1.5, 0),
}));

const StickyAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#fff',
  color: '#333',
  boxShadow: '0 2px 15px rgba(0,0,0,0.1)',
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const LogoImage = styled('img')({
  height: '50px',
  width: 'auto',
  objectFit: 'contain',
});

const Section = styled(Box)(({ theme, bgcolor }) => ({
  padding: theme.spacing(10, 0),
  backgroundColor: bgcolor || '#fff',
  width: '100%',
}));

const SectionTitle = styled(Typography)(({ theme, primaryColor }) => ({
  fontSize: '2.5rem',
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  textAlign: 'center',
  background: primaryColor
    ? `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: `${fadeInUp} 0.8s ease-out`,
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem',
  },
}));

const SectionSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  color: '#666',
  textAlign: 'center',
  marginBottom: theme.spacing(6),
  maxWidth: '800px',
  margin: '0 auto',
  marginBottom: theme.spacing(6),
  animation: `${fadeInUp} 1s ease-out`,
  lineHeight: 1.8,
}));

const StatCard = styled(Card)(({ theme, primaryColor, secondaryColor }) => ({
  textAlign: 'center',
  padding: theme.spacing(4),
  height: '100%',
  background: `linear-gradient(135deg, ${primaryColor || '#667eea'} 0%, ${secondaryColor || '#764ba2'} 100%)`,
  color: '#fff',
  borderRadius: '20px',
  transition: 'all 0.4s ease',
  border: 'none',
  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
  '&:hover': {
    transform: 'translateY(-10px) scale(1.02)',
    boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
  },
}));

const AboutBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  borderRadius: '20px',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  transition: 'all 0.3s ease',
  boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
  },
}));

const ProgramCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: '20px',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
  '&:hover': {
    transform: 'translateY(-12px)',
    boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
  },
  '&:hover .program-image': {
    transform: 'scale(1.1)',
  },
}));

const GalleryItem = styled(Box)(({ theme }) => ({
  position: 'relative',
  paddingTop: '75%',
  overflow: 'hidden',
  borderRadius: '16px',
  cursor: 'pointer',
  boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  },
  '&:hover .gallery-image': {
    transform: 'scale(1.15)',
  },
  '&:hover .gallery-overlay': {
    opacity: 1,
  },
}));

const GalleryImage = styled('img')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.5s ease',
});

const GalleryOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0,0,0,0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.3s ease',
});

const TestimonialCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '20px',
  position: 'relative',
  height: '100%',
  background: '#fff',
  boxShadow: '0 5px 25px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
  },
}));

const QuoteIcon = styled(FormatQuote)(({ theme }) => ({
  fontSize: '4rem',
  color: '#667eea',
  opacity: 0.2,
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(2),
}));

const Footer = styled(Box)(({ theme, bgcolor }) => ({
  backgroundColor: bgcolor || '#1a237e',
  color: '#fff',
  padding: theme.spacing(8, 0, 3, 0),
}));

const SocialIcon = styled(IconButton)(({ theme }) => ({
  color: '#fff',
  backgroundColor: 'rgba(255,255,255,0.1)',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.2)',
    transform: 'translateY(-3px)',
  },
  transition: 'all 0.3s ease',
}));

const IconWrapper = styled(Box)(({ primaryColor }) => ({
  display: 'inline-flex',
  padding: '12px',
  borderRadius: '50%',
  backgroundColor: 'rgba(255,255,255,0.2)',
  marginBottom: '16px',
}));

const PublicHomePage = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await axios.get(`${baseUrl}/home-page-content/public`);
      // FIX: Access response.data.data instead of response.data
      const homeData = response.data.data;
      setContent(homeData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching home page content:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  // Auto-rotate hero slider every 5 seconds
  useEffect(() => {
    // FIX: Access content.sliders instead of content.heroSlider.slides
    if (content?.sliders && content.sliders.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) =>
          prev === content.sliders.length - 1 ? 0 : prev + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [content]);

  const handlePrevSlide = () => {
    if (content?.sliders) {
      setCurrentSlide((prev) =>
        prev === 0 ? content.sliders.length - 1 : prev - 1
      );
    }
  };

  const handleNextSlide = () => {
    if (content?.sliders) {
      setCurrentSlide((prev) =>
        prev === content.sliders.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  // Map icon strings to actual icon components
  const getIconComponent = (iconName) => {
    const icons = {
      school: School,
      groups: Groups,
      library: LocalLibrary,
      trophy: EmojiEvents,
      business: Business,
    };
    const IconComponent = icons[iconName?.toLowerCase()] || School;
    return IconComponent;
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Box textAlign="center" color="#fff">
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
            Loading...
          </Typography>
          <Box
            sx={{
              width: '60px',
              height: '60px',
              border: '4px solid rgba(255,255,255,0.3)',
              borderTop: '4px solid #fff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            }}
          />
        </Box>
      </Box>
    );
  }

  if (error || !content) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Box textAlign="center" color="#fff" p={4}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
            Unable to Load Content
          </Typography>
          <Typography variant="body1">
            {error || 'No content available. Please try again later.'}
          </Typography>
          <Button
            variant="contained"
            onClick={fetchContent}
            sx={{
              mt: 3,
              backgroundColor: '#fff',
              color: '#667eea',
              '&:hover': {
                backgroundColor: '#f0f0f0',
              },
            }}
          >
            Retry
          </Button>
        </Box>
      </Box>
    );
  }

  // Get theme colors with fallbacks
  const primaryColor = content.header?.primaryColor || '#667eea';
  const secondaryColor = content.header?.secondaryColor || '#764ba2';

  // FIX: Access content.sliders instead of content.heroSlider.slides
  const hasSliders = content.sliders && content.sliders.length > 0;
  const currentSlideData = hasSliders ? content.sliders[currentSlide] : null;

  // Check section visibility
  const sectionVisibility = content.sectionVisibility || {};

  return (
    <Box>
      {/* Top Contact Bar */}
      <TopContactBar bgcolor={primaryColor}>
        <Container maxWidth="lg">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
          >
            <Box display="flex" gap={3} flexWrap="wrap">
              {/* FIX: Access content.header.contactPhone instead of content.contactPhone */}
              {content.header?.contactPhone && (
                <Box display="flex" alignItems="center" gap={1}>
                  <Phone fontSize="small" />
                  <Typography variant="body2">{content.header.contactPhone}</Typography>
                </Box>
              )}
              {/* FIX: Access content.header.contactEmail instead of content.contactEmail */}
              {content.header?.contactEmail && (
                <Box display="flex" alignItems="center" gap={1}>
                  <Email fontSize="small" />
                  <Typography variant="body2">{content.header.contactEmail}</Typography>
                </Box>
              )}
              {content.header?.address && (
                <Box display="flex" alignItems="center" gap={1}>
                  <LocationOn fontSize="small" />
                  <Typography variant="body2">{content.header.address}</Typography>
                </Box>
              )}
            </Box>
            <Box display="flex" gap={1}>
              {/* FIX: Access content.header.socialMedia */}
              {content.header?.socialMedia?.facebook && (
                <SocialIcon
                  size="small"
                  component="a"
                  href={content.header.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook fontSize="small" />
                </SocialIcon>
              )}
              {content.header?.socialMedia?.twitter && (
                <SocialIcon
                  size="small"
                  component="a"
                  href={content.header.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter fontSize="small" />
                </SocialIcon>
              )}
              {content.header?.socialMedia?.instagram && (
                <SocialIcon
                  size="small"
                  component="a"
                  href={content.header.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram fontSize="small" />
                </SocialIcon>
              )}
              {content.header?.socialMedia?.linkedin && (
                <SocialIcon
                  size="small"
                  component="a"
                  href={content.header.socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkedIn fontSize="small" />
                </SocialIcon>
              )}
              {content.header?.socialMedia?.youtube && (
                <SocialIcon
                  size="small"
                  component="a"
                  href={content.header.socialMedia.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <YouTube fontSize="small" />
                </SocialIcon>
              )}
            </Box>
          </Box>
        </Container>
      </TopContactBar>

      {/* Sticky Navigation */}
      <StickyAppBar position="sticky">
        <Toolbar>
          <Container maxWidth="lg">
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <LogoContainer>
                {content.header?.logo && (
                  <LogoImage
                    src={getImageUrl(content.header.logo)}
                    alt={content.header?.schoolName || 'School Logo'}
                  />
                )}
                <Box>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ fontWeight: 700, color: primaryColor, lineHeight: 1.2 }}
                  >
                    {content.header?.schoolName || 'School Name'}
                  </Typography>
                  {content.header?.tagline && (
                    <Typography
                      variant="caption"
                      sx={{ color: '#666', display: 'block' }}
                    >
                      {content.header.tagline}
                    </Typography>
                  )}
                </Box>
              </LogoContainer>
              <Box display="flex" gap={2} sx={{ display: { xs: 'none', md: 'flex' } }}>
                {sectionVisibility.showAbout !== false && (
                  <Button color="inherit" href="#about">
                    About
                  </Button>
                )}
                {sectionVisibility.showPrograms !== false && (
                  <Button color="inherit" href="#programs">
                    Programs
                  </Button>
                )}
                {sectionVisibility.showGallery !== false && (
                  <Button color="inherit" href="#gallery">
                    Gallery
                  </Button>
                )}
                {sectionVisibility.showTestimonials !== false && (
                  <Button color="inherit" href="#testimonials">
                    Testimonials
                  </Button>
                )}
                <Button
                  variant="contained"
                  sx={{
                    background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                    '&:hover': {
                      opacity: 0.9,
                    },
                  }}
                  href="#contact"
                >
                  Contact Us
                </Button>
              </Box>
            </Box>
          </Container>
        </Toolbar>
      </StickyAppBar>

      {/* Hero Section with Slider */}
      <HeroSection>
        {hasSliders ? (
          <>
            {/* Slider with images/videos */}
            {content.sliders.map((slide, index) => (
              <HeroSlide key={index} active={currentSlide === index}>
                {/* FIX: Check slide.mediaType for video/image */}
                {slide.mediaType === 'video' && slide.video ? (
                  <HeroVideo
                    src={getImageUrl(slide.video)}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : slide.image ? (
                  <HeroMedia src={getImageUrl(slide.image)} alt={slide.title || 'Slide'} />
                ) : null}
              </HeroSlide>
            ))}

            <HeroContent>
              <Container maxWidth="md">
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
                    fontWeight: 800,
                    marginBottom: 2,
                    textShadow: '2px 2px 8px rgba(0,0,0,0.4)',
                    lineHeight: 1.2,
                  }}
                >
                  {currentSlideData?.title || 'Welcome to Our School'}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: '1.2rem', md: '1.5rem', lg: '1.8rem' },
                    marginBottom: 4,
                    textShadow: '1px 1px 4px rgba(0,0,0,0.3)',
                    lineHeight: 1.5,
                  }}
                >
                  {currentSlideData?.description || content.header?.tagline || ''}
                </Typography>
                {currentSlideData?.buttonText && currentSlideData?.buttonLink && (
                  <Button
                    variant="contained"
                    size="large"
                    component="a"
                    href={currentSlideData.buttonLink}
                    sx={{
                      padding: '15px 40px',
                      fontSize: '1.1rem',
                      background: '#fff',
                      color: primaryColor,
                      fontWeight: 600,
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                        background: '#f5f5f5',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {currentSlideData.buttonText}
                  </Button>
                )}
              </Container>
            </HeroContent>

            {/* Navigation Arrows */}
            {content.sliders.length > 1 && (
              <>
                <NavigationArrow
                  onClick={handlePrevSlide}
                  sx={{ left: { xs: '10px', md: '30px' } }}
                >
                  <ArrowBack fontSize="large" />
                </NavigationArrow>
                <NavigationArrow
                  onClick={handleNextSlide}
                  sx={{ right: { xs: '10px', md: '30px' } }}
                >
                  <ArrowForward fontSize="large" />
                </NavigationArrow>
              </>
            )}

            {/* Slider Dots */}
            {content.sliders.length > 1 && (
              <SliderDots>
                {content.sliders.map((_, index) => (
                  <Dot
                    key={index}
                    active={currentSlide === index}
                    onClick={() => handleDotClick(index)}
                  />
                ))}
              </SliderDots>
            )}
          </>
        ) : (
          <>
            {/* Default beautiful hero when no sliders */}
            <DefaultHeroBackground primaryColor={primaryColor} secondaryColor={secondaryColor} />
            <HeroContent>
              <Container maxWidth="md">
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '4.5rem', lg: '6rem' },
                    fontWeight: 800,
                    marginBottom: 3,
                    textShadow: '2px 2px 8px rgba(0,0,0,0.2)',
                    lineHeight: 1.1,
                  }}
                >
                  {content.header?.schoolName || 'Welcome to Our School'}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: { xs: '1.3rem', md: '1.8rem', lg: '2.2rem' },
                    marginBottom: 5,
                    textShadow: '1px 1px 4px rgba(0,0,0,0.2)',
                    fontWeight: 300,
                    lineHeight: 1.5,
                  }}
                >
                  {content.header?.tagline || 'Excellence in Education'}
                </Typography>
                <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
                  <Button
                    variant="contained"
                    size="large"
                    href="#about"
                    sx={{
                      padding: '15px 40px',
                      fontSize: '1.1rem',
                      background: '#fff',
                      color: primaryColor,
                      fontWeight: 600,
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                        background: '#f5f5f5',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Learn More
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    href="#contact"
                    sx={{
                      padding: '15px 40px',
                      fontSize: '1.1rem',
                      borderColor: '#fff',
                      color: '#fff',
                      fontWeight: 600,
                      borderWidth: '2px',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                        borderWidth: '2px',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Contact Us
                  </Button>
                </Box>
              </Container>
            </HeroContent>
          </>
        )}
      </HeroSection>

      {/* Statistics Section */}
      {sectionVisibility.showStatistics !== false && content.statistics && content.statistics.length > 0 && (
        <Section bgcolor="#f9fafb">
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              {content.statistics.map((stat, index) => {
                const IconComponent = getIconComponent(stat.icon);
                return (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <StatCard
                      primaryColor={primaryColor}
                      secondaryColor={secondaryColor}
                      sx={{
                        animationDelay: `${index * 0.1}s`,
                        animation: `${fadeInUp} 0.6s ease-out backwards`,
                      }}
                    >
                      <IconWrapper>
                        <IconComponent sx={{ fontSize: '3rem' }} />
                      </IconWrapper>
                      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                        {stat.value}{stat.suffix || ''}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.95 }}>
                        {stat.label}
                      </Typography>
                    </StatCard>
                  </Grid>
                );
              })}
            </Grid>
          </Container>
        </Section>
      )}

      {/* About Section */}
      {sectionVisibility.showAbout !== false && content.about && (
        <Section id="about" bgcolor="#fff">
          <Container maxWidth="lg">
            <SectionTitle variant="h2" primaryColor={primaryColor}>
              {content.about.heading || 'About Us'}
            </SectionTitle>
            <SectionSubtitle>
              {content.about.subheading || content.about.description || ''}
            </SectionSubtitle>

            {content.about.images && content.about.images.length > 0 && (
              <Box sx={{ mb: 6, borderRadius: '20px', overflow: 'hidden' }}>
                <Grid container spacing={2}>
                  {content.about.images.slice(0, 3).map((image, index) => (
                    <Grid item xs={12} md={content.about.images.length === 1 ? 12 : 4} key={index}>
                      <Box
                        sx={{
                          width: '100%',
                          paddingTop: '60%',
                          position: 'relative',
                          overflow: 'hidden',
                          borderRadius: '16px',
                        }}
                      >
                        <img
                          src={getImageUrl(image)}
                          alt={`About ${index + 1}`}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            <Grid container spacing={4} sx={{ marginTop: 2 }}>
              {content.about.mission && (
                <Grid item xs={12} md={6}>
                  <AboutBox elevation={0}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        marginBottom: 2,
                        color: primaryColor,
                      }}
                    >
                      Our Mission
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#555' }}>
                      {content.about.mission}
                    </Typography>
                  </AboutBox>
                </Grid>
              )}
              {content.about.vision && (
                <Grid item xs={12} md={6}>
                  <AboutBox elevation={0}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        marginBottom: 2,
                        color: primaryColor,
                      }}
                    >
                      Our Vision
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#555' }}>
                      {content.about.vision}
                    </Typography>
                  </AboutBox>
                </Grid>
              )}
            </Grid>

            {!content.about.mission && !content.about.vision && content.about.description && (
              <Box sx={{ mt: 4, textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.1rem', color: '#555' }}>
                  {content.about.description}
                </Typography>
              </Box>
            )}
          </Container>
        </Section>
      )}

      {/* Programs Section */}
      {sectionVisibility.showPrograms !== false && content.programs && content.programs.length > 0 && (
        <Section id="programs" bgcolor="#f9fafb">
          <Container maxWidth="lg">
            <SectionTitle variant="h2" primaryColor={primaryColor}>
              Our Programs
            </SectionTitle>
            <SectionSubtitle>
              Explore our diverse range of educational programs designed to nurture excellence
            </SectionSubtitle>

            <Grid container spacing={4}>
              {content.programs.map((program, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <ProgramCard>
                    {program.image && (
                      <CardMedia
                        component="img"
                        height="220"
                        image={getImageUrl(program.image)}
                        alt={program.title}
                        className="program-image"
                        sx={{
                          transition: 'transform 0.5s ease',
                        }}
                      />
                    )}
                    <CardContent sx={{ padding: 3 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          marginBottom: 2,
                          color: primaryColor,
                        }}
                      >
                        {program.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: '#666', lineHeight: 1.8, mb: 2 }}
                      >
                        {program.description}
                      </Typography>
                      {(program.ageGroup || program.duration) && (
                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
                          {program.ageGroup && (
                            <Typography variant="caption" sx={{ display: 'block', color: '#888', mb: 0.5 }}>
                              Age Group: {program.ageGroup}
                            </Typography>
                          )}
                          {program.duration && (
                            <Typography variant="caption" sx={{ display: 'block', color: '#888' }}>
                              Duration: {program.duration}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </CardContent>
                  </ProgramCard>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Section>
      )}

      {/* Gallery Section */}
      {sectionVisibility.showGallery !== false && content.gallery && content.gallery.length > 0 && (
        <Section id="gallery" bgcolor="#fff">
          <Container maxWidth="lg">
            <SectionTitle variant="h2" primaryColor={primaryColor}>
              Gallery
            </SectionTitle>
            <SectionSubtitle>
              Glimpses of our vibrant school community and memorable moments
            </SectionSubtitle>

            <Grid container spacing={3}>
              {content.gallery.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <GalleryItem>
                    {item.mediaType === 'video' ? (
                      <>
                        <GalleryImage
                          src={getImageUrl(item.url)}
                          alt={item.title || `Gallery ${index + 1}`}
                          className="gallery-image"
                        />
                        <GalleryOverlay className="gallery-overlay">
                          <PlayCircleOutline
                            sx={{ fontSize: '4rem', color: '#fff' }}
                          />
                        </GalleryOverlay>
                      </>
                    ) : (
                      <>
                        <GalleryImage
                          src={getImageUrl(item.url)}
                          alt={item.title || `Gallery ${index + 1}`}
                          className="gallery-image"
                        />
                        {item.title && (
                          <GalleryOverlay className="gallery-overlay">
                            <Typography
                              variant="h6"
                              sx={{
                                color: '#fff',
                                fontWeight: 600,
                                textAlign: 'center',
                                px: 2,
                              }}
                            >
                              {item.title}
                            </Typography>
                          </GalleryOverlay>
                        )}
                      </>
                    )}
                  </GalleryItem>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Section>
      )}

      {/* Testimonials Section */}
      {sectionVisibility.showTestimonials !== false &&
       content.testimonials?.items &&
       content.testimonials.items.length > 0 && (
        <Section id="testimonials" bgcolor="#f9fafb">
          <Container maxWidth="lg">
            <SectionTitle variant="h2" primaryColor={primaryColor}>
              {content.testimonials.heading || 'Testimonials'}
            </SectionTitle>
            <SectionSubtitle>
              {content.testimonials.description || 'What our students and parents say about us'}
            </SectionSubtitle>

            <Grid container spacing={4}>
              {content.testimonials.items.map((testimonial, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <TestimonialCard>
                    <QuoteIcon />
                    <Box sx={{ marginTop: 4 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontStyle: 'italic',
                          marginBottom: 3,
                          lineHeight: 1.8,
                          color: '#555',
                          position: 'relative',
                          zIndex: 1,
                        }}
                      >
                        "{testimonial.comment}"
                      </Typography>

                      {testimonial.rating && (
                        <Box sx={{ mb: 2 }}>
                          <Rating value={testimonial.rating} readOnly size="small" />
                        </Box>
                      )}

                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 700, color: primaryColor, mb: 0.5 }}
                        >
                          {testimonial.parentName}
                        </Typography>
                        {testimonial.studentName && (
                          <Typography variant="body2" sx={{ color: '#888' }}>
                            Parent of {testimonial.studentName}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TestimonialCard>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Section>
      )}

      {/* Footer */}
      <Footer id="contact" bgcolor={primaryColor}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              {content.header?.logo && (
                <Box sx={{ mb: 2 }}>
                  <LogoImage
                    src={getImageUrl(content.header.logo)}
                    alt={content.header?.schoolName || 'School Logo'}
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </Box>
              )}
              <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: 2 }}>
                {content.header?.schoolName || 'School Name'}
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: 2, opacity: 0.9, lineHeight: 1.7 }}>
                {content.header?.tagline || content.about?.description || 'Empowering students to excel and achieve their dreams'}
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: 2 }}>
                Quick Links
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                {sectionVisibility.showAbout !== false && (
                  <Button color="inherit" href="#about" sx={{ justifyContent: 'flex-start', pl: 0 }}>
                    About Us
                  </Button>
                )}
                {sectionVisibility.showPrograms !== false && (
                  <Button color="inherit" href="#programs" sx={{ justifyContent: 'flex-start', pl: 0 }}>
                    Programs
                  </Button>
                )}
                {sectionVisibility.showGallery !== false && (
                  <Button color="inherit" href="#gallery" sx={{ justifyContent: 'flex-start', pl: 0 }}>
                    Gallery
                  </Button>
                )}
                {sectionVisibility.showTestimonials !== false && (
                  <Button color="inherit" href="#testimonials" sx={{ justifyContent: 'flex-start', pl: 0 }}>
                    Testimonials
                  </Button>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: 2 }}>
                Contact Us
              </Typography>
              {content.header?.address && (
                <Box display="flex" alignItems="flex-start" gap={1} sx={{ marginBottom: 1.5 }}>
                  <LocationOn fontSize="small" sx={{ mt: 0.3 }} />
                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                    {content.header.address}
                  </Typography>
                </Box>
              )}
              {content.header?.contactPhone && (
                <Box display="flex" alignItems="center" gap={1} sx={{ marginBottom: 1.5 }}>
                  <Phone fontSize="small" />
                  <Typography variant="body2">{content.header.contactPhone}</Typography>
                </Box>
              )}
              {content.header?.contactEmail && (
                <Box display="flex" alignItems="center" gap={1} sx={{ marginBottom: 2 }}>
                  <Email fontSize="small" />
                  <Typography variant="body2">{content.header.contactEmail}</Typography>
                </Box>
              )}
              <Box display="flex" gap={1} sx={{ marginTop: 2 }}>
                {content.header?.socialMedia?.facebook && (
                  <SocialIcon
                    component="a"
                    href={content.header.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Facebook />
                  </SocialIcon>
                )}
                {content.header?.socialMedia?.twitter && (
                  <SocialIcon
                    component="a"
                    href={content.header.socialMedia.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter />
                  </SocialIcon>
                )}
                {content.header?.socialMedia?.instagram && (
                  <SocialIcon
                    component="a"
                    href={content.header.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram />
                  </SocialIcon>
                )}
                {content.header?.socialMedia?.linkedin && (
                  <SocialIcon
                    component="a"
                    href={content.header.socialMedia.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkedIn />
                  </SocialIcon>
                )}
                {content.header?.socialMedia?.youtube && (
                  <SocialIcon
                    component="a"
                    href={content.header.socialMedia.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <YouTube />
                  </SocialIcon>
                )}
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)', margin: '40px 0 25px 0' }} />

          <Typography variant="body2" sx={{ textAlign: 'center', opacity: 0.9 }}>
            &copy; {new Date().getFullYear()} {content.header?.schoolName || 'School Name'}. All rights reserved.
          </Typography>
        </Container>
      </Footer>
    </Box>
  );
};

export default PublicHomePage;
