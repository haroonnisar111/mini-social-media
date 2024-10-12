import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import PostCard from './PostCard';

const SavedPosts = ({ user }: { user: any }) => {
  const [savedPosts, setSavedPosts] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);
  async function fetchPosts() {
    const q = query(
      collection(db, 'posts'),
      where('savedBy', 'array-contains', user.uid)
    );
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot, 'querySnapshot');
    const postsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setSavedPosts(postsData);
  }

  return (
    <div>
      <h2>Saved Posts</h2>
      {savedPosts.length > 0 ? (
        savedPosts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            user={user}
            fetchPosts={fetchPosts}
          />
        ))
      ) : (
        <p>No saved posts found.</p>
      )}
    </div>
  );
};

export default SavedPosts;
