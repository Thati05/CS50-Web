import React from 'react';
import CreatePost from './CreatePost';


const Posts = (props) => {
  const { posts } = props;
  if (!posts || posts.length === 0) return <p>Can not find any posts, Sorry!</p>;

  return (
    <section className=' font-Nunito font-semibold text-lg  CIK-posts' >
    
    
    <div className=' text-xl mb-10 mt-10 font-Nunito flex justify-center gap-40  '>
      <button className='btn-CIK '>
        All Posts
      </button>
      <button>
        Following
      </button>
      </div>


  <div className=' flex-col text-center flex justify-center px-20 '>
    <div>
<CreatePost/>
    </div>
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

