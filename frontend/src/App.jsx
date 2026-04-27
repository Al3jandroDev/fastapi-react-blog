import { useState } from "react";
import Login from "./pages/Login";
import Posts from "./pages/Posts";
import CreatePost from "./pages/CreatePost";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>

      <CreatePost />
      <Posts />
    </div>
  );
}