import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const CreateListingPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Listing
        </Typography>
        <Typography variant="body1">
          Listing creation wizard coming soon...
        </Typography>
      </Paper>
    </Container>
  );
};

export default CreateListingPage;