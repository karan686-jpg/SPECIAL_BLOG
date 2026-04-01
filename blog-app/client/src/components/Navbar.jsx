import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AppContext } from "../../context/AppContext";
import Login from "./admin/Login";
import "../App.css";
import Logout from "./admin/Logout";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, isAuth, user } = useContext(AppContext);

  return (
    <nav className="navbar">
      <div className="btn-home" onClick={() => navigate("/")}>
        Blogify
      </div>

      <div className="flex items-center">
        {isAuth && user?.role === "admin" && (
          <button className="butt mx-1.5" onClick={() => navigate("/admin")}>
            Admin Panel
          </button>
        )}
        {isAuth && user?.role === "user" && (
          <button
            className="butt mx-1.5"
            onClick={() => navigate("/analytics")}
          >
            Analytics
          </button>
        )}
        {isAuth && (
          <button
            className="butt2 mx-1.5"
            onClick={() => navigate("/create-blog")}
          >
            Write a Blog
          </button>
        )}
        {!isAuth && (
          <Link to="/auth" className="butt mx-1.5">
            Login
          </Link>
        )}
        {!isAuth && (
          <Link to="/register" className="butt2 mx-1.5">
            Sign Up
          </Link>
        )}
        {isAuth && <Logout />}
      </div>
    </nav>
  );
};
export default Navbar;
