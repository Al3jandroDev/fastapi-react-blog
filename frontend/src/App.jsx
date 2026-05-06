import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Posts from "./pages/Posts";
import CreatePost from "./pages/CreatePost";

import { getPosts } from "./api/posts";
import { getMe } from "./api/auth";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  // 👉 controla si estás en login o register
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (!token) return;

    (async () => {
      await Promise.all([loadUser(), loadPosts()]);
    })();
  }, [token]);

  // ======================
  // LOAD USER
  // ======================
  const loadUser = async () => {
    try {
      const data = await getMe();
      setUser(data);
    } catch (err) {
      console.error("Failed to load user", err);
    }
  };

  // ======================
  // LOAD POSTS
  // ======================
  const loadPosts = async () => {
    const data = await getPosts();
    setPosts(data);
  };

  // ======================
  // CREATE POST UPDATE UI
  // ======================
  const handleNewPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  // ======================
  // DELETE POST UPDATE UI
  // ======================
  const handleDelete = (id) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  // ======================
  // LOGIN
  // ======================
  const handleLogin = (access_token) => {
    setToken(access_token);
    localStorage.setItem("token", access_token);
  };

  // ======================
  // LOGOUT
  // ======================
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // ======================
  // AUTH VIEW (LOGIN / REGISTER)
  // ======================
  if (!token) {
    return isRegistering ? (
      <Register onSwitchToLogin={() => setIsRegistering(false)} />
    ) : (
      <Login
        onLogin={handleLogin}
        onSwitchToRegister={() => setIsRegistering(true)}
      />
    );
  }

  // ======================
  // APP LOGGED IN
  // ======================
  return (
    <div className="app-container">

      {/* NAVBAR */}
      <nav className="navbar">
        <h2>FastAPI Blog CMS</h2>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span>
            {user ? `👤 @${user.username}` : "👤 loading..."}
          </span>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="main-content">

        {/* CREATE POST */}
        <CreatePost onPostCreated={handleNewPost} />

        {/* POSTS FEED */}
        <Posts
          posts={posts}
          setPosts={setPosts}
          onDelete={handleDelete}
          user={user}
        />

      </main>

    </div>
  );
}