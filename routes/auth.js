// routes/auth.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Route pour l'inscription
router.post("/register", async (req, res) => {
  try {
    console.log("Register body:", req.body); // Vérifie ce que reçoit le backend
    const { username, email, password, role } = req.body;
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "Utilisateur déjà existant" });
    }
    // Créer et sauvegarder l'utilisateur en utilisant le rôle transmis (ou "user" par défaut)
    const user = new User({
      username,
      email,
      password,
      role: role ? role : "user",
    });
    await user.save();
    return res.status(201).json({ message: "Inscription réussie", user });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: err.message });
  }
});

// Route pour la connexion
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Vérifier si la requête demande une connexion admin (via ?role=admin)
    const isAdminLogin = req.query.role === "admin";
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Identifiants invalides" });
    }
    // Si c'est une connexion mobile et que l'utilisateur est admin, refuser
    if (!req.query.role && user.role !== "user") {
      return res.status(403).json({
        message:
          "Accès refusé : les administrateurs ne peuvent pas se connecter via l'application mobile",
      });
    }
    // Si c'est une connexion admin et que l'utilisateur n'est pas admin, refuser
    if (isAdminLogin && user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Accès refusé : vous n'êtes pas administrateur" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Identifiants invalides" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.status(200).json({ token, user });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: err.message });
  }
});

module.exports = router;
