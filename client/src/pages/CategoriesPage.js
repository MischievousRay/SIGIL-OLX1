import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Book,
  Computer,
  Phone,
  Chair,
  FitnessCenter,
  Checkroom,
  Category,
  ShoppingBag
} from '@mui/icons-material';
import axios from 'axios';

const categories = [
  { name: 'Books & Stationery', icon: <Book />, color: '#000000' },
  { name: 'Electronics', icon: <Computer />, color: '#000000' },
  { name: 'Laptops & Computers', icon: <Computer />, color: '#000000' },
  { name: 'Mobile Phones', icon: <Phone />, color: '#000000' },
  { name: 'Furniture', icon: <Chair />, color: '#000000' },
  { name: 'Sports & Fitness', icon: <FitnessCenter />, color: '#000000' },
  { name: 'Fashion & Accessories', icon: <Checkroom />, color: '#000000' },
  { name: 'Other', icon: <Category />, color: '#000000' }
];

const CategoriesPage = () => {
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategoryStats();
  }, []);

  const fetchCategoryStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/products/categories/stats');
      setCategoryStats(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching category stats:', error);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/browse?category=${encodeURIComponent(categoryName)}`);
  };

  const getCategoryCount = (categoryName) => {
    const stat = categoryStats.find(s => s._id === categoryName);
    return stat ? stat.count : 0;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress sx={{ color: '#000000' }} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#FAFAFA', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontFamily: '"Inter", sans-serif',
              fontWeight: 700,
              color: '#000000',
              mb: 2
            }}
          >
            Browse Categories
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: '"Inter", sans-serif',
              color: '#666666',
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Discover products across different categories in our campus marketplace
          </Typography>
        </Box>

        {/* Categories Grid */}
        <Grid container spacing={3}>
          {categories.map((category, index) => {
            const productCount = getCategoryCount(category.name);
            
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card
                  sx={{
                    borderRadius: 3,
                    border: '1px solid #E0E0E0',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                      borderColor: '#000000'
                    }
                  }}
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        bgcolor: 'rgba(0, 0, 0, 0.1)',
                        mb: 3,
                        color: category.color
                      }}
                    >
                      {React.cloneElement(category.icon, { sx: { fontSize: 40 } })}
                    </Box>
                    
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 600,
                        color: '#000000',
                        mb: 2
                      }}
                    >
                      {category.name}
                    </Typography>
                    
                    <Chip
                      label={`${productCount} items`}
                      size="small"
                      sx={{
                        bgcolor: '#000000',
                        color: 'white',
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 500
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Empty State */}
        {categoryStats.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <ShoppingBag sx={{ fontSize: 80, color: '#666666', mb: 2 }} />
            <Typography variant="h5" sx={{ color: '#000000', mb: 1 }}>
              No Categories Available
            </Typography>
            <Typography variant="body1" sx={{ color: '#666666' }}>
              Categories will appear here once products are added to the marketplace.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default CategoriesPage;
