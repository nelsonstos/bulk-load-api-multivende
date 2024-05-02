const axios = require('axios');
require('../config/dotenv');

class MultivendeClient {
  constructor() {

    this.instance = axios.create({
      baseURL: process.env.MULTIVENDE_API_URL, 
      headers: {
        'cache-control': 'no-cache',
        'Content-Type': 'application/json'
        
      }
    });
  }

  async generateAccessToken(code) {
   try {
      const request = {
        client_id: process.env.MULTIVENDE_CLIENT_ID,
        client_secret: process.env.MULTIVENDE_CLIENT_SECRET,
        grant_type: process.env.MULTIVENDE_GRANT_TYPE,
        code: code
      }
      const response = await this.instance.post('/oauth/access-token', request);
      return response.data
    } catch (error) {
      console.error('Error al generar el access token:', error.response?.data ?? error.message);
      return error.response
    }
  }

  isTokenExpired(createdAt, expiresAt) {

    if(createdAt === '' || expiresAt === '') {
      return false;
    }
    // Supongamos que tienes una variable que almacena la fecha de expiración del token en milisegundos
    const tokenExpirationTime = this.getTokenExpirationTime(createdAt, expiresAt); // Debes implementar esta función
  
    // Obtener la fecha y hora actuales en milisegundos
    const currentTime = Date.now();
  
    // Verificar si el token ha expirado comparando la fecha de expiración con la fecha y hora actuales
    return currentTime >= tokenExpirationTime;
  }

  getTokenExpirationTime(createdAt, expiresAt) {
    // Supongamos que el token es un objeto que contiene la fecha de emisión y la duración de validez del token
    const createdAtt = Date.parse(createdAt); // Fecha de emisión del token en milisegundos
    const expiresAtn = Date.parse(expiresAt); // Duración de validez del token en segundos
  
    // Calcular la fecha de expiración sumando la duración de validez del token a la fecha de emisión
    const expirationTimeInMilliseconds = createdAtt + (expiresAtn * 1000); // Convertir expiresAt a milisegundos
  
    return expirationTimeInMilliseconds;
  }

 
  async getInfo(accessToken) {
    try {
      const response = await this.instance.get( `/api/d/info`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      return response.data;
    } catch (error) {
        console.error('Error al obtener la información:', error.response?.data ?? error.message);
      throw error;
    }
  }

  async registerProduct(accessToken, merchantId, productData) {
    console.log("accessToken: ", accessToken);
    console.log("merchantId: ", merchantId);
    try {
      const response = await this.instance.post( `/api/m/${merchantId}/products`, productData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al registrar el producto:', error.response?.data ?? error.message);
      throw error;
    }
  }
}

module.exports = MultivendeClient;
