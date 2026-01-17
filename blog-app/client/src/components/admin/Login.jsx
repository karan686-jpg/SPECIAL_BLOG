import React from 'react'
import { AppContext } from '../../../context/AppContext'
import { useContext } from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css'
const Login = () => {
  const {isAuth,setisAuth}= useContext(AppContext);
   const {settoken}=useContext(AppContext)
   const navigate=useNavigate();

  function handleLogin(){
    const faketoken='guruji'
     if(!isAuth){
      
      setisAuth(true);
      localStorage.setItem('token',faketoken)
      settoken(faketoken);
      navigate('/admin');
     }
  }
  
  return (
    <div className='flex justify-center items-center'>
      <button className='butt' onClick={handleLogin}>Login</button>
    </div>
  )
}

export default Login
