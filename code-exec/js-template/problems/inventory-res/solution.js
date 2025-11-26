const express = require('express');
const router = express.Router();

let currentInventory = 10;
const RESERVE_ITEM_ID = 'PROD-A';

// The promise chain used to simulate a software lock for atomic state updates.
let inventoryLock = Promise.resolve();

// Utility for testing (resets the inventory for the next test run)
router.post('/testing/reset', (req, res) => {
    currentInventory = 10;
    inventoryLock = Promise.resolve();
    res.status(200).send({ message: "Inventory reset to 10." });
});

// 1. GET /api/v1/inventory/status
router.get('/api/v1/inventory/status', (req, res) => {
  return res.status(200).json({ itemId: RESERVE_ITEM_ID, remaining: currentInventory });
});

/**
 * 2. POST /api/v1/inventory/reserve
 * Implements atomic reservation using a promise chain.
 */
router.post('/api/v1/inventory/reserve', (req, res) => {
  const { quantity } = req.body;
  const quantityToReserve = parseInt(quantity, 10);
  
  if (isNaN(quantityToReserve) || quantityToReserve <= 0) {
    return res.status(400).json({ message: "Quantity must be a positive integer." });
  }

  // Define a structure to hold the response data that will be populated inside the chain
  const deferredResponse = {};

  // CRITICAL SECTION: Define the new lock chain by attaching a function to the old one.
  inventoryLock = inventoryLock.then(() => {
    // This code runs *serially* after the previous request in the chain completes.
    
    if (currentInventory >= quantityToReserve) {
      // SUCCESS: Update the state
      currentInventory -= quantityToReserve;
      deferredResponse.status = 200;
      deferredResponse.body = { 
          itemId: RESERVE_ITEM_ID, 
          reserved: quantityToReserve, 
          remaining: currentInventory 
      };
    } else {
      // FAILURE: Insufficient stock
      deferredResponse.status = 409;
      deferredResponse.body = { 
          message: "Insufficient stock. Over-reservation prevented.", 
          available: currentInventory 
      };
    }
    // Return a value to continue the chain (or just let it complete)
  });

  // Wait for the entire chain (including this request's logic) to complete
  // before sending the HTTP response.
  inventoryLock.then(() => {
    res.status(deferredResponse.status).json(deferredResponse.body);
  });
});

module.exports = router;
