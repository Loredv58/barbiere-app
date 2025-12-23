import React, { useState } from "react";

function AdminLogin({ onLoginSuccess, onCancel }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("adminToken", data.token);
        onLoginSuccess();
      } else {
        setError(data.message || "Login fallito");
      }
    } catch (err) {
      setError("Errore di connessione");
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div style={{ marginTop: 10 }}>
          <button type="submit">Login</button>
          <button
            type="button"
            onClick={onCancel}
            style={{ marginLeft: 10 }}
          >
            Indietro
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminLogin;

