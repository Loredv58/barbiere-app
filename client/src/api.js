const API_URL = process.env.REACT_APP_API_URL;

export async function getSlots() {
  const res = await fetch(`${API_URL}/slots`);
  return res.json();
}

export async function makeReservation(data) {
  const res = await fetch(`${API_URL}/reserve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function loginAdmin(username, password) {
  const res = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function getReservations(token) {
  const res = await fetch(`${API_URL}/reservations`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export function exportExcel(token) {
  window.location.href = `${API_URL}/export-reservations?token=${token}`;
}
