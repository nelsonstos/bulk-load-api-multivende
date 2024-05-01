const productService = require("../services/product.service");

 class ProductController {

    async create(req, res) {
      try {
         const { name, code, authorizationCode,  totalProducts, batchSize } = req.body;
         const newProduct = await productService.create({ name, code, authorizationCode, totalProducts, batchSize });
         res.status(201).json(newProduct);
      } catch (error) {
          console.error('Error al crear el producto:', error);
          throw error;
      }
    }
 }

 module.exports = ProductController;