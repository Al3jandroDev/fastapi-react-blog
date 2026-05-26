import { useParams, useNavigate } from "react-router-dom";
import { usePostStore } from "../store/usePostStore";

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const posts = usePostStore((s) => s.posts);

  const IMAGE_BASE = "http://127.0.0.1:8000";

  const userPosts = posts.filter(
    (p) => String(p.author_id) === String(id)
  );

  const profile = userPosts[0]?.user;

  const username =
    profile?.username || userPosts[0]?.author_username;

  return (
    <div className="profile-container">

      <button onClick={() => navigate("/")}>
        ← Back to feed
      </button>

      {/* ================= BANNER ================= */}
      <div style={{ position: "relative" }}>

        {profile?.banner_url ? (
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
          {profile?.avatar_url ? (
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
                fontSize: "24px"
              }}
            >
              👤
            </div>
          )}
        </div>
      </div>

      {/* ================= INFO ================= */}
      <div style={{ marginTop: "60px" }}>
        <h2>@{username || "User"}</h2>
        <p>{userPosts.length} posts</p>
      </div>

      {/* ================= POSTS ================= */}
      {userPosts.map((post) => (
        <div key={post.id}>
          <h4>{post.title}</h4>
          <p>{post.content}</p>
          <small>❤️ {post.likes_count}</small>
        </div>
      ))}
    </div>
  );
}