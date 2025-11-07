import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const ProfilePage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Profile Page
        </Typography>
        <Typography variant="body1">
          Profile management features coming soon...
        </Typography>
      </Paper>
    </Container>
  );
};

export default ProfilePage;