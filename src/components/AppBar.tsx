import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// Styles using sx prop
const appBarStyles = {
  background: 'linear-gradient(135deg, #1a237e, #0d47a1, #1e88e5)',
  color: '#ffffff',
  padding: '8px 16px',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
};

const typographyStyles = {
  flexGrow: 1,
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 'bold',
  color: '#ffffff',
  letterSpacing: '1px',
};

const avatarStyles = {
  width: 40,
  height: 40,
  border: '2px solid #ffffff',
  backgroundColor: '#616161',
};

const iconButtonStyles = {
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
};

const menuPaperStyles = {
  backgroundColor: '#263238',
  color: '#ffffff',
  minWidth: '150px',
  borderRadius: '8px',
};

const loginButtonStyles = {
  padding: '6px 16px',
  borderRadius: '20px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  transition: 'background-color 0.3s ease-in-out',
};

const CustomAppBar = ({ user }: { user: any }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
    handleClose();
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position='static' sx={appBarStyles}>
      <Toolbar>
        <Typography
          variant='h5'
          sx={typographyStyles}
          onClick={() => navigate('/feeds')}
        >
          Mini Social Media
        </Typography>
        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={handleMenuClick}
              size='large'
              color='inherit'
              aria-label='account of current user'
              sx={iconButtonStyles}
            >
              <Avatar
                alt={user.displayName}
                src={user.photoURL}
                sx={avatarStyles}
              >
                <AccountCircleIcon />
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{ sx: menuPaperStyles }}
            >
              <MenuItem onClick={handleClose}>
                <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                  {user.displayName ? user.displayName : user.email}
                </Typography>
              </MenuItem>
              <MenuItem component={Link} to='/my-posts' onClick={handleClose}>
                <Typography variant='body1'>My Posts</Typography>
              </MenuItem>
              <MenuItem
                component={Link}
                to='/saved-posts'
                onClick={handleClose}
              >
                <Typography variant='body1'>Saved Posts</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Typography variant='body1' sx={{ color: '#ff1744' }}>
                  Logout
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Button
            color='inherit'
            component={Link}
            to='/login'
            sx={loginButtonStyles}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
