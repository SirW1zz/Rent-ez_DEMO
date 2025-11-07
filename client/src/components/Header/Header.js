import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  InputBase,
  alpha,
  styled,
} from '@mui/material';
import {
  Search as SearchIcon,
  AccountCircle,
  Dashboard,
  Message,
  Notifications,
  Settings,
  Logout,
  Add,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import LoadingSpinner from '../UI/LoadingSpinner';

// Styled search input
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const {
    isMobileMenuOpen,
    toggleMobileMenu,
    searchQuery,
    setSearchQuery,
    toggleSearch,
  } = useUI();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpenState = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = async () => {
    await logout();
    handleMenuClose();
    navigate('/');
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCreateListing = () => {
    navigate('/create-listing');
  };

  const menuId = 'primary-search-account-menu';
  const mobileMenuId = 'primary-search-account-menu-mobile';

  // Loading state
  if (isLoading) {
    return (
      <AppBar position="static">
        <Toolbar>
          <LoadingSpinner size={24} message="" />
        </Toolbar>
      </AppBar>
    );
  }

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      PaperProps={{
        elevation: 3,
        sx: {
          mt: 1.5,
          minWidth: 200,
        },
      }}
    >
      <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
        <ListItemIcon>
          <AccountCircle fontSize="small" />
        </ListItemIcon>
        <ListItemText>Profile</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => { navigate('/dashboard'); handleMenuClose(); }}>
        <ListItemIcon>
          <Dashboard fontSize="small" />
        </ListItemIcon>
        <ListItemText>Dashboard</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => { navigate('/messages'); handleMenuClose(); }}>
        <ListItemIcon>
          <Message fontSize="small" />
        </ListItemIcon>
        <ListItemText>Messages</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={() => { navigate('/settings'); handleMenuClose(); }}>
        <ListItemIcon>
          <Settings fontSize="small" />
        </ListItemIcon>
        <ListItemText>Settings</ListItemText>
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        <ListItemText>Logout</ListItemText>
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          {/* Logo and Brand */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              display: { xs: 'none', sm: 'block' },
              cursor: 'pointer',
              fontWeight: 700,
            }}
            onClick={() => navigate('/')}
          >
            Rent-ez
          </Typography>

          {/* Mobile menu button */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2, display: { sm: 'none' } }}
            onClick={toggleMobileMenu}
          >
            <MenuIcon />
          </IconButton>

          {/* Search Bar */}
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search rentals..."
              value={searchQuery}
              onChange={handleSearch}
              aria-label="search"
            />
          </Search>

          <Box sx={{ flexGrow: 1 }} />

          {/* Desktop Actions */}
          {isAuthenticated ? (
            <>
              <Button
                color="inherit"
                startIcon={<Add />}
                onClick={handleCreateListing}
                sx={{ mr: 1, display: { xs: 'none', sm: 'flex' } }}
              >
                Create Listing
              </Button>

              <IconButton
                size="large"
                aria-label="show 4 new messages"
                color="inherit"
                onClick={() => navigate('/messages')}
                sx={{ mr: 1 }}
              >
                <Badge badgeContent={4} color="error">
                  <Message />
                </Badge>
              </IconButton>

              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
                sx={{ mr: 2 }}
              >
                <Badge badgeContent={17} color="error">
                  <Notifications />
                </Badge>
              </IconButton>

              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar
                  src={user?.avatar}
                  alt={user?.name}
                  sx={{ width: 32, height: 32 }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                onClick={() => navigate('/login')}
                sx={{ mr: 1 }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate('/register')}
              >
                Sign Up
              </Button>
            </>
          )}

          {/* Mobile menu */}
          <IconButton
            size="large"
            aria-label="show more"
            aria-controls={mobileMenuId}
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
            color="inherit"
            sx={{ display: { xs: 'flex', md: 'none' } }}
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Menu */}
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isMobileMenuOpenState}
        onClose={handleMobileMenuClose}
      >
        {isAuthenticated ? (
          <>
            <MenuItem onClick={() => { handleCreateListing(); handleMobileMenuClose(); }}>
              <ListItemIcon>
                <Add fontSize="small" />
              </ListItemIcon>
              <ListItemText>Create Listing</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => { navigate('/messages'); handleMobileMenuClose(); }}>
              <ListItemIcon>
                <Message fontSize="small" />
              </ListItemIcon>
              <ListItemText>Messages</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => { navigate('/notifications'); handleMobileMenuClose(); }}>
              <ListItemIcon>
                <Notifications fontSize="small" />
              </ListItemIcon>
              <ListItemText>Notifications</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { navigate('/profile'); handleMobileMenuClose(); }}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={() => { navigate('/login'); handleMobileMenuClose(); }}>
              <ListItemText>Login</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => { navigate('/register'); handleMobileMenuClose(); }}>
              <ListItemText>Sign Up</ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>

      {renderMenu}
    </>
  );
};

export default Header;