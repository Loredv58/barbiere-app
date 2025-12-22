process.env.TZ = "Europe/Rome";
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

/* ---------------- CONFIG ---------------- */

const OPEN_MORNING = 8;
const CLOSE_MORNING = 13;
const OPEN_AFTERNOON = 14;
const CLOSE_AFTERNOON = 20;
const JWT_SECRET = process.env.JWT_SECRET;

// Admin
const adminUser = {
  username: process.env.ADMIN_USER || "admin",
  passwordHash: bcrypt.hashSync(process.env.ADMIN_PASSWORD || "admin123", 10)
};

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/* ---------------- UTILS ---------------- */

function isWorkingDay(dateStr) {
  const [year, month, day] = dateStr.split("-");
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  const weekday = date.getDay();
  return weekday !== 0 && weekday !== 1; // domenica, lunedì
}

function generateSlots() {
  const slots = [];
  for (let h = OPEN_MORNING; h < CLOSE_MORNING; h++) {
    slots.push(`${h}:00`, `${h}:30`);
  }
  for (let h = OPEN_AFTERNOON; h < CLOSE_AFTERNOON; h++) {
    slots.push(`${h}:00`, `${h}:30`);
  }
  return slots;
}

// Middleware JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token mancante" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token non valido" });
    req.user = user;
    next();
  });
}

/* ---------------- ROUTES ---------------- */

// Slots disponibili per data
app.get("/slots", async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ message: "Data mancante" });
  if (!isWorkingDay(date)) return res.status(400).json({ message: "Giorno non lavorativo" });

  const { data, error } = await supabase
    .from("reservations")
    .select("time")
    .eq("date", date);

  if (error) return res.status(500).json({ message: error.message });

  const occupied = data.map(r => r.time);
  let available = generateSlots().filter(s => !occupied.includes(s));

  // 🔥 FILTRO ORARIO SEMPRE CORRETTO
  const now = new Date();
  const [y, m, d] = date.split("-").map(Number);
  const requestedDate = new Date(y, m - 1, d);

  if (
    requestedDate.getFullYear() === now.getFullYear() &&
    requestedDate.getMonth() === now.getMonth() &&
    requestedDate.getDate() === now.getDate()
  ) {
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    available = available.filter(slot => {
      const [h, min] = slot.split(":").map(Number);
      const slotMinutes = h * 60 + min;
      return slotMinutes > currentMinutes;
    });
  }

  res.json(available);
});

// Prenotazione
app.post("/reserve", async (req, res) => {
  const { name, surname, email, phone, date, time } = req.body;

  if (!name || !surname || !email || !phone || !date || !time)
    return res.status(400).json({ message: "Dati mancanti" });

  if (!isWorkingDay(date)) return res.status(400).json({ message: "Giorno non lavorativo" });

  const { data: exists, error: existsError } = await supabase
    .from("reservations")
    .select("*")
    .eq("date", date)
    .eq("time", time);

  if (existsError) return res.status(500).json({ message: existsError.message });
  if (exists.length > 0) return res.status(400).json({ message: "Slot già prenotato" });

  const { error } = await supabase
    .from("reservations")
    .insert([{ name, surname, email, phone, date, time }]);

  if (error) return res.status(500).json({ message: error.message });

  res.json({ message: "Prenotazione confermata" });
});

// Days status
app.get("/days-status", async (req, res) => {
  const { year, month } = req.query;
  if (!year || month === undefined) return res.status(400).json({ message: "Parametri mancanti" });

  const daysInMonth = new Date(year, Number(month) + 1, 0).getDate();
  const result = {};

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(Number(month) + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    if (!isWorkingDay(dateStr)) {
      result[day] = false;
      continue;
    }

    const { data, error } = await supabase
      .from("reservations")
      .select("*", { count: "exact" })
      .eq("date", dateStr);

    if (error) {
      result[day] = false;
      continue;
    }

    result[day] = data.length < generateSlots().length;
  }

  res.json(result);
});

// Login admin
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (username !== adminUser.username) return res.status(401).json({ message: "Utente non trovato" });
  if (!bcrypt.compareSync(password, adminUser.passwordHash)) return res.status(401).json({ message: "Password errata" });

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Visualizza prenotazioni (protetta)
app.get("/reservations", authenticateToken, async (req, res) => {
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .order("date", { ascending: true })
    .order("time", { ascending: true });

  if (error) return res.status(500).json({ message: error.message });

  res.json(data);
});

// Esporta prenotazioni (protetta)
app.get("/export-reservations", authenticateToken, async (req, res) => {
  const { data: reservations, error } = await supabase
    .from("reservations")
    .select("*")
    .order("date", { ascending: true })
    .order("time", { ascending: true });

  if (error) return res.status(500).json({ message: error.message });
  if (reservations.length === 0) return res.status(400).send("Nessuna prenotazione");

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(reservations);
  XLSX.utils.book_append_sheet(wb, ws, "Prenotazioni");

  const filePath = path.join(__dirname, "prenotazioni.xlsx");
  XLSX.writeFile(wb, filePath);

  res.download(filePath, "prenotazioni.xlsx", err => {
    if (err) console.error(err);
    fs.unlinkSync(filePath);
  });
});

// Prenotazioni filtrate per data (Admin)
app.get("/admin/reservations", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token mancante" });

  try {
    jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(403).json({ message: "Token non valido" });
  }

  const { date } = req.query;
  if (!date) return res.status(400).json({ message: "Data mancante" });

  const { data, error } = await supabase
    .from("reservations")
    .select("name, surname, email, phone, date, time")
    .eq("date", date)
    .order("time", { ascending: true });

  if (error) return res.status(500).json({ message: error.message });

  res.json(data);
});

/* ---------------- START ---------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server avviato su porta " + PORT));
