import React from 'react'
import { userProfile } from '../constants'


const Header = () => {
  return (

    <section className=' '>

      
    <div className=' flex justify-between items-center p-10'>
      <div className=' font-Nunito font-extrabold text-3xl' >
        Network
      </div>
      <div className=' flex gap-7 items-center'>
        <img width={20} src='https://cdn-icons-png.flaticon.com/512/2040/2040504.png'/>
        <img width={20} src='https://cdn-icons-png.flaticon.com/512/3239/3239952.png'/>

      </div>
     </div>

     {/*Profile */}

    <div className=' flex justify-center items-center mb-5  '>
<div className=' flex items-center justify-between gap-24'>

    { userProfile.map((profile) => (
        <div className='justify-center rounded-xl w-[80px] h-[74px]  image-container img_border'>

<img className='rounded-md  w-[60px] h-[53px] object-cover' key={profile.alt} src={profile.src} alt={profile.alt}/>


      
      </div>
    ))}
 


</div>

    </div>

    </section>

  
  )
}

export default Header