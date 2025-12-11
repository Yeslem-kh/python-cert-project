import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Shield, Hash, Save } from 'lucide-react';

const ProfileForm = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        password: ''
      });
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!formData.username.trim() || !formData.email.trim()) {
      alert('Username and email are required');
      return;
    }

    setLoading(true);
    try {
      await onUpdate(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      {/* Profile Card */}
      <div className="note-card overflow-visible">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Profile Settings</h2>
              <p className="text-sm text-gray-400">Manage your account information</p>
            </div>
          </div>
        </div>
        
        {/* Form */}
        <div className="p-6 space-y-5">
          {/* Username */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <User size={14} />
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all text-gray-800"
              disabled={loading}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Mail size={14} />
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all text-gray-800"
              disabled={loading}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Lock size={14} />
              New Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all text-gray-800"
              placeholder="Leave blank to keep current password"
              disabled={loading}
            />
            <p className="text-xs text-gray-400 mt-2">
              Only fill this if you want to change your password
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Update Profile
                </>
              )}
            </button>
          </div>
        </div>

        {/* Account Info Footer */}
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Account Details</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Hash size={14} className="text-gray-400" />
              <span className="font-medium">ID:</span> {user.id}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield size={14} className="text-gray-400" />
              <span className="font-medium">Role:</span>
              <span className={`badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                {user.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;