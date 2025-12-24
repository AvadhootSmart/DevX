// code-exec/js-template/problems/token-cache-bug/solution.js
const express = require("express");

const app = express();
const tokenCache = new Map();

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = auth.slice(7);

  const cached = tokenCache.get(token);
  if (cached) {
    if (Date.now() < cached.expiresAt) {
      req.user = { id: cached.userId };
      return next();
    }
    tokenCache.delete(token);
  }

  const [userId, expiresRaw] = token.split(":");
  const expiresAt = Number(expiresRaw);

  if (!userId || !Number.isFinite(expiresAt)) {
    return res.status(401).json({ error: "Invalid token" });
  }

  if (Date.now() >= expiresAt) {
    return res.status(401).json({ error: "Token expired" });
  }

  tokenCache.set(token, { userId, expiresAt });
  req.user = { id: userId };
  next();
}

app.get("/profile", authMiddleware, (req, res) => {
  res.json({ userId: req.user.id });
});

module.exports = app;