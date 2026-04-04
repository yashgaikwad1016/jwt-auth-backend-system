import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useTheme } from '../contexts/ThemeContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/get-me');
      setUser(response.data.user);
    } catch (error) {
      toast.error('Failed to fetch user data');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <nav className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Profile</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="nav-link"
              >
                Dashboard
              </Link>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('accessToken');
                  navigate('/login');
                }}
                className="btn-secondary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 rounded-2xl transition-colors duration-300">
            <div className="px-4 py-6 sm:p-8">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">User Profile</h2>
              
              <div className="space-y-4">
                <div className="flex items-center p-5 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/40 dark:to-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:shadow-md transition-all">
                  <div className="flex-shrink-0 w-12 h-12 bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center rounded-full mr-4 text-xl shadow-inner border border-rose-200 dark:border-rose-800">
                    🆔
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase">User ID</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white font-mono break-all mt-0.5">{user.id || user._id}</p>
                  </div>
                </div>

                <div className="flex items-center p-5 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/40 dark:to-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:shadow-md transition-all">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center rounded-full mr-4 text-xl shadow-inner border border-indigo-200 dark:border-indigo-800">
                    👤
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase">Username</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">{user.username}</p>
                  </div>
                </div>

                <div className="flex items-center p-5 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/40 dark:to-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:shadow-md transition-all">
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center rounded-full mr-4 text-xl shadow-inner border border-emerald-200 dark:border-emerald-800">
                    ✉️
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase">Email</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center p-5 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/40 dark:to-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:shadow-md transition-all">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center rounded-full mr-4 text-xl shadow-inner border border-blue-200 dark:border-blue-800">
                    🛡️
                  </div>
                  <div className="flex-1 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase">Account Status</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">Verification</p>
                    </div>
                    <span className={`inline-flex items-center px-4 py-1.5 text-xs font-bold rounded-full shadow-sm ${
                      user.isVerified 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border border-green-200 dark:border-green-800' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border border-red-200 dark:border-red-800'
                    }`}>
                      {user.isVerified ? '✅ Verified' : '❌ Unverified'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;