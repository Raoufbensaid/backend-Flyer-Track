// routes/auth.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Route pour l'inscription
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "Utilisateur déjà existant" });
    }
    // Créer et sauvegarder l'utilisateur
    // Si role n'est pas fourni, il sera "user" par défaut
    const user = new User({ username, email, password, role: role || "user" });
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
    // Vérifier si la requête est pour un login admin (si query param role=admin est présent)
    const isAdminLogin = req.query.role === "admin";

    // Chercher l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Identifiants invalides" });
    }
    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Identifiants invalides" });
    }

    // Si la requête ne spécifie pas "role" (login mobile), on vérifie que l'utilisateur a le rôle "user"
    if (!req.query.role && user.role !== "user") {
      return res.status(403).json({
        message:
          "Accès refusé : l'admin ne peut pas se connecter via l'application mobile",
      });
    }
    // Si la requête demande une connexion admin, on vérifie que l'utilisateur est bien admin
    if (isAdminLogin && user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Accès refusé : vous n'êtes pas administrateur" });
    }

    // Générer un token JWT
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
