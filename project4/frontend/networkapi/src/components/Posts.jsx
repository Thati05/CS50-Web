import React from 'react';

const Posts = (props) => {
  const { posts } = props;
  if (!posts || posts.length === 0) return <p>Can not find any posts, Sorry!</p>;

  return (
    <section className=' font-Nunito font-semibold text-lg   CIK-posts' >
    
    
    <div className=' text-xl mb-20 mt-10 font-Nunito flex justify-center gap-40  '>
      <button className='btn-CIK '>
        All Posts
      </button>
      <button>
        Following
      </button>
      </div>


  <div className=' flex'>
       <div className=' items-start'>
         {posts.map((post) => (
        <p key={post.id}>{post.content}</p>
      ))}
      </div>
  
 
    </div>
 
   </section>
  );
};

export default Posts;

