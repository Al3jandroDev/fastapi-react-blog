import { useEffect, useState } from "react";
import API_URL from "../api/client";
import { followUser } from "../api/follow";

export default function FollowButton({ userId }) {

  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const check = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/follow/check/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setIsFollowing(data.following);
    };

    if (userId) check();
  }, [userId]);

  const handleFollow = async () => {
    if (loading) return;

    setLoading(true);

    try {
      setIsFollowing((prev) => !prev); // optimista
      await followUser(userId);        // backend toggle
    } catch (err) {
      console.error(err);
      setIsFollowing((prev) => !prev); // rollback si falla
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleFollow}>
      {loading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}