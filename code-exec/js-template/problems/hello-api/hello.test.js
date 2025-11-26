const request = require("supertest");
const express = require("express");
const submission = require("./submission"); // the user code

describe("Hello World API", () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/", submission);
  });

  test("GET /hello returns Hello World", async () => {
    const res = await request(app).get("/hello");
    expect(res.status).toBe(200);
    expect(res.text).toBe("Hello World");
  });

  test("POST /sum returns correct sum", async () => {
    const res = await request(app)
      .post("/sum")
      .send({ numA: 5, numB: 7 });
    expect(res.status).toBe(200);
    expect(res.text).toBe("sum:12");
  });
});
