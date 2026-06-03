const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/delete-account', authController.deleteAccount);
router.post('/get-profile', authController.getProfile);
router.post('/update-profile', authController.updateProfile);

module.exports = router;
