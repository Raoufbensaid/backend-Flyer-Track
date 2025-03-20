// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");

const app = express();

// Liste des origines autorisées (ajuste selon tes besoins en production)
const allowedOrigins = [
  "http://localhost:3000",
  "http://192.168.1.182:3000",
  "https://flyertrack.fr",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Autorise les requêtes sans origine (ex: Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `L'origine ${origin} n'est pas autorisée par CORS.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

// Middleware pour parser le JSON
app.use(express.json());

// Connexion à MongoDB avec un timeout étendu (30 secondes)
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
  })
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.error("Erreur de connexion MongoDB:", err));

// Montage des routes d'authentification
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
