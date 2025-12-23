import React, { useState, useEffect } from "react";
import Home from "./components/Home";
import Calendar from "./components/Calendar";
import SlotsList from "./components/SlotsList";
import ReservationForm from "./components/ReservationForm";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  const [page, setPage] = useState("home"); // 'home' | 'calendar' | 'manage' | 'adminLogin'
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [isAdminLogged, setIsAdminLogged] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/slots?date=2099-12-31`).catch(() => {});
  }, [apiUrl]);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) setIsAdminLogged(true);
  }, []);

  const handleReservationDone = () => {
    setSelectedSlot(null);
    setRefresh(r => !r);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAdminLogged(false);
    setPage("home");
  };

  /* ---------------- ADMIN ---------------- */
  if (isAdminLogged) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  /* ---------------- HOME PAGE ---------------- */
  if (page === "home") {
    return (
      <Home
        onBookClick={() => setPage("calendar")}
        onManageClick={() => setPage("manage")}
      />
    );
  }

  /* ---------------- CALENDAR / RESERVATION ---------------- */
  if (page === "calendar") {
    return (
      <div style={{ padding: 20 }}>
        <h1>Fabio Villano Parrucchieri - Prenotazioni</h1>

        {selectedSlot ? (
          <ReservationForm
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            onReservationDone={handleReservationDone}
          />
        ) : (
          <>
            <button onClick={() => setPage("home")} style={{ marginBottom: 20 }}>
              Torna Indietro
            </button>

            <Calendar onDateSelect={setSelectedDate} />

            <SlotsList
              key={refresh}
              selectedDate={selectedDate}
              onSelectSlot={setSelectedSlot}
            />
          </>
        )}
      </div>
    );
  }

  /* ---------------- GESTIONE APPUNTAMENTO ---------------- */
  if (page === "manage") {
    return (
      <div style={{ padding: 20 }}>
        <h1>Gestisci il tuo Appuntamento</h1>
        <button onClick={() => setPage("home")} style={{ marginBottom: 20 }}>
          Torna Indietro
        </button>
        {/* Qui poi aggiungeremo il componente di gestione tramite email */}
      </div>
    );
  }

  return null;
}

export default App;
