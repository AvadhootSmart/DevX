const express = require('express');
const router = express.Router();

// Initial inventory state
let currentInventory = 10;
const RESERVE_ITEM_ID = 'PROD-A';

// We initialize a Promise that will be used to create a serial queue.
// All reservation logic will be chained onto this promise.
let inventoryLock = Promise.resolve();

// Utility for testing (resets the inventory for the next test run)
router.post('/testing/reset', (req, res) => {
    currentInventory = 10;
    inventoryLock = Promise.resolve();
    res.status(200).send({ message: "Inventory reset to 10." });
});

// 1. GET /api/v1/inventory/status
router.get('/api/v1/inventory/status', (req, res) => {
  // TODO: Return the current inventory status
});

/**
 * 2. POST /api/v1/inventory/reserve
 * This is the challenging endpoint requiring atomic updates.
 */
router.post('/api/v1/inventory/reserve', (req, res) => {
  const { quantity } = req.body;
  const quantityToReserve = parseInt(quantity, 10);
  
  if (isNaN(quantityToReserve) || quantityToReserve <= 0) {
    return res.status(400).json({ message: "Quantity must be a positive integer." });
  }

  // TODO: Implement the atomic reservation logic here.
  // HINT: Chain the reservation logic onto the 'inventoryLock' promise to
  // ensure the check (if enough stock) and the update (decrement) happen
  // without interruption from another concurrent request.
  
  // The final response must be sent *after* the promise resolves.
  
  return res.status(501).send("Not Implemented"); // Placeholder
});

module.exports = router;
