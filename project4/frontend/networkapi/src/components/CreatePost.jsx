import React, { useState } from 'react';

const CreatePost = () => {
  // Initialize state for the post data
  const [postData, setPostData] = useState({
    content: '',
    // Add other fields here if applicable
    // Example: tags: '', image: '', etc.
  });

  const [error, setError] = useState(null);  // State to handle errors
  const [success, setSuccess] = useState(null);  // State to handle success messages

  // Handle input changes for all fields
  const handleChange = (e) => {
    setPostData({
      ...postData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);  // Reset any previous errors
    setSuccess(null);  // Reset any previous success message

    const token = localStorage.getItem('access_token');  // Get JWT token from localStorage

    // Ensure token is available (user must be logged in)
    if (!token) {
      setError('You must be logged in to create a post.');
      return;
    }

    // Make the POST request using fetch to create a post
    fetch('http://127.0.0.1:8000/api/', {  // Ensure you are using the correct API endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,  // Include the JWT token in the Authorization header
      },
      body: JSON.stringify(postData),  // Send all post data in the request body
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Failed to create post.');
    })
    .then((data) => {
      console.log('Post created successfully:', data);
      setPostData({ content: '' });  // Clear the input field after successful post creation
      setSuccess('Post created successfully!');
    })
    .catch((error) => {
      console.error('Error creating post:', error);
      setError('Failed to create the post. Please try again.');
    });
  };

  return (
    <div>
      {/* Display Error Message */}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {/* Display Success Message */}
      {success && <div style={{ color: 'green' }}>{success}</div>}
      
      {/* Create Post Form */}
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between py-[55px] CIL-create_post">
          
          {/* Content Field */}
          <input
          autoComplete='off'
            onChange={handleChange}
            name="content"
            className="CIL-input text-gray-400 items-center"
            placeholder="Share anything on your mind..."  // Placeholder for post content
            value={postData.content}  // Bind input value to the state
            required
          />
          
          {/* Add more fields here if necessary */}
          {/* Example: tags, image, etc. */}
          {/* <input name="tags" onChange={handleChange} placeholder="Add tags..." value={postData.tags} /> */}

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
    </div>
  );
};

export default CreatePost;
