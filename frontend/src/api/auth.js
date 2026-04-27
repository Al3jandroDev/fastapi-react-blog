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