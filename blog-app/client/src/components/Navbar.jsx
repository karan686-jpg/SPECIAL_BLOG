import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sun,
  Moon,
  Bookmark,
  SquarePen,
  BarChart2,
  Shield,
  Menu,
  X,
  Compass,
} from "lucide-react";
import { AppContext } from "../../context/AppContext";
import Logout from "./admin/Logout";
import MobileNavMenu from "./MobileNavMenu";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuth, user, theme, toggleTheme, bookmarks } = useContext(AppContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-gray-950/90 border-b border-gray-200/80 dark:border-gray-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => {
            navigate("/");
            closeMobile();
          }}
          className="flex items-center gap-1.5 cursor-pointer select-none group"
        >
          <span className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 dark:text-white">
            Blogify
          </span>
          <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 group-hover:scale-125 transition-transform duration-200"></span>
        </div>

        {/* Desktop / Tablet Navigation (sm and up) */}
        <div className="hidden sm:flex items-center gap-2 sm:gap-3">
          {/* Saved Reading List */}
          <button
            onClick={() => navigate("/bookmarks")}
            className="relative flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors cursor-pointer"
            title="Saved Reading List"
            type="button"
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved</span>
            {bookmarks && bookmarks.length > 0 && (
              <span className="bg-indigo-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {bookmarks.length}
              </span>
            )}
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors cursor-pointer"
            title={theme === "dark" ? "Switch to Light mode" : "Switch to Dark mode"}
            type="button"
            aria-label="Toggle color theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-gray-600" />
            )}
          </button>

          <div className="h-4 w-[1px] bg-gray-200 dark:bg-gray-800 mx-1" />

          {/* Discussion Forum Link */}
          <button
            onClick={() => navigate("/discussions")}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800 transition cursor-pointer"
            type="button"
            title="Community Discussion Forum"
          >
            <Compass className="w-3.5 h-3.5 text-indigo-500" />
            <span>Forum</span>
          </button>

          {/* Collaborative Studio Link */}
          <button
            onClick={() => navigate("/collab")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 transition cursor-pointer"
            type="button"
            title="Real-time Collaborative Publishing Studio"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Collab</span>
          </button>

          {/* Write / Create Blog Button */}
          {isAuth && (
            <button
              onClick={() => navigate("/create-blog")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 transition cursor-pointer"
              type="button"
            >
              <SquarePen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Write</span>
            </button>
          )}

          {/* User Role Links */}
          {isAuth && user?.role === "admin" && (
            <button
              onClick={() => navigate("/admin")}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
              type="button"
            >
              <Shield className="w-3.5 h-3.5 text-indigo-500" />
              <span>Admin Panel</span>
            </button>
          )}

          {isAuth && user?.role === "user" && (
            <button
              onClick={() => navigate("/analytics")}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
              type="button"
            >
              <BarChart2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Analytics</span>
            </button>
          )}

          {/* Auth: Login / Register or Logout */}
          {!isAuth ? (
            <div className="flex items-center gap-2">
              <Link
                to="/auth"
                className="px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-semibold hover:opacity-90 transition shadow-xs"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <Logout />
          )}
        </div>

        {/* Mobile Controls (< sm: phone screens) */}
        <div className="flex sm:hidden items-center gap-2">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Toggle theme"
            type="button"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-gray-600" />
            )}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2.5 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            type="button"
            aria-label="Toggle mobile navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Navigation Menu */}
      <MobileNavMenu
        isOpen={mobileMenuOpen}
        onClose={closeMobile}
        isAuth={isAuth}
        user={user}
        bookmarks={bookmarks}
        navigate={navigate}
      />
    </header>
  );
};

export default Navbar;
