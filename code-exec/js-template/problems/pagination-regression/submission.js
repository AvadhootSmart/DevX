// code-exec/js-template/problems/pagination-regression/submission.js
const express = require("express");

const app = express();

const orders = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
}));

app.get("/orders", (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);

  const start = page * limit;
  const end = start + limit;

  const results = orders.slice(start, end);

  res.json({
    page,
    limit,
    results,
  });
});

module.exports = app;