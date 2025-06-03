const asyncHandler = require('express-async-handler');
const Customer = require('../models/Customer');
const { getProducer, topics } = require('../kafka/config');
const { validateCustomer } = require('../validators');

const createCustomers = asyncHandler(async (req, res) => {
  const customers = req.body;

  if (!Array.isArray(customers) || customers.length === 0) {
    res.status(400);
    throw new Error('customers must be a non-empty array');
  }

  const validCustomers = [];
  const errors = [];

  for (let i = 0; i < customers.length; i++) {
    const customer = customers[i];
    const validationErrors = validateCustomer(customer);

    if (validationErrors) {
      errors.push({ index: i, errors: validationErrors });
      continue;
    }

    const exists = await Customer.findOne({
      email: customer.email,
    }).lean();

    if (exists) {
      errors.push({ index: i, errors: ['Customer with this email already exists'] });
      continue;
    }

    // Build the insertion object including all schema fields
    validCustomers.push({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      totalSpent: typeof customer.totalSpent === 'number' ? customer.totalSpent : 0,
      lastOrderAt: customer.lastOrderAt ? new Date(customer.lastOrderAt) : undefined,
      visitCount: typeof customer.visitCount === 'number' ? customer.visitCount : 0,
      createdAt: customer.createdAt ? new Date(customer.createdAt) : new Date(),
    });
  }

  try {
    if (validCustomers.length > 0) {
      await Customer.insertMany(validCustomers);
    }

    res.status(201).json({
      status: 'success',
      inserted: validCustomers.length,
      failed: errors.length,
      errors,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Bulk customer insertion failed:', err);
    res.status(500).json({
      status: 'error',
      message: err.message || 'Failed to insert customers'
    });
  }
});


// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
const getCustomers = asyncHandler(async (req, res) => {
  // Create query with filtering, sorting, pagination
  const features = new ApiFeatures(
    Customer.find({ createdBy: req.user.uid }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const customers = await features.query;

  res.status(200).json({
    status: 'success',
    results: customers.length,
    data: {
      customers
    }
  });
});

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Private
const getCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({
    _id: req.params.id,
    createdBy: req.user.uid
  });

  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }

  res.status(200).json({
    status: 'success',
    data: {
      customer
    }
  });
});

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
const updateCustomer = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;

  // Verify customer belongs to requesting user
  const customer = await Customer.findOne({
    _id: req.params.id,
    createdBy: req.user.uid
  });

  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }

  // Check if new email is already taken by another customer
  if (email && email !== customer.email) {
    const existingCustomer = await Customer.findOne({
      email,
      createdBy: req.user.uid,
      _id: { $ne: req.params.id }
    });

    if (existingCustomer) {
      res.status(400);
      throw new Error('Email already in use by another customer');
    }
  }

  const updatedCustomer = await Customer.findByIdAndUpdate(
    req.params.id,
    { name, email, phone },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      customer: updatedCustomer
    }
  });
});

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private
const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user.uid
  });

  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

module.exports = {
  createCustomers,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer
};



// const createCustomers = asyncHandler(async (req, res) => {
//   const customers = req.body;

//   if (!Array.isArray(customers) || customers.length === 0) {
//     res.status(400);
//     throw new Error('customers must be a non-empty array');
//   }

//   const producer = await getProducer();

//   const validCustomers = [];
//   const errors = [];

//   for (let i = 0; i < customers.length; i++) {
//     const customer = customers[i];
//     const validationErrors = validateCustomer(customer);

//     if (validationErrors) {
//       errors.push({ index: i, errors: validationErrors });
//       continue;
//     }

//     const exists = await Customer.findOne({
//       email: customer.email,
//     }).lean();

//     if (exists) {
//       errors.push({ index: i, errors: ['Customer with this email already exists'] });
//       continue;
//     }

//     validCustomers.push({
//       name: customer.name,
//       email: customer.email,
//       phone: customer.phone || '',
//       totalSpent: typeof customer.totalSpent === 'number' ? customer.totalSpent : 0,
//       lastOrderAt: customer.lastOrderAt ? new Date(customer.lastOrderAt) : undefined,
//       visitCount: typeof customer.visitCount === 'number' ? customer.visitCount : 0,
//       createdAt: customer.createdAt ? new Date(customer.createdAt) : new Date(),
//     });
//   }

//   try {
//     if (validCustomers.length > 0) {
//       // console.log("Line 50 : ",validCustomers);
//       const messages = validCustomers.map(cust => ({
//       value: Buffer.from(JSON.stringify({ data: cust }))
//       }));
//       console.log('Prepared messages:', messages);
//       await producer.send({
//         topic: topics.CUSTOMER_CREATE,
//         messages
//       });
//     }

//     res.status(202).json({
//       status: 'processing',
//       processed: validCustomers.length,
//       failed: errors.length,
//       errors,
//       timestamp: new Date().toISOString()
//     });
//   } catch (err) {
//     console.error('Bulk customer submission failed:', err);
//     res.status(500).json({
//       status: 'error',
//       message: err.message || 'Failed to process customers'
//     });
//   } finally {
//     await producer.disconnect();
//   }
// });