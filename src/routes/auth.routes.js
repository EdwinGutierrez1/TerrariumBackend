const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/verify-token', authController.login);
router.post('/logout', authController.logout);
router.get('/username/:uid', authController.getUserName);

module.exports = router;