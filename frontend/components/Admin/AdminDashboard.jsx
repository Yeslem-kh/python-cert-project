import React from 'react';
import { Shield, CheckCircle, Lock, AlertTriangle } from 'lucide-react';

const AdminDashboard = ({ user }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-lg p-8 text-center">
        <Shield className="mx-auto mb-4 text-yellow-600" size={64} />
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          🎉 Admin Dashboard
        </h2>
        <p className="text-lg text-gray-700 mb-2">
          Congratulations! You've successfully exploited the IDOR vulnerability.
        </p>
        <p className="text-gray-600 mb-6">
          You now have access to the admin dashboard using the stolen JWT token.
        </p>

        <div className="mt-6 p-4 bg-white rounded-lg text-left">
          <p className="text-sm text-gray-500 mb-2 font-semibold">
            Your Admin Token:
          </p>
          <code className="text-xs bg-gray-100 p-3 rounded block break-all font-mono">
            {user.jwt}
          </code>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Lock size={24} />
          About the Vulnerability
        </h3>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-red-500 flex-shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">
                What is IDOR?
              </h4>
              <p className="text-sm text-gray-600">
                <strong>Insecure Direct Object Reference (IDOR)</strong> is a type of access control vulnerability that occurs when an application provides direct access to objects based on user-supplied input.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <AlertTriangle className="text-orange-500 flex-shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">
                The Vulnerable Endpoint
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                The <code className="bg-gray-100 px-1 rounded">/api/user/profile/:userId</code> endpoint fails to verify that the authenticated user is authorized to view the requested profile.
              </p>
              <code className="text-xs bg-red-50 border border-red-200 p-2 rounded block">
                GET http://localhost:5000/api/user/profile/1
              </code>
              <p className="text-xs text-gray-500 mt-1">
                ↑ This endpoint returns ANY user's data without checking authorization!
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">
                How to Fix It
              </h4>
              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>1. Verify Authorization:</strong> Always check if the authenticated user has permission to access the requested resource.</p>
                <p><strong>2. Use Indirect References:</strong> Use random tokens or UUIDs instead of sequential IDs.</p>
                <p><strong>3. Implement Access Control:</strong> Check user permissions on the server side for every request.</p>
                <p><strong>4. Log Access Attempts:</strong> Monitor and log suspicious access patterns.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">
          📚 Learn More About IDOR
        </h4>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>OWASP Top 10 - Broken Access Control</li>
          <li>Always implement server-side authorization checks</li>
          <li>Never trust client-side data or URL parameters</li>
          <li>Use role-based access control (RBAC)</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;