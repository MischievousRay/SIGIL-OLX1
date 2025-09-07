import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  InputBase,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Button,
  Chip
} from '@mui/material';
import {
  Search,
  Logout,
  Person,
  Dashboard,
  Chat as ChatIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import ChatDialog from '../Chat/ChatDialog';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { unreadCount } = useSocket();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [chatDialogOpen, setChatDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        bgcolor: '#FFFFFF',
        borderBottom: '1px solid',
        borderColor: '#E0E0E0',
        color: '#000000'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Search Bar */}
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: '#FFFFFF',
            borderRadius: 2,
            px: 2,
            py: 1,
            width: '400px',
            maxWidth: '50%',
            border: '1px solid #E0E0E0'
          }}
        >
          <IconButton 
            type="submit" 
            sx={{ color: '#000000', mr: 1, p: 0.5 }}
            disabled={!searchQuery.trim()}
          >
            <Search />
          </IconButton>
          <InputBase
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyPress={handleSearchKeyPress}
            sx={{ flex: 1, color: '#000000' }}
          />
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isAuthenticated ? (
            <>
              {/* User Status Chip */}
              <Chip 
                label={`Welcome, ${user?.name || 'User'}`}
                variant="outlined"
                sx={{ 
                  bgcolor: '#FFFFFF',
                  borderColor: '#E0E0E0',
                  color: '#000000',
                  fontFamily: '"Inter", sans-serif',
                  '&:hover': {
                    bgcolor: '#F8F9FA'
                  }
                }}
              />
              
              {/* Chat Button */}
              <IconButton 
                sx={{ color: '#000000' }}
                onClick={() => setChatDialogOpen(true)}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <ChatIcon />
                </Badge>
              </IconButton>

              {/* User Menu */}
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: '#000000',
                    fontSize: '0.9rem',
                    fontFamily: '"Inter", sans-serif'
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
              </IconButton>
              
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <Person sx={{ mr: 1 }} />
                  Profile
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Dashboard sx={{ mr: 1 }} />
                  Dashboard
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => navigate('/login')}
                sx={{ 
                  borderColor: '#000000',
                  color: '#000000',
                  fontFamily: '"Inter", sans-serif',
                  '&:hover': {
                    borderColor: '#000000',
                    bgcolor: 'rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                Login
              </Button>
              <Button 
                variant="contained" 
                size="small"
                onClick={() => navigate('/register')}
                sx={{ 
                  bgcolor: '#000000',
                  fontFamily: '"Inter", sans-serif',
                  '&:hover': {
                    bgcolor: '#333333'
                  }
                }}
              >
                Register
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
      
      {/* Chat Dialog */}
      <ChatDialog 
        open={chatDialogOpen}
        onClose={() => setChatDialogOpen(false)}
      />
    </AppBar>
  );
};

export default Navbar;
