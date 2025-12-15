import React, { useState } from "react";

function ReservationForm({ selectedDate, selectedSlot, onReservationDone }) {
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

      if (!res.ok) {
        throw new Error(data.message || "Errore nella prenotazione");
      }

      alert(data.message);
      onReservationDone();

      // Reset form
      setForm({
        name: "",
        surname: "",
        email: "",
        phone: "",
      });
    } catch (err) {
      console.error(err);
      alert("Errore: " + err.message);
    }
  };

  return (
    <div>
      <h2>
        Prenota il {selectedDate} alle {selectedSlot}
      </h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Nome"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="surname"
          placeholder="Cognome"
          value={form.surname}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="phone"
          placeholder="Telefono"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <button type="submit">Conferma Prenotazione</button>
      </form>
    </div>
  );
}

export default ReservationForm;

