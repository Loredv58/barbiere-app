import React, { useState } from "react";
import axios from "axios";

function UserLogin({ onLoginSuccess, onBack }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiUrl = process.env.REACT_APP_API_URL;

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
        onSubmit={handleLogin}
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
          Login Utente
        </h2>

        <input
          type="email"
          placeholder="Inserisci la tua email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          {loading ? "Caricamento..." : "Accedi"}
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

export default UserLogin;

