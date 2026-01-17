import React, { useContext } from 'react'
import { AppContext } from '../../../context/AppContext'
import {  useNavigate } from 'react-router-dom'

const Logout = () => {
    const navigate=useNavigate();
    const{isAuth,token,settoken,setisAuth}=useContext(AppContext)
    const handleLogout=()=>{
        
        settoken(null);
        setisAuth(false);
        localStorage.removeItem('token');
        navigate('/login')
    }
    return (
    <div>
      <button onClick={handleLogout} className='butt1'>Logout</button>
    </div>
  )
}

export default Logout
