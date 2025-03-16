// server.js
require("dotenv").config(); // Charge les variables du fichier .env
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth"); // On suppose que tes routes d'authentification sont dans routes/auth.js

const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Connexion à MongoDB
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Timeout de 30 secondes
  })
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.error("Erreur MongoDB:", err));

// Routes d'authentification
app.use("/api/auth", authRoutes);

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
