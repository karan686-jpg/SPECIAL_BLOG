import React, { useEffect, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Eye,
  Heart,
  MessageSquare,
  BookOpen,
  TrendingUp,
  Award,
  ArrowUpRight,
  RotateCw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

import Navbar from "../src/components/Navbar";
import { AppContext } from "../context/AppContext";

const Analytics = () => {
  const { axios, isAuth, user } = useContext(AppContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const res = await axios.get("/api/blog/user/analytics");
      if (res.data.success) {
        setData(res.data.analytics);
      } else {
        toast.error(res.data.message || "Failed to load analytics");
      }
    } catch {
      toast.error("Error fetching analytics");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [axios]);

  useEffect(() => {
    if (!isAuth) {
      toast.error("Please log in to view publisher analytics");
      navigate("/auth");
      return;
    }
    const timer = window.setTimeout(() => {
      void fetchAnalytics();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [isAuth, navigate, fetchAnalytics]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium">
            Loading analytics dashboard...
          </p>
        </div>
      </div>
    );
  }

  const viewsTrendData = data?.viewsTrend7d || [];
  const engagementData = data?.engagementBreakdown || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header Title & Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Real-Time Performance</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Author Studio Analytics
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Welcome back, {user?.name || "Author"}! Tracking views, reader
              engagement, and traffic momentum.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchAnalytics}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              <RotateCw
                className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span>{isRefreshing ? "Refreshing..." : "Refresh Data"}</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/create-blog")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition cursor-pointer"
            >
              <span>Write Story</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4-Card Performance Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Views Card */}
          <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800/80 rounded-2xl shadow-xs transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Total Views
              </span>
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <Eye className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-3">
              {data?.totalViews || 0}
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mt-1">
              Cumulative readers across posts
            </p>
          </div>

          {/* Total Likes Card */}
          <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800/80 rounded-2xl shadow-xs transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Total Likes
              </span>
              <div className="p-2.5 rounded-xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400">
                <Heart className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-3">
              {data?.totalLikes || 0}
            </p>
            <p className="text-xs text-pink-600 dark:text-pink-400 font-medium mt-1">
              Reader appreciations & hearts
            </p>
          </div>

          {/* Total Comments Card */}
          <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800/80 rounded-2xl shadow-xs transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Discussions
              </span>
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-3">
              {data?.totalComments || 0}
            </p>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1">
              Active feedback & threaded replies
            </p>
          </div>

          {/* Blogs Written Card */}
          <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800/80 rounded-2xl shadow-xs transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Stories
              </span>
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-3">
              {data?.totalBlogs || 0}
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
              Articles published or drafted
            </p>
          </div>
        </div>

        {/* Interactive Recharts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart 1: 7-Day Views Trend (AreaChart) */}
          <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-base text-gray-900 dark:text-white">
                  7-Day Views & Traffic Trend
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Daily reader visits over the past week
                </p>
              </div>
              <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                Live Daily Trend
              </span>
            </div>

            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={viewsTrendData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="viewsColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                    className="dark:stroke-gray-800"
                  />
                  <XAxis
                    dataKey="date"
                    stroke="#9ca3af"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    fontSize={11}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(17, 24, 39, 0.95)",
                      borderColor: "rgba(139, 92, 246, 0.4)",
                      borderRadius: "0.75rem",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#viewsColor)"
                    name="Views"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Likes vs Comments Breakdown (BarChart) */}
          <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-base text-gray-900 dark:text-white">
                  Engagement Breakdown
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Comparison of Likes vs Comments per article
                </p>
              </div>
              <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                Story Metrics
              </span>
            </div>

            <div className="w-full h-64">
              {engagementData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-xs text-gray-400">
                  Publish articles to see engagement breakdown
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={engagementData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                      className="dark:stroke-gray-800"
                    />
                    <XAxis
                      dataKey="name"
                      stroke="#9ca3af"
                      fontSize={11}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#9ca3af"
                      fontSize={11}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(17, 24, 39, 0.95)",
                        borderColor: "rgba(99, 102, 241, 0.4)",
                        borderRadius: "0.75rem",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                    />
                    <Bar
                      dataKey="likes"
                      fill="#ec4899"
                      name="Likes"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="comments"
                      fill="#6366f1"
                      name="Comments"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Spotlight: Most Popular Story Card */}
        {data?.mostPopularBlog && (
          <div className="p-6 sm:p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 font-bold text-sm text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-4">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Top Performing Story</span>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <img
                src={data.mostPopularBlog.image}
                alt="popular story"
                className="w-full md:w-56 h-36 object-cover rounded-xl shadow-sm border border-gray-100 dark:border-gray-800"
              />

              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900">
                  {data.mostPopularBlog.category || "Featured"}
                </span>

                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-2 truncate">
                  {data.mostPopularBlog.title}
                </h3>

                {data.mostPopularBlog.subtitle && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {data.mostPopularBlog.subtitle}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-semibold">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{data.mostPopularBlog.views} Views</span>
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 text-xs font-semibold">
                    <Heart className="w-3.5 h-3.5" />
                    <span>{data.mostPopularBlog.likes?.length || 0} Likes</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => navigate(`/blog/${data.mostPopularBlog._id}`)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline ml-auto cursor-pointer"
                  >
                    <span>View Article</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Analytics;
