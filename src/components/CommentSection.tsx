import React, { useState } from 'react';
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Typography,
  Box,
  Divider,
  Avatar,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';

interface Comment {
  text: string;
  user: string;
}

interface User {
  uid: string;
  displayName: string;
  avatarUrl?: string;
}

interface Post {
  id: string;
  comments: Comment[];
}

// Custom styles
const useStyles = makeStyles((theme: Theme) => ({
  commentSection: {
    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
    padding: theme.spacing(2),
  },
  commentInput: {
    marginRight: theme.spacing(1),
    flexGrow: 1,
    backgroundColor: '#fff',
    borderRadius: '4px',
  },
  submitButton: {
    borderRadius: '20px',
  },
  commentItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  avatar: {
    marginRight: theme.spacing(1),
  },
}));

const CommentSection = ({
  post,
  user,
  fetchPosts,
}: {
  post: Post;
  user: User;
  fetchPosts: () => {};
}) => {
  const classes = useStyles();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(post.comments || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCommentSubmit = async () => {
    if (!user || !comment.trim()) return;

    setLoading(true);
    const newComment: Comment = {
      text: comment.trim(),
      user: user.displayName,
    };

    try {
      await saveCommentToFirebase(post.id, newComment);

      setComments(prevComments => [...prevComments, newComment]);
      setComment('');
      setError(null);
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError('Failed to post comment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveCommentToFirebase = async (postId: string, newComment: Comment) => {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      comments: arrayUnion(newComment),
    });
    await fetchPosts();
  };

  return (
    <Box className={classes.commentSection}>
      <Typography variant='body1' gutterBottom>
        Comments ({comments.length})
      </Typography>
      <List>
        {comments.map((c: Comment, index: number) => (
          <ListItem key={index} className={classes.commentItem}>
            <Avatar
              alt={c.user}
              src={`/path/to/avatar/${c.user}.png`}
              className={classes.avatar}
            />
            <ListItemText
              primary={<strong>{c.user}</strong>}
              secondary={c.text}
            />
          </ListItem>
        ))}
      </List>
      {error && <Typography color='error'>{error}</Typography>}{' '}
      {/* Error message */}
      {user && (
        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
          <TextField
            label='Add a comment...'
            value={comment}
            onChange={e => setComment(e.target.value)}
            fullWidth
            variant='outlined'
            className={classes.commentInput}
            disabled={loading}
            InputProps={{
              style: {
                borderRadius: '20px',
              },
            }}
          />
          <Button
            variant='contained'
            onClick={handleCommentSubmit}
            className={classes.submitButton}
            disabled={loading || !comment.trim()}
            sx={{
              backgroundColor: '#0095f6',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#007bbf',
              },
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Post'}
          </Button>
        </Box>
      )}
      <Divider sx={{ marginTop: 2 }} />
    </Box>
  );
};

export default CommentSection;
