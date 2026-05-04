// Import base API URL (e.g., http://localhost:8000)  
import API_URL from "./client";


/**
 * Login user with username and password
 * Sends credentials to backend and returns JWT token
 */
export async function login(username, password) {

  // Send POST request to /auth/login
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",

    // Set request headers
    headers: {
      "Content-Type": "application/json"
    },

    // Send credentials in request body
    body: JSON.stringify({ username, password })
  });


  // Handle failed login (invalid credentials, etc.)
  if (!res.ok) {
    throw new Error("Login failed");
  }

  // Parse and return response (access_token, token_type)
  return await res.json();
}


export async function register(username, email, password) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Register failed");
  }

  return await res.json();
}


export async function getMe() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    localStorage.removeItem("token");
    throw new Error("Unauthorized");
  }

  return await res.json();
}