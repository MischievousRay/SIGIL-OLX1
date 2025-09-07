import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Menu,
  MenuItem,
  Pagination
} from '@mui/material';
import {
  Edit,
  Delete,
  MoreVert,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, productId: null });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyProducts();
  }, [tabValue, page]);

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const status = tabValue === 0 ? 'all' : tabValue === 1 ? 'available' : 'sold';
      
      const response = await axios.get('/products/my/listings', {
        params: { page, limit: 12, status }
      });
      
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
      setError('');
    } catch (err) {
      setError('Failed to fetch your listings');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(1);
  };

  const handleMenuOpen = (event, product) => {
    setAnchorEl(event.currentTarget);
    setSelectedProduct(product);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProduct(null);
  };

  const handleDeleteClick = (productId) => {
    setDeleteDialog({ open: true, productId });
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/products/${deleteDialog.productId}`);
      setDeleteDialog({ open: false, productId: null });
      fetchMyProducts();
    } catch (err) {
      setError('Failed to delete product');
      console.error('Error deleting product:', err);
    }
  };

  const handleToggleAvailability = async (productId, currentStatus) => {
    try {
      await axios.put(`/products/${productId}`, {
        isAvailable: !currentStatus
      });
      fetchMyProducts();
      handleMenuClose();
    } catch (err) {
      setError('Failed to update product status');
      console.error('Error updating product:', err);
    }
  };

  const formatPrice = (price) => {
    return 'INR ' + new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0
    }).format(price);
  };

  const getFilteredProducts = () => {
    if (tabValue === 1) return products.filter(p => p.isAvailable);
    if (tabValue === 2) return products.filter(p => !p.isAvailable);
    return products;
  };

  const filteredProducts = getFilteredProducts();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Dashboard
      </Typography>

      {user && (
        <Box sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Welcome back, {user.name}!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Student ID: {user.studentId} | Email: {user.email}
          </Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label={`All Listings (${products.length})`} />
          <Tab label={`Available (${products.filter(p => p.isAvailable).length})`} />
          <Tab label={`Sold (${products.filter(p => !p.isAvailable).length})`} />
        </Tabs>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          {tabValue === 0 ? 'All Your Listings' : 
           tabValue === 1 ? 'Available Items' : 'Sold Items'}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/create-product')}
        >
          Create New Listing
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={`http://localhost:5000/${product.images[0]}`}
                      alt={product.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="h2"
                        sx={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {product.title}
                      </Typography>
                      <Typography
                        variant="h6"
                        color="primary"
                        sx={{ fontWeight: 'bold', mb: 1 }}
                      >
                        {formatPrice(product.price)}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={product.condition}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                        {product.isAvailable ? (
                          <Chip label="Available" size="small" color="success" />
                        ) : (
                          <Chip label="Sold" size="small" color="error" />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {product.views} views
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                      <Button
                        size="small"
                        onClick={() => navigate(`/product/${product._id}`)}
                      >
                        View Details
                      </Button>
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, product)}
                        size="small"
                      >
                        <MoreVert />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box textAlign="center" py={8}>
                  <Typography variant="h6" color="text.secondary">
                    No listings found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {tabValue === 0 ? 'Create your first listing!' : 
                     tabValue === 1 ? 'No available items' : 'No sold items'}
                  </Typography>
                  {tabValue === 0 && (
                    <Button
                      variant="contained"
                      onClick={() => navigate('/create-product')}
                      sx={{ mt: 2 }}
                    >
                      Create Listing
                    </Button>
                  )}
                </Box>
              </Grid>
            )}
          </Grid>

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(event, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => navigate(`/product/${selectedProduct?._id}`)}>
          <Edit sx={{ mr: 1 }} />
          View/Edit
        </MenuItem>
        <MenuItem 
          onClick={() => handleToggleAvailability(
            selectedProduct?._id, 
            selectedProduct?.isAvailable
          )}
        >
          {selectedProduct?.isAvailable ? (
            <><VisibilityOff sx={{ mr: 1 }} />Mark as Sold</>
          ) : (
            <><Visibility sx={{ mr: 1 }} />Mark as Available</>
          )}
        </MenuItem>
        <MenuItem 
          onClick={() => handleDeleteClick(selectedProduct?._id)}
          sx={{ color: 'error.main' }}
        >
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, productId: null })}
      >
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this product? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, productId: null })}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DashboardPage;
