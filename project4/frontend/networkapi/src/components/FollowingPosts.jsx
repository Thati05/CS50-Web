import React, { useState, useEffect } from 'react';

const BASE_URL = 'http://127.0.0.1:8000/api';  // Base URL for API requests

const FollowingPosts = () => {
  const [posts, setPosts] = useState([]);  // State to store posts
  const accessToken = localStorage.getItem('access_token');  // Assume access token is stored here

  useEffect(() => {
    fetchFollowingPosts();  // Fetch posts when the component is mounted
  }, []);

  // Helper function to add authorization header if the user is logged in
  const authHeaders = () => ({
    'Content-Type': 'application/json',
    ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),  // Include token if available
  });

  // Fetch posts of users the current user is following
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
      setPosts(data.posts);  // Set the posts in state
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
