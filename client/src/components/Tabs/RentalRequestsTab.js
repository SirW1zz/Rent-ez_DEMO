import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Button,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  LocationOn,
  AttachMoney,
  Schedule,
  Person,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const RentalRequestsTab = () => {
  // Mock data for rental requests
  const requests = [
    {
      id: '1',
      title: 'Need Gaming Laptop for 2 Weeks',
      description: 'Looking for a high-performance gaming laptop for an upcoming gaming tournament. Must have at least 16GB RAM and dedicated graphics card.',
      budget: { min: 100, max: 200, currency: 'USD' },
      category: 'electronics',
      location: 'San Francisco, CA',
      urgency: 'immediate',
      duration: '2 weeks',
      userName: 'John Doe',
      userAvatar: null,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: '2',
      title: 'Photography Equipment Weekend Rental',
      description: 'Need DSLR camera with lenses for wedding photography. Professional equipment preferred.',
      budget: { min: 150, max: 300, currency: 'USD' },
      category: 'photography',
      location: 'Los Angeles, CA',
      urgency: 'week',
      duration: '3 days',
      userName: 'Jane Smith',
      userAvatar: null,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    },
    {
      id: '3',
      title: 'Camping Gear for Month Long Trip',
      description: 'Complete camping setup needed including tent, sleeping bags, cooking equipment for family camping trip.',
      budget: { min: 200, max: 400, currency: 'USD' },
      category: 'outdoor',
      location: 'Denver, CO',
      urgency: 'month',
      duration: '30 days',
      userName: 'Mike Johnson',
      userAvatar: null,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
  ];

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'immediate':
        return 'error';
      case 'week':
        return 'warning';
      case 'month':
        return 'info';
      default:
        return 'default';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      electronics: 'primary',
      furniture: 'secondary',
      vehicles: 'success',
      tools: 'warning',
      books: 'info',
      games: 'secondary',
      photography: 'primary',
      outdoor: 'success',
      other: 'default',
    };
    return colors[category] || 'default';
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
      }
    }
    return 'Just now';
  };

  if (requests.length === 0) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          No rental requests found. Be the first to create one!
        </Alert>
        <Button variant="contained" component={Link} to="/create-listing">
          Create Rental Request
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {requests.map((request) => (
          <Grid item xs={12} sm={6} lg={4} key={request.id}>
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
              <CardContent sx={{ flexGrow: 1 }}>
                {/* Header with user info */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={request.userAvatar}
                    alt={request.userName}
                    sx={{ width: 40, height: 40, mr: 2 }}
                  >
                    <Person />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {request.userName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatTimeAgo(request.createdAt)}
                    </Typography>
                  </Box>
                </Box>

                {/* Title and description */}
                <Typography
                  variant="h6"
                  component={Link}
                  to={`/request/${request.id}`}
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
                  {request.title}
                </Typography>

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
                  {request.description}
                </Typography>

                {/* Chips and metadata */}
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={request.category}
                    size="small"
                    color={getCategoryColor(request.category)}
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip
                    icon={<Schedule />}
                    label={request.urgency}
                    size="small"
                    color={getUrgencyColor(request.urgency)}
                    sx={{ mr: 1, mb: 1 }}
                  />
                </Box>

                {/* Budget */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AttachMoney sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {request.budget.min === request.budget.max
                      ? `$${request.budget.min}/${request.budget.currency}`
                      : `$${request.budget.min}-${request.budget.max}/${request.budget.currency}`}
                  </Typography>
                </Box>

                {/* Location */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {request.location}
                  </Typography>
                </Box>

                {/* Duration */}
                <Typography variant="caption" color="text.secondary">
                  Duration: {request.duration}
                </Typography>
              </CardContent>

              {/* Action buttons */}
              <Box sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="outlined"
                  size="small"
                  component={Link}
                  to={`/request/${request.id}`}
                  sx={{ mr: 1 }}
                >
                  View Details
                </Button>
                <Button variant="contained" size="small">
                  Contact
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RentalRequestsTab;