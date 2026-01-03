import React, { useEffect, useState } from "react";

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("it-IT");
}

function AdminDashboard({ onLogout }) {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(""); // Data selezionata
  const token = localStorage.getItem("adminToken");

  // URL backend dal .env
  const apiUrl = process.env.REACT_APP_API_URL;

  // Carica le prenotazioni quando cambia la data o il token
  useEffect(() => {
    if (!token || !selectedDate) return;

    fetch(`${apiUrl}/admin/reservations?date=${selectedDate}`, {
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
  }, [token, apiUrl, selectedDate]);

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
    setSelectedDate(""); // resetta la data selezionata
    onLogout();
  };

  const formatService = (service) => {
    if (service === "taglio_barba") return "Taglio + Barba";
    if (service === "taglio") return "Taglio";
    return "-";
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Dashboard Admin</h2>

      <div style={{ marginBottom: "15px" }}>
        <label>Seleziona giorno: </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <button onClick={handleDownload}>Scarica Excel</button>
        <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
          Logout
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!selectedDate && <p>Seleziona un giorno dal calendario</p>}

      {selectedDate && (
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
              <th>Servizio</th> {/* ✅ Nuova colonna */}
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
                  <td>{formatDate(r.date)}</td>
                  <td>{r.time}</td>
                  <td>{formatService(r.service)}</td> {/* ✅ Mostra servizio */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  Nessuna prenotazione disponibile
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboard;
