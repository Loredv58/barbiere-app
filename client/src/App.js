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
    setRefresh(!refresh);
  };

const handleLogout = () => {
  localStorage.removeItem("adminToken");
  setIsAdminLogged(false);
  setShowLogin(false);
  setSelectedSlot(null);
};


  if (isAdminLogged) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Barbiere - Prenotazioni</h1>

      {!showLogin && (
        <button onClick={() => setShowLogin(true)}>Login Proprietario</button>
      )}

      {showLogin ? (
        <AdminLogin onLoginSuccess={() => setIsAdminLogged(true)} />
      ) : selectedSlot ? (
        <ReservationForm
          selectedDate={selectedDate}
          selectedSlot={selectedSlot}
          onReservationDone={handleReservationDone}
        />
      ) : (
        <>
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

export default App;
