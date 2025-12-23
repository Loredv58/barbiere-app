import React, { useState } from "react";
import axios from "axios";

function UserDashboard({ reservations, onLogout, onUpdateReservation }) {
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [error, setError] = useState("");

  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("userToken");

  const handleDelete = async (id) => {
    if (!window.confirm("Sei sicuro di voler cancellare questa prenotazione?")) return;
    setLoading(true);
    try {
      await axios.delete(`${apiUrl}/user/reservations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onUpdateReservation(id, "delete");
    } catch (err) {
      setError(err.response?.data?.message || "Errore eliminazione");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    if (!newDate || !newTime) {
      setError("Inserisci nuova data e orario");
      return;
    }
    setLoading(true);
    try {
      await axios.put(
        `${apiUrl}/user/reservations/${id}`,
        { date: newDate, time: newTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdateReservation(id, "update", { date: newDate, time: newTime });
      setSelectedId(null);
      setNewDate("");
      setNewTime("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Errore aggiornamento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>Le tue prenotazioni</h2>
      <button onClick={onLogout} style={{ marginBottom: 20 }}>
        Logout
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Data</th>
            <th>Orario</th>
            <th>Nome</th>
            <th>Cognome</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr key={r.id} style={{ borderBottom: "1px solid #ccc" }}>
              <td>{r.date}</td>
              <td>{r.time}</td>
              <td>{r.name}</td>
              <td>{r.surname}</td>
              <td>
                {selectedId === r.id ? (
                  <>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                    />
                    <input
                      type="time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                    />
                    <button onClick={() => handleUpdate(r.id)} disabled={loading}>
                      Salva
                    </button>
                    <button onClick={() => setSelectedId(null)}>Annulla</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setSelectedId(r.id)}>Modifica</button>
                    <button onClick={() => handleDelete(r.id)}>Elimina</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserDashboard;
