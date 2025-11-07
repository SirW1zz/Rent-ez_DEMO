import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Container,
  Typography,
  Fab,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RentalRequestsTab from '../Tabs/RentalRequestsTab';
import AvailableRentalsTab from '../Tabs/AvailableRentalsTab';
import FilterBar from '../Filters/FilterBar';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`listing-tabpanel-${index}`}
      aria-labelledby={`listing-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleCreateListing = () => {
    if (isAuthenticated) {
      navigate('/create-listing');
    } else {
      navigate('/register');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 700, mb: 2 }}
        >
          Find Your Perfect Rental
        </Typography>

        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="rental marketplace tabs"
          variant={isMobile ? 'fullWidth' : 'standard'}
          sx={{
            '& .MuiTab-root': {
              fontSize: '1.1rem',
              fontWeight: 600,
            },
          }}
        >
          <Tab label="Rental Requests" />
          <Tab label="Available Rentals" />
        </Tabs>
      </Box>

      {/* Filter Bar */}
      <FilterBar />

      {/* Tab Content */}
      <TabPanel value={currentTab} index={0}>
        <RentalRequestsTab />
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <AvailableRentalsTab />
      </TabPanel>

      {/* Floating Action Button for creating listings */}
      <Fab
        color="primary"
        aria-label="create listing"
        onClick={handleCreateListing}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: { xs: 'flex', sm: 'none' },
        }}
      >
        <Add />
      </Fab>
    </Container>
  );
};

export default MainLayout;