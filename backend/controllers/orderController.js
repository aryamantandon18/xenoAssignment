const asyncHandler = require('express-async-handler');
const { getProducer, topics } = require('../kafka/config');
const { validateOrder } = require('../validators');
const Order  = require('../models/Order')

async function createOrders(req, res) {
  const orders = req.body;

  if (!Array.isArray(orders) || orders.length === 0) {
    return res.status(400).json({ error: 'orders must be a non-empty array' });
  }

  const errors = [];
  const validOrders = [];

  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];
    const validationErrors = validateOrder(order);

    if (validationErrors) {
      errors.push({ index: i, errors: validationErrors });
      continue;
    }

    validOrders.push({
      customerId: order.customerId,
      products: order.products,
      amount: order.amount,
      status: order.status || 'PLACED',
      notes: order.notes,
      createdAt: order.createdAt ? new Date(order.createdAt) : undefined,
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      message: 'Validation failed for some orders', 
      errors 
    });
  }

  try {
    const insertedOrders = await Order.insertMany(validOrders);
    return res.status(201).json({
      message: `${insertedOrders.length} orders inserted successfully`,
      orders: insertedOrders
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
const getOrders = asyncHandler(async (req, res) => {
  const features = new ApiFeatures(
    Order.find({ createdBy: req.user.uid })
      .populate('customer', 'name email'),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const orders = await features.query;

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders
    }
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    createdBy: req.user.uid
  }).populate('customer', 'name email phone');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid order status');
  }

  const order = await Order.findOneAndUpdate(
    {
      _id: req.params.id,
      createdBy: req.user.uid
    },
    { status },
    { new: true, runValidators: true }
  );

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  });
});

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user.uid
  });

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Update customer's total spent (subtract the deleted order amount)
  await Customer.findByIdAndUpdate(order.customer, {
    $inc: { totalSpent: -order.amount }
  });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

module.exports = {
  // createBulkOrders,
  createOrders,
  getOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder
};


// const createOrders = asyncHandler(async (req, res) => {
//   const orders = req.body.orders;

//   if (!Array.isArray(orders) || orders.length === 0) {
//     res.status(400);
//     throw new Error('orders must be a non-empty array');
//   }

//   const producer = getProducer();

//   try {
//     const messages = [];

//     for (const order of orders) {
//       const errors = validateOrder(order);
//       if (errors) {
//         res.status(400);
//         throw new Error(`Validation failed for order: ${JSON.stringify(order)} — ${errors.join(', ')}`);
//       }

//       messages.push({
//         value: JSON.stringify({
//           data: {
//             ...order,
//           }
//         })
//       });
//     }

//     await producer.sendBatch([
//       {
//         topic: topics.ORDER_CREATE,
//         messages
//       }
//     ]);

//     res.status(202).json({
//       status: 'processing',
//       message: `${orders.length} orders are being processed`,
//       timestamp: new Date().toISOString()
//     });
//   } catch (err) {
//     console.error('Bulk order submission failed:', err);
//     res.status(500).json({
//       status: 'error',
//       message: err.message || 'Failed to process bulk orders'
//     });
//   } finally {
//     await producer.disconnect();
//   }
// });





