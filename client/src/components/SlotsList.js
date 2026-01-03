import React, { useEffect, useState } from "react";

/* 📅 Formattazione data per UI (italiano, leggibile) */
function formatDateItalian(dateString) {
  const date = new Date(dateString);

  const formatted = date.toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Capitalizza prima lettera (Giovedì, Gennaio, ecc.)
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

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

    // ✅ usa cache se disponibile
    if (slotsCache[selectedDate]) {
      setSlots(slotsCache[selectedDate]);
      return;
    }

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
          padding: 25,
          borderRadius: 16,
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
            marginBottom: 15,
            background: "#f4c542",
            border: "none",
            padding: "6px 14px",
            borderRadius: 6,
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          ← Indietro
        </button>

        {/* 📅 TITOLO */}
        <h2 style={{ marginBottom: 6 }}>Slot disponibili</h2>
        <p style={{ marginBottom: 20, opacity: 0.75 }}>
          📅 {formatDateItalian(selectedDate)}
        </p>

        {/* ⏳ LOADING */}
        {loading && (
          <div style={{ margin: "25px 0" }}>
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

        {/* ❌ ERRORE */}
        {error && (
          <p style={{ color: "red", marginBottom: 10 }}>{error}</p>
        )}

        {/* 😕 NESSUNO SLOT */}
        {!loading && slots.length === 0 && (
          <p style={{ opacity: 0.7 }}>Nessuno slot disponibile</p>
        )}

        {/* 🕒 SLOT */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
            gap: 12,
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
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f4c542")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#fff")
              }
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

