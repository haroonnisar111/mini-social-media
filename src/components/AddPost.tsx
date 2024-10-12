import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AddPost = () => {
  const [post, setPost] = useState({
    imageUrl: '',
  });
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      if (currentUser) {
        setUser({
          username: currentUser.displayName,
          userId: currentUser.uid,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      setMessage('You need to be logged in to add a post.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const docRef = await addDoc(collection(db, 'posts'), {
        imageUrl: post.imageUrl,
        username: user.username,
        userId: user.userId,
        createdAt: Timestamp.now(),
        likes: [],
        saves: [],
        comments: [],
      });

      setMessage('Post added successfully!');
      console.log('Post added with ID: ', docRef.id);

      setPost({
        imageUrl: '',
      });
    } catch (e) {
      const error = e as Error;
      setMessage('Error adding post: ' + error.message);
      console.error('Error adding post: ', e);
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: '32px auto',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}
    >
      <Typography variant='h4' component='h1' gutterBottom>
        Add a New Post
      </Typography>

      {user && (
        <Typography variant='subtitle1'>
          Logged in as: {user.username}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label='Image URL'
          name='imageUrl'
          value={post.imageUrl}
          onChange={handleInputChange}
          fullWidth
          margin='normal'
          required
        />
        <Button
          type='submit'
          variant='contained'
          color='primary'
          fullWidth
          disabled={loading}
        >
          {loading ? 'Adding Post...' : 'Add Post'}
        </Button>
        {message && (
          <Typography
            variant='body2'
            color={message.includes('successfully') ? 'green' : 'red'}
            mt={2}
          >
            {message}
          </Typography>
        )}
      </form>
    </Box>
  );
};

export default AddPost;
