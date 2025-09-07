import React, { useState, useEffect } from 'react';
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
  IconButton,
  Paper
} from '@mui/material';
import {
  Search,
  LocationOn,
  Favorite,
  FavoriteOutlined,
  Visibility,
  TrendingUp,
  Nature,
  LocalFlorist
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Electronics', 'Books', 'Clothing', 'Furniture', 'Sports', 'Others'];

  const featuredCategories = [
    { name: 'Electronics', icon: '📱', count: '120+', color: '#E8F5E8' },
    { name: 'Books', icon: '📚', count: '85+', color: '#F0F8F0' },
    { name: 'Furniture', icon: '🪑', count: '65+', color: '#E8F5E8' },
    { name: 'Fashion', icon: '👕', count: '95+', color: '#F0F8F0' },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // Implement search functionality
    navigate(`/search?q=${searchQuery}`);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price) => {
    return 'INR ' + new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0
    }).format(price);
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
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
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
                      opacity: 0.95
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
                      lineHeight: 1.6
                    }}
                  >
                    Discover amazing products from fellow SMIT students. 
                    Buy, sell, and connect within our trusted campus community.
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/create-product')}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        color: 'white',
                        px: 4,
                        py: 1.5,
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
                      sx={{
                        borderColor: 'rgba(255,255,255,0.5)',
                        color: 'white',
                        px: 4,
                        py: 1.5,
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
                    Find What You Need
                  </Typography>
                  
                  <TextField
                    fullWidth
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    sx={{ mb: 3 }}
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
                            sx={{ borderRadius: 2 }}
                          >
                            Search
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {['Electronics', 'Books', 'Fashion', 'Furniture'].map((category) => (
                      <Chip
                        key={category}
                        label={category}
                        onClick={() => setSelectedCategory(category)}
                        variant={selectedCategory === category ? 'filled' : 'outlined'}
                        color="primary"
                        size="small"
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
                    '&:hover': {
                      transform: 'scale(1.05)',
                      transition: 'transform 0.3s ease'
                    }
                  }}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  <CardContent sx={{ py: 4 }}>
                    <Typography variant="h2" sx={{ mb: 1 }}>
                      {category.icon}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 1,
                        fontFamily: '"Playfair Display", serif',
                        color: 'primary.main'
                      }}
                    >
                      {category.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.count} items
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Products Grid */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontFamily: '"Playfair Display", serif',
              color: 'primary.main'
            }}
          >
            Latest Products
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? 'filled' : 'outlined'}
                color="primary"
                size="small"
              />
            ))}
          </Box>
        </Box>

        <Grid container spacing={3}>
          {filteredProducts.slice(0, 12).map((product, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <Fade in timeout={500 + index * 100}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.images && product.images.length > 0 
                      ? `http://localhost:5000/${product.images[0]}` 
                      : '/placeholder-image.jpg'}
                    alt={product.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  
                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 1,
                        fontFamily: '"Playfair Display", serif',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        color: 'primary.main',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {product.title}
                    </Typography>
                    
                    <Typography 
                      variant="h6" 
                      color="primary.main" 
                      sx={{ 
                        mb: 1,
                        fontWeight: 600,
                        fontFamily: '"Inter", sans-serif'
                      }}
                    >
                      {formatPrice(product.price)}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Chip 
                        label={product.condition} 
                        size="small" 
                        color={product.condition === 'New' ? 'success' : 'default'}
                        variant="outlined"
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Visibility fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {product.views || 0}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {filteredProducts.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No products found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try adjusting your search criteria or browse different categories
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default HomePage;
