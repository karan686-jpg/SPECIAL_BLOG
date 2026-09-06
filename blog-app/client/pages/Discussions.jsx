import React, { useState, useEffect, useContext } from "react";
import Navbar from "../src/components/Navbar";
import ForumPlacard from "../src/components/forum/ForumPlacard";
import DiscussionCard from "../src/components/forum/DiscussionCard";
import CreateDiscussionModal from "../src/components/forum/CreateDiscussionModal";
import { Search, Filter, MessageSquare, Plus, Sparkles, Flame, Clock } from "lucide-react";
import { AppContext } from "../context/AppContext";

const CATEGORIES = ["All", "Ideas", "Technology", "Architecture", "Philosophy", "Career"];

export default function Discussions() {
  const { axios, user } = useContext(AppContext);
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory && selectedCategory !== "All") {
        params.category = selectedCategory;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      if (sortBy) {
        params.sort = sortBy;
      }

      const { data } = await axios.get("/api/discussions", { params });
      if (data.success) {
        setDiscussions(data.discussions || []);
      }
    } catch (err) {
      console.error("Failed to fetch discussions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, [selectedCategory, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDiscussions();
  };

  const handleCreateTopic = async (topicData) => {
    const { data } = await axios.post("/api/discussions", topicData);
    if (data.success) {
      // Re-fetch to put new topic at the top
      fetchDiscussions();
    } else {
      throw new Error(data.message || "Failed to create topic");
    }
  };

  const handleUpvote = async (id) => {
    try {
      const currentUserId = user?._id || user?.id || localStorage.getItem("userId") || "guest";
      const { data } = await axios.post(`/api/discussions/${id}/upvote`, { userId: currentUserId });
      if (data.success) {
        setDiscussions((prev) =>
          prev.map((d) => (d._id === id ? { ...d, upvotes: data.upvotes } : d))
        );
      }
    } catch (err) {
      console.error("Failed to upvote", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#070a12] text-gray-900 dark:text-slate-100 transition-colors">
      <Navbar />
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Top Inspiring Forum Placard Banner */}
        <ForumPlacard onStartTopic={() => setIsModalOpen(true)} />

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 bg-white dark:bg-[#0d121f]/90 p-4 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xs">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                    : "bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics or tags..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700/80 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </form>

            <div className="flex items-center bg-slate-900 rounded-lg border border-slate-700/80 p-0.5">
              <button
                onClick={() => setSortBy("latest")}
                className={`px-2.5 py-1 rounded text-xs flex items-center gap-1 transition-all ${
                  sortBy === "latest" ? "bg-slate-800 text-indigo-300 font-medium" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>Latest</span>
              </button>
              <button
                onClick={() => setSortBy("top")}
                className={`px-2.5 py-1 rounded text-xs flex items-center gap-1 transition-all ${
                  sortBy === "top" ? "bg-slate-800 text-indigo-300 font-medium" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Flame className="w-3 h-3" />
                <span>Top</span>
              </button>
            </div>
          </div>
        </div>

        {/* Discussion Feed */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-32 rounded-xl bg-slate-900/60 border border-slate-800 animate-pulse"
              />
            ))}
          </div>
        ) : discussions.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-slate-800 bg-[#0d121f]/50 p-8">
            <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-200">No discussions found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-6">
              Be the first voice to spark a thoughtful dialogue in this category.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-500/20"
            >
              + Start First Discussion
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {discussions.map((discussion) => (
              <DiscussionCard
                key={discussion._id}
                discussion={discussion}
                onUpvote={handleUpvote}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Discussion Modal */}
      <CreateDiscussionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTopic}
        categories={CATEGORIES.filter((c) => c !== "All")}
      />
    </div>
  );
}
