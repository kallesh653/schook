import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Card, CardContent, Box, Paper,
  Button, Chip, Avatar, IconButton, ImageList, ImageListItem,
  Rating, CircularProgress
} from '@mui/material';
import {
  School as SchoolIcon,
  PlayArrow as PlayIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Facebook, Twitter, Instagram, YouTube, LinkedIn
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import axios from 'axios';
import { baseUrl } from '../../../environment';
import { useNavigate } from 'react-router-dom';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const HeroSection = styled(Box)(({ theme, bgImage }) => ({
  position: 'relative',
  minHeight: '600px',
  backgroundImage: bgImage ? `url(${bgImage})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.4)'
  }
}));

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  animation: `${fadeIn} 0.6s ease-out`,
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-10px)'
  }
}));

const PublicHomePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [homeData, setHomeData] = useState(null);
  const [error, setError] = useState(null);

  // Get first school ID from localStorage or use a default
  const getSchoolId = () => {
    // Try to get from user data
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.id;
      } catch (e) {}
    }
    // For now, we'll need to handle this differently
    // In production, you might want to get school from subdomain or URL param
    return null;
  };

  useEffect(() => {
    fetchHomePageContent();
  }, []);

  const fetchHomePageContent = async () => {
    try {
      setLoading(true);
      const schoolId = getSchoolId();

      if (!schoolId) {
        // If no school ID, use a default or show a message
        setError('No school selected');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${baseUrl}/home-page-content/public/${schoolId}`
      );

      if (response.data.success) {
        setHomeData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching home page content:', error);
      setError('Unable to load home page content');
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
    return icons[platform] || null;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !homeData) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Welcome to Our School
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Home page content is being set up. Please check back soon!
        </Typography>
        <Button variant="contained" onClick={() => navigate('/login')}>
          Login
        </Button>
      </Container>
    );
  }

  const { header, sliders, statistics, about, exploreCampus, news, videos, gallery, programs, whyChooseUs, testimonials, sectionVisibility } = homeData;

  return (
    <Box>
      {/* Header */}
      {header && (
        <Box sx={{ bgcolor: header.primaryColor || '#667eea', color: 'white', py: 2 }}>
          <Container maxWidth="xl">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center" gap={2}>
                {header.logo && (
                  <Avatar src={baseUrl.replace('/api', '') + header.logo} alt={header.schoolName} sx={{ width: 50, height: 50 }} />
                )}
                <Box>
                  <Typography variant="h5" fontWeight="bold">{header.schoolName}</Typography>
                  <Typography variant="body2">{header.tagline}</Typography>
                </Box>
              </Box>
              <Box display="flex" gap={2} alignItems="center">
                {header.phone && (
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <PhoneIcon fontSize="small" />
                    <Typography variant="body2">{header.phone}</Typography>
                  </Box>
                )}
                {header.email && (
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <EmailIcon fontSize="small" />
                    <Typography variant="body2">{header.email}</Typography>
                  </Box>
                )}
                {header.socialMedia?.map((social, index) => (
                  <IconButton
                    key={index}
                    size="small"
                    sx={{ color: 'white' }}
                    href={social.url}
                    target="_blank"
                  >
                    {getSocialIcon(social.platform)}
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Container>
        </Box>
      )}

      {/* Hero Slider */}
      {sectionVisibility?.showSlider && sliders && sliders.length > 0 && (
        <HeroSection bgImage={sliders[0]?.image ? baseUrl.replace('/api', '') + sliders[0].image : null}>
          <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <Typography variant="h2" fontWeight="bold" gutterBottom>
              {sliders[0]?.title || header?.schoolName}
            </Typography>
            <Typography variant="h5" sx={{ mb: 4 }}>
              {sliders[0]?.description || header?.tagline}
            </Typography>
            {sliders[0]?.buttonText && sliders[0]?.buttonLink && (
              <Button
                variant="contained"
                size="large"
                onClick={() => window.location.href = sliders[0].buttonLink}
                sx={{ bgcolor: 'white', color: header?.primaryColor, '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }}
              >
                {sliders[0].buttonText}
              </Button>
            )}
          </Container>
        </HeroSection>
      )}

      {/* Statistics */}
      {sectionVisibility?.showStatistics && statistics && statistics.length > 0 && (
        <Container maxWidth="xl" sx={{ py: 8 }}>
          <Grid container spacing={4}>
            {statistics.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <StatCard elevation={3}>
                  <Typography variant="h3" fontWeight="bold">{stat.value}</Typography>
                  <Typography variant="h6" sx={{ mt: 1 }}>{stat.label}</Typography>
                  {stat.icon && <Typography variant="body2" sx={{ mt: 1 }}>{stat.icon}</Typography>}
                </StatCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      {/* About Us */}
      {sectionVisibility?.showAbout && about && (
        <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
          <Container maxWidth="xl">
            <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}>
              {about.description}
            </Typography>
            {about.images && about.images.length > 0 && (
              <Grid container spacing={2}>
                {about.images.map((img, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <img
                      src={baseUrl.replace('/api', '') + img}
                      alt={`About ${index + 1}`}
                      style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Container>
        </Box>
      )}

      {/* Programs */}
      {sectionVisibility?.showPrograms && programs && programs.length > 0 && (
        <Container maxWidth="xl" sx={{ py: 8 }}>
          <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom>
            Our Programs
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {programs.map((program, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card elevation={3} sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {program.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {program.description}
                    </Typography>
                    {program.ageGroup && (
                      <Chip label={`Age: ${program.ageGroup}`} size="small" color="primary" />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      {/* Gallery */}
      {sectionVisibility?.showGallery && gallery && gallery.length > 0 && (
        <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
          <Container maxWidth="xl">
            <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom>
              Photo Gallery
            </Typography>
            <ImageList cols={4} gap={16} sx={{ mt: 4 }}>
              {gallery.slice(0, 8).map((item, index) => (
                <ImageListItem key={index}>
                  <img
                    src={baseUrl.replace('/api', '') + item.url}
                    alt={item.title}
                    loading="lazy"
                    style={{ height: '250px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Container>
        </Box>
      )}

      {/* Testimonials */}
      {sectionVisibility?.showTestimonials && testimonials && testimonials.length > 0 && (
        <Container maxWidth="xl" sx={{ py: 8 }}>
          <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom>
            What Parents Say
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card elevation={3} sx={{ height: '100%', p: 2 }}>
                  <CardContent>
                    <Rating value={testimonial.rating || 5} readOnly sx={{ mb: 2 }} />
                    <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
                      "{testimonial.comment}"
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar>{testimonial.parentName?.[0]}</Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {testimonial.parentName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Parent of {testimonial.studentName}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      {/* Footer */}
      <Box sx={{ bgcolor: header?.primaryColor || '#667eea', color: 'white', py: 4, mt: 8 }}>
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {header?.schoolName}
              </Typography>
              <Typography variant="body2">
                {header?.tagline}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Contact
              </Typography>
              {header?.phone && <Typography variant="body2">Phone: {header.phone}</Typography>}
              {header?.email && <Typography variant="body2">Email: {header.email}</Typography>}
              {header?.address && <Typography variant="body2">Address: {header.address}</Typography>}
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Quick Links
              </Typography>
              <Button sx={{ color: 'white', display: 'block' }} onClick={() => navigate('/login')}>
                Admin Login
              </Button>
              <Button sx={{ color: 'white', display: 'block' }} onClick={() => navigate('/student-login')}>
                Student Login
              </Button>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid rgba(255,255,255,0.2)', textAlign: 'center' }}>
            <Typography variant="body2">
              © {new Date().getFullYear()} {header?.schoolName}. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default PublicHomePage;
