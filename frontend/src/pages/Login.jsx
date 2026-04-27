import { useState } from "react";
import { login } from "../api/auth";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await login(username, password);

      localStorage.setItem("token", data.access_token);
      if (onLogin) onLogin(data.access_token);
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="google-page">
      <div className="google-card">

        {/* LOGO GOOGLE STYLE */}
        <div className="google-logo">
          <span className="g-blue">G</span>
          <span className="g-red">o</span>
          <span className="g-yellow">o</span>
          <span className="g-blue2">g</span>
          <span className="g-green">l</span>
          <span className="g-red">e</span>
        </div>

        <h2>Sign in</h2>

        <input
          placeholder="Email or username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className="error">{error}</div>}

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Loading..." : "Next"}
        </button>
      </div>
    </div>
  );
}