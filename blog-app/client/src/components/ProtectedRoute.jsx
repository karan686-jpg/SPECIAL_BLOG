import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const ProtectedRoute = ({ children, role }) => {
  const { isAuth, user, authReady } = useContext(AppContext);
  const location = useLocation();
  if (!authReady) return <div className="p-10 text-center">Loading session…</div>;
  if (!isAuth) return <Navigate to="/auth" replace state={{ from: location }} />;
  if (role && user?.role !== role) return <Navigate to="/" replace />;
  return children;
};

export default ProtectedRoute;
