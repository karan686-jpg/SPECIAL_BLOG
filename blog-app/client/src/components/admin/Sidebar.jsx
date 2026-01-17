import React from 'react'
import { NavLink } from 'react-router-dom'

function Sidebar() {

  const navItems=[
    { path: '/admin', label: 'Dashboard'},
    { path: '/admin/add-blog', label: 'Add Blog'},
    { path: '/admin/Listblogs', label: 'List Blogs'},
    { path: '/admin/comments', label: 'Comments'}
  ]
  return (
    <div>
         {navItems.map((items)=>{
            return <NavLink
            to={items.path}
            label={items.label}
            key={items.path}
            className={({isActive})=>`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200 group ${isActive?"active-side":"side"}`}
        >{items.label}</NavLink>
        })}
    </div>
  )
}

export default Sidebar