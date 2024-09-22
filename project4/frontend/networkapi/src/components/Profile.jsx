import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SidebarLeft from './SidebarLeft'


const BASE_URL = 'http://127.0.0.1:8000/api';  // Base URL for API requests

const Profile = () => {
  const { username } = useParams();  // fetching  the username from the URL
  const navigate = useNavigate();  
  const [profile, setProfile] = useState(null);  
  const [posts, setPosts] = useState([]); 
  const [isFollowing, setIsFollowing] = useState(false); 
  const [about, setAbout] = useState('');  
  const [isEditingAbout, setIsEditingAbout] = useState(false);  
  const [editPostId, setEditPostId] = useState(null); 
  const [editPostContent, setEditPostContent] = useState(''); 
  const loggedInUsername = localStorage.getItem('username');  
  const accessToken = localStorage.getItem('access_token');  
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
      setIsFollowing(data.is_following);  
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
    setEditPostId(postId); 
    fetchPostDetail(postId); 
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
    <section className=' pt-10 px-5 font-Nunito ' >
      <h2 className=' text-5xl font-bold'>Network </h2>

<div className=" flex">
      <div className=' mt-20'>
         <SidebarLeft/>
      </div>

      <div className=' profile-detail mt-24 flex flex-col items-center w-full ' >

 <div className="image-and-bg">
      {/* Background Image */}
      <div className="background-img justify-center flex">
        <img src="/src/assets/image.svg" alt="Background" />
      </div>

      {/* Profile Image */}
      <div className="profile-img-container">
        <img
          src={profile?.profile_pic || 'https://via.placeholder.com/150'} // Default image
          alt={`${profile?.user}'s profile`}
          className="profile-img"
          onClick={handleProfileClick}
        />
      </div>
    </div>
    <div className=' flex  justify-center mt-60 flex-col' >
      <div>
          <h1>{profile.user}</h1>
        <p>Email: {profile.email}</p>
        <p>Followers: {profile.follower_count}</p>
        <p>Following: {profile.following_count}</p>
      </div>
         

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
<div className='flex'>
  {posts.length === 0 ? (
    <p>No posts available.</p>
  ) : (
    <div className='w-full'>
      <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7   auto-rows-auto'>
        {posts.map(post => (
          <li key={post.id} className="CIK-post-item p-4 border  flex flex-col">
            {editPostId === post.id ? (
              <div>
                <textarea
                  value={editPostContent}
                  onChange={(e) => setEditPostContent(e.target.value)}
                  rows={4}
                  cols={50}
                  className="w-full border p-2 rounded"
                />
                <button 
                  onClick={() => handleSavePost(post.id)} 
                  className="mt-2 bg-blue-500 text-white py-1 px-3 rounded"
                >
                  Save
                </button>
                <button 
                  onClick={() => setEditPostId(null)} 
                  className="mt-2 ml-2 bg-gray-500 text-white py-1 px-3 rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                   <p className="text-gray-700">
                  {post.content.length > 20 ? `${post.content.slice(0, 100)}...` : post.content}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  {new Date(post.created_at).toLocaleString()}
                </p>
                {post.creator_username === loggedInUsername && (
                  <button 
                    onClick={() => handleEditPost(post.id)} 
                    className="mt-2 text-blue-500 underline"
                  >
                    Edit Post
                  </button>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )}
</div>
     

      </div>
     
     

    </div>




    </section>
    
  );
};

export default Profile;
