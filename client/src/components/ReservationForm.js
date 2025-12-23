import React, { useState } from "react";

function ReservationForm({
  selectedDate,
  selectedSlot,
  onReservationDone,
  onBack,
}) {
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
  });

  const apiUrl = process.env.REACT_APP_API_URL;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    if (!res.ok) return alert(data.message || "Errore");

    alert("Prenotazione confermata!");
    onReservationDone();
  };

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
          Prenota<br />
          {selectedDate} – {selectedSlot}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
          <input name="name" placeholder="Nome" required onChange={handleChange} />
          <input name="surname" placeholder="Cognome" required onChange={handleChange} />
          <input name="email" type="email" placeholder="Email" required onChange={handleChange} />
          <input name="phone" placeholder="Telefono" required onChange={handleChange} />

          <button
            type="submit"
            style={{
              marginTop: 10,
              padding: 10,
              background: "#f4c542",
              border: "none",
              borderRadius: 6,
              fontWeight: "bold",
              cursor: "pointer",
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

