import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, IconButton, Button } from '@mui/material';
import {
  Close as CloseIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';

// Slide down animation
const slideDown = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

// Pulse animation for icon
const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
`;

// Shimmer effect
const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

// Styled alert banner with gradient and glass morphism
const StyledBanner = styled(Box)(({ type, theme }) => {
  const colors = {
    info: {
      bg: 'linear-gradient(135deg, rgba(33, 150, 243, 0.95) 0%, rgba(21, 101, 192, 0.95) 100%)',
      shadow: 'rgba(33, 150, 243, 0.4)',
      border: 'rgba(255, 255, 255, 0.3)'
    },
    success: {
      bg: 'linear-gradient(135deg, rgba(76, 175, 80, 0.95) 0%, rgba(56, 142, 60, 0.95) 100%)',
      shadow: 'rgba(76, 175, 80, 0.4)',
      border: 'rgba(255, 255, 255, 0.3)'
    },
    warning: {
      bg: 'linear-gradient(135deg, rgba(255, 152, 0, 0.95) 0%, rgba(245, 124, 0, 0.95) 100%)',
      shadow: 'rgba(255, 152, 0, 0.4)',
      border: 'rgba(255, 255, 255, 0.3)'
    },
    error: {
      bg: 'linear-gradient(135deg, rgba(244, 67, 54, 0.95) 0%, rgba(211, 47, 47, 0.95) 100%)',
      shadow: 'rgba(244, 67, 54, 0.4)',
      border: 'rgba(255, 255, 255, 0.3)'
    }
  };

  const colorScheme = colors[type] || colors.info;

  return {
    background: colorScheme.bg,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    color: 'white',
    padding: '16px 0',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: `0 4px 20px ${colorScheme.shadow}`,
    borderBottom: `2px solid ${colorScheme.border}`,
    animation: `${slideDown} 0.6s cubic-bezier(0.4, 0, 0.2, 1)`,
    zIndex: 1100,
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
      animation: `${shimmer} 3s infinite`
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      background: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
      pointerEvents: 'none'
    }
  };
});

const IconWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  animation: `${pulse} 2s ease-in-out infinite`,
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  border: '2px solid rgba(255, 255, 255, 0.3)',
  '& svg': {
    fontSize: '28px',
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
  }
});

const AlertBanner = ({
  show = false,
  message = '',
  type = 'info',
  dismissible = true,
  autoHide = false,
  autoHideDelay = 5000,
  link = '',
  linkText = 'Learn More',
  onDismiss
}) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);

    if (show && autoHide && autoHideDelay > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [show, autoHide, autoHideDelay]);

  const handleDismiss = () => {
    setVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  const getIcon = () => {
    const icons = {
      info: <InfoIcon />,
      success: <SuccessIcon />,
      warning: <WarningIcon />,
      error: <ErrorIcon />
    };
    return icons[type] || icons.info;
  };

  if (!visible || !message) {
    return null;
  }

  return (
    <StyledBanner type={type}>
      <Container maxWidth="xl">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
          sx={{ position: 'relative', zIndex: 1 }}
        >
          {/* Icon */}
          <Box display="flex" alignItems="center" gap={2} flex={1}>
            <IconWrapper>
              {getIcon()}
            </IconWrapper>

            {/* Message */}
            <Box flex={1}>
              <Typography
                variant="h6"
                fontWeight="600"
                sx={{
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                  fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' },
                  lineHeight: 1.4
                }}
              >
                {message}
              </Typography>
            </Box>
          </Box>

          {/* Actions */}
          <Box display="flex" alignItems="center" gap={2}>
            {link && (
              <Button
                variant="contained"
                endIcon={<ArrowIcon />}
                onClick={() => window.open(link, '_blank')}
                sx={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  fontWeight: 'bold',
                  px: 3,
                  py: 1,
                  borderRadius: '25px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.3)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)'
                  }
                }}
              >
                {linkText}
              </Button>
            )}

            {dismissible && (
              <IconButton
                onClick={handleDismiss}
                size="small"
                sx={{
                  color: 'white',
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.25)',
                    transform: 'scale(1.1)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                  }
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>
      </Container>
    </StyledBanner>
  );
};

export default AlertBanner;
