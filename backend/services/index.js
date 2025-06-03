const { initOrderConsumer } = require('./orderService');
const { initCustomerConsumer } = require('./customerService');
const logger = require('../utils/logger');
const { initCampaignConsumer } = require('./campaignService');
const { initDeliveryReceiptConsumer } = require('./deliveryRecieptService');

const initializeServices = async () => {
  try {
    const [orderConsumer, customerConsumer,campaignConsumer,receiptConsumer] = await Promise.all([
      initOrderConsumer(),
      initCustomerConsumer(),
      initCampaignConsumer(),
      initDeliveryReceiptConsumer()
    ]);

    // logger.info('Kafka consumers initialized successfully');

    const gracefulShutdown = async () => {
      logger.info('Shutting down consumers gracefully...');
      await Promise.all([
        orderConsumer.disconnect(),
        customerConsumer.disconnect(),
        campaignConsumer.disconnect(),
        receiptConsumer.disconnect()
      ]);
      process.exit(0);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (err) {
    logger.error('Failed to initialize services:', err);
    process.exit(1);
  }
};

module.exports = initializeServices;