const express = require('express');
const router = express.Router();
const { createStripePayment } = require('../controllers/paymentController');

router.post('/stripe', createStripePayment);

module.exports = router;
