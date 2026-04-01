import React, { useEffect, useState, useContext } from "react";
import Navbar from "../src/components/Navbar";
import { AppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Analytics = () => {
  const { axios, isAuth, user } = useContext(AppContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) {
      toast.error("Please log in to view analytics");
      navigate("/auth");
      return;
    }

    const fetchAnalytics = async () => {
      try {
        const res = await axios.get("/api/blog/user/analytics");
        if (res.data.success) {
          setData(res.data.analytics);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        toast.error("Error fetching analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [isAuth, navigate]);

  if (loading)
    return (
      <div>
        <Navbar />
        <div className="p-10 text-center">Loading...</div>
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">Publisher Analytics</h1>
        <p className="text-gray-600 mb-8">
          Welcome back, {user?.name || "Publisher"}! Here is how your content is
          performing.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-center items-center">
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">
              Total Views
            </p>
            <p className="text-4xl font-bold text-purple-600">
              {data?.totalViews || 0}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-center items-center">
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">
              Total Likes
            </p>
            <p className="text-4xl font-bold text-pink-500">
              {data?.totalLikes || 0}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-center items-center">
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">
              Blogs Written
            </p>
            <p className="text-4xl font-bold text-blue-500">
              {data?.totalBlogs || 0}
            </p>
          </div>
        </div>

        {data?.mostPopularBlog && (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
              Your Most Popular Blog
            </h2>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <img
                src={data.mostPopularBlog.image}
                alt="popular"
                className="w-full md:w-48 h-32 object-cover rounded"
              />
              <div>
                <h3 className="text-2xl font-bold text-purple-600">
                  {data.mostPopularBlog.title}
                </h3>
                <p className="text-gray-600 mt-2">
                  {data.mostPopularBlog.subtitle}
                </p>
                <div className="flex gap-4 mt-4">
                  <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    Views: {data.mostPopularBlog.views}
                  </span>
                  <span className="bg-pink-100 text-pink-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    Likes: {data.mostPopularBlog.likes.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
