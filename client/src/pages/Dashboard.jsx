import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useTheme } from '../contexts/ThemeContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
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

  const handleLogout = async () => {
    try {
      await api.get('/auth/logout');
      
      localStorage.removeItem('accessToken');
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleLogoutAll = async () => {
    try {
      await api.get('/auth/logout-all');
      
      localStorage.removeItem('accessToken');
      toast.success('Logged out from all devices');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
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
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/profile"
                className="nav-link"
              >
                Profile
              </Link>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <button
                onClick={handleLogout}
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
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Welcome back!</h2>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-2xl border border-indigo-100/50 dark:border-indigo-800/30 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl drop-shadow-sm">👤</span>
                    <h3 className="text-xs font-bold text-indigo-900/60 dark:text-indigo-400 uppercase tracking-widest">Username</h3>
                  </div>
                  <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{user.username}</p>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-6 rounded-2xl border border-emerald-100/50 dark:border-emerald-800/30 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl drop-shadow-sm">✉️</span>
                    <h3 className="text-xs font-bold text-emerald-900/60 dark:text-emerald-400 uppercase tracking-widest">Email</h3>
                  </div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white truncate">{user.email}</p>
                </div>
                
                <div className="bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-900/20 dark:to-orange-900/20 p-6 rounded-2xl border border-rose-100/50 dark:border-rose-800/30 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl drop-shadow-sm">🆔</span>
                    <h3 className="text-xs font-bold text-rose-900/60 dark:text-rose-400 uppercase tracking-widest">User ID</h3>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white font-mono break-all">{user.id || user._id}</p>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleLogoutAll}
                  className="btn-primary"
                >
                  Logout from All Devices
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;