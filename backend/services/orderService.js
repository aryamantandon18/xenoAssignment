const { createConsumer, topics } = require('../kafka/config');
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const logger = require('../utils/logger');

// Initialize Order Consumer
const initOrderConsumer = async () => {
  const consumer = await createConsumer('order-service-group', {
    maxBytes: 1024 * 1024 * 5 // 5MB batch size
  });

  await consumer.subscribe(topics.ORDER_CREATE, async (message) => {
    const { data, metadata } = message;
    
    try {
      // Validate required fields
      if (!data.customerId || !data.products || !data.amount) {
        throw new Error('Invalid order data - missing required fields');
      }

      // Verify customer exists and belongs to requesting user
      const customer = await Customer.findOne({
        _id: data.customerId,
        createdBy: data.createdBy
      });
      
      if (!customer) {
        throw new Error(`Customer not found: ${data.customerId}`);
      }

      // Transactional processing
      const [order] = await Promise.all([
        Order.create({
          customer: data.customerId,
          products: data.products,
          amount: data.amount,
          notes: data.notes,
          status: 'PLACED',
          createdBy: data.createdBy
        }),
        Customer.findByIdAndUpdate(data.customerId, {
          $inc: { 
            totalSpent: data.amount,
            visitCount: 1 
          },
          lastOrderAt: new Date()
        }, { new: true })
      ]);

      logger.info(`Order processed successfully: ${order._id}`);
      
    } catch (error) {
      logger.error('Order processing failed:', {
        error: error.message,
        payload: data,
        metadata
      });
      // Implement retry logic or dead-letter queue here
    }
  });

  return consumer;
};

module.exports = {
  initOrderConsumer
};