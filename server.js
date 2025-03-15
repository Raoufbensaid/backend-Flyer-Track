const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Dans server.js
const usersRoute = require("./routes/users");
app.use("/api/users", usersRoute);

// Middleware pour autoriser les requêtes et parser le JSON
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.error("Erreur de connexion MongoDB", err));

// Route d'exemple
app.get("/", (req, res) => res.send("API en ligne"));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Serveur démarré sur le port ${port}`));
