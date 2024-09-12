import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Header from './components/Header.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";  

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Header/>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<App/>}/>
    
    </Routes>
    
    </BrowserRouter>
   
  </StrictMode>,
)