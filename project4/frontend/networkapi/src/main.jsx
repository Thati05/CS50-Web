import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import Register from './components/Register.jsx';
import './index.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
     
      <div className="flex justify-center">
      
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/register" element={<Register />} />
        </Routes>
       
      </div>
    </BrowserRouter>
  </StrictMode>
);
