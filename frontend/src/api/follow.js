import API_URL from "./client";


// =========================
// FOLLOW USER
// =========================
export async function followUser(userId) {

  const token = localStorage.getItem("token");

  const res = await fetch(
    `${API_URL}/follow/${userId}`,
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  

  if (!res.ok) {
    throw new Error("Failed to follow user");
  }

  return await res.json();
}

