import React, { useContext, useEffect, useState } from "react";
import { FileText, MessageSquare, FileEdit, XCircle } from "lucide-react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const Dashboard = () => {
  const { axios } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState({
    blogs: 0,
    comments: 0,
    drafts: 0,
    recentBlogs: [],
  });

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get("/api/admin/dashboard");
      if (data.success) {
        setDashboardData(data.dashboardData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const { blogs, comments, drafts, recentBlogs } = dashboardData;

  const stats = [
    {
      label: "Blogs",
      value: blogs,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Comments",
      value: comments,
      icon: MessageSquare,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
    },
    {
      label: "Drafts",
      value: drafts,
      icon: FileEdit,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:scale-[1.02]"
          >
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
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentBlogs.map((blog, index) => (
                <tr
                  key={blog._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-500 font-medium">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-gray-800 font-medium">
                    {blog.title}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${blog.isPublished ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                    >
                      {blog.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                </tr>
              ))}
              {recentBlogs.length === 0 && (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    No blogs yet. Start writing!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
