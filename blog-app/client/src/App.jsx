import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy loading page components
const Home = lazy(() => import("../pages/Home"));
const BlogDetails = lazy(() => import("../pages/BlogDetails"));
const Bookmarks = lazy(() => import("../pages/Bookmarks"));
const Analytics = lazy(() => import("../pages/Analytics"));
const CreateBlog = lazy(() => import("../pages/CreateBlog"));
const AuthorProfile = lazy(() => import("../pages/AuthorProfile"));
const CollaborativeStudio = lazy(() => import("../pages/CollaborativeStudio"));
const Discussions = lazy(() => import("../pages/Discussions"));
const DiscussionDetails = lazy(() => import("../pages/DiscussionDetails"));

// Lazy loading admin components
const Layout = lazy(() => import("../pages/admin/Layout"));
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const AddBlog = lazy(() => import("../pages/admin/AddBlog"));
const ListBlog = lazy(() => import("../pages/admin/ListBlog"));
const Comments_admin = lazy(() => import("../pages/admin/Comments_admin"));

// Lazy loading auth components
const Login = lazy(() => import("./components/admin/Login"));
const PublicLogin = lazy(() => import("./components/PublicLogin"));
const Register = lazy(() => import("./components/Register"));
const Logout = lazy(() => import("./components/admin/Logout"));

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#090d16] text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Toaster />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog/:id" element={<BlogDetails />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="add-blog" element={<AddBlog />} />
            <Route path="Listblogs" element={<ListBlog />} />
            <Route path="comments" element={<Comments_admin />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/auth" element={<PublicLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/author/:authorName" element={<AuthorProfile />} />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute role="user">
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-blog"
            element={
              <ProtectedRoute>
                <CreateBlog />
              </ProtectedRoute>
            }
          />
          <Route path="/collab" element={<CollaborativeStudio />} />
          <Route path="/collab/:roomId" element={<CollaborativeStudio />} />
          <Route path="/discussions" element={<Discussions />} />
          <Route path="/discussions/:id" element={<DiscussionDetails />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
