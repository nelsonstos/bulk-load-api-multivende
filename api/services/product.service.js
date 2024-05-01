const casual = require('casual');
const { v4: uuidv4 } = require('uuid');

const RabbitMQClient = require("../../config/rabbitMQ");
//const ProductRepository = require("../repositories/product.repository");
const Generate = require('../utils/generate.utils');
const dotenv = require('dotenv');
const MultivendeClient = require('../../clients/multivende.client');


dotenv.config();



class  ProductService  {

    constructor() {
        this.rabbitMQClient = new RabbitMQClient();
        this.generateName = new Generate();
        this.multivendeClient = new MultivendeClient();
        this.casualName = ""
     
    }

    async create(data) {
        const { name, code, authorizationCode, totalProducts, batchSize } = data;
      
       /* const client = await this.multivendeClient.generateAccessToken(authorizationCode);

        console.log("token: ", client.token);

        const info = await this.multivendeClient.getInfo(client.token);

        console.log("MerchantId: ", info.MerchantId);

        const prod = {
            "name": "Product 0001",
            "alias": "test product alias",
            "model": "XX5A",
            "description": "plain text description",
            "code": "12344123",
            "internalCode": "45353453",
            "shortDescription": "​plain short text description",
            "htmlDescription": "<h1>​HTML text description</h1>",
            "htmlShortDescription": "<h1>​​HTML short text description</h1>"
           };

        const createProduct = await this.multivendeClient.registerProduct(client.token, info.MerchantId, prod);

        console.log("createProduct: ", createProduct.data);*/


        const { channel } = await this.rabbitMQClient.connect();

        const numBatches = Math.ceil(totalProducts / batchSize);
        try {
            //const productRepository = new ProductRepository();

            const nameGenerate = this.generateName.generateProductName();

            const casual = this.generateProduct(nameGenerate);

            for (let i = 0; i < numBatches; i++) {
                const products = [];
                for (let j = 0; j < batchSize && (i * batchSize + j) < totalProducts; j++) {

                  const product = casual.Product;
                 /* const data = {
                    product: product,
                    authorizationCode: authorizationCode,
                    clientId: process.env.MULTIVENDE_CLIENT_ID,
                    clientSecret: process.env.MULTIVENDE_CLIENT_SECRET,
                    clientGrantType: process.env.MULTIVENDE_GRANT_TYPE,
                  }*/
                  products.push(product);
                  //const newProduct = await productRepository.create(product);
                  //console.log("producto registrado en base de datos: ", newProduct)
                }
                this.sendProducts(channel, products);
            }

            await channel.close();
            return null;
        } catch (error) {
            console.error('Error al crear el producto:', error);
            throw error;
        }

    }

    sendProducts(channel, products) {
        try {
          //const batchMessage = products.map(product => JSON.stringify(product)).join('\n');
          channel.sendToQueue(process.env.QUEUE_NAME, Buffer.from(JSON.stringify(products)));
          console.log('Lote de productos enviado:', products);
        } catch (error) {
          console.error('Error al enviar los productos:', error);
          throw error;
        }
    }

    
    // Función para generar un producto aleatorio con Casual
    generateProduct(generateName) {
        casual.seed(123); // Semilla para reproducibilidad
        casual.define('Product', function() {
            return {
            id: uuidv4().toString(),
            name: generateName,
            alias: casual.word,
            model: casual.random_element(['A1', 'B2', 'C3', 'D4']),
            description: casual.sentence,
            code: casual.integer(10000000, 99999999).toString(),
            internalCode: casual.integer(10000000, 99999999).toString(),
            shortDescription: casual.words(5),
            htmlDescription: `<h1>${casual.sentence}</h1>`,
            htmlShortDescription: `<h1>${casual.words(3)}</h1>`
            };
        });

        return casual;
    }

   
}

module.exports = new ProductService;