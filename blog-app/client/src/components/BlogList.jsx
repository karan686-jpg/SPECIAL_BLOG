import React, { useContext } from 'react'
import BlogCard from './BlogCard'
import { blogs } from '../assets/data'
import { useState } from 'react'
import { AppContext } from '../../context/AppContext'
const BlogList = () => {
    const[list,setlist]=useState('All');
    let newblog=blogs;
    if(list!='All'){
         newblog=blogs.filter(b=>b.category===list);
    }
    const {search,setsearch}=useContext(AppContext)

    if(search.trim()!=''){
        newblog=newblog.filter(
            b=>
                b.title.toLocaleLowerCase().includes(search.trim().toLowerCase())||b.description.toLocaleLowerCase().includes(search.trim().toLowerCase())
            
        )
    }
   


  return (
    <div>
        <input className='search'placeholder='search' value={search}  onChange={(e)=>{setsearch(e.target.value)}}   />
   
        <div className=' flex justify-center'>
            <button className='butt-3' onClick={()=>{setlist('All')}}>All</button>
            <button className='butt-3' onClick={()=>{setlist('Technology')}}>Technology</button>
            <button className='butt-3' onClick={()=>{setlist('Startup')}}>Startup</button>
            <button className='butt-3' onClick={()=>{setlist('Lifestyle')}}>Lifestyle</button>
            <button className='butt-3' onClick={()=>{setlist('Finance')}}>Finance</button>
            
        </div>
        
            
        

    <div className='blog-grid'>
      {newblog.map((b)=>{
       return <BlogCard id={b.id} blog={b}/>
      })}
    </div>
    </div>
  )
}

export default BlogList
