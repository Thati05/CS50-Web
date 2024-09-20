import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BASE_URL = 'http://127.0.0.1:8000/api';  // Base URL for API requests

const Profile = () => {
  const { username } = useParams();  // Get the username from the URL
  const navigate = useNavigate();  // Used for redirection
  const [profile, setProfile] = useState(null);  // State to store profile data
  const [posts, setPosts] = useState([]);  // Store user's posts
  const [isFollowing, setIsFollowing] = useState(false);  // Follow/unfollow status
  const [about, setAbout] = useState('');  // "About Me" section
  const [isEditingAbout, setIsEditingAbout] = useState(false);  // Toggle for editing "About Me"
  const [editPostId, setEditPostId] = useState(null);  // ID of the post being edited
  const [editPostContent, setEditPostContent] = useState('');  // Store edited post content
  const loggedInUsername = localStorage.getItem('username');  // Get the logged-in username
  const accessToken = localStorage.getItem('access_token');  // Assume access token is stored here

  useEffect(() => {
    fetchProfile();
  }, [username]);

  // Helper function to add authorization header if user is logged in
  const authHeaders = () => ({
    'Content-Type': 'application/json',
    ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),  // Include token if available
  });

  // Fetch profile data and user's posts in reverse chronological order
  const fetchProfile = async () => {
    try {
      const response = await fetch(`${BASE_URL}/profile/${username}/`, {
        method: 'GET',
        headers: authHeaders(),
      });
      if (!response.ok) {
        throw new Error('Error fetching profile');
      }
      const data = await response.json();
      setProfile(data);
      setPosts(data.posts.reverse());  // Reverse chronological order
      setAbout(data.about || '');
      setIsFollowing(data.is_following);  // Get follow status
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // Fetch a specific post's detail from the API
  const fetchPostDetail = async (postId) => {
    try {
      const response = await fetch(`${BASE_URL}/posts/${postId}/`, {
        method: 'GET',
        headers: authHeaders(),
      });
      if (!response.ok) {
        throw new Error('Error fetching post details');
      }
      const data = await response.json();
      setEditPostContent(data.content);  // Load post content into the state for editing
    } catch (error) {
      console.error('Error fetching post details:', error);
    }
  };

  // Handle follow/unfollow toggle
  const handleFollowToggle = async () => {
    if (!loggedInUsername) {
      alert('You need to log in to follow users.');
      return;
    }

    try {
      const url = `${BASE_URL}/follow/${username}/`;
      const method = isFollowing ? 'DELETE' : 'POST';
      const response = await fetch(url, {
        method: method,
        headers: authHeaders(),
      });
      if (!response.ok) {
        throw new Error('Error toggling follow status');
      }
      setIsFollowing(!isFollowing);  // Toggle follow/unfollow status
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  // Handle profile picture click
  const handleProfileClick = () => {
    navigate(`/profile/${username}`);
  };

  // Handle "About Me" edit
  const handleAboutEdit = async () => {
    try {
      const response = await fetch(`${BASE_URL}/profile/${username}/`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ about }),
      });
      if (!response.ok) {
        throw new Error('Error updating About Me section');
      }
      const data = await response.json();
      setProfile({ ...profile, about: data.about });
      setIsEditingAbout(false);  // Exit editing mode
    } catch (error) {
      console.error('Error updating About Me section:', error);
    }
  };

  // Handle post edit initiation (fetch the post detail and set the post ID)
  const handleEditPost = (postId) => {
    setEditPostId(postId);  // Set the ID of the post being edited
    fetchPostDetail(postId);  // Fetch the specific post's detail for editing
  };

  // Handle saving the edited post
  const handleSavePost = async (postId) => {
    try {
      const response = await fetch(`${BASE_URL}/posts/${postId}/`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ content: editPostContent }),
      });
      if (!response.ok) {
        throw new Error('Error saving post');
      }
      const data = await response.json();
      // Update the post content in the posts state
      setPosts(posts.map(post => post.id === postId ? { ...post, content: data.content } : post));
      setEditPostId(null);  // Exit edit mode
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  if (!profile) return <div>Loading...</div>;  // Display loading state while fetching profile data

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          onClick={handleProfileClick}
          src={profile.profile_pic || 'https://via.placeholder.com/150'}  // Default profile picture
          alt={`${profile.user}'s profile`}
          className="profile-pic"
          style={{ width: '150px', height: '150px', borderRadius: '50%', cursor: 'pointer' }}
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
              {username === loggedInUsername && (
                <button onClick={() => setIsEditingAbout(true)}>Edit About</button>
              )}
            </div>
          )}
        </div>

        {/* Follow/Unfollow Button */}
        {username !== loggedInUsername && (
          <button onClick={handleFollowToggle}>
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        )}
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
                  {post.creator_username === loggedInUsername && (
                    <button onClick={() => handleEditPost(post.id)}>Edit Post</button>
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
