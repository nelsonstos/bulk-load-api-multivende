const amqp = require('amqplib');
const dotenv = require('dotenv');

dotenv.config();

class RabbitMQClient {
   
    async connect() {
        try {
            const connection = await amqp.connect(process.env.RABBITMQ_URL);
            const channel = await connection.createChannel();
            await channel.assertQueue(process.env.QUEUE_NAME);

            return { connection, channel }

        }
        catch (error) {
            console.error('Error al conectar a RabbitMQ:', error);
        }

    }
}

module.exports = RabbitMQClient;