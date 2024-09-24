import React, { useState, useEffect } from 'react';

const BASE_URL = 'http://127.0.0.1:8000/api';

const FollowingPosts = () => {
  const [posts, setPosts] = useState([]);
  const accessToken = localStorage.getItem('access_token');  // Get the access token

  useEffect(() => {
    fetchFollowingPosts();
  }, []);

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,  // Add the Authorization header with Bearer token
  });

  const fetchFollowingPosts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/follow/posts/`, {
        method: 'GET',
        headers: authHeaders(),
      });
      if (!response.ok) {
        throw new Error('Error fetching posts');
      }
      const data = await response.json();
      setPosts(data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  return (
    <div>
      <h1>Following Posts</h1>
      {posts.length === 0 && <p>No posts available from users you follow.</p>}
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <p><strong>{post.creator_username}</strong>: {post.content}</p>
            <p><em>{new Date(post.created_at).toLocaleString()}</em></p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FollowingPosts;
