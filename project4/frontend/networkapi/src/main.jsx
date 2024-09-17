import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import Register from './components/Register.jsx';
import './index.css';
import Login from './components/Login.jsx';
import Logout from './components/Logout.jsx';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
     
      <div className="">
      
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/register" element={<Register />} />
          <Route path='/login' element={<Login/>} />
          <Route path='/logout' element={<Logout/>} />
        </Routes>
       
      </div>
    </BrowserRouter>
  </StrictMode>
);
