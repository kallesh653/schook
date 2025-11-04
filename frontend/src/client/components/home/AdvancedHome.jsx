import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Card, CardContent, Grid, Fab, IconButton, Avatar } from '@mui/material';
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
  ArrowForwardIos,
  EmojiEvents as TrophyIcon,
  Groups as GroupsIcon,
  MenuBook as BookIcon,
  Science as ScienceIcon,
  Sports as SportsIcon,
  Computer as ComputerIcon,
  FormatQuote as QuoteIcon,
  Image as ImageIcon,
  Newspaper as NewsIcon,
  CalendarToday as CalendarIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  WhatsApp as WhatsAppIcon
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

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const slideInFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const zoomIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

// Slider Components - Beautiful large slider with animations
const SliderContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '650px', // Much bigger for impressive display
  maxHeight: '650px',
  minHeight: '500px',
  overflow: 'hidden',
  marginBottom: '50px',
  borderRadius: '20px',
  boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  '@media (max-width: 1200px)': {
    height: '550px',
    maxHeight: '550px'
  },
  '@media (max-width: 768px)': {
    height: '450px',
    maxHeight: '450px',
    minHeight: '400px',
    borderRadius: '15px'
  },
  '@media (max-width: 600px)': {
    height: '400px',
    maxHeight: '400px',
    minHeight: '350px',
    borderRadius: '10px'
  }
});

const SlideWrapper = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  opacity: 0,
  transform: 'scale(1.1)',
  transition: 'opacity 1.5s ease-in-out, transform 1.5s ease-in-out',
  '&.active': {
    opacity: 1,
    transform: 'scale(1)',
    animation: `${zoomIn} 1.5s ease-out`
  }
});

const SlideImage = styled('div')(({ imageUrl }) => ({
  width: '100%',
  height: '100%',
  backgroundImage: `url(${imageUrl})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  animation: `${kenBurns} 20s ease-out infinite alternate`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)'
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
  maxWidth: '1200px',
  padding: '20px'
});

const SliderNav = styled(IconButton)(({ direction }) => ({
  position: 'absolute',
  top: '50%',
  [direction]: '30px',
  transform: 'translateY(-50%)',
  zIndex: 10,
  background: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(10px)',
  color: 'white',
  width: '70px',
  height: '70px',
  border: '2px solid rgba(255,255,255,0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.25)',
    transform: 'translateY(-50%) scale(1.1)',
    borderColor: 'white'
  },
  '@media (max-width: 600px)': {
    width: '50px',
    height: '50px',
    [direction]: '15px'
  }
}));

const SliderDots = styled(Box)({
  position: 'absolute',
  bottom: '40px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: '15px',
  zIndex: 10
});

const Dot = styled('div')(({ active }) => ({
  width: active ? '50px' : '15px',
  height: '15px',
  borderRadius: '8px',
  background: active ? 'white' : 'rgba(255, 255, 255, 0.4)',
  cursor: 'pointer',
  transition: 'all 0.4s ease',
  border: '2px solid white',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.8)',
    transform: 'scale(1.2)'
  }
}));

const StatsCard = styled(Card)({
  background: 'white',
  borderRadius: '25px',
  padding: '40px 20px',
  textAlign: 'center',
  boxShadow: '0 15px 50px rgba(0,0,0,0.1)',
  transition: 'all 0.4s ease',
  animation: `${fadeIn} 0.6s ease`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '5px',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
  },
  '&:hover': {
    transform: 'translateY(-15px) scale(1.03)',
    boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)'
  }
});

const StudentLoginButton = styled(Fab)({
  position: 'fixed',
  bottom: '40px',
  right: '40px',
  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  color: 'white',
  padding: '30px 50px',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  textTransform: 'none',
  boxShadow: '0 10px 40px rgba(67, 233, 123, 0.5)',
  zIndex: 9999,
  animation: `${pulse} 2s ease-in-out infinite`,
  '&:hover': {
    background: 'linear-gradient(135deg, #38f9d7 0%, #43e97b 100%)',
    transform: 'scale(1.1)',
    boxShadow: '0 15px 50px rgba(67, 233, 123, 0.7)'
  },
  '@media (max-width: 600px)': {
    bottom: '20px',
    right: '20px',
    padding: '20px 35px',
    fontSize: '1rem'
  }
});

const WhatsAppButton = styled(Fab)({
  position: 'fixed',
  bottom: '130px',
  right: '40px',
  background: '#25D366',
  color: 'white',
  width: '70px',
  height: '70px',
  boxShadow: '0 10px 40px rgba(37, 211, 102, 0.5)',
  zIndex: 9998,
  animation: `${pulse} 2s ease-in-out infinite`,
  '&:hover': {
    background: '#128C7E',
    transform: 'scale(1.15)',
    boxShadow: '0 15px 50px rgba(37, 211, 102, 0.7)'
  },
  '@media (max-width: 600px)': {
    bottom: '100px',
    right: '20px',
    width: '60px',
    height: '60px'
  }
});

const FeatureCard = styled(Card)({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: '30px',
  padding: '50px 30px',
  height: '100%',
  textAlign: 'center',
  transition: 'all 0.4s ease',
  animation: `${fadeIn} 0.8s ease`,
  boxShadow: '0 15px 40px rgba(102, 126, 234, 0.3)',
  '&:hover': {
    transform: 'translateY(-15px) rotate(-2deg)',
    boxShadow: '0 25px 70px rgba(102, 126, 234, 0.5)'
  }
});

const TestimonialCard = styled(Card)({
  background: 'white',
  borderRadius: '20px',
  padding: '40px',
  height: '100%',
  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 50px rgba(0,0,0,0.15)'
  }
});

const SectionTitle = styled(Typography)({
  fontSize: '3.5rem',
  fontWeight: 900,
  textAlign: 'center',
  marginBottom: '20px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  '@media (max-width: 600px)': {
    fontSize: '2.5rem'
  }
});

const AdvancedHome = () => {
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

  // Slider data
  const slides = homeData?.slider?.slides?.filter(slide => slide.active) || [
    {
      id: '1',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&h=1080&fit=crop',
      title: 'Welcome to Excellence',
      description: 'Where Dreams Take Flight'
    },
    {
      id: '2',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1920&h=1080&fit=crop',
      title: 'Innovation in Education',
      description: 'Shaping Future Leaders'
    },
    {
      id: '3',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1920&h=1080&fit=crop',
      title: 'World-Class Facilities',
      description: 'Learning Beyond Boundaries'
    }
  ];

  // Statistics
  const stats = homeData?.statistics?.stats || [
    { label: 'Students', value: '5,000+', icon: 'students' },
    { label: 'Teachers', value: '200+', icon: 'teachers' },
    { label: 'Programs', value: '50+', icon: 'programs' },
    { label: 'Success Rate', value: '98%', icon: 'success' }
  ];

  // Features
  const features = [
    {
      icon: <BookIcon sx={{ fontSize: 60 }} />,
      title: 'Academic Excellence',
      description: 'Rigorous curriculum designed to challenge and inspire students to reach their full potential'
    },
    {
      icon: <ScienceIcon sx={{ fontSize: 60 }} />,
      title: 'Modern Labs',
      description: 'State-of-the-art science and computer labs equipped with latest technology'
    },
    {
      icon: <SportsIcon sx={{ fontSize: 60 }} />,
      title: 'Sports & Wellness',
      description: 'Comprehensive sports programs and wellness initiatives for holistic development'
    },
    {
      icon: <ComputerIcon sx={{ fontSize: 60 }} />,
      title: 'Digital Learning',
      description: 'Technology-integrated classrooms with smart boards and online resources'
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 60 }} />,
      title: 'Community',
      description: 'Strong parent-teacher collaboration and active student community'
    },
    {
      icon: <TrophyIcon sx={{ fontSize: 60 }} />,
      title: 'Achievements',
      description: 'Consistent academic and co-curricular excellence with national recognition'
    }
  ];

  // Testimonials
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Parent of Class 10 Student',
      text: 'The dedication of teachers and the nurturing environment have transformed my child learning journey. Highly recommended!',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Alumni, Class of 2020',
      text: 'This school prepared me for college and life. The skills I learned here are invaluable. Forever grateful!',
      rating: 5
    },
    {
      name: 'Priya Sharma',
      role: 'Parent of Class 7 Student',
      text: 'Outstanding facilities, caring staff, and a curriculum that truly focuses on holistic development. Best decision ever!',
      rating: 5
    }
  ];

  // Auto-advance slider
  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goToSlide = (index) => setCurrentSlide(index);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Typography variant="h4">Loading...</Typography>
    </Box>;
  }

  return (
    <Box>
      {/* Hero Slider */}
      <Container maxWidth="xl" sx={{ px: { xs: 0, md: 3 }, mt: 3 }}>
        <SliderContainer>
        {slides.map((slide, index) => (
          <SlideWrapper key={slide.id} className={index === currentSlide ? 'active' : ''}>
            <SlideImage imageUrl={slide.url} />
            <SlideContent>
              {slide.title && (
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '3rem', md: '6rem' },
                    fontWeight: 900,
                    mb: 3,
                    textShadow: '0 5px 40px rgba(0,0,0,0.6)',
                    animation: `${slideIn} 1s ease`,
                    letterSpacing: '3px'
                  }}
                >
                  {slide.title}
                </Typography>
              )}
              {slide.description && (
                <Typography
                  variant="h3"
                  sx={{
                    fontSize: { xs: '1.5rem', md: '2.5rem' },
                    mb: 6,
                    fontWeight: 300,
                    textShadow: '0 3px 25px rgba(0,0,0,0.5)',
                    animation: `${slideIn} 1.2s ease`,
                    animationDelay: '0.3s',
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
                  gap: 3,
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  animation: `${slideIn} 1.4s ease`,
                  animationDelay: '0.6s',
                  opacity: 0,
                  animationFillMode: 'forwards'
                }}
              >
                {/* Enroll Now and School Portal buttons removed as requested */}
              </Box>
            </SlideContent>
          </SlideWrapper>
        ))}

        {slides.length > 1 && (
          <>
            <SliderNav direction="left" onClick={prevSlide}>
              <ArrowBackIos sx={{ fontSize: 32, ml: '10px' }} />
            </SliderNav>
            <SliderNav direction="right" onClick={nextSlide}>
              <ArrowForwardIos sx={{ fontSize: 32 }} />
            </SliderNav>
            <SliderDots>
              {slides.map((_, index) => (
                <Dot key={index} active={index === currentSlide} onClick={() => goToSlide(index)} />
              ))}
            </SliderDots>
          </>
        )}
      </SliderContainer>
      </Container>

      {/* Stats Section */}
      <Box sx={{ py: 10, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <Container maxWidth="lg">
          <SectionTitle variant="h2">
            Our Impact
          </SectionTitle>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6, fontSize: '1.3rem' }}>
            Numbers that speak for themselves
          </Typography>
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <StatsCard sx={{ animationDelay: `${index * 0.1}s` }}>
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 25px',
                      boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
                    }}
                  >
                    {stat.icon === 'students' && <SchoolIcon sx={{ fontSize: 50, color: 'white' }} />}
                    {stat.icon === 'teachers' && <PersonIcon sx={{ fontSize: 50, color: 'white' }} />}
                    {stat.icon === 'programs' && <BookIcon sx={{ fontSize: 50, color: 'white' }} />}
                    {stat.icon === 'success' && <StarIcon sx={{ fontSize: 50, color: 'white' }} />}
                  </Box>
                  <Typography variant="h2" fontWeight="bold" sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1,
                    fontSize: '3.5rem'
                  }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="h5" color="text.secondary" fontWeight="600">
                    {stat.label}
                  </Typography>
                </StatsCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 12, background: 'white' }}>
        <Container maxWidth="lg">
          <SectionTitle variant="h2">
            Why Choose Us
          </SectionTitle>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 8, fontSize: '1.3rem' }}>
            Excellence in every aspect of education
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <FeatureCard sx={{ animationDelay: `${index * 0.15}s` }}>
                  <Box sx={{ mb: 3 }}>{feature.icon}</Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.95, lineHeight: 1.8, fontSize: '1.1rem' }}>
                    {feature.description}
                  </Typography>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 12, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <Container maxWidth="lg">
          <SectionTitle variant="h2">
            What People Say
          </SectionTitle>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 8, fontSize: '1.3rem' }}>
            Hear from our amazing community
          </Typography>
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <TestimonialCard>
                  <QuoteIcon sx={{ fontSize: 50, color: '#667eea', mb: 2 }} />
                  <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.8, fontStyle: 'italic' }}>
                    "{testimonial.text}"
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 60, height: 60, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                      {testimonial.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <StarIcon key={i} sx={{ fontSize: 20, color: '#ffd700' }} />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </TestimonialCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Programs Section */}
      <Box sx={{ py: 12, background: 'white' }}>
        <Container maxWidth="lg">
          <SectionTitle variant="h2">
            Our Programs
          </SectionTitle>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 8, fontSize: '1.3rem' }}>
            Comprehensive education from foundation to excellence
          </Typography>
          <Grid container spacing={4}>
            {[
              { title: 'Pre-Primary', desc: 'Ages 3-5 • Play-based learning foundation', icon: '🌱', color: '#ff6b6b' },
              { title: 'Primary School', desc: 'Grades 1-5 • Building core competencies', icon: '📚', color: '#4ecdc4' },
              { title: 'Middle School', desc: 'Grades 6-8 • Developing critical thinking', icon: '🎯', color: '#45b7d1' },
              { title: 'High School', desc: 'Grades 9-10 • Board exam preparation', icon: '🎓', color: '#f7b731' },
              { title: 'Senior Secondary', desc: 'Grades 11-12 • Career-focused learning', icon: '🚀', color: '#5f27cd' },
              { title: 'Special Programs', desc: 'Sports, Arts, STEM Excellence', icon: '⭐', color: '#fd79a8' }
            ].map((program, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{
                  p: 4,
                  height: '100%',
                  textAlign: 'center',
                  border: `3px solid ${program.color}`,
                  borderRadius: '25px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: `0 20px 50px ${program.color}40`
                  }
                }}>
                  <Typography variant="h1" sx={{ mb: 2 }}>
                    {program.icon}
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ mb: 2, color: program.color }}>
                    {program.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                    {program.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Gallery Section */}
      <Box sx={{ py: 12, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <Container maxWidth="lg">
          <SectionTitle variant="h2">
            Campus Life
          </SectionTitle>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 8, fontSize: '1.3rem' }}>
            A glimpse into our vibrant community
          </Typography>
          <Grid container spacing={3}>
            {[
              'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
              'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800',
              'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
              'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
              'https://images.unsplash.com/photo-1503676382389-4809596d5290?w=800',
              'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800'
            ].map((img, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box sx={{
                  height: 300,
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.25)'
                  }
                }}>
                  <img
                    src={img}
                    alt={`Gallery ${index + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box sx={{ py: 12, background: 'white' }}>
        <Container maxWidth="lg">
          <SectionTitle variant="h2">
            Get In Touch
          </SectionTitle>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 8, fontSize: '1.3rem' }}>
            We're here to answer your questions
          </Typography>
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 4, textAlign: 'center', height: '100%' }}>
                <Box sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <PhoneIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                  Call Us
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  +1 (555) 123-4567
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 4, textAlign: 'center', height: '100%' }}>
                <Box sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <EmailIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                  Email Us
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  info@school.com
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 4, textAlign: 'center', height: '100%' }}>
                <Box sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <LocationIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                  Visit Us
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  123 School St, City, State
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Achievements & Awards Section */}
      <Box sx={{ py: 12, background: 'white' }}>
        <Container maxWidth="lg">
          <SectionTitle variant="h2">
            Our Achievements
          </SectionTitle>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 8, fontSize: '1.3rem' }}>
            Recognitions that make us proud
          </Typography>
          <Grid container spacing={4}>
            {[
              { icon: <TrophyIcon sx={{ fontSize: 70 }} />, title: 'National Excellence Award', year: '2024', desc: 'Best Educational Institution' },
              { icon: <StarIcon sx={{ fontSize: 70 }} />, title: 'Top Rated School', year: '2023-2024', desc: '5-Star Rating by Education Board' },
              { icon: <TrendingUpIcon sx={{ fontSize: 70 }} />, title: '100% Results', year: '10 Years', desc: 'Consistent Academic Excellence' },
              { icon: <SportsIcon sx={{ fontSize: 70 }} />, title: 'Sports Champions', year: '2024', desc: 'State Level Championship Winners' }
            ].map((achievement, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{
                  p: 4,
                  textAlign: 'center',
                  height: '100%',
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                  transition: 'all 0.4s ease',
                  animation: `${fadeIn} 0.8s ease ${index * 0.2}s both`,
                  '&:hover': {
                    transform: 'translateY(-15px) scale(1.05)',
                    boxShadow: '0 20px 50px rgba(102, 126, 234, 0.3)'
                  }
                }}>
                  <Box sx={{ color: '#667eea', mb: 2, animation: `${float} 3s ease-in-out infinite` }}>
                    {achievement.icon}
                  </Box>
                  <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                    {achievement.title}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#667eea', mb: 2, fontWeight: 'bold' }}>
                    {achievement.year}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {achievement.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* News & Events Section */}
      <Box sx={{ py: 12, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <Container maxWidth="lg">
          <SectionTitle variant="h2">
            Latest News & Events
          </SectionTitle>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 8, fontSize: '1.3rem' }}>
            Stay updated with our school community
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                icon: <NewsIcon sx={{ fontSize: 50 }} />,
                title: 'Annual Science Exhibition',
                date: 'December 15, 2024',
                desc: 'Students showcase innovative projects and experiments. Open to all parents and visitors.'
              },
              {
                icon: <CalendarIcon sx={{ fontSize: 50 }} />,
                title: 'Sports Day Celebration',
                date: 'January 10, 2025',
                desc: 'Inter-house sports competition with various athletic events and games.'
              },
              {
                icon: <BookIcon sx={{ fontSize: 50 }} />,
                title: 'Parent-Teacher Meeting',
                date: 'December 20, 2024',
                desc: 'Discuss student progress and academic performance with teachers.'
              }
            ].map((event, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{
                  p: 4,
                  height: '100%',
                  background: 'white',
                  transition: 'all 0.3s ease',
                  animation: `${slideInFromLeft} 0.8s ease ${index * 0.2}s both`,
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 15px 40px rgba(0,0,0,0.15)'
                  }
                }}>
                  <Box sx={{
                    color: '#667eea',
                    mb: 3,
                    display: 'flex',
                    justifyContent: 'center'
                  }}>
                    {event.icon}
                  </Box>
                  <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                    {event.title}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: '#667eea', mb: 2, fontWeight: 'bold' }}>
                    {event.date}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    {event.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 12,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight="bold" sx={{ mb: 3, fontSize: { xs: '2.5rem', md: '4rem' } }}>
            Ready to Begin Your Journey?
          </Typography>
          <Typography variant="h5" sx={{ mb: 6, opacity: 0.9, fontSize: '1.5rem' }}>
            Join thousands of students achieving excellence
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{
              background: 'white',
              color: '#667eea',
              px: 8,
              py: 3,
              fontSize: '1.4rem',
              fontWeight: 'bold',
              borderRadius: '50px',
              textTransform: 'none',
              boxShadow: '0 15px 50px rgba(0,0,0,0.4)',
              '&:hover': {
                background: 'rgba(255,255,255,0.95)',
                transform: 'translateY(-5px) scale(1.08)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
              }
            }}
          >
            Start Your Application
          </Button>
        </Container>
      </Box>

      {/* Floating WhatsApp Button */}
      {homeData?.socialMedia?.whatsapp && (
        <WhatsAppButton
          onClick={() => window.open(`https://wa.me/${homeData.socialMedia.whatsapp.replace(/[^0-9]/g, '')}`, '_blank')}
          aria-label="Contact us on WhatsApp"
        >
          <WhatsAppIcon sx={{ fontSize: 40 }} />
        </WhatsAppButton>
      )}

      {/* Floating Student Login Button */}
      <StudentLoginButton
        variant="extended"
        onClick={() => navigate('/student-login')}
      >
        <PersonIcon sx={{ mr: 1, fontSize: 32 }} />
        Student Portal
      </StudentLoginButton>
    </Box>
  );
};

export default AdvancedHome;
