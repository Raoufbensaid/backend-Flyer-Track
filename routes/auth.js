// routes/auth.js
const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
  // Ta logique de connexion ici
  res.json({ message: "Connexion réussie" });
});

router.post("/register", (req, res) => {
  // Ta logique d'inscription ici
  res.json({ message: "Inscription réussie" });
});

module.exports = router;
