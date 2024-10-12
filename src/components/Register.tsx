import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Divider,
  Link as MuiLink,
} from '@mui/material';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/feeds');
    } catch (error) {
      setError('Registration failed. Please try again.');
      console.error(error);
    }
    setLoading(false);
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, provider);
      navigate('/feeds');
    } catch (error) {
      setError('Failed to register with Google.');
      console.error(error);
    }
    setLoading(false);
  };

  // Styles
  const boxStyles = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    mt: 8,
    backgroundColor: '#ffffff',
    borderRadius: 4,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    p: 4,
  };

  const titleStyles = {
    color: '#1976d2',
    fontWeight: 'bold',
  };

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      '& fieldset': {
        borderColor: '#D1D1D1',
      },
      '&:hover fieldset': {
        borderColor: '#1976d2',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#1976d2',
      },
    },
  };

  const buttonStyles = {
    background: 'linear-gradient(135deg, #1a237e, #0d47a1, #1e88e5)',
    color: '#FFF',
    py: 1.5,
    borderRadius: '12px',
    fontWeight: 'bold',
    mb: 1,
    '&:hover': {
      background: 'linear-gradient(135deg, #1e88e5, #0d47a1, #1a237e)',
    },
    transition: 'background-color 0.3s ease-in-out',
  };

  const googleButtonStyles = {
    borderColor: '#D1D1D1',
    color: '#1976d2',
    py: 1.5,
    borderRadius: '12px',
    fontWeight: 'bold',
    '&:hover': {
      borderColor: '#1976d2',
      backgroundColor: '#E3F2FD',
    },
  };

  return (
    <Container maxWidth='xs'>
      <Box sx={boxStyles}>
        <Typography variant='h4' gutterBottom sx={titleStyles} noWrap>
          Create Your Account
        </Typography>
        <Typography variant='body1' color='textSecondary' gutterBottom>
          Please fill in the details below
        </Typography>

        {error && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <TextField
              label='Name'
              value={name}
              onChange={e => setName(e.target.value)}
              fullWidth
              margin='normal'
              variant='outlined'
              sx={textFieldStyles}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label='Email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              fullWidth
              margin='normal'
              variant='outlined'
              sx={textFieldStyles}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label='Password'
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              fullWidth
              margin='normal'
              variant='outlined'
              sx={textFieldStyles}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label='Confirm Password'
              type='password'
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              fullWidth
              margin='normal'
              variant='outlined'
              sx={textFieldStyles}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant='contained'
              onClick={handleRegister}
              fullWidth
              disabled={loading}
              sx={buttonStyles}
            >
              {loading ? (
                <CircularProgress size={24} color='inherit' />
              ) : (
                'Register'
              )}
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }}>OR</Divider>
            <Button
              variant='outlined'
              onClick={handleGoogleRegister}
              fullWidth
              disabled={loading}
              sx={googleButtonStyles}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                'Register with Google'
              )}
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography variant='body2' align='center'>
            Already have an account?{' '}
            <MuiLink
              component={Link}
              to='/login'
              sx={{ fontWeight: 'bold', color: '#1976d2' }}
            >
              Log in here
            </MuiLink>
          </Typography>
        </Grid>
      </Box>
    </Container>
  );
};

export default Register;
