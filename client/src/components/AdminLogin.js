import React, { useState } from "react";

function AdminLogin({ onLoginSuccess, onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
          padding: 20,
          borderRadius: 12,
          maxWidth: 400,
          width: "100%",
          boxShadow: "2px 2px 10px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <h2 style={{ textAlign: "center" }}>Login Admin</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p style={{ color: "red", marginTop: 5 }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 20px",
            backgroundColor: "#f4c542",
            border: "none",
            borderRadius: 8,
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: 16,
            boxShadow: "2px 2px 6px rgba(0,0,0,0.3)",
          }}
        >
          {loading ? "Caricamento..." : "Login"}
        </button>

        <button
            type="button"
            onClick={onBack}
            style={{
              padding: 10,
              borderRadius: 6,
              border: "none",
              backgroundColor: "#333",
              color: "#fff",
              fontWeight: "bold",
              fontSize: 14,
              cursor: "pointer",
              marginTop: 5,
            }}
        >
          Indietro
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
