module.exports = {
  apps: [
    {
      name: "Backend",
      script: "server.js", // ou le fichier principal de ton backend
      cwd: "/home/renderuser/app", // assure-toi que c'est le bon chemin sur Render
      env: {
        NODE_ENV: "production",
        PORT: "5000",
        MONGO_URI:
          "mongodb+srv://<user>:<password>@cluster.mongodb.net/nomBase?retryWrites=true&w=majority",
        JWT_SECRET: "tonsecretfortjwt",
      },
    },
  ],
};
