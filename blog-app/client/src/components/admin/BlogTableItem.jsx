import React from 'react'
import { XCircle } from 'lucide-react'
const BlogTableItem = ({ blog, index, onUnpublish, onDelete }) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 text-gray-500 font-medium">{index + 1}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
            {blog.image && <img src={blog.image} alt={blog.title} className="w-10 h-10 rounded object-cover" />}
            <span className="text-gray-800 font-medium">{blog.title}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-500">{blog.author || 'Admin'}</td>
      <td className="px-6 py-4 text-gray-500">{blog.date || 'Oct 24, 2024'}</td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-3">
          <button 
            onClick={() => onUnpublish(blog.id)}
            className="px-4 py-1.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-800 transition-colors"
          >
            Unpublish
          </button>
          <button 
            onClick={() => onDelete(blog.id)}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors" 
            title="Delete"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      </td>
    </tr>
  )
}
export default BlogTableItem