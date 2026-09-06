/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const api = useMemo(() => {
    const client = axios.create({ baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:3000" });
    client.interceptors.request.use((config) => {
      const savedToken = localStorage.getItem("token");
      if (savedToken) config.headers.Authorization = `Bearer ${savedToken}`;
      return config;
    });
    return client;
  }, []);
  const [user, setuser] = useState(null);
  const [search, setsearch] = useState("");
  const [blogs, setblogs] = useState([]);
  const [isAuth, setisAuth] = useState(false);
  const [token, settoken] = useState(() => localStorage.getItem("token"));
  const [comment, setcomment] = useState({});
  const [authReady, setAuthReady] = useState(false);

  const clearSession = useCallback(() => {
    localStorage.removeItem("token");
    settoken(null);
    setuser(null);
    setisAuth(false);
  }, []);

  const setSession = useCallback((newToken, newUser) => {
    localStorage.setItem("token", newToken);
    settoken(newToken);
    setuser(newUser);
    setisAuth(true);
  }, []);

  const fetchBlogs = useCallback(async () => {
    try {
      const { data } = await api.get("/api/blog/all", { params: { limit: 50 } });
      if (data.success) setblogs(data.blogs);
      else toast.error(data.message);
    } catch {
      toast.error("Unable to load blogs. Please try again.");
    }
  }, [api]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const savedToken = localStorage.getItem("token");
      const [blogsResult, profileResult] = await Promise.allSettled([
        api.get("/api/blog/all", { params: { limit: 50 } }),
        savedToken ? api.get("/api/user/profile") : Promise.resolve(null),
      ]);
      if (!active) return;
      if (blogsResult.status === "fulfilled" && blogsResult.value.data.success) setblogs(blogsResult.value.data.blogs);
      if (profileResult.status === "fulfilled" && profileResult.value?.data?.success) {
        setuser(profileResult.value.data.user);
        setisAuth(true);
      } else if (savedToken) clearSession();
      setAuthReady(true);
    };
    void load();
    return () => { active = false; };
  }, [api, clearSession]);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  });

  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("bookmarks") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const toggleBookmark = useCallback((blog) => {
    if (!blog?._id) return;
    setBookmarks((prev) => {
      const exists = prev.some((b) => b._id === blog._id);
      let updated;
      if (exists) {
        updated = prev.filter((b) => b._id !== blog._id);
        toast.success("Removed from bookmarks");
      } else {
        updated = [blog, ...prev];
        toast.success("Saved to reading list!");
      }
      localStorage.setItem("bookmarks", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isBookmarked = useCallback((blogId) => {
    return bookmarks.some((b) => b._id === blogId);
  }, [bookmarks]);

  return (
    <AppContext.Provider
      value={{
        comment,
        setcomment,
        token,
        settoken,
        user,
        setuser,
        search,
        setsearch,
        blogs,
        setblogs,
        isAuth,
        setisAuth,
        authReady,
        axios: api,
        fetchBlogs,
        setSession,
        clearSession,
        theme,
        toggleTheme,
        bookmarks,
        toggleBookmark,
        isBookmarked,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
