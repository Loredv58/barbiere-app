import React from "react";

function Calendar({ onDateSelect }) {
  const today = new Date();

  function renderMonth(offset) {
    const base = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    const year = base.getFullYear();
    const month = base.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    function isDisabled(day) {
      const d = new Date(year, month, day);
      const weekday = d.getDay();

      if (d < today.setHours(0, 0, 0, 0)) return true; // giorni passati
      if (weekday === 0 || weekday === 1) return true; // domenica, lunedì
      return false;
    }

    return (
      <div key={offset} style={{ marginBottom: 20 }}>
        <h3>
          {base.toLocaleString("it-IT", { month: "long", year: "numeric" })}
        </h3>

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
                  opacity: disabled ? 0.3 : 1,
                }}
                onClick={() =>
                  onDateSelect(
                    `${year}-${String(month + 1).padStart(2, "0")}-${String(
                      day
                    ).padStart(2, "0")}`
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

  return (
    <div>
      <h2>Seleziona una data</h2>
      {renderMonth(0)}
      {renderMonth(1)}
      {renderMonth(2)}
    </div>
  );
}

export default Calendar;
