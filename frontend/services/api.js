// src/services/api.js
const API_URL = "http://localhost:5000";

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

  // --- GET NOTES ---
  getNotes: async () => {
    const res = await fetch(`${API_URL}/api/notes`, {
      method: "GET",
      credentials: "include"
    });
    return await handleResponse(res);
  },

  // ... you can add update/create/delete notes here ...
};
