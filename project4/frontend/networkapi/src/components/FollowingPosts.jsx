import React, { useState, useEffect } from 'react';

const BASE_URL = 'http://127.0.0.1:8000/api';

const FollowingPosts = () => {
  const [followingPosts, setFollowingPosts] = useState([]);  // State to store following posts
  const accessToken = localStorage.getItem('access_token');  // Get the access token from localStorage
  const username = localStorage.getItem('username');  // Get the logged-in user's username

  useEffect(() => {
    if (accessToken && username) {
      fetchFollowingPosts();  // Fetch posts only if the user is authenticated
    }
  }, [accessToken, username]);

  // Helper function to add the authorization header
  const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,  // Add the Authorization header with Bearer token
  });

  // Fetch the following posts from the profile serializer
  const fetchFollowingPosts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/profile/${username}/`, {
        method: 'GET',
        headers: authHeaders(),
      });
      if (!response.ok) {
        throw new Error('Error fetching following posts');
      }
      const data = await response.json();
      setFollowingPosts(data.following_posts);  // Set the following posts in the state
    } catch (error) {
      console.error('Error fetching following posts:', error);
    }
  };

  return (
    <div>
      <h1>Following Posts</h1>
      {followingPosts.length === 0 ? (
        <p>No posts available from users you follow.</p>
      ) : (
        <ul>
          {followingPosts.map((post) => (
            <li key={post.id}>
              <p><strong>{post.creator_username}</strong>: {post.content}</p>
              <p><em>{new Date(post.created_at).toLocaleString()}</em></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FollowingPosts;
