import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Card,
  Chip,
  Avatar,
  Divider,
  IconButton,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper
} from '@mui/material';
import {
  ArrowBack,
  Phone,
  Email,
  Edit,
  Delete,
  Category,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import ChatButton from '../components/Chat/ChatButton';
import axios from 'axios';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/products/${id}`);
      setProduct(response.data);
    } catch (err) {
      setError('Product not found');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        navigate('/dashboard');
      } else {
        setError('Error deleting product');
      }
    } catch (error) {
      setError('Error deleting product');
    }
    setDeleteDialogOpen(false);
  };

  const formatPrice = (price) => {
    return 'INR ' + new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Product not found'}</Alert>
        <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Back to Home
        </Button>
      </Container>
    );
  }

  const isOwner = user && product.owner && product.owner._id === user.id;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{ mb: 2, color: 'text.primary' }}
          >
            Back
          </Button>
        </Box>

        <Grid container spacing={4}>
          {/* Image Gallery */}
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
              {product.images && product.images.length > 0 ? (
                <Box>
                  <Box
                    component="img"
                    src={`http://localhost:5000/${product.images[currentImageIndex]}`}
                    alt={product.title}
                    sx={{
                      width: '100%',
                      height: 400,
                      objectFit: 'cover',
                      borderRadius: 1
                    }}
                  />
                  {product.images.length > 1 && (
                    <Box sx={{ p: 2, display: 'flex', gap: 1, overflowX: 'auto' }}>
                      {product.images.map((image, index) => (
                        <Box
                          key={index}
                          component="img"
                          src={`http://localhost:5000/${image}`}
                          alt={`${product.title} ${index + 1}`}
                          onClick={() => setCurrentImageIndex(index)}
                          sx={{
                            width: 80,
                            height: 80,
                            objectFit: 'cover',
                            borderRadius: 1,
                            cursor: 'pointer',
                            border: currentImageIndex === index ? 2 : 1,
                            borderColor: currentImageIndex === index ? 'primary.main' : 'divider',
                            opacity: currentImageIndex === index ? 1 : 0.7,
                            transition: 'all 0.2s'
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              ) : (
                <Box
                  sx={{
                    height: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'grey.100',
                    color: 'grey.500',
                    borderRadius: 1
                  }}
                >
                  No image available
                </Box>
              )}
            </Card>
          </Grid>

          {/* Product Information */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              {/* Price and Actions */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {formatPrice(product.price)}
                </Typography>
                {isOwner && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/edit-product/${product._id}`)}
                      sx={{ bgcolor: 'primary.light', '&:hover': { bgcolor: 'primary.main' } }}
                    >
                      <Edit sx={{ color: 'white' }} />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => setDeleteDialogOpen(true)}
                      sx={{ bgcolor: 'error.light', '&:hover': { bgcolor: 'error.main' } }}
                    >
                      <Delete sx={{ color: 'white' }} />
                    </IconButton>
                  </Box>
                )}
              </Box>

              <Typography variant="h5" sx={{ fontWeight: 500, mb: 2 }}>
                {product.title}
              </Typography>

              {/* Status and Category */}
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <Chip
                  label={product.condition}
                  color={product.condition === 'New' ? 'success' : 'default'}
                  size="small"
                />
                <Chip
                  icon={<Category />}
                  label={product.category}
                  variant="outlined"
                  size="small"
                />
                {product.isAvailable ? (
                  <Chip label="Available" color="success" size="small" />
                ) : (
                  <Chip label="Sold" color="error" size="small" />
                )}
              </Box>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
                {product.description}
              </Typography>

              {/* Product Details */}
              <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50', border: '1px solid', borderColor: 'divider', mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                  Product Details
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Condition:</Typography>
                    <Typography fontWeight={500}>{product.condition}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Category:</Typography>
                    <Typography fontWeight={500}>{product.category}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Views:</Typography>
                    <Typography fontWeight={500}>{product.views || 0}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Posted:</Typography>
                    <Typography fontWeight={500}>
                      {formatDate(product.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>

            {/* Seller Information */}
            <Card elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                Seller Information
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ width: 48, height: 48, mr: 2, bgcolor: 'primary.main' }}>
                  {product.ownerName.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="body1" fontWeight={500}>
                    {product.ownerName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    SMIT Student
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Email sx={{ mr: 2, color: 'text.secondary' }} />
                  <Typography variant="body2">{product.ownerEmail}</Typography>
                </Box>
                {product.ownerPhone && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Phone sx={{ mr: 2, color: 'text.secondary' }} />
                    <Typography variant="body2">{product.ownerPhone}</Typography>
                  </Box>
                )}
              </Box>

              {!isOwner && product.isAvailable && (
                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{ py: 1.5 }}
                    href={`tel:${product.ownerPhone}`}
                  >
                    Call Seller
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    size="large"
                    sx={{ py: 1.5 }}
                    href={`mailto:${product.ownerEmail}?subject=Interested in ${product.title}`}
                  >
                    Email Seller
                  </Button>
                  <ChatButton 
                    product={product}
                    sellerId={product.owner || product.userId}
                    variant="button"
                    size="large"
                    fullWidth
                  />
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this product? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ProductDetailsPage;
