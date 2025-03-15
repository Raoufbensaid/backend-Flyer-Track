// Exemple de fonctions de contrôleur
exports.getAllUsers = (req, res) => {
  // Récupérer les utilisateurs depuis la base de données
  res.send("Liste des utilisateurs");
};

exports.createUser = (req, res) => {
  // Créer un nouvel utilisateur
  res.send("Utilisateur créé");
};
