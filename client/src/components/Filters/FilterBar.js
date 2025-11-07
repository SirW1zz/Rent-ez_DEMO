import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Chip,
  Button,
  Collapse,
  IconButton,
  Typography,
} from '@mui/material';
import {
  Search,
  FilterList,
  ExpandMore,
  ExpandLess,
  LocationOn,
  AttachMoney,
  Category,
} from '@mui/icons-material';

const FilterBar = () => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    priceRange: [0, 1000],
    location: '',
    radius: 10,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'vehicles', label: 'Vehicles' },
    { value: 'tools', label: 'Tools' },
    { value: 'books', label: 'Books' },
    { value: 'games', label: 'Games' },
    { value: 'photography', label: 'Photography' },
    { value: 'music', label: 'Music' },
    { value: 'outdoor', label: 'Outdoor' },
    { value: 'other', label: 'Other' },
  ];

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePriceRangeChange = (event, newValue) => {
    setFilters(prev => ({
      ...prev,
      priceRange: newValue,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      priceRange: [0, 1000],
      location: '',
      radius: 10,
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) count++;
    if (filters.location) count++;
    if (filters.radius !== 10) count++;
    return count;
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <FilterList sx={{ mr: 1 }} />
        <Typography variant="h6" component="h2">
          Filters
        </Typography>
        {getActiveFiltersCount() > 0 && (
          <Chip
            label={`${getActiveFiltersCount()} active`}
            size="small"
            color="primary"
            sx={{ ml: 2 }}
          />
        )}
      </Box>

      {/* Basic Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        {/* Search */}
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ minWidth: 200 }}
        />

        {/* Category */}
        <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            label="Category"
            startAdornment={<Category sx={{ mr: 1, color: 'text.secondary' }} />}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.value} value={cat.value}>
                {cat.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Location */}
        <TextField
          label="Location"
          variant="outlined"
          size="small"
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          InputProps={{
            startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ minWidth: 150 }}
        />

        {/* Actions */}
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setShowAdvanced(!showAdvanced)}
            endIcon={showAdvanced ? <ExpandLess /> : <ExpandMore />}
          >
            Advanced
          </Button>
          {getActiveFiltersCount() > 0 && (
            <Button variant="text" size="small" onClick={clearFilters}>
              Clear All
            </Button>
          )}
        </Box>
      </Box>

      {/* Advanced Filters */}
      <Collapse in={showAdvanced}>
        <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" gutterBottom>
            Price Range (${filters.priceRange[0]} - ${filters.priceRange[1]})
          </Typography>
          <Slider
            value={filters.priceRange}
            onChange={handlePriceRangeChange}
            valueLabelDisplay="auto"
            min={0}
            max={1000}
            step={10}
            sx={{ mb: 2 }}
            valueLabelDisplay="on"
          />

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              label="Search Radius (km)"
              variant="outlined"
              size="small"
              type="number"
              value={filters.radius}
              onChange={(e) => handleFilterChange('radius', parseInt(e.target.value) || 10)}
              InputProps={{
                min: 1,
                max: 500,
              }}
              sx={{ width: 150 }}
            />
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default FilterBar;