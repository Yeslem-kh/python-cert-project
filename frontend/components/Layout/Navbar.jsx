import React from 'react';
import { Lock, Shield } from 'lucide-react';

const Navbar = ({ user, currentPage, onNavigate, onLogout }) => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Lock className="text-indigo-600" size={24} />
          <h1 className="text-xl font-bold text-gray-800">SecureNotes</h1>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-gray-600 flex items-center gap-1">
            {user.username}
            {user.role === 'admin' && (
              <Shield className="text-yellow-500" size={16} title="Admin" />
            )}
          </span>

          <button
            onClick={() => onNavigate('home')}
            className={`px-4 py-2 rounded-lg transition text-sm ${
              currentPage === 'home'
                ? 'bg-indigo-100 text-indigo-700 font-semibold'
                : 'hover:bg-gray-100'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => onNavigate('profile')}
            className={`px-4 py-2 rounded-lg transition text-sm ${
              currentPage === 'profile'
                ? 'bg-indigo-100 text-indigo-700 font-semibold'
                : 'hover:bg-gray-100'
            }`}
          >
            Profile
          </button>

          {user.role === 'admin' && (
            <button
              onClick={() => onNavigate('admin')}
              className={`px-4 py-2 rounded-lg transition text-sm ${
                currentPage === 'admin'
                  ? 'bg-yellow-100 text-yellow-700 font-semibold'
                  : 'hover:bg-gray-100'
              }`}
            >
              Admin
            </button>
          )}

          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;