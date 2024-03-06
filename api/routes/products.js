const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const upload = multer({ dest: 'uploads/' });
const router = express.Router();
const ProductController = require('../controllers/productController');

router.get('/', ProductController.getAllProducts);

router.post('/', checkAuth, ProductController.createProduct);

router.get('/:productId', ProductController.getSingleProduct);

router.patch('/:productId', checkAuth, ProductController.updateProduct);

router.delete('/:productId', checkAuth, ProductController.deleteProduct);

module.exports = router;
