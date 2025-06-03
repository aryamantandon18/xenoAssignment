const { produce, TOPICS } = require('../kafka/config');
const Customer = require('../models/Customer');
const CommunicationLog = require('../models/CommunicationLog');
const Campaign = require('../models/Campaign');
const { evaluateCustomerAgainstSegment } = require('./segmentService');
const logger = require('../utils/logger');

// Mock vendor API with delivery receipt simulation
const sendToVendorAPI = async (customer, message, campaignId) => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const isSuccess = Math.random() < 0.9;
      const status = isSuccess ? 'SENT' : 'FAILED';
      const vendorResponse = {
        timestamp: new Date(),
        messageId: `msg_${Math.random().toString(36).substr(2, 9)}`
      };

      try {
        await produce(TOPICS.DELIVERY_RECEIPTS, {
          campaignId,
          customerId: customer._id,
          status,
          vendorResponse
        });
      } catch (err) {
        logger.error('Failed to simulate delivery receipt:', err);
      }

      resolve({ status, vendorResponse });
    }, 100);
  });
};

const sendCampaign = async (campaign, segment) => {
  try {
    // Get matching customers
    const customers = await Customer.find({});
    const targetCustomers = customers.filter(customer => {
      try {
        return evaluateCustomerAgainstSegment(customer, segment);
      } catch (e) {
        logger.error('Error evaluating customer:', e);
        return false;
      }
    });

    // Send campaign initiation event
    await produce(TOPICS.CAMPAIGN_EXECUTION, {
      type: 'INIT',
      campaignId: campaign._id,
      totalCustomers: targetCustomers.length
    });

    // Process in batches
    const batchSize = 100;
    for (let i = 0; i < targetCustomers.length; i += batchSize) {
      const batch = targetCustomers.slice(i, i + batchSize);
      
      await produce(TOPICS.CAMPAIGN_EXECUTION, {
        type: 'BATCH',
        batch: batch.map(customer => ({
          campaignId: campaign._id,
          customerId: customer._id,
          message: campaign.message.replace('{name}', customer.name)
        })),
        batchIndex: Math.floor(i / batchSize),
        totalBatches: Math.ceil(targetCustomers.length / batchSize)
      });
    }

    // Update campaign status
    await Campaign.findByIdAndUpdate(campaign._id, {
      status: 'SENDING',
      updatedAt: new Date()
    });

  } catch (error) {
    logger.error('Campaign initiation failed:', error);
    await Campaign.findByIdAndUpdate(campaign._id, {
      status: 'FAILED',
      updatedAt: new Date()
    });
    throw error;
  }
};

// Campaign message consumer
const initCampaignConsumer = async () => {
  const { createConsumer, TOPICS } = require('../kafka/config');
  const consumer = await createConsumer('campaign-service-group');
  
  await consumer.subscribe(TOPICS.CAMPAIGN_EXECUTION, async (message) => {
    try {
      const { campaignId, customerId, message: messageContent } = message;
      
      const customer = await Customer.findById(customerId);
      if (!customer) throw new Error('Customer not found');
      
      const vendorResponse = await sendToVendorAPI(customer, messageContent, campaignId);
      
      await CommunicationLog.create({
        campaign: campaignId,
        customer: customerId,
        message: messageContent,
        status: vendorResponse.status,
        vendorResponse: vendorResponse.vendorResponse
      });
      
      if (message.type === 'BATCH') {
      const processedCount = await CommunicationLog.countDocuments({
        campaign: campaignId
      });
      
      const campaign = await Campaign.findById(campaignId);
      if (processedCount >= campaign.stats.total) {
        await Campaign.findByIdAndUpdate(campaignId, {
          status: 'COMPLETED',
          updatedAt: new Date()
        });
      }
    }
    } catch (error) {
      logger.error('Failed to process campaign message:', {
        error: error.message,
        message
      });
    }
  });

  return consumer;
};

module.exports = { 
  sendCampaign,
  initCampaignConsumer
};