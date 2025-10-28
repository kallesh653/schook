import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Card, CardContent, Grid, Fab, IconButton } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../../../environment';
import {
  School as SchoolIcon,
  Person as PersonIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  ArrowBackIos,
  ArrowForwardIos
} from '@mui/icons-material';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const kenBurns = keyframes`
  0% { transform: scale(1) translateX(0) translateY(0); }
  50% { transform: scale(1.1) translateX(-2%) translateY(-2%); }
  100% { transform: scale(1.2) translateX(-4%) translateY(-4%); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
`;

// Styled Components
const HeroSection = styled(Box)({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  minHeight: '600px',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '200%',
    height: '200%',
    top: '-50%',
    left: '-50%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
    backgroundSize: '50px 50px',
    animation: `${float} 20s ease-in-out infinite`
  }
});

const StatsCard = styled(Card)({
  background: 'white',
  borderRadius: '20px',
  padding: '30px',
  textAlign: 'center',
  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  animation: `${fadeIn} 0.6s ease`,
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 15px 50px rgba(0,0,0,0.15)'
  }
});

const StudentLoginButton = styled(Fab)({
  position: 'fixed',
  bottom: '30px',
  right: '30px',
  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  color: 'white',
  padding: '25px 40px',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  textTransform: 'none',
  boxShadow: '0 8px 30px rgba(67, 233, 123, 0.5)',
  zIndex: 9999,
  animation: `${float} 3s ease-in-out infinite`,
  '&:hover': {
    background: 'linear-gradient(135deg, #38f9d7 0%, #43e97b 100%)',
    transform: 'scale(1.1)',
    boxShadow: '0 12px 40px rgba(67, 233, 123, 0.7)'
  },
  '@media (max-width: 600px)': {
    bottom: '20px',
    right: '20px',
    padding: '20px 30px',
    fontSize: '1rem'
  }
});

const FeatureCard = styled(Card)({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: '20px',
  padding: '40px',
  height: '100%',
  transition: 'all 0.3s ease',
  animation: `${fadeIn} 0.8s ease`,
  '&:hover': {
    transform: 'translateY(-10px) scale(1.02)',
    boxShadow: '0 20px 60px rgba(102, 126, 234, 0.4)'
  }
});

// Slider Components
const SliderContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '80vh',
  minHeight: '600px',
  maxHeight: '900px',
  overflow: 'hidden',
  '@media (max-width: 600px)': {
    height: '60vh',
    minHeight: '400px'
  }
});

const SlideWrapper = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  opacity: 0,
  transition: 'opacity 1s ease-in-out',
  '&.active': {
    opacity: 1
  }
});

const SlideImage = styled('div')(({ imageUrl }) => ({
  width: '100%',
  height: '100%',
  backgroundImage: `url(${imageUrl})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  animation: `${kenBurns} 15s ease-out infinite alternate`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)'
  }
}));

const SlideContent = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  textAlign: 'center',
  color: 'white',
  zIndex: 2,
  width: '90%',
  maxWidth: '1000px',
  padding: '20px'
});

const SliderNav = styled(IconButton)(({ direction }) => ({
  position: 'absolute',
  top: '50%',
  [direction]: '20px',
  transform: 'translateY(-50%)',
  zIndex: 10,
  background: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  color: 'white',
  width: '60px',
  height: '60px',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.3)',
    transform: 'translateY(-50%) scale(1.1)'
  },
  '@media (max-width: 600px)': {
    width: '45px',
    height: '45px',
    [direction]: '10px'
  }
}));

const SliderDots = styled(Box)({
  position: 'absolute',
  bottom: '30px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: '12px',
  zIndex: 10
});

const Dot = styled('div')(({ active }) => ({
  width: active ? '40px' : '12px',
  height: '12px',
  borderRadius: '6px',
  background: active ? 'white' : 'rgba(255, 255, 255, 0.5)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.8)'
  }
}));

const SimpleHome = () => {
  const navigate = useNavigate();
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/public-home/data`);
      if (response.data.success) {
        setHomeData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = homeData?.statistics?.stats || [
    { label: 'Students', value: '5,000+', icon: 'students' },
    { label: 'Teachers', value: '200+', icon: 'teachers' },
    { label: 'Classes', value: '100+', icon: 'classes' },
    { label: 'Success Rate', value: '95%', icon: 'success' }
  ];

  // Slider data - get active slides from API or use defaults
  const slides = homeData?.slider?.slides?.filter(slide => slide.active) || [
    {
      id: '1',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&h=1080&fit=crop',
      title: 'Welcome to GenTime',
      description: 'Modern School Management System'
    },
    {
      id: '2',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1920&h=1080&fit=crop',
      title: 'Excellence in Education',
      description: 'Empowering Students for Tomorrow'
    },
    {
      id: '3',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1920&h=1080&fit=crop',
      title: 'State-of-the-Art Facilities',
      description: 'Learning Environments That Inspire'
    }
  ];

  // Auto-advance slider every 5 seconds
  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <Box>
      {/* Full-Width Hero Slider */}
      <SliderContainer>
        {slides.map((slide, index) => (
          <SlideWrapper key={slide.id} className={index === currentSlide ? 'active' : ''}>
            <SlideImage imageUrl={slide.url} />
            <SlideContent>
              {slide.title && (
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '5rem' },
                    fontWeight: 900,
                    mb: 3,
                    textShadow: '0 4px 30px rgba(0,0,0,0.5)',
                    animation: `${slideIn} 0.8s ease`,
                    letterSpacing: '2px'
                  }}
                >
                  {slide.title}
                </Typography>
              )}
              {slide.description && (
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: { xs: '1.2rem', md: '2rem' },
                    mb: 5,
                    fontWeight: 300,
                    textShadow: '0 2px 20px rgba(0,0,0,0.5)',
                    animation: `${slideIn} 1s ease`,
                    animationDelay: '0.2s',
                    opacity: 0,
                    animationFillMode: 'forwards'
                  }}
                >
                  {slide.description}
                </Typography>
              )}
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  animation: `${slideIn} 1.2s ease`,
                  animationDelay: '0.4s',
                  opacity: 0,
                  animationFillMode: 'forwards'
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    background: 'white',
                    color: '#667eea',
                    px: 6,
                    py: 2.5,
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    borderRadius: '50px',
                    textTransform: 'none',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.9)',
                      transform: 'translateY(-3px) scale(1.05)',
                      boxShadow: '0 15px 50px rgba(0,0,0,0.4)'
                    }
                  }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    px: 6,
                    py: 2.5,
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    borderRadius: '50px',
                    textTransform: 'none',
                    borderWidth: '3px',
                    backdropFilter: 'blur(10px)',
                    background: 'rgba(255,255,255,0.1)',
                    '&:hover': {
                      borderWidth: '3px',
                      background: 'rgba(255,255,255,0.2)',
                      transform: 'translateY(-3px)'
                    }
                  }}
                >
                  School Login
                </Button>
              </Box>
            </SlideContent>
          </SlideWrapper>
        ))}

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <SliderNav direction="left" onClick={prevSlide}>
              <ArrowBackIos sx={{ fontSize: 28, ml: '8px' }} />
            </SliderNav>
            <SliderNav direction="right" onClick={nextSlide}>
              <ArrowForwardIos sx={{ fontSize: 28 }} />
            </SliderNav>
          </>
        )}

        {/* Dots Navigation */}
        {slides.length > 1 && (
          <SliderDots>
            {slides.map((_, index) => (
              <Dot
                key={index}
                active={index === currentSlide}
                onClick={() => goToSlide(index)}
              />
            ))}
          </SliderDots>
        )}
      </SliderContainer>

      {/* Stats Section */}
      <Box sx={{ py: 8, background: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            textAlign="center"
            sx={{ mb: 6, fontWeight: 800, color: '#333' }}
          >
            Our Achievements
          </Typography>
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <StatsCard sx={{ animationDelay: `${index * 0.1}s` }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px'
                    }}
                  >
                    {stat.icon === 'students' && <SchoolIcon sx={{ fontSize: 40, color: 'white' }} />}
                    {stat.icon === 'teachers' && <PersonIcon sx={{ fontSize: 40, color: 'white' }} />}
                    {stat.icon === 'classes' && <SchoolIcon sx={{ fontSize: 40, color: 'white' }} />}
                    {stat.icon === 'success' && <StarIcon sx={{ fontSize: 40, color: 'white' }} />}
                  </Box>
                  <Typography variant="h3" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {stat.label}
                  </Typography>
                </StatsCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            textAlign="center"
            sx={{ mb: 6, fontWeight: 800, color: '#333' }}
          >
            Why Choose Us
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                title: 'Easy Management',
                description: 'Manage students, teachers, and classes with our intuitive dashboard',
                icon: <SchoolIcon sx={{ fontSize: 50 }} />
              },
              {
                title: 'Real-time Updates',
                description: 'Get instant notifications about attendance, grades, and announcements',
                icon: <TrendingUpIcon sx={{ fontSize: 50 }} />
              },
              {
                title: 'Secure & Reliable',
                description: 'Your data is encrypted and backed up with 99.9% uptime guarantee',
                icon: <StarIcon sx={{ fontSize: 50 }} />
              }
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <FeatureCard sx={{ animationDelay: `${index * 0.2}s` }}>
                  <Box sx={{ mb: 3 }}>{feature.icon}</Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.7 }}>
                    {feature.description}
                  </Typography>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 10,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight="bold" sx={{ mb: 3 }}>
            Ready to Transform Your School?
          </Typography>
          <Typography variant="h6" sx={{ mb: 5, opacity: 0.9 }}>
            Join thousands of schools already using GenTime
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{
              background: 'white',
              color: '#667eea',
              px: 6,
              py: 2.5,
              fontSize: '1.2rem',
              fontWeight: 'bold',
              borderRadius: '30px',
              textTransform: 'none',
              '&:hover': {
                background: 'rgba(255,255,255,0.9)',
                transform: 'translateY(-3px) scale(1.05)',
                boxShadow: '0 15px 40px rgba(0,0,0,0.3)'
              }
            }}
          >
            Start Free Trial
          </Button>
        </Container>
      </Box>

      {/* Floating Student Login Button */}
      <StudentLoginButton
        variant="extended"
        onClick={() => navigate('/student-login')}
      >
        <PersonIcon sx={{ mr: 1, fontSize: 28 }} />
        Student Login
      </StudentLoginButton>
    </Box>
  );
};

export default SimpleHome;
