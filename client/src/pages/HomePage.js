  import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Fade,
  Paper,
  CircularProgress,
  IconButton,
  Badge
} from '@mui/material';
import {
  Search,
  Nature,
  LocalFlorist,
  AttachMoney,
  Person,
  AccessTime,
  ShoppingBag,
  Add,
  Category,
  Storefront
} from '@mui/icons-material';
import axios from 'axios';
import ChatButton from '../components/Chat/ChatButton';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Books & Stationery', 'Electronics', 'Laptops & Computers', 'Mobile Phones', 'Furniture', 'Sports & Fitness', 'Fashion & Accessories', 'Other'];

  const getCategoryIcon = (categoryName) => {
    const icons = {
      'Electronics': '📱',
      'Books & Stationery': '�',
      'Fashion & Accessories': '👕',
      'Furniture': '🪑',
      'Laptops & Computers': '💻',
      'Mobile Phones': '📱',
      'Sports & Fitness': '⚽',
      'Other': '🛍️'
    };
    return icons[categoryName] || '�️';
  };

  const getCategoryColor = (index) => {
    const colors = [
      'rgba(45, 80, 22, 0.05)',
      'rgba(74, 124, 89, 0.05)',
      'rgba(143, 188, 143, 0.05)',
      'rgba(181, 214, 181, 0.05)'
    ];
    return colors[index % colors.length];
  };

  const featuredCategories = categoryStats.slice(0, 4).map((stat, index) => ({
    name: stat._id,
    icon: getCategoryIcon(stat._id),
    color: getCategoryColor(index),
    count: stat.count
  }));

  useEffect(() => {
    console.log('HomePage useEffect triggered');
    fetchProducts();
    fetchCategoryStats();
  }, []);

  const fetchCategoryStats = async () => {
    try {
      console.log('HomePage fetching category stats');
      const response = await axios.get('/products/categories/stats');
      console.log('HomePage category stats response:', response.data);
      setCategoryStats(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching category stats:', error);
    }
  };

  const fetchProducts = async () => {
    console.log('HomePage fetchProducts called');
    try {
      const url = '/products?limit=12';
      console.log('HomePage making request to:', url);
      const response = await axios.get(url);
      console.log('HomePage response received:', response.data);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('HomePage Error fetching products:', error);
      console.error('HomePage Error message:', error.message);
      console.error('HomePage Error response:', error.response);
      console.error('HomePage Error config:', error.config);
      console.error('HomePage Axios defaults:', {
        baseURL: axios.defaults.baseURL,
        headers: axios.defaults.headers
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/browse');
    }
  };

  const handleCategoryClick = (categoryName) => {
    if (categoryName === 'All') {
      navigate('/browse');
    } else {
      navigate(`/browse?category=${encodeURIComponent(categoryName)}`);
    }
  };

  const formatPrice = (price) => {
    return 'INR ' + new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0
    }).format(price);
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'New': return '#000000';
      case 'Like New': return '#666666';
      case 'Good': return '#999999';
      case 'Fair': return '#BBBBBB';
      case 'Poor': return '#CCCCCC';
      default: return '#E0E0E0';
    }
  };

  return (
    <Box sx={{ bgcolor: '#FAFAFA', minHeight: '100vh' }}>
      {/* Hero Section with Modern Minimalist Design */}
      <Box 
        sx={{ 
          background: '#FFFFFF',
          color: '#333333',
          py: { xs: 6, md: 10 },
          position: 'relative',
          overflow: 'hidden',
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #F0F0F0'
        }}
      >
        {/* Subtle Decorative Elements */}
        <Box 
          sx={{ 
            position: 'absolute',
            top: '20%',
            right: '10%',
            opacity: 0.02,
            fontSize: '4rem',
            color: '#E0E0E0'
          }}
        >
          <ShoppingBag />
        </Box>
        <Box 
          sx={{ 
            position: 'absolute',
            bottom: '30%',
            left: '5%',
            opacity: 0.02,
            fontSize: '3rem',
            color: '#E0E0E0'
          }}
        >
          <Storefront />
        </Box>
        
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box>
                  <Typography 
                    variant="h1" 
                    sx={{ 
                      mb: 3,
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 700,
                      color: '#000000',
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      lineHeight: 1.2,
                      letterSpacing: '-0.02em'
                    }}
                  >
                    SMIT Bazaar
                  </Typography>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 4,
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 300,
                      color: '#000000',
                      opacity: 1,
                      fontSize: { xs: '1.2rem', md: '1.5rem' },
                      lineHeight: 1.4
                    }}
                  >
                    Your campus marketplace reimagined
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 5,
                      fontFamily: '"Inter", sans-serif',
                      color: '#000000',
                      fontSize: { xs: '1rem', md: '1.1rem' },
                      maxWidth: '500px',
                      lineHeight: 1.6,
                      opacity: 1
                    }}
                  >
                    Buy, sell, and connect within our trusted campus community with ease and simplicity.
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/browse')}
                      sx={{
                        bgcolor: '#000000',
                        color: 'white',
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 500,
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        minWidth: '160px',
                        '&:hover': {
                          bgcolor: '#333333',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Browse Products
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/create-product')}
                      sx={{
                        borderColor: '#000000',
                        color: '#000000',
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 500,
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        minWidth: '160px',
                        borderWidth: '2px',
                        '&:hover': {
                          bgcolor: '#000000',
                          color: 'white',
                          borderColor: '#000000',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Start Selling
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Fade in timeout={1500}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 4,
                    bgcolor: '#FFFFFF',
                    borderRadius: 3,
                    border: '1px solid #E0E0E0'
                  }}
                >
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 3, 
                      color: '#000000',
                      fontFamily: '"Inter", sans-serif',
                      textAlign: 'center',
                      fontWeight: 600
                    }}
                  >
                    🔍 Search Products
                  </Typography>
                  
                  <TextField
                    fullWidth
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: '#666666' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button 
                            variant="contained" 
                            onClick={handleSearch}
                            sx={{ 
                              borderRadius: 2,
                              bgcolor: '#000000',
                              textTransform: 'none',
                              '&:hover': {
                                bgcolor: '#333333'
                              }
                            }}
                          >
                            Search
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {['Electronics', 'Books & Stationery', 'Fashion & Accessories', 'Furniture'].map((category) => (
                      <Chip
                        key={category}
                        label={category}
                        onClick={() => handleCategoryClick(category)}
                        variant="outlined"
                        size="small"
                        sx={{
                          borderColor: '#CCCCCC',
                          color: '#333333',
                          '&:hover': {
                            bgcolor: '#F5F5F5',
                            cursor: 'pointer',
                            borderColor: '#000000'
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Paper>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Featured Categories */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            mb: 4, 
            textAlign: 'center',
            fontFamily: '"Inter", sans-serif',
            color: '#000000',
            fontWeight: 600
          }}
        >
          Popular Categories
        </Typography>
        
        <Grid container spacing={3}>
          {featuredCategories.map((category, index) => (
            <Grid item xs={6} md={3} key={category.name}>
              <Fade in timeout={1000 + index * 200}>
                <Card 
                  sx={{ 
                    textAlign: 'center',
                    cursor: 'pointer',
                    bgcolor: '#FFFFFF',
                    borderRadius: 3,
                    border: '1px solid #E0E0E0',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <CardContent sx={{ py: 4 }}>
                    <Typography variant="h2" sx={{ mb: 1, fontSize: '3rem' }}>
                      {category.icon}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 1,
                        fontFamily: '"Inter", sans-serif',
                        color: '#000000',
                        fontWeight: 600
                      }}
                    >
                      {category.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666666' }}>
                      {category.count} items available
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Products */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontFamily: '"Inter", sans-serif',
              fontWeight: 600,
              color: '#000000',
              fontSize: { xs: '1.75rem', md: '2.25rem' }
            }}
          >
            Latest Products
          </Typography>
          
          <Button
            variant="outlined"
            onClick={() => navigate('/browse')}
            sx={{
              borderColor: '#000000',
              color: '#000000',
              textTransform: 'none',
              fontWeight: 500,
              fontFamily: '"Inter", sans-serif',
              px: 3,
              py: 1,
              borderRadius: 2,
              '&:hover': {
                bgcolor: '#000000',
                color: 'white'
              }
            }}
          >
            View All
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#000000' }} />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {products.slice(0, 8).map((product, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <Fade in timeout={500 + index * 100}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 2,
                      border: '1px solid #E0E0E0',
                      backgroundColor: '#FFFFFF',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                        borderColor: '#CCCCCC',
                        '& .product-image': {
                          transform: 'scale(1.02)',
                        }
                      }
                    }}
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={product.images && product.images.length > 0 
                          ? `http://localhost:5000/${product.images[0]}` 
                          : '/placeholder-image.jpg'}
                        alt={product.title}
                        className="product-image"
                        sx={{ 
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                      />
                      <Chip
                        label={product.condition}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          bgcolor: '#575757',
                          color: 'white',
                          fontWeight: 500,
                          fontSize: '0.75rem',
                          fontFamily: '"Inter", sans-serif'
                        }}
                      />
                    </Box>
                    
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          mb: 2,
                          fontFamily: '"Inter", sans-serif',
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          color: '#000000',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.3
                        }}
                      >
                        {product.title}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 600,
                            color: '#000000',
                            fontFamily: '"Inter", sans-serif',
                            fontSize: '1.25rem'
                          }}
                        >
                          {formatPrice(product.price)}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Person sx={{ fontSize: 16, color: '#999999', mr: 0.5 }} />
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: '#666666',
                            opacity: 1,
                            fontFamily: '"Inter", sans-serif'
                          }}
                        >
                          {product.ownerName}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTime sx={{ fontSize: 16, color: '#999999', mr: 0.5 }} />
                        <Typography variant="caption" sx={{ color: '#666666' }}>
                          {new Date(product.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>

                      {product.category && (
                        <Chip
                          label={product.category}
                          size="small"
                          sx={{
                            mt: 1,
                            bgcolor: 'rgba(45, 80, 22, 0.1)',
                            color: '#000000',
                            fontSize: '0.7rem'
                          }}
                        />
                      )}

                      {/* Chat Button */}
                      <Box 
                        sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(45, 80, 22, 0.1)' }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <ChatButton 
                          product={product}
                          sellerId={product.owner || product.userId}
                          variant="button"
                          size="small"
                          fullWidth
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}

        {products.length === 0 && !loading && (
          <Paper 
            sx={{ 
              p: 6, 
              textAlign: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: 3,
              border: '1px solid #E0E0E0'
            }}
          >
            <Nature sx={{ fontSize: 80, color: '#CCCCCC', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1, color: '#333333' }}>
              No products yet
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: '#666666' }}>
              Be the first to list a product on our campus marketplace!
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/create-product')}
              sx={{
                bgcolor: '#000000',
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                '&:hover': {
                  bgcolor: '#333333'
                }
              }}
            >
              List Your First Product
            </Button>
          </Paper>
        )}
      </Container>

      {/* Call to Action - Only show when user is not authenticated */}
      {!isAuthenticated && (
        <Box 
          sx={{ 
            background: '#FFFFFF',
            borderTop: '1px solid #E0E0E0',
            py: 6,
            mt: 4
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    mb: 2,
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 600,
                    color: '#000000'
                  }}
                >
                  Ready to start trading?
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.8, color: '#666666' }}>
                  Join thousands of SMIT students buying and selling safely on campus.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Add />}
                  onClick={() => navigate('/register')}
                  sx={{
                    bgcolor: '#000000',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: '#333333',
                    }
                  }}
                >
                  Get Started Today
                </Button>
              </Grid>
            </Grid>
          </Container>
        </Box>
      )}
    </Box>
  );
};

export default HomePage;
