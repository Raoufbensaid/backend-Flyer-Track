// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Configuration de CORS pour autoriser les requêtes venant de http://localhost:3000
// Tu peux remplacer 'http://localhost:3000' par l'origine souhaitée
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// Middleware pour parser le JSON
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connecté'))
  .catch((err) => console.error('Erreur de connexion MongoDB:', err));

// Importer et utiliser les routes d'authentification (assure-toi d'avoir un fichier routes/auth.js)
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Démarrage du serveur sur le port spécifié dans les variables d'environnement ou 5000 par défaut
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
