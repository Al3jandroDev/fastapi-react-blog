import API_URL from "./client";


// =========================
// GET COMMENTS
// =========================
export async function getComments(postId) {

  const res = await fetch(
    `${API_URL}/comments/${postId}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch comments");
  }

  return await res.json();
}


// =========================
// CREATE COMMENT
// =========================
export async function createComment(
  postId,
  content
) {

  const token = localStorage.getItem("token");

  const res = await fetch(
    `${API_URL}/comments/${postId}`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        content,
      }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to create comment");
  }

  return await res.json();
}