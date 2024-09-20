
import React, { useState, useEffect } from 'react';
import axiosInstance from '../axios';

const FollowingPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchFollowingPosts();
  }, []);

  const fetchFollowingPosts = async () => {
    try {
      const response = await axiosInstance.get(`/follow/${posts.user}`);
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  return (
    <div>
      <h1>Following</h1>
      {posts.length === 0 && <p>No posts available.</p>}
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <p>{post.content}</p>
            <p>{new Date(post.created_at).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};



export default FollowingPosts