import React from 'react';
import { Box } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

// Animations
const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
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

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

const LogoContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: 60,
  height: 60,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  animation: `${float} 3s ease-in-out infinite`,
  [theme.breakpoints.down('sm')]: {
    width: 50,
    height: 50,
  }
}));

const LogoBackground = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  borderRadius: '20px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
  animation: `${pulse} 2s ease-in-out infinite`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '20px',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
    backgroundSize: '200% 100%',
    animation: `${shimmer} 3s linear infinite`,
  }
}));

const GraduationCap = styled('svg')({
  width: '70%',
  height: '70%',
  position: 'relative',
  zIndex: 1,
  filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))',
  '& .cap-top': {
    animation: `${rotate} 8s linear infinite`,
    transformOrigin: '50% 50%',
  }
});

export default function AnimatedEducationLogo() {
  return (
    <LogoContainer>
      <LogoBackground />
      <GraduationCap viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Graduation Cap */}
        <g className="cap-main">
          {/* Cap Base */}
          <path
            d="M32 20L8 28L32 36L56 28L32 20Z"
            fill="white"
            opacity="0.9"
          />

          {/* Cap Board (Rotating) */}
          <g className="cap-top">
            <rect
              x="16"
              y="14"
              width="32"
              height="4"
              rx="2"
              fill="white"
            />
          </g>

          {/* Tassel */}
          <circle
            cx="32"
            cy="16"
            r="2"
            fill="#FFD700"
          >
            <animate
              attributeName="cy"
              values="16;18;16"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Cap sides */}
          <path
            d="M32 36L28 44V52L32 54L36 52V44L32 36Z"
            fill="white"
            opacity="0.8"
          />

          {/* Book */}
          <rect
            x="26"
            y="46"
            width="12"
            height="8"
            rx="1"
            fill="#FFD700"
            opacity="0.9"
          />
          <line
            x1="32"
            y1="46"
            x2="32"
            y2="54"
            stroke="white"
            strokeWidth="0.5"
            opacity="0.6"
          />

          {/* Sparkles */}
          <circle cx="12" cy="24" r="1.5" fill="#FFD700" opacity="0.8">
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="52" cy="24" r="1.5" fill="#FFD700" opacity="0.8">
            <animate
              attributeName="opacity"
              values="1;0.3;1"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="32" cy="12" r="1" fill="white" opacity="0.9">
            <animate
              attributeName="r"
              values="0.8;1.5;0.8"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </GraduationCap>
    </LogoContainer>
  );
}
