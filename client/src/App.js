import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CreateProductPage from './pages/CreateProductPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import BrowseProductsPage from './pages/BrowseProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { Box } from '@mui/material';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000000', // Black
      light: '#333333', // Dark gray
      dark: '#000000', // Black
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#666666', // Medium gray
      light: '#999999', // Light gray
      dark: '#333333', // Dark gray
    },
    background: {
      default: '#FAFAFA', // Very light gray
      paper: '#FFFFFF',
    },
    text: {
      primary: '#000000', // Black text
      secondary: '#666666', // Gray text
    },
    success: {
      main: '#000000',
      light: '#333333',
    },
    info: {
      main: '#666666',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1.2,
      fontFamily: '"Inter", sans-serif',
      color: '#000000',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
      fontFamily: '"Inter", sans-serif',
      color: '#000000',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.4,
      fontFamily: '"Inter", sans-serif',
      color: '#000000',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      fontFamily: '"Inter", sans-serif',
      color: '#000000',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      fontFamily: '"Inter", sans-serif',
      color: '#000000',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      fontFamily: '"Inter", sans-serif',
      color: '#000000',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      fontFamily: '"Inter", "Roboto", sans-serif',
      color: '#333333',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      fontFamily: '"Inter", "Roboto", sans-serif',
      color: '#666666',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8, // Less rounded for minimalist look
          fontWeight: 500,
          padding: '12px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          backgroundColor: '#000000',
          '&:hover': {
            backgroundColor: '#333333',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: 8,
          border: '1px solid #E0E0E0',
          '&:hover': {
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: '#E0E0E0',
            },
            '&:hover fieldset': {
              borderColor: '#000000',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#000000',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid #E0E0E0',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <SocketProvider>
          <Router>
            <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
              <Sidebar />
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/browse" element={<BrowseProductsPage />} />
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/product/:id" element={<ProductDetailsPage />} />
                  <Route path="/create-product" element={
                    <ProtectedRoute>
                      <CreateProductPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } />
                </Routes>
              </Box>
            </Box>
          </Box>
        </Router>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
