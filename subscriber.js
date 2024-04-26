const amqp = require('amqplib');

const QUEUE_NAME = 'productos';

async function connect() {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME);
    
    // Consumir mensajes
    channel.consume(QUEUE_NAME, (message) => {
      console.log('Mensaje recibido:', message.content.toString());
      // Aquí puedes realizar alguna acción con el mensaje recibido
    }, { noAck: true });

    console.log('Esperando mensajes...');
  } catch (error) {
    console.error('Error al conectar a RabbitMQ:', error);
  }
}

connect();
