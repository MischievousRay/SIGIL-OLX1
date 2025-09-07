import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Card,
  Grid
} from '@mui/material';
import { LocalFlorist, Nature, PersonAdd, School } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { register } = useAuth();
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
    setSuccess('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate campus email
    if (!formData.email.endsWith('@smit.smu.edu.in')) {
      setError('Please use your campus email (@smit.smu.edu.in)');
      setLoading(false);
      return;
    }

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      studentId: formData.studentId,
      phone: formData.phone
    });
    
    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#666666',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#000000',
      }
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#000000',
    }
  };

  return (
    <Box sx={{ 
      background: '#FFFFFF',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2,
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        pointerEvents: 'none'
      }
    }}>
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Card 
          elevation={0} 
          sx={{ 
            p: 6, 
            backgroundColor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 20px 40px rgba(45, 80, 22, 0.2)'
          }}
        >
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
            <LocalFlorist sx={{ fontSize: 40, color: '#000000', mr: 2 }} />
            <Typography 
              variant="h4" 
              sx={{ 
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700,
                color: '#000000',
                textShadow: 'none'
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
              bgcolor: 'rgba(0, 0, 0, 0.1)',
              borderRadius: '50%',
              width: 80,
              height: 80,
              mb: 3
            }}>
              <PersonAdd sx={{ fontSize: 40, color: '#000000' }} />
            </Box>
            
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 1, 
                fontFamily: '"Playfair Display", serif',
                fontWeight: 600, 
                color: '#000000'
              }}
            >
              Join the Community
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Create your account to start buying and selling with fellow SMIT students
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, opacity: 0.7 }}>
              <School sx={{ fontSize: 16, color: '#666666' }} />
              <Typography variant="caption" sx={{ color: '#666666' }}>
                Exclusive SMIT Bazaar
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

          {success && (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                bgcolor: 'rgba(45, 80, 22, 0.1)',
                border: '1px solid rgba(45, 80, 22, 0.2)'
              }}
            >
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  sx={textFieldStyles}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Student ID"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                  placeholder="e.g., SMIT-2023-001"
                  sx={textFieldStyles}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Campus Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@smit.smu.edu.in"
                  helperText="Use your official SMIT email address"
                  sx={textFieldStyles}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="03XXXXXXXXX"
                  sx={textFieldStyles}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  helperText="Minimum 6 characters"
                  sx={textFieldStyles}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  sx={textFieldStyles}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ 
                mt: 4, 
                mb: 3, 
                py: 1.5, 
                borderRadius: 3,
                backgroundColor: '#000000',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#333333',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
                  transform: 'translateY(-2px)',
                },
                '&:disabled': {
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                }
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Create Your Campus Account'}
            </Button>

            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <Button 
                    sx={{ 
                      p: 0, 
                      minWidth: 'auto',
                      color: '#000000',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'transparent',
                        color: '#666666',
                      }
                    }}
                  >
                    Sign in here
                  </Button>
                </Link>
              </Typography>
            </Box>
          </Box>
        </Card>

        {/* Decorative Elements */}
        <Box sx={{ position: 'absolute', top: -30, left: -30, opacity: 0.3, zIndex: 0 }}>
          <LocalFlorist sx={{ fontSize: 120, color: 'rgba(0,0,0,0.1)', transform: 'rotate(-15deg)' }} />
        </Box>
        <Box sx={{ position: 'absolute', bottom: -30, right: -30, opacity: 0.3, zIndex: 0 }}>
          <Nature sx={{ fontSize: 100, color: 'rgba(0,0,0,0.1)', transform: 'rotate(15deg)' }} />
        </Box>
        <Box sx={{ position: 'absolute', top: '50%', right: -50, opacity: 0.2, zIndex: 0 }}>
          <School sx={{ fontSize: 80, color: 'rgba(255,255,255,0.5)', transform: 'rotate(-30deg)' }} />
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterPage;
