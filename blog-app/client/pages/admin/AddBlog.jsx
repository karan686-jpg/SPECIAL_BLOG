import React from 'react'

const AddBlog = () => {
  const url='https://www.lifewire.com/thmb/TRGYpWa4KzxUt1Fkgr3FqjOd6VQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/cloud-upload-a30f385a928e44e199a62210d578375a.jpg'
  return (
    <div className='flex flex-col '>
      <div>Upload thumbnail</div>
      <img className='max-h-[10vh] max-w-[10vh]' src={url} alt='upload'></img>
      <div>Blog title</div>
      <input className='search max-w-[60vh]' placeholder='Type here'/>

      <div>Sub title</div>
      <input className='search max-w-[60vh]' placeholder='Type here'/>

      <div>Blog Description</div>
      <textarea></textarea>

      <div>Blog Category</div>
      <select>
        <option></option>
      </select>

     

      
    </div>
  )
}

export default AddBlog