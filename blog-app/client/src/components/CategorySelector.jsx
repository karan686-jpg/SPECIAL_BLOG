import React, { useState, useEffect } from "react";
import { Plus, X, Tag, Check } from "lucide-react";
import { toast } from "react-hot-toast";

export const DEFAULT_CATEGORIES = [
  "Technology",
  "Startup",
  "Lifestyle",
  "Finance",
  "Creative",
  "Design",
];

const STORAGE_KEY = "custom_blog_categories";

const CategorySelector = ({ selectedCategory, onSelectCategory, disabled = false }) => {
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with defaults to ensure all presets exist
        return Array.from(new Set([...DEFAULT_CATEGORIES, ...parsed]));
      }
    } catch (e) {
      console.error("Failed to parse custom categories", e);
    }
    return DEFAULT_CATEGORIES;
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newCatInput, setNewCatInput] = useState("");

  const saveCategory = () => {
    const trimmed = newCatInput.trim();
    if (!trimmed) {
      setIsAdding(false);
      return;
    }

    // Check if category already exists (case-insensitive)
    const existingMatch = categories.find(
      (c) => c.toLowerCase() === trimmed.toLowerCase()
    );

    if (existingMatch) {
      onSelectCategory(existingMatch);
      toast.success(`Selected category "${existingMatch}"`);
    } else {
      const updated = [...categories, trimmed];
      setCategories(updated);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to save custom category", err);
      }
      onSelectCategory(trimmed);
      toast.success(`Custom category "${trimmed}" added!`);
    }

    setNewCatInput("");
    setIsAdding(false);
  };

  const handleRemoveCategory = (catToRemove, e) => {
    e.stopPropagation();
    const updated = categories.filter((c) => c !== catToRemove);
    setCategories(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save categories after removal", err);
    }

    // If currently selected category was removed, fallback to first default
    if (selectedCategory === catToRemove) {
      onSelectCategory(DEFAULT_CATEGORIES[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          Category
        </label>
        <span className="text-[11px] text-gray-400">
          Selected:{" "}
          <strong className="text-purple-600 dark:text-purple-400 font-semibold">
            {selectedCategory || "None"}
          </strong>
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const isCustom = !DEFAULT_CATEGORIES.includes(cat);

          return (
            <div
              key={cat}
              onClick={() => !disabled && onSelectCategory(cat)}
              className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer select-none ${
                isSelected
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              } ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
            >
              <span>{cat}</span>

              {/* Remove button for user-added custom categories */}
              {isCustom && !disabled && (
                <button
                  type="button"
                  onClick={(e) => handleRemoveCategory(cat, e)}
                  className={`p-0.5 rounded-full transition ${
                    isSelected
                      ? "text-purple-200 hover:text-white hover:bg-purple-700"
                      : "text-gray-400 hover:text-red-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                  title={`Delete custom category "${cat}"`}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}

        {/* Inline Add Category (NO nested form to prevent outer blog form submission) */}
        {!disabled &&
          (isAdding ? (
            <div className="flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150">
              <input
                type="text"
                autoFocus
                value={newCatInput}
                onChange={(e) => setNewCatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                    saveCategory();
                  } else if (e.key === "Escape") {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsAdding(false);
                    setNewCatInput("");
                  }
                }}
                placeholder="Category name..."
                className="text-xs px-2.5 py-1.5 rounded-xl border border-purple-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none w-36 shadow-xs focus:ring-2 focus:ring-purple-500/20"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  saveCategory();
                }}
                className="px-2.5 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-xl hover:bg-purple-700 transition cursor-pointer shadow-xs"
              >
                Add
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsAdding(false);
                  setNewCatInput("");
                }}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition cursor-pointer"
                title="Cancel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsAdding(true);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border border-dashed border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition cursor-pointer"
              title="Add a custom category"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Custom Category</span>
            </button>
          ))}
      </div>
    </div>
  );
};

export default CategorySelector;
