const express = require('express');
const mongoose = require('mongoose');

const checkAuth = require('../middleware/check-auth');
const OrderController = require('../controllers/orderController');

const router = express.Router();

router.get('/', checkAuth, OrderController.getAllOrders);

router.post('/', checkAuth, OrderController.createOrder);

router.get('/:orderId', checkAuth, OrderController.getSingleOrder);

router.delete('/:orderId', checkAuth, OrderController.deleteOrder);

module.exports = router;
