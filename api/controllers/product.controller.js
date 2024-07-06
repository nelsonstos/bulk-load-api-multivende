const { StatusCodes } = require("http-status-codes");
const productService = require("../services/product.service");
const resp = require("../utils/response.utils");

 class ProductController {

    async create(req, res) {
      try {
         const { name, authorizationCode,  totalProducts, batchSize } = req.body;

         const product = await productService.create({ name, authorizationCode, totalProducts, batchSize });
         const response = resp.response(StatusCodes.CREATED, {product}, "Mass registration of products has been executed successfully!")
         res.status(StatusCodes.CREATED).json(response);
      } catch (error) {
         const response = resp.response(StatusCodes.INTERNAL_SERVER_ERROR, null, 'An error occurred while creating the product');
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
          throw error;
      }
   }
 }

 module.exports = ProductController;