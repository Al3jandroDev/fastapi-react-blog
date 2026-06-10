import API_URL from "./client";

export async function getUser(userId) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }

  return await res.json();
}