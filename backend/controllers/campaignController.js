// controllers/campaignController.js
const Campaign = require('../models/Campaign');
const asyncHandler = require('express-async-handler');
const AudienceSegment = require('../models/AudienceSegment');
const { sendCampaign } = require('../services/campaignService');

// @desc    Create new campaign
// @route   POST /api/campaigns
// @access  Private
const createCampaign = asyncHandler(async (req, res,next) => {
  try{
      const { title, message, segmentId } = req.body;

  const segment = await AudienceSegment.findById(segmentId);
  if (!segment) {
    res.status(404);
    throw new Error('Segment not found');
  }

  const campaign = await Campaign.create({
    title,
    message,
    segment: segmentId,
    createdBy: req.user.uid,
    stats: {
      total: segment.estimatedSize
    },
    status: 'PROCESSING' // New initial status
  });

    try {
    await sendCampaign(campaign, segment);
    res.status(201).json(campaign);
  } catch (error) {
    await Campaign.findByIdAndUpdate(campaign._id, {
      status: 'FAILED',
      updatedAt: new Date()
    });
    throw error;
  }

  }catch(error){
    next(error);
  }

});

// @desc    Get all campaigns
// @route   GET /api/campaigns
// @access  Private
const getCampaigns = asyncHandler(async (req, res) => {
  const campaigns = await Campaign.find({ createdBy: req.user.uid })
    .sort('-createdAt')
    .populate('segment', 'name estimatedSize');

  if (!campaigns) {
    res.status(404);
    throw new Error('Campaign not found');
  }

  res.status(200).json(campaigns);
});

// @desc    Get single campaign
// @route   GET /api/campaigns/:id
// @access  Private
const getCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findOne({
    _id: req.params.id,
    createdBy: req.user.uid
  }).populate('segment', 'name estimatedSize');

  if (!campaign) {
    res.status(404);
    throw new Error('Campaign not found');
  }

  res.status(200).json(campaign);
});


// @desc    Update campaign
// @route   PUT /api/campaigns/:id
// @access  Private
const updateCampaign = asyncHandler(async (req, res) => {
  const { title, message, segmentId } = req.body;

  // Find campaign and verify ownership
  const campaign = await Campaign.findOne({
    _id: req.params.id,
    createdBy: req.user.uid
  });

  if (!campaign) {
    res.status(404);
    throw new Error('Campaign not found');
  }

  // Only allow updates to campaigns in DRAFT status
  if (campaign.status !== 'DRAFT') {
    res.status(400);
    throw new Error('Only draft campaigns can be modified');
  }

  // If changing segment, validate new segment
  let segment;
  if (segmentId && segmentId !== campaign.segment.toString()) {
    segment = await AudienceSegment.findById(segmentId);
    if (!segment) {
      res.status(404);
      throw new Error('Segment not found');
    }
  }

  // Update campaign fields
  campaign.title = title || campaign.title;
  campaign.message = message || campaign.message;
  
  if (segment) {
    campaign.segment = segmentId;
    campaign.stats.total = segment.estimatedSize;
  }

  campaign.updatedAt = new Date();

  const updatedCampaign = await campaign.save();

  res.status(200).json(updatedCampaign);
});

// @desc    Delete campaign
// @route   DELETE /api/campaigns/:id
// @access  Private
const deleteCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user.uid,
    status: 'DRAFT' // Only allow deletion of draft campaigns
  });

  if (!campaign) {
    res.status(404);
    throw new Error('Campaign not found or not in draft status');
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

module.exports = {
  createCampaign,
  getCampaigns,
  getCampaign,
  updateCampaign,
  deleteCampaign
};