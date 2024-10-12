import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import PostCard from './PostCard';

const MyPosts = ({ user }: { user: any }) => {
  const [myPosts, setMyPosts] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);
  async function fetchPosts() {
    const q = query(collection(db, 'posts'), where('userId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    const postsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setMyPosts(postsData);
  }

  return (
    <div>
      <h2>My Posts</h2>
      {myPosts.length > 0 ? (
        myPosts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            user={user}
            fetchPosts={fetchPosts}
          />
        ))
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
};

export default MyPosts;
