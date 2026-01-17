import React from 'react'
import { FileText } from 'lucide-react'
 import BlogTableItem from '../../src/components/admin/BlogTableItem'
const ListBlog = () => {
  // Mock data
  const blogs = [
    { id: 1, title: 'The Rise of Artificial Intelligence in Modern Technology', author: 'Alex Doe', date: 'Jan 15, 2026' },
    { id: 2, title: 'Importance of Tourism', author: 'Sarah Smith', date: 'Jan 14, 2026' },
    { id: 3, title: 'The New Way of Study', author: 'John Brown', date: 'Jan 12, 2026' },
    { id: 4, title: 'Taxes on Luxury Houses', author: 'Emily White', date: 'Jan 10, 2026' },
    { id: 5, title: 'Future of Space Exploration', author: 'David Wilson', date: 'Jan 08, 2026' },
    { id: 6, title: 'Healthy Eating Habits', author: 'Lisa Green', date: 'Jan 05, 2026' },
  ]
  const handleUnpublish = (id) => {
    console.log('Unpublish blog:', id)
  }
  const handleDelete = (id) => {
    console.log('Delete blog:', id)
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 rounded-lg">
                <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">All Blogs</h1>
        </div>
        <div className="text-sm text-gray-500">
            Total: <span className="font-semibold text-gray-800">{blogs.length}</span>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4 w-1/3">Blog Title</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {blogs.map((blog, index) => (
                <BlogTableItem 
                    key={blog.id} 
                    blog={blog} 
                    index={index} 
                    onUnpublish={handleUnpublish}
                    onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
export default ListBlog