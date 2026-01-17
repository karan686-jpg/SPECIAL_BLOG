import React from 'react'
import { Link } from 'react-router-dom'
// import { blogs } from '../assets/data'
// import BlogList from './BlogList'
const BlogCard = ({blog,id}) => {
    
  return (
    <Link to={`/blog/${id}`} >
    <div className='blog-card'>
        
        <img className='blog-image' src={blog.image} alt={blog.title}/>
        <div>
        <div className='blog-category'>{blog.category}</div>
        <div className='blog-title'>{blog.title}</div>
        <div className='blog-description'>{blog.description}</div>
        
        </div>
      
    </div>
    </Link>
  )
}

export default BlogCard
