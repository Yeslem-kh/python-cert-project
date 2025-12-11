// src/services/api.js
// Use empty string for production (nginx proxy), or localhost for development
const API_URL = import.meta.env.VITE_API_URL || "";

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    throw { message: data.error || "Request failed", status: res.status };
  }
  return data;
};

export default {
  // --- LOGIN ---
  login: async (username, password) => {
    const res = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      credentials: "include",   // 🚀 COOKIE SENT
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    return await handleResponse(res);
  },

  // --- REGISTER ---
  register: async (username, email, password) => {
    const res = await fetch(`${API_URL}/api/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });
    return await handleResponse(res);
  },

  // --- LOGOUT ---
  logout: async () => {
    const res = await fetch(`${API_URL}/api/logout`, {
      method: "POST",
      credentials: "include"
    });
    return await handleResponse(res);
  },

  // --- GET NOTES ---
  getNotes: async () => {
    const res = await fetch(`${API_URL}/api/notes`, {
      method: "GET",
      credentials: "include"
    });
    return await handleResponse(res);
  },

  // --- CREATE NOTE ---
  createNote: async (title, content) => {
    const res = await fetch(`${API_URL}/api/notes`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content })
    });
    return await handleResponse(res);
  },

  // --- UPDATE NOTE ---
  updateNote: async (noteId, title, content) => {
    const res = await fetch(`${API_URL}/api/notes/${noteId}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content })
    });
    return await handleResponse(res);
  },

  // --- DELETE NOTE ---
  deleteNote: async (noteId) => {
    const res = await fetch(`${API_URL}/api/notes/${noteId}`, {
      method: "DELETE",
      credentials: "include"
    });
    return await handleResponse(res);
  },

  // --- UPDATE PROFILE ---
  updateProfile: async (profileData) => {
    const res = await fetch(`${API_URL}/api/profile`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData)
    });
    return await handleResponse(res);
  },

  // --- GET USER PROFILE (IDOR vulnerable endpoint) ---
  getUserProfile: async (userId) => {
    const res = await fetch(`${API_URL}/api/user/profile/${userId}`, {
      method: "GET",
      credentials: "include"
    });
    return await handleResponse(res);
  }
};
