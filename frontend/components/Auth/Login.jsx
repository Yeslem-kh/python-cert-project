import React, { useState } from 'react';
import { User, Lock, LogIn, ArrowRight } from 'lucide-react';

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onLogin(formData.username, formData.password);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <User size={14} />
          Username
        </label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          onKeyPress={handleKeyPress}
          className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all text-gray-800 placeholder-gray-400"
          placeholder="Enter username"
          disabled={loading}
          autoFocus
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Lock size={14} />
          Password
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          onKeyPress={handleKeyPress}
          className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all text-gray-800 placeholder-gray-400"
          placeholder="Enter password"
          disabled={loading}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Logging in...
          </>
        ) : (
          <>
            <LogIn size={16} />
            Sign In
          </>
        )}
      </button>

      <div className="text-center pt-2">
        <p className="text-sm text-gray-500">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-indigo-600 hover:text-indigo-700 font-semibold inline-flex items-center gap-1"
          >
            Register here
            <ArrowRight size={14} />
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;