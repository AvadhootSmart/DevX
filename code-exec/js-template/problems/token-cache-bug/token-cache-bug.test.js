// code-exec/js-template/problems/token-cache-bug/token-cache-bug.test.js
const request = require("supertest");
const app = require("./submission");

describe("Token cache auth middleware", () => {
  test("allows valid token", async () => {
    const token = `123:${Date.now() + 10000}`;
    const res = await request(app)
      .get("/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.userId).toBe("123");
  });

  test("rejects expired token", async () => {
    const token = `123:${Date.now() - 1000}`;
    const res = await request(app)
      .get("/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(401);
  });

  test("does not allow expired cached token", async () => {
    const token = `123:${Date.now() + 5}`;
    await request(app)
      .get("/profile")
      .set("Authorization", `Bearer ${token}`);

    await new Promise((r) => setTimeout(r, 10));

    const res = await request(app)
      .get("/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(401);
  });
});