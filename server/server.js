const express = require("express");
const cors = require("cors");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

// CORS permettendo le richieste dal frontend
app.use(cors({
  origin: "http://localhost:3000", // cambia con il tuo dominio in produzione
  credentials: true,
}));
app.use(express.json());

// Orari
const OPEN_MORNING = 8;
const CLOSE_MORNING = 13;
const OPEN_AFTERNOON = 14;
const CLOSE_AFTERNOON = 20;

let reservations = [];

const JWT_SECRET = "supersecretkey123";
const adminUser = {
  username: "admin",
  passwordHash: bcrypt.hashSync("barbiere123", 10)
};

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

// Rotte pubbliche
app.get("/slots", (req, res) => {
  const available = generateSlots().filter(
    (slot) => !reservations.find(r => r.time === slot)
  );
  res.json(available);
});

app.post("/reserve", (req, res) => {
  const { name, surname, email, phone, time } = req.body;
  if (!name || !surname || !email || !phone || !time) {
    return res.status(400).json({ message: "Dati mancanti" });
  }
  if (reservations.find(r => r.time === time)) {
    return res.status(400).json({ message: "Slot già prenotato" });
  }
  reservations.push({ name, surname, email, phone, time });
  res.json({ message: "Prenotazione effettuata con successo" });
});

// Middleware autenticazione JWT
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

// Login admin
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (username !== adminUser.username)
    return res.status(401).json({ message: "Utente non trovato" });

  if (!bcrypt.compareSync(password, adminUser.passwordHash))
    return res.status(401).json({ message: "Password errata" });

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Rotte protette
app.get("/reservations", authenticateToken, (req, res) => {
  res.json(reservations);
});

app.get("/export-reservations", authenticateToken, (req, res) => {
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

// Avvio server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server avviato sulla porta " + PORT));
