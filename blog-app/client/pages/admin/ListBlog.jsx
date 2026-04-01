import React, { useContext, useEffect, useState } from "react";
import { FileText } from "lucide-react";
import BlogTableItem from "../../src/components/admin/BlogTableItem";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";
const ListBlog = () => {
  // Mock data
  const [blogs, setblogs] = useState([]);
  const { axios } = useContext(AppContext);

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.post("/api/blog/delete", { id });
      if (data.success) {
        toast.success("Blog deleted");
        fetchBlogs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUnpublish = async (id) => {
    try {
      const { data } = await axios.post("/api/blog/toggle-publish", { id });
      if (data.success) {
        toast.success(data.message);
        fetchBlogs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get("/api/admin/blogs");
      data.success ? setblogs(data.blogs) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    fetchBlogs();
  }, []);
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
          Total:{" "}
          <span className="font-semibold text-gray-800">{blogs.length}</span>
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
  );
};
export default ListBlog;
