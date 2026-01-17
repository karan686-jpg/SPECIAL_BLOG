import React from 'react'
import { FileText, MessageSquare, FileEdit, Trash2, XCircle } from 'lucide-react'
const Dashboard = () => {
  // Mock data
  const stats = [
    { label: 'Blogs', value: 10, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Comments', value: 2, icon: MessageSquare, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'Drafts', value: 0, icon: FileEdit, color: 'text-purple-600', bg: 'bg-purple-100' },
  ]
  const latestBlogs = [
    { id: 1, title: 'The Rise of Artificial Intelligence in Modern Technology' },
    { id: 2, title: 'Importance of Tourism' },
    { id: 3, title: 'The New Way of Study' },
    { id: 4, title: 'Taxes on Luxury Houses' },
  ]
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:scale-[1.02]">
            <div className={`p-4 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
              <p className="text-gray-500 font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Latest Blogs Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-800">Latest Blogs</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4 w-full">Blog Title</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {latestBlogs.map((blog, index) => (
                <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-500 font-medium">{index + 1}</td>
                  <td className="px-6 py-4 text-gray-800 font-medium">{blog.title}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <button className="px-4 py-1.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-800 transition-colors">
                        Unpublish
                      </button>
                      <button className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Delete">
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
export default Dashboard