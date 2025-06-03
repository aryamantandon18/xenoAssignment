const { Kafka } = require('kafkajs');

// Shared Kafka configuration
const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || 'crm-service',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
  logLevel: process.env.KAFKA_LOG_LEVEL || 'error',
  retry: {
    initialRetryTime: 100,
    retries: 8,
    maxRetryTime: 1000
  }
});

// Singleton producer instance
let producerInstance = null;

const getProducer = async () => {
  if (!producerInstance) {
    producerInstance = kafka.producer({
      idempotent: true,
      allowAutoTopicCreation: true,
      transactionTimeout: 30000
    });
    
    await producerInstance.connect();
  }
  return producerInstance;
};

const produce = async (topic, message) => {
  const producer = await getProducer();
  try {
    await producer.send({
      topic,
      messages: [{
        value: JSON.stringify({
          ...message,
          metadata: {
            timestamp: new Date().toISOString(),
            origin: process.env.SERVICE_NAME || 'crm-api'
          }
        })
      }],
      acks: -1 // All replicas must acknowledge
    });
  } catch (err) {
    console.error(`[Kafka] Failed to produce to ${topic}:`, err);
    throw err;
  }
};

// Enhanced consumer
const createConsumer = async (groupId) => {
  const consumer = kafka.consumer({
    groupId,
    sessionTimeout: 30000,
    heartbeatInterval: 10000,
    maxBytesPerPartition: 1048576 // 1MB
  });

  await consumer.connect();
  
  return {
    subscribe: async (topic, handler) => {
      await consumer.subscribe({ topic, fromBeginning: false });
      await consumer.run({
        eachMessage: async ({ message }) => {
          try {
            const payload = JSON.parse(message.value.toString());
            await handler(payload);
          } catch (err) {
            console.error(`[Kafka] Error processing message:`, err);
            // Implement dead-letter queue pattern here
          }
        }
      });
    },
    disconnect: async () => {
      await consumer.disconnect();
    }
  };
};

// Topics configuration
const TOPICS = {
    CUSTOMER_CREATE: 'customer.create',
    ORDER_CREATE: 'order.create',
    CUSTOMER_UPDATE: 'customer.update',
    CAMPAIGN_EXECUTION: 'campaign.execution',
    DELIVERY_RECEIPTS: 'delivery.receipts',
    CAMPAIGN_UPDATES: 'campaign.updates'
};

module.exports = {
  getProducer,
  produce,
  createConsumer,
  TOPICS
};