const express = require('express');
const router = express.Router();
const { createStripePayment, createMercadoPagoPayment } = require('../controllers/paymentController');

router.post('/stripe', createStripePayment);
router.post('/mercadopago', createMercadoPagoPayment);

module.exports = router;
