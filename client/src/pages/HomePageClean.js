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
  CircularProgress
} from '@mui/material';
import {
  Search,
  TrendingUp,
  Nature,
  LocalFlorist,
  AttachMoney,
  Person,
  AccessTime,
  ShoppingBag,
  Add,
  Category
} from '@mui/icons-material';
import axios from 'axios';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Books & Stationery', 'Electronics', 'Laptops & Computers', 'Mobile Phones', 'Furniture', 'Sports & Fitness', 'Fashion & Accessories', 'Other'];

  const featuredCategories = [
    { name: 'Electronics', icon: '📱', color: 'rgba(45, 80, 22, 0.05)', count: 25 },
    { name: 'Books', icon: '📚', color: 'rgba(74, 124, 89, 0.05)', count: 42 },
    { name: 'Fashion', icon: '👕', color: 'rgba(143, 188, 143, 0.05)', count: 18 },
    { name: 'Furniture', icon: '🪑', color: 'rgba(181, 214, 181, 0.05)', count: 12 }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products?limit=12');
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
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

  const handleCategoryClick = (category) => {
    if (category === 'All') {
      navigate('/browse');
    } else {
      navigate(`/browse?category=${encodeURIComponent(category)}`);
    }
  };

  const formatPrice = (price) => {
    return 'INR ' + new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0
    }).format(price);
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'New': return '#2D5016';
      case 'Like New': return '#4A7C59';
      case 'Good': return '#8FBC8F';
      case 'Fair': return '#FFA726';
      case 'Poor': return '#FF7043';
      default: return '#757575';
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section with Elegant Green Theme */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #2D5016 0%, #4A7C59 50%, #8FBC8F 100%)',
          color: 'white',
          py: 8,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative Elements */}
        <Box 
          sx={{ 
            position: 'absolute',
            top: 20,
            right: 20,
            opacity: 0.1,
            fontSize: '8rem'
          }}
        >
          <LocalFlorist />
        </Box>
        <Box 
          sx={{ 
            position: 'absolute',
            bottom: 20,
            left: 20,
            opacity: 0.1,
            fontSize: '6rem'
          }}
        >
          <Nature />
        </Box>
        
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box>
                  <Typography 
                    variant="h1" 
                    sx={{ 
                      mb: 2,
                      fontFamily: '"Playfair Display", serif',
                      fontWeight: 700,
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      fontSize: { xs: '2.5rem', md: '3.5rem' }
                    }}
                  >
                    Campus Marketplace
                  </Typography>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      mb: 3,
                      fontFamily: '"Playfair Display", serif',
                      fontStyle: 'italic',
                      opacity: 0.95,
                      fontSize: { xs: '1.5rem', md: '2rem' }
                    }}
                  >
                    Where Students Connect & Trade
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 4, 
                      opacity: 0.9,
                      fontFamily: '"Inter", sans-serif',
                      lineHeight: 1.6,
                      fontSize: { xs: '1rem', md: '1.25rem' }
                    }}
                  >
                    Discover amazing products from fellow SMIT students. 
                    Buy, sell, and connect within our trusted campus community.
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<Add />}
                      onClick={() => navigate('/create-product')}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        color: 'white',
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.3)',
                        }
                      }}
                    >
                      Start Selling
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<ShoppingBag />}
                      onClick={() => navigate('/browse')}
                      sx={{
                        borderColor: 'rgba(255,255,255,0.5)',
                        color: 'white',
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          borderColor: 'white',
                          bgcolor: 'rgba(255,255,255,0.1)',
                        }
                      }}
                    >
                      Browse Products
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Fade in timeout={1500}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    bgcolor: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                >
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 3, 
                      color: 'primary.main',
                      fontFamily: '"Playfair Display", serif',
                      textAlign: 'center'
                    }}
                  >
                    🔍 Find What You Need
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
                          borderColor: '#4A7C59',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#2D5016',
                        }
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button 
                            variant="contained" 
                            onClick={handleSearch}
                            sx={{ 
                              borderRadius: 2,
                              background: 'linear-gradient(45deg, #2D5016 30%, #4A7C59 90%)',
                              textTransform: 'none'
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
                        color="primary"
                        size="small"
                        sx={{
                          '&:hover': {
                            bgcolor: 'rgba(45, 80, 22, 0.1)',
                            cursor: 'pointer'
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
            fontFamily: '"Playfair Display", serif',
            color: 'primary.main'
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
                    bgcolor: category.color,
                    borderRadius: 3,
                    border: '1px solid rgba(45, 80, 22, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(45, 80, 22, 0.15)'
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
                        fontFamily: '"Playfair Display", serif',
                        color: 'primary.main',
                        fontWeight: 600
                      }}
                    >
                      {category.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
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
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontFamily: '"Playfair Display", serif',
              color: 'primary.main'
            }}
          >
            ✨ Latest Products
          </Typography>
          
          <Button
            variant="outlined"
            startIcon={<TrendingUp />}
            onClick={() => navigate('/browse')}
            sx={{
              borderColor: '#2D5016',
              color: '#2D5016',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                bgcolor: 'rgba(45, 80, 22, 0.1)',
              }
            }}
          >
            View All
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#2D5016' }} />
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
                      borderRadius: 3,
                      border: '1px solid rgba(45, 80, 22, 0.1)',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 40px rgba(45, 80, 22, 0.15)',
                        '& .product-image': {
                          transform: 'scale(1.05)',
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
                          bgcolor: getConditionColor(product.condition),
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}
                      />
                    </Box>
                    
                    <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          mb: 1,
                          fontFamily: '"Playfair Display", serif',
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          color: 'primary.main',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {product.title}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 700,
                            color: 'primary.main',
                            fontFamily: '"Inter", sans-serif'
                          }}
                        >
                          {formatPrice(product.price)}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Person sx={{ fontSize: 16, color: '#8FBC8F', mr: 0.5 }} />
                        <Typography variant="caption" color="text.secondary">
                          {product.ownerName}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTime sx={{ fontSize: 16, color: '#8FBC8F', mr: 0.5 }} />
                        <Typography variant="caption" color="text.secondary">
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
                            color: '#2D5016',
                            fontSize: '0.7rem'
                          }}
                        />
                      )}
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
              backgroundColor: 'rgba(255,255,255,0.7)',
              borderRadius: 3
            }}
          >
            <Nature sx={{ fontSize: 80, color: '#8FBC8F', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No products yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Be the first to list a product on our campus marketplace!
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/create-product')}
              sx={{
                background: 'linear-gradient(45deg, #2D5016 30%, #4A7C59 90%)',
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                px: 4
              }}
            >
              List Your First Product
            </Button>
          </Paper>
        )}
      </Container>

      {/* Call to Action */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #8FBC8F 0%, #4A7C59 100%)',
          color: 'white',
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
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 600
                }}
              >
                Ready to start trading?
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
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
                  bgcolor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.3)',
                  }
                }}
              >
                Get Started Today
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
