import React from "react";

function Calendar({ onSelectDate }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // mese corrente
  const startDay = 15; // dal 15 in poi

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function isDisabled(day) {
    const d = new Date(year, month, day);
    const weekday = d.getDay();
    if (day < startDay) return true;
    if (weekday === 0 || weekday === 1) return true;
    return false;
  }

  return (
    <div>
      <h2>Seleziona giorno</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const disabled = isDisabled(day);

          return (
            <button
              key={day}
              disabled={disabled}
              style={{
                margin: 4,
                opacity: disabled ? 0.3 : 1
              }}
              onClick={() =>
                onSelectDate(
                  `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                )
              }
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;
