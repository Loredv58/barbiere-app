import React, { useEffect, useState } from "react";

function SlotsList({
  selectedDate,
  onSelectSlot,
  onBack,
  slotsCache,
  setSlotsCache,
}) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!selectedDate) return;

    // ✅ SLOT GIÀ IN CACHE → USALI SUBITO
    if (slotsCache[selectedDate]) {
      setSlots(slotsCache[selectedDate]);
      return;
    }

    // ❌ ALTRIMENTI FETCH (una sola volta)
    setLoading(true);
    setError("");

    fetch(`${apiUrl}/slots?date=${selectedDate}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        const safeData = Array.isArray(data) ? data : [];
        setSlots(safeData);

        // 🔹 salva in cache
        setSlotsCache((prev) => ({
          ...prev,
          [selectedDate]: safeData,
        }));
      })
      .catch(() => setError("Errore nel recupero degli slot"))
      .finally(() => setLoading(false));
  }, [apiUrl, selectedDate, slotsCache, setSlotsCache]);

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
          background: "rgba(255,255,255,0.96)",
          padding: 20,
          borderRadius: 14,
          maxWidth: 420,
          width: "100%",
          boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
          textAlign: "center",
        }}
      >
        {/* 🔙 BACK */}
        <button
          onClick={onBack}
          style={{
            marginBottom: 12,
            background: "#f4c542",
            border: "none",
            padding: "6px 14px",
            borderRadius: 6,
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          ← Torna indietro
        </button>

        <h2 style={{ marginBottom: 15 }}>
          Slot disponibili<br />
          <small>{selectedDate}</small>
        </h2>

        {loading && (
          <div style={{ margin: "20px 0" }}>
            {/* Spinner elegante */}
            <div
              style={{
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #f4c542",
                borderRadius: "50%",
                width: 40,
                height: 40,
                animation: "spin 1s linear infinite",
                margin: "0 auto",
              }}
            />
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
            <p style={{ marginTop: 10, fontSize: 14, opacity: 0.7 }}>
              Caricamento slot…
            </p>
          </div>
        )}

        {error && (
          <p style={{ color: "red", textAlign: "center" }}>{error}</p>
        )}

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
                padding: "10px 0",
                borderRadius: 8,
                border: "1px solid #ccc",
                background: "#fff",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f4c542")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
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
