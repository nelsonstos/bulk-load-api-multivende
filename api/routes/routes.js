const express  = require('express');
const ProductController = require('../controllers/product.controller');
const PersonController = require('../controllers/person.controller');
const EmailController = require('../controllers/email.controller');

const router = express.Router();

const productController = new ProductController();
const personController = new PersonController();
const emailController = new EmailController();

router.post('/products', productController.create);
router.get('/persons', personController.getPerson);
router.get('/emails',emailController.getEmails);

module.exports = router;
