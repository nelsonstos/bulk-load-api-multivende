const prisma = require('../config/prisma');
const Product = require("../models/product.model");

class ProductRepository {

    async create( data) {

        console.log("data: ", data);

        return await prisma.products.create({data});

    }
}

module.exports = ProductRepository;