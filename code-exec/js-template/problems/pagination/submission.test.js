const request = require("supertest");
const express = require("express");
const submission = require("./submission"); // the user code

describe("Medium: Paginated Data API with Filtering and Sorting", () => {
  let app;
  const url = "/api/v1/products";

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/", submission);
  });

  // Test 1: Defaults (Limit=10, Page=1)
  test("GET /products returns all 6 items with default pagination metadata", async () => {
    const res = await request(app).get(url);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(6);
    expect(res.body.metadata).toEqual({
      totalItems: 6,
      totalPages: 1,
      currentPage: 1,
      itemsPerPage: 10,
    });
  });

  // Test 2: Filtering (Category)
  test("Filtering by category 'Electronics' returns only 3 items", async () => {
    const res = await request(app).get(`${url}?category=Electronics`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(3);
    // Verify that all returned items are in the correct category
    expect(res.body.data.every(p => p.category === 'Electronics')).toBe(true);
    expect(res.body.metadata.totalItems).toBe(3); // Metadata must reflect filtered total
  });

  // Test 3: Sorting (Price Descending)
  test("Sorting by 'price:desc' returns the highest priced item first", async () => {
    const res = await request(app).get(`${url}?sort=price:desc`);
    expect(res.status).toBe(200);
    // The most expensive item is Laptop Pro (1200)
    expect(res.body.data[0].name).toBe("Laptop Pro");
  });

  // Test 4: Pagination (Limit=2, Page=3)
  test("Pagination limit=2, page=3 returns the 5th and 6th items", async () => {
    const res = await request(app).get(`${url}?limit=2&page=3&sort=id:asc`); // Sort by ID to ensure predictable order
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
    // The 5th item has id: 5, the 6th item has id: 6
    expect(res.body.data[0].id).toBe(5);
    expect(res.body.metadata).toEqual({
      totalItems: 6,
      totalPages: 3,
      currentPage: 3,
      itemsPerPage: 2,
    });
  });
  
  // Test 5: Combined Filter and Pagination
  test("Combined filter/limit/page returns correct subset and metadata", async () => {
    // Filter by Electronics (3 items total: 1200, 80, 45). Limit 2 per page.
    const res = await request(app).get(`${url}?category=Electronics&limit=2&page=2&sort=price:desc`);
    
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1); // Page 2 should only have 1 item (the 3rd item overall)
    expect(res.body.data[0].price).toBe(45); // Webcam HD
    
    expect(res.body.metadata.totalItems).toBe(3);
    expect(res.body.metadata.totalPages).toBe(2);
    expect(res.body.metadata.currentPage).toBe(2);
  });
});
