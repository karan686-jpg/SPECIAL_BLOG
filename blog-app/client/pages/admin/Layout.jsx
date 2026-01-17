import React from 'react'
import { Outlet } from 'react-router-dom';
import Navbar from '../../src/components/Navbar'
import Sidebar from '../../src/components/admin/Sidebar'
const Layout = () => {
  return (
    <div>
    <Navbar/>
    <div className='flex h-[88vh]'>
      
      <aside className='sm:w-[80px] md:w-[200px] lg:w-[320px] bg-[#fff] border-2 border-pink-500 rounded-lg text-pink-500 p-4'><Sidebar/></aside>

      <main className='flex-1 p-6'> <Outlet/></main>
      
    </div>
    </div>
  )
}

export default Layout;
