import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const MessagesPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, height: '600px' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Messages
        </Typography>
        <Typography variant="body1">
          Real-time chat interface coming soon...
        </Typography>
      </Paper>
    </Container>
  );
};

export default MessagesPage;