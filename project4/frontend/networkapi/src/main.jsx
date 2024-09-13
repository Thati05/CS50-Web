import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Header from './components/Header.jsx'
import SidebarLeft from './components/SidebarLeft.jsx'
import SidebarRight from './components/SidebarRight.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";  

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Header/>
    <div className=' flex justify-between' >
      <SidebarLeft/>
      <BrowserRouter>
    <Routes>
      <Route path='/' element={<App/>}/>
    
    </Routes>
    
    </BrowserRouter>
    <SidebarRight/>
   
    </div>
    
  </StrictMode>,
)
