import React from 'react'
import { useState } from 'react';
import { AppContext } from '../../../context/AppContext';
import { useContext } from 'react';
const Comment = ({id}) => {
      const{comment,setcomment}=useContext(AppContext);
       const [name,setname]=useState('');
         const [text,settext]=useState('');
        
     
  function handleSubmit(){
      if(text.trim()==='') return;
      
      setcomment((prev)=>({
        ...prev,
        [id]:[...(prev[id]|| []),{name,text}],
        

      }))
      setname("");
        settext("");
     }
  return (
    <div>
      <div className='CommentShow'>
        <p> the commens are: </p>
         {(comment[id]|| []).map((c,i)=>
      <div key={i}>{c.name}:{c.text}</div>)}

      </div>

    
    <div className='flex flex-col m-3 justify-center items-center'>
      <p className='mx-6'>Add your comment</p>

      <input className='input' placeholder='Name' onChange={(e)=>setname(e.target.value)} value={name} />

      <textarea className='textarea' value={text} placeholder='Comment' onChange={(e)=>settext(e.target.value)}></textarea>

      <button className='butt1 w-[15vh] flex ' onClick={handleSubmit}>Submit</button>

    </div>
    </div>
  )
}

export default Comment