const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'crm-producer',
  brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
  retry: {
    initialRetryTime: 300,
    retries: 10
  }
});

const producer = kafka.producer();

const produce = async (topic, message) => {
  try {
    await producer.connect();
    await producer.send({
      topic,
      messages: [{
        value: JSON.stringify(message),
        timestamp: Date.now()
      }],
      // acks: -1 // Wait for all replicas to acknowledge
    });
  } catch (err) {
    console.error(`Failed to produce message to ${topic}:`, err);
    throw err;
  } finally {
    await producer.disconnect();
  }
};

module.exports = { produce };