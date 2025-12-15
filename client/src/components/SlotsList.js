import React, { useEffect, useState } from "react";

function SlotsList({ selectedDate, onSelectSlot }) {
  const [slots, setSlots] = useState([]);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!selectedDate) return;

    fetch(`${apiUrl}/slots?date=${selectedDate}`)
      .then((res) => res.json())
      .then((data) => setSlots(data))
      .catch((err) => console.error(err));
  }, [apiUrl, selectedDate]);

  if (!selectedDate) {
    return <p>Seleziona prima una data dal calendario</p>;
  }

  return (
    <div>
      <h2>Slot disponibili per {selectedDate}</h2>

      {slots.length === 0 ? (
        <p>Nessuno slot disponibile</p>
      ) : (
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
