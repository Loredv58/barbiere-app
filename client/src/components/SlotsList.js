import React, { useEffect, useState } from "react";

function SlotsList({ onSelectSlot }) {
  const [slots, setSlots] = useState([]);

  // URL backend dal .env
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/slots`)
      .then((res) => res.json())
      .then((data) => setSlots(data))
      .catch((err) => console.error(err));
  }, [apiUrl]);

  return (
    <div>
      <h2>Slot disponibili</h2>
      <ul>
        {slots.map((slot, index) => (
          <li key={index}>
            {slot} <button onClick={() => onSelectSlot(slot)}>Prenota</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SlotsList;
