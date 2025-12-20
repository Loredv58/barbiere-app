import React, { useEffect, useState } from "react";

function SlotsList({ selectedDate, onSelectSlot }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!selectedDate) return;

    setLoading(true);
    setError("");
    setSlots([]);

    fetch(`${apiUrl}/slots?date=${selectedDate}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Errore nel caricamento degli slot");
        }
        return res.json();
      })
      .then((data) => {
        setSlots(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error(err);
        setError("Errore nel recupero degli slot");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [apiUrl, selectedDate]);

  if (!selectedDate) {
    return <p>Seleziona prima una data dal calendario</p>;
  }

  return (
    <div>
      <h2>Slot disponibili per {selectedDate}</h2>

      {loading && <p>Caricamento slot...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && slots.length === 0 && (
        <p>Nessuno slot disponibile</p>
      )}

      {!loading && !error && slots.length > 0 && (
        <ul>
          {slots.map((slot, index) => (
            <li key={index}>
              {slot}{" "}
              <button onClick={() => onSelectSlot(slot)}>
                Prenota
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SlotsList;
