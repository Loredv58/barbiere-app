import React, { useState } from "react";

/* 📅 Formattazione data per UI (italiano, leggibile) */
function formatDateItalian(dateString) {
  const date = new Date(dateString);
  const formatted = date.toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function ReservationForm({
  selectedDate,
  selectedSlot,
  selectedService,
  onReservationDone,
  onBack,
}) {
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiUrl = process.env.REACT_APP_API_URL;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/reserve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          date: selectedDate,
          time: selectedSlot,
          service: selectedService,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Errore nella prenotazione");

      alert("Prenotazione confermata!");
      onReservationDone();
    } catch (err) {
      setError(err.message || "Errore di connessione");
    } finally {
      setLoading(false);
    }
  };

  const serviceLabel =
    selectedService === "taglio_barba" ? "Taglio + Barba" : "Taglio";

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

        <h2 style={{ marginBottom: 10 }}>Conferma Prenotazione</h2>

        {/* 📋 RIEPILOGO */}
        <div
          style={{
            background: "#f7f7f7",
            padding: 12,
            borderRadius: 10,
            marginBottom: 18,
            fontSize: 14,
            textAlign: "left",
          }}
        >
          <p><strong>Servizio:</strong> {serviceLabel}</p>
          <p><strong>Data:</strong> {formatDateItalian(selectedDate)}</p>
          <p><strong>Orario:</strong> {selectedSlot}</p>
        </div>

        <form style={{ display: "grid", gap: 12 }} onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Nome"
            required
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            name="surname"
            placeholder="Cognome"
            required
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            name="phone"
            placeholder="Telefono"
            required
            onChange={handleChange}
            style={inputStyle}
          />

          {error && <p style={{ color: "red", fontSize: 14 }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px 0",
              backgroundColor: "#f4c542",
              border: "none",
              borderRadius: 8,
              fontWeight: "bold",
              fontSize: 16,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Conferma in corso…" : "Conferma Prenotazione"}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: 10,
  borderRadius: 6,
  border: "1px solid #ccc",
  fontSize: 15,
};

export default ReservationForm;
