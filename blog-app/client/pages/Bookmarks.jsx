import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Bookmark, ArrowRight, BookOpen } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Navbar from "../src/components/Navbar";
import BlogCard from "../src/components/BlogCard";
import { AppContext } from "../context/AppContext";

const Bookmarks = () => {
  const { bookmarks } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <Helmet>
        <title>Reading List | Blogify</title>
        <meta
          name="description"
          content="Your saved articles and personal reading list on Blogify."
        />
      </Helmet>

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-gray-200 dark:border-gray-800">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-100 dark:bg-purple-950/70 rounded-xl text-purple-600 dark:text-purple-400">
                <Bookmark className="w-6 h-6 fill-current" />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Reading List
              </h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              Articles you've saved to read later. Persisted locally in your browser.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-4 py-2 rounded-full w-fit">
            <BookOpen className="w-4 h-4" />
            <span>{bookmarks.length} {bookmarks.length === 1 ? "Article Saved" : "Articles Saved"}</span>
          </div>
        </div>

        {/* Content */}
        {bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center text-gray-400 mb-6">
              <Bookmark className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              Your reading list is empty
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8 text-sm">
              Click the bookmark icon on any blog card or article to save it here for later distraction-free reading.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5 transition-all"
            >
              <span>Explore Blogs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-8">
            {bookmarks.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Bookmarks;
