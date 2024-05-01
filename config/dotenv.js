
try {
    const dotenv = require('dotenv');

    // Cargar las variables de entorno desde el archivo .env
    dotenv.config();
  } catch (error) {
    console.error("Error loading .env file:", error);
  }