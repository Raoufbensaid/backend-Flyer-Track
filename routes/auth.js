// routes/auth.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "Utilisateur déjà existant" });
    }
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: "Inscription réussie", user });
  } catch (err) {
    console.error("Erreur dans register:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

module.exports = router;
