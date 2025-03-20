// routes/auth.js
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Identifiants invalides" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Identifiants invalides" });
    }

    // Exemple : si on essaie de se connecter via l'interface admin,
    // on vérifie que l'utilisateur a bien le rôle 'admin'
    if (req.query.role === "admin" && user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Accès refusé : vous n'êtes pas administrateur" });
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
