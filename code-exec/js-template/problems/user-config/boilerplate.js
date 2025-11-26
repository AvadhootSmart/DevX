const express = require('express');
const router = express.Router();

// Simulated in-memory storage: Key is userId, Value is the config object
// NOTE: For this exercise, use a fixed userId 'user-123' for all requests.
const userConfigs = {};
const FIXED_USER_ID = 'user-123';

// 1. POST /config
router.post('/config', (req, res) => {
  // TODO: Implement logic to store the configuration object for 'user-123'
  // 1. Get config from req.body
  // 2. Store the config object in userConfigs
  // 3. Respond with 201 and the stored object
});

// 2. GET /config
router.get('/config', (req, res) => {
  // TODO: Implement logic to retrieve the configuration object for 'user-123'
  // 1. Retrieve the config from userConfigs
  // 2. If config exists, respond with 200 and the object
  // 3. If no config exists, respond with 404
});

module.exports = router;
