const dotenv = require('dotenv');
dotenv.config({ path: './../.env' });

const MultivendeClient = require("../clients/multivende.client");
const RabbitMQClient = require("../config/rabbitMQ");
const ProductRepository = require('../api/repositories/product.repository');

const QUEUE_NAME = 'productos';
const NUM_CHANNELS = 10; // Número de canales para procesar los mensajes
const MAX_RETRIES = 3; // Número máximo de reintentos
const REQUESTS_PER_SECOND = 5; // Número de peticiones por segundo
const RETRY_DELAY = 1000; // Retraso en milisegundos antes de reintentar

const rabbitMQ = new RabbitMQClient();
const multivendeClient = new MultivendeClient();
const productRepository = new ProductRepository();

let accessToken = '';
let expiresIn = '';
let issuedAt = '';
let code = 'ac-f25cf110-f86d-4fd1-b8a6-57a939d3d9a6'

async function connect() {
  try {

    /*const dataToken = await multivendeClient.generateAccessToken(code);
    accessToken = dataToken.token;
    issuedAt = dataToken.createdAt;
    expiresIn = dataToken.expiresAt;
    console.log('Access token refreshed:', accessToken);

    const info = await multivendeClient.getInfo(accessToken);

    console.log("MerchantId: ", info.MerchantId);

   /* setInterval(() => {
        // Esta función se ejecutará cada segundo
        console.log('Ejecutando tarea repetida...');
      }, 1000);*/


   const { connection } = await rabbitMQ.connect();
    const channels = [];
    for (let i = 0; i < NUM_CHANNELS; i++) {
      const subChannel = await connection.createChannel();
      await subChannel.assertQueue(QUEUE_NAME);
      channels.push(subChannel);
    }

    channels.forEach(subChannel => {
      subChannel.consume(QUEUE_NAME, async (message) => {
        if (message !== null) {
          let jsonString = message.content.toString().trim();      
          const productos = JSON.parse(jsonString); 
          await processProducts(productos);
          subChannel.ack(message);
        }
      });
    });

    console.log('Esperando mensajes...');
  } catch (error) {
    console.error('Error al conectar a RabbitMQ:', error);
  }
}

async function processProducts(products) {
  const batchSize = Math.ceil(products.length / REQUESTS_PER_SECOND);
  const chunkedProducts = chunkArray(products, batchSize);

  for (const chunk of chunkedProducts) {
    try {
      await retryWithBackoff(processBatch, [chunk], MAX_RETRIES);
    } catch (error) {
      console.error('Error al procesar los productos:', error);
      // Guardar el log en Redis
      //redisClient.rpush('error_logs', JSON.stringify({ message: 'Error al procesar los productos', error }));
    }
  }
}

async function processBatch(products) {
  const requests = [];
  for (const product of products) {
    requests.push(retryWithBackoff(processProduct, [product], MAX_RETRIES));
  }
  await Promise.all(requests);
}

async function processProduct(product) {
  // Simular una petición al servicio externo de Multivende
  //await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación de 1 segundo de petición
  // Lógica de procesamiento del producto
  //const resp = await multivendeClient.registerProduct(accessToken, merchantId, product);
  const resp = await productRepository.create(product);
  console.log('Producto procesado:', resp);
}

async function retryWithBackoff(func, args, maxRetries) {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      await func(...args); // Llamamos a la función con los argumentos desempaquetados
      return;
    } catch (error) {
      retries++;
      console.log(`Reintentando... (Intento ${retries}/${maxRetries})`);
      if (retries === maxRetries) {
        throw new Error(`Máximo número de reintentos (${maxRetries}) alcanzado.`);
      }
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retries));
    }
  }
}

function chunkArray(array, size) {
  const chunkedArr = [];
  for (let i = 0; i < array.length; i += size) {
    const chunk = array.slice(i, i + size);
    chunkedArr.push(chunk);
  }
  return chunkedArr;
}

connect();
