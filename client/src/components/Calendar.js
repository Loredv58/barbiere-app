import React, { useEffect, useState } from "react";

const WEEK_DAYS = ["L", "M", "M", "G", "V", "S", "D"];
const MONTHS = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
];

function Calendar({ onDateSelect }) {
  const today = new Date();

  const todayMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  // 🔥 cache per mese (chiave: "YYYY-M")
  const [daysCache, setDaysCache] = useState({});
  const [daysStatus, setDaysStatus] = useState({});
  const [loadingDays, setLoadingDays] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL;

  const maxMonth = new Date(today.getFullYear(), today.getMonth() + 2, 1);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;

  /* 🔹 FETCH + CACHE */
  useEffect(() => {
    const cacheKey = `${year}-${month}`;

    // ✅ se già in cache → usa subito
    if (daysCache[cacheKey]) {
      setDaysStatus(daysCache[cacheKey]);
      return;
    }

    // ❌ non in cache → fetch
    setLoadingDays(true);

    fetch(`${apiUrl}/days-status?year=${year}&month=${month}`)
      .then(res => res.json())
      .then(data => {
        setDaysCache(prev => ({
          ...prev,
          [cacheKey]: data
        }));
        setDaysStatus(data);
        setLoadingDays(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingDays(false);
      });
  }, [apiUrl, year, month, daysCache]);

  function isDisabled(day) {
    if (loadingDays) return true;

    const d = new Date(year, month, day);
    const weekday = d.getDay();

    if (d < todayMidnight) return true;      // passato
    if (weekday === 0 || weekday === 1) return true; // dom-lun
    if (daysStatus[day] === false) return true; // giorno pieno

    return false;
  }

  function prevMonth() {
    setCurrentMonth(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    if (currentMonth < maxMonth) {
      setCurrentMonth(new Date(year, month + 1, 1));
    }
  }

  return (
    <div style={{ maxWidth: 360, marginBottom: 20 }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10
        }}
      >
        <button onClick={prevMonth} disabled={month === today.getMonth()}>
          ◀
        </button>

        <strong>
          {MONTHS[month]} {year}
        </strong>

        <button onClick={nextMonth} disabled={currentMonth >= maxMonth}>
          ▶
        </button>
      </div>

      {/* GIORNI SETTIMANA */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          textAlign: "center",
          fontWeight: "bold",
          marginBottom: 5
        }}
      >
        {WEEK_DAYS.map(d => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* GIORNI */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 4
        }}
      >
        {[...Array(firstDayIndex)].map((_, i) => (
          <div key={"empty" + i} />
        ))}

        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const disabled = isDisabled(day);

          return (
            <button
              key={day}
              disabled={disabled}
              style={{
                padding: 8,
                borderRadius: 6,
                border: "1px solid #ccc",
                background: disabled ? "#eee" : "#fff",
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.4 : 1
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

export default Calendar;


