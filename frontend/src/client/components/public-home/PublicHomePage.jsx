import React, { useState, useEffect, useRef } from 'react';
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
  CircularProgress,
  Chip,
  Paper,
  useScrollTrigger,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  School,
  Phone,
  Email,
  LocationOn,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  YouTube,
  ArrowForward,
  ArrowBack,
  ChevronLeft,
  ChevronRight,
  EmojiEvents,
  Groups,
  MenuBook,
  Star,
  PlayCircleOutline,
  KeyboardArrowUp,
  Science,
  SportsBasketball,
  Palette,
  Psychology,
  Close as CloseIcon,
  Map as MapIcon,
  Person as PersonIcon,
  Login as LoginIcon,
  WhatsApp
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import axios from 'axios';
import { baseUrl } from '../../../environment';
import { useNavigate } from 'react-router-dom';
import AlertBanner from './AlertBanner';

// Image URL helper
const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('data:')) return url; // Handle base64 images
  const cleanBaseUrl = baseUrl.replace('/api', '');
  return cleanBaseUrl + url;
};

// ========== STUNNING ANIMATIONS ==========
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(60px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const floatSlow = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(2deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(124, 58, 237, 0.5),
                0 0 40px rgba(124, 58, 237, 0.3),
                0 0 60px rgba(124, 58, 237, 0.2);
  }
  50% {
    box-shadow: 0 0 30px rgba(124, 58, 237, 0.8),
                0 0 60px rgba(124, 58, 237, 0.5),
                0 0 90px rgba(124, 58, 237, 0.3);
  }
`;

const kenBurns = keyframes`
  0% { transform: scale(1) translate(0, 0); }
  100% { transform: scale(1.15) translate(-5%, -5%); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const rotate3D = keyframes`
  0% { transform: perspective(1000px) rotateY(0deg); }
  100% { transform: perspective(1000px) rotateY(360deg); }
`;

const gradientShift = keyframes`
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const scrollLeft = keyframes`
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
`;

// ========== STICKY NAV ==========
const StickyNav = styled(Box)(({ scrolled }) => ({
  background: scrolled
    ? 'rgba(255, 255, 255, 0.95)'
    : 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  boxShadow: scrolled
    ? '0 10px 40px rgba(0, 0, 0, 0.15)'
    : '0 4px 20px rgba(0, 0, 0, 0.08)',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  width: '100%',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
  transform: scrolled ? 'translateY(0)' : 'translateY(0)'
}));

// ========== SIMPLE PROFESSIONAL SLIDER ==========
const HeroSection = styled(Box)({
  position: 'relative',
  height: '500px',
  width: '100%',
  overflow: 'hidden',
  background: '#f8f9fa',
  '@media (max-width: 900px)': {
    height: '400px'
  },
  '@media (max-width: 600px)': {
    height: '300px'
  }
});

const HeroSlide = styled(Box)(({ active }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  opacity: active ? 1 : 0,
  transition: 'opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
  zIndex: active ? 1 : 0
}));

const HeroMedia = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)'
  }
});

const HeroVideo = styled('video')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block'
});

// Simple overlay for text readability
const HeroOverlay = styled(Box)(({ hastext }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  height: hastext ? '40%' : '0%',
  background: hastext ? 'linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, transparent 100%)' : 'transparent',
  zIndex: 2,
  pointerEvents: 'none'
}));

const HeroContent = styled(Box)({
  position: 'absolute',
  bottom: '10%',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 3,
  color: 'white',
  textAlign: 'center',
  padding: '0 20px',
  width: '100%',
  maxWidth: '1200px',
  animation: `${fadeInUp} 1.2s cubic-bezier(0.4, 0, 0.2, 1)`
});

// ========== SIMPLE NAVIGATION ARROWS ==========
const NavArrow = styled(IconButton)({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 3,
  background: 'rgba(255, 255, 255, 0.8)',
  color: '#1e3a8a',
  width: '45px',
  height: '45px',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.95)',
    transform: 'translateY(-50%) scale(1.05)'
  },
  '& svg': {
    fontSize: '1.5rem'
  }
});

// ========== SIMPLE DOT INDICATORS ==========
const SliderDot = styled(Box)(({ active }) => ({
  width: active ? '30px' : '10px',
  height: '10px',
  borderRadius: '5px',
  background: active ? '#0284c7' : 'rgba(255, 255, 255, 0.6)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: active ? '#0284c7' : 'rgba(255, 255, 255, 0.9)'
  }
}));

// ========== SIMPLE STAT CARDS ==========
const StatCard = styled(Paper)({
  padding: '20px 15px',
  textAlign: 'center',
  background: '#1e3a8a',
  color: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
  },
  '&::before_DISABLED': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
    animation: `${rotate3D} 20s linear infinite`,
    opacity: 0.5
  },
  '&:hover': {
    transform: 'translateY(-20px) perspective(1000px) rotateX(5deg) scale(1.05)',
    boxShadow: '0 30px 80px rgba(0, 0, 0, 0.3), 0 0 60px rgba(124, 58, 237, 0.4)',
    animation: `${float} 3s ease-in-out infinite, ${gradientShift} 5s ease infinite`
  }
});

const StatIcon = styled(Box)({
  width: '80px',
  height: '80px',
  margin: '0 auto 20px',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  animation: `${glow} 2s ease-in-out infinite`,
  '& svg': {
    fontSize: '2.5rem',
    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
  }
});

// ========== SECTION TITLE WITH GRADIENT TEXT ==========
const SectionTitle = styled(Typography)(({ color }) => ({
  fontWeight: 900,
  marginBottom: '20px',
  position: 'relative',
  display: 'inline-block',
  background: `linear-gradient(135deg, ${color || '#1e3a8a'} 0%, #7c3aed 50%, #06b6d4 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textShadow: '0 4px 20px rgba(124, 58, 237, 0.2)',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-20px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100px',
    height: '6px',
    background: `linear-gradient(90deg, ${color || '#1e3a8a'} 0%, #7c3aed 50%, #06b6d4 100%)`,
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)'
  }
}));

// ========== GLASS MORPHISM PROGRAM CARDS ==========
const ProgramCard = styled(Card)({
  height: '100%',
  borderRadius: '24px',
  overflow: 'hidden',
  position: 'relative',
  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.9) 0%, rgba(124, 58, 237, 0.9) 100%)',
    opacity: 0,
    transition: 'opacity 0.5s ease',
    zIndex: 1
  },
  '&:hover': {
    transform: 'translateY(-20px) rotate(-2deg) scale(1.05)',
    boxShadow: '0 30px 70px rgba(0, 0, 0, 0.25), 0 0 50px rgba(124, 58, 237, 0.3)'
  },
  '&:hover::before': {
    opacity: 1
  },
  '&:hover img': {
    transform: 'scale(1.2) rotate(3deg)'
  },
  '&:hover .card-content': {
    color: 'white',
    zIndex: 2,
    position: 'relative'
  },
  '&:hover .program-icon': {
    transform: 'scale(1.2) rotate(360deg)',
    color: 'white'
  }
});

// ========== MASONRY GALLERY WITH ZOOM ==========
const GalleryItem = styled(Box)({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '20px',
  height: '350px',
  cursor: 'pointer',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.7) 0%, rgba(124, 58, 237, 0.7) 100%)',
    opacity: 0,
    transition: 'opacity 0.5s ease',
    zIndex: 1
  },
  '&:hover': {
    transform: 'scale(1.08) translateY(-10px)',
    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3), 0 0 50px rgba(124, 58, 237, 0.3)',
    zIndex: 10
  },
  '&:hover::after': {
    opacity: 1
  },
  '&:hover img, &:hover video': {
    transform: 'scale(1.3) rotate(2deg)'
  }
});

// ========== BEAUTIFUL TESTIMONIAL CARDS ==========
const TestimonialCard = styled(Card)({
  height: '100%',
  padding: '40px',
  borderRadius: '24px',
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
  '&::before': {
    content: '"""',
    position: 'absolute',
    top: '15px',
    left: '25px',
    fontSize: '120px',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    opacity: 0.08,
    fontFamily: 'Georgia, serif',
    fontWeight: 'bold'
  },
  '&:hover': {
    transform: 'translateY(-15px)',
    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.2), 0 0 40px rgba(124, 58, 237, 0.2)',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 1) 100%)'
  }
});

// ========== BACK TO TOP BUTTON ==========
const BackToTop = styled(IconButton)(({ show }) => ({
  position: 'fixed',
  bottom: '40px',
  right: '40px',
  zIndex: 1000,
  width: '60px',
  height: '60px',
  background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)',
  color: 'white',
  boxShadow: '0 10px 30px rgba(124, 58, 237, 0.4)',
  opacity: show ? 1 : 0,
  visibility: show ? 'visible' : 'hidden',
  transform: show ? 'translateY(0)' : 'translateY(20px)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  animation: show ? `${bounce} 2s ease-in-out infinite` : 'none',
  '&:hover': {
    background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
    transform: 'translateY(0) scale(1.1)',
    boxShadow: '0 15px 40px rgba(124, 58, 237, 0.6)'
  }
}));

// ========== WHATSAPP FLOATING BUTTON ==========
const WhatsAppButton = styled(IconButton)({
  position: 'fixed',
  bottom: '40px',
  left: '40px',
  zIndex: 1000,
  width: '60px',
  height: '60px',
  background: '#25D366',
  color: 'white',
  boxShadow: '0 8px 25px rgba(37, 211, 102, 0.4)',
  transition: 'all 0.3s ease',
  animation: `${pulse} 2s ease-in-out infinite`,
  '&:hover': {
    background: '#20BA5A',
    transform: 'scale(1.1)',
    boxShadow: '0 12px 35px rgba(37, 211, 102, 0.6)'
  }
});

// ========== SCROLL PROGRESS BAR ==========
const ProgressBar = styled(Box)(({ progress }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  height: '4px',
  width: `${progress}%`,
  background: 'linear-gradient(90deg, #1e3a8a 0%, #7c3aed 50%, #06b6d4 100%)',
  zIndex: 9999,
  transition: 'width 0.1s ease',
  boxShadow: '0 2px 10px rgba(124, 58, 237, 0.5)'
}));

// ========== WAVE DIVIDER ==========
const WaveDivider = styled('svg')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '80px',
  transform: 'translateY(-99%)'
});

const PublicHomePage = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const observerRef = useRef(null);

  // Scroll trigger for navbar
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100
  });

  useEffect(() => {
    fetchContent();

    // Intersection Observer for scroll animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    // Scroll progress bar
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (content?.slider?.slides?.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % content.slider.slides.length);
      }, 7000); // Slower transition for Ken Burns effect
      return () => clearInterval(interval);
    }
  }, [content]);

  useEffect(() => {
    // Observe sections
    const sections = document.querySelectorAll('[data-animate="true"]');
    sections.forEach(section => {
      if (observerRef.current) {
        observerRef.current.observe(section);
      }
    });
  }, [content]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/public-home/data`);
      const homeData = response.data.data;
      console.log('📊 Home Page Data:', homeData);
      console.log('📸 Slider Data:', homeData?.slider);
      console.log('🖼️ Slides:', homeData?.slider?.slides);
      setContent(homeData);
    } catch (error) {
      console.error('Error fetching home page:', error);
      setError('Unable to load home page');
    } finally {
      setLoading(false);
    }
  };

  const getSocialIcon = (platform) => {
    const icons = {
      facebook: <Facebook />,
      twitter: <Twitter />,
      instagram: <Instagram />,
      youtube: <YouTube />,
      linkedin: <LinkedIn />
    };
    return icons[platform.toLowerCase()] || null;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #06b6d4 100%)',
          backgroundSize: '200% 200%',
          animation: `${gradientShift} 5s ease infinite`
        }}
      >
        <Box textAlign="center">
          <CircularProgress
            sx={{
              color: 'white',
              mb: 3,
              '& circle': {
                strokeLinecap: 'round'
              }
            }}
            size={80}
            thickness={4}
          />
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 600, animation: `${pulse} 2s ease-in-out infinite` }}>
            Loading Excellence...
          </Typography>
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
          background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #06b6d4 100%)',
          padding: '20px'
        }}
      >
        <Box textAlign="center" sx={{ color: 'white' }}>
          <School sx={{ fontSize: 120, mb: 3, animation: `${float} 3s ease-in-out infinite` }} />
          <Typography variant="h2" gutterBottom fontWeight="bold">Welcome</Typography>
          <Typography variant="h6" sx={{ mb: 5, opacity: 0.9 }}>Our website is being set up</Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/login')}
            sx={{
              background: 'white',
              color: '#1e3a8a',
              px: 5,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                background: '#f8f9fa',
                transform: 'translateY(-5px)',
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)'
              }
            }}
          >
            Admin Login
          </Button>
        </Box>
      </Box>
    );
  }

  const { header, slider, statistics, about, programs, gallery, testimonials, announcements, achievements, features, sectionVisibility, alertBanner, socialMedia } = content;
  const sliders = slider?.slides || [];
  const testimonialsArray = testimonials?.items || [];
  const statisticsArray = statistics?.stats || [];
  const featuresArray = features?.items || [];
  const achievementsArray = achievements?.items || [];
  const announcementsArray = announcements?.items || [];

  // WhatsApp number from backend
  const whatsappNumber = socialMedia?.whatsapp || '';

  // Debug: Log slider information
  console.log('🔍 Slider Debug:');
  console.log('  - slider?.showSlider:', slider?.showSlider);
  console.log('  - sliders?.length:', sliders?.length);
  console.log('  - Condition met:', slider?.showSlider && sliders?.length > 0);
  if (sliders.length > 0) {
    console.log('  - First slide:', sliders[0]);
    console.log('  - First slide URL:', getImageUrl(sliders[0]?.url));
    console.log('  - Image URL construction test:', {
      baseUrl,
      cleanedBase: baseUrl.replace('/api', ''),
      slideUrl: sliders[0]?.url,
      finalUrl: getImageUrl(sliders[0]?.url)
    });
  }

  return (
    <Box sx={{ width: '100%', overflow: 'hidden', position: 'relative' }}>

      {/* MOBILE-RESPONSIVE HEADER */}
      <StickyNav scrolled={trigger}>
        <Container maxWidth="xl">
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: { xs: 1.5, md: 2 },
            gap: 2
          }}>
            {/* Logo and School Name */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 }, flex: 1 }}>
              {header?.logo && (
                <Avatar
                  src={getImageUrl(header.logo)}
                  alt={header?.siteName}
                  sx={{
                    width: { xs: 40, sm: 50, md: 60 },
                    height: { xs: 40, sm: 50, md: 60 },
                    border: '2px solid',
                    borderColor: header?.primaryColor || '#1e3a8a',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}
                />
              )}
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.3rem' },
                    color: header?.primaryColor || '#1e3a8a',
                    lineHeight: 1.2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: { xs: 'normal', sm: 'nowrap' },
                    display: '-webkit-box',
                    WebkitLineClamp: { xs: 2, sm: 'unset' },
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {header?.siteName || 'School Management System'}
                </Typography>
                {header?.tagline && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      fontSize: { xs: '0.65rem', sm: '0.75rem' },
                      display: { xs: 'none', sm: 'block' }
                    }}
                  >
                    {header.tagline}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', gap: { xs: 1, md: 2 }, alignItems: 'center', flexShrink: 0 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<PersonIcon sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }} />}
                onClick={() => navigate('/login')}
                sx={{
                  borderColor: header?.primaryColor || '#1e3a8a',
                  color: header?.primaryColor || '#1e3a8a',
                  fontWeight: 600,
                  fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
                  px: { xs: 1, sm: 1.5, md: 2 },
                  py: { xs: 0.5, md: 0.75 },
                  borderRadius: '8px',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: header?.primaryColor || '#1e3a8a',
                    background: `${header?.primaryColor || '#1e3a8a'}15`,
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Login</Box>
                <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Login</Box>
              </Button>
              <Button
                variant="contained"
                size="small"
                startIcon={<LoginIcon sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }} />}
                onClick={() => navigate('/register')}
                sx={{
                  background: `linear-gradient(135deg, ${header?.primaryColor || '#1e3a8a'} 0%, ${header?.secondaryColor || '#0284c7'} 100%)`,
                  color: 'white',
                  fontWeight: 600,
                  fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
                  px: { xs: 1, sm: 1.5, md: 2 },
                  py: { xs: 0.5, md: 0.75 },
                  borderRadius: '8px',
                  textTransform: 'none',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  '&:hover': {
                    background: `linear-gradient(135deg, ${header?.secondaryColor || '#0284c7'} 0%, ${header?.primaryColor || '#1e3a8a'} 100%)`,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
                  }
                }}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Register</Box>
                <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Join</Box>
              </Button>
            </Box>
          </Box>
        </Container>
      </StickyNav>

      {/* SIMPLE PROFESSIONAL SLIDER */}
      {sliders?.length > 0 ? (
        <HeroSection>
          {sliders.map((slide, index) => (
            <HeroSlide key={index} active={currentSlide === index}>
              {slide.type === 'video' ? (
                <HeroVideo
                  src={getImageUrl(slide.url)}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload={index === 0 ? "auto" : "none"}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              ) : (
                <HeroMedia
                  src={getImageUrl(slide.url)}
                  alt={slide.title}
                  active={currentSlide === index}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  onClick={() => {
                    setSelectedImage(getImageUrl(slide.url));
                    setImageDialogOpen(true);
                  }}
                />
              )}
              {/* Only show overlay and content if title/description exist */}
              {(slide.title || slide.description) && (
                <HeroOverlay hastext={true} />
              )}
            </HeroSlide>
          ))}

          {/* Only show content if title or description exists */}
          {(sliders[currentSlide]?.title || sliders[currentSlide]?.description) && (
            <HeroContent>
              <Container maxWidth="lg">
                {sliders[currentSlide]?.title && (
                  <Typography
                    variant="h1"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                      fontSize: { xs: '2.5rem', md: '5rem' },
                      textShadow: '0 4px 20px rgba(0, 0, 0, 0.5), 0 8px 40px rgba(0, 0, 0, 0.3)',
                      mb: 3
                    }}
                  >
                    {sliders[currentSlide].title}
                  </Typography>
                )}
                {sliders[currentSlide]?.description && (
                  <Typography
                    variant="h4"
                    sx={{
                      mb: 5,
                      fontSize: { xs: '1.2rem', md: '2.2rem' },
                      textShadow: '0 2px 15px rgba(0, 0, 0, 0.5)',
                      fontWeight: 400,
                      opacity: 0.95
                    }}
                  >
                    {sliders[currentSlide].description}
                  </Typography>
                )}
                {sliders[currentSlide]?.buttonText && (
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    href={sliders[currentSlide].buttonLink || '#'}
                    sx={{
                      background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                      color: 'white',
                      px: 6,
                      py: 2.5,
                      fontSize: '1.3rem',
                      fontWeight: 'bold',
                      borderRadius: '15px',
                      boxShadow: '0 10px 30px rgba(245, 158, 11, 0.4)',
                      transition: 'all 0.4s ease',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                        transform: 'translateY(-5px) scale(1.05)',
                        boxShadow: '0 15px 40px rgba(245, 158, 11, 0.6)'
                      }
                    }}
                  >
                    {sliders[currentSlide].buttonText}
                  </Button>
                )}
              </Container>
            </HeroContent>
          )}

          {/* Elegant Navigation Arrows */}
          {sliders.length > 1 && (
            <>
              <NavArrow
                onClick={() => setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length)}
                sx={{ left: 40 }}
              >
                <ChevronLeft />
              </NavArrow>
              <NavArrow
                onClick={() => setCurrentSlide((prev) => (prev + 1) % sliders.length)}
                sx={{ right: 40 }}
              >
                <ChevronRight />
              </NavArrow>

              {/* Animated Dot Indicators */}
              <Box sx={{ position: 'absolute', bottom: 50, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 2, zIndex: 3 }}>
                {sliders.map((_, index) => (
                  <SliderDot
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    active={currentSlide === index}
                  />
                ))}
              </Box>
            </>
          )}
        </HeroSection>
      ) : (
        <HeroSection>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #06b6d4 100%)',
              backgroundSize: '200% 200%',
              animation: `${gradientShift} 10s ease infinite`,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at 20% 50%, rgba(124, 58, 237, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)',
                animation: `${float} 8s ease-in-out infinite`
              }
            }}
          />
          <HeroContent sx={{ bottom: 'auto' }}>
            <Container maxWidth="lg">
              <Typography
                variant="h1"
                fontWeight="bold"
                gutterBottom
                sx={{
                  fontSize: { xs: '2.5rem', md: '5.5rem' },
                  textShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
                  mb: 3
                }}
              >
                {header?.schoolName || 'Welcome to Our School'}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  mb: 6,
                  fontSize: { xs: '1.3rem', md: '2.5rem' },
                  fontWeight: 400,
                  opacity: 0.95
                }}
              >
                {header?.tagline || 'Shaping Tomorrow\'s Leaders Today'}
              </Typography>
              {/* Enroll Now button removed as requested */}
            </Container>
          </HeroContent>
        </HeroSection>
      )}

      {/* MOVING NEWS TICKER */}
      {announcements?.showSection && announcementsArray?.filter(item => item.published)?.length > 0 && (
        <Box sx={{
          background: '#0284c7',
          color: 'white',
          py: 1.5,
          overflow: 'hidden',
          borderTop: '2px solid #1e3a8a',
          borderBottom: '2px solid #1e3a8a'
        }}>
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: '700', whiteSpace: 'nowrap', fontSize: '0.9rem' }}>
                📢 LATEST NEWS:
              </Typography>
              <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                <Box sx={{
                  display: 'flex',
                  gap: 4,
                  animation: `${scrollLeft} 30s linear infinite`,
                  whiteSpace: 'nowrap'
                }}>
                  {announcementsArray.filter(item => item.published).map((news, index) => (
                    <Typography key={index} variant="body2" sx={{ fontSize: '0.85rem' }}>
                      {news.title} • {new Date(news.date).toLocaleDateString()}
                    </Typography>
                  ))}
                  {announcementsArray.filter(item => item.published).map((news, index) => (
                    <Typography key={`dup-${index}`} variant="body2" sx={{ fontSize: '0.85rem' }}>
                      {news.title} • {new Date(news.date).toLocaleDateString()}
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>
      )}

      {/* STATISTICS CARDS */}
      {statistics?.showSection && statisticsArray?.length > 0 && (
        <Box
          sx={{
            py: 2,
            position: 'relative',
            animation: visibleSections['statistics'] ? `${fadeInUp} 1s ease-out` : 'none'
          }}
          id="statistics"
          data-animate="true"
        >
          <Container maxWidth="xl">
            <Grid container spacing={2}>
              {statisticsArray.map((stat, index) => {
                const icons = [
                  <Groups sx={{ fontSize: '1.5rem' }} />,
                  <MenuBook sx={{ fontSize: '1.5rem' }} />,
                  <EmojiEvents sx={{ fontSize: '1.5rem' }} />,
                  <Star sx={{ fontSize: '1.5rem' }} />
                ];
                return (
                  <Grid item xs={6} sm={3} key={index}>
                    <StatCard elevation={1}>
                      <Box sx={{ fontSize: '1.5rem', mb: 0.5, opacity: 0.9 }}>
                        {icons[index % icons.length]}
                      </Box>
                      <Typography variant="h4" fontWeight="700" sx={{ fontSize: '1.8rem', mb: 0.3 }}>
                        {stat.value}{stat.suffix || ''}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', opacity: 0.85 }}>
                        {stat.label}
                      </Typography>
                    </StatCard>
                  </Grid>
                );
              })}
            </Grid>
          </Container>
        </Box>
      )}

      {/* ADMISSION SECTION - MOST IMPORTANT */}
      <Box sx={{
        py: 6,
        background: 'linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '50%'
        }
      }}>
        <Container maxWidth="lg">
          <Box textAlign="center">
            <Box sx={{ fontSize: '4rem', mb: 2 }}>🎓</Box>
            <Typography variant="h3" fontWeight="700" sx={{ mb: 2 }}>
              Admissions Open
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.95, maxWidth: '700px', mx: 'auto' }}>
              Join our community of learners and unlock your child's potential. Limited seats available for the upcoming academic year.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  background: 'white',
                  color: '#1e3a8a',
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: '700',
                  borderRadius: '8px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  '&:hover': {
                    background: '#f8f9fa',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
                  }
                }}
              >
                Apply Now
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/contact')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: '700',
                  borderRadius: '8px',
                  borderWidth: '2px',
                  '&:hover': {
                    borderColor: 'white',
                    background: 'rgba(255,255,255,0.1)',
                    borderWidth: '2px',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Contact Us
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* FEATURES SECTION - MODERN & BEAUTIFUL */}
      {features?.showSection && featuresArray?.length > 0 && (
        <Box sx={{ py: 6, background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)' }}>
          <Container maxWidth="xl">
            <Typography
              variant="h4"
              align="center"
              fontWeight="700"
              sx={{
                mb: 1,
                color: '#1e3a8a',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '4px',
                  background: 'linear-gradient(90deg, #0284c7, #1e3a8a)',
                  borderRadius: '2px'
                }
              }}
            >
              {features.sectionTitle || 'Why Choose Us'}
            </Typography>
            <Typography variant="body1" align="center" sx={{ mb: 4, color: '#6b7280', maxWidth: '600px', mx: 'auto' }}>
              Excellence in education with modern facilities and experienced faculty
            </Typography>
            <Grid container spacing={3}>
              {featuresArray.slice(0, 4).map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 3,
                      background: 'white',
                      borderRadius: '16px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      transition: 'all 0.3s ease',
                      height: '100%',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.12)'
                      }
                    }}
                  >
                    <Box
                      sx={{
                        fontSize: '3rem',
                        mb: 1.5,
                        color: '#0284c7',
                        display: 'inline-block',
                        p: 2,
                        background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)',
                        borderRadius: '50%'
                      }}
                    >
                      {feature.icon === 'students' && <Groups />}
                      {feature.icon === 'teachers' && <MenuBook />}
                      {feature.icon === 'classes' && <School />}
                      {feature.icon === 'exams' && <EmojiEvents />}
                    </Box>
                    <Typography variant="h6" fontWeight="600" sx={{ mb: 1, color: '#1e3a8a' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {/* SCHOOL FACILITIES - SPORTS & CLASSROOMS */}
      <Box sx={{ py: 6, background: '#ffffff' }}>
        <Container maxWidth="xl">
          <Typography
            variant="h4"
            align="center"
            fontWeight="700"
            sx={{
              mb: 1,
              color: '#1e3a8a',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '4px',
                background: 'linear-gradient(90deg, #0284c7, #1e3a8a)',
                borderRadius: '2px'
              }
            }}
          >
            Our Facilities
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 4, color: '#6b7280' }}>
            State-of-the-art infrastructure for holistic development
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{
                p: 3,
                background: 'linear-gradient(135deg, #e0f2fe 0%, #ffffff 100%)',
                borderRadius: '12px',
                border: '2px solid #0284c7',
                transition: 'all 0.3s ease',
                height: '100%',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px rgba(2,132,199,0.2)'
                }
              }}>
                <Box sx={{ fontSize: '3rem', mb: 1.5, textAlign: 'center' }}>🏀</Box>
                <Typography variant="h6" fontWeight="700" sx={{ mb: 1, color: '#1e3a8a', textAlign: 'center' }}>
                  Sports Complex
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Basketball, Football, Cricket grounds, Indoor badminton and table tennis facilities
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{
                p: 3,
                background: 'linear-gradient(135deg, #e0f2fe 0%, #ffffff 100%)',
                borderRadius: '12px',
                border: '2px solid #0284c7',
                transition: 'all 0.3s ease',
                height: '100%',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px rgba(2,132,199,0.2)'
                }
              }}>
                <Box sx={{ fontSize: '3rem', mb: 1.5, textAlign: 'center' }}>💻</Box>
                <Typography variant="h6" fontWeight="700" sx={{ mb: 1, color: '#1e3a8a', textAlign: 'center' }}>
                  Smart Classrooms
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Digital boards, projectors, AC rooms with modern teaching aids and interactive learning
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{
                p: 3,
                background: 'linear-gradient(135deg, #e0f2fe 0%, #ffffff 100%)',
                borderRadius: '12px',
                border: '2px solid #0284c7',
                transition: 'all 0.3s ease',
                height: '100%',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px rgba(2,132,199,0.2)'
                }
              }}>
                <Box sx={{ fontSize: '3rem', mb: 1.5, textAlign: 'center' }}>🔬</Box>
                <Typography variant="h6" fontWeight="700" sx={{ mb: 1, color: '#1e3a8a', textAlign: 'center' }}>
                  Science Labs
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Physics, Chemistry, Biology and Computer labs with latest equipment and safety standards
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ACHIEVEMENTS SECTION - MODERN GRADIENT CARDS */}
      {achievements?.showSection && achievementsArray?.length > 0 && (
        <Box sx={{ py: 6, background: '#ffffff' }}>
          <Container maxWidth="xl">
            <Typography
              variant="h4"
              align="center"
              fontWeight="700"
              sx={{
                mb: 1,
                color: '#1e3a8a',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '4px',
                  background: 'linear-gradient(90deg, #0284c7, #1e3a8a)',
                  borderRadius: '2px'
                }
              }}
            >
              {achievements.sectionTitle || 'Our Achievements'}
            </Typography>
            <Typography variant="body1" align="center" sx={{ mb: 4, color: '#6b7280' }}>
              Celebrating excellence and success
            </Typography>
            <Grid container spacing={3}>
              {achievementsArray.slice(0, 3).map((achievement, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Box
                    sx={{
                      p: 3,
                      background: 'linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)',
                      borderRadius: '12px',
                      color: 'white',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      height: '100%',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px rgba(30,58,138,0.3)'
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -50,
                        right: -50,
                        width: 100,
                        height: 100,
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '50%'
                      }
                    }}
                  >
                    <Box sx={{ fontSize: '2.5rem', mb: 1 }}>
                      <EmojiEvents />
                    </Box>
                    <Typography variant="h6" fontWeight="700" sx={{ mb: 0.5 }}>
                      {achievement.title}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {achievement.year}
                    </Typography>
                    {achievement.description && (
                      <Typography variant="caption" sx={{ mt: 1, display: 'block', opacity: 0.8 }}>
                        {achievement.description}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {/* NEWS & EVENTS SECTION - MODERN CARDS WITH IMAGES */}
      {announcements?.showSection && announcementsArray?.length > 0 && (
        <Box sx={{ py: 6, background: 'linear-gradient(135deg, #f8f9fa 0%, #e5e7eb 100%)' }}>
          <Container maxWidth="xl">
            <Typography
              variant="h4"
              align="center"
              fontWeight="700"
              sx={{
                mb: 1,
                color: '#1e3a8a',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '4px',
                  background: 'linear-gradient(90deg, #0284c7, #1e3a8a)',
                  borderRadius: '2px'
                }
              }}
            >
              {announcements.sectionTitle || 'Latest News & Events'}
            </Typography>
            <Typography variant="body1" align="center" sx={{ mb: 4, color: '#6b7280' }}>
              Stay updated with our latest activities and announcements
            </Typography>
            <Grid container spacing={3}>
              {announcementsArray.filter(item => item.published).slice(0, 3).map((announcement, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Box
                    sx={{
                      background: 'white',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      transition: 'all 0.3s ease',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    {announcement.image && (
                      <Box
                        component="img"
                        src={getImageUrl(announcement.image)}
                        alt={announcement.title}
                        sx={{
                          width: '100%',
                          height: 200,
                          objectFit: 'cover'
                        }}
                      />
                    )}
                    <Box sx={{ p: 2.5, flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight="600" sx={{ mb: 1, color: '#1e3a8a', lineHeight: 1.4 }}>
                        {announcement.title}
                      </Typography>
                      {announcement.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.6 }}>
                          {announcement.description.substring(0, 100)}{announcement.description.length > 100 ? '...' : ''}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#0284c7' }}>
                        <Box sx={{ fontSize: '1rem' }}>📅</Box>
                        <Typography variant="caption" sx={{ fontWeight: 500 }}>
                          {announcement.date ? new Date(announcement.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : ''}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {/* ABOUT SECTION WITH PARALLAX */}
      {sectionVisibility?.showAbout && about && (
        <Box
          id="about"
          data-animate="true"
          sx={{
            bgcolor: 'white',
            py: 12,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle at 10% 20%, rgba(30, 58, 138, 0.03) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(124, 58, 237, 0.03) 0%, transparent 50%)',
              pointerEvents: 'none'
            }
          }}
        >
          <Container maxWidth="xl">
            <Box
              textAlign="center"
              mb={10}
              sx={{
                animation: visibleSections['about'] ? `${fadeInUp} 1s ease-out` : 'none'
              }}
            >
              <SectionTitle variant="h2" color={header?.primaryColor}>
                {about.heading || 'About Our School'}
              </SectionTitle>
              <Typography variant="h5" color="text.secondary" sx={{ mt: 4, fontWeight: 400, maxWidth: '800px', mx: 'auto' }}>
                {about.subheading || 'Our Story'}
              </Typography>
            </Box>
            <Grid container spacing={8} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    animation: visibleSections['about'] ? `${slideInLeft} 1s ease-out` : 'none'
                  }}
                >
                  <Typography
                    variant="body1"
                    paragraph
                    sx={{
                      fontSize: '1.2rem',
                      lineHeight: 2,
                      color: 'text.primary',
                      mb: 4
                    }}
                  >
                    {about.description}
                  </Typography>

                  {about.mission && (
                    <Box
                      sx={{
                        mt: 4,
                        p: 5,
                        background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)',
                        borderLeft: `6px solid ${header?.primaryColor}`,
                        borderRadius: '16px',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.4s ease',
                        '&:hover': {
                          transform: 'translateX(10px)',
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                        }
                      }}
                    >
                      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: header?.primaryColor }}>
                        Our Mission
                      </Typography>
                      <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                        {about.mission}
                      </Typography>
                    </Box>
                  )}

                  {about.vision && (
                    <Box
                      sx={{
                        mt: 4,
                        p: 5,
                        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%)',
                        borderLeft: '6px solid #7c3aed',
                        borderRadius: '16px',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.4s ease',
                        '&:hover': {
                          transform: 'translateX(10px)',
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                        }
                      }}
                    >
                      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#7c3aed' }}>
                        Our Vision
                      </Typography>
                      <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                        {about.vision}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    animation: visibleSections['about'] ? `${slideInRight} 1s ease-out` : 'none'
                  }}
                >
                  {about.images?.length > 0 && (
                    <Grid container spacing={3}>
                      {about.images.slice(0, 4).map((image, index) => (
                        <Grid item xs={6} key={index}>
                          <Box
                            sx={{
                              overflow: 'hidden',
                              borderRadius: '20px',
                              height: '280px',
                              boxShadow: '0 15px 50px rgba(0, 0, 0, 0.15)',
                              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                              position: 'relative',
                              animation: `${float} ${5 + index}s ease-in-out infinite`,
                              animationDelay: `${index * 0.2}s`,
                              '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.3) 0%, rgba(124, 58, 237, 0.3) 100%)',
                                opacity: 0,
                                transition: 'opacity 0.4s ease'
                              },
                              '&:hover': {
                                transform: 'scale(1.08) translateY(-10px)',
                                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
                                zIndex: 10
                              },
                              '&:hover::after': {
                                opacity: 1
                              },
                              '&:hover img': {
                                transform: 'scale(1.2) rotate(2deg)'
                              }
                            }}
                          >
                            <img
                              src={getImageUrl(image)}
                              alt={`About ${index + 1}`}
                              loading="lazy"
                              decoding="async"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                willChange: 'transform'
                              }}
                            />
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      )}

      {/* PROGRAMS WITH GLASS MORPHISM */}
      {sectionVisibility?.showPrograms && programs?.length > 0 && (
        <Box
          id="programs"
          data-animate="true"
          sx={{
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            py: 12,
            position: 'relative'
          }}
        >
          <Container maxWidth="xl">
            <Box
              textAlign="center"
              mb={10}
              sx={{
                animation: visibleSections['programs'] ? `${fadeInUp} 1s ease-out` : 'none'
              }}
            >
              <SectionTitle variant="h2" color={header?.primaryColor}>
                Our Programs
              </SectionTitle>
              <Typography variant="h5" color="text.secondary" sx={{ mt: 4, maxWidth: '900px', mx: 'auto', fontWeight: 400 }}>
                Comprehensive educational programs designed to nurture young minds and unlock their full potential
              </Typography>
            </Box>
            <Grid container spacing={5}>
              {programs.map((program, index) => {
                const programIcons = [MenuBook, Science, SportsBasketball, Palette, Psychology];
                const IconComponent = programIcons[index % programIcons.length];

                return (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <ProgramCard
                      elevation={5}
                      sx={{
                        animation: visibleSections['programs'] ? `${fadeInUp} 1s ease-out ${index * 0.1}s` : 'none'
                      }}
                    >
                      {program.image && (
                        <CardMedia
                          component="img"
                          height="250"
                          image={getImageUrl(program.image)}
                          alt={program.title}
                          loading="lazy"
                          sx={{
                            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                            willChange: 'transform'
                          }}
                        />
                      )}
                      <CardContent sx={{ p: 4 }} className="card-content">
                        <IconComponent
                          className="program-icon"
                          sx={{
                            fontSize: 70,
                            color: header?.primaryColor,
                            mb: 3,
                            transition: 'all 0.5s ease'
                          }}
                        />
                        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                          {program.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.8 }}>
                          {program.description}
                        </Typography>
                        {program.ageGroup && (
                          <Chip
                            label={`Age: ${program.ageGroup}`}
                            sx={{
                              mt: 2,
                              background: `linear-gradient(135deg, ${header?.primaryColor} 0%, #7c3aed 100%)`,
                              color: 'white',
                              fontWeight: 700,
                              fontSize: '0.9rem',
                              px: 2,
                              py: 2.5,
                              height: 'auto'
                            }}
                          />
                        )}
                      </CardContent>
                    </ProgramCard>
                  </Grid>
                );
              })}
            </Grid>
          </Container>
        </Box>
      )}

      {/* MASONRY GALLERY */}
      {sectionVisibility?.showGallery && gallery?.length > 0 && (
        <Box
          id="gallery"
          data-animate="true"
          sx={{ bgcolor: 'white', py: 12 }}
        >
          <Container maxWidth="xl">
            <Box
              textAlign="center"
              mb={10}
              sx={{
                animation: visibleSections['gallery'] ? `${fadeInUp} 1s ease-out` : 'none'
              }}
            >
              <SectionTitle variant="h2" color={header?.primaryColor}>
                Our Gallery
              </SectionTitle>
              <Typography variant="h5" color="text.secondary" sx={{ mt: 4, fontWeight: 400 }}>
                A glimpse into our vibrant school life and memorable moments
              </Typography>
            </Box>
            <Grid container spacing={4}>
              {gallery.slice(0, 8).map((item, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <GalleryItem
                    sx={{
                      animation: visibleSections['gallery'] ? `${fadeInUp} 1s ease-out ${index * 0.05}s` : 'none'
                    }}
                  >
                    {item.mediaType === 'video' ? (
                      <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                        <video
                          src={getImageUrl(item.url)}
                          preload="none"
                          loading="lazy"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                            willChange: 'transform'
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '50%',
                            width: 70,
                            height: 70,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 2,
                            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translate(-50%, -50%) scale(1.2)',
                              background: 'white'
                            }
                          }}
                        >
                          <PlayCircleOutline sx={{ fontSize: 45, color: header?.primaryColor }} />
                        </Box>
                      </Box>
                    ) : (
                      <img
                        src={getImageUrl(item.url)}
                        alt={item.title || `Gallery ${index + 1}`}
                        loading="lazy"
                        decoding="async"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                          willChange: 'transform'
                        }}
                      />
                    )}
                  </GalleryItem>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {/* TESTIMONIALS CAROUSEL */}
      {sectionVisibility?.showTestimonials && testimonialsArray?.length > 0 && (
        <Box
          id="testimonials"
          data-animate="true"
          sx={{
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            py: 12
          }}
        >
          <Container maxWidth="xl">
            <Box
              textAlign="center"
              mb={10}
              sx={{
                animation: visibleSections['testimonials'] ? `${fadeInUp} 1s ease-out` : 'none'
              }}
            >
              <SectionTitle variant="h2" color={header?.primaryColor}>
                What Parents Say
              </SectionTitle>
              <Typography variant="h5" color="text.secondary" sx={{ mt: 4, fontWeight: 400 }}>
                Hear from our wonderful school community
              </Typography>
            </Box>
            <Grid container spacing={5}>
              {testimonialsArray.slice(0, 3).map((testimonial, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <TestimonialCard
                    elevation={5}
                    sx={{
                      animation: visibleSections['testimonials'] ? `${fadeInUp} 1s ease-out ${index * 0.15}s` : 'none'
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={2.5} mb={4}>
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          background: `linear-gradient(135deg, ${header?.primaryColor} 0%, #7c3aed 100%)`,
                          fontSize: '2rem',
                          fontWeight: 'bold',
                          border: '4px solid white',
                          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                        }}
                      >
                        {testimonial.parentName?.charAt(0) || 'P'}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                          {testimonial.parentName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                          Parent of {testimonial.studentName}
                        </Typography>
                      </Box>
                    </Box>
                    <Box mb={3}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          sx={{
                            color: i < (testimonial.rating || 5) ? '#f59e0b' : '#E0E0E0',
                            fontSize: 28,
                            filter: i < (testimonial.rating || 5) ? 'drop-shadow(0 2px 4px rgba(245, 158, 11, 0.3))' : 'none',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.2) rotate(15deg)'
                            }
                          }}
                        />
                      ))}
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        fontStyle: 'italic',
                        lineHeight: 2,
                        position: 'relative',
                        zIndex: 1,
                        fontSize: '1.05rem',
                        color: 'text.primary'
                      }}
                    >
                      "{testimonial.comment || testimonial.testimonial}"
                    </Typography>
                  </TestimonialCard>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {/* WHATSAPP FLOATING BUTTON */}
      {whatsappNumber && (
        <WhatsAppButton
          onClick={() => window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`, '_blank')}
          title="Chat with us on WhatsApp"
        >
          <WhatsApp sx={{ fontSize: '2rem' }} />
        </WhatsAppButton>
      )}

      {/* BACK TO TOP BUTTON */}
      <BackToTop show={showBackToTop} onClick={scrollToTop}>
        <KeyboardArrowUp sx={{ fontSize: '2rem' }} />
      </BackToTop>

      {/* IMAGE VIEWER DIALOG */}
      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, md: '20px' },
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
            maxHeight: { xs: '100vh', md: '90vh' },
            m: { xs: 0, md: 2 }
          }
        }}
        fullScreen={window.innerWidth < 768}
      >
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2,
          color: 'white',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Typography variant="h6" fontWeight="bold">
            Image Preview
          </Typography>
          <IconButton
            onClick={() => setImageDialogOpen(false)}
            sx={{
              color: 'white',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
                transform: 'rotate(90deg)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{
          p: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: { xs: '70vh', md: '500px' },
          background: 'rgba(0, 0, 0, 0.95)'
        }}>
          {selectedImage && (
            <Box
              component="img"
              src={selectedImage}
              alt="Slider Image"
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: { xs: '70vh', md: '80vh' },
                objectFit: 'contain',
                cursor: 'zoom-in'
              }}
              onClick={(e) => {
                if (e.currentTarget.style.objectFit === 'contain') {
                  e.currentTarget.style.objectFit = 'cover';
                  e.currentTarget.style.cursor = 'zoom-out';
                } else {
                  e.currentTarget.style.objectFit = 'contain';
                  e.currentTarget.style.cursor = 'zoom-in';
                }
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* MAP DIALOG */}
      <Dialog
        open={mapDialogOpen}
        onClose={() => setMapDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 1) 100%)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <LocationOn sx={{ fontSize: 32, color: header?.primaryColor || '#667eea' }} />
            <Typography variant="h5" fontWeight="bold">
              Our Location
            </Typography>
          </Box>
          <IconButton onClick={() => setMapDialogOpen(false)} sx={{ color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, minHeight: '450px' }}>
          {header?.mapLocation?.embedUrl ? (
            <iframe
              src={header.mapLocation.embedUrl}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="School Location Map"
            />
          ) : header?.mapLocation?.mapUrl ? (
            <Box
              sx={{
                width: '100%',
                height: '450px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#f5f5f5'
              }}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<MapIcon />}
                onClick={() => window.open(header.mapLocation.mapUrl, '_blank')}
                sx={{
                  background: `linear-gradient(135deg, ${header?.primaryColor || '#667eea'} 0%, #7c3aed 100%)`,
                  color: 'white',
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: '12px',
                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                  '&:hover': {
                    background: `linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)`,
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 35px rgba(124, 58, 237, 0.5)'
                  }
                }}
              >
                Open in Google Maps
              </Button>
            </Box>
          ) : header?.mapLocation?.latitude && header?.mapLocation?.longitude ? (
            <iframe
              src={`https://www.google.com/maps?q=${header.mapLocation.latitude},${header.mapLocation.longitude}&z=${header.mapLocation.zoom || 15}&output=embed`}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="School Location Map"
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                height: '450px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#f5f5f5'
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Map location not configured
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
          {header?.address && (
            <Box textAlign="center" width="100%">
              <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <LocationOn fontSize="small" />
                {header.address}
              </Typography>
            </Box>
          )}
        </DialogActions>
      </Dialog>

      {/* CONTACT & LOCATION SECTION */}
      {content?.contact?.showSection && (
        <Box sx={{ py: 6, background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)' }}>
          <Container maxWidth="xl">
            <Typography
              variant="h4"
              align="center"
              fontWeight="700"
              sx={{
                mb: 1,
                color: '#1e3a8a',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '4px',
                  background: 'linear-gradient(90deg, #0284c7, #1e3a8a)',
                  borderRadius: '2px'
                }
              }}
            >
              Get In Touch
            </Typography>
            <Typography variant="body1" align="center" sx={{ mb: 4, color: '#6b7280' }}>
              Visit us or reach out for any inquiries
            </Typography>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box sx={{
                  p: 4,
                  background: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}>
                  {content.contact.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Box sx={{
                        p: 1.5,
                        background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Phone sx={{ color: '#0284c7', fontSize: '1.5rem' }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Phone</Typography>
                        <Typography variant="h6" fontWeight="600" sx={{ color: '#1e3a8a' }}>
                          {content.contact.phone}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  {content.contact.email && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Box sx={{
                        p: 1.5,
                        background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Email sx={{ color: '#0284c7', fontSize: '1.5rem' }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Email</Typography>
                        <Typography variant="h6" fontWeight="600" sx={{ color: '#1e3a8a' }}>
                          {content.contact.email}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  {content.contact.address && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{
                        p: 1.5,
                        background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <LocationOn sx={{ color: '#0284c7', fontSize: '1.5rem' }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Address</Typography>
                        <Typography variant="h6" fontWeight="600" sx={{ color: '#1e3a8a' }}>
                          {content.contact.address}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => setMapDialogOpen(true)}
                    sx={{
                      mt: 3,
                      py: 1.5,
                      background: 'linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)',
                      color: 'white',
                      fontWeight: '700',
                      borderRadius: '8px',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #0284c7 0%, #1e3a8a 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(30,58,138,0.3)'
                      }
                    }}
                  >
                    View on Map 📍
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  height: '350px'
                }}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1!2d-73.98!3d40.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ1JzAwLjAiTiA3M8KwNTgnNDguMCJX!5e0!3m2!1sen!2sus!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="School Location"
                  />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      )}

      {/* TINY FOOTER */}
      <Box
        component="footer"
        sx={{
          background: '#1e3a8a',
          color: 'white',
          py: 0.5,
          mt: 3,
          textAlign: 'center'
        }}
      >
        <Typography variant="caption" sx={{ fontSize: '0.7rem', opacity: 0.6 }}>
          © {new Date().getFullYear()} {header?.siteName || 'School'}
        </Typography>
      </Box>
    </Box>
  );
};

export default PublicHomePage;
