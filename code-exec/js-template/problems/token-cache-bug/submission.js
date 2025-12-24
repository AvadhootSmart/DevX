// code-exec/js-template/problems/token-cache-bug/submission.js
const express = require("express");

const app = express();
const tokenCache = {};

function authMiddleware(req, res, next) {
  const auth = req.headers["authorization"];
  if (!auth) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = auth.replace("Bearer ", "");

  if (tokenCache[token]) {
    req.user = tokenCache[token];
    return next();
  }

  const parts = token.split(":");
  if (parts.length !== 2) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const userId = parts[0];
  const expiresAt = Number(parts[1]);

  if (Date.now() > expiresAt) {
    return res.status(401).json({ error: "Token expired" });
  }

  tokenCache[token] = { id: userId };
  req.user = { id: userId };
  next();
}

app.get("/profile", authMiddleware, (req, res) => {
  res.json({ userId: req.user.id });
});

module.exports = app;