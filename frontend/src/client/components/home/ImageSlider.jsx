import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Paper, Fade } from '@mui/material';
import { 
  ArrowBackIos as PrevIcon, 
  ArrowForwardIos as NextIcon,
  FiberManualRecord as DotIcon 
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';

// Animation keyframes
const slideIn = keyframes`
  from { 
    opacity: 0;
    transform: translateX(50px);
  }
  to { 
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Styled components
const SliderContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '500px',
  overflow: 'hidden',
  borderRadius: '20px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
}));

const SlideImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.5s ease-in-out'
}));

const SlideOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
  color: 'white',
  padding: theme.spacing(4),
  transform: 'translateY(100%)',
  transition: 'transform 0.3s ease-in-out'
}));

const NavigationButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255,255,255,0.9)',
  color: '#333',
  width: '50px',
  height: '50px',
  zIndex: 2,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,1)',
    transform: 'translateY(-50%) scale(1.1)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
  }
}));

const DotsContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: theme.spacing(1),
  zIndex: 2
}));

const DotButton = styled(IconButton)(({ theme, active }) => ({
  padding: '4px',
  color: active ? '#fff' : 'rgba(255,255,255,0.5)',
  transition: 'all 0.3s ease',
  '&:hover': {
    color: '#fff',
    transform: 'scale(1.2)'
  }
}));

const SlideContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: '80px',
  left: '40px',
  right: '40px',
  color: 'white',
  zIndex: 2,
  animation: `${slideIn} 0.8s ease-out`
}));

const ImageSlider = ({ images = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Default images if none provided
  const defaultImages = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=500&fit=crop',
      title: 'Our Beautiful Campus',
      description: 'State-of-the-art facilities designed for modern learning'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=500&fit=crop',
      title: 'Modern Classrooms',
      description: 'Interactive learning environments with latest technology'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=500&fit=crop',
      title: 'Library & Resources',
      description: 'Extensive collection of books and digital resources'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop',
      title: 'Sports & Activities',
      description: 'Comprehensive sports facilities and extracurricular programs'
    }
  ];

  const slides = images.length > 0 ? images : defaultImages;

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [currentSlide, isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (slides.length === 0) {
    return null;
  }

  return (
    <SliderContainer
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Main Image */}
      <Fade in timeout={500} key={currentSlide}>
        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
          <SlideImage
            src={slides[currentSlide].url}
            alt={slides[currentSlide].title}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=500&fit=crop';
            }}
          />
          
          {/* Gradient Overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, rgba(0,0,0,0.3) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)'
            }}
          />
          
          {/* Slide Content */}
          <SlideContent>
            <Typography 
              variant="h3" 
              fontWeight="bold" 
              gutterBottom
              sx={{ 
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                mb: 2
              }}
            >
              {slides[currentSlide].title}
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                maxWidth: '600px',
                lineHeight: 1.6
              }}
            >
              {slides[currentSlide].description}
            </Typography>
          </SlideContent>
        </Box>
      </Fade>

      {/* Navigation Buttons */}
      {slides.length > 1 && (
        <>
          <NavigationButton
            onClick={prevSlide}
            sx={{ left: '20px' }}
          >
            <PrevIcon />
          </NavigationButton>
          
          <NavigationButton
            onClick={nextSlide}
            sx={{ right: '20px' }}
          >
            <NextIcon />
          </NavigationButton>
        </>
      )}

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <DotsContainer>
          {slides.map((_, index) => (
            <DotButton
              key={index}
              active={index === currentSlide}
              onClick={() => goToSlide(index)}
            >
              <DotIcon sx={{ fontSize: '12px' }} />
            </DotButton>
          ))}
        </DotsContainer>
      )}

      {/* Slide Counter */}
      <Box
        sx={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: 'bold',
          zIndex: 2
        }}
      >
        {currentSlide + 1} / {slides.length}
      </Box>
    </SliderContainer>
  );
};

export default ImageSlider;
