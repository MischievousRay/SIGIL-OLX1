import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Chip,
  InputAdornment,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Search,
  FilterList,
  LocalFlorist,
  Nature,
  AttachMoney,
  LocationOn,
  AccessTime,
  Person,
  ShoppingBag
} from '@mui/icons-material';
import axios from 'axios';
import ChatButton from '../components/Chat/ChatButton';

const categories = [
  'All Categories',
  'Books & Stationery',
  'Electronics',
  'Laptops & Computers',
  'Mobile Phones',
  'Furniture',
  'Sports & Fitness',
  'Fashion & Accessories',
  'Other'
];

const conditions = ['All Conditions', 'New', 'Like New', 'Good', 'Fair', 'Poor'];

const BrowseProductsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    category: 'All Categories',
    condition: 'All Conditions',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Initialize filters from URL parameters
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlCategory = searchParams.get('category') || 'All Categories';
    const urlCondition = searchParams.get('condition') || 'All Conditions';
    
    setFilters(prev => ({
      ...prev,
      search: urlSearch,
      category: urlCategory,
      condition: urlCondition
    }));
  }, [searchParams]);

  const fetchProducts = async () => {
    console.log('fetchProducts called');
    setLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.category !== 'All Categories') params.append('category', filters.category);
      if (filters.condition !== 'All Conditions') params.append('condition', filters.condition);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      params.append('sortBy', filters.sortBy);
      params.append('sortOrder', filters.sortOrder);

      const url = `/products?${params.toString()}`;
      console.log('Making request to:', url);
      console.log('Full URL:', `${axios.defaults.baseURL}${url}`);
      
      const response = await axios.get(url);
      console.log('Response received:', response.data);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response);
      console.error('Error config:', error.config);
      console.error('Request URL:', error.config?.url);
      console.error('Response status:', error.response?.status);
      console.error('Response data:', error.response?.data);
      console.error('Axios defaults:', {
        baseURL: axios.defaults.baseURL,
        headers: axios.defaults.headers
      });
      
      if (error.response) {
        setError(`Server Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
      } else if (error.request) {
        setError('Network Error: Unable to connect to server. Please check if the server is running.');
      } else {
        setError(`Request Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('BrowseProductsPage useEffect triggered, filters:', filters);
    fetchProducts();
  }, [filters]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
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
    <Box sx={{ 
      background: '#FAFAFA',
      minHeight: '100vh',
      pt: 3
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <LocalFlorist sx={{ fontSize: 40, color: '#000000', mr: 2 }} />
            <Typography 
              variant="h3" 
              sx={{ 
                fontFamily: '"Inter", sans-serif',
                fontWeight: 700,
                color: '#000000'
              }}
            >
              Browse Products
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ mb: 1, color: '#666666' }}>
            Discover amazing deals from your fellow SMIT students
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, opacity: 0.8 }}>
            <ShoppingBag sx={{ fontSize: 20, color: '#999999' }} />
            <Typography variant="body2" sx={{ color: '#999999' }}>
              {products.length} products available
            </Typography>
          </Box>
        </Box>

        {/* Filters */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 4, 
            backgroundColor: '#FFFFFF',
            borderRadius: 3,
            border: '1px solid #E0E0E0',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <FilterList sx={{ mr: 1, color: '#000000' }} />
            <Typography variant="h6" sx={{ color: '#000000', fontWeight: 600 }}>
              Filter & Search
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#666666' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
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
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel sx={{ '&.Mui-focused': { color: '#000000' } }}>Category</InputLabel>
                <Select
                  value={filters.category}
                  label="Category"
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  sx={{
                    borderRadius: 2,
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#000000',
                    }
                  }}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel sx={{ '&.Mui-focused': { color: '#000000' } }}>Condition</InputLabel>
                <Select
                  value={filters.condition}
                  label="Condition"
                  onChange={(e) => handleFilterChange('condition', e.target.value)}
                  sx={{
                    borderRadius: 2,
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#000000',
                    }
                  }}
                >
                  {conditions.map((condition) => (
                    <MenuItem key={condition} value={condition}>
                      {condition}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6} md={2}>
              <TextField
                fullWidth
                label="Min Price"
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">INR</InputAdornment>,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#000000',
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#000000',
                  }
                }}
              />
            </Grid>

            <Grid item xs={6} md={2}>
              <TextField
                fullWidth
                label="Max Price"
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">INR</InputAdornment>,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#000000',
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#000000',
                  }
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Loading */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress sx={{ color: '#000000' }} />
          </Box>
        )}

        {/* Products Grid */}
        {!loading && (
          <Grid container spacing={3}>
            {products.length === 0 ? (
              <Grid item xs={12}>
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
                    No products found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your search filters or check back later for new listings.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/create-product')}
                    sx={{
                      mt: 3,
                      backgroundColor: '#000000',
                      color: 'white',
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: '#666666',
                      }
                    }}
                  >
                    List Your First Product
                  </Button>
                </Paper>
              </Grid>
            ) : (
              products.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 3,
                      border: '1px solid rgba(45, 80, 22, 0.1)',
                      boxShadow: '0 8px 32px rgba(45, 80, 22, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 40px rgba(45, 80, 22, 0.2)',
                        '& .product-image': {
                          transform: 'scale(1.05)',
                        }
                      }
                    }}
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: '12px 12px 0 0' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={product.images?.[0] ? `http://localhost:5000/${product.images[0]}` : '/placeholder-image.jpg'}
                        alt={product.title}
                        className="product-image"
                        sx={{
                          transition: 'transform 0.3s ease',
                          objectFit: 'cover'
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
                          fontWeight: 600,
                          mb: 1,
                          color: '#000000',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {product.title}
                      </Typography>
                      
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {product.description}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 700,
                            color: '#000000'
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
                            bgcolor: 'rgba(0, 0, 0, 0.1)',
                            color: '#000000',
                            fontSize: '0.7rem'
                          }}
                        />
                      )}

                      {/* Chat Button */}
                      <Box 
                        sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}
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
                </Grid>
              ))
            )}
          </Grid>
        )}

        {/* Decorative Elements */}
        <Box sx={{ position: 'fixed', bottom: 20, right: 20, opacity: 0.1, zIndex: 0 }}>
          <ShoppingBag sx={{ fontSize: 100, color: '#666666', transform: 'rotate(15deg)' }} />
        </Box>
      </Container>
    </Box>
  );
};

export default BrowseProductsPage;
