import { useEffect, useState } from 'react';
import { Container, Grid } from '@mui/material';
import PostCard from './PostCard';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const Feeds = ({ user }: { user: any }) => {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);
  async function fetchPosts() {
    const postsCollection = collection(db, 'posts');
    const postSnapshot = await getDocs(postsCollection);
    const postList = postSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPosts(postList);
  }

  return (
    <Container>
      <Grid container spacing={3}>
        {posts.map(post => (
          <Grid item xs={12} md={6} lg={4} key={post.id}>
            <PostCard post={post} user={user} fetchPosts={fetchPosts} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Feeds;
