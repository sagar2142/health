const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

// Log all incoming requests to session routes
router.use((req, res, next) => {
  console.log('Session route:', req.method, req.originalUrl, req.body);
  next();
});

// Start session (call after login)
router.post('/start', sessionController.startSession);

// Store sensor data (call after each sensor update)
router.post('/store', sessionController.storeSensorData);

// End session (call on logout)
router.post('/end', sessionController.endSession);

module.exports = router;
