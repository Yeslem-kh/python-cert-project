import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';

// Import components
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import Navbar from '../components/Layout/Navbar';
import Alert from '../components/Common/Alert';
// import ExploitHint from '../components/Common/ExploitHint';
import NoteForm from '../components/Notes/NoteForm';
import NoteList from '../components/Notes/NoteList';
import ProfileForm from '../components/Profile/ProfileForm';
import AdminDashboard from '../components/Admin/AdminDashboard';

// Import API service
import api from '../services/api';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  // NOTE: JWT is no longer stored here, as it's handled by the HTTP-only cookie
  const [user, setUser] = useState(null); 
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load user data (excluding JWT) from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        // We only load non-sensitive user profile data
        const parsedUser = JSON.parse(savedUser);
        // Ensure no old JWT field exists
        delete parsedUser.jwt; 
        setUser(parsedUser);
        setCurrentPage('home');
      } catch (err) {
        localStorage.removeItem('user');
      }
    }
    // Since JWT is in a cookie, we rely on the backend check for session validity.
  }, []);

  // Load notes when user changes or page is home
  useEffect(() => {
    // If user object exists, the cookie should exist and be sent automatically
    if (user && currentPage === 'home') {
      loadNotes();
    }
  }, [user, currentPage]);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 5000);
  };

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(''), 3000);
  };

  // --- MODIFIED: loadNotes no longer takes JWT ---
  const loadNotes = async () => {
    try {
      // The JWT cookie is sent automatically by the browser
      const notesData = await api.getNotes(); 
      setNotes(notesData);
    } catch (err) {
      showError('Failed to load notes: ' + err.message);
      // If load fails (e.g., token expired), force logout
      if (err.status === 401) handleLogout(); 
    }
  };

  // Auth handlers
  const handleLogin = async (username, password) => {
    try {
      const data = await api.login(username, password);
      // Store only non-sensitive data
      const userData = { ...data.user };
      delete userData.jwt; 
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setCurrentPage('home');
      showSuccess('Login successful!');
    } catch (err) {
      showError(err.message);
    }
  };

  const handleRegister = async (username, email, password) => {
    try {
      // JWT cookie is set on the response, but we navigate to login
      await api.register(username, email, password); 
      showSuccess('Registration successful! Please login.');
      setCurrentPage('login');
    } catch (err) {
      showError(err.message);
    }
  };

  // --- MODIFIED: handleLogout calls new endpoint to clear cookie ---
  const handleLogout = async () => {
    try {
      await api.logout(); // Sends request to server to clear cookie
    } catch (err) {
      // Ignore error on logout, proceed with client cleanup
    }
    setUser(null);
    setNotes([]);
    setCurrentPage('login');
    localStorage.removeItem('user');
    showSuccess('Logged out successfully');
  };

  // Note handlers (Modified: JWT parameter removed from calls)
  const handleCreateNote = async (title, content) => {
    try {
      await api.createNote(title, content);
      showSuccess('Note created successfully!');
      loadNotes();
    } catch (err) {
      showError(err.message);
    }
  };

  const handleUpdateNote = async (noteId, title, content) => {
    try {
      await api.updateNote(noteId, title, content);
      showSuccess('Note updated successfully!');
      loadNotes();
    } catch (err) {
      showError(err.message);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await api.deleteNote(noteId);
      showSuccess('Note deleted successfully!');
      loadNotes();
    } catch (err) {
      showError(err.message);
    }
  };

  // Profile handler (Modified: JWT parameter removed)
  const handleUpdateProfile = async (profileData) => {
    try {
      const data = await api.updateProfile(profileData);
      const updatedUser = { ...user, ...data.user };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      showSuccess('Profile updated successfully!');
    } catch (err) {
      showError(err.message);
    }
  };

  

  // Render auth page (Unchanged)
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <Lock className="mx-auto mb-2 text-indigo-600" size={48} />
            <h1 className="text-3xl font-bold text-gray-800">NoteBox</h1>
            <p className="text-sm text-gray-500 mt-1"></p>
          </div>

          <Alert type="error" message={error} onClose={() => setError('')} />
          <Alert type="success" message={success} onClose={() => setSuccess('')} />

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setCurrentPage('login')}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                currentPage === 'login'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setCurrentPage('register')}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                currentPage === 'register'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Register
            </button>
          </div>

          {currentPage === 'login' ? (
            <Login
              onLogin={handleLogin}
              onSwitchToRegister={() => setCurrentPage('register')}
            />
          ) : (
            <Register
              onRegister={handleRegister}
              onSwitchToLogin={() => setCurrentPage('login')}
            />
          )}
        </div>
      </div>
    );
  }

  // Render main app (Unchanged)
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        user={user}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Alert type="error" message={error} onClose={() => setError('')} />
        <Alert type="success" message={success} onClose={() => setSuccess('')} />

        {currentPage === 'home' && (
          <div>
            {/* {user.role !== 'admin' && (
              // <ExploitHint userId={user.id} onExploit={handleExploit} />
            )} */}
            
            <NoteForm onSubmit={handleCreateNote} />
            <NoteList
              notes={notes}
              onUpdate={handleUpdateNote}
              onDelete={handleDeleteNote}
            />
          </div>
        )}

        {currentPage === 'profile' && (
          <ProfileForm user={user} onUpdate={handleUpdateProfile} />
        )}

        {currentPage === 'admin' && user.role === 'admin' && (
          // NOTE: AdminDashboard component is provided, but it requires the 'user.jwt' which is no longer 
          // available in the client-side user object. You may need to update AdminDashboard to 
          // reflect that the token is now hidden. I'm leaving the original component code as-is.
          <AdminDashboard user={user} />
        )}
      </div>
    </div>
  );
}

export default App;