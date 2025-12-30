import React from "react";

function ServiceSelect({ onSelect, onBack }) {
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
          ← Torna indietro
        </button>

        <h2 style={{ marginBottom: 10 }}>Scegli il servizio</h2>
        <p style={{ marginBottom: 25, opacity: 0.7 }}>
          Seleziona il tipo di appuntamento
        </p>

        <button
          onClick={() => onSelect("taglio")}
          style={{
            width: "100%",
            padding: "16px 0",
            marginBottom: 15,
            borderRadius: 10,
            border: "2px solid #000",
            background: "#fff",
            fontSize: 16,
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "#f4c542")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "#fff")
          }
        >
          ✂️ Taglio
        </button>

        <button
          onClick={() => onSelect("taglio_barba")}
          style={{
            width: "100%",
            padding: "16px 0",
            borderRadius: 10,
            border: "2px solid #000",
            background: "#fff",
            fontSize: 16,
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "#f4c542")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "#fff")
          }
        >
          ✂️🧔 Taglio + Barba
        </button>
      </div>
    </div>
  );
}

export default ServiceSelect;
