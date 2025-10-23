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
  useScrollTrigger,
  Slide,
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
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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

// Styled Components
const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '100vh',
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
  transition: 'opacity 1s ease-in-out',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)',
    zIndex: 1,
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
  animation: `${fadeInUp} 1s ease-out`,
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

const TopContactBar = styled(Box)(({ theme }) => ({
  backgroundColor: '#1a237e',
  color: '#fff',
  padding: theme.spacing(1, 0),
}));

const StickyAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#fff',
  color: '#333',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const LogoImage = styled('img')({
  height: '50px',
  width: 'auto',
});

const Section = styled(Box)(({ theme, bgcolor }) => ({
  padding: theme.spacing(10, 0),
  backgroundColor: bgcolor || '#fff',
  width: '100%',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  textAlign: 'center',
  background: 'linear-gradient(135deg, #1a237e 0%, #3f51b5 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: `${fadeInUp} 0.8s ease-out`,
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
}));

const StatCard = styled(Card)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4),
  height: '100%',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
  borderRadius: '16px',
  animation: `${float} 3s ease-in-out infinite`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
  },
}));

const AboutBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  borderRadius: '16px',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  },
}));

const ProgramCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: '16px',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
  },
}));

const GalleryItem = styled(Box)(({ theme }) => ({
  position: 'relative',
  paddingTop: '75%',
  overflow: 'hidden',
  borderRadius: '16px',
  cursor: 'pointer',
  '&:hover .gallery-image': {
    transform: 'scale(1.1)',
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
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.3s ease',
});

const TestimonialCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  position: 'relative',
  height: '100%',
  background: '#fff',
  boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
  },
}));

const QuoteIcon = styled(FormatQuote)(({ theme }) => ({
  fontSize: '4rem',
  color: '#1a237e',
  opacity: 0.2,
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(2),
}));

const Footer = styled(Box)(({ theme }) => ({
  backgroundColor: '#1a237e',
  color: '#fff',
  padding: theme.spacing(6, 0, 3, 0),
}));

const SocialIcon = styled(IconButton)(({ theme }) => ({
  color: '#fff',
  '&:hover': {
    color: '#3f51b5',
    transform: 'translateY(-3px)',
  },
  transition: 'all 0.3s ease',
}));

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const PublicHomePage = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await axios.get(`${baseUrl}/home-page-content/public`);
      setContent(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching home page content:', error);
      setLoading(false);
    }
  };

  // Auto-rotate hero slider every 5 seconds
  useEffect(() => {
    if (content?.heroSlider?.slides?.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) =>
          prev === content.heroSlider.slides.length - 1 ? 0 : prev + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [content]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? content.heroSlider.slides.length - 1 : prev - 1
    );
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) =>
      prev === content.heroSlider.slides.length - 1 ? 0 : prev + 1
    );
  };

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography variant="h4">Loading...</Typography>
      </Box>
    );
  }

  if (!content) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography variant="h4">No content available</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Top Contact Bar */}
      <TopContactBar>
        <Container maxWidth="lg">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
          >
            <Box display="flex" gap={3} flexWrap="wrap">
              {content.contactPhone && (
                <Box display="flex" alignItems="center" gap={1}>
                  <Phone fontSize="small" />
                  <Typography variant="body2">{content.contactPhone}</Typography>
                </Box>
              )}
              {content.contactEmail && (
                <Box display="flex" alignItems="center" gap={1}>
                  <Email fontSize="small" />
                  <Typography variant="body2">{content.contactEmail}</Typography>
                </Box>
              )}
            </Box>
            <Box display="flex" gap={1}>
              {content.socialMedia?.facebook && (
                <SocialIcon
                  size="small"
                  component="a"
                  href={content.socialMedia.facebook}
                  target="_blank"
                >
                  <Facebook fontSize="small" />
                </SocialIcon>
              )}
              {content.socialMedia?.twitter && (
                <SocialIcon
                  size="small"
                  component="a"
                  href={content.socialMedia.twitter}
                  target="_blank"
                >
                  <Twitter fontSize="small" />
                </SocialIcon>
              )}
              {content.socialMedia?.instagram && (
                <SocialIcon
                  size="small"
                  component="a"
                  href={content.socialMedia.instagram}
                  target="_blank"
                >
                  <Instagram fontSize="small" />
                </SocialIcon>
              )}
              {content.socialMedia?.linkedin && (
                <SocialIcon
                  size="small"
                  component="a"
                  href={content.socialMedia.linkedin}
                  target="_blank"
                >
                  <LinkedIn fontSize="small" />
                </SocialIcon>
              )}
              {content.socialMedia?.youtube && (
                <SocialIcon
                  size="small"
                  component="a"
                  href={content.socialMedia.youtube}
                  target="_blank"
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
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ fontWeight: 700, color: '#1a237e' }}
                >
                  {content.header?.schoolName || 'School Name'}
                </Typography>
              </LogoContainer>
              <Box display="flex" gap={3}>
                <Button color="inherit" href="#about">
                  About
                </Button>
                <Button color="inherit" href="#programs">
                  Programs
                </Button>
                <Button color="inherit" href="#gallery">
                  Gallery
                </Button>
                <Button color="inherit" href="#testimonials">
                  Testimonials
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
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
        {content.heroSlider?.slides?.map((slide, index) => (
          <HeroSlide key={index} active={currentSlide === index}>
            {slide.mediaType === 'video' && slide.video ? (
              <HeroVideo
                src={getImageUrl(slide.video)}
                autoPlay
                loop
                muted
                playsInline
              />
            ) : slide.image ? (
              <HeroMedia src={getImageUrl(slide.image)} alt={slide.title} />
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
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              {content.heroSlider?.slides?.[currentSlide]?.title || 'Welcome'}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: '1.2rem', md: '1.5rem', lg: '1.8rem' },
                marginBottom: 4,
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              {content.heroSlider?.slides?.[currentSlide]?.subtitle || ''}
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                padding: '15px 40px',
                fontSize: '1.1rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Learn More
            </Button>
          </Container>
        </HeroContent>

        {/* Navigation Arrows */}
        {content.heroSlider?.slides?.length > 1 && (
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
        {content.heroSlider?.slides?.length > 1 && (
          <SliderDots>
            {content.heroSlider.slides.map((_, index) => (
              <Dot
                key={index}
                active={currentSlide === index}
                onClick={() => handleDotClick(index)}
              />
            ))}
          </SliderDots>
        )}
      </HeroSection>

      {/* Statistics Section */}
      {content.statistics && (
        <Section bgcolor="#f5f5f5">
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              {content.statistics.totalStudents && (
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard>
                    <Groups sx={{ fontSize: '4rem', marginBottom: 2 }} />
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                      {content.statistics.totalStudents}
                    </Typography>
                    <Typography variant="h6">Students</Typography>
                  </StatCard>
                </Grid>
              )}
              {content.statistics.totalTeachers && (
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard sx={{ animationDelay: '0.2s' }}>
                    <School sx={{ fontSize: '4rem', marginBottom: 2 }} />
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                      {content.statistics.totalTeachers}
                    </Typography>
                    <Typography variant="h6">Teachers</Typography>
                  </StatCard>
                </Grid>
              )}
              {content.statistics.totalPrograms && (
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard sx={{ animationDelay: '0.4s' }}>
                    <LocalLibrary sx={{ fontSize: '4rem', marginBottom: 2 }} />
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                      {content.statistics.totalPrograms}
                    </Typography>
                    <Typography variant="h6">Programs</Typography>
                  </StatCard>
                </Grid>
              )}
              {content.statistics.awards && (
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard sx={{ animationDelay: '0.6s' }}>
                    <EmojiEvents sx={{ fontSize: '4rem', marginBottom: 2 }} />
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                      {content.statistics.awards}
                    </Typography>
                    <Typography variant="h6">Awards</Typography>
                  </StatCard>
                </Grid>
              )}
            </Grid>
          </Container>
        </Section>
      )}

      {/* About Section */}
      {content.about && (
        <Section id="about">
          <Container maxWidth="lg">
            <SectionTitle variant="h2">About Us</SectionTitle>
            <SectionSubtitle>{content.about.description}</SectionSubtitle>

            <Grid container spacing={4} sx={{ marginTop: 4 }}>
              {content.about.mission && (
                <Grid item xs={12} md={6}>
                  <AboutBox elevation={0}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        marginBottom: 2,
                        color: '#1a237e',
                      }}
                    >
                      Our Mission
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
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
                        color: '#1a237e',
                      }}
                    >
                      Our Vision
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                      {content.about.vision}
                    </Typography>
                  </AboutBox>
                </Grid>
              )}
            </Grid>
          </Container>
        </Section>
      )}

      {/* Programs Section */}
      {content.programs?.items?.length > 0 && (
        <Section id="programs" bgcolor="#f5f5f5">
          <Container maxWidth="lg">
            <SectionTitle variant="h2">Our Programs</SectionTitle>
            <SectionSubtitle>
              Explore our diverse range of educational programs
            </SectionSubtitle>

            <Grid container spacing={4}>
              {content.programs.items.map((program, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <ProgramCard>
                    {program.image && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={getImageUrl(program.image)}
                        alt={program.name}
                      />
                    )}
                    <CardContent sx={{ padding: 3 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          marginBottom: 2,
                          color: '#1a237e',
                        }}
                      >
                        {program.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: '#666', lineHeight: 1.8 }}
                      >
                        {program.description}
                      </Typography>
                    </CardContent>
                  </ProgramCard>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Section>
      )}

      {/* Gallery Section */}
      {content.gallery?.items?.length > 0 && (
        <Section id="gallery">
          <Container maxWidth="lg">
            <SectionTitle variant="h2">Gallery</SectionTitle>
            <SectionSubtitle>
              Glimpses of our vibrant school community
            </SectionSubtitle>

            <Grid container spacing={3}>
              {content.gallery.items.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <GalleryItem>
                    {item.type === 'video' ? (
                      <>
                        <GalleryImage
                          src={getImageUrl(item.thumbnail || item.url)}
                          alt={item.caption}
                          className="gallery-image"
                        />
                        <GalleryOverlay className="gallery-overlay">
                          <PlayCircleOutline
                            sx={{ fontSize: '4rem', color: '#fff' }}
                          />
                        </GalleryOverlay>
                      </>
                    ) : (
                      <GalleryImage
                        src={getImageUrl(item.url)}
                        alt={item.caption}
                        className="gallery-image"
                      />
                    )}
                  </GalleryItem>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Section>
      )}

      {/* Testimonials Section */}
      {content.testimonials?.items?.length > 0 && (
        <Section id="testimonials" bgcolor="#f5f5f5">
          <Container maxWidth="lg">
            <SectionTitle variant="h2">Testimonials</SectionTitle>
            <SectionSubtitle>
              What our students and parents say about us
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
                        }}
                      >
                        "{testimonial.text}"
                      </Typography>
                      <Box display="flex" alignItems="center" gap={2}>
                        {testimonial.image && (
                          <Avatar
                            src={getImageUrl(testimonial.image)}
                            alt={testimonial.name}
                            sx={{ width: 50, height: 50 }}
                          />
                        )}
                        <Box>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 700, color: '#1a237e' }}
                          >
                            {testimonial.name}
                          </Typography>
                          {testimonial.role && (
                            <Typography variant="body2" sx={{ color: '#666' }}>
                              {testimonial.role}
                            </Typography>
                          )}
                        </Box>
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
      <Footer>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: 2 }}>
                {content.header?.schoolName || 'School Name'}
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: 2, opacity: 0.9 }}>
                {content.about?.description || 'Empowering students to excel'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: 2 }}>
                Quick Links
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Button color="inherit" href="#about" sx={{ justifyContent: 'flex-start' }}>
                  About Us
                </Button>
                <Button color="inherit" href="#programs" sx={{ justifyContent: 'flex-start' }}>
                  Programs
                </Button>
                <Button color="inherit" href="#gallery" sx={{ justifyContent: 'flex-start' }}>
                  Gallery
                </Button>
                <Button color="inherit" href="#testimonials" sx={{ justifyContent: 'flex-start' }}>
                  Testimonials
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: 2 }}>
                Contact Us
              </Typography>
              {content.contactPhone && (
                <Box display="flex" alignItems="center" gap={1} sx={{ marginBottom: 1 }}>
                  <Phone fontSize="small" />
                  <Typography variant="body2">{content.contactPhone}</Typography>
                </Box>
              )}
              {content.contactEmail && (
                <Box display="flex" alignItems="center" gap={1} sx={{ marginBottom: 2 }}>
                  <Email fontSize="small" />
                  <Typography variant="body2">{content.contactEmail}</Typography>
                </Box>
              )}
              <Box display="flex" gap={1} sx={{ marginTop: 2 }}>
                {content.socialMedia?.facebook && (
                  <SocialIcon component="a" href={content.socialMedia.facebook} target="_blank">
                    <Facebook />
                  </SocialIcon>
                )}
                {content.socialMedia?.twitter && (
                  <SocialIcon component="a" href={content.socialMedia.twitter} target="_blank">
                    <Twitter />
                  </SocialIcon>
                )}
                {content.socialMedia?.instagram && (
                  <SocialIcon component="a" href={content.socialMedia.instagram} target="_blank">
                    <Instagram />
                  </SocialIcon>
                )}
                {content.socialMedia?.linkedin && (
                  <SocialIcon component="a" href={content.socialMedia.linkedin} target="_blank">
                    <LinkedIn />
                  </SocialIcon>
                )}
                {content.socialMedia?.youtube && (
                  <SocialIcon component="a" href={content.socialMedia.youtube} target="_blank">
                    <YouTube />
                  </SocialIcon>
                )}
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)', margin: '30px 0 20px 0' }} />
          <Typography variant="body2" sx={{ textAlign: 'center', opacity: 0.8 }}>
            &copy; {new Date().getFullYear()} {content.header?.schoolName || 'School Name'}. All rights reserved.
          </Typography>
        </Container>
      </Footer>
    </Box>
  );
};

export default PublicHomePage;
