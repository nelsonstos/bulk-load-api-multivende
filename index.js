const express = require('express');
const amqp = require('amqplib');

const app = express();
const PORT = 3000;

const QUEUE_NAME = 'productos';

// Conectar a RabbitMQ
async function connect() {
  try {
    const connection = await amqp.connect('amqp://localhost:5672');
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME);
    return channel;
  } catch (error) {
    console.error('Error al conectar a RabbitMQ:', error);
  }
}

// Ruta para publicar un mensaje
app.get('/publish', async (req, res) => {
  const channel = await connect();
  const message = 'Nuevo producto registrado';
  channel.sendToQueue(QUEUE_NAME, Buffer.from(message));
  console.log('Mensaje enviado:', message);
  res.send('Mensaje enviado correctamente');
});

app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en el puerto ${PORT}`);
});
