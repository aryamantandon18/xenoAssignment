const { createConsumer, topics } = require('../kafka/config');
const Customer = require('../models/Customer');
// const logger = require('../utils/logger');

// Initialize Customer Consumer
const initCustomerConsumer = async () => {
  const consumer = await createConsumer('customer-service-group');

  await consumer.subscribe({ topic: topics.CUSTOMER_CREATE, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      let data;
      try {
        const parsed = JSON.parse(message.value.toString());
        data = parsed.data;
        console.log("Line 15 : ",data);

        // Validate
        if (!data.email || !data.name) {
          throw new Error('Name and email are required');
        }

        const exists = await Customer.findOne({ email: data.email });
        if (exists) {
          throw new Error(`Customer already exists: ${data.email}`);
        }

        console.log("Line 28 : ",data);
        const customer = await Customer.create(data);
        console.log("line 31 : ",customer._id);
        // logger.info(`Customer created successfully: ${customer._id}`);
      } catch (error) {
        console.log("Line 33 : ",error);
        // logger.error('Customer creation failed', {
        //   error: error.message,
        //   payload: data,
        // });
      }
    }
  });

  return consumer;
};

module.exports = {
  initCustomerConsumer
};