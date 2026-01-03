import React from "react";

function ServiceSelect({ onSelect, onBack }) {
  const buttonStyle = {
    width: "100%",
    padding: "14px",
    fontSize: 15,
    borderRadius: 8,
    border: "2px solid #000",
    fontWeight: "bold",
    cursor: "pointer",
    backgroundColor: "#fff",
    transition: "background-color 0.2s",
  };

  const backButtonStyle = {
    padding: "10px",
    fontSize: 14,
    borderRadius: 8,
    border: "none",
    backgroundColor: "#333",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    width: "100%",
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
      <div
        style={{
          background: "rgba(255,255,255,0.95)",
          padding: 24,
          borderRadius: 12,
          maxWidth: 400,
          width: "100%",
          boxShadow: "2px 2px 10px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          textAlign: "center",
        }}
      >
        <h2>Scegli il servizio</h2>
        <p style={{ opacity: 0.7, fontSize: 14 }}>
          Seleziona il tipo di appuntamento
        </p>

        <button
          style={buttonStyle}
          onClick={() => onSelect("taglio")}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#f4c542")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#fff")
          }
        >
          ✂️ Taglio
        </button>

        <button
          style={buttonStyle}
          onClick={() => onSelect("taglio_barba")}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#f4c542")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#fff")
          }
        >
          ✂️🧔 Taglio + Barba
        </button>

        <button
          type="button"
          onClick={onBack}
          style={backButtonStyle}
        >
          Indietro
        </button>
      </div>
    </div>
  );
}

export default ServiceSelect;

