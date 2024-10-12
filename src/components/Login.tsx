import { useState } from 'react';
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
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { auth, provider } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/feeds');
    } catch (error: any) {
      setError('Invalid email or password.');
      console.error(error.message);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, provider);
      navigate('/feeds');
    } catch (error: any) {
      setError('Failed to sign in with Google.');
      console.error(error.message);
    }
    setLoading(false);
  };

  const boxStyles = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    mt: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    p: 4,
  };

  const titleStyles = {
    color: '#3C4043',
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

  const gradientButtonStyles = {
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
        <Typography variant='h4' gutterBottom sx={titleStyles}>
          Sign in to Your Account
        </Typography>
        <Typography variant='body1' color='textSecondary' gutterBottom>
          Please enter your details below
        </Typography>

        {error && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <TextField
              label='Email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              fullWidth
              margin='normal'
              variant='outlined'
              error={!!error}
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
              error={!!error}
              sx={textFieldStyles}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant='contained'
              onClick={handleLogin}
              fullWidth
              disabled={loading}
              sx={gradientButtonStyles}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }}>OR</Divider>
            <Button
              variant='outlined'
              onClick={handleGoogleLogin}
              fullWidth
              disabled={loading}
              sx={googleButtonStyles}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In with Google'}
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography variant='body2' align='center'>
            Don't have an account?{' '}
            <MuiLink
              component={Link}
              to='/register'
              sx={{ fontWeight: 'bold', color: '#1976d2' }}
            >
              Register here
            </MuiLink>
          </Typography>
        </Grid>
      </Box>
    </Container>
  );
};

export default Login;
