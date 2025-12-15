const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

// Pool PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

/* ---------------- INIT DB ---------------- */

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS reservations (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      surname TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      date DATE NOT NULL,
      time TEXT NOT NULL
    )
  `);
}

initDB();

/* ---------------- UTILS ---------------- */

function isWorkingDay(dateStr) {
  const day = new Date(dateStr).getDay();
  return day !== 0 && day !== 1; // domenica=0, lunedì=1
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

  const result = await pool.query("SELECT time FROM reservations WHERE date=$1", [date]);
  const occupied = result.rows.map(r => r.time);
  const available = generateSlots().filter(s => !occupied.includes(s));

  res.json(available);
});

// Prenotazione
app.post("/reserve", async (req, res) => {
  const { name, surname, email, phone, date, time } = req.body;

  if (!name || !surname || !email || !phone || !date || !time)
    return res.status(400).json({ message: "Dati mancanti" });

  if (!isWorkingDay(date)) return res.status(400).json({ message: "Giorno non lavorativo" });

  const exists = await pool.query(
    "SELECT 1 FROM reservations WHERE date=$1 AND time=$2",
    [date, time]
  );
  if (exists.rowCount > 0) return res.status(400).json({ message: "Slot già prenotato" });

  await pool.query(
    `INSERT INTO reservations (name, surname, email, phone, date, time)
     VALUES ($1,$2,$3,$4,$5,$6)`,
    [name, surname, email, phone, date, time]
  );

  res.json({ message: "Prenotazione confermata" });
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
  const result = await pool.query("SELECT * FROM reservations ORDER BY date, time");
  res.json(result.rows);
});

// Esporta prenotazioni (protetta)
app.get("/export-reservations", authenticateToken, async (req, res) => {
  const result = await pool.query("SELECT * FROM reservations ORDER BY date, time");
  const reservations = result.rows;

  if (reservations.length === 0) return res.status(400).send("Nessuna prenotazione");

  const XLSX = require("xlsx");
  const path = require("path");
  const fs = require("fs");

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

/* ---------------- START ---------------- */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server avviato su porta " + PORT));

