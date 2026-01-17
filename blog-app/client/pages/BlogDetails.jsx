import React from 'react'
import { useParams } from 'react-router-dom'
import { blogs } from '../src/assets/data';
import Navbar from '../src/components/Navbar';
import moment from "moment";
import { useNavigate } from 'react-router-dom';
import Comment from '../src/components/admin/Comment';
const BlogDetails = () => {
  const navigate=useNavigate();
   const {id}=useParams();
   const the_id=Number(id);
   const blog=blogs.find(b=> b.id===the_id)
   if(!blog) return <div>Nothing Found</div>

  return (
    <div>
      <Navbar/>
      <button className='back' onClick={()=>navigate(-1)}>Back</button>
    <div className='blog-card'>
      

          <div className=" flex items-center gap-2 text-xs text-gray-500 p-5">
         <span>📅</span>
          <span> {moment(blog.date).format("MMMM D, YYYY")} •  {blog.author}</span>
          </div>
        <img src={blog.image} alt={blog.title}/>
        <div>
        <div className='blog-category'>{blog.category}</div>
        <div className='blog-title'>{blog.title}</div>
        <div className='blog-description'>{blog.description}</div>
        <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

    </div>
        
        </div>
        <Comment id={the_id}/>
        </div>
        
      
        
  )
}

export default BlogDetails;