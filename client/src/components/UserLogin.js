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
      // res.data.token e res.data.reservations
      localStorage.setItem("userToken", res.data.token);
      onLoginSuccess(res.data.reservations);
    } catch (err) {
      setError(err.response?.data?.message || "Errore login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", textAlign: "center" }}>
      <h2>Login Utente</h2>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          type="email"
          placeholder="Inserisci la tua email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Caricamento..." : "Accedi"}
        </button>
        <button type="button" onClick={onBack} style={{ marginTop: 10 }}>
          Torna indietro
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
    </div>
  );
}

export default UserLogin;
