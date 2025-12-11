import React, { useState, useEffect } from "react";
import SlotsList from "./components/SlotsList";
import ReservationForm from "./components/ReservationForm";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";

function App() {
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
      ) : !selectedSlot ? (
        <SlotsList key={refresh} onSelectSlot={setSelectedSlot} />
      ) : (
        <ReservationForm
          selectedSlot={selectedSlot}
          onReservationDone={handleReservationDone}
        />
      )}
    </div>
  );
}

export default App;
