import React, { useState, useEffect } from 'react';
import CreatePost from './CreatePost';
import axiosInstance from '../axios';
import Like from './Like';
import { Link } from 'react-router-dom';

const Posts = ({ posts, next, previous, count }) => {
  const [currentPosts, setCurrentPosts] = useState(posts);
  const [nextPage, setNextPage] = useState(next); 
  const [prevPage, setPrevPage] = useState(previous);
  const [currentPage, setCurrentPage] = useState(1); 
  const postsPerPage = 2;  // Number of posts per page (must match with our API settings)
  const totalPages = Math.ceil(count / postsPerPage);  

  useEffect(() => {
    setCurrentPosts(posts);
    setNextPage(next);
    setPrevPage(previous);
  }, [posts, next, previous]);

  // Function to fetch posts by page number
  const fetchPaginatedPosts = async (pageNumber) => {
    const url = `http://127.0.0.1:8000/api/?page=${pageNumber}`;  
    try {
      const response = await axiosInstance.get(url);  // Fetch the paginated posts
      setCurrentPosts(response.data.results);  
      setNextPage(response.data.next);  
      setPrevPage(response.data.previous); 
      setCurrentPage(pageNumber); 
    } catch (error) {
      console.error('Error fetching paginated posts:', error);
    }
  };

  // Handle page number change
  const handlePageChange = (pageNumber) => {
    fetchPaginatedPosts(pageNumber);  // Fetch the posts for the selected page number
  };

  // If there are no posts, show a message
  if (!currentPosts || currentPosts.length === 0) {
    return <p>Cannot find any posts, sorry!</p>;
  }

  return (
    <section className='font-Nunito font-semibold text-lg CIK-posts'>
      <div className='text-xl mb-10 mt-10 font-Nunito flex justify-center gap-40'>
        <button className='btn-CIK'>All Posts</button>
        <Link to='/following' >
          <button>Following</button>
        </Link>
      
      </div>

      <div className='flex-col flex justify-center px-20'>
        <div className='mb-7'>
          <CreatePost />
        </div>

        {/* Display Posts */}
        <div className='flex gap-16 flex-col'>
          {currentPosts.map((post) => (
            <div className='CIL-post p-5' key={post.id}>
              <div className='CIL-post-items'>
                <div className='flex flex-1 flex-col'>
                  <div className='flex justify-between top-part-post p-2'>
                    <div className='flex items-center gap-5'>
                      {/* Profile image */}
                      <Link to={`profile/${post.creator_username}`} >
                       <div className='bg-gradient'>
                        <div className='justify-center rounded-[11px] w-[59px] h-[59px] image-container img_border'>
                          <img
                            src={post.profile_pic || 'https://via.placeholder.com/50'}
                            className='rounded-md w-[50px] h-[50px] object-cover'
                            alt='Profile Pic'
                          />
                        </div>
                      </div>
                      </Link>
                     

                      <div className='items-start flex flex-col'>
                        <p>{post.creator_username}</p>
                        <p className='text-gray-400'>{new Date(post.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                    <img width={35} className='object-contain mr-5' src='https://cdn-icons-png.flaticon.com/512/512/512142.png' alt='Menu Icon' />
                  </div>

                  <div className='p-5'>
                    <div className='post-text'>
                      <p>{post.content}</p>
                    </div>

                    {/* Bottom of post */}
                    <div className='mt-3 flex items-center gap-10'>
                      <div key={post.id} >
                        <Like post={post} />
                       </div>

                      <div className='flex gap-3 items-center'>
                        <img width={35} className='object-contain' src='https://cdn-icons-png.flaticon.com/512/11820/11820052.png' alt='Comment Icon' />
                        <p>0</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className='pagination flex justify-between items-center py-5'>
          {/* Previous Button */}
          <div>
             <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!prevPage}
            className=' active:bg-gray-100 rounded-full items-center '
          >
            <img width={30} src='https://cdn-icons-png.flaticon.com/512/2989/2989985.png'/>
          </button>

          </div>


          <div>
             {/* Display Current Page and Total Pages */}
          <span className=' text-gray-500'>
            {currentPage} of {totalPages}
          </span>
          </div>
         
         <div>
            {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!nextPage}
            className=' active:bg-gray-100 rounded-full items-center '
          >
           <img width={30} src='https://cdn-icons-png.flaticon.com/128/2989/2989988.png'/>
          </button>
         </div>
         

        
        </div>
      </div>
    </section>
  );
};

export default Posts;
