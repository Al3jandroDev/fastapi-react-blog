import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUser } from "../api/users";

export default function UserProfile() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      const data = await getUser(id);
      setUser(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className="profile">

      <h2>👤 @{user.username}</h2>

      <p>{user.bio || "No bio yet"}</p>

      <h3>Posts</h3>

      {user.posts.map((post) => (
        <div key={post.id} className="post">
          <h4>{post.title}</h4>
          <p>{post.content}</p>
        </div>
      ))}

    </div>
  );
}