import React, { useEffect, useState } from "react";

function AdminDashboard({ onLogout }) {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("adminToken");

  // URL backend dal .env
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!token) return;

    fetch(`${apiUrl}/reservations`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore nel recupero prenotazioni");
        return res.json();
      })
      .then((data) => setReservations(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error(err);
        setError("Token mancante o scaduto. Effettua il login di nuovo.");
        setReservations([]);
      });
  }, [token, apiUrl]);

  const handleDownload = async () => {
    if (!token) {
      alert("Token mancante. Effettua il login di nuovo.");
      onLogout();
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/export-reservations`, {
        headers: { Authorization: "Bearer " + token },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Errore download Excel");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "prenotazioni.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Errore: " + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    onLogout();
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Dashboard Proprietario</h2>

      <div style={{ marginBottom: "10px" }}>
        <button onClick={handleDownload}>Scarica Excel</button>
        <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
          Logout
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <table
        border="1"
        cellPadding="5"
        style={{ borderCollapse: "collapse", marginTop: "10px" }}
      >
        <thead>
          <tr>
            <th>Nome</th>
            <th>Cognome</th>
            <th>Email</th>
            <th>Telefono</th>
            <th>Data</th>
            <th>Orario</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(reservations) && reservations.length > 0 ? (
            reservations.map((r, index) => (
              <tr key={index}>
                <td>{r.name}</td>
                <td>{r.surname}</td>
                <td>{r.email}</td>
                <td>{r.phone}</td>
                <td>{r.date}</td>
                <td>{r.time}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                Nessuna prenotazione disponibile
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
