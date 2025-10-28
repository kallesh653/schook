import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Card, CardContent, Grid, Fab } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../../../environment';
import {
  School as SchoolIcon,
  Person as PersonIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon
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

const SimpleHome = () => {
  const navigate = useNavigate();
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', color: 'white' }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 900,
                mb: 3,
                textShadow: '0 4px 20px rgba(0,0,0,0.2)',
                animation: `${fadeIn} 1s ease`
              }}
            >
              Welcome to GenTime
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: '1.2rem', md: '1.8rem' },
                mb: 5,
                opacity: 0.95,
                fontWeight: 400,
                animation: `${fadeIn} 1.2s ease`
              }}
            >
              Modern School Management System
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  background: 'white',
                  color: '#667eea',
                  px: 5,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: '30px',
                  textTransform: 'none',
                  animation: `${fadeIn} 1.4s ease`,
                  '&:hover': {
                    background: 'rgba(255,255,255,0.9)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
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
                  px: 5,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: '30px',
                  textTransform: 'none',
                  borderWidth: '2px',
                  animation: `${fadeIn} 1.6s ease`,
                  '&:hover': {
                    borderWidth: '2px',
                    background: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-3px)'
                  }
                }}
              >
                School Login
              </Button>
            </Box>
          </Box>
        </Container>
      </HeroSection>

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
