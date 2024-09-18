import React, { useState } from 'react';

const CreatePost = () => {
  const [createPost, setCreatePost] = useState({ content: '' });
  const [error, setError] = useState(null);    // State to handle error messages
  const [success, setSuccess] = useState(null);  // State to handle success messages

  // Handle input change
  const handleChange = (e) => {
    setCreatePost({
      ...createPost,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
  
    const token = localStorage.getItem('access_token');  // Assuming token is stored in localStorage
  
    try {
      const response = await fetch('http://127.0.0.1:8000/api/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Include JWT token in request
        },
        body: JSON.stringify(createPost),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Something went wrong!');
      }
  
      const data = await response.json();
      setSuccess('Post created successfully!');
      setCreatePost({ content: '' });  // Clear form on success
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      {/* Create Post Form */}
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between py-[55px] CIL-create_post">
          <input
            autoComplete='off'
            onChange={handleChange}
            name="content"
            className="CIL-input text-gray-400 items-center"
            placeholder="Share anything on your mind..." 
            value={createPost.content}  
          />
          <button type="submit">
            <img
              className="mr-10"
              width={30}
              src="https://cdn-icons-png.flaticon.com/512/736/736161.png"
              alt="Submit"
            />
          </button>
        </div>
      </form>
      {/* Display success or error messages */}
      {success && <div className="text-green-500">{success}</div>}
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default CreatePost;
