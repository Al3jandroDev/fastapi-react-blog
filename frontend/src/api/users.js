import API_URL from "./client";

export async function getUser(userId) {
  const res = await fetch(`${API_URL}/users/${userId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }

  return await res.json();
}