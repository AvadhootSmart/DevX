package problems

var PROBLEM_PAGINATION_BOILERPLATE = `const express = require('express');
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
`

var PROBLEM_PAGINATION_TESTS = []Test{
	{
		Input: "",
		Output: "Hello World",
		Explanation: "",
	},
}

var PROBLEM_PAGINATION = IProblem{
	ID: "pagination",
	Name: "Pagination",
	Description: "Implement Pagination",
	Difficulty: "medium",
	Boilerplate: PROBLEM_PAGINATION_BOILERPLATE,
	Tests: PROBLEM_PAGINATION_TESTS,
	Topics: []string{"Pagination", "dataset", "API", "ExpressJS", "responses"},
}

var SOLUTION_PAGINATION = `const express = require('express');
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
let products = [...initialProducts]; // Start with a fresh copy

// --- 1. Parse and assign defaults to Query Parameters ---
const page = parseInt(req.query.page || 1, 10);
const limit = parseInt(req.query.limit || 10, 10);
const sortParam = req.query.sort || 'id:asc';
const categoryFilter = req.query.category;

if (page < 1 || limit < 1) {
return res.status(400).json({ message: "Page and limit must be positive." });
}

// --- 2. Filtering ---
if (categoryFilter) {
products = products.filter(p => p.category === categoryFilter);
}

const totalItems = products.length; // Total items AFTER filtering

// --- 3. Sorting ---
const [sortBy, sortDir] = sortParam.split(':');
const direction = sortDir === 'desc' ? -1 : 1;

products.sort((a, b) => {
const aVal = a[sortBy];
const bVal = b[sortBy];

if (aVal < bVal) return -1 * direction;
if (aVal > bVal) return 1 * direction;
return 0;
});

// --- 4. Pagination (Slicing) ---
const startIndex = (page - 1) * limit;
const endIndex = page * limit;
const paginatedData = products.slice(startIndex, endIndex);

// --- 5. Respond with data and metadata ---
const totalPages = Math.ceil(totalItems / limit);

const metadata = {
totalItems,
totalPages,
currentPage: page,
itemsPerPage: limit
};

return res.status(200).json({ data: paginatedData, metadata });
});

module.exports = router;

`
