import React, { useState, useEffect } from "react";
import Calendar from "./components/Calendar";
import SlotsList from "./components/SlotsList";
import ReservationForm from "./components/ReservationForm";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isAdminLogged, setIsAdminLogged] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) setIsAdminLogged(true);
  }, []);

  const handleReservationDone = () => {
    setSelectedSlot(null);
    setSelectedDate(null);
    setRefresh(!refresh);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAdminLogged(false);
  };

  if (isAdminLogged) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Barbiere - Prenotazioni</h1>

      {!showLogin && (
        <button onClick={() => setShowLogin(true)}>Login Proprietario</button>
      )}

      {showLogin ? (
        <AdminLogin onLoginSuccess={() => setIsAdminLogged(true)} />
      ) : (
        <div>
          {/* CALENDARIO */}
          <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />

          {/* Messaggio se non hai selezionato una data */}
          {!selectedDate && <p>Seleziona prima una data dal calendario</p>}

          {/* Slot disponibili */}
          {selectedDate && !selectedSlot && (
            <SlotsList
              key={refresh}
              selectedDate={selectedDate}
              onSelectSlot={setSelectedSlot}
            />
          )}

          {/* Form prenotazione */}
          {selectedSlot && (
            <ReservationForm
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
              onReservationDone={handleReservationDone}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;

