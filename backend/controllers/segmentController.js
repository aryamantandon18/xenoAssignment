const Segment = require('../models/AudienceSegment');
const Customer = require('../models/Customer');
const { buildMongoQueryFromRules } = require('../services/segmentService');
const ApiFeatures = require('../utils/apiFeatures');
const asyncHandler = require('express-async-handler');

// Create a new audience segment
exports.createSegment = asyncHandler(async (req, res) => {
  const { name, description, rules, logicOperator } = req.body;
  console.log("Line 10",req.body);
  // Build the query to estimate audience size
  const query = buildMongoQueryFromRules(rules, logicOperator);
  const estimatedSize = await Customer.countDocuments({
    ...query,
    // createdBy: req.user.uid
  });
  
  const segment = await Segment.create({
    name,
    description,
    rules,
    logicOperator,
    estimatedSize,
    createdBy: req.user.uid
  });

  res.status(201).json({
    status: 'success',
    data: {
      segment
    }
  });
});

// Get all segments
exports.getAllSegments = asyncHandler(async (req, res) => {
  const features = new ApiFeatures(
    Segment.find({ createdBy: req.user.uid }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const segments = await features.query;

  res.status(200).json({
    status: 'success',
    results: segments.length,
    data: {
      segments
    }
  });
});

// Get segment by ID
exports.getSegment = asyncHandler(async (req, res) => {
  const segment = await Segment.findOne({
    _id: req.params.id,
    createdBy: req.user.uid
  });

  if (!segment) {
    res.status(404);
    throw new Error('No segment found with that ID');
  }

  res.status(200).json({
    status: 'success',
    data: {
      segment
    }
  });
});

// Update segment
exports.updateSegment = asyncHandler(async (req, res) => {
  const { name, description, rules, logicOperator } = req.body;

  const segment = await Segment.findOne({
    _id: req.params.id,
    createdBy: req.user.uid
  });

  if (!segment) {
    res.status(404);
    throw new Error('No segment found with that ID');
  }

  let updateData = { name, description };
  if (rules || logicOperator) {
    const query = buildMongoQueryFromRules(
      rules || segment.rules, 
      logicOperator || segment.logicOperator
    );
    const estimatedSize = await Customer.countDocuments({
      ...query,
      // createdBy: req.user.uid
    });
    updateData = { ...updateData, rules, logicOperator, estimatedSize };
  }

  const updatedSegment = await Segment.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      segment: updatedSegment
    }
  });
});

// Delete segment
exports.deleteSegment = asyncHandler(async (req, res) => {
  const segment = await Segment.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user.uid
  });

  if (!segment) {
    res.status(404);
    throw new Error('No segment found with that ID');
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Preview segment audience
exports.previewSegment = asyncHandler(async (req, res) => {
  const { rules, logicOperator } = req.body;

  const query = buildMongoQueryFromRules(rules, logicOperator);
  const customers = await Customer.find({
    ...query,
    // createdBy: req.user.uid
  }).limit(10);

  const count = await Customer.countDocuments({
    ...query,
    // createdBy: req.user.uid
  });

  res.status(200).json({
    status: 'success',
    data: {
      count,
      customers
    }
  });
});