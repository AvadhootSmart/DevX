// code-exec/js-template/problems/pagination-regression/pagination-regression.test.js
const request = require("supertest");
const app = require("./submission");

describe("Orders pagination", () => {
  test("returns first page correctly", async () => {
    const res = await request(app).get("/orders?page=1&limit=10");
    expect(res.status).toBe(200);
    expect(res.body.results[0].id).toBe(1);
  });

  test("returns second page correctly", async () => {
    const res = await request(app).get("/orders?page=2&limit=10");
    expect(res.body.results[0].id).toBe(11);
  });

  test("handles invalid params safely", async () => {
    const res = await request(app).get("/orders?page=-1&limit=abc");
    expect(res.body.results.length).toBeGreaterThan(0);
  });
});