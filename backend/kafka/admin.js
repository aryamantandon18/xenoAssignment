// const { Kafka } = require('kafkajs');

// const kafka = new Kafka({
//   clientId: 'crm-admin',
//   brokers: [process.env.KAFKA_BROKERS || 'localhost:9092']
// });

// const admin = kafka.admin();

// const createTopics = async () => {
//   await admin.connect();
  
//   const topics = [
//     {
//       topic: 'CUSTOMER_CREATE',
//       numPartitions: 3,
//       replicationFactor: 1
//     },
//     {
//       topic: 'ORDER_CREATE',
//       numPartitions: 3,
//       replicationFactor: 1
//     },
//     {
//       topic: 'CAMPAIGN_UPDATES',
//       numPartitions: 3, 
//       replicationFactor: 1
//     }
//   ];

//   await admin.createTopics({
//     topics,
//     waitForLeaders: true
//   });

//   console.log('Topics created successfully');
//   await admin.disconnect();
// };

// const initializeKafka = async () => {
//   try {
//     await createTopics();
//   } catch (err) {
//     console.error('Error initializing Kafka:', err);
//     process.exit(1);
//   }
// };

// module.exports = {
//   initializeKafka
// };