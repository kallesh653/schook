import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Card, CardContent, Box, Paper,
  Button, Chip, Avatar, IconButton, Fade, Zoom, Divider, AppBar, Toolbar
} from '@mui/material';
import {
  School as SchoolIcon,
  EmojiEvents as AwardIcon,
  Groups as StudentsIcon,
  MenuBook as BookIcon,
  Star as StarIcon,
  PlayArrow as PlayIcon,
  ArrowForward as ArrowIcon,
  Login as LoginIcon,
  WhatsApp as WhatsAppIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  KeyboardArrowUp as ArrowUpIcon,
  Celebration as CelebrationIcon,
  Laptop as LaptopIcon,
  SportsSoccer as SportsIcon,
  Palette as ArtIcon,
  Science as ScienceIcon,
  Campaign as CampaignIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  Phone as PhoneIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../../../environment';

// ============= ANIMATIONS =============

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
`;

const swing = keyframes`
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(5deg); }
  75% { transform: rotate(-5deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const slideInLeft = keyframes`
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const slideInRight = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
`;

const rotateIn = keyframes`
  from { opacity: 0; transform: rotate(-180deg) scale(0); }
  to { opacity: 1; transform: rotate(0deg) scale(1); }
`;

const scrollNews = keyframes`
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const heartbeat = keyframes`
  0%, 100% { transform: scale(1); }
  10%, 30% { transform: scale(0.9); }
  20%, 40%, 60%, 80% { transform: scale(1.1); }
  50%, 70% { transform: scale(1.05); }
`;

const wiggle = keyframes`
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-10deg); }
  50% { transform: rotate(10deg); }
  75% { transform: rotate(-10deg); }
`;

// ============= STYLED COMPONENTS =============

// Header Navigation with Enhanced Design
const HeaderBar = styled(AppBar)({
  background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  borderBottom: '3px solid #DC143C',
  position: 'relative'
});

// Simple and Beautiful Alert Banner
const AlertBanner = styled(Box)({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: '12px 0',
  overflow: 'hidden',
  position: 'relative',
  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
  borderBottom: '2px solid #FFD700'
});

const AlertContent = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '40px',
  animation: `${scrollNews} 30s linear infinite`,
  whiteSpace: 'nowrap',
  fontSize: '16px',
  fontWeight: 600,
  position: 'relative',
  zIndex: 1
});

const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg,
    #8B8B8D 0%,
    #6B6B6D 25%,
    #DC143C 75%,
    #B22222 100%)`,
  minHeight: '80vh',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    opacity: 0.3
  }
}));

const FloatingElement = styled(Box)(({ delay = 0 }) => ({
  animation: `${float} 3s ease-in-out ${delay}s infinite`,
  position: 'absolute',
  opacity: 0.1
}));

const NewsTickerContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#DC143C',
  color: 'white',
  padding: '12px 0',
  overflow: 'hidden',
  position: 'relative',
  boxShadow: '0 4px 12px rgba(220, 20, 60, 0.3)',
  '&::before': {
    content: '"📢 NEWS"',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#B22222',
    color: 'white',
    padding: '12px 20px',
    fontWeight: 'bold',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px'
  }
}));

const NewsContent = styled(Box)({
  display: 'inline-block',
  paddingLeft: '120px',
  whiteSpace: 'nowrap',
  animation: `${scrollNews} 30s linear infinite`,
  fontSize: '16px',
  fontWeight: 500
});

const FeatureCard = styled(Card)(({ delay = 0 }) => ({
  height: '100%',
  background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
  borderRadius: '20px',
  border: '2px solid #DC143C',
  transition: 'all 0.3s ease',
  animation: `${fadeInUp} 0.6s ease-out ${delay}s both`,
  '&:hover': {
    transform: 'translateY(-10px) scale(1.02)',
    boxShadow: '0 20px 40px rgba(220, 20, 60, 0.3)',
    borderColor: '#B22222'
  }
}));

const AnimatedIcon = styled(Avatar)(({ animationType = 'bounce' }) => ({
  width: 80,
  height: 80,
  background: 'linear-gradient(135deg, #DC143C 0%, #B22222 100%)',
  margin: '0 auto 16px',
  animation: `${animationType === 'bounce' ? bounce : animationType === 'swing' ? swing : pulse} 2s ease-in-out infinite`
}));

const StatsCard = styled(Paper)(({ delay = 0 }) => ({
  padding: '30px',
  textAlign: 'center',
  background: 'linear-gradient(135deg, #DC143C 0%, #B22222 100%)',
  color: 'white',
  borderRadius: '15px',
  animation: `${scaleIn} 0.5s ease-out ${delay}s both`,
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1) rotate(2deg)',
    animation: `${heartbeat} 1s ease infinite`
  }
}));

const ShimmerButton = styled(Button)({
  background: 'linear-gradient(90deg, #8B8B8D 0%, #6B6B6D 50%, #8B8B8D 100%)',
  backgroundSize: '200% auto',
  color: '#DC143C',
  padding: '12px 40px',
  fontSize: '18px',
  fontWeight: 'bold',
  borderRadius: '30px',
  boxShadow: '0 4px 15px rgba(139, 139, 141, 0.4)',
  animation: `${shimmer} 3s linear infinite`,
  transition: 'all 0.3s ease',
  border: '2px solid #DC143C',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 25px rgba(220, 20, 60, 0.6)',
    animation: `${pulse} 0.6s ease infinite`,
    background: '#DC143C',
    color: 'white'
  }
});

const ChildElement = styled(Box)(({ type }) => {
  const animations = {
    balloon: float,
    star: wiggle,
    heart: heartbeat
  };

  return {
    position: 'absolute',
    fontSize: '60px',
    animation: `${animations[type] || bounce} ${2 + Math.random() * 2}s ease-in-out infinite`,
    opacity: 0.6,
    zIndex: 0
  };
});

// ============= MAIN COMPONENT =============

const HomeBeautiful = () => {
  const navigate = useNavigate();
  const [homePageData, setHomePageData] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    fetchHomePageData();
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchHomePageData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/public-home`);
      setHomePageData(response.data.data);
    } catch (error) {
      console.error('Error fetching home page data:', error);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const features = [
    {
      icon: <BookIcon sx={{ fontSize: 50 }} />,
      title: 'Quality Education',
      description: 'World-class curriculum designed for holistic development',
      delay: 0.1,
      animation: 'bounce'
    },
    {
      icon: <StudentsIcon sx={{ fontSize: 50 }} />,
      title: 'Expert Faculty',
      description: 'Dedicated teachers committed to student success',
      delay: 0.2,
      animation: 'swing'
    },
    {
      icon: <LaptopIcon sx={{ fontSize: 50 }} />,
      title: 'Smart Classrooms',
      description: 'Technology-enabled learning environment',
      delay: 0.3,
      animation: 'bounce'
    },
    {
      icon: <SportsIcon sx={{ fontSize: 50 }} />,
      title: 'Sports & Activities',
      description: 'Comprehensive sports and extracurricular programs',
      delay: 0.4,
      animation: 'swing'
    },
    {
      icon: <ScienceIcon sx={{ fontSize: 50 }} />,
      title: 'Modern Labs',
      description: 'State-of-the-art science and computer labs',
      delay: 0.5,
      animation: 'bounce'
    },
    {
      icon: <ArtIcon sx={{ fontSize: 50 }} />,
      title: 'Arts & Culture',
      description: 'Nurturing creativity through arts and culture',
      delay: 0.6,
      animation: 'swing'
    }
  ];

  const stats = [
    { value: '10+', label: 'Years of Excellence', delay: 0.1 },
    { value: '500+', label: 'Happy Students', delay: 0.2 },
    { value: '50+', label: 'Expert Teachers', delay: 0.3 },
    { value: '95%', label: 'Success Rate', delay: 0.4 }
  ];

  const newsItems = [
    'Admission open for new academic year 2024-2025 🎓',
    'Annual Sports Day - March 15, 2024 🏆',
    'Science Exhibition - Winners Announced 🔬',
    'Parent-Teacher Meeting - Every Saturday ✨',
    'New Computer Lab Inaugurated 💻'
  ];

  const alertMessages = [
    '🎉 Special Offer: 20% Discount on Early Admission!',
    '⭐ Limited Seats Available - Apply Now!',
    '🏆 Best School Award 2024 Winner',
    '🎓 100% Placement Assistance for Graduates',
    '✨ New State-of-the-Art Facilities Launched'
  ];

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* ============= BEAUTIFUL ENHANCED HEADER ============= */}
      <HeaderBar position="sticky" elevation={8}>
        <Toolbar sx={{ py: 1, position: 'relative', zIndex: 1 }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            flexGrow: 1,
            animation: `${fadeInUp} 1s ease-out`
          }}>
            <Box sx={{
              position: 'relative',
              animation: `${pulse} 2s ease-in-out infinite`
            }}>
              <SchoolIcon sx={{
                fontSize: 50,
                mr: 2,
                color: '#FFD700',
                filter: 'drop-shadow(0 0 10px rgba(220, 20, 60, 0.8))',
                animation: `${wiggle} 3s ease-in-out infinite`
              }} />
            </Box>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  color: '#ffffff',
                  fontSize: { xs: '1.3rem', sm: '1.8rem', md: '2.2rem' },
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                  letterSpacing: '1px'
                }}
              >
                Shrigannada Higher Primary School
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#FFD700',
                  fontWeight: 500,
                  fontSize: { xs: '10px', sm: '11px', md: '12px' },
                  letterSpacing: '1px',
                  display: 'block',
                  mt: 0.5
                }}
              >
                Excellence in Education Since 2014
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, mr: 2 }}>
            <Button
              startIcon={<HomeIcon />}
              sx={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px',
                px: 2,
                py: 1,
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(220, 20, 60, 0.2)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Home
            </Button>
            <Button
              startIcon={<InfoIcon />}
              sx={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px',
                px: 2,
                py: 1,
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(220, 20, 60, 0.2)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              About
            </Button>
            <Button
              startIcon={<BookIcon />}
              sx={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px',
                px: 2,
                py: 1,
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(220, 20, 60, 0.2)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Academics
            </Button>
            <Button
              startIcon={<PhoneIcon />}
              sx={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px',
                px: 2,
                py: 1,
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(220, 20, 60, 0.2)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Contact
            </Button>
          </Box>

          <Button
            variant="contained"
            startIcon={<LoginIcon />}
            onClick={() => navigate('/login')}
            sx={{
              background: '#DC143C',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '15px',
              px: 3,
              py: 1,
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(220, 20, 60, 0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: '#B22222',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(220, 20, 60, 0.6)'
              }
            }}
          >
            Login
          </Button>
        </Toolbar>
      </HeaderBar>

      {/* ============= SIMPLE BEAUTIFUL ALERT BANNER ============= */}
      <AlertBanner>
        <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
          <AlertContent>
            <NotificationsIcon sx={{ fontSize: 24, mr: 2 }} />
            {alertMessages.map((msg, idx) => (
              <React.Fragment key={idx}>
                <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>
                  {msg}
                </Typography>
                <Box component="span" sx={{ fontSize: '20px', mx: 1 }}>•</Box>
              </React.Fragment>
            ))}
            {alertMessages.map((msg, idx) => (
              <React.Fragment key={`duplicate-${idx}`}>
                <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>
                  {msg}
                </Typography>
                <Box component="span" sx={{ fontSize: '20px', mx: 1 }}>•</Box>
              </React.Fragment>
            ))}
          </AlertContent>
        </Box>
      </AlertBanner>

      {/* ============= ANIMATED HERO SECTION ============= */}
      <HeroSection>
        {/* Floating Child-Friendly Elements */}
        <ChildElement type="balloon" sx={{ top: '10%', left: '5%' }}>🎈</ChildElement>
        <ChildElement type="star" sx={{ top: '20%', right: '10%' }}>⭐</ChildElement>
        <ChildElement type="balloon" sx={{ bottom: '15%', left: '15%' }}>🎨</ChildElement>
        <ChildElement type="heart" sx={{ top: '40%', right: '5%' }}>❤️</ChildElement>
        <ChildElement type="star" sx={{ bottom: '25%', right: '20%' }}>✨</ChildElement>
        <ChildElement type="balloon" sx={{ top: '60%', left: '25%' }}>🌈</ChildElement>
        <ChildElement type="star" sx={{ bottom: '40%', left: '8%' }}>🌟</ChildElement>
        <ChildElement type="heart" sx={{ top: '30%', left: '40%' }}>🎯</ChildElement>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in={true} timeout={1000}>
                <Box>
                  <Typography
                    variant="h1"
                    sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: { xs: '2.5rem', md: '4rem' },
                      mb: 2,
                      textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
                      animation: `${slideInLeft} 1s ease-out`
                    }}
                  >
                    Welcome to
                    <br />
                    <Box component="span" sx={{ color: '#FFD700', textShadow: '2px 2px 4px #DC143C' }}>
                      GenTime School
                    </Box>
                  </Typography>

                  <Typography
                    variant="h5"
                    sx={{
                      color: 'white',
                      mb: 4,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                      animation: `${slideInLeft} 1s ease-out 0.2s both`
                    }}
                  >
                    Shaping Tomorrow's Leaders Today! 🌟
                  </Typography>

                  <Box sx={{
                    display: 'flex',
                    gap: 2,
                    flexWrap: 'wrap',
                    animation: `${slideInLeft} 1s ease-out 0.4s both`
                  }}>
                    <ShimmerButton
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/login')}
                      startIcon={<LoginIcon />}
                    >
                      Get Started
                    </ShimmerButton>

                    <Button
                      variant="outlined"
                      size="large"
                      sx={{
                        color: '#DC143C',
                        backgroundColor: '#f5f5f5',
                        borderColor: '#8B8B8D',
                        borderWidth: 2,
                        padding: '12px 40px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        borderRadius: '30px',
                        '&:hover': {
                          borderWidth: 2,
                          borderColor: '#DC143C',
                          backgroundColor: 'rgba(220, 20, 60, 0.1)',
                          transform: 'scale(1.05)'
                        }
                      }}
                    >
                      Learn More
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{
                animation: `${slideInRight} 1s ease-out`,
                textAlign: 'center'
              }}>
                <Box sx={{
                  fontSize: '200px',
                  animation: `${float} 3s ease-in-out infinite`,
                  filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))'
                }}>
                  🎓
                </Box>

                <Box sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 3,
                  mt: 3,
                  flexWrap: 'wrap'
                }}>
                  {['📚', '✏️', '🏆', '🎨'].map((emoji, index) => (
                    <Box
                      key={index}
                      sx={{
                        fontSize: '60px',
                        animation: `${bounce} ${2 + index * 0.2}s ease-in-out infinite`,
                        animationDelay: `${index * 0.1}s`
                      }}
                    >
                      {emoji}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      {/* ============= NEWS TICKER ============= */}
      <NewsTickerContainer>
        <NewsContent>
          {newsItems.join(' • ')} • {newsItems.join(' • ')}
        </NewsContent>
      </NewsTickerContainer>

      {/* ============= STATISTICS SECTION ============= */}
      <Box sx={{ py: 8, backgroundColor: '#f5f5f5' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            sx={{
              mb: 6,
              fontWeight: 'bold',
              color: '#DC143C',
              animation: `${fadeInUp} 1s ease-out`
            }}
          >
            Our Achievements 🏆
          </Typography>

          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <StatsCard elevation={3} delay={stat.delay}>
                  <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="h6">
                    {stat.label}
                  </Typography>
                </StatsCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ============= FEATURES SECTION ============= */}
      <Box sx={{ py: 8, background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            sx={{
              mb: 2,
              fontWeight: 'bold',
              color: '#DC143C',
              animation: `${fadeInUp} 1s ease-out`
            }}
          >
            Why Choose Us? 🌟
          </Typography>

          <Typography
            variant="h6"
            align="center"
            sx={{
              mb: 6,
              color: '#DC143C',
              animation: `${fadeInUp} 1s ease-out 0.2s both`
            }}
          >
            Providing Excellence in Education Since 2014
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FeatureCard delay={feature.delay}>
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <AnimatedIcon animationType={feature.animation}>
                      {feature.icon}
                    </AnimatedIcon>

                    <Typography
                      variant="h5"
                      sx={{
                        mb: 2,
                        fontWeight: 'bold',
                        color: '#DC143C'
                      }}
                    >
                      {feature.title}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{ color: '#6B6B6D' }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ============= CTA SECTION ============= */}
      <Box sx={{
        py: 8,
        background: 'linear-gradient(135deg, #8B8B8D 0%, #DC143C 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background Elements */}
        <Box sx={{ position: 'absolute', top: '10%', left: '5%', fontSize: '100px', opacity: 0.1, animation: `${float} 3s ease-in-out infinite` }}>🎓</Box>
        <Box sx={{ position: 'absolute', bottom: '10%', right: '5%', fontSize: '100px', opacity: 0.1, animation: `${bounce} 3s ease-in-out 1s infinite` }}>📚</Box>

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                mb: 3,
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              Ready to Join Our School Family? 🎉
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: 'white',
                mb: 4,
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              Admissions are now open! Give your child the best education.
            </Typography>

            <ShimmerButton
              size="large"
              onClick={() => navigate('/login')}
              startIcon={<CelebrationIcon />}
              sx={{ fontSize: '20px', padding: '15px 50px' }}
            >
              Apply Now!
            </ShimmerButton>
          </Box>
        </Container>
      </Box>

      {/* ============= SCROLL TO TOP BUTTON ============= */}
      <Zoom in={showScrollTop}>
        <IconButton
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            backgroundColor: '#DC143C',
            color: 'white',
            width: 60,
            height: 60,
            boxShadow: '0 4px 12px rgba(220, 20, 60, 0.4)',
            animation: `${pulse} 2s ease-in-out infinite`,
            '&:hover': {
              backgroundColor: '#B22222',
              transform: 'scale(1.1)'
            },
            zIndex: 1000
          }}
        >
          <ArrowUpIcon sx={{ fontSize: 30 }} />
        </IconButton>
      </Zoom>
    </Box>
  );
};

export default HomeBeautiful;
