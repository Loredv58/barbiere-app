const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());

// Config DB
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // NECESSARIO SU RENDER
});

// Costanti orari
const OPEN_MORNING = 8;
const CLOSE_MORNING = 13;
const OPEN_AFTERNOON = 14;
const CLOSE_AFTERNOON = 20;

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Genera gli slot orari
function generateSlots() {
  let slots = [];
  for (let h = OPEN_MORNING; h < CLOSE_MORNING; h++) {
    slots.push(`${h}:00`, `${h}:30`);
  }
  for (let h = OPEN_AFTERNOON; h < CLOSE_AFTERNOON; h++) {
    slots.push(`${h}:00`, `${h}:30`);
  }
  return slots;
}

// Crea tabella prenotazioni se non esiste
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS reservations (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      surname TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      time TEXT NOT NULL UNIQUE
    );
  `);
}
initDB();

// Rotta slot disponibili
app.get("/slots", async (req, res) => {
  try {
    const result = await pool.query("SELECT time FROM reservations");
    const booked = result.rows.map(r => r.time);

    const available = generateSlots().filter(slot => !booked.includes(slot));

    res.json(available);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore server" });
  }
});

// Prenotazione cliente
app.post("/reserve", async (req, res) => {
  const { name, surname, email, phone, time } = req.body;

  if (!name || !surname || !email || !phone || !time)
    return res.status(400).json({ message: "Dati mancanti" });

  try {
    const existing = await pool.query("SELECT * FROM reservations WHERE time=$1", [time]);

    if (existing.rows.length > 0)
      return res.status(400).json({ message: "Slot già prenotato" });

    await pool.query(
      "INSERT INTO reservations (name, surname, email, phone, time) VALUES ($1, $2, $3, $4, $5)",
      [name, surname, email, phone, time]
    );

    res.json({ message: "Prenotazione effettuata!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore server" });
  }
});

// Middleware autenticazione
function authenticateToken(req, res, next) {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token mancante" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token non valido" });
    req.user = user;
    next();
  });
}

// Login admin
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (username !== ADMIN_USER)
    return res.status(401).json({ message: "Utente non trovato" });

  if (password !== ADMIN_PASSWORD)
    return res.status(401).json({ message: "Password errata" });

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });

  res.json({ token });
});

// Lista prenotazioni admin
app.get("/reservations", authenticateToken, async (req, res) => {
  const result = await pool.query("SELECT * FROM reservations ORDER BY id DESC");
  res.json(result.rows);
});

// Avvio server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server avviato su porta " + PORT));

