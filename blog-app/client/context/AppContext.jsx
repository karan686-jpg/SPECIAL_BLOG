/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [user, setuser] = useState(null);
  const [search, setsearch] = useState("");
  const [blogs, setblogs] = useState([]);
  const [isAuth, setisAuth] = useState(false);
  const [token, settoken] = useState(null);
  const [comment, setcomment] = useState({});

  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get("/api/blog/all");
      if (data.success) {
        setblogs(data.blogs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchUserProfile = async (savedtoken) => {
    try {
      const { data } = await axios.get("/api/user/profile", {
        headers: { Authorization: " " + savedtoken },
      });
      if (data.success) {
        setuser(data.user);
        setisAuth(true);
      } else {
        localStorage.removeItem("token");
        settoken(null);
        setisAuth(false);
        setuser(null);
      }
    } catch (error) {
      console.error("Error fetching profile", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
    const savedtoken = localStorage.getItem("token");
    if (savedtoken) {
      settoken(savedtoken);
      axios.defaults.headers.common["Authorization"] = " " + savedtoken;
      fetchUserProfile(savedtoken);
    }
  }, []);

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
        navigate,
        axios,
        fetchBlogs,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
