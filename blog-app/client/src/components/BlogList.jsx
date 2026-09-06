import React, { useContext, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import FeaturedStory from "./FeaturedStory";
import ArticleCard from "./ArticleCard";
import AuthorCard from "./AuthorCard";
import TagChip from "./TagChip";
import { ArticleCardSkeleton, FeaturedStorySkeleton } from "./SkeletonLoader";
import { TrendingUp, Mail, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import useDebounce from "../hooks/useDebounce";
import { DEFAULT_CATEGORIES } from "./CategorySelector";

const BlogList = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const blogsPerPage = 6;

  const { search, blogs } = useContext(AppContext);
  const debouncedSearch = useDebounce(search, 300);
  const isSearching = Boolean(search && search !== debouncedSearch);

  // Filter blogs by Category & Search (Debounced for peak performance)
  const filtered = (blogs || []).filter((b) => {
    const matchCategory = activeCategory === "All" || b.category === activeCategory;
    if (!debouncedSearch) return matchCategory;
    const query = debouncedSearch.toLowerCase().trim();
    const matchSearch =
      (b.title || "").toLowerCase().includes(query) ||
      (b.description || "").toLowerCase().includes(query) ||
      (b.category || "").toLowerCase().includes(query);
    return matchCategory && matchSearch;
  });

  // Featured Lead Story (First blog if viewing "All" with no search query)
  const isLeadEligible = activeCategory === "All" && !debouncedSearch && filtered.length > 0;
  const leadStory = isLeadEligible ? filtered[0] : null;
  const streamStories = isLeadEligible ? filtered.slice(1) : filtered;

  // Pagination for the stream stories
  const indexOfLast = currentPage * blogsPerPage;
  const indexOfFirst = indexOfLast - blogsPerPage;
  const currentStories = streamStories.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(streamStories.length / blogsPerPage);

  // 🏷️ Dynamically compute all unique categories from blogs in DB + user-created custom categories + presets
  const availableCategories = useMemo(() => {
    let savedCustom = [];
    try {
      savedCustom = JSON.parse(localStorage.getItem("custom_blog_categories") || "[]");
    } catch {}
    const existingInBlogs = (blogs || []).map((b) => b.category).filter(Boolean);
    return Array.from(
      new Set(["All", ...DEFAULT_CATEGORIES, ...savedCustom, ...existingInBlogs])
    );
  }, [blogs]);

  // 📈 Intelligent Multi-Signal Trending Algorithm with Time-Decay Gravity
  // Formula: Score = (Views*1 + ReadTime*3 + Reactions*8 + Comments*15) / (AgeInHours + 2)^1.3
  const calculateTrendingScore = (b) => {
    const views = b.views || 0;
    const wordCount = b.description
      ? b.description.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length
      : 120;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));
    const commentsCount = Array.isArray(b.comments) ? b.comments.length : (b.commentsCount || 0);
    const reactionsCount = b.likesCount || b.claps || 0;

    const baseEngagement =
      views * 1 +
      readTime * 3 +
      reactionsCount * 8 +
      commentsCount * 15;

    const createdAt = new Date(b.createdAt || Date.now());
    const ageInHours = Math.max(0, (Date.now() - createdAt.getTime()) / (1000 * 60 * 60));
    const timeDecayFactor = Math.pow(ageInHours + 2, 1.3);

    const score = (baseEngagement + 10) / timeDecayFactor;
    return Math.round(score * 10) / 10;
  };

  const trendingStories = useMemo(() => {
    return [...(blogs || [])]
      .map((b) => ({
        ...b,
        trendingScore: calculateTrendingScore(b),
      }))
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, 4);
  }, [blogs]);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setIsSubscribed(true);
    toast.success("Thank you for subscribing to Blogify Weekly!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* 1. Lead Featured Story (Hero Editorial) */}
      {!blogs && <FeaturedStorySkeleton />}
      {leadStory && <FeaturedStory blog={leadStory} />}

      {/* 2. Topic / Category Filter Pill Bar (Data-Driven & Scrollable) */}
      <div className="flex items-center justify-between gap-4 pb-6 mb-8 border-b border-gray-100 dark:border-gray-800/80 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 shrink-0">
          {availableCategories.map((cat) => (
            <TagChip
              key={cat}
              label={cat}
              active={activeCategory === cat}
              onClick={() => {
                setActiveCategory(cat);
                setCurrentPage(1);
              }}
            />
          ))}
        </div>

        {search && (
          <p className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
            Results for <span className="font-semibold text-gray-900 dark:text-white">"{search}"</span>
          </p>
        )}
      </div>

      {/* 3. Main Editorial Grid: Stream + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Stories Stream (8 cols) */}
        <div className="lg:col-span-8">
          {!blogs && (
            <div className="space-y-4">
              <ArticleCardSkeleton />
              <ArticleCardSkeleton />
              <ArticleCardSkeleton />
            </div>
          )}

          {blogs && currentStories.length === 0 && (
            <div className="py-20 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
              <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-1">
                No stories found
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Try searching for a different keyword or explore another topic.
              </p>
            </div>
          )}

          {currentStories.map((story) => (
            <ArticleCard key={story._id} blog={story} />
          ))}

          {/* Clean Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-10 mt-6 border-t border-gray-100 dark:border-gray-800/80">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>

              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Editorial Sidebar (4 cols) */}
        <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-24">
          {/* Trending Stories Box */}
          <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100">
                Trending on Blogify
              </h3>
            </div>

            <div className="space-y-4">
              {trendingStories.map((tBlog, index) => (
                <div
                  key={tBlog._id}
                  onClick={() => navigate(`/blog/${tBlog._id}`)}
                  className="group flex items-start gap-3.5 cursor-pointer"
                >
                  <span className="text-2xl font-black text-gray-300 dark:text-gray-700 font-mono leading-none group-hover:text-indigo-600 transition-colors">
                    0{index + 1}
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                      <span>{tBlog.authorName || "Writer"}</span>
                      <span>•</span>
                      <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-0.5">
                        🔥 {tBlog.trendingScore}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                      {tBlog.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Authors */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-1">
              Featured Writers
            </h3>
            <AuthorCard
              name="Karan Datta"
              bio="Full-Stack Engineer & System Architect"
              totalPosts={12}
            />
            <AuthorCard
              name="Tech Radar"
              bio="Insights into AI & Cloud Computing"
              totalPosts={8}
            />
          </div>

          {/* Newsletter Box */}
          <div className="p-6 rounded-2xl border border-indigo-100 dark:border-indigo-950 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-3">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
              <Mail className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Blogify Weekly
              </h4>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Curated articles, engineering perspectives, and design essays delivered straight to your inbox.
            </p>

            {isSubscribed ? (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-gray-900 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="w-4 h-4" />
                <span>You're on the list!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="space-y-2">
                <input
                  type="email"
                  placeholder="name@domain.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold hover:opacity-90 transition cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BlogList;
