import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Avatar,
  Rating,
  ImageGallery,
} from '@mui/material';
import {
  LocationOn,
  AttachMoney,
  Schedule,
  Person,
  Star,
  CameraAlt,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const AvailableRentalsTab = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  // Mock data for available rentals
  const rentals = [
    {
      id: '1',
      title: 'Professional DSLR Camera Kit',
      description: 'Canon EOS R5 with RF 24-70mm f/2.8L lens. Excellent condition, perfect for professional photography.',
      category: 'photography',
      pricing: { rate: 150, period: 'week', currency: 'USD' },
      condition: { state: 'like-new', description: 'Barely used, in original box' },
      images: [
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      ],
      location: 'San Francisco, CA',
      userName: 'Professional Photo',
      userAvatar: null,
      rating: 4.8,
      reviewCount: 24,
      specs: { brand: 'Canon', model: 'EOS R5', year: 2021 },
      createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    },
    {
      id: '2',
      title: 'MacBook Pro 16" - High Performance',
      description: '2023 MacBook Pro with M2 Max chip, 32GB RAM, 1TB SSD. Perfect for video editing, 3D rendering, and development.',
      category: 'electronics',
      pricing: { rate: 75, period: 'day', currency: 'USD' },
      condition: { state: 'excellent', description: 'Like new, minimal usage' },
      images: [
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
      ],
      location: 'San Jose, CA',
      userName: 'Tech Rentals',
      userAvatar: null,
      rating: 4.9,
      reviewCount: 45,
      specs: { brand: 'Apple', model: 'MacBook Pro 16"', year: 2023 },
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    },
    {
      id: '3',
      title: 'Camping Tent for Family of 4',
      description: 'Spacious 8-person tent with rainfly, sleeping pads, and camping chairs. Great for family camping trips.',
      category: 'outdoor',
      pricing: { rate: 25, period: 'day', currency: 'USD' },
      condition: { state: 'good', description: 'Well maintained, some wear from use' },
      images: [
        'https://images.unsplash.com/photo-1523987355523-c7b5b0b90a74?w=400',
        'https://images.unsplash.com/photo-1532339142463-fd0a89791594?w=400',
      ],
      location: 'Berkeley, CA',
      userName: 'Outdoor Adventures',
      userAvatar: null,
      rating: 4.6,
      reviewCount: 18,
      specs: { brand: 'Coleman', model: 'Instant Tent 8' },
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    },
    {
      id: '4',
      title: 'Electric Guitar and Amp Package',
      description: 'Fender Stratocaster with Fender Mustang amp. Perfect for beginners and experienced players.',
      category: 'music',
      pricing: { rate: 40, period: 'day', currency: 'USD' },
      condition: { state: 'good', description: 'Regularly maintained and tuned' },
      images: [
        'https://images.unsplash.com/photo-1588086905395-a5e89d59b16d?w=400',
      ],
      location: 'Oakland, CA',
      userName: 'Music Gear Hub',
      userAvatar: null,
      rating: 4.7,
      reviewCount: 32,
      specs: { brand: 'Fender', model: 'Stratocaster' },
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    },
  ];

  const getCategoryColor = (category) => {
    const colors = {
      electronics: 'primary',
      furniture: 'secondary',
      vehicles: 'success',
      tools: 'warning',
      books: 'info',
      games: 'secondary',
      photography: 'primary',
      music: 'success',
      outdoor: 'warning',
      other: 'default',
    };
    return colors[category] || 'default';
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'new':
      case 'like-new':
        return 'success';
      case 'good':
        return 'primary';
      case 'fair':
        return 'warning';
      case 'poor':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleImageClick = (rentalId, imageIndex) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [rentalId]: imageIndex,
    }));
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {rentals.map((rental) => (
          <Grid item xs={12} sm={6} lg={4} xl={3} key={rental.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              {/* Image Gallery */}
              <Box sx={{ position: 'relative', height: 200 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={rental.images[0]}
                  alt={rental.title}
                  sx={{ objectFit: 'cover' }}
                />
                {rental.images.length > 1 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      borderRadius: '50%',
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                    }}
                  >
                    <CameraAlt sx={{ fontSize: 16 }} />
                  </Box>
                )}
              </Box>

              <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                {/* Title */}
                <Typography
                  variant="h6"
                  component={Link}
                  to={`/rental/${rental.id}`}
                  sx={{
                    mb: 1,
                    textDecoration: 'none',
                    color: 'text.primary',
                    '&:hover': {
                      color: 'primary.main',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {rental.title}
                </Typography>

                {/* User info and rating */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={rental.userAvatar}
                    alt={rental.userName}
                    sx={{ width: 32, height: 32, mr: 2 }}
                  >
                    <Person />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {rental.userName}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating
                        value={rental.rating}
                        precision={0.1}
                        size="small"
                        readOnly
                      />
                      <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                        ({rental.reviewCount})
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Description */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {rental.description}
                </Typography>

                {/* Chips */}
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={rental.category}
                    size="small"
                    color={getCategoryColor(rental.category)}
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip
                    label={rental.condition.state}
                    size="small"
                    color={getConditionColor(rental.condition.state)}
                    sx={{ mr: 1, mb: 1 }}
                  />
                </Box>

                {/* Pricing */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AttachMoney sx={{ fontSize: 16, mr: 0.5, color: 'success.main' }} />
                  <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold' }}>
                    ${rental.pricing.rate}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                    /{rental.pricing.period}
                  </Typography>
                </Box>

                {/* Location */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {rental.location}
                  </Typography>
                </Box>

                {/* Specifications */}
                {rental.specs.brand && (
                  <Typography variant="caption" color="text.secondary">
                    {rental.specs.brand} {rental.specs.model}
                    {rental.specs.year && ` (${rental.specs.year})`}
                  </Typography>
                )}
              </CardContent>

              {/* Action buttons */}
              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  component={Link}
                  to={`/rental/${rental.id}`}
                  sx={{ flexGrow: 1, mr: 1 }}
                >
                  View Details
                </Button>
                <Button variant="contained" size="small" sx={{ flexGrow: 1 }}>
                  Rent Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AvailableRentalsTab;