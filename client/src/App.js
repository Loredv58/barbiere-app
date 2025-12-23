import React, { useState, useEffect } from "react";
import Calendar from "./components/Calendar";
import SlotsList from "./components/SlotsList";
import ReservationForm from "./components/ReservationForm";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import UserLogin from "./components/UserLogin";
import UserDashboard from "./components/UserDashboard";
import Home from "./components/Home";

function App() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [refresh, setRefresh] = useState(false);

  // Gestione calendario Home → prenotazione
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarCache, setCalendarCache] = useState({}); // 🔹 cache giorni disponibili

  // Modalità login / dashboard
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminLogged, setIsAdminLogged] = useState(false);

  const [showUserLogin, setShowUserLogin] = useState(false);
  const [userReservations, setUserReservations] = useState([]);
  const [showUserDashboard, setShowUserDashboard] = useState(false);

  const [backendReady, setBackendReady] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL;

  /* ---------------- WAKE UP BACKEND + PRELOAD 3 MESI ---------------- */
  useEffect(() => {
    let cancelled = false;
    const today = new Date();
    const preloadMonths = [0, 1, 2]; // questo mese + 2 mesi successivi

    Promise.all(
      preloadMonths.map(offset => {
        const date = new Date(today.getFullYear(), today.getMonth() + offset, 1);
        const year = date.getFullYear();
        const month = date.getMonth();
        return fetch(`${apiUrl}/days-status?year=${year}&month=${month}`)
          .then(res => res.json())
          .then(data => ({ [`${year}-${month}`]: data }))
          .catch(() => ({ [`${year}-${month}`]: {} }));
      })
    ).then(results => {
      if (!cancelled) {
        const merged = Object.assign({}, ...results);
        setCalendarCache(merged);
        setBackendReady(true);
      }
    });

    // Mantieni wake-up server anche su slot remoto
    fetch(`${apiUrl}/slots?date=2099-12-31`).catch(() => {});

    return () => { cancelled = true; };
  }, [apiUrl]);

  /* ---------------- CHECK ADMIN LOGIN ---------------- */
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) setIsAdminLogged(true);
  }, []);

  /* ---------------- HANDLER ---------------- */
  const handleReservationDone = () => {
    setSelectedSlot(null);
    setRefresh((r) => !r);
  };

  const handleLogoutAdmin = () => {
    localStorage.removeItem("adminToken");
    setIsAdminLogged(false);
    setShowAdminLogin(false);
    setSelectedSlot(null);
    setShowCalendar(false);
    setSelectedDate(null);
  };

  const handleLogoutUser = () => {
    localStorage.removeItem("userToken");
    setUserReservations([]);
    setShowUserDashboard(false);
    setShowUserLogin(false);
    setShowCalendar(false);
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  const handleUserUpdate = (id, action, updatedData) => {
    if (action === "delete") {
      setUserReservations((prev) => prev.filter((r) => r.id !== id));
    } else if (action === "update") {
      setUserReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updatedData } : r))
      );
    }
  };

  /* ---------------- RENDER CONDIZIONALE ---------------- */

  if (isAdminLogged) return <AdminDashboard onLogout={handleLogoutAdmin} />;

  if (showUserDashboard)
    return (
      <UserDashboard
        reservations={userReservations}
        onLogout={handleLogoutUser}
        onUpdateReservation={handleUserUpdate}
      />
    );

  if (!backendReady) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h2>Fabio Villano Parrucchieri - Prenotazioni</h2>
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 500,
            zIndex: 1000,
          }}
        >
          Connessione al server…
        </div>
      </div>
    );
  }

  if (showAdminLogin) return <AdminLogin onLoginSuccess={() => setIsAdminLogged(true)} />;

  if (showUserLogin)
    return (
      <UserLogin
        onLoginSuccess={(reservations) => {
          setUserReservations(reservations);
          setShowUserDashboard(true);
        }}
        onBack={() => setShowUserLogin(false)}
      />
    );

  if (selectedSlot)
    return (
      <ReservationForm
        selectedDate={selectedDate}
        selectedSlot={selectedSlot}
        onReservationDone={handleReservationDone}
      />
    );

  if (selectedDate)
    return <SlotsList key={refresh} selectedDate={selectedDate} onSelectSlot={setSelectedSlot} />;

  if (showCalendar)
    return (
      <Calendar
        onDateSelect={setSelectedDate}
        onBack={() => setShowCalendar(false)}
        preloadedDays={calendarCache} // 🔹 passa la cache al calendario
      />
    );

  return (
    <Home
      onBookClick={() => {
        setShowCalendar(true);
        setSelectedDate(null);
        setSelectedSlot(null);
      }}
      onManageClick={() => setShowUserLogin(true)}
      onAdminLoginClick={() => setShowAdminLogin(true)}
    />
  );
}

export default App;
