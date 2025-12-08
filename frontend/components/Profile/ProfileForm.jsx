import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';

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
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <User size={24} />
        Update Profile
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Leave blank to keep current password"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Only fill this if you want to change your password
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Account Info</h3>
        <div className="text-xs text-gray-600 space-y-1">
          <p><strong>User ID:</strong> {user.id}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>JWT Token:</strong> <code className="bg-gray-200 px-1 rounded break-all">{user.jwt.substring(0, 50)}...</code></p>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;