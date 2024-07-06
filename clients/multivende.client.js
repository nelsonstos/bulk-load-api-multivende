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

  async generateRefreshAccessToken(refreshToken) {
    try {
      const request = {
        client_id: process.env.MULTIVENDE_CLIENT_ID,
        client_secret: process.env.MULTIVENDE_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: refreshToken
      }
      const response = await this.instance.post('/oauth/access-token', request);
      return response.data
    } catch (error) {
      console.error('Error al generar el access token:', error.response?.data ?? error.message);
      return error.response
    }
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
