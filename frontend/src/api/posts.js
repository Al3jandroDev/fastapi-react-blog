// Import base API URL
import API_URL from "./client";

/**
 * Fetch all posts (public endpoint)
 */
export async function getPosts() {

  // Send GET request to backend
  const res = await fetch(`${API_URL}/posts`);

  // Handle request errors
  if (!res.ok) {
    throw new Error("Error fetching posts");
  }

  // Return parsed JSON data
  return await res.json();
}


/**
 * Create a new post (requires authentication)
 */
export async function createPost(title, content) {

  // Retrieve JWT token from localStorage
  const token = localStorage.getItem("token");

  // Send POST request with auth header
  const res = await fetch("http://127.0.0.1:8000/posts/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",

      // Attach Bearer token for authentication
      Authorization: `Bearer ${token}`
    },

    // Send post data
    body: JSON.stringify({ title, content })
  });

  // Handle errors (e.g., unauthorized, validation)
  if (!res.ok) {
    throw new Error("Error creating post");
  }

  // Return created post
  return await res.json();
}


