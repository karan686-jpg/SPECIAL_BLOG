import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { AppContext } from '../../context/AppContext'
import Login from './admin/Login'
import '../App.css';
import Logout from './admin/Logout'

 const Navbar = () => {
  const navigate=useNavigate();
  const {token,isAuth}=useContext(AppContext);


  return (
    <nav className='navbar'>
    <div className='btn-home'>Blogify</div>
    
    <div className='flex'>
      {isAuth&& <button className='butt mx-1.5' onClick={()=>navigate('/admin')}>Admin</button>}
    {!isAuth && <Link to='/login' className='butt2'>Login</Link>}
    {isAuth && <Logout/>}
    </div>
    </nav>
  )
}
export default Navbar