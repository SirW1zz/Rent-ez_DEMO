import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

const ListingDetailPage = () => {
  const { type, id } = useParams();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {type === 'request' ? 'Rental Request' : 'Available Rental'} Details
        </Typography>
        <Typography variant="body1">
          Listing detail view coming soon... (ID: {id}, Type: {type})
        </Typography>
      </Paper>
    </Container>
  );
};

export default ListingDetailPage;