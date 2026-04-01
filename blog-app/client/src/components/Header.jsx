import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { Search } from "lucide-react";

const Header = () => {
  const { search, setsearch } = useContext(AppContext);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white pt-24 pb-32">
      {/* Decorative background shapes */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
          Your ideas,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            amplified.
          </span>
        </h1>
        <p className="text-xl opacity-90 font-light mb-10 max-w-2xl mx-auto">
          Discover stories, thinking, and expertise from writers on any topic.
        </p>

        {/* Premium Search Bar */}
        <div className="relative max-w-2xl mx-auto group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
          </div>
          <input
            type="text"
            className="w-full pl-14 pr-4 py-4 text-lg bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:bg-white focus:text-gray-900 focus:placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all duration-300 shadow-2xl"
            placeholder="Search blogs by title or category..."
            value={search}
            onChange={(e) => setsearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
