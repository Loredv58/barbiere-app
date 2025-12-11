import React, { useEffect, useState } from "react";

function SlotsList({ onSelectSlot }) {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/slots")
      .then((res) => res.json())
      .then((data) => setSlots(data))
      .catch((err) => console.error(err));
  }, []);

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
