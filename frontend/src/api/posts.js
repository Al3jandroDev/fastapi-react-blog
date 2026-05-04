import API_URL from "./client";

/**
 * Fetch all posts
 */
export async function getPosts() {
  const res = await fetch(`${API_URL}/posts`);

  if (!res.ok) {
    throw new Error("Error fetching posts");
  }

  return await res.json();
}

/**
 * Create post
 */
export async function createPost(title, content) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/posts/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content }),
  });

  if (!res.ok) {
    throw new Error("Error creating post");
  }

  return await res.json();
}

/**
 * UPDATE POST (🔥 TE FALTA ESTO)
 */
export async function updatePost(id, data) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/posts/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Error updating post");
  }

  return await res.json();
}

/**
 * DELETE POST (🔥 ESTE ES TU ERROR PRINCIPAL)
 */
export async function deletePost(id) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/posts/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error deleting post");
  }

  return true;
}