import React, { useEffect, useState } from "react";

function SlotsList({ selectedDate, onSelectSlot, onBack }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!selectedDate) return;

    setLoading(true);
    setError("");
    setSlots([]);

    fetch(`${apiUrl}/slots?date=${selectedDate}`)
      .then((res) => {
        if (!res.ok) throw new Error("Errore nel caricamento degli slot");
        return res.json();
      })
      .then((data) => setSlots(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error(err);
        setError("Errore nel recupero degli slot");
      })
      .finally(() => setLoading(false));
  }, [apiUrl, selectedDate]);

  if (!selectedDate) {
    return <p>Seleziona prima una data dal calendario</p>;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        width: "100%",
        minHeight: "70vh",
        padding: 20,
        backgroundImage: "url('/barber-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          maxWidth: 400,
          width: "100%",
        }}
      >
        {/* Tasto indietro */}
        {onBack && (
          <button
            onClick={onBack}
            style={{
              marginBottom: 10,
              padding: "6px 12px",
              borderRadius: 6,
              border: "none",
              backgroundColor: "#f4c542",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            ← Torna indietro
          </button>
        )}

        <h2>Slot disponibili per {selectedDate}</h2>

        {loading && <p>Caricamento slot...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && slots.length === 0 && <p>Nessuno slot disponibile</p>}
        {!loading && !error && slots.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {slots.map((slot, index) => (
              <li key={index} style={{ marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>{slot}</span>
                <button
                  onClick={() => onSelectSlot(slot)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: "none",
                    backgroundColor: "#f4c542",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Prenota
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SlotsList;

