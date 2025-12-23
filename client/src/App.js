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

  // Home → calendario
  const [showCalendar, setShowCalendar] = useState(false);

  // Cache calendario
  const [calendarCache, setCalendarCache] = useState({});

  // Login / dashboard
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminLogged, setIsAdminLogged] = useState(false);

  const [showUserLogin, setShowUserLogin] = useState(false);
  const [userReservations, setUserReservations] = useState([]);
  const [showUserDashboard, setShowUserDashboard] = useState(false);

  // Stato backend
  const [backendReady, setBackendReady] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL;

  /* ---------------- WAKE UP BACKEND + PRELOAD CALENDARIO ---------------- */
  useEffect(() => {
    let cancelled = false;
    const today = new Date();
    const preloadMonths = [0, 1, 2]; // mese corrente + 2 successivi

    // Wake-up backend (non bloccante)
    fetch(`${apiUrl}/slots?date=2099-12-31`).catch(() => {});

    // Preload giorni calendario
    Promise.all(
      preloadMonths.map((offset) => {
        const d = new Date(today.getFullYear(), today.getMonth() + offset, 1);
        const year = d.getFullYear();
        const month = d.getMonth();

        return fetch(`${apiUrl}/days-status?year=${year}&month=${month}`)
          .then((res) => res.json())
          .then((data) => ({ [`${year}-${month}`]: data }))
          .catch(() => ({ [`${year}-${month}`]: {} }));
      })
    ).then((results) => {
      if (!cancelled) {
        setCalendarCache(Object.assign({}, ...results));
        setBackendReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
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
    setShowCalendar(false);
    setSelectedDate(null);
    setSelectedSlot(null);
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

  /* ---------------- RENDER ---------------- */

  if (isAdminLogged) {
    return <AdminDashboard onLogout={handleLogoutAdmin} />;
  }

  if (showUserDashboard) {
    return (
      <UserDashboard
        reservations={userReservations}
        onLogout={handleLogoutUser}
        onUpdateReservation={handleUserUpdate}
      />
    );
  }

  if (showAdminLogin) {
    return <AdminLogin onLoginSuccess={() => setIsAdminLogged(true)} />;
  }

  if (showUserLogin) {
    return (
      <UserLogin
        onLoginSuccess={(reservations) => {
          setUserReservations(reservations);
          setShowUserDashboard(true);
        }}
        onBack={() => setShowUserLogin(false)}
      />
    );
  }

  if (selectedSlot) {
    return (
      <ReservationForm
        selectedDate={selectedDate}
        selectedSlot={selectedSlot}
        onReservationDone={handleReservationDone}
      />
    );
  }

  if (selectedDate) {
    return (
      <SlotsList
        key={refresh}
        selectedDate={selectedDate}
        onSelectSlot={setSelectedSlot}
      />
    );
  }

  if (showCalendar) {
    return (
      <>
        <Calendar
          onDateSelect={setSelectedDate}
          onBack={() => setShowCalendar(false)}
          preloadedDays={calendarCache}
        />

        {!backendReady && (
          <div
            style={{
              position: "fixed",
              bottom: 15,
              right: 15,
              background: "#000",
              color: "#fff",
              padding: "6px 12px",
              borderRadius: 20,
              fontSize: 12,
              opacity: 0.8,
            }}
          >
            Connessione al server…
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <Home
        onBookClick={() => {
          setShowCalendar(true);
          setSelectedDate(null);
          setSelectedSlot(null);
        }}
        onManageClick={() => setShowUserLogin(true)}
        onAdminLoginClick={() => setShowAdminLogin(true)}
      />

      {!backendReady && (
        <div
          style={{
            position: "fixed",
            bottom: 15,
            right: 15,
            background: "#000",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: 20,
            fontSize: 12,
            opacity: 0.8,
          }}
        >
          Connessione al server…
        </div>
      )}
    </>
  );
}

export default App;

