import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
  Button,
  Paper
} from '@mui/material';
import {
  Home,
  Dashboard,
  Add,
  Person,
  Category,
  LocalFlorist,
  Nature,
  Search,
  ShoppingBag
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const menuItems = [
  { text: 'Home', icon: <Home />, path: '/' },
  { text: 'Browse Products', icon: <Search />, path: '/browse' },
  { text: 'Categories', icon: <Category />, path: '/categories' },
];

const userMenuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Sell Product', icon: <Add />, path: '/create-product' },
  { text: 'My Profile', icon: <Person />, path: '/profile' },
];

const Sidebar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box
      sx={{
        width: 280,
        background: '#FFFFFF',
        color: '#000000',
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
        borderRight: '1px solid #E0E0E0'
      }}
    >
      {/* Logo/Brand Section */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            mb: 2,
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8
            }
          }}
          onClick={() => handleNavigate('/')}
        >
          <LocalFlorist sx={{ fontSize: 32, mr: 1, color: '#000000' }} />
          <Typography 
            variant="h5" 
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
        
        <Typography 
          variant="body2" 
          sx={{ 
            opacity: 1,
            fontStyle: 'italic',
            color: '#000000'
          }}
        >
          Where Students Connect & Trade
        </Typography>
      </Box>

      {/* User Profile Section */}
      {isAuthenticated && user ? (
        <Box sx={{ px: 3, mb: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: '#F8F9FA',
              borderRadius: 3,
              border: '1px solid #E0E0E0',
              textAlign: 'center'
            }}
          >
            <Avatar
              sx={{
                width: 60,
                height: 60,
                mx: 'auto',
                mb: 1,
                bgcolor: '#000000',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 600
              }}
            >
              {user.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 600,
                mb: 0.5,
                color: '#000000'
              }}
            >
              {user.name}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                opacity: 0.8,
                display: 'block',
                color: '#666666'
              }}
            >
              SMIT Student
            </Typography>
          </Paper>
        </Box>
      ) : (
        <Box sx={{ px: 3, mb: 3 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate('/login')}
            sx={{
              mb: 1,
              bgcolor: '#575757',
              backdropFilter: 'blur(10px)',
              border: '1px solid #D8C9AE',
              color: 'white',
              '&:hover': {
                bgcolor: '#4A4A4A',
              }
            }}
          >
            Sign In
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate('/register')}
            sx={{
              borderColor: '#575757',
              color: '#575757',
              '&:hover': {
                borderColor: '#4A4A4A',
                bgcolor: 'rgba(87, 87, 87, 0.1)',
              }
            }}
          >
            Sign Up
          </Button>
        </Box>
      )}

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mx: 2 }} />

      {/* Main Navigation */}
      <Box sx={{ flexGrow: 1, py: 2 }}>
        <List sx={{ px: 2 }}>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              onClick={() => handleNavigate(item.path)}
              sx={{
                borderRadius: 2,
                mb: 1,
                cursor: 'pointer',
                bgcolor: location.pathname === item.path ? 'rgba(215, 201, 174, 0.3)' : 'transparent',
                '&:hover': {
                  bgcolor: location.pathname === item.path ? 'rgba(215, 201, 174, 0.4)' : 'rgba(215, 201, 174, 0.2)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <ListItemIcon
                sx={{
                  color: '#575757',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{ 
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  fontSize: '0.95rem',
                  color: '#575757'
                }}
              />
            </ListItem>
          ))}
        </List>

        {isAuthenticated && (
          <>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mx: 2, my: 2 }} />
            <Typography 
              variant="overline" 
              sx={{ 
                px: 3, 
                py: 1, 
                opacity: 0.7,
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#B5D6B5',
                display: 'block'
              }}
            >
              Your Account
            </Typography>
            <List sx={{ px: 2 }}>
              {userMenuItems.map((item) => (
                <ListItem
                  key={item.text}
                  onClick={() => handleNavigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    cursor: 'pointer',
                    bgcolor: location.pathname === item.path ? 'rgba(215, 201, 174, 0.3)' : 'transparent',
                    '&:hover': {
                      bgcolor: location.pathname === item.path ? 'rgba(215, 201, 174, 0.4)' : 'rgba(215, 201, 174, 0.2)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: '#575757',
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{ 
                      fontWeight: location.pathname === item.path ? 600 : 400,
                      fontSize: '0.95rem',
                      color: '#575757'
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Box>

      {/* Bottom Section */}
      <Box sx={{ p: 2 }}>
        {isAuthenticated && (
          <Button
            variant="outlined"
            fullWidth
            onClick={handleLogout}
            sx={{
              mb: 2,
              borderColor: '#575757',
              color: '#575757',
              '&:hover': {
                borderColor: '#4A4A4A',
                bgcolor: 'rgba(87, 87, 87, 0.1)',
              },
            }}
          >
            Sign Out
          </Button>
        )}
        
        <Box sx={{ textAlign: 'center' }}>
          <Nature sx={{ fontSize: 20, opacity: 0.5, mb: 1, color: '#000000' }} />
          <Typography 
            variant="caption" 
            sx={{ 
              opacity: 1,
              display: 'block',
              lineHeight: 1.3,
              color: '#000000'
            }}
          >
            SMIT Bazaar
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
