// code-exec/js-template/problems/pagination-regression/solution.js
const express = require("express");

const app = express();

const orders = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
}));

app.get("/orders", (req, res) => {
  let page = Number(req.query.page ?? 1);
  let limit = Number(req.query.limit ?? 10);

  if (!Number.isInteger(page) || page < 1) page = 1;
  if (!Number.isInteger(limit) || limit < 1 || limit > 50) limit = 10;

  const start = (page - 1) * limit;
  const end = start + limit;

  res.json({
    page,
    limit,
    results: orders.slice(start, end),
  });
});

module.exports = app;