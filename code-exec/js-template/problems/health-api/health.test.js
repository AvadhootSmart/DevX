const request = require("supertest");
const express = require("express");
const submission = require("./submission"); // the user code

describe("Health API", () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/", submission);
  });

  test("GET /health returns status UP", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "UP" });
  });
});
