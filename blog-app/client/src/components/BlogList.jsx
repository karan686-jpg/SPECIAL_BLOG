import React, { useContext, useState } from "react";
import BlogCard from "./BlogCard";
import { AppContext } from "../../context/AppContext";

const BlogList = () => {
  const [list, setlist] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

  const { search, blogs } = useContext(AppContext);

  const filteredBlogs = () => {
    const byCategory =
      list === "All" ? blogs : blogs.filter((b) => b.category === list);
    if (!search) return byCategory;
    return byCategory.filter(
      (b) =>
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.description.toLowerCase().includes(search.toLowerCase()) ||
        b.category.toLowerCase().includes(search.toLowerCase()),
    );
  };

  const currentBlogs = filteredBlogs();

  // Pagination logic
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentDisplayedBlogs = currentBlogs.slice(
    indexOfFirstBlog,
    indexOfLastBlog,
  );
  const totalPages = Math.ceil(currentBlogs.length / blogsPerPage);

  const categories = ["All", "Technology", "Startup", "Lifestyle", "Finance"];

  return (
    <div className="flex flex-col items-center">
      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-10 w-full max-w-3xl">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-pill ${list === category ? "active" : "inactive"}`}
            onClick={() => {
              setlist(category);
              setCurrentPage(1); // Reset to page 1 on category change
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {search && (
        <p className="text-gray-500 mb-6">
          Showing results for "
          <span className="font-semibold text-gray-800">{search}</span>"
        </p>
      )}

      {currentDisplayedBlogs.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-700">No blogs found</h2>
          <p className="text-gray-500 mt-2">
            Try adjusting your search or category filter.
          </p>
        </div>
      ) : (
        <div className="blog-grid w-full">
          {currentDisplayedBlogs.map((b) => (
            <BlogCard key={b._id} blog={b} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center gap-4 mt-12 mb-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-4 py-2 rounded-lg font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Previous
          </button>

          <span className="text-gray-600 font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-4 py-2 rounded-lg font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogList;
