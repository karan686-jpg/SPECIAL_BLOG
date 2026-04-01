import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-hot-toast";
import { AppContext } from "../../context/AppContext";

const Comments_admin = () => {
  const { axios } = useContext(AppContext);
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const { data } = await axios.get("/api/admin/comments");
      if (data.success) {
        setComments(data.comments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching comments", error);
      toast.error(error.message);
    }
  };

  const removeComment = async (id) => {
    try {
      const { data } = await axios.post("/api/admin/delete-comment", { id });
      if (data.success) {
        toast.success(data.message);
        fetchComments();
      } else {
        toast.error(data.message || "Error deleting comment");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting comment");
    }
  };

  const approveComment = async (id) => {
    try {
      const { data } = await axios.post("/api/admin/approve-comment", { id });
      if (data.success) {
        toast.success(data.message);
        fetchComments();
      } else {
        toast.error(data.message || "Error approving comment");
      }
    } catch (error) {
      toast.error("Error approving comment");
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16">
      <h1 className="text-2xl font-semibold mb-4">All Comments</h1>

      <div className="relative overflow-x-auto mt-4 border border-gray-200">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Author
              </th>
              <th scope="col" className="px-6 py-3">
                Blog Title
              </th>
              <th scope="col" className="px-6 py-3">
                Comment
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {comments.map((item, index) => {
              return (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {item.name ? item.name : "Anonymous"}
                  </td>
                  <td className="px-6 py-4">
                    {item.blog?.title ? item.blog.title : "Unknown Blog"}
                  </td>
                  <td className="px-6 py-4">{item.content}</td>
                  <td className="px-6 py-4">
                    {new Date(item.createdAt).toDateString()}
                  </td>
                  <td className="px-6 py-4 flex gap-3">
                    {!item.isApproved && (
                      <span
                        className="cursor-pointer text-green-600 font-semibold"
                        onClick={() => approveComment(item._id)}
                      >
                        ✓
                      </span>
                    )}
                    <span
                      className="cursor-pointer text-red-500 font-semibold"
                      onClick={() => removeComment(item._id)}
                    >
                      ✕
                    </span>
                  </td>
                </tr>
              );
            })}
            {comments.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                  No comments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Comments_admin;
