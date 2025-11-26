const request = require("supertest");
const express = require("express");
const submission = require("./submission"); // the user code

describe("Hard: Atomic Inventory Reservation", () => {
  let app;
  const STATUS_URL = "/api/v1/inventory/status";
  const RESERVE_URL = "/api/v1/inventory/reserve";
  const RESET_URL = "/testing/reset";
  const INITIAL_INVENTORY = 10;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/", submission);
  });

  // Ensure state is clean before each test using the exposed reset endpoint
  beforeEach(async () => {
    await request(app).post(RESET_URL).expect(200);
  });

  test("GET /status returns initial inventory", async () => {
    const res = await request(app).get(STATUS_URL);
    expect(res.status).toBe(200);
    expect(res.body.remaining).toBe(INITIAL_INVENTORY);
  });

  test("Sequential reservation reduces inventory correctly", async () => {
    await request(app).post(RESERVE_URL).send({ quantity: 3 }).expect(200); // 10 -> 7
    await request(app).post(RESERVE_URL).send({ quantity: 2 }).expect(200); // 7 -> 5

    const statusRes = await request(app).get(STATUS_URL);
    expect(statusRes.body.remaining).toBe(5);
  });
  
  test("Single reservation that over-reserves returns 409 Conflict", async () => {
    const res = await request(app).post(RESERVE_URL).send({ quantity: 15 }); // Tries to reserve 15 from 10
    expect(res.status).toBe(409);
    expect(res.body.message).toContain("Insufficient stock");
    
    // Check state has not changed
    const statusRes = await request(app).get(STATUS_URL);
    expect(statusRes.body.remaining).toBe(10);
  });

  /**
   * CRITICAL TEST: Concurrency
   * Simulates two requests (R1 & R2) hitting the server at the same time.
   * Total reservation requested (14) > Available (10). Only one should succeed.
   */
  test("Concurrent requests must handle over-reservation atomically (Hard Test)", async () => {
    // R1: Reserves 7 (Should Pass, Remaining: 3)
    // R2: Reserves 7 (Should Fail, Remaining: 3)
    
    // Launch two requests simultaneously using Promise.all
    const requests = [
      request(app).post(RESERVE_URL).send({ quantity: 7 }), 
      request(app).post(RESERVE_URL).send({ quantity: 7 }), 
    ];

    const [res1, res2] = await Promise.all(requests);
    
    // Check results: Exactly one must succeed (200/201) and one must conflict (409)
    const successCount = [res1.status, res2.status].filter(s => s < 400).length;
    const conflictCount = [res1.status, res2.status].filter(s => s === 409).length;

    expect(successCount).toBe(1);
    expect(conflictCount).toBe(1);

    // Final state check: Remaining inventory must be exactly 3
    const statusRes = await request(app).get(STATUS_URL);
    expect(statusRes.status).toBe(200);
    expect(statusRes.body.remaining).toBe(3);
  });
});
