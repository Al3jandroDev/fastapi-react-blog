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


export default function App() {

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [user, setUser] = useState(null);

  const [posts, setPosts] = useState([]);

  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();





  // ======================
  // LOAD DATA
  // ======================
  useEffect(() => {

    loadPosts();

    if (token) {
      loadUser();
    }

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


  // ======================
  // MAIN APP
  // ======================
  return (

    <div className="app-container">

      {/* NAVBAR */}
      <nav className="navbar">

        <h2
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          FastAPI Social
        </h2>

        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >

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
                setPosts={setPosts}
                user={user}
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