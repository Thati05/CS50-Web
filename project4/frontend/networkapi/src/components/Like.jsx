import { useState } from 'react';

const Like = ({ post }) => {
  const [likePost, setLikePost] = useState(post.liked); 
  const [likeCount, setLikeCount] = useState(post.like_count);  

  const handleLike = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('access_token');
    if (!token) {
      alert("You must be logged in to like a post.");
      return;
    }

    // Optimistically update the UI
    setLikePost(!likePost);
    setLikeCount(likePost ? likeCount - 1 : likeCount + 1);
  

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/like/${post.id}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  
        }
      });

      if (!response.ok) {
        setLikePost(likePost); 
        setLikeCount(likePost ? likeCount + 1 : likeCount - 1);  
        const errorData = await response.json(); 
        console.error('Error:', errorData);
      }
    } catch (error) {
     
      setLikePost(likePost);  
      setLikeCount(likePost ? likeCount + 1 : likeCount - 1);  
      console.error('Error:', error);
    }
  };

  return (
    <div className='flex gap-3 items-center'>
      <button onClick={handleLike}>
        <img
          width={35}
          className='object-contain'
          src={likePost ?  'https://cdn-icons-png.flaticon.com/512/2589/2589175.png' :'https://cdn-icons-png.flaticon.com/512/2589/2589197.png'}
          alt='Like Icon'
        />
      </button>
      <p>{likeCount}</p>
    </div>
  );
};

export default Like;



