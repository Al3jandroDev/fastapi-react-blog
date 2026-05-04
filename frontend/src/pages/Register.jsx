import { useState } from "react";
import { register } from "../api/auth";

export default function Register({onSwitchToLogin  }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError(null);

      await register(username, email, password);

      // opcional: auto login o ir a login
      if (onSwitchToLogin ) onSwitchToLogin ();

    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="google-page">
      <div className="google-card">

        {/* LOGO */}
        <div className="google-logo">
          <span className="g-blue">G</span>
          <span className="g-red">o</span>
          <span className="g-yellow">o</span>
          <span className="g-blue2">g</span>
          <span className="g-green">l</span>
          <span className="g-red">e</span>
        </div>

        <h2>Create account</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className="error">{error}</div>}

        <button onClick={handleRegister} disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </button>

        <p style={{ textAlign: "center", marginTop: "10px" }}>
          Already have an account?{" "}
          <span
            style={{ color: "#3b82f6", cursor: "pointer" }}
            onClick={onSwitchToLogin}
          >
            Sign in
          </span>
        </p>

      </div>
    </div>
  );
}