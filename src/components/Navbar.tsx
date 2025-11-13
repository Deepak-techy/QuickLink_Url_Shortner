import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="glass fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="text-3xl group-hover:scale-110 transition-transform">
              🔗
            </div>
            <span className="text-white text-2xl font-bold">QuickLink</span>
          </Link>

          <div className="flex space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive("/")
                  ? "bg-white text-indigo-600 shadow-lg"
                  : "text-white hover:bg-white/20"
              }`}
            >
              Home
            </Link>
            <Link
              to="/my-links"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive("/my-links")
                  ? "bg-white text-indigo-600 shadow-lg"
                  : "text-white hover:bg-white/20"
              }`}
            >
              My Links
            </Link>
            <Link
              to="/analytics"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive("/analytics")
                  ? "bg-white text-indigo-600 shadow-lg"
                  : "text-white hover:bg-white/20"
              }`}
            >
              Analytics
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
