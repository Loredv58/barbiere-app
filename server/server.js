const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
}));
app.use(express.json());

/* ---------------- CONFIG ---------------- */

const OPEN_MORNING = 8;
const CLOSE_MORNING = 13;
const OPEN_AFTERNOON = 14;
const CLOSE_AFTERNOON = 20;

const JWT_SECRET = process.env.JWT_SECRET;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
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
  return day !== 0 && day !== 1; // 0 domenica, 1 lunedì
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

/* ---------------- ROUTES ---------------- */

// SLOT DISPONIBILI PER DATA
app.get("/slots", async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ message: "Data mancante" });
  if (!isWorkingDay(date))
    return res.status(400).json({ message: "Giorno non lavorativo" });

  const result = await pool.query(
    "SELECT time FROM reservations WHERE date = $1",
    [date]
  );

  const occupied = result.rows.map(r => r.time);
  const available = generateSlots().filter(s => !occupied.includes(s));

  res.json(available);
});

// PRENOTAZIONE
app.post("/reserve", async (req, res) => {
  const { name, surname, email, phone, date, time } = req.body;

  if (!name || !surname || !email || !phone || !date || !time)
    return res.status(400).json({ message: "Dati mancanti" });

  if (!isWorkingDay(date))
    return res.status(400).json({ message: "Giorno non lavorativo" });

  const exists = await pool.query(
    "SELECT 1 FROM reservations WHERE date=$1 AND time=$2",
    [date, time]
  );

  if (exists.rowCount > 0)
    return res.status(400).json({ message: "Slot già prenotato" });

  await pool.query(
    `INSERT INTO reservations (name, surname, email, phone, date, time)
     VALUES ($1,$2,$3,$4,$5,$6)`,
    [name, surname, email, phone, date, time]
  );

  res.json({ message: "Prenotazione confermata" });
});

/* ---------------- START ---------------- */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server avviato su porta " + PORT));
