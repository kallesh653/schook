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
  useScrollTrigger
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
  Psychology
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import axios from 'axios';
import { baseUrl } from '../../../environment';
import { useNavigate } from 'react-router-dom';

// Image URL helper
const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
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

// ========== GLASS MORPHISM TOP BAR ==========
const TopBar = styled(Box)(({ bgcolor }) => ({
  background: `linear-gradient(135deg,
    ${bgcolor || 'rgba(30, 58, 138, 0.95)'} 0%,
    rgba(124, 58, 237, 0.95) 100%)`,
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  color: 'white',
  padding: '14px 0',
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
    animation: `${shimmer} 3s infinite`
  }
}));

// ========== STUNNING STICKY NAV ==========
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

// ========== STUNNING FULL-SCREEN SLIDER ==========
const HeroSection = styled(Box)({
  position: 'relative',
  height: '100vh',
  width: '100%',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
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

const HeroMedia = styled('img')(({ active }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  animation: active ? `${kenBurns} 20s ease-out forwards` : 'none',
  transform: 'scale(1)',
  transformOrigin: 'center center'
}));

const HeroVideo = styled('video')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transform: 'scale(1.1)'
});

// Beautiful gradient overlay at BOTTOM only
const HeroOverlay = styled(Box)(({ hastext }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  height: hastext ? '50%' : '30%',
  background: hastext
    ? 'linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(30, 58, 138, 0.4) 50%, transparent 100%)'
    : 'linear-gradient(to top, rgba(0, 0, 0, 0.3) 0%, transparent 100%)',
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

// ========== ELEGANT NAVIGATION ARROWS ==========
const NavArrow = styled(IconButton)({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 3,
  background: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  color: 'white',
  width: '70px',
  height: '70px',
  border: '2px solid rgba(255, 255, 255, 0.3)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.3)',
    transform: 'translateY(-50%) scale(1.1)',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
    borderColor: 'rgba(255, 255, 255, 0.6)'
  },
  '& svg': {
    fontSize: '2.5rem'
  }
});

// ========== ANIMATED DOT INDICATORS ==========
const SliderDot = styled(Box)(({ active }) => ({
  width: active ? '50px' : '15px',
  height: '15px',
  borderRadius: '10px',
  background: active
    ? 'linear-gradient(135deg, #fff 0%, #f59e0b 100%)'
    : 'rgba(255, 255, 255, 0.4)',
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  border: active ? '2px solid rgba(255, 255, 255, 0.8)' : '2px solid transparent',
  boxShadow: active ? '0 4px 15px rgba(245, 158, 11, 0.5)' : 'none',
  '&:hover': {
    background: active
      ? 'linear-gradient(135deg, #fff 0%, #f59e0b 100%)'
      : 'rgba(255, 255, 255, 0.7)',
    transform: 'scale(1.2)'
  }
}));

// ========== 3D STAT CARDS WITH FLIP EFFECT ==========
const StatCard = styled(Paper)({
  padding: '50px 30px',
  textAlign: 'center',
  background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #06b6d4 100%)',
  backgroundSize: '200% 200%',
  animation: `${gradientShift} 5s ease infinite`,
  color: 'white',
  borderRadius: '24px',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  transformStyle: 'preserve-3d',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2), 0 0 40px rgba(124, 58, 237, 0.2)',
  '&::before': {
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
    if (content?.sliders?.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % content.sliders.length);
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
      const response = await axios.get(`${baseUrl}/home-page-content/public`);
      const homeData = response.data.data;
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

  const { header, sliders = [], statistics = [], about, programs = [], gallery = [], testimonials, sectionVisibility } = content;
  const testimonialsArray = testimonials?.items || [];

  return (
    <Box sx={{ width: '100%', overflow: 'hidden', position: 'relative' }}>
      {/* Scroll Progress Bar */}
      <ProgressBar progress={scrollProgress} />

      {/* Glass Morphism Top Bar */}
      {header && (
        <TopBar bgcolor={header.primaryColor}>
          <Container maxWidth="xl">
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
              <Box display="flex" gap={3} alignItems="center" flexWrap="wrap">
                {header.contactPhone && (
                  <Box display="flex" alignItems="center" gap={1} sx={{ transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-2px)' } }}>
                    <Phone fontSize="small" sx={{ animation: `${pulse} 2s ease-in-out infinite` }} />
                    <Typography variant="body2" fontWeight={500}>{header.contactPhone}</Typography>
                  </Box>
                )}
                {header.contactEmail && (
                  <Box display="flex" alignItems="center" gap={1} sx={{ transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-2px)' } }}>
                    <Email fontSize="small" sx={{ animation: `${pulse} 2s ease-in-out infinite` }} />
                    <Typography variant="body2" fontWeight={500}>{header.contactEmail}</Typography>
                  </Box>
                )}
                {header.address && (
                  <Box display="flex" alignItems="center" gap={1} sx={{ transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-2px)' } }}>
                    <LocationOn fontSize="small" sx={{ animation: `${pulse} 2s ease-in-out infinite` }} />
                    <Typography variant="body2" fontWeight={500}>{header.address}</Typography>
                  </Box>
                )}
              </Box>
              <Box display="flex" gap={1}>
                {header.socialMedia && Object.entries(header.socialMedia).map(([platform, url]) =>
                  url ? (
                    <IconButton
                      key={platform}
                      size="small"
                      sx={{
                        color: 'white',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px) scale(1.2)',
                          filter: 'drop-shadow(0 5px 15px rgba(255, 255, 255, 0.5))'
                        }
                      }}
                      component="a"
                      href={url}
                      target="_blank"
                    >
                      {getSocialIcon(platform)}
                    </IconButton>
                  ) : null
                )}
              </Box>
            </Box>
          </Container>
        </TopBar>
      )}

      {/* Stunning Sticky Navigation */}
      {header && (
        <StickyNav scrolled={trigger}>
          <Container maxWidth="xl">
            <Box display="flex" justifyContent="space-between" alignItems="center" py={2.5}>
              <Box display="flex" alignItems="center" gap={2}>
                {header.logo && (
                  <Avatar
                    src={getImageUrl(header.logo)}
                    alt={header.schoolName}
                    sx={{
                      width: 75,
                      height: 75,
                      border: `4px solid ${header.primaryColor}`,
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                      transition: 'all 0.4s ease',
                      animation: `${glow} 3s ease-in-out infinite`,
                      '&:hover': {
                        transform: 'scale(1.1) rotate(5deg)',
                        boxShadow: '0 12px 35px rgba(124, 58, 237, 0.4)'
                      }
                    }}
                  />
                )}
                <Box>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{
                      background: `linear-gradient(135deg, ${header.primaryColor} 0%, #7c3aed 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateX(5px)'
                      }
                    }}
                  >
                    {header.schoolName || 'School'}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" fontWeight={500}>
                    {header.tagline || 'Excellence in Education'}
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" gap={2}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    borderColor: header.primaryColor,
                    color: header.primaryColor,
                    borderWidth: '2px',
                    borderRadius: '12px',
                    fontWeight: 600,
                    px: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderWidth: '2px',
                      borderColor: header.primaryColor,
                      background: `${header.primaryColor}15`,
                      transform: 'translateY(-3px)',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)'
                    }
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => scrollToSection('contact')}
                  sx={{
                    background: `linear-gradient(135deg, ${header.primaryColor} 0%, #7c3aed 100%)`,
                    borderRadius: '12px',
                    fontWeight: 600,
                    px: 3,
                    boxShadow: '0 8px 25px rgba(124, 58, 237, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: `linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)`,
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 35px rgba(124, 58, 237, 0.5)'
                    }
                  }}
                >
                  Contact Us
                </Button>
              </Box>
            </Box>
          </Container>
        </StickyNav>
      )}

      {/* STUNNING FULL-SCREEN SLIDER */}
      {sectionVisibility?.showSlider && sliders?.length > 0 ? (
        <HeroSection>
          {sliders.map((slide, index) => (
            <HeroSlide key={index} active={currentSlide === index}>
              {slide.mediaType === 'video' ? (
                <HeroVideo src={getImageUrl(slide.mediaUrl)} autoPlay loop muted playsInline />
              ) : (
                <HeroMedia
                  src={getImageUrl(slide.mediaUrl)}
                  alt={slide.title}
                  active={currentSlide === index}
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

      {/* 3D STATISTICS CARDS */}
      {sectionVisibility?.showStatistics && statistics?.length > 0 && (
        <Box
          sx={{
            py: 8,
            mt: -10,
            position: 'relative',
            zIndex: 10,
            animation: visibleSections['statistics'] ? `${fadeInUp} 1s ease-out` : 'none'
          }}
          id="statistics"
          data-animate="true"
        >
          <Container maxWidth="xl">
            <Grid container spacing={4}>
              {statistics.map((stat, index) => {
                const icons = [
                  <Groups sx={{ fontSize: '3rem' }} />,
                  <MenuBook sx={{ fontSize: '3rem' }} />,
                  <EmojiEvents sx={{ fontSize: '3rem' }} />,
                  <Star sx={{ fontSize: '3rem' }} />
                ];
                return (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <StatCard
                      elevation={10}
                      sx={{
                        animationDelay: `${index * 0.1}s`
                      }}
                    >
                      <StatIcon>
                        {icons[index % icons.length]}
                      </StatIcon>
                      <Typography variant="h2" fontWeight="bold" sx={{ fontSize: '4rem', mb: 1 }}>
                        {stat.value}{stat.suffix || ''}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
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
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
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
                          sx={{ transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
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
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
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
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
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

      {/* STUNNING FOOTER WITH WAVE */}
      <Box
        id="contact"
        sx={{
          position: 'relative',
          background: `linear-gradient(135deg, ${header?.primaryColor || '#1e3a8a'} 0%, #7c3aed 50%, #06b6d4 100%)`,
          backgroundSize: '200% 200%',
          animation: `${gradientShift} 10s ease infinite`,
          color: 'white',
          py: 10,
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
            animation: `${float} 15s ease-in-out infinite`
          }
        }}
      >
        {/* Wave Divider */}
        <WaveDivider viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="white"
          />
        </WaveDivider>

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                {header?.logo && (
                  <Avatar
                    src={getImageUrl(header.logo)}
                    sx={{
                      width: 70,
                      height: 70,
                      border: '3px solid white',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)'
                    }}
                  />
                )}
                <Typography variant="h4" fontWeight="bold">
                  {header?.schoolName || 'Our School'}
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 500 }}>
                {header?.tagline || 'Excellence in Education'}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.8 }}>
                Empowering students to achieve their full potential through quality education and holistic development.
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                Contact Information
              </Typography>
              {header?.contactPhone && (
                <Box
                  display="flex"
                  alignItems="center"
                  gap={2}
                  mb={2.5}
                  sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateX(10px)'
                    }
                  }}
                >
                  <Phone sx={{ fontSize: 24 }} />
                  <Typography variant="body1" fontSize="1.05rem">{header.contactPhone}</Typography>
                </Box>
              )}
              {header?.contactEmail && (
                <Box
                  display="flex"
                  alignItems="center"
                  gap={2}
                  mb={2.5}
                  sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateX(10px)'
                    }
                  }}
                >
                  <Email sx={{ fontSize: 24 }} />
                  <Typography variant="body1" fontSize="1.05rem">{header.contactEmail}</Typography>
                </Box>
              )}
              {header?.address && (
                <Box
                  display="flex"
                  alignItems="center"
                  gap={2}
                  sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateX(10px)'
                    }
                  }}
                >
                  <LocationOn sx={{ fontSize: 24 }} />
                  <Typography variant="body1" fontSize="1.05rem">{header.address}</Typography>
                </Box>
              )}
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Button
                  sx={{
                    color: 'white',
                    justifyContent: 'flex-start',
                    fontSize: '1.05rem',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateX(10px)',
                      background: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                  onClick={() => navigate('/login')}
                >
                  Admin Login
                </Button>
                <Button
                  sx={{
                    color: 'white',
                    justifyContent: 'flex-start',
                    fontSize: '1.05rem',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateX(10px)',
                      background: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                  onClick={() => navigate('/student-login')}
                >
                  Student Portal
                </Button>
                <Button
                  sx={{
                    color: 'white',
                    justifyContent: 'flex-start',
                    fontSize: '1.05rem',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateX(10px)',
                      background: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                  onClick={() => scrollToSection('contact')}
                >
                  Contact Us
                </Button>
              </Box>

              {header?.socialMedia && (
                <Box display="flex" gap={2} mt={4}>
                  {Object.entries(header.socialMedia).map(([platform, url]) =>
                    url ? (
                      <IconButton
                        key={platform}
                        sx={{
                          color: 'white',
                          bgcolor: 'rgba(255, 255, 255, 0.15)',
                          backdropFilter: 'blur(10px)',
                          width: 50,
                          height: 50,
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.25)',
                            transform: 'translateY(-8px) scale(1.15)',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
                          }
                        }}
                        component="a"
                        href={url}
                        target="_blank"
                      >
                        {getSocialIcon(platform)}
                      </IconButton>
                    ) : null
                  )}
                </Box>
              )}
            </Grid>
          </Grid>

          <Box sx={{ mt: 8, pt: 4, borderTop: '2px solid rgba(255, 255, 255, 0.2)', textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
              © {new Date().getFullYear()} {header?.schoolName || 'School Management System'}. All rights reserved.
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Crafted with care for education excellence
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* BACK TO TOP BUTTON */}
      <BackToTop show={showBackToTop} onClick={scrollToTop}>
        <KeyboardArrowUp sx={{ fontSize: '2rem' }} />
      </BackToTop>
    </Box>
  );
};

export default PublicHomePage;
