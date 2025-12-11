const API_URL = "http://localhost:5000";

// Prende gli slot disponibili dal backend
export const getSlots = async () => {
  const response = await fetch(`${API_URL}/slots`);
  return response.json();
};

// Crea una nuova prenotazione sul backend
export const createReservation = async (reservation) => {
  const response = await fetch(`${API_URL}/reserve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reservation),
  });
  return response.json();
};
