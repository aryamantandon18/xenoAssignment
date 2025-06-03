const { createConsumer, TOPICS } = require('../kafka/config');
const CommunicationLog = require('../models/CommunicationLog');
const Campaign = require('../models/Campaign');
const logger = require('../utils/logger');

// Batch processor configuration
const BATCH_INTERVAL_MS = 5000; // 5 seconds
const MAX_BATCH_SIZE = 100;

class DeliveryReceiptProcessor {
  constructor() {
    this.batch = [];
    this.timeout = null;
  }

  async addToBatch(receipt) {
    this.batch.push(receipt);
    
    if (this.batch.length >= MAX_BATCH_SIZE) {
      await this.processBatch();
    } else if (!this.timeout) {
      this.timeout = setTimeout(() => this.processBatch(), BATCH_INTERVAL_MS);
    }
  }

  async processBatch() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    if (this.batch.length === 0) return;

    const batchToProcess = [...this.batch];
    this.batch = [];
    
    try {
      // Group receipts by campaign for efficient updates
      const receiptsByCampaign = batchToProcess.reduce((acc, receipt) => {
        acc[receipt.campaignId] = acc[receipt.campaignId] || [];
        acc[receipt.campaignId].push(receipt);
        return acc;
      }, {});

      // Process each campaign's receipts
      for (const [campaignId, receipts] of Object.entries(receiptsByCampaign)) {
        await this.updateCampaignStats(campaignId, receipts);
      }

      logger.info(`Processed ${batchToProcess.length} delivery receipts`);
    } catch (error) {
      logger.error('Failed to process delivery receipt batch:', error);
    }
  }

  async updateCampaignStats(campaignId, receipts) {
    const statsUpdate = {
      sent: 0,
      failed: 0
    };

    const logUpdates = receipts.map(receipt => ({
      updateOne: {
        filter: {
          campaign: receipt.campaignId,
          customer: receipt.customerId
        },
        update: {
          $set: {
            status: receipt.status,
            vendorResponse: receipt.vendorResponse,
            updatedAt: new Date()
          }
        }
      }
    }));

    receipts.forEach(receipt => {
      if (receipt.status === 'SENT') statsUpdate.sent++;
      else statsUpdate.failed++;
    });

    // Execute all updates in a transaction
    const session = await CommunicationLog.startSession();
    try {
      await session.withTransaction(async () => {
        await CommunicationLog.bulkWrite(logUpdates, { session });
        await Campaign.findByIdAndUpdate(
          campaignId,
          {
            $inc: {
              'stats.sent': statsUpdate.sent,
              'stats.failed': statsUpdate.failed
            },
            updatedAt: new Date()
          },
          { session }
        );
      });
    } finally {
      session.endSession();
    }
  }
}

// Initialize delivery receipt consumer
const initDeliveryReceiptConsumer = async () => {
  const processor = new DeliveryReceiptProcessor();
  const { createConsumer, TOPICS } = require('../config/kafka');
  const consumer = await createConsumer('delivery-receipt-group');
  
  await consumer.subscribe(TOPICS.DELIVERY_RECEIPTS, async (message) => {
    try {
      await processor.addToBatch(message);
    } catch (error) {
      logger.error('Error processing delivery receipt:', {
        error: error.message,
        receipt: message
      });
    }
  });

  return consumer;
};

module.exports = { initDeliveryReceiptConsumer };