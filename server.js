require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Configuration de CORS pour autoriser les requêtes depuis http://localhost:3000 et http://192.168.1.182:3000
const allowedOrigins = ["http://localhost:3000", "http://192.168.1.182:3000"];
app.use(
  cors({
    origin: function (origin, callback) {
      // Autorise les requêtes sans origine (ex. Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "L'origine de la requête (" +
          origin +
          ") n'est pas autorisée par CORS.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

// Middleware pour parser le JSON
app.use(express.json());

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.error("Erreur de connexion MongoDB:", err));

// Exemple de route d'authentification
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
