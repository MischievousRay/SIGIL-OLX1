import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Card
} from '@mui/material';
import { LocalFlorist, Nature, Login } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Add a small delay to ensure user state is updated
      setTimeout(() => {
        navigate('/');
      }, 100);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <Box sx={{ 
      background: '#FAFAFA',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2
    }}>
      <Container maxWidth="sm">
        <Card 
          elevation={1} 
          sx={{ 
            p: 6, 
            backgroundColor: '#FFFFFF',
            borderRadius: 4,
            border: '1px solid #E0E0E0',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
            <LocalFlorist sx={{ fontSize: 40, color: '#000000', mr: 2 }} />
            <Typography 
              variant="h4" 
              sx={{ 
                fontFamily: '"Inter", sans-serif',
                fontWeight: 700,
                color: '#000000'
              }}
            >
              SMIT Bazaar
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              bgcolor: '#F8F9FA',
              borderRadius: '50%',
              width: 80,
              height: 80,
              mb: 3,
              border: '1px solid #E0E0E0'
            }}>
              <Login sx={{ fontSize: 40, color: '#000000' }} />
            </Box>
            
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 1, 
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600, 
                color: '#000000'
              }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#666666' }}>
              Sign in to your campus marketplace account
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, opacity: 0.7 }}>
              <Nature sx={{ fontSize: 16, color: '#999999' }} />
              <Typography variant="caption" sx={{ color: '#999999' }}>
                Where Students Connect & Trade
              </Typography>
            </Box>
          </Box>
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                bgcolor: 'rgba(255, 77, 77, 0.1)',
                border: '1px solid rgba(255, 77, 77, 0.2)'
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Campus Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              margin="normal"
              placeholder="your.email@smit.smu.edu.in"
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4A7C59',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2D5016',
                  }
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#2D5016',
                }
              }}
            />
            
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              margin="normal"
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#000000',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#000000',
                  }
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#000000',
                }
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ 
                mb: 3, 
                py: 1.5, 
                borderRadius: 3,
                bgcolor: '#000000',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#333333',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                  transform: 'translateY(-2px)',
                },
                '&:disabled': {
                  bgcolor: '#CCCCCC',
                }
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign In to Campus Market'}
            </Button>

            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  <Button 
                    sx={{ 
                      p: 0, 
                      minWidth: 'auto',
                      color: '#2D5016',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'transparent',
                        color: '#4A7C59',
                      }
                    }}
                  >
                    Sign up here
                  </Button>
                </Link>
              </Typography>
            </Box>
          </Box>
        </Card>

        {/* Decorative Elements */}
        <Box sx={{ position: 'absolute', top: -20, left: -20, opacity: 0.3, zIndex: 0 }}>
          <LocalFlorist sx={{ fontSize: 100, color: 'rgba(255,255,255,0.5)', transform: 'rotate(-15deg)' }} />
        </Box>
        <Box sx={{ position: 'absolute', bottom: -20, right: -20, opacity: 0.3, zIndex: 0 }}>
          <Nature sx={{ fontSize: 80, color: 'rgba(255,255,255,0.5)', transform: 'rotate(15deg)' }} />
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
