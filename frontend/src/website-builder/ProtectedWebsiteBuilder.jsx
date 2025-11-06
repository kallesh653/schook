import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Paper,
  Alert
} from '@mui/material';
import { Lock, Login as LoginIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { baseUrl } from '../environment';
import CompleteWebsiteBuilder from './CompleteWebsiteBuilder';

const LoginContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 20px'
});

const LoginCard = styled(Paper)({
  maxWidth: '500px',
  width: '100%',
  padding: '60px 40px',
  borderRadius: '30px',
  boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
  textAlign: 'center'
});

const ProtectedWebsiteBuilder = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loginMode, setLoginMode] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        const response = await axios.get(`${baseUrl}/auth/check`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Try admin login first (for multi-admin system)
      const response = await axios.post(`${baseUrl}/admin/login`, {
        email: credentials.email,
        password: credentials.password
      });

      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setIsAuthenticated(true);
      }
    } catch (adminError) {
      // If admin login fails, try school login (legacy support)
      try {
        const response = await axios.post(`${baseUrl}/school/login`, {
          email: credentials.email,
          password: credentials.password
        });

        if (response.data.success && response.data.token) {
          localStorage.setItem('token', response.data.token);
          setIsAuthenticated(true);
        } else if (response.data.redirectToAdminLogin) {
          setError('This school uses Admin login. Please use your admin credentials.');
        }
      } catch (schoolError) {
        setError(schoolError.response?.data?.message || adminError.response?.data?.message || 'Login failed. Please check your credentials.');
      }
    }
  };

  if (loading) {
    return (
      <LoginContainer>
        <Typography variant="h4" color="white">Loading...</Typography>
      </LoginContainer>
    );
  }

  if (!isAuthenticated) {
    if (!loginMode) {
      // Welcome screen with login button
      return (
        <LoginContainer>
          <Container maxWidth="md">
            <LoginCard>
              <Lock sx={{ fontSize: 80, color: '#667eea', mb: 3 }} />
              <Typography variant="h2" gutterBottom fontWeight="bold" sx={{ color: '#667eea' }}>
                Website Builder
              </Typography>
              <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
                Login required to access the Website Builder
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Build and customize your school's website with our powerful visual editor.
                Complete control over every aspect of your home page!
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<LoginIcon />}
                onClick={() => setLoginMode(true)}
                sx={{
                  px: 6,
                  py: 2,
                  fontSize: '1.2rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '50px',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 15px 40px rgba(102, 126, 234, 0.6)'
                  }
                }}
              >
                Login to Continue
              </Button>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
                Only authorized school administrators can access this area
              </Typography>
            </LoginCard>
          </Container>
        </LoginContainer>
      );
    }

    // Login form
    return (
      <LoginContainer>
        <Container maxWidth="sm">
          <LoginCard>
            <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: '#667eea' }}>
              Login
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Enter your school admin credentials
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                required
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
                sx={{ mb: 4 }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  py: 2,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '50px',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  mb: 2
                }}
              >
                Login
              </Button>
              <Button
                variant="text"
                onClick={() => setLoginMode(false)}
                sx={{ textTransform: 'none' }}
              >
                ← Back
              </Button>
            </form>
          </LoginCard>
        </Container>
      </LoginContainer>
    );
  }

  // Authenticated - show complete website builder
  return <CompleteWebsiteBuilder />;
};

export default ProtectedWebsiteBuilder;
