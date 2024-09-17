import React, { useEffect, useState } from 'react';

const SidebarRight = () => {
  const [profile, setProfile] = useState(null); 
  const [username, setUsername] = useState(localStorage.getItem('username')); // Get the username from localStorage
  const [error, setError] = useState(null); 

  // Fetch user profile after login
  useEffect(() => {
    if (!username) {
      setError('Username not found in localStorage');
      return;
    }

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');  // Get the JWT token from localStorage
        if (!token) {
          setError('No access token found, please log in again.');
          return;
        }

        const response = await fetch(`http://127.0.0.1:8000/api/profile/${username}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`  
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data); 
        } else {
          setError('Failed to fetch profile data: ' + response.statusText);
        }
      } catch (error) {
        setError('Error: ' + error.message);
      }
    };

    fetchProfile();
  }, [username]);

  // Check if there's an error
  if (error) {
    return <div>Error: {error}</div>; 
  }

  // Checking if profile data is available
  if (!profile) {
    return <div>Loading...</div>;  
  }


  return (
    <section className='  font-Nunito font-semibold text-lg  CIK-rightside' >
    <div className='  flex flex-col gap-10'>
 


 <div className=' flex items-center pb-5 pr-10 border-b-[#7575754c] border-b-[1px]  '>

 <div className="bg-gradient">
  <div className="justify-center rounded-[11px] w-[59px] h-[59px] image-container img_border">
    <img
    src={profile.profile_pic || 'https://img.freepik.com/premium-photo/portrait-beautiful-young-asian-woman-neon-light_1308175-55057.jpg'}
    className="rounded-md w-[50px] h-[50px] object-cover"
     />
     </div>
     </div>
  <div className=' ml-5'>
    <p>{profile.user || 'Username'}</p>
    <p className=' text-gray-400'>{profile.email || 'User@Email'}</p>
  </div>

 </div>

 <h3 className=' font-bold'>Suggested for You</h3>

 <div className=' flex items-center pr-10 '>

 <div className="bg-gradient">
  <div className="justify-center rounded-[11px] w-[59px] h-[59px] image-container img_border">
    <img
    src='https://img.freepik.com/free-photo/portrait-woman-…ts_23-2151626916.jpg'
    className="rounded-md w-[50px] h-[50px] object-cover"
     />
     </div>
     </div>
  <div className=' ml-5'>
    <p>Tyla</p>
    <p className=' text-gray-400' >tyla@gmail.com</p>
  </div>

 </div>

 <div className=' flex items-center pr-10'>

 <div className="bg-gradient">
  <div className="justify-center rounded-[11px] w-[59px] h-[59px] image-container img_border">
    <img
    src='https://img.freepik.com/premium-photo/medium-shot-woman-posing-with-orange-outfit_23-2150728981.jpg'
    className="rounded-md w-[50px] h-[50px] object-cover"
     />
     </div>
     </div>
  <div className=' ml-5'>
    <p>Jessica</p>
    <p className=' text-gray-400' >jess@gmail.com</p>
  </div>

 </div>
 {/*<div className=' flex items-center pr-10'>

 <div className="bg-gradient">
  <div className="justify-center rounded-[11px] w-[59px] h-[59px] image-container img_border">
    <img
    src='https://img.freepik.com/premium-photo/portrait-beautiful-young-asian-woman-neon-light_1308175-55057.jpg'
    className="rounded-md w-[50px] h-[50px] object-cover"
     />
     </div>
     </div>
  <div className=' ml-5'>
    <p>Username</p>
    <p>User@Email</p>
  </div>

 </div>*/}



</div>
 
   </section>
  )
}

export default SidebarRight