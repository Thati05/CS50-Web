import React, { useState, useEffect } from 'react';

const Pages = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/posts/');  // Await the fetch //add a proxy url 
      const data = await res.json();  // Await the JSON parsing
      console.log(data);
      
      // Ensure data is an array before setting state
      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        console.error('API did not return an array.');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  return (
    <div>
      <div className='posts-list'>
        {posts.map((post, index) => (
          <h1 key={index}>{post.content}</h1>
        ))}
      </div>
    </div>
  );
};

export default Pages;
