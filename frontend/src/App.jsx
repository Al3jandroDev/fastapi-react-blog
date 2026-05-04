import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Posts from "./pages/Posts";
import CreatePost from "./pages/CreatePost";
import { getPosts } from "./api/posts";
import { getMe } from "./api/auth"; 

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);


  useEffect(() => {
    if (!token) return;

    (async () => {
      await Promise.all([loadUser(), loadPosts()]);
    })();
  }, [token]);

  const loadUser = async () => {
    try {
      const data = await getMe();
      setUser(data);
    } catch (err) {
      console.error("Failed to load user", err);
    }
  };

  const loadPosts = async () => {
    const data = await getPosts();
    setPosts(data);
  };

  const handleNewPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleDelete = (id) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleLogin = (token) => {
  setToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">

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

      <main className="main-content">

        <CreatePost onPostCreated={handleNewPost} />

        <Posts
          posts={posts}
          setPosts={setPosts}
          onDelete={handleDelete}
        />

      </main>
    </div>
  );
}