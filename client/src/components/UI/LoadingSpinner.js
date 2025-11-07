import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  minHeight: '200px',
}));

const LoadingSpinner = ({ size = 40, message = 'Loading...', color = 'primary' }) => {
  return (
    <LoadingContainer>
      <CircularProgress size={size} color={color} />
      {message && (
        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
          {message}
        </Typography>
      )}
    </LoadingContainer>
  );
};

export default LoadingSpinner;