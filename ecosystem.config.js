module.exports = {
  apps: [
    {
      name: "Backend",
      script: "server.js",
      cwd: "D:/FlyerTrack/backend", // Adapte le chemin si nécessaire sur ton VPS (ex: "/root/backend")
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
