const dotenv = require('dotenv');
dotenv.config({ path: './../.env' });
const moment = require('moment');

const MultivendeClient = require("../clients/multivende.client");
const RabbitMQClient = require("../config/rabbitMQ");
const ProductRepository = require('../api/repositories/product.repository');
const LogbookRepository = require('../api/repositories/logbook.reporsitory');

const QUEUE_NAME = 'productos';
const NUM_CHANNELS = 10; // Número de canales para procesar los mensajes
const MAX_RETRIES = 3; // Número máximo de reintentos
const REQUESTS_PER_SECOND = 5; // Número de peticiones por segundo
const RETRY_DELAY = 1000; // Retraso en milisegundos antes de reintentar

const rabbitMQ = new RabbitMQClient();
const multivendeClient = new MultivendeClient();
const productRepository = new ProductRepository();
const logbookRepository = new LogbookRepository();

let accessToken = '';
let merchantId = '';
let expiresAt = '';
let authorizationCode = ''
let totalProcessed = 0;
let totalFailed = 0;
let totalProductsToProcess = 0  
let logbookId = 0
let tokenExpiration = null;
let tokenRefreshed = false;
let refreshToken = null;
let refreshTokenExpiration = null;
let isFirstCheck = true;

async function connect() {
  try {

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

    totalProcessed += products.length;
    for (const product of products) {
        try {
            await retryWithBackoff(processProduct, [product], MAX_RETRIES);
        } catch (error) {
            totalFailed ++;
            console.error('Error al procesar el producto:', error);
        }
    }

    if (totalProductsToProcess === totalProcessed + totalFailed) {
        await updateLogbook();
      }
}

async function processProduct(product) {
  try {
    // Lógica de procesamiento del producto

     //await checkAndRefreshToken(product);

     if(!tokenRefreshed || isTokenExpired()) {
      logbookId = product.logbookId;
      await refreshAccessToken();
      tokenRefreshed = true;
    }

    const respMulti = await multivendeClient.registerProduct(accessToken, merchantId, buildProduct(product));

    product.status = respMulti.status
    const resp = await productRepository.create(product);
    console.log('Producto procesado:', resp);
    
  } catch (error) {
    throw new Error('Error al procesar el producto: ' + error.message);
  }
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
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
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

function buildProduct(product) {
  const request = {
    "name": product.name,
    "alias": product.alias,
    "model": product.model,
    "description": product.description,
    "code": product.code,
    "internalCode": product.internalCode,
    "shortDescription": product.shortDescription,
    "htmlDescription": product.htmlDescription,
    "htmlShortDescription": product.htmlShortDescription
  };
  return request;
}

async function updateLogbook() {
    const now = moment();
    const endDate  = now.toDate();
    try {
      const logbookDetails = {
        where: {
            id: logbookId,
        },
        data: {
            status: "COMPLETED",
            totalRecorded: totalFailed,
            endDate: endDate,
        }
      };
      await logbookRepository.update(logbookDetails);
      console.log('Detalles registrados en el logbook:', logbookDetails);
    } catch (error) {
      console.error('Error al registrar en el logbook:', error);
    }
  }

  // Función para verificar si el token ha expirado
function isTokenExpired() {
    if(!tokenExpiration || moment()>= tokenExpiration) {
      return true; // token expired
    } else {
      return false; // token not expired
    }
}

async function refreshAccessToken() {
  try {
    const logbook = await logbookRepository.find({ id: logbookId });
    const authorizationCode = logbook.authorizationCode;

    let dataToken = null;
    if (!refreshToken) {
      // Generar un nuevo token de acceso si no hay un token de refresco
      dataToken = await multivendeClient.generateAccessToken(authorizationCode);
    } else {
      // Refrescar el token de acceso utilizando el token de refresco existente
      dataToken = await multivendeClient.generateRefreshAccessToken(refreshToken);
    }

    // Actualizar los valores del token de acceso, token de refresco y fechas de vencimiento
    accessToken = dataToken.token;
    refreshToken = dataToken.refreshToken;
    tokenExpiration = moment(dataToken.expiresAt);
    refreshTokenExpiration = moment(dataToken.refreshTokenExpiresAt);

    // Actualizar otras variables necesarias
    totalProductsToProcess = logbook.total;
    merchantId = dataToken.MerchantId;

    console.log('Se ha actualizado el token:', accessToken);

    // Si se ha realizado un refresh, actualizar refreshTokenExpiration
    if (refreshToken !== null) {
      tokenExpiration = refreshTokenExpiration;
    }
  } catch (error) {
    console.error('Error al actualizar el token:', error);
  }
}



connect();
