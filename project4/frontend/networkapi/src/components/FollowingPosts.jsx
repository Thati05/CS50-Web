import React, { useState, useEffect } from 'react';
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight.jsx';
import Like from './Like';  // Assuming Like component is imported
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook

const BASE_URL = 'http://127.0.0.1:8000/api';

const FollowingPosts = () => {
  const [followingPosts, setFollowingPosts] = useState([]);  // State to store following posts
  const accessToken = localStorage.getItem('access_token');  // Get the access token from localStorage
  const username = localStorage.getItem('username');  // Get the logged-in user's username
  const navigate = useNavigate();  // Use useNavigate for programmatic navigation
  
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
    
    <section className=' pt-10'>

        <div className="font-Nunito flex gap-3 ml-10 items-center font-extrabold text-3xl">
          <span><img width={50} src="https://cdn-icons-png.flaticon.com/512/957/957868.png"/></span>
          <p> Network</p>
         
          </div>

     

      <div className="flex justify-between mt-20  ">
         <div>
        <SidebarLeft />
      </div>
        
        {followingPosts.length === 0 ? (
          <p>No posts available from users you follow.</p>
        ) : (
          <div className='flex w-full px-32 gap-16 flex-col'>
            {followingPosts.map((post) => (
              <div className='CIL-post p-5' key={post.id}>
                <div className='CIL-post-items'>
                  <div className='flex flex-1 flex-col'>
                    <div className='flex justify-between top-part-post p-2'>
                      <div className='flex items-center gap-5'>
                        {/* Profile image */}
                        <div onClick={() => navigate(`/profile/${post.creator_username}`)}>  {/* Use navigate to go to user profile */}
                          <div className='bg-gradient'>
                            <div className='justify-center rounded-[11px] w-[59px] h-[59px] image-container img_border'>
                              <img
                                src={post.profile_pic || 'https://via.placeholder.com/50'}
                                className='rounded-md w-[50px] h-[50px] object-cover'
                                alt='Profile Pic'
                              />
                            </div>
                          </div>
                        </div>

                        <div className='items-start flex flex-col'>
                          <p>{post.creator_username}</p>
                          <p className='text-gray-400'>{new Date(post.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                      <img
                        width={35}
                        className='object-contain mr-5'
                        src='https://cdn-icons-png.flaticon.com/512/512/512142.png'
                        alt='Menu Icon'
                      />
                    </div>

                    <div className='p-5'>
                      <div className='post-text'>
                        <p>{post.content}</p>
                      </div>

                      {/* Bottom of post */}
                      <div className='mt-3 flex items-center gap-10'>
                        <div>
                          <Like post={post} />  {/* Include the Like component */}
                        </div>

                        <div className='flex gap-3 items-center'>
                          <img
                            width={35}
                            className='object-contain'
                            src='https://cdn-icons-png.flaticon.com/512/11820/11820052.png'
                            alt='Comment Icon'
                          />
                          <p>0</p>  {/* Display the comment count (currently static) */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        
      <div>
        <SidebarRight />
      </div>
      </div>

    </section>
  );
};

export default FollowingPosts;
