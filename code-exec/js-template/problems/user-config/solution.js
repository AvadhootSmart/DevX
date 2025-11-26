const express = require('express');
const router = express.Router();

// Simulated in-memory storage: Key is userId, Value is the config object
const userConfigs = {};
const FIXED_USER_ID = 'user-123'; // Required fixed user ID

// 1. POST /config
router.post('/config', (req, res) => {
  const config = req.body;
  
  // Basic check for empty body, though we allow any object to be stored
  if (!config || typeof config !== 'object' || Object.keys(config).length === 0) {
      return res.status(400).send({ message: "Invalid configuration object provided." });
  }

  // Store the config (overwrites any existing one for this ID)
  userConfigs[FIXED_USER_ID] = config;
  
  // Respond with 201 Created and the stored object
  return res.status(201).json(config);
});

// 2. GET /config
router.get('/config', (req, res) => {
  const config = userConfigs[FIXED_USER_ID];

  // Check if config exists
  if (!config) {
    // Respond with 404 Not Found
    return res.status(404).send({ message: "Configuration not found for user." });
  }

  // Respond with 200 OK and the object
  return res.status(200).json(config);
});

module.exports = router;
