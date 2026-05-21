import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "../api/client";

export default function Profile() {
  const { id } = useParams();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const IMAGE_BASE = "http://127.0.0.1:8000";

  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/users/${id}`);

      if (!res.ok) {
        throw new Error("Failed to load profile");
      }

      const data = await res.json();
      setProfile(data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (!profile) return <p>Profile not found</p>;

 return (
  <div className="profile-container">

    <button
      className="back-btn"
      onClick={() => navigate("/")}
    >
      ← Back to feed
    </button>

    {/* BANNER */}
    <div style={{ position: "relative" }}>

      {profile.banner_url ? (
        <img
          src={`${IMAGE_BASE}${profile.banner_url}`}
          alt="banner"
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "12px"
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "200px",
            background: "#e5e7eb",
            borderRadius: "12px"
          }}
        />
      )}

      {/* AVATAR FLOTTANTE */}
      <div
        style={{
          position: "absolute",
          bottom: "-40px",
          left: "20px"
        }}
      >
        {profile.avatar_url ? (
          <img
            src={`${IMAGE_BASE}${profile.avatar_url}`}
            alt="avatar"
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "4px solid white",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
            }}
          />
        ) : (
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "#ddd",
              border: "4px solid white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
            }}
          >
            👤
          </div>
        )}
      </div>

    </div>

    {/* INFO */}
    <div style={{ marginTop: "60px" }}>

      <h2 style={{ marginBottom: "4px" }}>
        @{profile.username}
      </h2>

      <p style={{ color: "#666" }}>
        {profile.bio}
      </p>

      {/* STATS */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "10px"
        }}
      >
        <div>
          <strong>{profile.followers_count ?? 0}</strong> Followers
        </div>

        <div>
          <strong>{profile.following_count ?? 0}</strong> Following
        </div>
      </div>

      <small style={{ color: "#888", display: "block", marginTop: "6px" }}>
        Joined {profile.created_at}
      </small>

    </div>

    {/* POSTS */}
    <div className="profile-posts">

      <h3>Posts</h3>

      {profile.posts.length === 0 ? (
        <p>No posts yet</p>
      ) : (
        profile.posts.map((post) => (
          <div
            key={post.id}
            className="profile-post"
            style={{
              marginTop: "15px",
              padding: "10px",
              border: "1px solid #eee",
              borderRadius: "10px"
            }}
          >
            <h4>{post.title}</h4>
            <p>{post.content}</p>
            <small>❤️ {post.likes_count ?? 0}</small>
          </div>
        ))
      )}

    </div>

  </div>
);
}