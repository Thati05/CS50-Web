import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';  // To get the username from the URL
import axiosInstance from '../axios';  // Axios instance for making API requests

const Profile = () => {
  const { username } = useParams();  // Get the username from the URL
  const [profile, setProfile] = useState(null);  // State to store profile data
  const [about, setAbout] = useState('');  // "About Me" section
  const [posts, setPosts] = useState([]);  // Store user's posts
  const [editPostId, setEditPostId] = useState(null);  // Track the post being edited
  const [editPostContent, setEditPostContent] = useState('');  // Store edited post content
  const [isEditingAbout, setIsEditingAbout] = useState(false);  // Toggle for editing "About Me"

  useEffect(() => {
    fetchProfile();
  }, [username]);

  // Fetch profile data, including posts
  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get(`/profile/${username}/`);
      setProfile(response.data);
      setPosts(response.data.posts);  // Set user's posts
      setAbout(response.data.about || '');  // Set "About Me" section
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // Handle editing "About Me" section
  const handleAboutEdit = async () => {
    try {
      const response = await axiosInstance.put(`/profile/${username}/`, { about });
      setProfile({ ...profile, about: response.data.about });
      setIsEditingAbout(false);  // Exit editing mode
    } catch (error) {
      console.error('Error updating About Me section:', error);
    }
  };

  // Handle editing a post
  const handleEditPost = (postId, content) => {
    setEditPostId(postId);
    setEditPostContent(content);
  };

  // Save the edited post
  const handleSavePost = async (postId) => {
    try {
      const response = await axiosInstance.put(`/posts/${postId}/`, { content: editPostContent });
      // Update the post in the posts state after successful save
      setPosts(posts.map(post => post.id === postId ? { ...post, content: response.data.content } : post));
      setEditPostId(null);  // Exit edit mode
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  if (!profile) return <div>Loading...</div>;  // Display loading state

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={profile.profile_pic || 'https://via.placeholder.com/150'}  // Default profile picture if not provided
          alt={`${profile.user}'s profile`}
          className="profile-pic"
          style={{ width: '150px', height: '150px', borderRadius: '50%' }}
        />
        <h1>{profile.user}</h1>
        <p>Email: {profile.email}</p>
        <p>Followers: {profile.follower_count}</p>
        <p>Following: {profile.following_count}</p>

        {/* About Me Section */}
        <div>
          {isEditingAbout ? (
            <div>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows={4}
                cols={50}
              />
              <button onClick={handleAboutEdit}>Save</button>
              <button onClick={() => setIsEditingAbout(false)}>Cancel</button>
            </div>
          ) : (
            <div>
              <p>{about || 'No details provided yet.'}</p>
              {username === localStorage.getItem('username') && (
                <button onClick={() => setIsEditingAbout(true)}>Edit About</button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* User's Posts */}
      <h2>Posts</h2>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        <ul>
          {posts.map(post => (
            <li key={post.id} className="post-item">
              {editPostId === post.id ? (
                <div>
                  <textarea
                    value={editPostContent}
                    onChange={(e) => setEditPostContent(e.target.value)}
                    rows={4}
                    cols={50}
                  />
                  <button onClick={() => handleSavePost(post.id)}>Save</button>
                  <button onClick={() => setEditPostId(null)}>Cancel</button>
                </div>
              ) : (
                <div>
                  <p>{post.content}</p>
                  <p>{new Date(post.created_at).toLocaleString()}</p>
                  {/* Allow editing if the logged-in user is the creator */}
                  {post.creator_username === localStorage.getItem('username') && (
                    <button onClick={() => handleEditPost(post.id, post.content)}>Edit Post</button>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Profile;
