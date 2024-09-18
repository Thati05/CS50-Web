import React, {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import axiosInstance from '../axios'

const Logout = () => {
  const navigate = useNavigate()

useEffect(() => {

  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('username');
  axiosInstance.defaults.headers["Authorization"] = null;

  navigate('/')

})


  return (
    <div>Logout out...</div>
  )
}

export default Logout