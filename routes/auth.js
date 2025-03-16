// routes/auth.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Endpoint d'inscription (Register)
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "Utilisateur déjà existant" });
    }

    const user = new User({ username, email, password });
    await user.save();

    // Générer un token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// Endpoint de connexion (Login)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Identifiants invalides" });
    }

    // Comparer le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Identifiants invalides" });
    }

    // Générer un token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

module.exports = router;
