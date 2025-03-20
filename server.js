// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");

const app = express();

// Configuration CORS pour autoriser plusieurs origines
const allowedOrigins = ["http://localhost:3000", "http://192.168.1.182:3000"];
app.use(
  cors({
    origin: function (origin, callback) {
      // Autoriser les requêtes sans origine (ex. Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(
          new Error(`Origin ${origin} not allowed by CORS`),
          false
        );
      }
      return callback(null, true);
    },
  })
);

// Middleware pour parser le JSON
app.use(express.json());

// Connexion à MongoDB avec un délai d'attente étendu (30 secondes)
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // 30 secondes
  })
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.error("Erreur de connexion MongoDB:", err));

// Montage des routes d'authentification
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
