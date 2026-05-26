import { useEffect, useState } from "react";

import {
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Posts from "./pages/Posts";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";

import { getPosts } from "./api/posts";
import { getMe } from "./api/auth";
import { useNavigate } from "react-router-dom";

import { usePostStore } from "./store/usePostStore";


export default function App() {

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);


  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);

  const posts = usePostStore((s) => s.posts);
  const setPosts = usePostStore((s) => s.setPosts);
  const toggleLike = usePostStore((s) => s.toggleLike);

  const handleLike = (postId) => {
    toggleLike(postId);
  };




  // ======================
  // LOAD DATA
  // ======================
  useEffect(() => {

    loadPosts();

    if (token) {
      loadUser();
    } else {
      setLoadingUser(false);
    }

  }, [token]);

  // DARK MODE
  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);


  // ======================
  // LOAD USER
  // ======================

  const loadUser = async () => {

    try {

      setLoadingUser(true);

      const data = await getMe();

      setUser(data);

    } catch (err) {

      console.error("Failed to load user", err);

    } finally {

      setLoadingUser(false);
    }
  };


  // ======================
  // LOAD POSTS
  // ======================
  const loadPosts = async () => {

    try {

      const data = await getPosts();

      setPosts(data);

    } catch (err) {

      console.error(err);
    }
  };


  // ======================
  // NEW POST UI UPDATE
  // ======================
  const handleNewPost = (newPost) => {

    setPosts((prev) => [newPost, ...prev]);
  };


  // ======================
  // LOGIN
  // ======================
  const handleLogin = (access_token) => {

    setToken(access_token);

    localStorage.setItem(
      "token",
      access_token
    );
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
  // LOGIN / REGISTER VIEW
  // ======================
  if (!token) {

    return isRegistering ? (

      <Register
        onSwitchToLogin={() =>
          setIsRegistering(false)
        }
      />

    ) : (

      <Login
        onLogin={handleLogin}
        onSwitchToRegister={() =>
          setIsRegistering(true)
        }
      />
    );
  }

  if (loadingUser) {
    return <p>Loading...</p>;
  }


  // ======================
  // MAIN APP
  // ======================


  return (

    <div className="app-container">

      {/* NAVBAR */}
      <nav className="navbar">

        <h2 onClick={() => navigate("/")}>
          FastAPI Social
        </h2>

        <div className="nav-right">

          <button onClick={() => setDark(!dark)}>
            {dark ? "☀️" : "🌙"}
          </button>

          <button
            className="nav-user-btn"
            onClick={() => navigate(`/users/${user.id}`)}
          >
            👤 @{user?.username}
          </button>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>

        </div>

      </nav>


      {/* ROUTES */}
      <Routes>

        {/* HOME FEED */}
        <Route
          path="/"
          element={

            <main className="main-content">

              <CreatePost
                onPostCreated={handleNewPost}
              />

              <Posts
                posts={posts}
                user={user}
                onLike={handleLike}
              />

            </main>
          }
        />


        {/* USER PROFILE */}
        <Route
          path="/users/:id"
          element={<Profile />}
        />


      </Routes>

    </div>
  );
}