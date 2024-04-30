const express  = require('express');
const ProductController = require('../controllers/product.controller');

const router = express.Router();

const productController = new ProductController();

router.post('/products', productController.create);

module.exports = router;
