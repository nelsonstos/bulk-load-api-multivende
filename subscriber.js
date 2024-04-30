const amqp = require('amqplib');

const QUEUE_NAME = 'productos';

async function connect() {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, {durable: true});

    let batchCount = 0;
    
    // Consumir mensajes
    channel.consume(QUEUE_NAME, (message) => {
      if (message !== null) {
        try {
          console.log("================================");
          let jsonString = message.content.toString();
          jsonString = jsonString.trim(); 
          console.log('Cadena JSON recibida:', jsonString); 
          
          const productos = JSON.parse(jsonString); 
          console.log('Productos recibidos:', productos);
          
          productos.forEach(producto => {
            console.log('Producto recibido:', producto);
          });
        } catch (error) {
          console.error('Error al analizar el contenido del mensaje como JSON:', error);
        }
      }
    }, { noAck: true });
     
 

    

    console.log('Esperando mensajes...');
  } catch (error) {
    console.error('Error al conectar a RabbitMQ:', error);
  }
}

connect();
