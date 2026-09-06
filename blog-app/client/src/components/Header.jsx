import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { Search, X, Loader2 } from "lucide-react";
import useDebounce from "../hooks/useDebounce";

const Header = () => {
  const { search, setsearch } = useContext(AppContext);
  const [inputValue, setInputValue] = useState(search || "");
  const debouncedValue = useDebounce(inputValue, 350);

  // Sync debounced input to global context only after user stops typing
  useEffect(() => {
    setsearch(debouncedValue);
  }, [debouncedValue, setsearch]);

  // Handle external search reset
  useEffect(() => {
    if (!search && inputValue) {
      setInputValue("");
    }
  }, [search]);

  const isDebouncing = inputValue.trim() !== debouncedValue.trim();

  const handleClear = () => {
    setInputValue("");
    setsearch("");
  };

  return (
    <section className="pt-16 pb-12 sm:pt-20 sm:pb-16 border-b border-gray-100 dark:border-gray-800/80 bg-gradient-to-b from-gray-50/70 to-white dark:from-gray-900/30 dark:to-gray-950">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.12] mb-4">
          Stories, ideas & perspectives.
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 font-normal max-w-xl mx-auto mb-8 leading-relaxed">
          Thoughtful writing on technology, architecture, creative thinking, and modern software craft.
        </p>

        {/* Minimal Search Bar (Linear/Vercel Style with Debounce) */}
        <div className="relative max-w-xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
            {isDebouncing ? (
              <Loader2 className="h-4 w-4 text-purple-600 dark:text-purple-400 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-10 py-3 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-purple-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition-all shadow-xs"
            placeholder="Search stories by topic, title, or keywords..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          {inputValue && (
            <button
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              title="Clear search"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Subtle Debounce Status Pill */}
        {isDebouncing && (
          <p className="text-[11px] text-purple-600 dark:text-purple-400 mt-2 font-mono animate-pulse">
            Searching as you finish typing...
          </p>
        )}
      </div>
    </section>
  );
};

export default Header;
