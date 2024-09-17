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


  <div className=' flex-col  flex justify-center px-20 '>

    <div className=' mb-7'>
<CreatePost/>
    </div>

       
       <div className=' flex gap-16 flex-col'>
             {posts.map((post) => (
<div className=' CIL-post  p-5'>

 <div className='CIL-post-items'>
             <div className=' flex flex-1 flex-col '>

              <div className=' flex justify-between top-part-post p-2'>

                <div className=' flex items-center gap-5'>
                  {/*img-code */}

                  <div className="bg-gradient">
             <div className="justify-center rounded-[11px] w-[59px] h-[59px] image-container img_border">
              <img
    src='https://img.freepik.com/premium-photo/portrait-beautiful-young-asian-woman-neon-light_1308175-55057.jpg'
    className="rounded-md w-[50px] h-[50px] object-cover"
     />
     </div>
     </div>
                 
                 
                 
                 
                  <div className=' items-start flex flex-col'>
                    <p key={post.id}>{post.creator_username}</p>
                    <p key={post.id} className=' text-gray-400'>{post.created_at}</p>
                  </div>

                </div>
                 <img width={35}  className=' object-contain mr-5' src='https://cdn-icons-png.flaticon.com/512/512/512142.png' />

              </div>

              <div className=' p-5'>
                <div className='post-text '>
                <p key={post.id}>{post.content}</p>
                </div>
                

                   {/*bottom of post */}

              <div className=' mt-3 flex items-center gap-10'>

                <div className=' flex gap-3 items-center'>
                <img width={35} className=' object-contain' src='https://cdn-icons-png.flaticon.com/512/2589/2589197.png'/>
                <p key={post.id}>{post.like_count}</p>  
                </div>

                <div className=' flex gap-3 items-center'>
                <img width={35} className=' object-contain' src='https://cdn-icons-png.flaticon.com/512/11820/11820052.png'/>
                <p>0</p>  
                </div>

                
              </div>
              </div>

             
            

             </div>

        </div>
         </div>
      ))}
       </div>

      


     
  
 
    </div>
 
   </section>
  );
};

export default Posts;

