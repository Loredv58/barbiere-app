import React, { useState } from "react";

function ReservationForm({ selectedDate, selectedSlot, onReservationDone, onBack }) {
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
  });

  const apiUrl = process.env.REACT_APP_API_URL;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedSlot) {
      alert("Seleziona prima una data e uno slot.");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/reserve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          date: selectedDate,
          time: selectedSlot,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Errore nella prenotazione");

      alert(data.message);
      onReservationDone();

      // Reset form
      setForm({ name: "", surname: "", email: "", phone: "" });
    } catch (err) {
      console.error(err);
      alert("Errore: " + err.message);
    }
  };

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

        <h2 style={{ marginBottom: 20 }}>
          Prenota il {selectedDate} alle {selectedSlot}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input
            name="name"
            placeholder="Nome"
            value={form.name}
            onChange={handleChange}
            required
            style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          />
          <input
            name="surname"
            placeholder="Cognome"
            value={form.surname}
            onChange={handleChange}
            required
            style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          />
          <input
            name="phone"
            placeholder="Telefono"
            value={form.phone}
            onChange={handleChange}
            required
            style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          />
          <button
            type="submit"
            style={{
              padding: 10,
              borderRadius: 6,
              border: "none",
              backgroundColor: "#f4c542",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: 10,
            }}
          >
            Conferma Prenotazione
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReservationForm;
