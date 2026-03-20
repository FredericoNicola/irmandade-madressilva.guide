import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-bold text-green-700">
            🌸 Madressilva Guide
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm text-gray-600 hover:text-green-700 font-medium"
                >
                  Dashboard
                </Link>
                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin/users"
                    className="text-sm text-gray-600 hover:text-green-700 font-medium"
                  >
                    Users
                  </Link>
                )}
                <span className="text-sm text-gray-400">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-sm bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
