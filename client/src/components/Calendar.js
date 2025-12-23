import React, { useEffect, useState } from "react";

const WEEK_DAYS = ["L", "M", "M", "G", "V", "S", "D"];
const MONTHS = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
];

function Calendar({ onDateSelect }) {
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [daysCache, setDaysCache] = useState({});
  const [daysStatus, setDaysStatus] = useState({});
  const [initialized, setInitialized] = useState(false); // calendario pronto
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.REACT_APP_API_URL;
  const maxMonth = new Date(today.getFullYear(), today.getMonth() + 2, 1);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;

  /* ---------------- PRELOAD 3 MESI INIZIALI ---------------- */
  useEffect(() => {
    setLoading(true);
    const monthsToLoad = [0, 1, 2].map(offset => {
      const d = new Date(today.getFullYear(), today.getMonth() + offset, 1);
      return { y: d.getFullYear(), m: d.getMonth(), key: `${d.getFullYear()}-${d.getMonth()}` };
    });

    Promise.all(
      monthsToLoad.map(({ y, m, key }) => {
        const cached = daysCache[key];
        if (cached) return Promise.resolve({ key, data: cached });
        return fetch(`${apiUrl}/days-status?year=${y}&month=${m}`)
          .then(res => res.json())
          .then(data => ({ key, data }))
          .catch(() => ({ key, data: {} }));
      })
    ).then(results => {
      const newCache = { ...daysCache };
      results.forEach(r => { newCache[r.key] = r.data; });
      setDaysCache(newCache);

      const currentKey = `${year}-${month}`;
      setDaysStatus(newCache[currentKey] || {});
      setInitialized(true);
      setLoading(false);

      // Salva in localStorage per cache persistente
      try {
        localStorage.setItem("calendarCache", JSON.stringify(newCache));
      } catch (e) {}
    });
  }, [apiUrl, year, month]);

  /* ---------------- CARICAMENTO CACHE DA localStorage ---------------- */
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("calendarCache") || "{}");
      setDaysCache(stored);
    } catch (e) {}
  }, []);

  /* ---------------- UTILS ---------------- */
  function isDisabled(day) {
    if (loading) return true;

    const d = new Date(year, month, day);
    const weekday = d.getDay();

    if (d < todayMidnight) return true;           // passato
    if (weekday === 0 || weekday === 1) return true; // dom-lun
    if (daysStatus[day] === false) return true;   // giorno pieno

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

  /* ---------------- UI ---------------- */
  return (
    <div style={{ maxWidth: 360, marginBottom: 20 }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <button onClick={prevMonth} disabled={month === today.getMonth()}>◀</button>
        <strong>{MONTHS[month]} {year}</strong>
        <button onClick={nextMonth} disabled={currentMonth >= maxMonth}>▶</button>
      </div>

      {/* GIORNI SETTIMANA */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", fontWeight: "bold", marginBottom: 5 }}>
        {WEEK_DAYS.map(d => <div key={d}>{d}</div>)}
      </div>

      {/* GIORNI */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {[...Array(firstDayIndex)].map((_, i) => <div key={"empty" + i} />)}

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
                background: loading ? "#f5f5f5" : disabled ? "#eee" : "#fff",
                cursor: disabled || loading ? "not-allowed" : "pointer",
                opacity: disabled || loading ? 0.4 : 1
              }}
              onClick={() =>
                !loading && onDateSelect(
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

