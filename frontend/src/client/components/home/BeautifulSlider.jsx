import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Fade, useMediaQuery } from '@mui/material';
import {
  ArrowBackIos as PrevIcon,
  ArrowForwardIos as NextIcon,
  FiberManualRecord as DotIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  VolumeUp as VolumeIcon,
  VolumeOff as MuteIcon
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';

// Smooth slide animation
const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(100px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-100px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
`;

const zoomIn = keyframes`
  from {
    opacity: 0;
    transform: scale(1.1);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const kenBurns = keyframes`
  0% {
    transform: scale(1) translateX(0) translateY(0);
  }
  50% {
    transform: scale(1.08) translateX(-2%) translateY(-2%);
  }
  100% {
    transform: scale(1.15) translateX(-4%) translateY(-4%);
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

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled Components
const SliderContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '85vh',
  minHeight: '500px',
  maxHeight: '900px',
  overflow: 'hidden',
  background: '#000',
  [theme.breakpoints.down('md')]: {
    height: '60vh',
    minHeight: '400px'
  }
}));

const SlideWrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const SlideImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  animation: `${kenBurns} 12s ease-out infinite alternate`,
  transformOrigin: 'center center'
});

const SlideVideo = styled('video')({
  width: '100%',
  height: '100%',
  objectFit: 'cover'
});

const GradientOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.5) 100%)',
  pointerEvents: 'none',
  animation: `${fadeIn} 1s ease-out`
}));

const ContentOverlay = styled(Box)(({ theme, direction }) => ({
  position: 'absolute',
  bottom: '20%',
  left: 0,
  right: 0,
  padding: theme.spacing(0, 4),
  color: 'white',
  textAlign: 'center',
  zIndex: 2,
  animation: `${slideUp} 1s ease-out`,
  [theme.breakpoints.down('md')]: {
    bottom: '15%',
    padding: theme.spacing(0, 2)
  }
}));

const NavigationButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255,255,255,0.2)',
  backdropFilter: 'blur(15px)',
  color: 'white',
  width: '65px',
  height: '65px',
  zIndex: 3,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  border: '2px solid rgba(255,255,255,0.4)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.35)',
    transform: 'translateY(-50%) scale(1.15)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
    borderColor: 'rgba(255,255,255,0.8)'
  },
  [theme.breakpoints.down('md')]: {
    width: '50px',
    height: '50px'
  }
}));

const DotsContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: '30px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: theme.spacing(1.5),
  zIndex: 3,
  backgroundColor: 'rgba(0,0,0,0.3)',
  backdropFilter: 'blur(10px)',
  padding: theme.spacing(1, 2),
  borderRadius: '30px',
  border: '1px solid rgba(255,255,255,0.2)',
  [theme.breakpoints.down('md')]: {
    bottom: '15px',
    gap: theme.spacing(1),
    padding: theme.spacing(0.5, 1.5)
  }
}));

const Dot = styled(Box)(({ theme, active }) => ({
  width: active ? '32px' : '10px',
  height: '10px',
  borderRadius: '10px',
  backgroundColor: active ? 'white' : 'rgba(255,255,255,0.5)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'white',
    transform: 'scale(1.1)'
  }
}));

const ControlButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(255,255,255,0.15)',
  backdropFilter: 'blur(10px)',
  color: 'white',
  margin: theme.spacing(0.5),
  border: '1px solid rgba(255,255,255,0.3)',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.25)'
  }
}));

const BeautifulSlider = ({ slides = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [direction, setDirection] = useState('next');
  const [videoRefs] = useState({});
  const isMobile = useMediaQuery('(max-width:900px)');

  // Default slides if none provided
  const defaultSlides = [
    {
      id: 1,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&h=1080&fit=crop',
      title: 'Welcome to GenTime School',
      description: 'Empowering minds, shaping futures'
    },
    {
      id: 2,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&h=1080&fit=crop',
      title: 'Excellence in Education',
      description: 'State-of-the-art facilities and innovative teaching methods'
    },
    {
      id: 3,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920&h=1080&fit=crop',
      title: 'World-Class Resources',
      description: 'Extensive library and digital learning platforms'
    },
    {
      id: 4,
      type: 'video',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      title: 'Campus Virtual Tour',
      description: 'Experience our beautiful campus'
    },
    {
      id: 5,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1920&h=1080&fit=crop',
      title: 'Sports & Activities',
      description: 'Comprehensive athletic programs for all students'
    }
  ];

  const activeSlides = slides.length > 0 ? slides : defaultSlides;

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && !isPaused && activeSlides.length > 1) {
      const interval = setInterval(() => {
        nextSlide();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [currentSlide, isAutoPlaying, isPaused, activeSlides.length]);

  // Pause/play video when slide changes
  useEffect(() => {
    Object.keys(videoRefs).forEach(key => {
      if (videoRefs[key]) {
        if (parseInt(key) === currentSlide) {
          videoRefs[key].play().catch(() => {});
        } else {
          videoRefs[key].pause();
        }
      }
    });
  }, [currentSlide]);

  const nextSlide = () => {
    setDirection('next');
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  };

  const prevSlide = () => {
    setDirection('prev');
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const goToSlide = (index) => {
    setDirection(index > currentSlide ? 'next' : 'prev');
    setCurrentSlide(index);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRefs[currentSlide]) {
      videoRefs[currentSlide].muted = !isMuted;
    }
  };

  if (activeSlides.length === 0) {
    return null;
  }

  const currentSlideData = activeSlides[currentSlide];

  return (
    <SliderContainer
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Slide Content */}
      <Fade in timeout={800} key={currentSlide}>
        <SlideWrapper>
          {currentSlideData.type === 'video' ? (
            <SlideVideo
              ref={ref => videoRefs[currentSlide] = ref}
              src={currentSlideData.url}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              onError={(e) => {
                console.error('Video load error:', e);
              }}
            />
          ) : (
            <SlideImage
              src={currentSlideData.url}
              alt={currentSlideData.title}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&h=1080&fit=crop';
              }}
            />
          )}

          <GradientOverlay />

          {/* Content Overlay */}
          <ContentOverlay direction={direction}>
            <Typography
              variant={isMobile ? 'h4' : 'h2'}
              fontWeight="bold"
              gutterBottom
              sx={{
                textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
                mb: 2,
                letterSpacing: '0.02em'
              }}
            >
              {currentSlideData.title}
            </Typography>
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              sx={{
                textShadow: '1px 1px 4px rgba(0,0,0,0.7)',
                maxWidth: '800px',
                margin: '0 auto',
                lineHeight: 1.6,
                opacity: 0.95
              }}
            >
              {currentSlideData.description}
            </Typography>
          </ContentOverlay>
        </SlideWrapper>
      </Fade>

      {/* Navigation Buttons */}
      {activeSlides.length > 1 && !isMobile && (
        <>
          <NavigationButton
            onClick={prevSlide}
            sx={{ left: '30px' }}
          >
            <PrevIcon />
          </NavigationButton>

          <NavigationButton
            onClick={nextSlide}
            sx={{ right: '30px' }}
          >
            <NextIcon />
          </NavigationButton>
        </>
      )}

      {/* Video Controls */}
      {currentSlideData.type === 'video' && (
        <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 3 }}>
          <ControlButton onClick={toggleMute} size="small">
            {isMuted ? <VolumeIcon /> : <MuteIcon />}
          </ControlButton>
        </Box>
      )}

      {/* Dots Indicator */}
      {activeSlides.length > 1 && (
        <DotsContainer>
          {activeSlides.map((_, index) => (
            <Dot
              key={index}
              active={index === currentSlide}
              onClick={() => goToSlide(index)}
            />
          ))}
        </DotsContainer>
      )}

      {/* Slide Type Badge */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(10px)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '25px',
          fontSize: '14px',
          fontWeight: 'bold',
          zIndex: 3,
          border: '1px solid rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        {currentSlideData.type === 'video' && <PlayIcon sx={{ fontSize: 18 }} />}
        {currentSlide + 1} / {activeSlides.length}
      </Box>
    </SliderContainer>
  );
};

export default BeautifulSlider;
