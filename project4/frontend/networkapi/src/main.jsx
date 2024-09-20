import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import Register from './components/Register.jsx';
import './index.css';
import Login from './components/Login.jsx';
import Logout from './components/Logout.jsx';
import Profile from './components/Profile.jsx';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FollowingPosts from './components/FollowingPosts.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
     
      <div className="">
      
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/register" element={<Register />} />
          <Route path='/login' element={<Login/>} />
          <Route path='/logout' element={<Logout/>} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path='/following' element={<FollowingPosts/>} />
        </Routes>
       
      </div>
    </BrowserRouter>
  </StrictMode>
);
