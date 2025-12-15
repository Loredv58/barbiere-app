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

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${apiUrl}/reserve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        date: selectedDate,
        time: selectedSlot,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        onReservationDone();
      })
      .catch((err) => console.error(err));
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
          onChange={handleChange}
          required
        />
        <input
          name="surname"
          placeholder="Cognome"
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          name="phone"
          placeholder="Telefono"
          onChange={handleChange}
          required
        />
        <button type="submit">Conferma Prenotazione</button>
      </form>
    </div>
  );
}

export default ReservationForm;
