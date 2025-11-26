const express = require('express');
const router = express.Router();

// Initial data source
const initialProducts = [
  { id: 1, name: "Laptop Pro", price: 1200, category: "Electronics", inStock: 5 },
  { id: 2, name: "E-Reader Basic", price: 80, category: "Electronics", inStock: 12 },
  { id: 3, name: "Novel 'The Code'", price: 15, category: "Books", inStock: 30 },
  { id: 4, name: "T-Shirt Grey", price: 25, category: "Apparel", inStock: 50 },
  { id: 5, name: "Webcam HD", price: 45, category: "Electronics", inStock: 8 },
  { id: 6, name: "Coffee Mug", price: 10, category: "Home", inStock: 100 },
];

/**
 * GET /api/v1/products
 * Query Parameters: page, limit, category, sort
 */
router.get('/api/v1/products', (req, res) => {
  let products = [...initialProducts]; // Always start with a fresh copy

  // 1. Parse and assign defaults to Query Parameters (page, limit, sort, category)
  const page = parseInt(req.query.page || 1, 10);
  const limit = parseInt(req.query.limit || 10, 10);
  const sortParam = req.query.sort || 'id:asc';
  const categoryFilter = req.query.category;


  // 2. Filtering
  // TODO: Implement filtering by 'categoryFilter'


  // 3. Sorting
  // TODO: Implement sorting logic based on 'sortParam' (e.g., 'price:desc')


  // 4. Pagination
  // TODO: Implement slicing the array based on 'page' and 'limit'

  // const totalItems = ...;
  // const paginatedData = ...;
  // const totalPages = Math.ceil(totalItems / limit);

  // return res.status(200).json({ data: paginatedData, metadata: { ... } });
  
  return res.status(501).send("Not Implemented"); // Placeholder
});

module.exports = router;
