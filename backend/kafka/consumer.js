const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'crm-consumer',
  brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
  logLevel: process.env.KAFKA_LOG_LEVEL || 'info'
});

const consume = async (groupId, topic, callback) => {
  const consumer = kafka.consumer({ groupId });
  await consumer.connect();
  await consumer.subscribe({ topic });
  await consumer.run({
    eachMessage: async ({ message }) => {
      await callback(message);
    }
  });
};

module.exports = {consume};

// const createConsumer = async (groupId, topic, handler) => {
//   const consumer = kafka.consumer({ 
//     groupId,
//     heartbeatInterval: 3000,
//     sessionTimeout: 30000,
//     retry: {
//       initialRetryTime: 1000,
//       retries: 8
//     }
//   });

//   await consumer.connect(); 
//   await consumer.subscribe({ topic, fromBeginning: false });

//   await consumer.run({
//     eachMessage: async ({ topic, partition, message }) => {
//       try {
//         const payload = JSON.parse(message.value.toString());
//         console.log(`Processing ${topic} message from partition ${partition}`);
//         await handler(payload);
//       } catch (err) {
//         console.error(`Error processing message:`, err);
//         // Implement dead-letter queue logic here
//       }
//     }
//   });

//   return consumer;
// };
// module.exports = { createConsumer };
