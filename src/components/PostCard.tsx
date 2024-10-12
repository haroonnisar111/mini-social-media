import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';
import CommentSection from './CommentSection';

const PostCard = ({
  post,
  user,
  fetchPosts,
}: {
  post: any;
  user: any;
  fetchPosts: any;
}) => {
  const [commentSectionOpen, setCommentSectionOpen] = useState(false);
  const docId = post?.id || '';
  const postDocRef = doc(db, 'posts', docId);

  const handleLike = async () => {
    if (!user) {
      alert('Please log in to like the post');
      return;
    }
    try {
      if (post.likes?.includes(user.uid)) {
        await updateDoc(postDocRef, {
          likes: arrayRemove(user.uid),
        });
      } else {
        await updateDoc(postDocRef, {
          likes: arrayUnion(user.uid),
        });
      }
      await fetchPosts();
    } catch (error) {
      console.error('Error liking post: ', error);
    }
  };

  const handleSave = async () => {
    if (!user) {
      alert('Please log in to save the post');
      return;
    }
    try {
      if (post.savedBy?.includes(user.uid)) {
        await updateDoc(postDocRef, {
          savedBy: arrayRemove(user.uid),
        });
      } else {
        await updateDoc(postDocRef, {
          savedBy: arrayUnion(user.uid),
        });
      }
      fetchPosts();
    } catch (error) {
      console.error('Error saving post: ', error);
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 600,
        margin: '24px auto',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
      }}
    >
      <CardMedia
        component='img'
        height='300'
        image={post.imageUrl}
        alt='profile-picture'
      />

      <CardContent sx={{ padding: '16px 24px' }}>
        <Typography variant='body2' sx={{ marginBottom: '8px', color: '#555' }}>
          <strong>{post.likes?.length}</strong> likes •{' '}
          <strong>{post.comments?.length}</strong> comments
        </Typography>
        <Typography variant='body1' sx={{ color: '#333', lineHeight: 1.5 }}>
          {post.content}
        </Typography>
      </CardContent>

      {/* Action buttons */}
      <CardActions
        disableSpacing
        sx={{
          padding: '12px 24px',
          justifyContent: 'space-between',
          borderTop: '1px solid #eee',
        }}
      >
        <Box>
          <IconButton
            aria-label='like'
            onClick={handleLike}
            sx={{
              color: post.likes?.includes(user.uid) ? 'error.main' : 'inherit',
              '&:hover': { color: 'error.main' },
            }}
          >
            <FavoriteIcon />
          </IconButton>
          <IconButton
            aria-label='comments'
            onClick={() => setCommentSectionOpen(!commentSectionOpen)}
            sx={{ marginLeft: '8px' }}
          >
            <CommentIcon />
          </IconButton>
        </Box>

        <IconButton
          aria-label='save'
          onClick={handleSave}
          sx={{
            color: post.savedBy?.includes(user.uid)
              ? 'primary.main'
              : 'inherit',
            '&:hover': { color: 'primary.main' },
          }}
        >
          <BookmarkIcon />
        </IconButton>
      </CardActions>

      {/* Comment section */}
      {commentSectionOpen && (
        <CommentSection post={post} user={user} fetchPosts={fetchPosts} />
      )}
    </Card>
  );
};

export default PostCard;
