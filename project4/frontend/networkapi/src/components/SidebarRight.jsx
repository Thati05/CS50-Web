import React from 'react'

const SidebarRight = () => {
  return (
    <section className=' font-Nunito font-semibold text-lg  mr-5 CIK-rightside' >
    <div className=' flex flex-col gap-10'>
 
 <div className=' flex items-center side-item bg-[#F5F5F5]'>

    <img  width={30} height={30}  src='https://cdn-icons-png.flaticon.com/512/1946/1946436.png'/>
 
   
   <p className='ml-5'>Home</p>
 </div>

 <div className=' flex items-center side-item  '>
  <img  width={30} height={30} className=' object-contain'  src='https://cdn-icons-png.flaticon.com/512/10146/10146694.png'/>
  <p className='ml-5' >Discover</p>
 </div>

 <div className=' flex items-center side-item  '>
  <img  width={30} height={30} className=' object-contain'  src='https://cdn-icons-png.flaticon.com/512/542/542638.png'/>
  <p className='ml-5' >Messages</p>
 </div>

 <div className=' flex items-center side-item  '>
  <img  width={30} height={30} className=' object-contain'  src='https://cdn-icons-png.flaticon.com/512/10146/10146694.png'/>
  <p className='ml-5' >Profile</p>
 </div>

 <div className=' flex items-center side-item  '>
  <img  width={30} height={30} className=' object-contain'  src='https://cdn-icons-png.flaticon.com/512/10146/10146694.png'/>
  <p className='ml-5' >Friends</p>
 </div>


</div>
 
   </section>
  )
}

export default SidebarRight