import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  UserPlus,
  UserCheck,
  Globe,
  Twitter,
  Github,
  BookOpen,
  Eye,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Navbar from "../src/components/Navbar";
import ArticleCard from "../src/components/ArticleCard";
import { AppContext } from "../context/AppContext";

const AuthorProfile = () => {
  const { authorName } = useParams();
  const navigate = useNavigate();
  const { blogs } = useContext(AppContext);

  const [isFollowing, setIsFollowing] = useState(false);

  // Filter all blogs by this author
  const decodedName = decodeURIComponent(authorName || "Staff Writer");
  const authorBlogs = (blogs || []).filter(
    (b) => (b.authorName || "Staff Writer").toLowerCase() === decodedName.toLowerCase()
  );

  const totalViews = authorBlogs.reduce((acc, b) => acc + (b.views || 0), 0);

  const handleFollow = () => {
    setIsFollowing((prev) => !prev);
    toast.success(isFollowing ? `Unfollowed ${decodedName}` : `Now following ${decodedName}!`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <Helmet>
        <title>{decodedName} - Author Profile | Blogify</title>
      </Helmet>
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Back navigation */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-8 transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        {/* Author Header Card */}
        <div className="pb-10 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-gray-900 to-gray-700 dark:from-gray-700 dark:to-gray-500 flex items-center justify-center text-white font-extrabold text-3xl shadow-sm">
              {(decodedName || "A")[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                {decodedName}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Writer, software thinker, and contributor on Blogify.
              </p>

              {/* Social links */}
              <div className="flex items-center gap-3 mt-3 text-gray-400">
                <a href="#" className="hover:text-gray-700 dark:hover:text-gray-200 transition">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="hover:text-gray-700 dark:hover:text-gray-200 transition">
                  <Github className="w-4 h-4" />
                </a>
                <a href="#" className="hover:text-gray-700 dark:hover:text-gray-200 transition">
                  <Globe className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          <button
            onClick={handleFollow}
            type="button"
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2 ${
              isFollowing
                ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 shadow-xs"
            }`}
          >
            {isFollowing ? (
              <>
                <UserCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Following</span>
              </>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5" />
                <span>Follow Author</span>
              </>
            )}
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 py-6 border-b border-gray-100 dark:border-gray-800 text-center">
          <div>
            <span className="block text-xl font-bold text-gray-900 dark:text-white font-mono">
              {authorBlogs.length}
            </span>
            <span className="text-xs text-gray-400">Published Stories</span>
          </div>
          <div>
            <span className="block text-xl font-bold text-gray-900 dark:text-white font-mono">
              {totalViews}
            </span>
            <span className="text-xs text-gray-400">Total Reads</span>
          </div>
          <div>
            <span className="block text-xl font-bold text-gray-900 dark:text-white font-mono">
              {isFollowing ? "142" : "141"}
            </span>
            <span className="text-xs text-gray-400">Followers</span>
          </div>
        </div>

        {/* Published Stories by Author */}
        <section className="mt-10">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-6">
            Stories by {decodedName}
          </h3>

          {authorBlogs.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No stories published by this author yet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800/80">
              {authorBlogs.map((b) => (
                <ArticleCard key={b._id} blog={b} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AuthorProfile;
