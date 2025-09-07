import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Card,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Paper
} from '@mui/material';
import {
  ArrowBack,
  CloudUpload,
  Category,
  Description,
  Title,
  Delete,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const categories = [
  'Books & Stationery',
  'Electronics',
  'Laptops & Computers',
  'Mobile Phones',
  'Furniture',
  'Sports & Fitness',
  'Fashion & Accessories',
  'Other'
];

const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

const CreateProductPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    tags: ''
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + images.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    // Validate file types and sizes
    const validFiles = [];
    const newPreviews = [];

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        if (file.size <= 5 * 1024 * 1024) { // 5MB limit
          validFiles.push(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            newPreviews.push(e.target.result);
            if (newPreviews.length === validFiles.length) {
              setImagePreviews(prev => [...prev, ...newPreviews]);
            }
          };
          reader.readAsDataURL(file);
        } else {
          setError(`File ${file.name} is too large. Maximum size is 5MB.`);
        }
      } else {
        setError(`File ${file.name} is not an image.`);
      }
    });

    if (validFiles.length > 0) {
      setImages(prev => [...prev, ...validFiles]);
      setError('');
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Client-side validation
    if (formData.title.length < 3) {
      setError('Title must be at least 3 characters long');
      setLoading(false);
      return;
    }

    if (formData.description.length < 10) {
      setError('Description must be at least 10 characters long');
      setLoading(false);
      return;
    }

    if (images.length === 0) {
      setError('At least one image is required');
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      // Append form fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      // Append images
      images.forEach(image => {
        formDataToSend.append('images', image);
      });

      const response = await axios.post('/products', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Product listed successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (err) {
      console.error('Error creating product:', err);
      
      // Handle validation errors
      if (err.response?.data?.errors) {
        const validationErrors = err.response.data.errors;
        const errorMessages = validationErrors.map(error => error.msg).join(', ');
        setError(`Validation Error: ${errorMessages}`);
      } else {
        setError(err.response?.data?.message || 'Failed to create product listing');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="md">
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

        <Card elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
            List Your Product
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Share your product with fellow SMIT students
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Product Title */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter a clear, descriptive title (minimum 3 characters)"
                  inputProps={{ maxLength: 100 }}
                  helperText={`${formData.title.length}/100 characters`}
                  error={formData.title.length > 0 && formData.title.length < 3}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Title />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Price and Category */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price (INR)"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder="0"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        INR
                      </InputAdornment>
                    ),
                    inputProps: { min: 0 }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    label="Category"
                    startAdornment={
                      <InputAdornment position="start">
                        <Category />
                      </InputAdornment>
                    }
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Condition and Tags */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Condition</InputLabel>
                  <Select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    label="Condition"
                  >
                    {conditions.map((condition) => (
                      <MenuItem key={condition} value={condition}>
                        {condition}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tags (comma separated)"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="e.g., smartphone, unlocked, warranty"
                  helperText="Optional: Add tags to help buyers find your item"
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  multiline
                  rows={4}
                  placeholder="Describe your product in detail (minimum 10 characters)"
                  inputProps={{ maxLength: 1000 }}
                  helperText={`${formData.description.length}/1000 characters (minimum 10 required)`}
                  error={formData.description.length > 0 && formData.description.length < 10}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                        <Description />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Image Upload */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                  Product Images (Required)
                </Typography>
                
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    border: '2px dashed',
                    borderColor: images.length >= 5 ? 'grey.300' : 'divider',
                    borderRadius: 2,
                    textAlign: 'center',
                    cursor: images.length >= 5 ? 'not-allowed' : 'pointer',
                    opacity: images.length >= 5 ? 0.6 : 1,
                    '&:hover': {
                      borderColor: images.length >= 5 ? 'grey.300' : 'primary.main',
                      bgcolor: images.length >= 5 ? 'transparent' : 'primary.light'
                    }
                  }}
                  onClick={() => {
                    if (images.length < 5) {
                      document.getElementById('image-upload').click();
                    }
                  }}
                >
                  <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Upload Product Images ({images.length}/5)
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {images.length >= 5 ? 'Maximum images reached' : 'Click to select images (max 5)'}
                  </Typography>
                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    disabled={images.length >= 5}
                  />
                </Paper>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Selected Images:
                    </Typography>
                    <Grid container spacing={2}>
                      {imagePreviews.map((preview, index) => (
                        <Grid item xs={6} sm={4} md={3} key={index}>
                          <Box sx={{ position: 'relative' }}>
                            <Box
                              component="img"
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              sx={{
                                width: '100%',
                                height: 120,
                                objectFit: 'cover',
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'divider'
                              }}
                            />
                            <Button
                              size="small"
                              color="error"
                              onClick={() => removeImage(index)}
                              sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                minWidth: 'auto',
                                p: 0.5,
                                bgcolor: 'rgba(255,255,255,0.9)',
                                '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                              }}
                            >
                              <Delete fontSize="small" />
                            </Button>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 4, py: 1.5, borderRadius: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'List Product'}
            </Button>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default CreateProductPage;
