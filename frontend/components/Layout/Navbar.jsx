import React from 'react';
import { Lock, Shield, Home, User, Settings, LogOut } from 'lucide-react';

const Navbar = ({ user, currentPage, onNavigate, onLogout }) => {
  return (
    <nav className="navbar sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <Lock className="text-white" size={18} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 leading-none">NoteBox</h1>
              <p className="text-[10px] text-gray-400 font-medium tracking-wide">ENCRYPTED & SECURE</p>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center gap-2">
            {/* User Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full mr-2">
              <div className="w-6 h-6 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-semibold">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700">{user.username}</span>
              {user.role === 'admin' && (
                <span className="badge badge-admin">
                  <Shield size={10} className="mr-1" />
                  Admin
                </span>
              )}
            </div>

            {/* Nav Buttons */}
            <button
              onClick={() => onNavigate('home')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                currentPage === 'home'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Home size={16} />
              <span className="hidden sm:inline">Home</span>
            </button>

            <button
              onClick={() => onNavigate('profile')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                currentPage === 'profile'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <User size={16} />
              <span className="hidden sm:inline">Profile</span>
            </button>

            {user.role === 'admin' && (
              <button
                onClick={() => onNavigate('admin')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                  currentPage === 'admin'
                    ? 'bg-amber-50 text-amber-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Settings size={16} />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}

            {/* Logout Button */} 
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all text-sm font-medium ml-1"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;