import API_URL from "./client";


/**
 * Like a post
 */
export async function likePost(postId) {

  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/posts/${postId}/like`, {
    method: "POST",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Failed to like post");
  }

  return await res.json();
}


/**
 * Unlike a post
 */
export async function unlikePost(postId) {

  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/posts/${postId}/like`, {
    method: "DELETE",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Failed to unlike post");
  }

  return await res.json();
}