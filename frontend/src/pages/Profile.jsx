import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUser } from "../api/users";

const IMAGE_BASE = "http://127.0.0.1:8000";

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    try {
      const data = await getUser(id);
      setProfile(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="profile-container">

      <button onClick={() => navigate("/")}>
        ← Back to feed
      </button>

      {/* ================= BANNER ================= */}
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

        {/* ================= AVATAR ================= */}
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
                border: "4px solid white"
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
                justifyContent: "center"
              }}
            >
              👤
            </div>
          )}
        </div>
      </div>

      {/* ================= INFO ================= */}
      <div style={{ marginTop: "60px" }}>
        <h2>@{profile.username}</h2>

        <p>{profile.bio}</p>

        <p>
          {profile.followers_count} followers ·{" "}
          {profile.following_count} following
        </p>

        <p>{profile.posts.length} posts</p>
      </div>

      {/* ================= POSTS ================= */}
      <div className="posts-grid">
        {profile.posts.map((post) => (
          <div key={post.id} className="post-card">

            <h4>{post.title}</h4>

            {post.image_url && (
              <img
                src={`${IMAGE_BASE}${post.image_url}`}
                alt=""
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  marginBottom: "8px"
                }}
              />
            )}

            <p>{post.content}</p>

            <button>
              ❤️ {post.likes_count || 0}
            </button>

          </div>
        ))}
      </div>

    </div>
  );
}