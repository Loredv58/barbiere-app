import React, { useState } from "react";
import axios from "axios";

function UserLogin({ onLoginSuccess, onBack }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiUrl = process.env.REACT_APP_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${apiUrl}/user/login`, { email });
      localStorage.setItem("userToken", res.data.token);
      onLoginSuccess(res.data.reservations);
    } catch (err) {
      setError(err.response?.data?.message || "Errore login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('/barber-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.95)",
          padding: 30,
          borderRadius: 12,
          maxWidth: 400,
          width: "100%",
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: 20 }}>Login Utente</h2>
        <form onSubmit={handleLogin} style={{ display: "grid", gap: 15 }}>
          <input
            type="email"
            placeholder="Inserisci la tua email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: 10,
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: 16,
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: 12,
              borderRadius: 6,
              border: "none",
              backgroundColor: "#f4c542",
              color: "#000",
              fontWeight: "bold",
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            {loading ? "Caricamento..." : "Accedi"}
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
        {error && <p style={{ color: "red", marginTop: 15 }}>{error}</p>}
      </div>
    </div>
  );
}

export default UserLogin;

