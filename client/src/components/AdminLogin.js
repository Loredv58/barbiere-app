import React, { useState } from "react";

function AdminLogin({ onLoginSuccess, onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputStyle = {
    padding: "12px",
    fontSize: 15,
    borderRadius: 8,
    border: "1px solid #ccc",
    width: "100%",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    padding: "12px",
    fontSize: 15,
    borderRadius: 8,
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
    width: "100%",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        backgroundImage: "url('/barber-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "rgba(255,255,255,0.95)",
          padding: 24,
          borderRadius: 12,
          maxWidth: 400,
          width: "100%",
          boxShadow: "2px 2px 10px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 10 }}>
          Login Proprietario
        </h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />

        {error && <p style={{ color: "red", fontSize: 14 }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            ...buttonStyle,
            backgroundColor: "#f4c542",
            color: "#000",
            boxShadow: "2px 2px 6px rgba(0,0,0,0.3)",
          }}
        >
          {loading ? "Caricamento..." : "Login"}
        </button>

        <button
          type="button"
          onClick={onBack}
          style={{
            ...buttonStyle,
            backgroundColor: "#333",
            color: "#fff",
          }}
        >
          Indietro
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;

