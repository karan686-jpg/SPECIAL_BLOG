import React, { useContext } from "react";
import { AppContext } from "../../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const Logout = () => {
  const navigate = useNavigate();
  const { clearSession } = useContext(AppContext);

  const handleLogout = () => {
    clearSession();
    navigate("/auth");
  };

  return (
    <button
      onClick={handleLogout}
      type="button"
      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 border border-gray-200 dark:border-gray-800 transition cursor-pointer"
      title="Sign Out"
    >
      <LogOut className="w-3.5 h-3.5" />
      <span>Logout</span>
    </button>
  );
};

export default Logout;
