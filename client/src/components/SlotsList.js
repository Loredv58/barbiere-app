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

    fetch(`${apiUrl}/slots?date=${selectedDate}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setSlots(data))
      .catch(() => setError("Errore nel recupero degli slot"))
      .finally(() => setLoading(false));
  }, [apiUrl, selectedDate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/barber-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.95)",
          padding: 20,
          borderRadius: 12,
          maxWidth: 420,
          width: "100%",
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
        }}
      >
        <button
          onClick={onBack}
          style={{
            marginBottom: 10,
            background: "#f4c542",
            border: "none",
            padding: "6px 12px",
            borderRadius: 6,
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          ← Torna indietro
        </button>

        <h2 style={{ textAlign: "center" }}>
          Slot disponibili<br />{selectedDate}
        </h2>

        {loading && <p style={{ textAlign: "center" }}>Caricamento slot…</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && slots.length === 0 && (
          <p style={{ textAlign: "center" }}>Nessuno slot disponibile</p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
            gap: 10,
            marginTop: 15,
          }}
        >
          {slots.map((slot) => (
            <button
              key={slot}
              onClick={() => onSelectSlot(slot)}
              style={{
                padding: 10,
                borderRadius: 6,
                border: "1px solid #ccc",
                background: "#fff",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SlotsList;
