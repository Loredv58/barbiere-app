import React, { useEffect, useState } from "react";

const WEEK_DAYS = ["L", "M", "M", "G", "V", "S", "D"];
const MONTHS = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
];

function Calendar({ onDateSelect, onBack }) {
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [daysCache, setDaysCache] = useState({});
  const [daysStatus, setDaysStatus] = useState({});
  const [loadingDays, setLoadingDays] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL;

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;

  // Fetch giorni e cache
  useEffect(() => {
    const cacheKey = `${year}-${month}`;
    if (daysCache[cacheKey]) {
      setDaysStatus(daysCache[cacheKey]);
      setInitialized(true);
      return;
    }

    setLoadingDays(true);
    fetch(`${apiUrl}/days-status?year=${year}&month=${month}`)
      .then(res => res.json())
      .then(data => {
        setDaysCache(prev => ({ ...prev, [cacheKey]: data }));
        setDaysStatus(data);
        setLoadingDays(false);
        setInitialized(true);
      })
      .catch(() => { setLoadingDays(false); setInitialized(true); });
  }, [apiUrl, year, month, daysCache]);

  // Preload mesi successivi
  useEffect(() => {
    if (!initialized) return;

    [1, 2].forEach(offset => {
      const preloadDate = new Date(year, month + offset, 1);
      const y = preloadDate.getFullYear();
      const m = preloadDate.getMonth();
      const key = `${y}-${m}`;
      if (daysCache[key]) return;

      fetch(`${apiUrl}/days-status?year=${y}&month=${m}`)
        .then(res => res.json())
        .then(data => {
          setDaysCache(prev => ({ ...prev, [key]: data }));
        })
        .catch(() => {});
    });
  }, [initialized, year, month, apiUrl, daysCache]);

  function isDisabled(day) {
    if (loadingDays) return true;
    const d = new Date(year, month, day);
    const weekday = d.getDay();
    if (d < todayMidnight) return true;
    if (weekday === 0 || weekday === 1) return true;
    if (daysStatus[day] === false) return true;
    return false;
  }

  function prevMonth() {
    setCurrentMonth(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setCurrentMonth(new Date(year, month + 1, 1));
  }

  /* ---------------- STILE CENTRATO ---------------- */
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        minHeight: "70vh",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          maxWidth: 400,
          width: "100%",
        }}
      >
        {/* Tasto indietro */}
        {onBack && (
          <button
            onClick={onBack}
            style={{
              marginBottom: 10,
              padding: "6px 12px",
              borderRadius: 6,
              border: "none",
              backgroundColor: "#f4c542",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            ← Torna indietro
          </button>
        )}

        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <button onClick={prevMonth} disabled={month === today.getMonth()}>◀</button>
          <strong>{MONTHS[month]} {year}</strong>
          <button onClick={nextMonth}>▶</button>
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
                  background: disabled ? "#eee" : "#fff",
                  cursor: disabled ? "not-allowed" : "pointer",
                  opacity: disabled ? 0.4 : 1,
                }}
                onClick={() => onDateSelect(`${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`)}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Calendar;

