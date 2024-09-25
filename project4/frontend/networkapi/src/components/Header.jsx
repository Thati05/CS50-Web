// src/components/Header.js
import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { userProfile } from "../constants"; // Ensure proper import




const Header = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() =>{
    //We are going to chech if the user is authenticated by cheking the JWT token
     
    const token = localStorage.getItem('access_token');
      if (token){
        setIsAuthenticated(true)
      }
    

  }, [])



  return (
    <section className=" font-Nunito">
      <div className="flex justify-between items-center p-10">
        <div className="font-Nunito flex gap-3 items-center font-extrabold text-3xl">
          <span><img width={50} src="https://cdn-icons-png.flaticon.com/512/957/957868.png"/></span>
          <p> Network</p>
         
          </div>
       <div className="flex gap-7 items-center">
           {isAuthenticated ? (
            
        <>
           {/* If the user is authenticated then display this: */}
            <img
            width={20}
            src="https://cdn-icons-png.flaticon.com/512/2040/2040504.png"
            alt="User"
          />
          <img
            width={20}
            src="https://cdn-icons-png.flaticon.com/512/3239/3239952.png"
            alt="Notifications"
          />
          <button className="CIK-btn_black" >
            <div className="JC-btn_contain" >
                <Link to='/logout'>Logout</Link>
            </div>
            
          </button>
        
          
        </>
          ):(
            
          
          <> 
            {/*Else if the user is not authenticated then display this: */}

            <button className="CIK-btn_black" >
            <div className="JC-btn_contain" >
             <Link to="/register">Sign Up</Link>
            </div>
             
           </button>
          
          
           <button className="CIK-btn_black"  >
            <div className="JC-btn_contain" >
              <Link to="/login">Login</Link>
            </div>
             
           </button>
         
          
          </>
        
        )}
       
        
        </div>
      </div>

      {/* Profile Section */}
 {/*When the user has logged display the profile section  */}
      {isAuthenticated ? (  
             <div className="justify-center mt-5 items-center mb-24 px-5">
        <div className="flex items-center  justify-between gap-[98px]">
          {userProfile.map((profile) => (
            <div key={profile.alt}>
              <div className="bg-gradient">
                <div className="justify-center rounded-[11px] w-[69px] h-[69px] image-container img_border">
                  <img
                    className="rounded-md w-[60px] h-[60px] object-cover"
                    src={profile.src}
                    alt={profile.alt}
                  />
                </div>
              </div>
              <p className="pt-3 font-Nunito font-semibold text-center">
                {profile.name}
              </p>
            </div>
          ))}
        </div>
      </div>) :(

        <div className=" hidden"></div>
      )

      
      
      }
     




    </section>
  );
};

export default Header;
