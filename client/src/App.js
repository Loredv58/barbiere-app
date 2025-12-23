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

  // Modalità login / dashboard
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminLogged, setIsAdminLogged] = useState(false);

  const [showUserLogin, setShowUserLogin] = useState(false);
  const [userReservations, setUserReservations] = useState([]);
  const [showUserDashboard, setShowUserDashboard] = useState(false);

  const [backendReady, setBackendReady] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL;

  /* ---------------- WAKE UP BACKEND ---------------- */
  useEffect(() => {
    let cancelled = false;

    fetch(`${apiUrl}/slots?date=2099-12-31`)
      .finally(() => {
        if (!cancelled) setBackendReady(true);
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

  const handleReservationDone = () => {
    setSelectedSlot(null);
    setRefresh((r) => !r);
  };

  const handleLogoutAdmin = () => {
    localStorage.removeItem("adminToken");
    setIsAdminLogged(false);
    setShowAdminLogin(false);
    setSelectedSlot(null);
  };

  const handleLogoutUser = () => {
    localStorage.removeItem("userToken");
    setUserReservations([]);
    setShowUserDashboard(false);
    setShowUserLogin(false);
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

  /* ---------------- ADMIN DASHBOARD ---------------- */
  if (isAdminLogged) {
    return <AdminDashboard onLogout={handleLogoutAdmin} />;
  }

  /* ---------------- USER DASHBOARD ---------------- */
  if (showUserDashboard) {
    return (
      <UserDashboard
        reservations={userReservations}
        onLogout={handleLogoutUser}
        onUpdateReservation={handleUserUpdate}
      />
    );
  }

  /* ---------------- LOADING GLOBALE ---------------- */
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

  /* ---------------- UI PRINCIPALE ---------------- */
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

  /* ---------------- HOME PRINCIPALE ---------------- */
  return (
    <Home
      onBook={() => {
        setSelectedDate(null);
        setSelectedSlot(null);
      }}
      onManage={() => setShowUserLogin(true)}
      onAdminLogin={() => setShowAdminLogin(true)}
    />
  );
}

export default App;
